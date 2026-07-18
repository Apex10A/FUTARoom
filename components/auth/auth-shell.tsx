import Link from "next/link";
import { BadgeCheck, Building2, MapPin, Scale } from "lucide-react";

import { LANDING_THEME } from "@/lib/constants/landing";
import { SITE_NAME } from "@/lib/constants/site";

const BRAND_POINTS = [
  {
    icon: MapPin,
    title: "Search by area",
    description: "South Gate, Ibule, North Gate, and more.",
  },
  {
    icon: Scale,
    title: "Compare agent prices",
    description: "See multiple offers for the same lodge.",
  },
  {
    icon: BadgeCheck,
    title: "Contact owners directly",
    description: "No middleman — reach agents on WhatsApp.",
  },
] as const;

type AuthShellProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

function BrandPanel() {
  return (
    <div
      className="relative hidden w-[44%] max-w-[90%] shrink-0 flex-col justify-between overflow-hidden p-10 text-white lg:flex xl:p-14"
      style={{ backgroundColor: LANDING_THEME.dark }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-[#E8B84A]/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-16 size-96 rounded-full bg-primary/20 blur-3xl"
      />

      <Link
        href="/"
        className="relative flex items-center gap-3 transition-opacity hover:opacity-90"
      >
        <span className="flex size-11 items-center justify-center rounded-xl bg-white/10 text-[#E8B84A] ring-1 ring-white/20 backdrop-blur-sm">
          <Building2 className="size-5" />
        </span>
        <span className="text-xl font-semibold tracking-tight">{SITE_NAME}</span>
      </Link>

      <div className="relative space-y-8">
        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-wider text-[#E8B84A]/80">
            FUTA student accommodation
          </p>
          <h1 className="text-3xl font-semibold leading-tight tracking-tight xl:text-4xl">
            Find your lodge near campus with confidence.
          </h1>
          <p className="max-w-md text-base leading-relaxed text-white/70">
            Browse verified listings, compare prices from different agents, and
            pick the offer that fits your budget.
          </p>
        </div>

        <ul className="space-y-4">
          {BRAND_POINTS.map((point) => (
            <li key={point.title} className="flex gap-3">
              <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[#E8B84A] ring-1 ring-white/10">
                <point.icon className="size-4" />
              </span>
              <div>
                <p className="font-medium">{point.title}</p>
                <p className="text-sm text-white/60">{point.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <p className="relative text-sm text-white/45">
        Built for Federal University of Technology, Akure students.
      </p>
    </div>
  );
}

export function AuthShell({
  title,
  description,
  children,
  footer,
}: AuthShellProps) {
  return (
    <div
      className="flex min-h-screen bg-background"
      style={{ backgroundColor: LANDING_THEME.dark }}
    >
      <BrandPanel />

      <div className="relative flex flex-1 flex-col overflow-y-auto">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] [background-size:22px_22px] opacity-80"
        />

        <div className="relative flex flex-1 flex-col justify-center px-4 py-10 sm:px-8 sm:py-12 lg:px-14 xl:px-20">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <Link
                href="/"
                className="inline-flex items-center gap-2.5 font-semibold text-white"
              >
                <span className="flex size-9 items-center justify-center rounded-lg bg-white/10 text-[#E8B84A] ring-1 ring-white/15">
                  <Building2 className="size-4" />
                </span>
                {SITE_NAME}
              </Link>
            </div>

            <div className="mb-8 space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                {title}
              </h2>
              <p className="text-sm leading-relaxed text-white/60 sm:text-base">
                {description}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-sm shadow-black/20 backdrop-blur-sm sm:p-8">
              {children}
              {footer && (
                <p className="mt-6 border-t border-white/10 pt-6 text-center text-sm text-white/55">
                  {footer}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
