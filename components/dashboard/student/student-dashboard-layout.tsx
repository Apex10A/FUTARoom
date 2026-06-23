"use client";

import { usePathname } from "next/navigation";

import { StudentDashboardShell } from "@/components/dashboard/student/student-dashboard-shell";

export function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <StudentDashboardShell currentPath={pathname}>{children}</StudentDashboardShell>
  );
}
