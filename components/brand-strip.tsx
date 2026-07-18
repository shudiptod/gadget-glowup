import { brands } from "@/data/brands";

export function BrandStrip() {
  return (
    <section className="mx-auto mt-14 max-w-7xl px-4">
      <div className="rounded-2xl border bg-card">
        <ul className="grid grid-cols-2 divide-x divide-y sm:grid-cols-4 lg:grid-cols-8 lg:divide-y-0">
          {brands.map((b) => (
            <li
              key={b}
              className="flex h-20 items-center justify-center px-4 font-display text-lg font-bold text-muted-foreground transition hover:text-foreground"
            >
              {b}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
