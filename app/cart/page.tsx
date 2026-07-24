"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import apiClient from "@/lib/apiClient"; // Adjust path
import { toast } from "sonner";
import { formatBDT, getOptimizedSupabaseUrl } from "@/lib/utils";
import { ICartItem, useCart } from "@/providers/cart-context";

export default function CartPage() {
  const { items } = useCart();
  // Dynamically calculate subtotal from global state
  const subtotal = items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);
  const shipping = items.length ? 80 : 0;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <ShoppingBag className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-extrabold">Your cart is empty</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Discover the latest gadgets and add your favorites.
        </p>
        <Link
          href="/collection"
          className="mt-6 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground hover:brightness-110"
        >
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display text-3xl font-extrabold">Your Cart</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <ul className="divide-y rounded-2xl border bg-card">
          {items.map((item) => (
            <CartItemRow key={item.id} item={item} />
          ))}
        </ul>

        <aside className="h-fit rounded-2xl border bg-card p-5 lg:sticky lg:top-24">
          <h2 className="text-sm font-semibold">Order summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>{formatBDT(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Shipping</dt>
              <dd>{formatBDT(shipping)}</dd>
            </div>
            <div className="mt-3 flex justify-between border-t pt-3 text-base font-bold">
              <dt>Total</dt>
              <dd className="text-price">{formatBDT(subtotal + shipping)}</dd>
            </div>
          </dl>
          <Link
            href="/checkout"
            className="mt-5 flex w-full items-center justify-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground hover:brightness-110"
          >
            Proceed to checkout →
          </Link>
        </aside>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Sub-component for individual items to manage their own loading states
// ----------------------------------------------------------------------

function CartItemRow({ item }: { item: ICartItem }) {
  const { fetchCart, removeCartItemState } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);

  // HANDLE QUANTITY UPDATE
  const handleUpdateQty = async (newQty: number) => {
    console.log(newQty);
    if (newQty < 1) return handleRemove();
    if (newQty > item.stock) return toast.error(`Only ${item.stock} in stock`);

    setIsUpdating(true);
    try {
      await apiClient.patch(`/cart/items/${item.id}`, { quantity: newQty });
      await fetchCart(); // Re-sync entire cart to ensure accurate totals
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update quantity");
    } finally {
      setIsUpdating(false);
    }
  };

  // HANDLE REMOVE
  const handleRemove = async () => {
    setIsUpdating(true);
    try {
      await apiClient.delete(`/cart/items/${item.id}`);
      removeCartItemState(item.id); // Instantly remove from UI context
      toast.success("Item removed");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to remove item");
      setIsUpdating(false); // Only toggle false if it fails, otherwise it unmounts
    }
  };

  // Ensure image is a string. If your backend returns an array, use item.image[0]
  const imageUrl = Array.isArray(item.image) ? item.image[0] : item.image;
  const optimizedUrl = getOptimizedSupabaseUrl(imageUrl, {
    width: 100,
    height: 100,
  });
  return (
    <li
      className={`flex gap-4 p-4 transition-opacity ${isUpdating ? "opacity-50 pointer-events-none" : ""}`}
    >
      <Link
        href={`/product/${item.slug}`}
        className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted"
      >
        <img src={optimizedUrl} alt={item.name} className="h-full w-full object-contain p-2" />
      </Link>
      <div className="flex flex-1 flex-col">
        <Link
          href={`/product/${item.slug}`}
          className="line-clamp-2 text-sm font-medium hover:text-accent"
        >
          {item.name}
        </Link>
        {item.variantName && item.variantName !== "Default" && (
          <span className="text-xs text-muted-foreground mt-0.5">{item.variantName}</span>
        )}
        <span className="mt-1 text-sm font-bold text-price">{formatBDT(Number(item.price))}</span>

        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-center rounded-full border">
            <button
              onClick={() => handleUpdateQty(item.quantity - 1)}
              disabled={isUpdating}
              className="p-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Decrease"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
            <button
              onClick={() => handleUpdateQty(item.quantity + 1)}
              disabled={isUpdating || item.quantity >= item.stock}
              className="p-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Increase"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <button
            onClick={handleRemove}
            disabled={isUpdating}
            className="text-xs text-muted-foreground hover:text-destructive disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Remove"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </li>
  );
}
