import { AdminLoginForm } from "@/components/admin-login-form";

export default async function AdminLoginPage() {
  return (
    <main className="admin-login-shell">
      <section className="admin-login-card">
        <div className="section-kicker">Protected Admin</div>
        <h1 className="admin-title">Haley Wright &amp; Co. dashboard</h1>
        <p className="muted">
          Sign in to edit landing page copy, reorder photo collections, upload
          new images, and remove old ones.
        </p>
        <AdminLoginForm />
      </section>
    </main>
  );
}
