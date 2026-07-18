import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductCard } from "@/components/product-card";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/collection")({
  head: () => ({
    meta: [
      { title: "All Products — Gajitto" },
      { name: "description", content: "Browse all smartphones, airbuds, watches, headphones and accessories at Gajitto." },
      { property: "og:title", content: "All Products — Gajitto" },
      { property: "og:description", content: "The full Gajitto catalogue in one place." },
    ],
  }),
  component: Collection,
});

function Collection() {
  const [maxPrice, setMaxPrice] = useState(50000);
  const [selectedCats, setSelectedCats] = useState<string[]>([]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (p.price > maxPrice) return false;
      if (selectedCats.length && !selectedCats.includes(p.category)) return false;
      return true;
    });
  }, [maxPrice, selectedCats]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display text-3xl font-extrabold">All Products</h1>
      <p className="mt-1 text-sm text-muted-foreground">{filtered.length} products</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border p-4">
            <h3 className="text-sm font-semibold">Category</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {categories.map((c) => (
                <li key={c.slug}>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedCats.includes(c.slug)}
                      onChange={(e) =>
                        setSelectedCats((prev) =>
                          e.target.checked ? [...prev, c.slug] : prev.filter((s) => s !== c.slug),
                        )
                      }
                    />
                    {c.name}
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border p-4">
            <h3 className="text-sm font-semibold">Max price</h3>
            <input
              type="range"
              min={500}
              max={50000}
              step={500}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="mt-3 w-full accent-[color:var(--accent)]"
            />
            <p className="mt-2 text-sm text-muted-foreground">Up to ৳{maxPrice.toLocaleString()}</p>
          </div>

          <Link to="/collection" className="block text-center text-xs text-muted-foreground hover:underline">
            Reset filters
          </Link>
        </aside>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
