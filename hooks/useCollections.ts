import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';
import { CollectionResponse, ICollectionListResponse } from '@/types/api';



// --- The Hook ---
export const useCollection = (slug: string) => {
    return useQuery({
        // Unique key: specific to this slug
        queryKey: ['collection', slug],

        // API Call
        queryFn: () => apiClient.get<CollectionResponse>(`/products/categories/${slug}`), // Check your actual API route path

        // Options
        enabled: !!slug && typeof window !== "undefined", // Don't fetch if slug is empty/undefined
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes (collections rarely change)
    });
};


export const useCollectionList = () => {
    return useQuery({
        // Unique key: specific to this slug
        queryKey: ['collection-list'],

        // API Call
        queryFn: () => apiClient.get<ICollectionListResponse>(`/products/categories`), // Check your actual API route path

        // Options
        enabled: typeof window !== "undefined",
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes (collections rarely change)
    });
};


export const useRootCollections = () => {
    return useQuery({
        // Unique key: specific to this slug
        queryKey: ['root-collections'],

        // API Call 
        queryFn: () => apiClient.get<ICollectionListResponse>(`/products/roots`), // Check your actual API route path

        // Options
        enabled: typeof window !== "undefined",
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes (collections rarely change)
    });
};