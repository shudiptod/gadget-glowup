import { brandGroups } from "@/data/brands";
import Image from "next/image";

export function BrandBento() {
  return (
    <section className="mx-auto mt-14 max-w-6xl px-4">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight">Our Trusted Brands</h2>
        <p className="mt-2 text-muted-foreground">Shop top quality from the best in the industry</p>
      </div>

      {/* 
        Master Grid: 
        - 1 column on Mobile
        - 2 columns on Tablet
        - 3 columns on Desktop
      */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Row 1 (Desktop) */}
        <BentoCard
          title="Mobile"
          brands={brandGroups.mobile}
          className="md:col-span-2"
          innerGrid="grid-cols-3 sm:grid-cols-4" // 8 items perfectly fit in 4 columns
        />

        <BentoCard
          title="Computing"
          brands={brandGroups.computing}
          className="md:col-span-1"
          innerGrid="grid-cols-3" // 5 items
        />

        {/* Row 2 (Desktop) */}
        <BentoCard
          title="Audio"
          brands={brandGroups.audio}
          className="md:col-span-1"
          innerGrid="grid-cols-3" // 6 items
        />

        <BentoCard
          title="Accessories"
          brands={brandGroups.accessories}
          className="md:col-span-1"
          innerGrid="grid-cols-3" // 5 items
        />

        <BentoCard
          title="Lifestyle & Misc"
          brands={brandGroups.lifestyleAndMisc}
          // Spans 2 cols on tablet to balance the bottom row, but 1 col on desktop
          className="md:col-span-2 lg:col-span-1"
          innerGrid="grid-cols-3 sm:grid-cols-5 lg:grid-cols-3" // 5 items
        />
      </div>
    </section>
  );
}

/**
 * Reusable Card Component
 */
function BentoCard({ title, brands, className, innerGrid }: any) {
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-3xl border bg-card p-6 shadow-sm transition-all hover:shadow-md ${className}`}
    >
      <h3 className="mb-6 text-center text-lg font-semibold tracking-tight md:text-left">
        {title}
      </h3>

      {/* Inner Grid evenly distributes logos across the available space */}
      <div className={`grid grow place-content-center gap-6 ${innerGrid}`}>
        {brands.map((b: any) => (
          <div
            key={b.name}
            title={b.name}
            className="flex items-center justify-center w-24 aspect-auto relative"
          >
            <Image
              src={b.src}
              alt={`${b.name} logo`}
              width={0}
              height={0}
              className="h-full w-full object-cover object-center"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
