"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
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
const PENDING_PAYMENT_KEY = "checkout_pending_payment";

type PendingPaymentOrder = {
  orderId?: string;
  orderNumber: string;
  phone: string;
  status: "ready" | "initiating" | "blocked";
  transactionId?: string;
  message?: string;
};

type OrderCreateResponse = {
  orderId?: string;
  id?: string;
  orderNumber?: string;
  data?: {
    orderId?: string;
    id?: string;
    orderNumber?: string;
  };
};

type DgePayResponse = {
  success: boolean;
  paymentUrl?: string;
  transactionId?: string;
  orderNumber?: string;
};

export default function Page() {
  const { items, cartId, isCartLoaded, updateCartState } = useCart();
  const router = useRouter();
  const submissionInProgress = useRef(false);

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
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");
  const [pendingPayment, setPendingPayment] = useState<PendingPaymentOrder | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  useEffect(() => {
    if (homeSettings) return;
    getHomeSettings().then(setHomeSettings);
  }, []);

  // 1. Load Draft from LocalStorage on mount
  useEffect(() => {
    if (!isCartLoaded) return;

    const draft = localStorage.getItem(CHECKOUT_DRAFT_KEY);
    const savedPayment = localStorage.getItem(PENDING_PAYMENT_KEY);
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
    if (savedPayment) {
      try {
        const parsed = JSON.parse(savedPayment) as PendingPaymentOrder;
        if (parsed.orderNumber && parsed.phone && items.length === 0) {
          const recovered =
            parsed.status === "initiating"
              ? {
                  ...parsed,
                  status: "blocked" as const,
                  message:
                    "Payment initiation was interrupted. Contact support with your order number before trying again.",
                }
              : parsed;
          setPendingPayment(recovered);
          localStorage.setItem(PENDING_PAYMENT_KEY, JSON.stringify(recovered));
        } else {
          localStorage.removeItem(PENDING_PAYMENT_KEY);
        }
      } catch (e) {
        console.error("Failed to parse pending payment", e);
      }
    }
    setIsLoaded(true);
  }, [isCartLoaded, items.length]);

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

  const savePendingPayment = (order: PendingPaymentOrder) => {
    setPendingPayment(order);
    localStorage.setItem(PENDING_PAYMENT_KEY, JSON.stringify(order));
  };

  const initiatePayment = async (order: PendingPaymentOrder) => {
    setPaymentError("");
    const inFlightOrder = { ...order, status: "initiating" as const, message: undefined };
    savePendingPayment(inFlightOrder);

    try {
      let orderId = inFlightOrder.orderId;
      if (!orderId) {
        const orderResponse = await apiClient.get<{
          id?: string;
          orderId?: string;
          data?: { id?: string; orderId?: string };
        }>(`/orders/number/${encodeURIComponent(inFlightOrder.orderNumber)}`);
        orderId =
          orderResponse.id ??
          orderResponse.orderId ??
          orderResponse.data?.id ??
          orderResponse.data?.orderId;
      }
      if (!orderId) throw new Error("We couldn't retrieve the order reference. Please try again.");

      const response = await apiClient.post<DgePayResponse>("/payments/dgepay/initiate", {
        orderId,
        phone: inFlightOrder.phone,
      });

      if (!response.success || !response.paymentUrl) {
        if (response.transactionId) {
          savePendingPayment({
            ...inFlightOrder,
            orderId,
            status: "blocked",
            transactionId: response.transactionId,
            message:
              "We couldn't confirm the payment session. Please contact support before retrying.",
          });
          return;
        }
        throw new Error(
          "Payment could not be started. You can retry without placing another order.",
        );
      }

      savePendingPayment({
        ...inFlightOrder,
        orderId,
        status: "blocked",
        transactionId: response.transactionId,
        message: "Payment session created. Redirecting to DgePay...",
      });
      window.location.assign(response.paymentUrl);
    } catch (error) {
      const errorPayload = (
        error as {
          response?: {
            data?: { transactionId?: string; data?: { transactionId?: string } };
          };
        }
      )?.response?.data;
      const transactionId = errorPayload?.transactionId ?? errorPayload?.data?.transactionId;
      const message = transactionId
        ? "We couldn't confirm the payment session. Please contact support before retrying."
        : error instanceof Error
          ? error.message
          : "Payment could not be started. You can retry without placing another order.";
      savePendingPayment({
        ...inFlightOrder,
        status: transactionId ? "blocked" : "ready",
        transactionId,
        message,
      });
      setPaymentError(message);
    }
  };

  const retryPayment = async () => {
    if (!pendingPayment || pendingPayment.status !== "ready" || submissionInProgress.current)
      return;
    submissionInProgress.current = true;
    setIsSubmitting(true);
    try {
      await initiatePayment(pendingPayment);
    } finally {
      submissionInProgress.current = false;
      setIsSubmitting(false);
    }
  };

  const placeOrder = async () => {
    if (submissionInProgress.current) return;
    if (!cartId) {
      toast.error("Your cart is still syncing. Please refresh and try again.");
      return;
    }
    submissionInProgress.current = true;
    setIsSubmitting(true);
    try {
      const response = await apiClient.post<OrderCreateResponse>("/orders/v2", {
        cartId,
        address: { ...address, phone: address.phone.trim() },
        zone: zone,
        paymentMethod: paymentMethod === "cod" ? "cod" : "online",
      });

      const orderNumber = response.orderNumber ?? response.data?.orderNumber;
      const orderId =
        response.orderId ?? response.id ?? response.data?.orderId ?? response.data?.id;
      if (!orderNumber)
        throw new Error("The order was created, but its order number was not returned.");
      localStorage.removeItem(CHECKOUT_DRAFT_KEY);
      localStorage.removeItem(PENDING_PAYMENT_KEY);

      if (paymentMethod === "online") {
        updateCartState([]);
        const nextPayment: PendingPaymentOrder = {
          orderId,
          orderNumber,
          phone: address.phone.trim(),
          status: "ready",
        };
        savePendingPayment(nextPayment);
        await initiatePayment(nextPayment);
      } else {
        updateCartState([]);
        toast.success("Order placed!", { description: "We'll contact you shortly to confirm." });
        router.push(`/checkout/success?orderNumber=${encodeURIComponent(orderNumber)}`);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to place order. Please try again.",
      );
    } finally {
      submissionInProgress.current = false;
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) return null;

  if (pendingPayment) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="rounded-2xl border bg-card p-6">
          <h1 className="font-display text-2xl font-extrabold">Complete your payment</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Order{" "}
            <span className="font-semibold text-foreground">{pendingPayment.orderNumber}</span> is
            ready for payment.
          </p>
          {(paymentError || pendingPayment.message) && (
            <p className="mt-4 rounded-lg border border-border bg-muted p-3 text-sm" role="status">
              {paymentError || pendingPayment.message}
              {pendingPayment.transactionId && (
                <span className="mt-1 block text-xs text-muted-foreground">
                  Reference: {pendingPayment.transactionId}
                </span>
              )}
            </p>
          )}
          <div className="mt-5 flex flex-wrap gap-3">
            {pendingPayment.status === "ready" && (
              <button
                onClick={retryPayment}
                disabled={isSubmitting}
                className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Connecting to DgePay..." : "Retry payment"}
              </button>
            )}
            <a
              href={`/checkout/success?orderNumber=${encodeURIComponent(pendingPayment.orderNumber)}`}
              className="rounded-full border px-5 py-2.5 text-sm font-semibold transition hover:bg-muted"
            >
              View order
            </a>
            <a
              href="/support"
              className="rounded-full border px-5 py-2.5 text-sm font-semibold transition hover:bg-muted"
            >
              Contact support
            </a>
          </div>
        </div>
      </div>
    );
  }

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
              <fieldset className="space-y-2">
                <legend className="text-sm font-semibold">Payment method</legend>
                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors ${paymentMethod === "cod" ? "border-accent bg-accent/5" : "hover:bg-muted/50"}`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                  />
                  <span className="text-sm font-semibold">Cash on Delivery</span>
                </label>
                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors ${paymentMethod === "online" ? "border-[#E30D18] bg-[#E30D18]/5" : "hover:bg-muted/50"}`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={() => setPaymentMethod("online")}
                  />
                  <Image
                    src="/images/brand-logos/dgepay-logo.svg"
                    alt="DGePay"
                    width={36}
                    height={36}
                    className="h-9 w-9 shrink-0 rounded-md"
                  />
                  <span className="flex flex-col">
                    <span className="text-sm font-semibold">Pay online with DgePay</span>
                    <span className="text-xs text-muted-foreground">Secure online payment</span>
                  </span>
                </label>
              </fieldset>
              <div className="flex gap-2">
                <button
                  onClick={() => setStep(1)}
                  disabled={isSubmitting}
                  className="rounded-full border px-5 py-2.5 text-sm font-semibold hover:bg-muted"
                >
                  Back
                </button>
                <button
                  onClick={placeOrder}
                  disabled={isSubmitting}
                  className={`flex-1 rounded-full px-5 py-3 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${paymentMethod === "online" ? "bg-[#E30D18] text-white hover:bg-[#c90b15]" : "bg-brand text-brand-foreground hover:brightness-110"}`}
                >
                  <span className="flex items-center justify-center gap-2">
                    {paymentMethod === "online" && (
                      <Image
                        src="/images/brand-logos/dgepay-logo.svg"
                        alt=""
                        width={28}
                        height={28}
                        className="h-7 w-7 shrink-0 rounded bg-white"
                      />
                    )}
                    <span>
                      {isSubmitting
                        ? paymentMethod === "online"
                          ? "Connecting to DgePay..."
                          : "Placing order..."
                        : paymentMethod === "online"
                          ? `Pay with DgePay · ${formatBDT(subtotal + shippingCost)}`
                          : `Place order · ${formatBDT(subtotal + shippingCost)}`}
                    </span>
                  </span>
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
