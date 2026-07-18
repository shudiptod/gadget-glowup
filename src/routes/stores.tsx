import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone } from "lucide-react";

export const Route = createFileRoute("/stores")({
  head: () => ({
    meta: [
      { title: "Store locations — Gajitto" },
      { name: "description", content: "Find your nearest Gajitto experience center in Bangladesh." },
      { property: "og:title", content: "Store locations — Gajitto" },
    ],
  }),
  component: Stores,
});

const stores = [
  { name: "Gajitto Gulshan", address: "Road 11, Gulshan 1, Dhaka", phone: "09666-777-001" },
  { name: "Gajitto Dhanmondi", address: "Mirpur Road, Dhanmondi 27, Dhaka", phone: "09666-777-002" },
  { name: "Gajitto Uttara", address: "Sector 3, Uttara, Dhaka", phone: "09666-777-003" },
  { name: "Gajitto Chattogram", address: "GEC Circle, Chattogram", phone: "09666-777-004" },
];

function Stores() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-display text-3xl font-extrabold md:text-4xl">Our Stores</h1>
      <p className="mt-2 text-sm text-muted-foreground">Visit us to try before you buy.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {stores.map((s) => (
          <div key={s.name} className="rounded-2xl border bg-card p-5">
            <h2 className="font-display text-lg font-bold">{s.name}</h2>
            <p className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 h-4 w-4 text-accent" /> {s.address}
            </p>
            <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4 text-accent" /> {s.phone}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
