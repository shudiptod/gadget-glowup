import CollectionUI from "@/components/collection-ui";
import apiClient from "@/lib/apiClient";
import { IProduct, PaginatedResponse } from "@/types/api";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getProducts(params: URLSearchParams) {
  try {
    return await apiClient.get<PaginatedResponse<IProduct>>(`/products?${params.toString()}`);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return { data: [], pagination: { total: 0, totalPages: 0, page: 0, limit: 0 } };
  }
}

async function getCategoryData(slug: string) {
  try {
    // We use any here temporarily to easily parse the children property below
    return await apiClient.get<any>(`/products/categories/${slug}`);
  } catch (error) {
    console.error("Failed to fetch category data:", error);
    return { success: false, data: null };
  }
}

export default async function CategoryPage(props: PageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const slug = params.slug;

  const apiParams = new URLSearchParams();
  const limit = typeof searchParams.limit === "string" ? searchParams.limit : "12";
  const page = typeof searchParams.page === "string" ? searchParams.page : "1";

  apiParams.set("limit", limit);
  apiParams.set("page", page);

  if (typeof searchParams.maxPrice === "string") {
    apiParams.set("maxPrice", searchParams.maxPrice);
  }

  // 1. If user checked subcategories in the sidebar, use those.
  // 2. Otherwise, fall back to the main category slug of this page.
  if (typeof searchParams.categories === "string") {
    apiParams.set("category", searchParams.categories.replace(/\|/g, ","));
  } else {
    apiParams.set("category", slug);
  }

  // SSR Data Fetch
  const productData = await getProducts(apiParams);
  const products = productData?.data || [];
  const total = productData?.pagination?.total || 0;
  const totalPages = productData?.pagination?.totalPages || 0;

  const categoryResponse = await getCategoryData(slug);
  const rawData = categoryResponse?.data;

  // Safely extract the children exactly as we did in the mobile nav item
  const childCategories = Array.isArray(rawData) ? rawData : rawData?.children || [];

  return (
    <CollectionUI
      initialProducts={products}
      name={rawData?.name || ""}
      totalProducts={total}
      categories={childCategories}
      totalPages={totalPages}
    />
  );
}
