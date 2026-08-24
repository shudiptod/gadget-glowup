import { CreditCard, Truck, Repeat, BadgePercent, Headphones, ShieldCheck } from "lucide-react";

const items = [
  { icon: CreditCard, label: "36 Months EMI" },
  { icon: Truck, label: "Fastest Home Delivery" },
  { icon: Repeat, label: "Best Price Deals" },
  { icon: BadgePercent, label: "Original Products" },
  { icon: ShieldCheck, label: "Warranty Support" },
  { icon: Headphones, label: "After-Sales Service" },
];

export function TrustStrip() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-6">
      <div className="rounded-2xl border bg-card px-3 py-6 md:px-6 relative overflow-auto">
        <ul className="grid grid-cols-6 h-full min-w-max md:static gap-3 md:grid-cols-3 lg:flex lg:gap-2 lg:items-center lg:justify-between w-full">
          {items.map((it) => (
            <li key={it.label} className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                <it.icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium">{it.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
