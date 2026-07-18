// hooks/useOrder.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { useRouter } from "next/navigation";

// --- TYPES ---

export interface Address {
    street: string;
    area: string;
    city: string;
    division: string;
    postalCode: string;
}

export interface ContactInfo {
    fullName: string;
    phone: string; // Made required for order processing
    email?: string;
}

export interface CreateOrderInput {
    cartId: string;
    paymentMethod: "cod" | "online";
    contactInfo: ContactInfo;
    shippingAddress: Address;
    orderNote?: string;
}

export interface OrderItem {
    id: string;
    productId: string | null;
    variantId: string | null;
    name: string;
    thumbnailAtPurchase?: string;
    quantity: number;
    priceAtPurchase: number; // Changed to number for easier calculation
    // NEW: Added for Invoice/Order History consistency
    imei?: string;
    warranty?: string;
}

export interface Order {
    id: string;
    orderNumber: string;
    customerId: string | null;
    totalAmount: number;
    subtotal: number;
    currency: string;
    status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
    paymentMethod: "cod" | "online";
    paymentStatus: "unpaid" | "paid" | "refunded" | "failed";
    contactInfo: ContactInfo;
    shippingAddress: Address;
    createdAt: string;
    items: OrderItem[];
    orderNote?: string;
    shippingCost: number; // Added to match printer logic
    discount: number;    // Added to match printer logic
}

type CreateOrderResponse = {
    success: boolean;
    message: string;
    orderId: string;
    orderNumber: string;
    gatewayUrl?: string; // For SSLCommerz/Bkash redirects
}

// --- HOOKS ---

export const useCreateOrder = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: (input: CreateOrderInput) =>
            apiClient.post<CreateOrderResponse>("/orders", input),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });

            // If backend returns a payment gateway URL (online payment), redirect there
            if (response.gatewayUrl) {
                if (typeof window !== "undefined") {
                    window.location.assign(response.gatewayUrl);
                }
                return;
            }

            // Otherwise, go to success page
            if (typeof window !== "undefined") {
                router.push(`/order-success/${response.orderId}`);
            }
        },
    });
};

export const useOrder = (orderId: string) => {
    return useQuery({
        queryKey: ["order", orderId],
        queryFn: () => apiClient.get<Order>(`/orders/${orderId}`),
        enabled: !!orderId && typeof window !== "undefined",
    });
};

/**
 * Hook to fetch all orders for the logged-in user
 */
export const useUserOrders = () => {
    return useQuery({
        queryKey: ["my-orders"],
        queryFn: () => apiClient.get<{ success: boolean; data: Order[] }>("/orders/me"),
    });
};

/**
 * Hook to cancel an order
 */
export const useCancelOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (orderId: string) => apiClient.post(`/orders/${orderId}/cancel`),
        onSuccess: (_, orderId) => {
            queryClient.invalidateQueries({ queryKey: ["order", orderId] });
            queryClient.invalidateQueries({ queryKey: ["my-orders"] });
        },
    });
};