---
description: "Use when implementing or modifying the storefront checkout, DGePay initiation, payment redirects, or the payment success page."
---

# Frontend DGePay Checkout Instructions

Implement DGePay within the existing storefront checkout patterns. First inspect the frontend framework, API client, checkout state, authentication handling, and existing success page. Reuse those conventions; do not create a second order flow or expose gateway credentials.

## Backend Contract

- Existing order creation remains a separate first step. Continue using the checkout's existing order endpoint and payload.
- Initiate payment with `POST /api/payments/dgepay/initiate` and JSON `{ "orderId": "<order UUID>" }`.
- Guest orders must also send the saved checkout phone: `{ "orderId": "<order UUID>", "phone": "<phone used for the order>" }`. The backend compares it with the order's saved phone. Signed-in customers must own the order.
- The initiation response is `{ success, paymentUrl, transactionId, orderNumber }`. Redirect the browser to `paymentUrl` only after a successful response.
- The existing `POST /api/orders/v2` response may contain `orderNumber` but not `orderId`. When this is the active order flow, use the existing `GET /api/orders/number/:orderNumber` endpoint to retrieve the order and its UUID, then send that `id` to `/initiate`. Prefer an `orderId` already returned by the actual order endpoint when available.
- Preserve the existing auth behavior/API client so customer cookies or bearer tokens are sent where configured. Do not add gateway authentication headers from the browser.

## Checkout Flow

1. Validate checkout input and create the order once using the existing flow.
2. Retain its order number for recovery/display. Resolve its UUID if the create response does not include it.
3. For a DGePay-selected payment, call the initiation endpoint with the order UUID and, for a guest, the same phone number saved on the order.
4. Disable duplicate submission while requests are in flight. On a definite initiation error, keep the order reference visible and provide a retry path that does not create another order. If the response includes a `transactionId` with an ambiguous gateway error, do not blindly retry initiation; show a recoverable message and retain the reference for support.
5. Navigate to the returned `paymentUrl` using the browser's top-level navigation. Do not iframe or rewrite the gateway URL.
6. Do not mark the order paid in frontend state before redirecting.

## Success Page

The backend's configured frontend return URL is `/checkout/success`. It appends:

- `payment=success`, `payment=failed`, `payment=pending`, or `payment=unverified`
- `orderNumber=<merchant order number>` when known

Read `orderNumber` from the query string. Treat `payment` as a display hint, not as payment proof. Load the order through the existing order-by-number endpoint and use the backend order's `paymentStatus` as the source of truth. Render pending/unverified separately from failure, and provide a path back to order details or support when the status cannot yet be confirmed. Avoid repeatedly polling without a bounded retry policy.

The DGePay IPN and browser-return verification both run server-side. The frontend must not call DGePay directly, store client/API/secret keys, calculate signatures, encrypt payloads, or infer success from gateway query parameters.

## Error And Accessibility Expectations

- Keep the created order number available after navigation failures or refresh where the storefront's existing persistence model permits; do not persist payment secrets or bearer tokens in local storage.
- Show clear loading, retryable error, pending, failed, and confirmed states using the existing design system.
- Ensure duplicate clicks cannot submit multiple orders or initiate concurrent payment requests.
- Preserve keyboard operation, accessible labels, and mobile checkout behavior.

## Acceptance Checks

- Existing cash-on-delivery and other checkout methods still behave as before.
- DGePay creates one order, initiates against that order's UUID and server-calculated total, and navigates to the returned payment URL.
- Guest initiation sends the same phone stored with the order; signed-in initiation uses the shared auth client.
- `/checkout/success?payment=success&orderNumber=...` fetches the order and renders its backend-confirmed payment state.
- Pending, failed, and unverified returns never render a paid/confirmed state unless the fetched order reports it paid.
- No DGePay secret values or cryptographic logic appear in frontend code or browser requests.
