import Link from "next/link";
import { BadgeCheck, Building2, MapPin, Scale } from "lucide-react";

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
    <div className="relative hidden w-[44%] max-w-[90%] shrink-0 flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex xl:p-14">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-white/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-16 size-96 rounded-full bg-black/10 blur-3xl"
      />

      <Link
        href="/"
        className="relative flex items-center gap-3 transition-opacity hover:opacity-90"
      >
        <span className="flex size-11 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20 backdrop-blur-sm">
          <Building2 className="size-5" />
        </span>
        <span className="text-xl font-semibold tracking-tight">{SITE_NAME}</span>
      </Link>

      <div className="relative space-y-8">
        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-wider text-primary-foreground/70">
            FUTA student accommodation
          </p>
          <h1 className="text-3xl font-semibold leading-tight tracking-tight xl:text-4xl">
            Find your lodge near campus with confidence.
          </h1>
          <p className="max-w-md text-base leading-relaxed text-primary-foreground/85">
            Browse verified listings, compare prices from different agents, and
            pick the offer that fits your budget.
          </p>
        </div>

        <ul className="space-y-4">
          {BRAND_POINTS.map((point) => (
            <li key={point.title} className="flex gap-3">
              <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/10">
                <point.icon className="size-4" />
              </span>
              <div>
                <p className="font-medium">{point.title}</p>
                <p className="text-sm text-primary-foreground/75">
                  {point.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <p className="relative text-sm text-primary-foreground/60">
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
    <div className="flex min-h-screen bg-background">
      <BrandPanel />

      <div className="relative flex flex-1 flex-col overflow-y-auto">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,oklch(0.929_0.013_255)_1px,transparent_0)] [background-size:22px_22px] opacity-60"
        />

        <div className="relative flex flex-1 flex-col justify-center px-4 py-10 sm:px-8 sm:py-12 lg:px-14 xl:px-20">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <Link
                href="/"
                className="inline-flex items-center gap-2.5 font-semibold text-foreground"
              >
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Building2 className="size-4" />
                </span>
                {SITE_NAME}
              </Link>
            </div>

            <div className="mb-8 space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {title}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                {description}
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card/80 p-6 shadow-sm shadow-primary/5 backdrop-blur-sm sm:p-8">
              {children}
              {footer && (
                <p className="mt-6 border-t border-border/80 pt-6 text-center text-sm text-muted-foreground">
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
