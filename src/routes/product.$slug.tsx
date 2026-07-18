import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { bySlug, byCategory } from "@/data/products";
import { formatBDT, useCart } from "@/stores/cart";
import { categoryMap, type CategorySlug } from "@/data/categories";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { useState } from "react";
import {
  Minus,
  Plus,
  ShoppingCart,
  Truck,
  Repeat,
  ShieldCheck,
  CheckCircle2,
  MessageCircle,
  GitCompareArrows,
  Share2,
  Zap,
} from "lucide-react";
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
      <Link to="/collection" className="mt-4 inline-block text-accent hover:underline">
        Back to shop
      </Link>
    </div>
  ),
});

type TabKey = "spec" | "desc" | "warranty";

function ProductPage() {
  const { product } = Route.useLoaderData();
  const add = useCart((s) => s.add);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<TabKey>("spec");
  const [activeImg, setActiveImg] = useState(0);

  const catSlug = product.category as CategorySlug;
  const cat = categoryMap[catSlug];
  const related = byCategory(catSlug).filter((p) => p.id !== product.id).slice(0, 5);

  // Gallery: reuse main image (data has 1). Show 4 thumbs for visual parity.
  const gallery = [product.image, product.image, product.image, product.image];

  const code = `GJT-${product.id.replace(/[^a-z0-9]/gi, "").toUpperCase().slice(-6)}`;

  const handleAdd = () => {
    add(product, qty);
    toast.success("Added to cart", { description: `${qty} × ${product.name}` });
  };

  const handleBuyNow = () => {
    add(product, qty);
    // send to checkout
    window.location.href = "/checkout";
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <nav className="text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Home
        </Link>
        <span className="mx-1.5">/</span>
        <Link to="/collection/$slug" params={{ slug: cat.slug }} className="hover:text-foreground">
          {cat.name}
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-foreground">{product.brand}</span>
      </nav>

      <div className="mt-5 grid gap-8 lg:grid-cols-[1.05fr_1fr]">
        {/* Gallery */}
        <div>
          <div className="overflow-hidden rounded-2xl border bg-card">
            <div className="aspect-square">
              <img
                src={gallery[activeImg]}
                alt={product.name}
                className="h-full w-full object-contain p-10"
              />
            </div>
          </div>
          <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar">
            {gallery.map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border bg-card p-2 transition ${
                  activeImg === i ? "border-accent ring-2 ring-accent/30" : "hover:border-foreground/30"
                }`}
                aria-label={`View image ${i + 1}`}
              >
                <img src={src} alt="" className="h-full w-full object-contain" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {product.brand}
            </span>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
              onClick={() => toast("Added to compare", { description: product.name })}
            >
              <GitCompareArrows className="h-4 w-4" /> Add to Compare
            </button>
          </div>

          <h1 className="mt-3 font-display text-2xl font-extrabold leading-tight md:text-3xl">
            {product.name}
          </h1>

          <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[color:var(--price)]">
                {formatBDT(product.price)}
              </span>
              <span className="text-sm text-muted-foreground">(Cash Price)</span>
            </div>
            {product.oldPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatBDT(product.oldPrice)}
              </span>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-b py-3 text-sm">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold">Availability:</span>
              <span className="inline-flex items-center gap-1 text-emerald-600">
                <CheckCircle2 className="h-4 w-4" />
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold">Code:</span>
              <span className="text-muted-foreground">{code}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold">Category:</span>
              <Link
                to="/collection/$slug"
                params={{ slug: cat.slug }}
                className="text-accent hover:underline"
              >
                {cat.name}
              </Link>
            </div>
          </div>

          {/* Quantity */}
          <div className="mt-5">
            <div className="text-sm font-semibold">Select Quantity:</div>
            <div className="mt-2 inline-flex items-center rounded-full border bg-card">
              <button
                className="p-2.5"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-sm font-semibold">{qty}</span>
              <button className="p-2.5" onClick={() => setQty((q) => q + 1)} aria-label="Increase">
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              onClick={handleBuyNow}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-sm transition hover:brightness-110"
            >
              <Zap className="h-4 w-4" /> Shop Now
            </button>
            <button
              onClick={handleAdd}
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-foreground/15 bg-card px-6 py-3 text-sm font-semibold hover:border-accent hover:text-accent"
            >
              <ShoppingCart className="h-4 w-4" /> Add To Cart
            </button>
          </div>

          {/* Whatsapp */}
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`Hi, I'm interested in ${product.name}`)}`}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-50 px-6 py-3 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200 transition hover:bg-emerald-100"
          >
            <MessageCircle className="h-4 w-4" /> Chat on Whatsapp
          </a>

          {/* Delivery */}
          <div className="mt-4 flex items-center gap-3 rounded-xl border bg-card px-4 py-3 text-sm">
            <Truck className="h-5 w-5 text-accent" />
            <span>
              <span className="text-muted-foreground">Delivery Timescale: </span>
              <span className="font-semibold">3-5 Days</span>
            </span>
          </div>

          {/* Perks */}
          <ul className="mt-4 grid grid-cols-3 gap-2 text-xs">
            <li className="flex items-center gap-2 rounded-lg border p-2.5">
              <Repeat className="h-4 w-4 text-accent" /> Easy Exchange
            </li>
            <li className="flex items-center gap-2 rounded-lg border p-2.5">
              <ShieldCheck className="h-4 w-4 text-accent" /> Warranty
            </li>
            <li className="flex items-center gap-2 rounded-lg border p-2.5">
              <Share2 className="h-4 w-4 text-accent" /> Share
            </li>
          </ul>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12">
        <div className="flex flex-wrap gap-2 border-b">
          {(
            [
              { k: "spec", label: "Specification" },
              { k: "desc", label: "Description" },
              { k: "warranty", label: "Warranty" },
            ] as { k: TabKey; label: string }[]
          ).map((t) => (
            <button
              key={t.k}
              onClick={() => setTab(t.k)}
              className={`-mb-px rounded-t-lg px-4 py-2.5 text-sm font-semibold transition ${
                tab === t.k
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="rounded-b-2xl border border-t-0 bg-card p-5 md:p-6">
          {tab === "spec" && (
            <div>
              <h2 className="font-display text-xl font-extrabold">Specification</h2>
              <div className="mt-4 overflow-hidden rounded-xl border">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b bg-muted/40">
                      <th className="w-40 px-4 py-3 text-left font-semibold">Brand</th>
                      <td className="px-4 py-3">{product.brand}</td>
                    </tr>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left font-semibold">Category</th>
                      <td className="px-4 py-3">{cat.name}</td>
                    </tr>
                    {product.specs &&
                      Object.entries(product.specs as Record<string, string>).map(([k, v], i) => (
                        <tr key={k} className={i % 2 === 0 ? "border-b bg-muted/40" : "border-b"}>
                          <th className="px-4 py-3 text-left font-semibold">{k}</th>
                          <td className="px-4 py-3">{v}</td>
                        </tr>
                      ))}
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Code</th>
                      <td className="px-4 py-3 text-muted-foreground">{code}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "desc" && (
            <div>
              <h2 className="font-display text-xl font-extrabold">Description</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Gajitto brings you authentic {product.brand} products with full manufacturer
                warranty, nationwide delivery, and hassle-free after-sales support.
              </p>
            </div>
          )}

          {tab === "warranty" && (
            <div>
              <h2 className="font-display text-xl font-extrabold">Warranty</h2>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>• 1 Year Official Brand Warranty on manufacturing defects.</li>
                <li>• 7-Day easy replacement on DOA (Dead On Arrival) units.</li>
                <li>• Physical damage, water damage and burn marks are not covered.</li>
                <li>• Warranty claims must be raised with the original invoice.</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-14">
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
