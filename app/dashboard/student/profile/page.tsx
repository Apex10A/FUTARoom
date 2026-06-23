import type { Metadata } from "next";

import { StudentProfileForm } from "@/components/dashboard/student/student-profile-form";

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage your FUTARoom student profile.",
};

export default function StudentProfilePage() {
  return <StudentProfileForm />;
}
