import CollectionUI from "@/components/collection-ui";
import apiClient from "@/lib/apiClient";
import { ICollectionListResponse, IProduct, PaginatedResponse } from "@/types/api";

interface PageProps {
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

async function getCategories(slug: string = "") {
  try {
    if (slug === "") {
      return await apiClient.get<ICollectionListResponse>(`/products/roots`);
    }
    return await apiClient.get<ICollectionListResponse>(`/products/categories/${slug}`);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return { success: false, data: [] };
  }
}

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;
  const apiParams = new URLSearchParams();
  const limit = typeof searchParams.limit === "string" ? searchParams.limit : "12";
  const page = typeof searchParams.page === "string" ? searchParams.page : "1";
  apiParams.set("limit", limit);
  apiParams.set("page", page);

  if (typeof searchParams.maxPrice === "string") {
    apiParams.set("maxPrice", searchParams.maxPrice);
  }

  // Handle Categories (API likely expects a comma-separated string)
  if (typeof searchParams.categories === "string") {
    apiParams.set("category", searchParams.categories.replace(/\|/g, ","));
  }

  // SSR Data Fetch
  const productData = await getProducts(apiParams);
  const products = productData?.data || [];
  const total = productData?.pagination?.total || 0;
  const totalPages = productData?.pagination?.totalPages || 0;

  const categoryResponse = await getCategories();
  const categories = categoryResponse?.data;

  return (
    <CollectionUI
      initialProducts={products}
      totalProducts={total}
      categories={categories}
      totalPages={totalPages}
    />
  );
}
