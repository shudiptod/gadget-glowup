"use client";

import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { useCartAction } from "@/hooks/useCartAction";
import { formatBDT } from "@/lib/utils";
import { IProduct, IProductDetail, IProductVariant } from "@/types/api";
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
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import ProductDescription from "./ProductDescription";

interface ProductClientProps {
  productData: IProductDetail;
  cat: { name: string; slug: string; id: string };
  related: IProduct[];
}

export default function ProductClient({ productData, cat, related }: ProductClientProps) {
  const { data: product } = productData;
  const router = useRouter();
  const [tab, setTab] = useState("spec");
  const [activeImg, setActiveImg] = useState(0);
  // Manage variant selection locally
  const [selectedVariant, setSelectedVariant] = useState<IProductVariant | null>(
    product.variants?.[0] || null,
  );

  const {
    quantity,
    increaseQuantity,
    decreaseQuantity,
    handleAddToCart,
    isPending,
    isAddDisabled,
  } = useCartAction({
    productId: product.id,
    variantId: selectedVariant?.id || "",
    maxStock: selectedVariant?.stock || 0,
  });

  const gallery = selectedVariant?.images || [];
  const code = selectedVariant?.sku || "";

  // --- Pricing Calculation based on Interface ---
  const basePrice = parseFloat(selectedVariant?.price || "0");
  let salePrice = basePrice;
  let oldPrice: number | null = null;

  if (selectedVariant?.discountStatus) {
    const discountVal = parseFloat(selectedVariant.discountValue || "0");
    if (selectedVariant.discountType === "PERCENTAGE") {
      salePrice = basePrice - (basePrice * discountVal) / 100;
    } else {
      salePrice = basePrice - discountVal;
    }
    oldPrice = basePrice; // Show the original price crossed out
  }

  const inStock = (selectedVariant?.stock || 0) > 0;
  // Fallback for brand since it's missing from the interface
  const displayBrand =
    (selectedVariant?.options && selectedVariant?.options["Brand"]?.val) ??
    product.categoryName ??
    "";

  const handleBuyNow = () => {
    handleAddToCart(true);
  };

  const handleVariantChange = (variant: IProductVariant) => {
    setSelectedVariant(variant);
    setActiveImg(0); // Reset the image to the first one of the new variant
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
          <div className="relative overflow-hidden rounded-2xl border bg-card">
            <div className="aspect-square relative">
              {gallery[activeImg] && (
                <Image
                  fill
                  src={gallery[activeImg]}
                  alt={product.title}
                  className={`h-full w-full object-contain p-10 transition-opacity ${
                    !inStock ? "opacity-40" : ""
                  }`}
                />
              )}
              {/* --- OUT OF STOCK OVERLAY --- */}
              {!inStock && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/10 backdrop-blur-[2px]">
                  <span className="rounded-lg bg-destructive px-6 py-2.5 text-lg font-extrabold uppercase tracking-widest text-destructive-foreground shadow-xl">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>
          </div>
          {gallery.length > 0 && (
            <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar">
              {gallery.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border bg-card p-2 transition ${
                    activeImg === i
                      ? "border-accent ring-2 ring-accent/30"
                      : "hover:border-foreground/30"
                  }`}
                  aria-label={`View image ${i + 1}`}
                >
                  <Image fill src={src} alt="" className="h-full w-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-start justify-between gap-4">
            {displayBrand && (
              <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {displayBrand}
              </span>
            )}
            {/* <button
              type="button"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
              onClick={() => toast("Added to compare", { description: product.title })}
            >
              <GitCompareArrows className="h-4 w-4" /> Add to Compare
            </button> */}
          </div>

          <h1 className="mt-3 font-display text-2xl font-extrabold leading-tight md:text-3xl">
            {product.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-price">{formatBDT(salePrice)}</span>
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
            {code && (
              <div className="flex items-center gap-1.5">
                <span className="font-semibold">Code:</span>
                <span className="text-muted-foreground">{code}</span>
              </div>
            )}
            {cat?.name && (
              <div className="flex items-center gap-1.5">
                <span className="font-semibold">Category:</span>
                <Link href={`/collection/${cat.slug}`} className="text-accent hover:underline">
                  {cat.name}
                </Link>
              </div>
            )}
          </div>

          {/* --- VARIANT SELECTOR --- */}
          {product.variants && product.variants.length > 1 && (
            <div className="mt-5">
              <div className="text-sm font-semibold mb-2">Options:</div>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => handleVariantChange(v)}
                    className={`capitalize rounded-lg border px-4 py-2 text-sm transition ${
                      selectedVariant?.id === v.id
                        ? "border-accent bg-accent/5 text-accent font-semibold ring-1 ring-accent"
                        : "hover:border-foreground/30 bg-card"
                    }`}
                  >
                    {v.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5">
            <div className="text-sm font-semibold">Select Quantity:</div>
            <div className="mt-2 inline-flex items-center rounded-full border bg-card">
              <button
                className="p-2.5 disabled:opacity-50"
                onClick={decreaseQuantity}
                disabled={isAddDisabled || quantity <= 1}
                aria-label="Decrease"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
              <button
                className="p-2.5 disabled:opacity-50"
                onClick={increaseQuantity}
                disabled={isAddDisabled || quantity >= (selectedVariant?.stock || 0)}
                aria-label="Increase"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              onClick={handleBuyNow}
              disabled={!inStock}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-sm transition hover:brightness-110 disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
            >
              <Zap className="h-4 w-4" /> Shop Now
            </button>
            <button
              onClick={() => handleAddToCart()}
              disabled={isAddDisabled}
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-foreground/15 bg-card px-6 py-3 text-sm font-semibold hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
            >
              <ShoppingCart className="h-4 w-4" />
              {isPending ? "Adding..." : "Add To Cart"}
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
        <div className="flex flex-wrap gap-2 border-b">
          {(
            [
              { k: "spec", label: "Specification" },
              { k: "desc", label: "Description" },
              // { k: "warranty", label: "Warranty" },
            ] as { k: "spec" | "desc" | "warranty"; label: string }[]
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
                    {displayBrand && (
                      <tr className="border-b bg-muted/40">
                        <th className="w-40 px-4 py-3 text-left font-semibold">Brand</th>
                        <td className="px-4 py-3">{displayBrand}</td>
                      </tr>
                    )}
                    {cat?.name && (
                      <tr className="border-b">
                        <th className="w-40 px-4 py-3 text-left font-semibold">Category</th>
                        <td className="px-4 py-3">{cat.name}</td>
                      </tr>
                    )}
                    {selectedVariant?.options &&
                      Object.entries(selectedVariant.options).map(([k, v], i) => (
                        <tr key={k} className={i % 2 === 0 ? "border-b bg-muted/40" : "border-b"}>
                          <th className="w-40 px-4 py-3 text-left font-semibold">{k}</th>
                          <td className="px-4 py-3">{v.val}</td>
                        </tr>
                      ))}
                    {code && (
                      <tr>
                        <th className="w-40 px-4 py-3 text-left font-semibold">Code</th>
                        <td className="px-4 py-3 text-muted-foreground">{code}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "desc" && (
            <div>
              <h2 className="font-display text-xl font-extrabold">Description</h2>
              <ProductDescription description={product.description} />
            </div>
          )}

          {/* {tab === "warranty" && (
            <div>
              <h2 className="font-display text-xl font-extrabold">Warranty</h2>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>• 1 Year Official Brand Warranty on manufacturing defects.</li>
                <li>• 7-Day easy replacement on DOA units.</li>
                <li>• Physical damage, water damage and burn marks are not covered.</li>
                <li>• Warranty claims must be raised with the original invoice.</li>
              </ul>
            </div>
          )} */}
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
