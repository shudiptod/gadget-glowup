import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/checkout/success")({
  head: () => ({
    meta: [
      { title: "Order placed — Gajitto" },
      { name: "description", content: "Thanks! Your Gajitto order has been placed." },
      { property: "og:title", content: "Order placed — Gajitto" },
    ],
  }),
  component: Success,
});

function Success() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand/20 text-brand-foreground">
        <CheckCircle2 className="h-9 w-9 text-[color:var(--brand)]" />
      </div>
      <h1 className="mt-6 font-display text-3xl font-extrabold md:text-4xl">Thanks for your order!</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        We've received your order. Our team will call you to confirm within the next few hours.
      </p>
      <Link
        to="/collection"
        className="mt-6 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground hover:brightness-110"
      >
        Continue shopping
      </Link>
    </div>
  );
}
