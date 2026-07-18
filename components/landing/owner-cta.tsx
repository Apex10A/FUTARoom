import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SectionHeading } from "@/components/landing/section-heading";
import { Button } from "@/components/ui/button";

export function OwnerCta() {
  return (
    <section className="relative overflow-hidden bg-[#0a100e]">
      <Image
        src="/images/hero/choose.jpg"
        alt="Student reviewing accommodation options"
        fill
        sizes="100vw"
        className="object-cover object-center opacity-40"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-[#0a100e] via-[#0a100e]/90 to-[#0a100e]/75"
      />

      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-xl">
          <SectionHeading
            title="List your lodge on FUTARoom"
            subtitle="Reach FUTA students every semester. Add your property, set your price, and let students contact you directly."
            align="left"
            theme="dark"
            className="mb-8"
          />
          <Button
            size="lg"
            className="bg-white text-foreground shadow-lg shadow-black/20 hover:bg-white/90"
            render={<Link href="/register?role=owner" />}
          >
            List your property for free
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
