"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminDashboard } from "@/components/admin-dashboard";
import { clearClientAdminSession, isClientAdminAuthenticated } from "@/lib/client-admin-auth";
import { fetchBrowserProducts, fetchBrowserSiteContent } from "@/lib/supabase-browser";
import { Product, SiteContent } from "@/lib/types";

type AdminDashboardEntryProps = {
  initialContent: SiteContent;
  initialProducts: Product[];
};

export function AdminDashboardEntry({
  initialContent,
  initialProducts
}: AdminDashboardEntryProps) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [content, setContent] = useState(initialContent);
  const [products, setProducts] = useState(initialProducts);

  useEffect(() => {
    const loggedIn = isClientAdminAuthenticated();
    setAuthenticated(loggedIn);
    setReady(true);

    if (!loggedIn) {
      router.replace("/admin");
      return;
    }

    Promise.all([fetchBrowserSiteContent(), fetchBrowserProducts(true)]).then(
      ([nextContent, nextProducts]) => {
        setContent(nextContent);
        setProducts(nextProducts);
      }
    );
  }, [router]);

  if (!ready) {
    return <main className="admin-page-shell" />;
  }

  if (!authenticated) {
    return null;
  }

  return (
    <main className="admin-page-shell">
      <AdminDashboard
        initialContent={content}
        initialProducts={products}
        onLogout={() => {
          clearClientAdminSession();
          router.replace("/admin");
        }}
      />
    </main>
  );
}
