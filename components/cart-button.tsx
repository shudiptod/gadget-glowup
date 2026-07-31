// components/cart-button.tsx
"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/providers/cart-context";

export function CartButton() {
  const { totalQuantity } = useCart();

  return (
    <Link
      href="/cart"
      className="relative rounded-full bg-white/5 p-2.5 hover:bg-white/10 transition-colors hover:text-accent"
    >
      <ShoppingCart className="h-5 w-5" />
      {totalQuantity > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-semibold text-accent-foreground shadow-sm">
          {totalQuantity}
        </span>
      )}
    </Link>
  );
}
