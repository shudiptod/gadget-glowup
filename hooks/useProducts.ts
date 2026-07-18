import { useQuery, keepPreviousData } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';
import { PaginatedResponse, IProduct } from '@/types/api';

// Define allowed query params
export interface ProductParams {
    page?: number | string;
    limit?: number | string;
    category?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    [key: string]: any; // <--- Allow dynamic keys (Color, Size, etc.)
}

export const useProducts = (params: ProductParams, options?: { enabled?: boolean }) => {
    return useQuery({
        // Include params in queryKey so it refetches when page/filter changes
        queryKey: ['products', params],

        // The generic here tells TS that 'data' will be of type PaginatedResponse<Product>
        queryFn: () => apiClient.get<PaginatedResponse<IProduct>>('/products', {
            params
        }),

        // Keeps the old list visible while loading the new page (great UX)
        placeholderData: keepPreviousData,
        enabled: (options?.enabled ?? true) && typeof window !== "undefined",
    });
};


export const useFeaturedProducts = (limit: number = 8) => {
    return useQuery({
        queryKey: ["featured-products", limit],
        queryFn: async () => apiClient.get<{ data: IProduct[] }>(`/products/featured?limit=${limit}`),
        staleTime: 1000 * 60 * 15,
    });
};


export const useRelatedProducts = (limit: number = 8, id: string) => {
    return useQuery({
        queryKey: ["related-products", limit, id],
        queryFn: async () => apiClient.get<{ data: IProduct[] }>(`/products/related/${id}?limit=${limit}`),
        staleTime: 1000 * 60 * 15,
    });
};