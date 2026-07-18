"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

import { isListingVideoPlaceholder } from "@/lib/constants/listing-media";
import { Button } from "@/components/ui/button";

type ListingGalleryProps = {
  images: string[];
  videoUrl?: string;
  title: string;
};

type GallerySlide =
  | { kind: "video"; url: string }
  | { kind: "image"; url: string };

export function ListingGallery({
  images,
  videoUrl,
  title,
}: ListingGalleryProps) {
  const slides = useMemo(() => {
    const photoSlides: GallerySlide[] = images
      .filter((url) => !isListingVideoPlaceholder(url))
      .map((url) => ({ kind: "image" as const, url }));

    if (videoUrl) {
      return [{ kind: "video" as const, url: videoUrl }, ...photoSlides];
    }

    return photoSlides.length > 0
      ? photoSlides
      : images.map((url) => ({ kind: "image" as const, url }));
  }, [images, videoUrl]);

  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultiple = slides.length > 1;
  const activeSlide = slides[activeIndex];

  function goTo(index: number) {
    setActiveIndex(index);
  }

  function goPrev() {
    setActiveIndex((index) => (index === 0 ? slides.length - 1 : index - 1));
  }

  function goNext() {
    setActiveIndex((index) => (index === slides.length - 1 ? 0 : index + 1));
  }

  if (!activeSlide) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border bg-muted">
        {activeSlide.kind === "video" ? (
          <video
            key={activeSlide.url}
            src={activeSlide.url}
            controls
            playsInline
            className="size-full bg-black object-contain"
          />
        ) : (
          <Image
            src={activeSlide.url}
            alt={`${title} — photo ${activeIndex + 1}`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 65vw"
            className="object-cover"
          />
        )}

        {hasMultiple && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/90 shadow-sm"
              onClick={goPrev}
              aria-label="Previous slide"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/90 shadow-sm"
              onClick={goNext}
              aria-label="Next slide"
            >
              <ChevronRight className="size-4" />
            </Button>
            <p className="absolute bottom-3 right-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium text-foreground shadow-sm">
              {activeIndex + 1} / {slides.length}
            </p>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {slides.map((slide, index) => (
            <button
              key={`${slide.kind}-${slide.url}`}
              type="button"
              onClick={() => goTo(index)}
              className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                index === activeIndex
                  ? "border-primary"
                  : "border-transparent opacity-80 hover:opacity-100"
              }`}
              aria-label={
                slide.kind === "video"
                  ? "View video tour"
                  : `View photo ${index + 1}`
              }
            >
              {slide.kind === "video" ? (
                <div className="flex size-full items-center justify-center bg-primary/10 text-xs font-medium text-primary">
                  Video
                </div>
              ) : (
                <Image
                  src={slide.url}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
