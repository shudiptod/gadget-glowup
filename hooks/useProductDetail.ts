import { useQuery, keepPreviousData } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { IProductDetail } from "@/types/api";

export const useProductDetail = (slug: string) => {
  return useQuery({
    // Include params in queryKey so it refetches when page/filter changes
    queryKey: ["product-detail", slug],

    // The generic here tells TS that 'data' will be of type ProductDetail
    queryFn: () => apiClient.get<IProductDetail>(`/products/slug/${slug}`),

    // Keeps the old list visible while loading the new page (great UX)
    placeholderData: keepPreviousData,
    enabled: typeof window !== "undefined",
  });
};
