import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import type { ICartItem } from "@/types/api";

// ========================
// 1. TYPES
// ========================

export interface CartItem extends ICartItem {
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

export interface CartResponse {
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

function normalizeCartItem(item: Partial<CartItem> & Record<string, unknown>): CartItem {
    const rawStock = typeof item.stock === "number" ? item.stock : undefined;
    const rawAvailableQuantity =
        typeof item.availableQuantity === "number" ? item.availableQuantity : undefined;
    const stock = rawStock ?? rawAvailableQuantity ?? 0;
    const hasExplicitStockStatus = typeof item.stockStatus === "string";
    const inStock =
        typeof item.inStock === "boolean"
            ? item.inStock
            : typeof item.enoughStock === "boolean"
                ? item.enoughStock
                : stock > 0;

    return {
        id: String(item.id ?? ""),
        productId: String(item.productId ?? ""),
        variantId: String(item.variantId ?? ""),
        name: String(item.name ?? "Untitled item"),
        variantName: String(item.variantName ?? "Default"),
        image: Array.isArray(item.image) ? (item.image as string[]) : null,
        price: String(item.price ?? "0"),
        stock,
        quantity: typeof item.quantity === "number" ? item.quantity : 0,
        slug: String(item.slug ?? ""),
        inStock,
        enoughStock: inStock,
        availableQuantity: stock,
        stockStatus: hasExplicitStockStatus
            ? item.stockStatus
            : inStock === false
                ? "out_of_stock"
                : stock > 0 && stock <= 5
                    ? "limited"
                    : "in_stock",
    };
}

function normalizeCartResponse(response: Partial<CartResponse> & Record<string, unknown>): CartResponse {
    const rawItems = Array.isArray(response.items)
        ? (response.items as Array<Partial<CartItem> & Record<string, unknown>>)
        : [];

    return {
        cartId: String(response.cartId ?? ""),
        items: rawItems.map(normalizeCartItem),
        subtotal: typeof response.subtotal === "number" ? response.subtotal : 0,
        totalQuantity: typeof response.totalQuantity === "number" ? response.totalQuantity : 0,
    };
}

export const useCart = () => {
    return useQuery({
        queryKey: ["cart"],
        queryFn: async () => {
            const response = await apiClient.get<CartResponse>("/cart");
            return normalizeCartResponse(response as Partial<CartResponse> & Record<string, unknown>);
        },

        // Options
        // Unlike customerInfo, we ALWAYS want to fetch the cart (Guest or User)
        enabled: typeof window !== "undefined",
        staleTime: 0, // Cart data changes frequently, so we keep it fresh
    });
};

export const isCartItemAvailable = (item: CartItem | null | undefined) => {
    if (!item) {
        return false;
    }

    if (typeof item.inStock === "boolean") {
        return item.inStock;
    }

    if (typeof item.enoughStock === "boolean") {
        return item.enoughStock;
    }

    return item.stock > 0;
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