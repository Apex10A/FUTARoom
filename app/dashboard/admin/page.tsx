import type { Metadata } from "next";

import { AdminModerationQueue } from "@/components/dashboard/admin/admin-moderation-queue";

export const metadata: Metadata = {
  title: "Admin moderation",
  description: "Review and moderate FUTARoom listings.",
};

export default function AdminDashboardPage() {
  return <AdminModerationQueue />;
}
