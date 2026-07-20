import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

// ========================
// 1. TYPES
// ========================

export interface CartItem {
    id: string;
    productId: string;
    variantId: string;
    name: string;
    variantName: string;
    image: string[] | null;
    price: string;
    stock: number;
    quantity: number;
    slug: string;
}

export interface ICartResponse {
    cartId: string;
    items: CartItem[];
    subtotal: number;
    totalQuantity: number;
}

export interface AddToCartInput {
    productId: string;
    variantId: string;
    quantity: number;
}

export interface UpdateCartInput {
    itemId: string;
    quantity: number;
}

// ========================
// 2. HOOKS
// ========================

export const useCart = () => {
    return useQuery({
        queryKey: ["cart"],
        queryFn: () => apiClient.get<ICartResponse>("/cart"),

        // Options
        // Unlike customerInfo, we ALWAYS want to fetch the cart (Guest or User)
        staleTime: 0, // Cart data changes frequently, so we keep it fresh
    });
};

export const useAddToCart = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: AddToCartInput) => apiClient.post("/cart/items", input),
        onSuccess: () => {
            // Immediately refresh the cart to show the new item
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
    });
};

export const useUpdateCartItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ itemId, quantity }: UpdateCartInput) => apiClient.patch(`/cart/items/${itemId}`, { quantity }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
    });
};

export const useRemoveCartItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (itemId: string) => apiClient.delete(`/cart/items/${itemId}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
    });
};