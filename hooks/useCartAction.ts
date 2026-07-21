"use client";

import { useState, useCallback } from "react";
import { useAddToCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { useCart } from "@/providers/cart-context";

export interface UseCartActionProps {
    productId: string;
    variantId: string;
    maxStock: number;
    isProductInStock: boolean;
    initialQuantity?: number;
}

export function useCartAction({ productId, variantId, maxStock, isProductInStock, initialQuantity = 1 }: UseCartActionProps) {
    const { updateCartState } = useCart();
    const [quantity, setQuantity] = useState(initialQuantity);
    const { mutate: addToCart, isPending, isSuccess, isError } = useAddToCart();

    const increaseQuantity = () => setQuantity((prev) => (prev < maxStock ? prev + 1 : prev));
    const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

    const handleAddToCart = () => {

        if (isProductInStock === false || quantity > maxStock) {
            toast.error("Stock unavailable.");
            return;
        };

        addToCart(
            { productId, variantId, quantity },
            {
                onSuccess: (data: any) => {
                    toast.success(`Added ${quantity} x items to cart!`);
                    console.log(data);
                    if (data && data?.items && data?.items?.length > 0) {
                        updateCartState(data?.items);
                    }
                },
                onError: (error: any) => toast.error(error.response?.data?.error || "Failed to add to cart."),
            }
        );
    };

    return {
        quantity,
        increaseQuantity,
        decreaseQuantity,
        handleAddToCart,
        isPending,
        isAddDisabled: !isProductInStock || isPending || maxStock < 1,
        isSuccess,
        isError
    };
}