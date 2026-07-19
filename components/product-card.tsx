"use client";

import Link from "next/link";
import { formatBDT, useCart } from "@/stores/cart";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import type { IProduct } from "@/types/api";
import Image from "next/image";
import { getOptimizedSupabaseUrl } from "@/lib/utils";

function getProductPrice(product: IProduct) {
  const price = Number(product.price ?? 0);
  return Number.isFinite(price) ? price : 0;
}

export function ProductCard({ product }: { product: IProduct }) {
  const add = useCart((s) => s.add);
  const price = getProductPrice(product);
  const salePrice = Number(product.salePrice ?? 0);
  const title = String(product.productTitle);
  const image = String(product.thumbnail);
  const optimizedUrl = getOptimizedSupabaseUrl(image);
  const category = String(product.categoryName);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border bg-card transition hover:-translate-y-0.5 hover:shadow-md">
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-muted"
      >
        <Image
          fill
          unoptimized
          src={
            optimizedUrl ||
            "https://wwsygxbdccehktouuodc.supabase.co/storage/v1/object/public/store-assets/products/images/Redmi%20Note%2015%204G.png"
          }
          alt={title}
          priority
          className="h-full w-full object-cover p-4 transition duration-500 group-hover:scale-105"
        />
        {salePrice > 0 && salePrice < price && (
          <span className="absolute left-2 top-2 rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold text-accent-foreground">
            Save {formatBDT(price - salePrice)}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {category}
        </span>
        <Link
          href={`/product/${product.slug ?? product.id}`}
          className="line-clamp-2 min-h-10 text-sm font-medium hover:text-accent"
        >
          {title}
        </Link>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div className="flex flex-col">
            {salePrice > 0 && salePrice < price && (
              <span className="text-xs text-muted-foreground line-through">{formatBDT(price)}</span>
            )}
            <span className="text-base font-bold text-price">{formatBDT(price)}</span>
          </div>
          <button
            onClick={() => {
              add(product);
              toast.success("Added to cart", { description: title });
            }}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground opacity-90 hover:opacity-100"
            aria-label="Add to cart"
          >
            <ShoppingCart className="h-3.5 w-3.5" /> Add
          </button>
        </div>
      </div>
    </div>
  );
}
