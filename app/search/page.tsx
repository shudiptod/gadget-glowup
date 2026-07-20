import SearchUI from "@/components/search-ui";
import apiClient from "@/lib/apiClient";
import { IProduct, PaginatedResponse } from "@/types/api";
import { Suspense } from "react";

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

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;

  const query = typeof searchParams.q === "string" ? searchParams.q.trim() : "";
  const limit = typeof searchParams.limit === "string" ? searchParams.limit : "12";

  const apiParams = new URLSearchParams();
  apiParams.set("limit", limit);
  apiParams.set("page", "1");
  if (query) apiParams.set("search", query);

  // SSR Data Fetch for the first page
  const productData = await getProducts(apiParams);
  const products = productData?.data || [];
  const total = productData?.pagination?.total || 0;
  const totalPages = productData?.pagination?.totalPages || 0;

  return (
    <Suspense
      fallback={<div className="px-4 py-10 text-sm text-muted-foreground">Loading search…</div>}
    >
      <SearchUI initialProducts={products} query={query} total={total} totalPages={totalPages} />
    </Suspense>
  );
}
