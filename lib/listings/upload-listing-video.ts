"use client";

import * as tus from "tus-js-client";

import { LISTING_VIDEO_MAX_BYTES } from "@/lib/constants/listing-media";
import { createClient } from "@/lib/supabase/client";
import { getSupabaseUrl } from "@/lib/supabase/env";

const LISTING_MEDIA_BUCKET = "listing-images";
const RESUMABLE_UPLOAD_THRESHOLD_BYTES = 6 * 1024 * 1024;

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

  return `Video upload failed: ${message}`;
}

async function uploadVideoStandard(
  userId: string,
  video: File,
  path: string,
  extension: string
): Promise<{ error?: string }> {
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

  return {};
}

async function uploadVideoResumable(
  userId: string,
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
        retryDelays: [0, 1000, 3000, 5000, 10000],
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
        chunkSize: RESUMABLE_UPLOAD_THRESHOLD_BYTES,
        onError: (error) => reject(error),
        onProgress: (bytesUploaded, bytesTotal) => {
          if (bytesTotal > 0) {
            onProgress?.(Math.round((bytesUploaded / bytesTotal) * 100));
          }
        },
        onSuccess: () => resolve(),
      });

      void upload.findPreviousUploads().then((previousUploads) => {
        if (previousUploads.length > 0) {
          upload.resumeFromPreviousUpload(previousUploads[0]);
        }
        upload.start();
      });
    });
  } catch (error) {
    return { error: formatUploadError(error) };
  }

  return {};
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

  const uploadResult =
    video.size >= RESUMABLE_UPLOAD_THRESHOLD_BYTES
      ? await uploadVideoResumable(userId, video, path, extension, onProgress)
      : await uploadVideoStandard(userId, video, path, extension);

  if (uploadResult.error) {
    return { error: uploadResult.error };
  }

  const supabase = createClient();
  const {
    data: { publicUrl },
  } = supabase.storage.from(LISTING_MEDIA_BUCKET).getPublicUrl(path);

  return { url: publicUrl };
}
