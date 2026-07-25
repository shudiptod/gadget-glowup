import Link from "next/link";
import { CheckCircle2, Package, MapPin, Receipt, CreditCard } from "lucide-react";
import apiClient from "@/lib/apiClient";
import { Order } from "@/hooks/useOrder";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getOrderDetails(orderNumber: string): Promise<Order | null> {
  try {
    // Note: ensure your apiClient.get returns the data directly,
    // or adjust to (await apiClient.get(...)).data if using axios.
    return await apiClient.get<Order>(`/orders/number/${orderNumber}`);
  } catch {
    return null;
  }
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;

  const orderNumberParam = resolvedSearchParams?.orderNumber;
  const orderNumber = Array.isArray(orderNumberParam) ? orderNumberParam[0] : orderNumberParam;

  const order = orderNumber ? await getOrderDetails(orderNumber) : null;

  return (
    <div className="mx-auto max-w-3xl px-4 pt-4 pb-16 text-center">
      <h1 className="mt-6 font-display text-3xl font-extrabold md:text-4xl">Order Confirmed!</h1>

      <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
        Thank you for shopping with Gajitto. We've received your order and our team will process it
        shortly.
      </p>

      {order ? (
        <div className="mx-auto mt-10 overflow-hidden text-left border rounded-2xl bg-card shadow-sm">
          {/* Header */}
          <div className="bg-muted/30 px-6 py-4 border-b flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Order Number
              </p>
              <p className="mt-1 font-display text-lg font-bold">{order.orderNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Status
              </p>
              <span className="mt-1 inline-block rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-accent capitalize">
                {order.status}
              </span>
            </div>
          </div>

          <div className="p-6 grid gap-8 md:grid-cols-2">
            {/* Left Column: Items & Summary */}
            <div className="space-y-6">
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold mb-4">
                  <Package className="h-4 w-4" /> Order Items
                </h3>
                <ul className="space-y-3">
                  {order.items?.map((item: any) => (
                    <li key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground mr-4">
                        <span className="font-medium text-foreground">{item.quantity}x</span>{" "}
                        {item.name}
                      </span>
                      {/* Using priceAtPurchase based on your previous schema */}
                      <span className="font-medium whitespace-nowrap">
                        {order.currency}{" "}
                        {Number(item.priceAtPurchase * item.quantity).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>
                    {order.currency} {Number(order.subtotal).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>
                    {order.currency} {Number(order.shippingCost).toLocaleString()}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>
                      -{order.currency} {Number(order.discount).toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base border-t mt-2 pt-2">
                  <span>Total</span>
                  <span>
                    {order.currency} {Number(order.totalAmount).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Customer Details */}
            <div className="space-y-6 md:border-l md:pl-8">
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold mb-3">
                  <MapPin className="h-4 w-4" /> Delivery Details
                </h3>
                <address className="not-italic text-sm text-muted-foreground space-y-1">
                  <p className="font-medium text-foreground">
                    {/* Assuming fullName exists based on previous schema contactInfo */}
                    {(order.contactInfo as any).fullName || "Customer"}
                  </p>
                  <p>{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.area}, {order.shippingAddress.city}
                  </p>
                  <p className="pt-2">{(order.contactInfo as any).phone}</p>
                </address>
              </div>

              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold mb-3">
                  <CreditCard className="h-4 w-4" /> Payment Info
                </h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>
                    Method:{" "}
                    <span className="capitalize font-medium text-foreground">
                      {order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod}
                    </span>
                  </p>
                  <p>
                    Status:{" "}
                    <span className="capitalize font-medium text-foreground">
                      {order.paymentStatus}
                    </span>
                  </p>
                </div>
              </div>

              {order.orderNote && (
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-semibold mb-2">
                    <Receipt className="h-4 w-4" /> Order Note
                  </h3>
                  <p className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
                    {order.orderNote}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : orderNumber ? (
        // Fallback UI if the API call fails or returns null, but we still have an order number
        <div className="mx-auto mt-8 max-w-sm rounded-2xl border bg-card p-5 shadow-sm text-center">
          <p className="text-sm font-medium text-muted-foreground">Your Order Number</p>
          <p className="mt-1 font-display text-2xl font-extrabold text-foreground tracking-wide">
            {orderNumber}
          </p>
        </div>
      ) : null}

      <Link
        href="/collection"
        className="mt-10 inline-flex items-center justify-center rounded-full bg-accent px-8 py-3.5 text-sm font-semibold text-accent-foreground shadow-sm transition hover:brightness-110"
      >
        Continue shopping
      </Link>
    </div>
  );
}
