"use client";

import * as tus from "tus-js-client";

import { LISTING_VIDEO_MAX_BYTES } from "@/lib/constants/listing-media";
import { createClient } from "@/lib/supabase/client";
import { getSupabaseUrl } from "@/lib/supabase/env";

const LISTING_MEDIA_BUCKET = "listing-images";
const TUS_CHUNK_BYTES = 6 * 1024 * 1024;

function getVideoExtension(file: File): string {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && ["mp4", "mov", "webm"].includes(fromName)) {
    return fromName;
  }

  if (file.type === "video/quicktime") return "mov";
  if (file.type === "video/webm") return "webm";
  return "mp4";
}

function formatUploadError(error: unknown): string {
  const message =
    error instanceof Error ? error.message : "Video upload failed.";

  if (message.toLowerCase().includes("failed to fetch")) {
    return (
      "Video upload failed (network). Check your connection and Supabase Storage settings: allow MP4/MOV videos and set file size limit to 50 MB or higher."
    );
  }

  if (message.includes("tus:") || message.includes("chunk at offset")) {
    return (
      "Video upload failed during transfer. Try a shorter clip, compress the video under 15 MB, or upload on a stable connection. You can also add photos only and skip the video for now."
    );
  }

  return `Video upload failed: ${message}`;
}

async function uploadVideoStandard(
  path: string,
  video: File,
  extension: string,
  onProgress?: (percent: number) => void
): Promise<{ error?: string }> {
  onProgress?.(5);
  const supabase = createClient();
  const { error: uploadError } = await supabase.storage
    .from(LISTING_MEDIA_BUCKET)
    .upload(path, video, {
      contentType: video.type || `video/${extension}`,
      upsert: false,
    });

  if (uploadError) {
    return { error: formatUploadError(uploadError) };
  }

  onProgress?.(100);
  return {};
}

async function uploadVideoSigned(
  path: string,
  video: File,
  extension: string,
  onProgress?: (percent: number) => void
): Promise<{ error?: string }> {
  const supabase = createClient();
  onProgress?.(5);

  const { data, error } = await supabase.storage
    .from(LISTING_MEDIA_BUCKET)
    .createSignedUploadUrl(path);

  if (error || !data?.token) {
    return { error: formatUploadError(error) };
  }

  onProgress?.(15);

  const { error: uploadError } = await supabase.storage
    .from(LISTING_MEDIA_BUCKET)
    .uploadToSignedUrl(path, data.token, video, {
      contentType: video.type || `video/${extension}`,
    });

  if (uploadError) {
    return { error: formatUploadError(uploadError) };
  }

  onProgress?.(100);
  return {};
}

async function uploadVideoResumable(
  video: File,
  path: string,
  extension: string,
  onProgress?: (percent: number) => void
): Promise<{ error?: string }> {
  const supabase = createClient();
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  const accessToken = session?.access_token;
  if (sessionError || !accessToken) {
    return { error: "Sign in again to upload video." };
  }

  const supabaseUrl = getSupabaseUrl();

  try {
    await new Promise<void>((resolve, reject) => {
      const upload = new tus.Upload(video, {
        endpoint: `${supabaseUrl}/storage/v1/upload/resumable`,
        retryDelays: [0, 2000, 5000, 10000],
        headers: {
          authorization: `Bearer ${accessToken}`,
          "x-upsert": "false",
        },
        uploadDataDuringCreation: true,
        removeFingerprintOnSuccess: true,
        metadata: {
          bucketName: LISTING_MEDIA_BUCKET,
          objectName: path,
          contentType: video.type || `video/${extension}`,
          cacheControl: "3600",
        },
        chunkSize: TUS_CHUNK_BYTES,
        onError: (error) => reject(error),
        onProgress: (bytesUploaded, bytesTotal) => {
          if (bytesTotal > 0) {
            onProgress?.(Math.round((bytesUploaded / bytesTotal) * 100));
          }
        },
        onSuccess: () => resolve(),
      });

      // Always start fresh — stale TUS fingerprints cause chunk failures.
      upload.start();
    });
  } catch (error) {
    return { error: formatUploadError(error) };
  }

  return {};
}

async function runUploadStrategies(
  path: string,
  video: File,
  extension: string,
  onProgress?: (percent: number) => void
): Promise<{ error?: string }> {
  const strategies = [
    () => uploadVideoSigned(path, video, extension, onProgress),
    () => uploadVideoStandard(path, video, extension, onProgress),
    () => uploadVideoResumable(video, path, extension, onProgress),
  ];

  let lastError: string | undefined;

  for (const strategy of strategies) {
    const result = await strategy();
    if (!result.error) {
      return {};
    }
    lastError = result.error;
  }

  return { error: lastError ?? "Video upload failed." };
}

export async function uploadListingVideo(
  userId: string,
  video: File,
  onProgress?: (percent: number) => void
): Promise<{ url?: string; error?: string }> {
  if (video.size > LISTING_VIDEO_MAX_BYTES) {
    return {
      error:
        "Video must be 50 MB or smaller. Try compressing or trimming the clip.",
    };
  }

  const extension = getVideoExtension(video);
  const path = `${userId}/videos/${crypto.randomUUID()}.${extension}`;

  const uploadResult = await runUploadStrategies(
    path,
    video,
    extension,
    onProgress
  );

  if (uploadResult.error) {
    return { error: uploadResult.error };
  }

  const supabase = createClient();
  const {
    data: { publicUrl },
  } = supabase.storage.from(LISTING_MEDIA_BUCKET).getPublicUrl(path);

  return { url: publicUrl };
}
