"use client";

import { createClient } from "@/lib/supabase/client";

export async function subscribeToUpdates(
  email: string
): Promise<{ error?: string }> {
  const supabase = createClient();

  const { error } = await supabase
    .from("update_subscribers")
    .insert({ email });

  if (error) {
    console.error("subscribeToUpdates:", error.message);
    return { error: "Could not save that, please try again." };
  }

  return {};
}
