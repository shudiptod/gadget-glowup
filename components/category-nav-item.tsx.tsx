// components/category-nav-item.tsx
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import apiClient from "@/lib/apiClient";
import { ICollectionListResponse } from "@/types/api";

export type RootCategory = {
  id: string;
  name: string;
  slug: string;
};

async function getSubcategories(slug: string) {
  try {
    return await apiClient.get<ICollectionListResponse>(`/products/categories/${slug}`);
  } catch (error) {
    return { success: false, data: [] };
  }
}

export async function CategoryNavItem({ category }: { category: RootCategory }) {
  // Fetch children specific to this category item
  const { data: children } = await getSubcategories(category.slug);
  const hasChildren = children && children.length > 0;

  if (!hasChildren) {
    return (
      <li>
        <Link
          href={`/collection/${category.slug}`}
          className="whitespace-nowrap rounded-full px-3 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          {category.name}
        </Link>
      </li>
    );
  }

  return (
    <li className="group relative">
      <Link
        href={`/collection/${category.slug}`}
        className="flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        {category.name}
        <ChevronDown className="h-3 w-3 transition-transform group-hover:rotate-180" />
      </Link>

      {/* Dropdown Menu */}
      <div className="absolute left-0 top-full z-50 hidden w-48 pt-2 group-hover:block">
        <ul className="flex flex-col gap-1 rounded-md border bg-background p-2 shadow-md">
          {children.map((child) => (
            <li key={child.slug}>
              <Link
                href={`/collection/${child.slug}`}
                className="block rounded-sm px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {child.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}
