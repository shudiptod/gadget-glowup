import Link from "next/link";
import { categories } from "@/data/categories";

export function CategoryNav() {
  return (
    <div className="border-b bg-background">
      <div className="mx-auto max-w-7xl overflow-x-auto no-scrollbar px-4">
        <ul className="flex items-center gap-1 py-2 text-sm font-medium">
          <li>
            <Link
              href="/collection"
              className="whitespace-nowrap rounded-full px-3 py-1.5 hover:bg-muted"
            >
              All Products
            </Link>
          </li>
          {categories.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/collection/${c.slug}`}
                className="whitespace-nowrap rounded-full px-3 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
