import { Link } from "@tanstack/react-router";
import { categories } from "@/data/categories";
import { SectionHeading } from "./section-heading";

export function FeaturedCategories() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-12">
      <SectionHeading title="Featured" accent="Categories" />
      <div className="mt-6 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9">
        {categories.map((c) => (
          <Link
            key={c.slug}
            to="/collection/$slug"
            params={{ slug: c.slug }}
            className="group flex flex-col items-center gap-2"
          >
            <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border bg-card p-3 shadow-sm transition group-hover:-translate-y-1 group-hover:shadow-md">
              <img
                src={c.image}
                alt={c.name}
                loading="lazy"
                className="h-full w-full object-contain"
              />
            </div>
            <span className="text-center text-xs font-medium text-muted-foreground group-hover:text-foreground md:text-sm">
              {c.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
