"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

type ListingGalleryProps = {
  images: string[];
  title: string;
};

export function ListingGallery({ images, title }: ListingGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultiple = images.length > 1;

  function goTo(index: number) {
    setActiveIndex(index);
  }

  function goPrev() {
    setActiveIndex((index) => (index === 0 ? images.length - 1 : index - 1));
  }

  function goNext() {
    setActiveIndex((index) => (index === images.length - 1 ? 0 : index + 1));
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border bg-muted">
        <Image
          src={images[activeIndex]}
          alt={`${title} — photo ${activeIndex + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 65vw"
          className="object-cover"
        />

        {hasMultiple && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/90 shadow-sm"
              onClick={goPrev}
              aria-label="Previous photo"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/90 shadow-sm"
              onClick={goNext}
              aria-label="Next photo"
            >
              <ChevronRight className="size-4" />
            </Button>
            <p className="absolute bottom-3 right-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium text-foreground shadow-sm">
              {activeIndex + 1} / {images.length}
            </p>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => goTo(index)}
              className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                index === activeIndex
                  ? "border-primary"
                  : "border-transparent opacity-80 hover:opacity-100"
              }`}
              aria-label={`View photo ${index + 1}`}
            >
              <Image
                src={image}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
