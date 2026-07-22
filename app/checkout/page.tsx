"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCart } from "@/providers/cart-context";
import { formatBDT } from "@/lib/utils";

export default function Page() {
  const { items, updateCartState } = useCart();
  const router = useRouter();

  // 1. Calculate subtotal dynamically from the new CartItem shape
  const subtotal = items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [address, setAddress] = useState({ name: "", phone: "", address: "", city: "Dhaka" });
  const [shipping, setShipping] = useState<"standard" | "express">("standard");
  const shippingCost = shipping === "express" ? 150 : 80;

  const placeOrder = async () => {
    try {
      // TODO: Replace this with your actual API call to create the order
      // await apiClient.post("/api/orders", { address, shipping, items });

      // 2. Clear the cart using the context function we built earlier
      updateCartState([]);

      toast.success("Order placed!", { description: "We'll contact you shortly to confirm." });
      router.push("/checkout/success");
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-extrabold">Your cart is empty</h1>
        <p className="mt-2 text-sm text-muted-foreground">Add items before checking out.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display text-3xl font-extrabold">Checkout</h1>
      <ol className="mt-6 flex items-center gap-2 text-sm">
        {(["Address", "Delivery", "Review"] as const).map((label, i) => {
          const n = (i + 1) as 1 | 2 | 3;
          const active = step === n;
          const done = step > n;
          return (
            <li key={label} className="flex items-center gap-2">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${active ? "bg-accent text-accent-foreground" : done ? "bg-brand text-brand-foreground" : "bg-muted text-muted-foreground"}`}
              >
                {n}
              </span>
              <span className={active ? "font-semibold" : "text-muted-foreground"}>{label}</span>
              {i < 2 && <span className="mx-2 h-px w-8 bg-border" />}
            </li>
          );
        })}
      </ol>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border bg-card p-5">
          {step === 1 && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold">Shipping address</h2>
              <Field
                label="Full name"
                value={address.name}
                onChange={(v) => setAddress({ ...address, name: v })}
              />
              <Field
                label="Phone number"
                value={address.phone}
                onChange={(v) => setAddress({ ...address, phone: v })}
              />
              <Field
                label="Address"
                value={address.address}
                onChange={(v) => setAddress({ ...address, address: v })}
              />
              <Field
                label="City"
                value={address.city}
                onChange={(v) => setAddress({ ...address, city: v })}
              />
              <button
                onClick={() => setStep(2)}
                disabled={!address.name || !address.phone || !address.address}
                className="mt-3 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground disabled:opacity-50"
              >
                Continue to delivery
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold">Delivery method</h2>
              {(["standard", "express"] as const).map((opt) => (
                <label
                  key={opt}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 ${shipping === opt ? "border-accent bg-accent/5" : ""}`}
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="ship"
                      checked={shipping === opt}
                      onChange={() => setShipping(opt)}
                    />
                    <span>
                      <span className="block text-sm font-semibold capitalize">{opt} delivery</span>
                      <span className="block text-xs text-muted-foreground">
                        {opt === "standard" ? "3–5 business days" : "1–2 business days"}
                      </span>
                    </span>
                  </span>
                  <span className="text-sm font-semibold">
                    {formatBDT(opt === "standard" ? 80 : 150)}
                  </span>
                </label>
              ))}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="rounded-full border px-5 py-2.5 text-sm font-semibold"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground"
                >
                  Review order
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold">Review your order</h2>
              <div className="rounded-xl bg-muted p-4 text-sm">
                <p className="font-semibold">{address.name}</p>
                <p className="text-muted-foreground">{address.phone}</p>
                <p className="text-muted-foreground">
                  {address.address}, {address.city}
                </p>
                <p className="mt-2 text-xs uppercase text-accent">{shipping} delivery</p>
              </div>
              <ul className="divide-y rounded-xl border">
                {items.map((i) => {
                  // 3. Handle image array fallback correctly
                  const imageUrl = Array.isArray(i.image) ? i.image[0] : i.image;

                  return (
                    <li key={i.id} className="flex items-center gap-3 p-3">
                      <img
                        src={imageUrl}
                        className="h-14 w-14 rounded-md bg-muted object-contain p-1"
                        alt={i.name}
                      />
                      <div className="flex-1">
                        <p className="line-clamp-1 text-sm font-medium">{i.name}</p>
                        {/* Show variant name if it's not the default placeholder */}
                        {i.variantName && i.variantName !== "Default" && (
                          <p className="text-xs text-muted-foreground">{i.variantName}</p>
                        )}
                        <p className="text-xs text-muted-foreground">Qty {i.quantity}</p>
                      </div>
                      <span className="text-sm font-semibold">
                        {formatBDT(Number(i.price) * i.quantity)}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <div className="flex gap-2">
                <button
                  onClick={() => setStep(2)}
                  className="rounded-full border px-5 py-2.5 text-sm font-semibold"
                >
                  Back
                </button>
                <button
                  onClick={placeOrder}
                  className="flex-1 rounded-full bg-brand px-5 py-3 text-sm font-bold text-brand-foreground hover:brightness-110"
                >
                  Place order · {formatBDT(subtotal + shippingCost)}
                </button>
              </div>
            </div>
          )}
        </div>

        <aside className="h-fit rounded-2xl border bg-card p-5 lg:sticky lg:top-24">
          <h2 className="text-sm font-semibold">Summary</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Items ({items.length})</dt>
              <dd>{formatBDT(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Shipping</dt>
              <dd>{formatBDT(shippingCost)}</dd>
            </div>
            <div className="mt-3 flex justify-between border-t pt-3 text-base font-bold">
              <dt>Total</dt>
              <dd className="text-[color:var(--price)]">{formatBDT(subtotal + shippingCost)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
      />
    </label>
  );
}
