/** Shown on browse cards when a listing has video but no photo thumbnail */
export const LISTING_VIDEO_PLACEHOLDER = "/images/listing-video-placeholder.svg";

export const LISTING_VIDEO_MAX_BYTES = 50 * 1024 * 1024; // 50 MB

export const LISTING_VIDEO_ACCEPT =
  "video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm";

export function isListingVideoPlaceholder(imageUrl: string): boolean {
  return imageUrl.endsWith(LISTING_VIDEO_PLACEHOLDER);
}
