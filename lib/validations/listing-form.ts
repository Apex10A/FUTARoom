import { getAreaLabel } from "@/lib/constants/areas";
import { LISTABLE_ROOM_TYPES } from "@/lib/constants/amenities";

export type CreateListingFormData = {
  listingMode: "new" | "existing";
  existingPropertyGroupId: string;
  title: string;
  areaId: string;
  roomTypeId: string;
  pricePerYear: string;
  distanceToGate: string;
  description: string;
  amenities: string[];
};

export type CreateListingStep = "basics" | "details" | "photos" | "review";

export function validateBasicsStep(
  data: CreateListingFormData
): Partial<
  Record<
    "title" | "areaId" | "roomTypeId" | "pricePerYear" | "existingPropertyGroupId",
    string
  >
> {
  const errors: Partial<
    Record<
      "title" | "areaId" | "roomTypeId" | "pricePerYear" | "existingPropertyGroupId",
      string
    >
  > = {};

  if (data.listingMode === "existing") {
    if (!data.existingPropertyGroupId) {
      errors.existingPropertyGroupId = "Select the lodge you are listing an offer for.";
    }
  } else if (!data.title.trim()) {
    errors.title = "Property name is required.";
  }

  if (!data.areaId) {
    errors.areaId = "Select an area.";
  }

  if (!data.roomTypeId) {
    errors.roomTypeId = "Select a room type.";
  }

  const price = Number(data.pricePerYear);
  if (!data.pricePerYear.trim()) {
    errors.pricePerYear = "Price is required.";
  } else if (Number.isNaN(price) || price < 10000) {
    errors.pricePerYear = "Enter a valid yearly price (min ₦10,000).";
  }

  return errors;
}

export function validateDetailsStep(
  data: CreateListingFormData
): Partial<Record<"description" | "amenities", string>> {
  const errors: Partial<Record<"description" | "amenities", string>> = {};

  if (!data.description.trim()) {
    errors.description = "Add a short description for students.";
  } else if (data.description.trim().length < 40) {
    errors.description = "Description should be at least 40 characters.";
  }

  if (data.amenities.length === 0) {
    errors.amenities = "Select at least one amenity.";
  }

  return errors;
}

export function validatePhotosStep(
  photoCount: number,
  listingMode: CreateListingFormData["listingMode"] = "new"
): { photos?: string } {
  if (listingMode === "existing") {
    return {};
  }

  if (photoCount === 0) {
    return { photos: "Add at least one photo." };
  }
  return {};
}

export function getRoomTypeLabelForForm(id: string): string {
  return LISTABLE_ROOM_TYPES.find((type) => type.id === id)?.label ?? id;
}

export function summarizeListing(data: CreateListingFormData) {
  return {
    listingMode: data.listingMode,
    title: data.title,
    area: getAreaLabel(data.areaId) ?? data.areaId,
    roomType: getRoomTypeLabelForForm(data.roomTypeId),
    pricePerYear: Number(data.pricePerYear),
    distanceToGate: data.distanceToGate || "Not specified",
    description: data.description,
    amenities: data.amenities,
  };
}
