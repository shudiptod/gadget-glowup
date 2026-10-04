"use client";

import { useEffect } from "react";

export default function CheckoutPaymentCleanup({ orderNumber }: { orderNumber: string }) {
  useEffect(() => {
    const pendingPayment = localStorage.getItem("checkout_pending_payment");
    if (!pendingPayment) return;

    try {
      const parsed = JSON.parse(pendingPayment) as { orderNumber?: string };
      if (parsed.orderNumber === orderNumber) {
        localStorage.removeItem("checkout_pending_payment");
      }
    } catch {
      localStorage.removeItem("checkout_pending_payment");
    }
  }, [orderNumber]);

  return null;
}
