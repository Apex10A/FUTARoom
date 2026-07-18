import Image from "next/image";

import { HOW_IT_WORKS } from "@/lib/constants/how-it-works";
import { SectionHeading } from "@/components/landing/section-heading";
import { cn } from "@/lib/utils";

export function HowItWorksPath() {
  return (
    <section className="bg-[#0a100e] py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={HOW_IT_WORKS.title}
          subtitle={HOW_IT_WORKS.subtitle}
          align="right"
          theme="dark"
          className="mb-16 sm:mb-20"
        />

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
