// components/category-nav.tsx
import apiClient from "@/lib/apiClient";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { CategoryNavItem, type RootCategory } from "@/components/category-nav-item.tsx";
import { ICollectionListResponse } from "@/types/api";

async function getRootCategories() {
  try {
    return await apiClient.get<ICollectionListResponse>(`/products/roots`);
  } catch (error) {
    console.error("Failed to fetch roots:", error);
    return { success: false, data: [] };
  }
}

export async function CategoryNav() {
  const { data: categories } = await getRootCategories();

  const visibleCategories = categories.slice(0, 9);
  const hiddenCategories = categories.slice(8);

  return (
    <div className="border-b bg-background">
      <div className="mx-auto max-w-7xl px-4">
        <ul className="flex items-center gap-1 py-2 text-sm font-medium">
          <li>
            <Link
              href="/collection"
              className="whitespace-nowrap rounded-full px-3 py-1.5 hover:bg-muted"
            >
              All Products
            </Link>
          </li>

          {/* Render visible root categories (each fetches its own children) */}
          {visibleCategories.map((c) => (
            <CategoryNavItem key={c.slug} category={c} />
          ))}

          {/* Render "More" Dropdown for hidden root categories */}
          {/* {hiddenCategories.length > 0 && (
            <li className="group relative hidden sm:block">
              <button className="flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
                More <ChevronDown className="h-4 w-4" />
              </button>

              <div className="absolute right-0 top-full z-50 hidden w-48 pt-2 group-hover:block">
                <ul className="flex flex-col gap-1 rounded-md border bg-background p-2 shadow-md">
                  {hiddenCategories.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/collection/${c.slug}`}
                        className="block rounded-sm px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          )} */}
        </ul>
      </div>
    </div>
  );
}
