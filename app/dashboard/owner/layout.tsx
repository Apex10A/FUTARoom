import { OwnerDashboardLayout } from "@/components/dashboard/owner/owner-dashboard-layout";

export default function DashboardOwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <OwnerDashboardLayout>{children}</OwnerDashboardLayout>;
}
