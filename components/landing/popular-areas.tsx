import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { POPULAR_AREAS } from "@/lib/constants/areas";
import { buildListingsHref } from "@/lib/listings/search-params";

export function PopularAreas() {
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm font-medium text-muted-foreground">
        Popular areas near FUTA
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {POPULAR_AREAS.map((area) => (
          <Link
            key={area.id}
            href={buildListingsHref({ area: area.id })}
            className="transition-transform hover:scale-[1.02]"
          >
            <Badge
              variant="outline"
              className="px-3 py-1 text-sm hover:bg-muted"
            >
              {area.label}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}
