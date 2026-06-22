import { BadgeCheck, MapPin, Shield } from "lucide-react";

const FEATURES = [
  {
    icon: MapPin,
    title: "Search by area",
    description:
      "South Gate, North Gate, Ibule, and other popular student areas around FUTA.",
  },
  {
    icon: Shield,
    title: "Verified listings",
    description:
      "Every listing is reviewed before it goes live so students get accurate prices and details.",
  },
  {
    icon: BadgeCheck,
    title: "Direct contact",
    description:
      "Message property owners directly — no middlemen, no surprise fees.",
  },
] as const;

export function FeatureCards() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Why students use FUTARoom
        </h2>
        <p className="mt-2 text-muted-foreground">
          Built for how FUTA students actually find accommodation.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="rounded-xl border border-border bg-card p-6 shadow-sm"
          >
            <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <feature.icon className="size-5" />
            </div>
            <h3 className="font-semibold text-foreground">{feature.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
