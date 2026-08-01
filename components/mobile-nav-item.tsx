// components/mobile-nav-item.tsx
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import apiClient from "@/lib/apiClient";
import { ICollection, ICollectionListResponse, IRootCategory } from "@/types/api";

async function getSubcategories(slug: string) {
  try {
    return await apiClient.get<ICollectionListResponse>(`/products/categories/${slug}`);
  } catch (error) {
    return { success: false, data: null as any };
  }
}

export async function MobileNavItem({ category }: { category: IRootCategory }) {
  const { data } = await getSubcategories(category.slug);

  const children = Array.isArray(data) ? data : data?.children || [];
  const hasChildren = children.length > 0;

  if (!hasChildren) {
    return (
      <Link
        href={`/collection/${category.slug}`}
        className="block py-3 text-sm border-b border-border/50 text-muted-foreground hover:text-accent"
      >
        {category.name}
      </Link>
    );
  }

  return (
    <details className="group border-b border-border/50">
      <summary className="flex cursor-pointer items-center justify-between py-3 text-sm text-muted-foreground hover:text-accent list-none [&::-webkit-details-marker]:hidden">
        {category.name}
        <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
      </summary>
      <div className="flex flex-col gap-2 pb-3 pl-4 pt-1">
        {children?.map((child: ICollection) => (
          <Link
            key={child.slug}
            href={`/collection/${child.slug}`}
            className="block py-1.5 text-sm text-muted-foreground hover:text-accent"
          >
            {child.name}
          </Link>
        ))}
      </div>
    </details>
  );
}
