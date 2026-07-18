"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import heroEmi from "@/assets/hero-emi.jpg";
import heroBuds from "@/assets/hero-buds.jpg";
import heroWatch from "@/assets/hero-watch.jpg";
import promoWatch from "@/assets/promo-watch.jpg";
import promoFan from "@/assets/promo-fan.jpg";
import Link from "next/link";

const heroEmiSrc = typeof heroEmi === "string" ? heroEmi : heroEmi.src;
const heroBudsSrc = typeof heroBuds === "string" ? heroBuds : heroBuds.src;
const heroWatchSrc = typeof heroWatch === "string" ? heroWatch : heroWatch.src;
const promoWatchSrc = typeof promoWatch === "string" ? promoWatch : promoWatch.src;
const promoFanSrc = typeof promoFan === "string" ? promoFan : promoFan.src;

type Slide = {
  image: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: string;
  bg: string;
  toneDark?: boolean;
};

const slides: Slide[] = [
  {
    image: heroEmiSrc,
    eyebrow: "Bank offer",
    title: "0% EMI up to 12 Months",
    subtitle: "On smartphones with select bank cards.",
    cta: "Shop Smartphones",
    bg: "from-orange-50 to-white",
  },
  {
    image: heroBudsSrc,
    eyebrow: "New arrivals",
    title: "Big Sound. Small Buds.",
    subtitle: "45h playtime, AI ENC, super low latency.",
    cta: "Shop Airbuds",
    bg: "from-indigo-950 to-purple-900",
    toneDark: true,
  },
  {
    image: heroWatchSrc,
    eyebrow: "Wearables",
    title: "Track every heartbeat",
    subtitle: "AMOLED smartwatches from ৳2,750.",
    cta: "Shop Watches",
    bg: "from-rose-50 to-amber-50",
  },
];

export function HeroSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSel = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSel);
    onSel();
    const t = setInterval(() => emblaApi.scrollNext(), 5000);
    return () => {
      emblaApi.off("select", onSel);
      clearInterval(t);
    };
  }, [emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="mx-auto max-w-7xl px-4 pt-4 lg:pt-6">
      <div className="grid gap-3 lg:grid-cols-[1fr_320px] h-full">
        <div className="relative overflow-hidden rounded-2xl h-full">
          <div ref={emblaRef} className="overflow-hidden h-full">
            <div className="flex h-full">
              {slides.map((s, i) => (
                <div key={i} className="min-w-0 flex-[0_0_100%] h-full">
                  <div className={`relative aspect-16/8 bg-linear-to-br ${s.bg} h-full`}>
                    <img
                      src={s.image}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                      loading={i === 0 ? "eager" : "lazy"}
                    />
                    <div
                      className={`relative z-10 flex h-full w-full flex-col justify-center gap-3 p-6 md:p-10 lg:max-w-[45%] ${s.toneDark ? "text-white" : "text-foreground"}`}
                    >
                      <span
                        className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${s.toneDark ? "bg-white/15 text-white" : "bg-accent/15 text-accent"}`}
                      >
                        {s.eyebrow}
                      </span>
                      <h2
                        className={`font-display text-3xl font-extrabold leading-tight md:text-5xl ${s.toneDark ? "" : ""}`}
                      >
                        {s.title}
                      </h2>
                      <p
                        className={`max-w-sm text-sm md:text-base ${s.toneDark ? "text-white/80" : "text-muted-foreground"}`}
                      >
                        {s.subtitle}
                      </p>
                      <Link
                        href="/collection"
                        className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-sm hover:brightness-110"
                      >
                        {s.cta}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={scrollPrev}
            aria-label="Previous"
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow ring-1 ring-black/5 backdrop-blur hover:bg-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={scrollNext}
            aria-label="Next"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow ring-1 ring-black/5 backdrop-blur hover:bg-white"
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

        <div className="grid gap-3 lg:grid-cols-1">
          <PromoCard image={promoWatchSrc} to="/collection/watch" />
          <PromoCard image={promoFanSrc} to="/collection/accessories" />
        </div>
      </div>
    </section>
  );
}

function PromoCard({ image, to }: { image: string; to: string }) {
  return (
    <a
      href={to}
      className="group relative block overflow-hidden rounded-2xl aspect-[16/9] lg:aspect-[4/3]"
    >
      <img
        src={image}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />
    </a>
  );
}
