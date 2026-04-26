import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac, timingSafeEqual } from "node:crypto";

const ADMIN_COOKIE_NAME = "hw_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 14;

function getAdminPassword() {
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    throw new Error("Missing ADMIN_PASSWORD");
  }

  return password;
}

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret) {
    throw new Error("Missing ADMIN_SESSION_SECRET");
  }

  return secret;
}

function toBase64Url(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function signPayload(payload: string) {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("base64url");
}

export function verifyPassword(password: string) {
  const expected = Buffer.from(getAdminPassword());
  const received = Buffer.from(password);

  if (expected.length !== received.length) {
    return false;
  }

  return timingSafeEqual(expected, received);
}

export function createAdminSessionValue() {
  const payload = toBase64Url(
    JSON.stringify({
      issuedAt: Date.now()
    })
  );

  return `${payload}.${signPayload(payload)}`;
}

export function verifyAdminSessionValue(value?: string) {
  if (!value) {
    return false;
  }

  const [payload, signature] = value.split(".");

  if (!payload || !signature) {
    return false;
  }

  const expectedSignature = signPayload(payload);
  const expected = Buffer.from(expectedSignature);
  const received = Buffer.from(signature);

  if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
    return false;
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      issuedAt?: number;
    };

    if (!parsed.issuedAt) {
      return false;
    }

    return Date.now() - parsed.issuedAt < SESSION_MAX_AGE_SECONDS * 1000;
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return verifyAdminSessionValue(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
}

export async function requireAdminSession() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin");
  }
}

export function getAdminCookieName() {
  return ADMIN_COOKIE_NAME;
}

export function getAdminSessionMaxAgeSeconds() {
  return SESSION_MAX_AGE_SECONDS;
}
