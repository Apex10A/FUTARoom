"use client";

import { usePathname } from "next/navigation";

import { OwnerDashboardShell } from "@/components/dashboard/owner/owner-dashboard-shell";

export function OwnerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isCreateFlow = pathname === "/dashboard/owner/listings/new";

  if (isCreateFlow) {
    return <>{children}</>;
  }

  return (
    <OwnerDashboardShell currentPath={pathname}>{children}</OwnerDashboardShell>
  );
}
