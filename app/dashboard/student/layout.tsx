import { StudentDashboardLayout } from "@/components/dashboard/student/student-dashboard-layout";

export default function DashboardStudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StudentDashboardLayout>{children}</StudentDashboardLayout>;
}
