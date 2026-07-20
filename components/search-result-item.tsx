"use client";

import Image from "next/image";
import Link from "next/link";

interface SearchResultItemProps {
  product: any; // Replace with your IProduct type
  onClose: () => void;
}

export default function SearchResultItem({ product, onClose }: SearchResultItemProps) {
  const salePrice = Number(product.salePrice || product.price);
  const basePrice = Number(product.price);
  const hasDiscount = salePrice < basePrice;
  const discountAmt = basePrice - salePrice;

  return (
    <Link
      href={`/product/${product.slug}`}
      onClick={onClose}
      className="group flex flex-col bg-background/50 border border-white/5 rounded-xl p-3 hover:border-accent/50 transition-all hover:shadow-[0_0_15px_rgba(var(--accent),0.1)] relative"
    >
      {/* Out of stock badge */}
      {product.stock <= 0 && (
        <div className="absolute top-3 left-3 z-10 bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full">
          Out of Stock
        </div>
      )}

      {/* Thumbnail */}
      <div className="relative w-full aspect-square mb-3 bg-white/5 rounded-lg overflow-hidden p-2 flex items-center justify-center">
        <Image
          src={product.thumbnail || "/images/placeholder.png"}
          alt={product.productTitle || product.fullTitle}
          fill
          className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Details */}
      <div className="flex flex-col flex-1 min-w-0">
        <h4 className="text-sm font-medium text-white line-clamp-2 leading-tight mb-2 group-hover:text-accent transition-colors">
          {product.fullTitle || product.productTitle}
        </h4>

        <div className="mt-auto space-y-1">
          <div className="font-bold text-base text-white">৳ {salePrice.toLocaleString()}</div>

          {/* Discount Info */}
          {hasDiscount && (
            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-white/40 line-through">৳ {basePrice.toLocaleString()}</span>
              <span className="text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded font-medium">
                ৳ {discountAmt.toLocaleString()} OFF
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
