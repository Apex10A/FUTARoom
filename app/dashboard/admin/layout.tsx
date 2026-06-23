import { AdminDashboardLayout } from "@/components/dashboard/admin/admin-dashboard-layout";

export default function DashboardAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminDashboardLayout>{children}</AdminDashboardLayout>;
}
