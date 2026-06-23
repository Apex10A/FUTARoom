import type { Metadata } from "next";

import { CreateListingForm } from "@/components/dashboard/owner/create-listing-form";

export const metadata: Metadata = {
  title: "Add listing",
  description: "Add a new property listing on FUTARoom.",
};

export default function NewOwnerListingPage() {
  return <CreateListingForm />;
}
