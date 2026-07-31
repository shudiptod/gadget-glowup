import apiClient from "@/lib/apiClient";
import { CategoryNavItem } from "./category-nav-item.tsx";
import { IRootCollectionListResponse, IRootCategory } from "@/types/api";
import { CategoryNavClient } from "./category-nav-client"; // <-- Import the new wrapper

async function getRootCategories() {
  try {
    return await apiClient.get<IRootCollectionListResponse>(`/products/roots`);
  } catch (error) {
    console.error("Failed to fetch roots:", error);
    return { success: false, data: [] as IRootCategory[] };
  }
}

export async function CategoryNav() {
  const { data: categories } = await getRootCategories();

  return (
    <div className="border-b bg-background overflow-visible max-[1280px]:hidden">
      <div className="mx-auto max-w-7xl px-4 py-2">
        {/* Wrap your items with the client component for dynamic measuring */}
        <CategoryNavClient categories={categories}>
          <CategoryNavItem category={{ name: "View All", slug: "", id: "all-collection" }} />
          {categories.map((c) => (
            <CategoryNavItem key={c.slug} category={c} />
          ))}
        </CategoryNavClient>
      </div>
    </div>
  );
}
