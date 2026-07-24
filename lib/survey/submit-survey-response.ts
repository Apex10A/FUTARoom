"use client";

import { createClient } from "@/lib/supabase/client";
import type { SurveyResponseInput } from "@/lib/types/survey";

export async function submitSurveyResponse(
  input: SurveyResponseInput
): Promise<{ error?: string }> {
  const supabase = createClient();

  const { error } = await supabase.from("survey_responses").insert({
    current_method: input.currentMethod,
    current_method_other: input.currentMethodOther.trim() || null,
    biggest_frustration: input.biggestFrustration.trim(),
    priority_ranking: input.priorityRanking,
    was_scammed: input.wasScammed,
    was_scammed_details: input.wasScammedDetails.trim() || null,
    trusts_verified_listings: input.trustsVerifiedListings,
    wants_roommate_split: input.wantsRoommateSplit,
    willing_to_pay_deposit: input.willingToPayDeposit,
    would_switch: input.wouldSwitch,
    would_switch_reason: input.wouldSwitchReason.trim() || null,
  });

  if (error) {
    console.error("submitSurveyResponse:", error.message);
    return { error: "Could not submit your response. Please try again." };
  }

  return {};
}
