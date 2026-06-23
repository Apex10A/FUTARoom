"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { OwnerDashboardShell } from "@/components/dashboard/owner/owner-dashboard-shell";

export function OwnerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <OwnerDashboardShell currentPath={pathname}>{children}</OwnerDashboardShell>
  );
}
