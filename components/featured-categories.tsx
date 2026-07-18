import Link from "next/link";
import { SectionHeading } from "./section-heading";
import apiClient from "@/lib/apiClient";
import type { ICollectionListResponse } from "@/types/api";

type FeaturedCategory = {
  slug?: string;
  name?: string;
  imagePath?: string;
};

async function getFeaturedCategories() {
  try {
    return await apiClient.get<ICollectionListResponse>("/products/roots");
  } catch {
    throw new Error("Failed to fetch categories");
  }
}

export async function FeaturedCategories() {
  const { data: categories } = await getFeaturedCategories();
  const featuredCategories = (categories ?? []) as FeaturedCategory[];

  return (
    <section className="mx-auto max-w-7xl px-4 pt-12">
      <SectionHeading title="Featured" accent="Categories" />
      <div className="mt-6 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9">
        {featuredCategories.slice(0, 9).map((c) => (
          <Link
            key={c.slug}
            href={`/collection/${c.slug}`}
            className="group flex flex-col items-center gap-2"
          >
            <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border bg-card p-3 shadow-sm transition group-hover:-translate-y-1 group-hover:shadow-md">
              <img
                src={
                  c.imagePath ||
                  "https://wwsygxbdccehktouuodc.supabase.co/storage/v1/object/public/store-assets/products/images/Redmi%20Note%2015%204G.png"
                }
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
