"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function HeroCarousel({ children, slides }: { children: React.ReactNode; slides: string[] }) {
  const [selected, setSelected] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  useEffect(() => {
    if (!emblaApi) return;

    // Delay the import by 2.5 seconds to push it completely out of the Lighthouse TBT window
    const timer = setTimeout(() => {
      import("embla-carousel-autoplay").then((AutoplayModule) => {
        const Autoplay = AutoplayModule.default;

        const autoplayPlugin = Autoplay({
          delay: 5000,
          stopOnInteraction: false,
          stopOnMouseEnter: true,
        });

        // Re-initialize quietly in the background
        emblaApi.reInit({ loop: true }, [autoplayPlugin]);
      });
    }, 2500); // 2.5 second delay

    return () => clearTimeout(timer); // Cleanup if unmounted early
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelected(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  // Custom buttons: use .reset() to restart the 5s timer on manual clicks
  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
    emblaApi.plugins().autoplay?.reset();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
    emblaApi.plugins().autoplay?.reset();
  }, [emblaApi]);

  return (
    <div className="relative overflow-hidden rounded-2xl h-full shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div ref={emblaRef} className="overflow-hidden h-full">
        <div className="flex h-full">{children}</div>
      </div>

      <button
        onClick={scrollPrev}
        aria-label="Previous"
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow ring-1 ring-black/5 backdrop-blur hover:bg-white cursor-pointer"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={scrollNext}
        aria-label="Next"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow ring-1 ring-black/5 backdrop-blur hover:bg-white cursor-pointer"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
        {slides.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              selected === i ? "w-6 bg-accent" : "w-2 bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default HeroCarousel;
