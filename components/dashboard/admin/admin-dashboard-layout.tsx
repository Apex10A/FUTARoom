"use client";

import { usePathname } from "next/navigation";

import { AdminDashboardShell } from "@/components/dashboard/admin/admin-dashboard-shell";

export function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <AdminDashboardShell currentPath={pathname}>{children}</AdminDashboardShell>
  );
}
