// src/api/shop.js
import { apiFetch } from "./client";

// ===========================================================================
// RAZORPAY CHECKOUT & PAYMENT FLOW
// ===========================================================================

/**
 * Sends the cart payload to Django to calculate totals and generate a Razorpay Order ID.
 * @param {Object} payload - { items: [{ product_id: 1, quantity: 2 }], coupon_code: "OPTIONAL" }
 */
export const checkoutOrder = (payload) => {
  return apiFetch("/shop/checkout/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

/**
 * Verifies the Razorpay signature on the backend to finalize the transaction.
 * (Backend for this will be built in Phase 4).
 * @param {Object} payload - { razorpay_payment_id, razorpay_order_id, razorpay_signature }
 */
export const verifyPayment = (payload) => {
  return apiFetch("/shop/verify-payment/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};
