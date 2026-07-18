"use client";

import { getAreaLabel } from "@/lib/constants/areas";
import {
  LISTING_VIDEO_PLACEHOLDER,
} from "@/lib/constants/listing-media";
import { createClient } from "@/lib/supabase/client";
import { uploadListingVideo } from "@/lib/listings/upload-listing-video";
import type { CreateListingFormData } from "@/lib/validations/listing-form";
import { getRoomTypeLabelForForm } from "@/lib/validations/listing-form";

function getPhotoExtension(file: File): string {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && ["jpg", "jpeg", "png", "webp", "gif"].includes(fromName)) {
    return fromName === "jpeg" ? "jpg" : fromName;
  }

  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  if (file.type === "image/gif") return "gif";
  return "jpg";
}

async function uploadListingPhotos(
  userId: string,
  photos: File[]
): Promise<{ urls?: string[]; error?: string }> {
  const supabase = createClient();
  const urls: string[] = [];

  for (const photo of photos) {
    const extension = getPhotoExtension(photo);
    const path = `${userId}/${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("listing-images")
      .upload(path, photo, {
        contentType: photo.type || `image/${extension}`,
        upsert: false,
      });

    if (uploadError) {
      return { error: `Photo upload failed: ${uploadError.message}` };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("listing-images").getPublicUrl(path);

    urls.push(publicUrl);
  }

  return { urls };
}

export async function createOwnerListing({
  form,
  photos,
  video,
  fallbackImageUrl,
  onVideoUploadProgress,
}: {
  form: CreateListingFormData;
  photos: File[];
  video?: File | null;
  fallbackImageUrl?: string;
  onVideoUploadProgress?: (percent: number) => void;
}): Promise<{ listingId?: string; error?: string }> {
  const isExistingOffer = form.listingMode === "existing";

  if (!isExistingOffer && photos.length === 0 && !video) {
    return { error: "Add at least one photo or a lodge video." };
  }

  const supabase = createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Sign in as an owner to publish a listing." };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    return { error: profileError.message };
  }

  if (profile?.role !== "owner") {
    return { error: "Only owner accounts can create listings." };
  }

  let imageUrls: string[] = [];
  let videoUrl: string | null = null;

  if (photos.length > 0) {
    const { urls, error: uploadError } = await uploadListingPhotos(
      user.id,
      photos
    );
    if (uploadError || !urls?.length) {
      return { error: uploadError ?? "Photo upload failed." };
    }
    imageUrls = urls;
  }

  if (video) {
    const { url, error: uploadError } = await uploadListingVideo(
      user.id,
      video,
      onVideoUploadProgress
    );
    if (uploadError || !url) {
      return { error: uploadError ?? "Video upload failed." };
    }
    videoUrl = url;
  }

  let primaryImageUrl: string;

  if (imageUrls.length > 0) {
    primaryImageUrl = imageUrls[0];
  } else if (fallbackImageUrl) {
    primaryImageUrl = fallbackImageUrl;
  } else if (videoUrl) {
    primaryImageUrl = LISTING_VIDEO_PLACEHOLDER;
  } else {
    return {
      error: "Add a photo or video, or link to an existing lodge with photos.",
    };
  }

  const areaLabel = getAreaLabel(form.areaId) ?? form.areaId;
  const roomTypeLabel = getRoomTypeLabelForForm(form.roomTypeId);
  const propertyGroupId =
    isExistingOffer && form.existingPropertyGroupId
      ? form.existingPropertyGroupId
      : null;

  const { data: listing, error: insertError } = await supabase
    .from("listings")
    .insert({
      owner_id: user.id,
      title: form.title.trim(),
      description: form.description.trim(),
      area_id: form.areaId,
      area_label: areaLabel,
      room_type_id: form.roomTypeId,
      room_type_label: roomTypeLabel,
      price_per_year: Number(form.pricePerYear),
      distance_to_gate: form.distanceToGate.trim() || null,
      amenities: form.amenities,
      status: "pending",
      verified: false,
      image_url: primaryImageUrl,
      video_url: videoUrl,
      property_group_id: propertyGroupId,
    })
    .select("id")
    .single();

  if (insertError || !listing) {
    return { error: insertError?.message ?? "Could not save listing." };
  }

  if (!propertyGroupId) {
    const { error: groupError } = await supabase
      .from("listings")
      .update({ property_group_id: listing.id })
      .eq("id", listing.id);

    if (groupError) {
      return { error: groupError.message };
    }
  }

  if (imageUrls.length > 0) {
    const { error: imagesError } = await supabase.from("listing_images").insert(
      imageUrls.map((url, index) => ({
        listing_id: listing.id,
        url,
        sort_order: index,
      }))
    );

    if (imagesError) {
      return { error: imagesError.message };
    }
  }

  return { listingId: listing.id };
}
