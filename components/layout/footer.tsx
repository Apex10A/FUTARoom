import Link from "next/link";
import { Building2 } from "lucide-react";

import { LANDING_THEME } from "@/lib/constants/landing";
import { SITE_NAME } from "@/lib/constants/site";

const FOOTER_LINKS = [
  { href: "/listings", label: "Browse listings" },
  { href: "/register?role=owner", label: "List your property" },
  { href: "/login", label: "Sign in" },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0a100e] text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-lg font-semibold tracking-tight text-white"
            >
              <span className="flex size-8 items-center justify-center rounded-lg bg-white/10 text-[#E8B84A] ring-1 ring-white/15">
                <Building2 className="size-4" />
              </span>
              {SITE_NAME}
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-white/60">
              A student accommodation finder for Federal University of Technology,
              Akure.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-white/65 transition-colors hover:text-[#E8B84A]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-1 border-t border-white/10 pt-6 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
          <p style={{ color: LANDING_THEME.accent }}>Built for FUTA students</p>
        </div>
      </div>
    </footer>
  );
}
