import { Building2, MapPin, ShieldCheck } from "lucide-react";

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
    <section className="border-y border-border bg-muted/30">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-3 sm:px-6 lg:px-8">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-4 text-center sm:text-left"
          >
            <div className="mx-auto flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:mx-0">
              <stat.icon className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold tracking-tight text-foreground">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
