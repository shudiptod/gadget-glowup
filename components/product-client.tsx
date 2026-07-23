"use client";

import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { formatBDT } from "@/lib/utils";
import { IProduct, IProductDetail } from "@/types/api";
import {
  CheckCircle,
  GitCompareArrows,
  MessageCircle,
  Minus,
  Plus,
  Repeat,
  Share2,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface ProductClientProps {
  productData: IProductDetail;
  cat: { name: string; slug: string; id: string };
  related: IProduct[];
}

export default function ProductClient({ productData, cat, related }: ProductClientProps) {
  const { data: product } = productData;
  const router = useRouter();
  const [tab, setTab] = useState("spec");
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  // Use the first variant as the default since the UI doesn't have variant selectors
  const variant = product.variants?.[0] || null;

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 24;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const gallery = variant?.images || [];
  const code = `GJT-${product.id
    .replace(/[^a-z0-9]/gi, "")
    .toUpperCase()
    .slice(-6)}`;

  // --- Pricing Calculation based on Interface ---
  const basePrice = parseFloat(variant?.price || "0");
  let salePrice = basePrice;
  let oldPrice: number | null = null;

  if (variant?.discountStatus) {
    const discountVal = parseFloat(variant.discountValue || "0");
    if (variant.discountType === "PERCENTAGE") {
      salePrice = basePrice - (basePrice * discountVal) / 100;
    } else {
      salePrice = basePrice - discountVal;
    }
    oldPrice = basePrice; // Show the original price crossed out
  }

  const inStock = (variant?.stock || 0) > 0;
  // Fallback for brand since it's missing from the interface
  const displayBrand = product.categoryName;

  const handleAdd = () => {
    // add(product, qty);
    toast.success("Added to cart", { description: `${qty} × ${product.title}` });
  };

  const handleBuyNow = () => {
    // add(product, qty);
    router.push("/checkout");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <nav className="text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span className="mx-1.5">/</span>
        <Link href={`/collection/${cat.slug}`} className="hover:text-foreground">
          {cat.name}
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-foreground">{product.title}</span>
      </nav>

      <div className="mt-5 grid gap-8 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <div className="overflow-hidden rounded-2xl border bg-card">
            <div className="aspect-square">
              {gallery[activeImg] && (
                <img
                  src={gallery[activeImg]}
                  alt={product.title}
                  className="h-full w-full object-contain p-10"
                />
              )}
            </div>
          </div>
          <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar">
            {gallery.map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border bg-card p-2 transition ${
                  activeImg === i
                    ? "border-accent ring-2 ring-accent/30"
                    : "hover:border-foreground/30"
                }`}
                aria-label={`View image ${i + 1}`}
              >
                <img src={src} alt="" className="h-full w-full object-contain" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-start justify-between gap-4">
            <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {displayBrand}
            </span>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
              onClick={() => toast("Added to compare", { description: product.title })}
            >
              <GitCompareArrows className="h-4 w-4" /> Add to Compare
            </button>
          </div>

          <h1 className="mt-3 font-display text-2xl font-extrabold leading-tight md:text-3xl">
            {product.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[color:var(--price)]">
                {formatBDT(salePrice)}
              </span>
              <span className="text-sm text-muted-foreground">(Cash Price)</span>
            </div>
            {oldPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatBDT(oldPrice)}
              </span>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-b py-3 text-sm">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold">Availability:</span>
              <span
                className={`inline-flex items-center gap-1 ${
                  inStock ? "text-emerald-600" : "text-red-500"
                }`}
              >
                <CheckCircle className="h-4 w-4" />
                {inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold">Code:</span>
              <span className="text-muted-foreground">{code}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold">Category:</span>
              <Link href={`/collection/${cat.slug}`} className="text-accent hover:underline">
                {cat.name}
              </Link>
            </div>
          </div>

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

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              onClick={handleBuyNow}
              disabled={!inStock}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-sm transition hover:brightness-110 disabled:opacity-50"
            >
              <Zap className="h-4 w-4" /> Shop Now
            </button>
            <button
              onClick={handleAdd}
              disabled={!inStock}
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-foreground/15 bg-card px-6 py-3 text-sm font-semibold hover:border-accent hover:text-accent disabled:opacity-50"
            >
              <ShoppingCart className="h-4 w-4" /> Add To Cart
            </button>
          </div>

          <a
            href={`https://wa.me/?text=${encodeURIComponent(`Hi, I'm interested in ${product.title}`)}`}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-50 px-6 py-3 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200 transition hover:bg-emerald-100"
          >
            <MessageCircle className="h-4 w-4" /> Chat on Whatsapp
          </a>

          <div className="mt-4 flex items-center gap-3 rounded-xl border bg-card px-4 py-3 text-sm">
            <Truck className="h-5 w-5 text-accent" />
            <span>
              <span className="text-muted-foreground">Delivery Timescale: </span>
              <span className="font-semibold">3-5 Days</span>
            </span>
          </div>

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

      <div className="mt-12">
        <div className="sticky top-[72px] z-30 -mx-4 mb-8 bg-background/95 px-4 py-3 backdrop-blur-sm sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="flex flex-wrap gap-2">
            {[
              { id: "specification", label: "Specification" },
              { id: "description", label: "Description" },
              { id: "warranty", label: "Warranty" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollTo(item.id)}
                className="rounded-full border bg-card px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:border-accent hover:text-accent"
              >
                {item.label}
              </button>
            ))}
          </div>
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
                      <td className="px-4 py-3">{displayBrand}</td>
                    </tr>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left font-semibold">Category</th>
                      <td className="px-4 py-3">{cat.name}</td>
                    </tr>
                    {variant?.options &&
                      Object.entries(variant.options).map(([k, v], i) => (
                        <tr key={k} className={i % 2 === 0 ? "border-b bg-muted/40" : "border-b"}>
                          <th className="px-4 py-3 text-left font-semibold">{k}</th>
                          <td className="px-4 py-3">{v.val}</td>
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
          </section>

          {tab === "desc" && (
            <div>
              <h2 className="font-display text-xl font-extrabold">Description</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Gajitto brings you authentic {displayBrand} products with full manufacturer
                warranty, nationwide delivery, and hassle-free after-sales support.
              </p>
            </div>
          )}

          <section id="warranty" className="scroll-mt-28">
            <h2 className="font-display text-xl font-extrabold">Warranty</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>• 1 Year Official Brand Warranty on manufacturing defects.</li>
              <li>• 7-Day easy replacement on DOA units.</li>
              <li>• Physical damage, water damage and burn marks are not covered.</li>
              <li>• Warranty claims must be raised with the original invoice.</li>
            </ul>
          </section>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-14">
          <SectionHeading title="Related" accent="Products" />
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {related.map((p) => (
              <ProductCard key={p.productId} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
