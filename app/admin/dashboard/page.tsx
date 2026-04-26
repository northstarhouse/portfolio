import { AdminDashboard } from "@/components/admin-dashboard";
import { getAdminProducts, getSiteContent, hasAdminWriteAccess } from "@/lib/admin-data";
import { requireAdminSession } from "@/lib/admin-auth";

export default async function AdminDashboardPage() {
  await requireAdminSession();

  const [content, products] = await Promise.all([
    getSiteContent(),
    getAdminProducts()
  ]);

  return (
    <main className="admin-page-shell">
      <AdminDashboard
        initialContent={content}
        initialProducts={products}
        hasWriteAccess={hasAdminWriteAccess()}
      />
    </main>
  );
}
