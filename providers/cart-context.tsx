"use client";
import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import apiClient from "@/lib/apiClient";

// 1. Expand ICartItem to match what your backend actually returns
export interface ICartItem {
  id: string;
  productId: string;
  variantId: string;
  name: string;
  image: string[]; // Adjust to string if your backend returns a single URL
  variantName: string;
  price: string | number;
  stock: number;
  quantity: number;
  slug?: string | null;
}

// 2. Define the expected API response shape
export interface ICartResponse {
  cartId: string;
  items: ICartItem[];
  subtotal: number;
  totalQuantity: number;
}

export interface ICartState {
  items: ICartItem[];
  cartId: string | null;
  isCartLoaded: boolean;
  totalQuantity: number;
  fetchCart: () => Promise<void>;
  updateCartState: (newItems: ICartItem[], cartId?: string | null) => void;
  removeCartItemState: (itemId: string) => void;
}

// 3. Apply the type to the Context
const CartContext = createContext<ICartState | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  // 4. Apply the type to useState
  const [items, setItems] = useState<ICartItem[]>([]);
  const [cartId, setCartId] = useState<string | null>(null);
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const [totalQuantity, setTotalQuantity] = useState<number>(0);
  const cartRequestVersion = useRef(0);

  const fetchCart = async () => {
    const requestVersion = ++cartRequestVersion.current;
    try {
      // 5. Apply the type to the API response
      const data = await apiClient.get<ICartResponse>("/cart", { cache: "no-store" });
      if (requestVersion !== cartRequestVersion.current) return;
      setItems(data.items || []);
      setCartId(data.cartId || null);
      setTotalQuantity(data.totalQuantity || 0);
    } catch (error) {
      console.error("Failed to load cart", error);
    } finally {
      if (requestVersion === cartRequestVersion.current) setIsCartLoaded(true);
    }
  };

  const updateCartState = (newItems: ICartItem[], nextCartId?: string | null) => {
    cartRequestVersion.current += 1;
    setIsCartLoaded(true);
    setItems(newItems);
    if (nextCartId !== undefined) setCartId(nextCartId);
    else if (newItems.length === 0) setCartId(null);
    const qty = newItems.reduce((sum, item) => sum + item.quantity, 0);
    setTotalQuantity(qty);
  };

  const removeCartItemState = (itemId: string) => {
    cartRequestVersion.current += 1;
    setIsCartLoaded(true);
    setItems((prevItems) => {
      const newItems = prevItems.filter((item) => item.id !== itemId);
      // Recalculate total quantity
      const qty = newItems.reduce((sum, item) => sum + item.quantity, 0);
      setTotalQuantity(qty);
      return newItems;
    });
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // 6. CRITICAL FIX: Return the JSX Provider, not a plain object
  return (
    <CartContext.Provider
      value={{
        items,
        cartId,
        isCartLoaded,
        totalQuantity,
        fetchCart,
        updateCartState,
        removeCartItemState,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// 7. Explicitly type the hook return
export function useCart(): ICartState {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
