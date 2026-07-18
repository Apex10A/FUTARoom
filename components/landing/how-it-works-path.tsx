import Image from "next/image";

import { HOW_IT_WORKS } from "@/lib/constants/how-it-works";
import { LANDING_HERO_ACCENT } from "@/lib/constants/landing";
import { cn } from "@/lib/utils";

export function HowItWorksPath() {
  return (
    <section className="bg-[#0a100e] py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative mb-16 sm:mb-20">
          <div
            aria-hidden
            className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/15"
          />
          <div className="relative flex justify-end">
            <div className="max-w-md bg-[#0a100e] pl-6 text-right">
              <h2
                className="text-2xl font-semibold tracking-tight sm:text-3xl"
                style={{ color: LANDING_HERO_ACCENT }}
              >
                {HOW_IT_WORKS.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white/65 sm:text-base">
                {HOW_IT_WORKS.subtitle}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-20 sm:space-y-28">
          {HOW_IT_WORKS.steps.map((step, index) => {
            const imageFirst = index % 2 === 1;

            return (
              <div
                key={step.number}
                className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
              >
                <div className={cn(imageFirst && "lg:order-2")}>
                  <p className="text-5xl font-light tracking-tight text-white/90 sm:text-6xl">
                    {step.number}
                  </p>
                  <h3 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                    {step.title}
                  </h3>
                  <p className="mt-4 max-w-lg text-base leading-relaxed text-white/65">
                    {step.description}
                  </p>
                </div>

                <div
                  className={cn(
                    "relative aspect-[4/3] overflow-hidden rounded-[2rem] sm:rounded-[2.5rem]",
                    imageFirst && "lg:order-1"
                  )}
                >
                  <Image
                    src={step.imageUrl}
                    alt={step.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
