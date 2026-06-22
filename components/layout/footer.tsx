import Link from "next/link";

import { SITE_NAME } from "@/lib/constants/site";

const FOOTER_LINKS = [
  { href: "/listings", label: "Browse Listings" },
  { href: "/for-owners", label: "List Your Property" },
  { href: "/login", label: "Sign In" },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <Link
              href="/"
              className="text-lg font-semibold tracking-tight text-foreground"
            >
              {SITE_NAME}
            </Link>
            <p className="max-w-sm text-sm text-muted-foreground">
              A student accommodation finder for Federal University of Technology,
              Akure.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-1 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
          <p>Built for FUTA students</p>
        </div>
      </div>
    </footer>
  );
}
