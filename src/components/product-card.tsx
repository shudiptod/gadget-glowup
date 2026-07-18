import { Link } from "@tanstack/react-router";
import type { Product } from "@/data/products";
import { formatBDT, useCart } from "@/stores/cart";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { categoryMap } from "@/data/categories";

export function ProductCard({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border bg-card transition hover:-translate-y-0.5 hover:shadow-md">
      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className="relative block aspect-square overflow-hidden bg-muted"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-contain p-4 transition duration-500 group-hover:scale-105"
        />
        {product.oldPrice && (
          <span className="absolute left-2 top-2 rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold text-accent-foreground">
            Save {formatBDT(product.oldPrice - product.price)}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {categoryMap[product.category].name}
        </span>
        <Link
          to="/product/$slug"
          params={{ slug: product.slug }}
          className="line-clamp-2 min-h-10 text-sm font-medium hover:text-accent"
        >
          {product.name}
        </Link>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div className="flex flex-col">
            {product.oldPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatBDT(product.oldPrice)}
              </span>
            )}
            <span className="text-base font-bold text-[color:var(--price)]">
              {formatBDT(product.price)}
            </span>
          </div>
          <button
            onClick={() => {
              add(product);
              toast.success("Added to cart", { description: product.name });
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
