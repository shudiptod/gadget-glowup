// "use client";
// import { createContext, useContext, useState, useEffect, ReactNode } from "react";
// import apiClient from "@/lib/apiClient";

// type CartItem = { quantity: number /* add other properties you need */ };
// type CartState = {
//   items: CartItem[];
//   totalQuantity: number;
//   fetchCart: () => Promise;
//   updateCartState: (newItems: CartItem[]) => void;
// };

// const CartContext = createContext(undefined);

// export function CartProvider({ children }: { children: ReactNode }) {
//   const [items, setItems] = useState([]);
//   const [totalQuantity, setTotalQuantity] = useState(0);

//   // Function to fetch the cart from the backend
//   const fetchCart = async () => {
//     try {
//       const data = await apiClient.get("/api/cart");
//       setItems(data.items || []);
//       setTotalQuantity(data.totalQuantity || 0);
//     } catch (error) {
//       console.error("Failed to load cart", error);
//     }
//   };

//   // Function to instantly update state from POST/PUT responses
//   const updateCartState = (newItems: CartItem[]) => {
//     setItems(newItems);
//     const qty = newItems.reduce((sum, item) => sum + item.quantity, 0);
//     setTotalQuantity(qty);
//   };

//   // Load cart on initial app load
//   useEffect(() => {
//     fetchCart();
//   }, []);

//   return { children };
// }

// // Custom hook to use the cart easily
// export function useCart() {
//   const context = useContext(CartContext);
//   if (!context) throw new Error("useCart must be used within a CartProvider");
//   return context;
// }
