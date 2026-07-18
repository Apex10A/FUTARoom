import type { Metadata } from "next";

import { CreateListingFormClient } from "@/components/dashboard/owner/create-listing-form-client";

export const metadata: Metadata = {
  title: "Add listing",
  description: "Add a new property listing on FUTARoom.",
};

export default function NewOwnerListingPage() {
  return <CreateListingFormClient />;
}
