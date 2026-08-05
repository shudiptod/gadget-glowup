"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCart } from "@/providers/cart-context";
import { formatBDT } from "@/lib/utils";
import apiClient from "@/lib/apiClient";
import { SettingsResponse } from "@/lib/types";

async function getHomeSettings() {
  try {
    return await apiClient.get<SettingsResponse>("/settings");
  } catch {
    return null;
  }
}

const CHECKOUT_DRAFT_KEY = "checkout_draft_state";

export default function Page() {
  const { items, updateCartState } = useCart();
  const router = useRouter();

  const [homeSettings, setHomeSettings] = useState<SettingsResponse | null>(null);

  // States
  const [step, setStep] = useState<1 | 2>(1);
  const [address, setAddress] = useState({ name: "", phone: "", address: "", city: "Dhaka" });
  const [zone, setZone] = useState<"inside" | "outside">("inside");
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    address?: string;
    city?: string;
  }>({});

  const [isLoaded, setIsLoaded] = useState(false); // Prevents hydration mismatch and overwriting

  useEffect(() => {
    if (homeSettings) return;
    getHomeSettings().then(setHomeSettings);
  }, []);

  // 1. Load Draft from LocalStorage on mount
  useEffect(() => {
    const draft = localStorage.getItem(CHECKOUT_DRAFT_KEY);
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        if (parsed.step === 1 || parsed.step === 2) setStep(parsed.step);
        if (parsed.address) setAddress(parsed.address);
        if (parsed.zone === "inside" || parsed.zone === "outside") setZone(parsed.zone);
      } catch (e) {
        console.error("Failed to parse checkout draft", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // 2. Save Draft to LocalStorage on change
  useEffect(() => {
    // Only start saving AFTER we've loaded the initial draft, to prevent overwriting it with blanks
    if (isLoaded) {
      localStorage.setItem(CHECKOUT_DRAFT_KEY, JSON.stringify({ step, address, zone }));
    }
  }, [step, address, zone, isLoaded]);

  const subtotal = items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);

  const shippingCost =
    zone === "outside"
      ? Number(homeSettings?.data?.shippingOutsideDhaka || 120)
      : Number(homeSettings?.data?.shippingInsideDhaka || 60);

  const handleReviewOrder = () => {
    const newErrors: typeof errors = {};

    if (address.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    const phone = address.phone.trim();
    const phoneRegex = /^\+?[0-9]+$/; // Allows an optional '+' at the start, followed by only numbers

    if (phone.length < 11) {
      newErrors.phone = "Phone must be at least 11 characters";
    } else if (!phoneRegex.test(phone)) {
      newErrors.phone = "Phone can only contain numbers and an optional '+' sign";
    }
    if (address.address.trim().length < 5) {
      newErrors.address = "Address must be at least 5 characters";
    }
    if (!address.city.trim()) {
      newErrors.city = "City is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setStep(2);
  };

  const placeOrder = async () => {
    try {
      const { orderNumber }: any = await apiClient.post("/orders/v2", {
        address: address,
        zone: zone,
        paymentMethod: "cod",
      });

      updateCartState([]);

      // 3. Clear the draft once the order is successfully placed
      localStorage.removeItem(CHECKOUT_DRAFT_KEY);

      toast.success("Order placed!", { description: "We'll contact you shortly to confirm." });
      router.push(`/checkout/success?orderNumber=${orderNumber}`);
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

  // Prevent rendering the form until the draft is loaded to avoid visual flickering
  if (!isLoaded) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display text-3xl font-extrabold">Checkout</h1>

      <ol className="mt-6 flex items-center gap-2 text-sm">
        {(["Address", "Review"] as const).map((label, i) => {
          const n = (i + 1) as 1 | 2;
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
              {i < 1 && <span className="mx-2 h-px w-8 bg-border" />}
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
                error={errors.name}
                onChange={(v) => {
                  setAddress({ ...address, name: v });
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
              />
              <Field
                label="Phone number"
                value={address.phone}
                error={errors.phone}
                onChange={(v) => {
                  setAddress({ ...address, phone: v });
                  if (errors.phone) setErrors({ ...errors, phone: undefined });
                }}
              />
              <Field
                label="Address"
                value={address.address}
                error={errors.address}
                onChange={(v) => {
                  setAddress({ ...address, address: v });
                  if (errors.address) setErrors({ ...errors, address: undefined });
                }}
              />
              <Field
                label="City"
                value={address.city}
                error={errors.city}
                onChange={(v) => {
                  setAddress({ ...address, city: v });
                  if (errors.city) setErrors({ ...errors, city: undefined });
                }}
              />

              <div className="pt-2">
                <span className="mb-2 block text-xs font-medium text-muted-foreground">
                  Delivery Zone
                </span>
                <div className="space-y-2">
                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 ${zone === "inside" ? "border-accent bg-accent/5" : ""}`}
                  >
                    <input
                      type="radio"
                      name="zone"
                      checked={zone === "inside"}
                      onChange={() => setZone("inside")}
                    />
                    <span className="text-sm font-semibold">Inside Dhaka Metro</span>
                  </label>

                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 ${zone === "outside" ? "border-accent bg-accent/5" : ""}`}
                  >
                    <input
                      type="radio"
                      name="zone"
                      checked={zone === "outside"}
                      onChange={() => setZone("outside")}
                    />
                    <span className="flex flex-col">
                      <span className="text-sm font-semibold">Outside Dhaka / Suburbs</span>
                      <span className="text-xs text-muted-foreground">
                        Savar, Keraniganj, Tongi, etc.
                      </span>
                    </span>
                  </label>
                </div>
              </div>

              <button
                onClick={handleReviewOrder}
                className="mt-4 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground hover:brightness-110 active:scale-95 transition-all"
              >
                Review order
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold">Review your order</h2>
              <div className="rounded-xl bg-muted p-4 text-sm">
                <p className="font-semibold">{address.name}</p>
                <p className="text-muted-foreground">{address.phone}</p>
                <p className="text-muted-foreground">
                  {address.address}, {address.city}
                </p>
                <p className="mt-2 text-xs uppercase text-accent">
                  Delivery: {zone === "inside" ? "Dhaka Metro" : "Outside Dhaka"}
                </p>
              </div>
              <ul className="divide-y rounded-xl border">
                {items.map((i) => {
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
                  onClick={() => setStep(1)}
                  className="rounded-full border px-5 py-2.5 text-sm font-semibold hover:bg-muted"
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
              <dd className="text-price">{formatBDT(subtotal + shippingCost)}</dd>
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
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <label className="block relative pb-4">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none transition-colors ${
          error ? "border-red-500/50 focus:border-red-500" : "border-border focus:border-accent"
        }`}
      />
      {error && <span className="absolute bottom-0 left-1 text-[10px] text-red-500">{error}</span>}
    </label>
  );
}
