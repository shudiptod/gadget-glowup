import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { bySlug, byCategory } from "@/data/products";
import { formatBDT, useCart } from "@/stores/cart";
import { categoryMap, type CategorySlug } from "@/data/categories";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { useState } from "react";
import { Minus, Plus, ShoppingCart, Truck, Repeat, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const p = bySlug.get(params.slug);
    if (!p) throw notFound();
    return { product: p };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — Gajitto` },
          { name: "description", content: loaderData.product.description },
          { property: "og:title", content: loaderData.product.name },
          { property: "og:description", content: loaderData.product.description },
          { property: "og:image", content: loaderData.product.image },
          { property: "og:type", content: "product" },
        ]
      : [{ title: "Product — Gajitto" }],
  }),
  component: ProductPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="font-display text-3xl font-extrabold">Product not found</h1>
      <Link to="/collection" className="mt-4 inline-block text-accent hover:underline">Back to shop</Link>
    </div>
  ),
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const add = useCart((s) => s.add);
  const [qty, setQty] = useState(1);
  const catSlug = product.category as CategorySlug;
  const cat = categoryMap[catSlug];
  const related = byCategory(catSlug).filter((p) => p.id !== product.id).slice(0, 5);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav className="text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <span className="mx-1.5">/</span>
        <Link to="/collection/$slug" params={{ slug: cat.slug }} className="hover:text-foreground">
          {cat.name}
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="overflow-hidden rounded-2xl border bg-muted">
          <div className="aspect-square">
            <img src={product.image} alt={product.name} className="h-full w-full object-contain p-8" />
          </div>
        </div>

        <div>
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {product.brand} · {cat.name}
          </span>
          <h1 className="mt-2 font-display text-2xl font-extrabold md:text-3xl">{product.name}</h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-[color:var(--price)]">{formatBDT(product.price)}</span>
            {product.oldPrice && (
              <span className="text-sm text-muted-foreground line-through">{formatBDT(product.oldPrice)}</span>
            )}
            {product.oldPrice && (
              <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
                Save {formatBDT(product.oldPrice - product.price)}
              </span>
            )}
          </div>

          <p className="mt-4 text-sm text-muted-foreground">{product.description}</p>

          {product.specs && (
            <dl className="mt-5 grid grid-cols-2 gap-y-2 rounded-xl border p-4 text-sm">
              {Object.entries(product.specs as Record<string, string>).map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center rounded-full border">
              <button className="p-2.5" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease">
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center text-sm font-semibold">{qty}</span>
              <button className="p-2.5" onClick={() => setQty((q) => q + 1)} aria-label="Increase">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => {
                add(product, qty);
                toast.success("Added to cart", { description: `${qty} × ${product.name}` });
              }}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground hover:brightness-110"
            >
              <ShoppingCart className="h-4 w-4" /> Add to cart
            </button>
          </div>

          <ul className="mt-6 grid grid-cols-3 gap-3 text-xs">
            <li className="flex items-center gap-2 rounded-lg border p-2.5">
              <Truck className="h-4 w-4 text-accent" /> Fast delivery
            </li>
            <li className="flex items-center gap-2 rounded-lg border p-2.5">
              <Repeat className="h-4 w-4 text-accent" /> Easy exchange
            </li>
            <li className="flex items-center gap-2 rounded-lg border p-2.5">
              <ShieldCheck className="h-4 w-4 text-accent" /> After-sales
            </li>
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <SectionHeading title="Related" accent="Products" />
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
