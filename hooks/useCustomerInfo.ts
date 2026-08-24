import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { IAuthResponse } from "@/types/api";

// --- The Hook ---
export const useCustomerInfo = (token: string | null) => {
  return useQuery({
    // Unique key: specific to this slug
    queryKey: ["customer-info"],

    // API Call
    queryFn: () =>
      apiClient.get<IAuthResponse>(`/auth/info`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }), // Check your actual API route path

    // Options
    enabled: !!token && typeof window !== "undefined", // Don't fetch if slug is empty/undefined
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes (collections rarely change)
  });
};
