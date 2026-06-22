import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function OwnerCta() {
  return (
    <section className="border-t border-border bg-secondary/30">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Own a lodge or hostel?
          </h2>
          <p className="max-w-xl text-muted-foreground">
            List your property on FUTARoom and reach students actively searching
            for accommodation every semester.
          </p>
        </div>
        <Button size="lg" render={<Link href="/register?role=owner" />}>
          List your property for free
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </section>
  );
}
