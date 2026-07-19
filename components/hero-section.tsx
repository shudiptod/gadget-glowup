import PromoCard from "./home-promo-card";
import HeroCarousel from "./hero-carousel";
import Image from "next/image";

type Slide = string;

const slides: Slide[] = [
  "/images/Home/Hero/LeftBanner/webBanner01.png",
  "/images/Home/Hero/LeftBanner/webBanner02.png",
  "/images/Home/Hero/LeftBanner/webBanner03.png",
];

export function HeroSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-4 lg:pt-6">
      <div className="grid gap-3 lg:grid-cols-[1fr_387px] h-full">
        <HeroCarousel slides={slides}>
          {slides.map((s, i) => (
            <div key={i} className="min-w-0 flex-[0_0_100%] h-full">
              <div className="relative aspect-16/8 bg-linear-to-br h-full">
                <Image
                  fill
                  priority={i === 0} // Only priority on the first slide
                  src={s}
                  alt={`Hero banner ${i + 1}`}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            </div>
          ))}
        </HeroCarousel>

        <div className="w-full h-full flex flex-col justify-center gap-3">
          <PromoCard
            image={"/images/Home/Hero/RightBanner/rightBanner01.png"}
            to="/collection/watch"
          />
          <PromoCard
            image={"/images/Home/Hero/RightBanner/rightBanner02.png"}
            to="/collection/accessories"
          />
        </div>
      </div>
    </section>
  );
}
