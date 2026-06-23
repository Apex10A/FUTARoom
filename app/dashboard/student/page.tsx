import type { Metadata } from "next";

import { StudentFavoritesView } from "@/components/dashboard/student/student-favorites-view";

export const metadata: Metadata = {
  title: "Saved listings",
  description: "Your saved accommodation listings on FUTARoom.",
};

export default function StudentDashboardPage() {
  return <StudentFavoritesView />;
}
