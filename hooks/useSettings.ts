import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { AppSettings, SettingsResponse } from "@/lib/types";

// 2. GET: Fetch Settings
export const useSettings = () => {
  return useQuery({
    queryKey: ["settings"],
    // Depending on your apiClient wrapper, this returns the data or the axios response
    queryFn: () => apiClient.get<SettingsResponse>("/settings"),
    enabled: typeof window !== "undefined",
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes (Settings rarely change)
  });
};

// 3. PATCH: Update Settings (for your Admin Page)
export const useUpdateSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<AppSettings>) => apiClient.patch<AppSettings>("/settings", data),

    onSuccess: (response) => {
      // Immediately update the 'settings' cache with the new data
      // (Assuming response is the updated settings object)
      queryClient.setQueryData(["settings"], response);

      // Or if your API wraps it: queryClient.setQueryData(['settings'], response.data);
      // Alternatively, just invalidate to force a refetch:
      // queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
};
