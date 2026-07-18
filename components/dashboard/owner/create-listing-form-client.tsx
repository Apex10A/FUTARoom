"use client";

import dynamic from "next/dynamic";

export const CreateListingFormClient = dynamic(
  () =>
    import("@/components/dashboard/owner/create-listing-form").then(
      (mod) => mod.CreateListingForm
    ),
  { ssr: false }
);
