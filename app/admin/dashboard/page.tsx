import { AdminDashboardEntry } from "@/components/admin-dashboard-entry";
import { fallbackProducts } from "@/lib/fallback-products";
import { defaultSiteContent } from "@/lib/site-content";

export default async function AdminDashboardPage() {
  return (
    <AdminDashboardEntry
      initialContent={defaultSiteContent}
      initialProducts={fallbackProducts}
    />
  );
}
