import { createFileRoute, notFound } from "@tanstack/react-router";
import { ProductCard } from "@/components/product-card";
import { byCategory, products } from "@/data/products";
import { categoryMap, type CategorySlug } from "@/data/categories";

export const Route = createFileRoute("/collection/$slug")({
  loader: ({ params }) => {
    const cat = categoryMap[params.slug as CategorySlug];
    if (!cat) throw notFound();
    return { cat };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.cat.name} — Gajitto` },
          { name: "description", content: `Shop ${loaderData.cat.name.toLowerCase()} at Gajitto. Best prices, fastest delivery in Bangladesh.` },
          { property: "og:title", content: `${loaderData.cat.name} — Gajitto` },
          { property: "og:description", content: `Explore our ${loaderData.cat.name.toLowerCase()} collection.` },
          { property: "og:image", content: loaderData.cat.image },
        ]
      : [{ title: "Category — Gajitto" }],
  }),
  component: CategoryPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="font-display text-3xl font-extrabold">Category not found</h1>
    </div>
  ),
});

function CategoryPage() {
  const { cat } = Route.useLoaderData();
  const list = byCategory(cat.slug);
  const fallback = list.length === 0 ? products.slice(0, 8) : list;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display text-3xl font-extrabold md:text-4xl">
        {cat.name}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">{fallback.length} products</p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {fallback.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
