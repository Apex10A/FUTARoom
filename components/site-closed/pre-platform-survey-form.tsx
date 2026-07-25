"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { ChoicePills } from "@/components/site-closed/choice-pills";
import { PriorityRanker } from "@/components/site-closed/priority-ranker";
import { submitSurveyResponse } from "@/lib/survey/submit-survey-response";
import type {
  CurrentMethod,
  PriorityItem,
  SurveyResponseInput,
  TrustLevel,
  YesNo,
  YesNoMaybe,
} from "@/lib/types/survey";

const LABEL_CLASS =
  "block text-[15px] font-medium leading-snug text-[#2c2b28] sm:text-base";
const HINT_CLASS = "text-xs text-[#444441]/60 sm:text-sm";
const TEXTAREA_CLASS =
  "flex min-h-[80px] w-full rounded-lg border border-[#444441]/20 bg-white px-3 py-2.5 text-base text-[#2c2b28] outline-none transition-colors placeholder:text-[#444441]/40 focus-visible:border-[#0F6E56] focus-visible:ring-3 focus-visible:ring-[#0F6E56]/20 md:text-sm";
const QUESTION_CLASS = "space-y-2.5 sm:space-y-3";

const CURRENT_METHOD_OPTIONS: { value: CurrentMethod; label: string }[] = [
  { value: "word_of_mouth", label: "Word of mouth" },
  { value: "agent", label: "An agent" },
  { value: "notice_board", label: "Notice board" },
  { value: "social_media", label: "Social media" },
  { value: "other", label: "Other" },
];

const YES_NO_OPTIONS: { value: YesNo; label: string }[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

const TRUST_OPTIONS: { value: TrustLevel; label: string }[] = [
  { value: "yes", label: "Yes" },
  { value: "somewhat", label: "Somewhat" },
  { value: "no", label: "No" },
];

const YES_NO_MAYBE_OPTIONS: { value: YesNoMaybe; label: string }[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "maybe", label: "Maybe" },
];

const EMPTY_INPUT: SurveyResponseInput = {
  currentMethod: null,
  currentMethodOther: "",
  biggestFrustration: "",
  priorityRanking: [],
  wasScammed: null,
  wasScammedDetails: "",
  trustsVerifiedListings: null,
  wantsRoommateSplit: null,
  willingToPayDeposit: null,
  wouldSwitch: null,
  wouldSwitchReason: "",
};

function validate(input: SurveyResponseInput): string | null {
  if (!input.currentMethod) return "Let us know how you currently search.";
  if (input.currentMethod === "other" && !input.currentMethodOther.trim()) {
    return "Tell us what \"other\" means for you.";
  }
  if (!input.biggestFrustration.trim()) {
    return "Share your biggest frustration — even one line helps.";
  }
  if (input.priorityRanking.length < 5) {
    return "Finish ranking all 5 factors by importance.";
  }
  if (!input.wasScammed) return "Let us know if you've been scammed before.";
  if (!input.trustsVerifiedListings) {
    return "Let us know if verification would make you trust a listing more.";
  }
  if (!input.wantsRoommateSplit) {
    return "Let us know about the roommate-split idea.";
  }
  if (!input.willingToPayDeposit) {
    return "Let us know about paying a deposit to hold a room.";
  }
  if (!input.wouldSwitch) return "Let us know if you'd actually switch.";
  return null;
}

export function PrePlatformSurveyForm() {
  const [input, setInput] = useState<SurveyResponseInput>(EMPTY_INPUT);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function update<K extends keyof SurveyResponseInput>(
    key: K,
    value: SurveyResponseInput[K]
  ) {
    setInput((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const validationError = validate(input);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setSubmitting(true);
    const result = await submitSurveyResponse(input);
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-[#1D9E75]/30 bg-[#1D9E75]/10 px-5 py-10 text-center sm:px-6 sm:py-12">
        <CheckCircle2 className="size-9 text-[#1D9E75] sm:size-10" />
        <h3 className="text-lg font-semibold text-[#04342C] sm:text-xl">
          Thanks — that's genuinely useful.
        </h3>
        <p className="max-w-md text-sm text-[#444441]/70">
          Your response helps decide what FUTARoom actually builds next.
          Watch this space for updates.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
      <div className={QUESTION_CLASS}>
        <label className={LABEL_CLASS}>
          1. How do you currently find off-campus accommodation?
        </label>
        <ChoicePills
          options={CURRENT_METHOD_OPTIONS}
          value={input.currentMethod}
          onChange={(value) => update("currentMethod", value)}
        />
        {input.currentMethod === "other" && (
          <textarea
            value={input.currentMethodOther}
            onChange={(e) => update("currentMethodOther", e.target.value)}
            placeholder="What's your method?"
            className={cn(TEXTAREA_CLASS, "min-h-[60px]")}
            rows={2}
          />
        )}
      </div>

      <div className={QUESTION_CLASS}>
        <label className={LABEL_CLASS}>
          2. What's the most frustrating part of finding a lodge?
        </label>
        <textarea
          value={input.biggestFrustration}
          onChange={(e) => update("biggestFrustration", e.target.value)}
          placeholder="Be as specific as you like..."
          className={TEXTAREA_CLASS}
          rows={3}
        />
      </div>

      <div className={QUESTION_CLASS}>
        <label className={LABEL_CLASS}>
          3. Rank these by importance when choosing a lodge
        </label>
        <PriorityRanker
          ranking={input.priorityRanking}
          onChange={(ranking: PriorityItem[]) =>
            update("priorityRanking", ranking)
          }
        />
      </div>

      <div className={QUESTION_CLASS}>
        <label className={LABEL_CLASS}>
          4. Have you ever been misled or scammed by an agent or listing?
        </label>
        <ChoicePills
          options={YES_NO_OPTIONS}
          value={input.wasScammed}
          onChange={(value) => update("wasScammed", value)}
        />
        {input.wasScammed === "yes" && (
          <textarea
            value={input.wasScammedDetails}
            onChange={(e) => update("wasScammedDetails", e.target.value)}
            placeholder="What happened? (optional)"
            className={cn(TEXTAREA_CLASS, "min-h-[60px]")}
            rows={2}
          />
        )}
      </div>

      <div className={QUESTION_CLASS}>
        <label className={LABEL_CLASS}>
          5. Would you trust a listing more if it had real photos/video and
          admin verification, versus just an agent's description?
        </label>
        <ChoicePills
          options={TRUST_OPTIONS}
          value={input.trustsVerifiedListings}
          onChange={(value) => update("trustsVerifiedListings", value)}
        />
      </div>

      <div className={QUESTION_CLASS}>
        <label className={LABEL_CLASS}>
          6. Would you use a feature to find a roommate and split lodge cost?
        </label>
        <ChoicePills
          options={YES_NO_MAYBE_OPTIONS}
          value={input.wantsRoommateSplit}
          onChange={(value) => update("wantsRoommateSplit", value)}
        />
      </div>

      <div className={QUESTION_CLASS}>
        <label className={LABEL_CLASS}>
          7. Would you pay a small deposit online to reserve a viewing or
          hold a room, if the listing was verified?
        </label>
        <ChoicePills
          options={YES_NO_MAYBE_OPTIONS}
          value={input.willingToPayDeposit}
          onChange={(value) => update("willingToPayDeposit", value)}
        />
      </div>

      <div className={QUESTION_CLASS}>
        <label className={LABEL_CLASS}>
          8. Would you actually switch to a platform like this instead of
          your current method?
        </label>
        <ChoicePills
          options={YES_NO_MAYBE_OPTIONS}
          value={input.wouldSwitch}
          onChange={(value) => update("wouldSwitch", value)}
        />
        <textarea
          value={input.wouldSwitchReason}
          onChange={(e) => update("wouldSwitchReason", e.target.value)}
          placeholder="Why, or why not? (optional)"
          className={cn(TEXTAREA_CLASS, "min-h-[60px]")}
          rows={2}
        />
        <p className={HINT_CLASS}>
          This one tells us whether the whole idea actually holds up.
        </p>
      </div>

      {error && (
        <p className="rounded-lg border border-[#E24B4A]/30 bg-[#E24B4A]/10 px-4 py-3 text-sm text-[#E24B4A]">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#EF9F27] px-5 py-3.5 text-sm font-semibold text-[#04342C] transition-colors hover:bg-[#EF9F27]/90 disabled:opacity-60 sm:w-auto sm:py-3"
      >
        {submitting && <Loader2 className="size-4 animate-spin" />}
        {submitting ? "Submitting..." : "Submit response"}
      </button>
    </form>
  );
}
