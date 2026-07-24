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
  /** Free-text fallback for lodges that aren't well mapped on OSM. */
  nearestLandmark: string;
  description: string;
  amenities: string[];
  /** Owner-pinned coordinates for a new lodge, set on the "location" step. */
  latitude: number | null;
  longitude: number | null;
};

export type CreateListingStep =
  | "type"
  | "basics"
  | "location"
  | "details"
  | "media"
  | "review";

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

export function validateLocationStep(
  data: CreateListingFormData
): { location?: string } {
  if (data.latitude == null || data.longitude == null) {
    return { location: "Pin the lodge's location on the map before continuing." };
  }
  return {};
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

export function validateMediaStep(
  photoCount: number,
  hasVideo: boolean,
  listingMode: CreateListingFormData["listingMode"] = "new"
): { media?: string } {
  if (listingMode === "existing") {
    return {};
  }

  if (photoCount === 0 && !hasVideo) {
    return { media: "Add at least one photo or a lodge video." };
  }
  return {};
}

/** @deprecated Use validateMediaStep */
export function validatePhotosStep(
  photoCount: number,
  listingMode: CreateListingFormData["listingMode"] = "new"
): { photos?: string } {
  const result = validateMediaStep(photoCount, false, listingMode);
  return result.media ? { photos: result.media } : {};
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
    nearestLandmark: data.nearestLandmark || "Not specified",
    description: data.description,
    amenities: data.amenities,
  };
}
