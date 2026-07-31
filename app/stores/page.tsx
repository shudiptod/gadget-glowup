import { MapPin, Phone } from "lucide-react";

// Type Definition matching your Schema
interface StoreLocation {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  openTime?: string;
  closeTime?: string;
  mapEmbedIframe: string;
}

// Server-side data fetching function
async function getStores(): Promise<StoreLocation[]> {
  try {
    // Replace with your actual absolute API URL
    // { cache: "no-store" } ensures this page is dynamically rendered on every request (SSR)
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stores`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    const { data } = await res.json();
    return data || [];
  } catch (error) {
    console.error("Failed to fetch stores:", error);
    return [];
  }
}

export default async function Page() {
  const stores = await getStores();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-display text-3xl font-extrabold md:text-4xl">Our Stores</h1>
      <p className="mt-2 text-sm text-muted-foreground">Visit us to try before you buy.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {stores.map((s) => (
          <div
            key={s.id}
            className="group flex flex-col overflow-hidden rounded-2xl border bg-card"
          >
            {/* The Google Map Container from previous version */}
            {s.mapEmbedIframe && (
              <div className="relative w-full h-56 bg-muted">
                <div
                  className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0 transition-all duration-500"
                  dangerouslySetInnerHTML={{ __html: s.mapEmbedIframe }}
                />
              </div>
            )}

            {/* Store Details (New UI format) */}
            <div className="p-5 flex-1">
              <h2 className="font-display text-lg font-bold">{s.name}</h2>
              <p className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {s.address}
              </p>
              {s.phone && (
                <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 shrink-0 text-accent" /> {s.phone}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {stores.length === 0 && (
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <MapPin className="mx-auto h-8 w-8 mb-2 opacity-50" />
          <p>No store locations found.</p>
        </div>
      )}
    </div>
  );
}
