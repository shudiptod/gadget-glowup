"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import type { IProduct } from "@/types/api";
import Image from "next/image";
import { getOptimizedSupabaseUrl } from "@/lib/utils";
import { useCartAction } from "@/hooks/useCartAction";
import { formatBDT } from "@/lib/utils";
import apiClient from "@/lib/apiClient";

function getProductPrice(product: IProduct) {
  const price = Number(product.price ?? 0);
  return Number.isFinite(price) ? price : 0;
}

const handleProductClick = (productId: string) => {
  try {
    apiClient.post("/search/log", { productId });
  } catch (e) {
    console.error(e);
    return null;
  }
};

export function ProductCard({
  product,
  isSearchResult = false,
}: {
  product: IProduct;
  isSearchResult?: boolean;
}) {
  const price = getProductPrice(product);
  const salePrice = Number(product.salePrice ?? 0);
  const title = String(product.productTitle);
  const image = String(product.thumbnail);
  const optimizedUrl = getOptimizedSupabaseUrl(image, {
    width: 280,
    height: 280,
    resize: "cover",
    format: "webp",
    quality: 100,
  });
  const category = String(product.categoryName);
  const { handleAddToCart, isPending, isAddDisabled, isSuccess, isError } = useCartAction({
    productId: product.productId,
    variantId: product.variantId,
    maxStock: product.stock,
  });

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border bg-card transition hover:-translate-y-0.5 hover:shadow-md">
      {product.stock === 0 && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-background/60 backdrop-blur-[1px]">
          <div className=" bg-accent px-4 py-2 text-sm font-bold uppercase tracking-wider text-background shadow-sm  w-full text-center">
            Out of stock
          </div>
        </div>
      )}
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-muted"
        onClick={() => isSearchResult && handleProductClick(product.productId)}
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
          onClick={() => isSearchResult && handleProductClick(product.productId)}
          href={`/product/${product.slug ?? product.productId}`}
          className="line-clamp-2 min-h-10 text-sm font-medium text-foreground hover:text-accent"
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
            disabled={isAddDisabled || isPending}
            onClick={() => {
              handleAddToCart();
              if (isSearchResult) handleProductClick(product.productId);
            }}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground opacity-90 hover:opacity-100 hover:bg-accent cursor-pointer disabled:opacity-15 disabled:cursor-not-allowed disabled:hover:bg-primary disabled:hover:text-primary-foreground"
            aria-label="Add to cart"
          >
            <ShoppingCart className="h-3.5 w-3.5" /> Add
          </button>
        </div>
      </div>
    </div>
  );
}
