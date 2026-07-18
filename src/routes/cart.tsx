import { createFileRoute, Link } from "@tanstack/react-router";
import { cartSubtotal, formatBDT, useCart } from "@/stores/cart";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — Gajitto" },
      { name: "description", content: "Review the items in your cart before checkout." },
      { property: "og:title", content: "Your Cart — Gajitto" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const subtotal = cartSubtotal(items);
  const shipping = items.length ? 80 : 0;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <ShoppingBag className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-extrabold">Your cart is empty</h1>
        <p className="mt-2 text-sm text-muted-foreground">Discover the latest gadgets and add your favorites.</p>
        <Link
          to="/collection"
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
          {items.map((i) => (
            <li key={i.id} className="flex gap-4 p-4">
              <Link to="/product/$slug" params={{ slug: i.slug }} className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
                <img src={i.image} alt={i.name} className="h-full w-full object-contain p-2" />
              </Link>
              <div className="flex flex-1 flex-col">
                <Link to="/product/$slug" params={{ slug: i.slug }} className="line-clamp-2 text-sm font-medium hover:text-accent">
                  {i.name}
                </Link>
                <span className="mt-1 text-sm font-bold text-[color:var(--price)]">{formatBDT(i.price)}</span>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center rounded-full border">
                    <button onClick={() => setQty(i.id, i.qty - 1)} className="p-1.5" aria-label="Decrease"><Minus className="h-3.5 w-3.5" /></button>
                    <span className="w-8 text-center text-sm font-semibold">{i.qty}</span>
                    <button onClick={() => setQty(i.id, i.qty + 1)} className="p-1.5" aria-label="Increase"><Plus className="h-3.5 w-3.5" /></button>
                  </div>
                  <button onClick={() => remove(i.id)} className="text-xs text-muted-foreground hover:text-destructive" aria-label="Remove">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-2xl border bg-card p-5 lg:sticky lg:top-24">
          <h2 className="text-sm font-semibold">Order summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatBDT(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd>{formatBDT(shipping)}</dd></div>
            <div className="mt-3 flex justify-between border-t pt-3 text-base font-bold">
              <dt>Total</dt><dd className="text-[color:var(--price)]">{formatBDT(subtotal + shipping)}</dd>
            </div>
          </dl>
          <Link
            to="/checkout"
            className="mt-5 flex w-full items-center justify-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground hover:brightness-110"
          >
            Proceed to checkout →
          </Link>
        </aside>
      </div>
    </div>
  );
}
