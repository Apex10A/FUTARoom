/**
 * Reversible platform-wide gate. When true, middleware redirects every route
 * to "/" and the home page renders the "under construction" + pre-platform
 * survey experience instead of the normal landing page. Flip SITE_CLOSED
 * back to "false" (or unset it) in the environment to restore FUTARoom as-is.
 */
export function isSiteClosed(): boolean {
  return process.env.SITE_CLOSED === "true";
}
