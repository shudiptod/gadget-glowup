"use client";

import { useState } from "react";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";
import { useCart } from "@/providers/cart-context";

export function useRemoveFromCart() {
  const [isPending, setIsPending] = useState(false);
  const { removeCartItemState } = useCart();

  const handleRemove = async (itemId: string) => {
    setIsPending(true);
    try {
      // 1. Delete from backend database
      await apiClient.delete(`/cart/remove/${itemId}`); // Adjust path to match your routes

      // 2. Instantly remove from global frontend state
      removeCartItemState(itemId);

      toast.success("Item removed from cart");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to remove item.");
    } finally {
      setIsPending(false);
    }
  };

  return { handleRemove, isPending };
}
