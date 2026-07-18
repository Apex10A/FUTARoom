import { headers } from "next/headers";

import { Navbar } from "@/components/layout/navbar";
import { SiteShell } from "@/components/layout/site-shell";

const AUTH_PATHS = new Set(["/login", "/register"]);
const MINIMAL_CHROME_PATHS = new Set([
  "/dashboard/owner/listings/new",
]);

export async function ConditionalSiteShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = (await headers()).get("x-pathname") ?? "";

  if (AUTH_PATHS.has(pathname)) {
    return children;
  }

  if (MINIMAL_CHROME_PATHS.has(pathname)) {
    return (
      <div className="flex min-h-full flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
      </div>
    );
  }

  return <SiteShell>{children}</SiteShell>;
}
