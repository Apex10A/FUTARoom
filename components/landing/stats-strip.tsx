import { Building2, MapPin, ShieldCheck } from "lucide-react";

import { LANDING_THEME } from "@/lib/constants/landing";

const STATS = [
  {
    icon: Building2,
    value: "150+",
    label: "Listed properties",
  },
  {
    icon: MapPin,
    value: "12",
    label: "Areas around campus",
  },
  {
    icon: ShieldCheck,
    value: "100%",
    label: "Admin-verified listings",
  },
] as const;

export function StatsStrip() {
  return (
    <section className="border-y border-white/10 bg-background">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3 sm:px-6 lg:px-8">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center gap-3 text-center sm:flex-row sm:items-center sm:text-left"
          >
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-[#E8B84A]">
              <stat.icon className="size-5" />
            </div>
            <div>
              <p
                className="text-3xl font-semibold tracking-tight"
                style={{ color: LANDING_THEME.accent }}
              >
                {stat.value}
              </p>
              <p className="text-sm text-white/60">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
