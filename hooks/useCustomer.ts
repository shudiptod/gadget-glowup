import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { Order } from "./useOrder";
import { ProfileFormValues } from "@/lib/schema";
import { toast } from "sonner";


export interface IUserProfile {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    avatarUrl?: string;
    isBanned?: boolean;
    addresses?: {
        id: string;
        label: string;
        street: string;
        city: string;
        area: string;
        postalCode?: string;
        isDefault: boolean;
    }[];
}

interface IUserProfileResponse {
    success: boolean;
    user: IUserProfile;
}

// 1. GET PROFILE
export const useProfile = () => {
    return useQuery({
        queryKey: ["my-profile"],
        queryFn: () => apiClient.get<IUserProfileResponse>("/auth/info"),
        enabled: typeof window !== "undefined",
    });
};

// 2. UPDATE PROFILE
export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ProfileFormValues) => apiClient.patch("/auth/update", data),
        onSuccess: () => {
            toast.success("Profile updated successfully");
            // Refetch profile data to show new info immediately
            queryClient.invalidateQueries({ queryKey: ["my-profile"] });
        },
        onError: (error: any) => {
            // Handle Zod error messages sent from backend
            const msg = error.response?.data?.message || "Failed to update profile";
            toast.error(msg);
        },
    });
}

