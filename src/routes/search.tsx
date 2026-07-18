import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import { products } from "@/data/products";
import { ProductCard } from "@/components/product-card";

const search = z.object({ q: z.string().optional().default("") });

export const Route = createFileRoute("/search")({
  validateSearch: zodValidator(search),
  head: () => ({
    meta: [
      { title: "Search — Gajitto" },
      { name: "description", content: "Search the Gajitto catalogue." },
      { property: "og:title", content: "Search — Gajitto" },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const query = q.trim().toLowerCase();
  const results = query
    ? products.filter((p) => (p.name + " " + p.brand + " " + p.category).toLowerCase().includes(query))
    : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display text-2xl font-extrabold md:text-3xl">
        {query ? <>Results for "<span className="text-accent">{query}</span>"</> : "Search"}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">{results.length} products found</p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {results.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {query && results.length === 0 && (
        <p className="py-16 text-center text-sm text-muted-foreground">No matches. Try a different search term.</p>
      )}
    </div>
  );
}
