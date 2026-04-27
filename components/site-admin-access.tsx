"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAdminMode } from "@/components/admin-mode-provider";

export function SiteAdminAccess() {
  const pathname = usePathname();
  const { enabled, unlock, lock } = useAdminMode();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  if (pathname.startsWith("/admin")) {
    return null;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);

    if (!unlock(password)) {
      setPending(false);
      setError("Incorrect password.");
      return;
    }

    setPending(false);
    setOpen(false);
    setPassword("");
  }

  return (
    <>
      <button
        type="button"
        className="site-admin-fab"
        aria-label={enabled ? "Exit edit mode" : "Open admin login"}
        onClick={() => {
          if (enabled) {
            lock();
            return;
          }

          setOpen(true);
          setError("");
        }}
      >
        <span className="site-admin-fab__star" aria-hidden="true">
          ★
        </span>
      </button>

      {open ? (
        <div className="site-admin-modal" role="dialog" aria-modal="true">
          <button
            type="button"
            className="site-admin-modal__backdrop"
            aria-label="Close admin login"
            onClick={() => setOpen(false)}
          />

          <div className="site-admin-modal__card">
            <div className="section-kicker">Admin Access</div>
            <h2 className="admin-title">Enter edit mode</h2>
            <p className="muted">
              Enter the admin password to edit the live page directly.
            </p>

            <form className="admin-login-form" onSubmit={handleSubmit}>
              <label className="admin-field">
                <span>Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  autoFocus
                  required
                />
              </label>

              {error ? <p className="admin-error">{error}</p> : null}

              <div className="site-admin-modal__actions">
                <Link className="button-secondary" href="/admin/dashboard">
                  Manage Photos
                </Link>
                <button
                  type="button"
                  className="button-secondary"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
                <button className="button" type="submit" disabled={pending}>
                  {pending ? "Opening..." : "Enter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
