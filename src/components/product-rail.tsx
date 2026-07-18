import { Link } from "@tanstack/react-router";
import type { Product } from "@/data/products";
import { ProductCard } from "./product-card";
import { SectionHeading } from "./section-heading";
import type { CategorySlug } from "@/data/categories";

export function ProductRail({
  title,
  accent,
  products,
  viewAllTo,
}: {
  title: string;
  accent?: string;
  products: Product[];
  viewAllTo?: CategorySlug;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-12">
      <SectionHeading
        title={title}
        accent={accent}
        action={
          viewAllTo && (
            <Link
              to="/collection/$slug"
              params={{ slug: viewAllTo }}
              className="text-xs font-semibold uppercase tracking-wide text-accent hover:underline"
            >
              View all →
            </Link>
          )
        }
      />
      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {products.slice(0, 5).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
