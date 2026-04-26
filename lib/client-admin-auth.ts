"use client";

const ADMIN_PASSWORD = "dream";
const ADMIN_SESSION_KEY = "hw-admin-unlocked";

export function tryClientAdminLogin(password: string) {
  if (password !== ADMIN_PASSWORD) {
    return false;
  }

  window.localStorage.setItem(ADMIN_SESSION_KEY, "true");
  return true;
}

export function isClientAdminAuthenticated() {
  return window.localStorage.getItem(ADMIN_SESSION_KEY) === "true";
}

export function clearClientAdminSession() {
  window.localStorage.removeItem(ADMIN_SESSION_KEY);
}
