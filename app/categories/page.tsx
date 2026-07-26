import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import apiClient from "@/lib/apiClient";
import { SectionHeading } from "@/components/section-heading";
import type { ICollection, ICollectionListResponse } from "@/types/api";

export const metadata: Metadata = {
  title: "All Categories — Gajitto",
  description:
    "Browse every category at Gajitto — smartphones, airbuds, watches, headphones, speakers, chargers, power banks and more.",
  openGraph: {
    title: "All Categories — Gajitto",
    description:
      "Browse every category at Gajitto — smartphones, airbuds, watches, headphones, speakers, chargers, power banks and more.",
  },
};

const FALLBACK_IMAGE =
  "https://wwsygxbdccehktouuodc.supabase.co/storage/v1/object/public/store-assets/products/images/Redmi%20Note%2015%204G.png";

async function getRootCategories() {
  try {
    return await apiClient.get<ICollectionListResponse>(`/products/roots`);
  } catch (error) {
    console.error("Failed to fetch roots:", error);
    return { success: false, data: [] };
  }
}

async function getChildren(slug: string): Promise<ICollection[]> {
  try {
    const res = await apiClient.get<ICollectionListResponse>(`/products/categories/${slug}`);
    return res?.data ?? [];
  } catch (error) {
    console.error(`Failed to fetch children for ${slug}:`, error);
    return [];
  }
}

export default async function CategoriesPage() {
  const { data: roots } = await getRootCategories();
  const groups = await Promise.all(
    roots.map(async (root) => ({
      root,
      children: await getChildren(root.slug),
    })),
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      {/* Page header */}
      <div className="flex flex-col gap-2">
        <nav className="text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Categories</span>
        </nav>
        <SectionHeading title="All" accent="Categories" />
        <p className="max-w-2xl text-sm text-muted-foreground">
          Explore every collection at Gajitto. Tap a category to see all its products, or jump
          straight into a subcategory.
        </p>
      </div>

      {/* Quick jump chips */}
      {groups.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {groups.map(({ root }) => (
            <a
              key={root.id}
              href={`#cat-${root.slug}`}
              className="rounded-full border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-foreground hover:text-foreground"
            >
              {root.name}
            </a>
          ))}
        </div>
      )}

      {/* Groups */}
      <div className="mt-10 space-y-12">
        {groups.length === 0 && (
          <p className="text-sm text-muted-foreground">No categories found.</p>
        )}

        {groups.map(({ root, children }) => (
          <section key={root.id} id={`cat-${root.slug}`} className="scroll-mt-24">
            <div className="flex items-end justify-between gap-4 border-b pb-3">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-xl border bg-card">
                  <Image
                    src={root.imagePath || FALLBACK_IMAGE}
                    alt={root.name}
                    fill
                    className="object-contain p-1.5"
                    sizes="48px"
                  />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold tracking-tight md:text-2xl">
                    {root.name}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {children.length} {children.length === 1 ? "subcategory" : "subcategories"}
                  </p>
                </div>
              </div>
              <Link
                href={`/collection/${root.slug}`}
                className="text-xs font-semibold uppercase tracking-wide text-accent hover:underline"
              >
                View all →
              </Link>
            </div>

            {children.length === 0 ? (
              <div className="mt-5">
                <Link
                  href={`/collection/${root.slug}`}
                  className="inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-3 text-sm font-medium hover:border-foreground"
                >
                  Browse all {root.name}
                </Link>
              </div>
            ) : (
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {children.map((child) => (
                  <Link
                    key={child.id}
                    href={`/collection/${child.slug}`}
                    className="group flex flex-col items-center gap-2 rounded-2xl border bg-card p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted/40">
                      <Image
                        src={child.imagePath || root.imagePath || FALLBACK_IMAGE}
                        alt={child.name}
                        fill
                        className="object-contain p-3 transition group-hover:scale-105"
                        sizes="(min-width: 1024px) 160px, (min-width: 640px) 25vw, 50vw"
                      />
                    </div>
                    <span className="text-center text-xs font-medium text-muted-foreground group-hover:text-foreground md:text-sm">
                      {child.name}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
