import type {
  CreateListingFormData,
  CreateListingStep,
} from "@/lib/validations/listing-form";

const DRAFT_KEY = "futaroom:create-listing-draft";

export type CreateListingMediaHint = {
  photoCount: number;
  videoName?: string;
};

export type CreateListingDraft = {
  form: CreateListingFormData;
  step: CreateListingStep;
  mediaHint?: CreateListingMediaHint;
  savedAt: string;
};

const EMPTY_FORM: CreateListingFormData = {
  listingMode: "new",
  existingPropertyGroupId: "",
  title: "",
  areaId: "",
  roomTypeId: "",
  pricePerYear: "",
  distanceToGate: "",
  description: "",
  amenities: [],
};

const VALID_STEPS: CreateListingStep[] = [
  "type",
  "basics",
  "details",
  "media",
  "review",
];

function isValidStep(value: unknown): value is CreateListingStep {
  return (
    typeof value === "string" &&
    VALID_STEPS.includes(value as CreateListingStep)
  );
}

function sanitizeForm(value: unknown): CreateListingFormData {
  if (!value || typeof value !== "object") {
    return EMPTY_FORM;
  }

  const draft = value as Partial<CreateListingFormData>;

  return {
    listingMode: draft.listingMode === "existing" ? "existing" : "new",
    existingPropertyGroupId:
      typeof draft.existingPropertyGroupId === "string"
        ? draft.existingPropertyGroupId
        : "",
    title: typeof draft.title === "string" ? draft.title : "",
    areaId: typeof draft.areaId === "string" ? draft.areaId : "",
    roomTypeId: typeof draft.roomTypeId === "string" ? draft.roomTypeId : "",
    pricePerYear:
      typeof draft.pricePerYear === "string" ? draft.pricePerYear : "",
    distanceToGate:
      typeof draft.distanceToGate === "string" ? draft.distanceToGate : "",
    description:
      typeof draft.description === "string" ? draft.description : "",
    amenities: Array.isArray(draft.amenities)
      ? draft.amenities.filter((item): item is string => typeof item === "string")
      : [],
  };
}

export function loadCreateListingDraft(): CreateListingDraft | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<CreateListingDraft>;

    return {
      form: sanitizeForm(parsed.form),
      step: isValidStep(parsed.step) ? parsed.step : "type",
      mediaHint:
        parsed.mediaHint &&
        typeof parsed.mediaHint === "object" &&
        typeof parsed.mediaHint.photoCount === "number"
          ? {
              photoCount: parsed.mediaHint.photoCount,
              videoName:
                typeof parsed.mediaHint.videoName === "string"
                  ? parsed.mediaHint.videoName
                  : undefined,
            }
          : undefined,
      savedAt: typeof parsed.savedAt === "string" ? parsed.savedAt : "",
    };
  } catch {
    return null;
  }
}

export function saveCreateListingDraft(draft: CreateListingDraft): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

export function clearCreateListingDraft(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(DRAFT_KEY);
}

export { EMPTY_FORM as CREATE_LISTING_EMPTY_FORM };
