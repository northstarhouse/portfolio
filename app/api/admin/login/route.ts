import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  createAdminSessionValue,
  getAdminCookieName,
  getAdminSessionMaxAgeSeconds,
  verifyPassword
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  const { password } = (await request.json()) as { password?: string };

  if (!password || !verifyPassword(password)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(getAdminCookieName(), createAdminSessionValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: getAdminSessionMaxAgeSeconds()
  });

  return NextResponse.json({ ok: true });
}
