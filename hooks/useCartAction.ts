"use client";

import { useState, useCallback, useEffect } from "react";
import { useAddToCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { useCart } from "@/providers/cart-context";
import { useRouter } from "next/navigation";

export interface UseCartActionProps {
  productId: string;
  variantId: string; // Strictly typed as a string now
  maxStock: number;
  initialQuantity?: number;
}

export function useCartAction({
  productId,
  variantId,
  maxStock,
  initialQuantity = 1,
}: UseCartActionProps) {
  const { updateCartState } = useCart();
  const [quantity, setQuantity] = useState(initialQuantity);
  const { mutate: addToCart, isPending, isSuccess, isError } = useAddToCart();
  const router = useRouter();

  // Still necessary: Reset quantity to 1 when the user clicks a different variant
  useEffect(() => {
    setQuantity(initialQuantity);
  }, [variantId, initialQuantity]);

  const increaseQuantity = useCallback(() => {
    setQuantity((prev) => (prev < maxStock ? prev + 1 : prev));
  }, [maxStock]);

  const decreaseQuantity = useCallback(() => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  }, []);

  const handleAddToCart = useCallback(
    (directCheckout?: boolean) => {
      if (maxStock < 1) {
        toast.error("This variant is currently out of stock.");
        return;
      }

      if (quantity > maxStock) {
        toast.error(`Only ${maxStock} items available in stock.`);
        return;
      }

      addToCart(
        { productId, variantId, quantity },
        {
          onSuccess: (data: any) => {
            toast.success(`Added ${quantity} item(s) to cart!`);
            if (data?.items?.length > 0) {
              updateCartState(data.items);
            }
            if (directCheckout) {
              router.push("/checkout");
            }
          },
          onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to add to cart.");
          },
        },
      );
    },
    [variantId, maxStock, quantity, productId, addToCart, updateCartState],
  );

  return {
    quantity,
    setQuantity,
    increaseQuantity,
    decreaseQuantity,
    handleAddToCart,
    isPending,
    // Simplified condition: only disabled if out of stock or currently submitting
    isAddDisabled: isPending || maxStock < 1,
    isSuccess,
    isError,
  };
}
