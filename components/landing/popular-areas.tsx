import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { POPULAR_AREAS } from "@/lib/constants/areas";
import { buildListingsHref } from "@/lib/listings/search-params";
import { cn } from "@/lib/utils";

type PopularAreasProps = {
  variant?: "default" | "hero";
};

export function PopularAreas({ variant = "default" }: PopularAreasProps) {
  const isHero = variant === "hero";

  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        isHero ? "items-start" : "items-center"
      )}
    >
      <p
        className={cn(
          "text-sm font-medium",
          isHero ? "text-white/75" : "text-muted-foreground"
        )}
      >
        Popular areas near FUTA
      </p>
      <div
        className={cn(
          "flex flex-wrap gap-2",
          isHero ? "justify-start" : "justify-center"
        )}
      >
        {POPULAR_AREAS.map((area) => (
          <Link
            key={area.id}
            href={buildListingsHref({ area: area.id })}
            className="transition-transform hover:scale-[1.02]"
          >
            <Badge
              variant="outline"
              className={cn(
                "px-3 py-1 text-sm",
                isHero
                  ? "border-white/25 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                  : "hover:bg-muted"
              )}
            >
              {area.label}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}
