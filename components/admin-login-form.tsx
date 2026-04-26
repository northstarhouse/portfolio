"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ password })
    });

    if (!response.ok) {
      setPending(false);
      setError("Password was not accepted.");
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <form className="admin-login-form" onSubmit={handleSubmit}>
      <label className="admin-field">
        <span>Admin password</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter dashboard password"
          autoComplete="current-password"
          required
        />
      </label>

      {error ? <p className="admin-error">{error}</p> : null}

      <button className="button" type="submit" disabled={pending}>
        {pending ? "Signing in..." : "Open Dashboard"}
      </button>
    </form>
  );
}
