import { headers } from "next/headers";

import { SiteShell } from "@/components/layout/site-shell";

const AUTH_PATHS = new Set(["/login", "/register"]);

export async function ConditionalSiteShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = (await headers()).get("x-pathname") ?? "";

  if (AUTH_PATHS.has(pathname)) {
    return children;
  }

  return <SiteShell>{children}</SiteShell>;
}
