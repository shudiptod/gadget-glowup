"use client";

import { useState, useCallback } from "react";
import { useAddToCart } from "@/hooks/useCart";
import { toast } from "sonner";

export interface UseCartActionProps {
    productId: string;
    variantId: string;
    maxStock: number;
    isProductInStock: boolean;
    initialQuantity?: number;
}

export function useCartAction({ productId, variantId, maxStock, isProductInStock, initialQuantity = 1 }: UseCartActionProps) {
    const [quantity, setQuantity] = useState(initialQuantity);
    const { mutate: addToCart, isPending, isSuccess, isError } = useAddToCart();

    const increaseQuantity = () => setQuantity((prev) => (prev < maxStock ? prev + 1 : prev));
    const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

    const handleAddToCart = () => {
        if (!isProductInStock || quantity > maxStock) return toast.error("Stock unavailable.");

        addToCart(
            { productId, variantId, quantity },
            {
                onSuccess: () => toast.success(`Added ${quantity} x items to cart!`),
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