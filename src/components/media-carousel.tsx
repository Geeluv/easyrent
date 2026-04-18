"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback } from "react";
import { publicListingUrl } from "@/lib/storage";
import type { PropertyMediaRow } from "@/lib/types";
import { cn } from "@/lib/utils";

export function MediaCarousel({ media, title }: { media: PropertyMediaRow[]; title: string }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (media.length === 0) {
    return (
      <div className="flex aspect-[16/10] items-center justify-center rounded-2xl bg-zinc-100 text-zinc-500 dark:bg-zinc-900">
        No media uploaded yet.
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
        <div className="flex">
          {media.map((m, i) => {
            const src = publicListingUrl(m.storage_path);
            return (
              <div key={m.id} className="min-w-0 flex-[0_0_100%]">
                {m.media_type === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={src} alt={`${title} ${i + 1}`} className="aspect-[16/10] w-full object-cover" />
                ) : (
                  <video src={src} className="aspect-video w-full bg-black" controls playsInline preload="metadata" />
                )}
              </div>
            );
          })}
        </div>
      </div>
      {media.length > 1 ? (
        <>
          <button
            type="button"
            onClick={scrollPrev}
            className={cn(
              "absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur",
              "hover:bg-black/70",
            )}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            className={cn(
              "absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur",
              "hover:bg-black/70",
            )}
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      ) : null}
    </div>
  );
}
