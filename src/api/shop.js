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
 * @param {Object} payload - { razorpay_payment_id, razorpay_order_id, razorpay_signature }
 */
export const verifyPayment = (payload) => {
  return apiFetch("/shop/verify-payment/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

// ===========================================================================
// ADMIN ORDER MANAGEMENT
// ===========================================================================

/**
 * Fetch list of all SaleOrders for the admin dashboard.
 * @param {Object} params - e.g., { payment_status: 'PAID', fulfillment_status: 'UNFULFILLED', search: '123' }
 */
export const getAdminOrders = (params = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([_, v]) => v !== "" && v !== null && v !== undefined,
    ),
  );
  const queryString = new URLSearchParams(cleanParams).toString();
  const url = queryString
    ? `/shop/admin/orders/?${queryString}`
    : "/shop/admin/orders/";
  return apiFetch(url, { method: "GET" });
};

/**
 * Fetch aggregated order statistics and financial metrics.
 */
export const getAdminOrderStats = () => {
  return apiFetch("/shop/admin/orders/stats/", { method: "GET" });
};

/**
 * Fetch the chronological timeline for a specific order.
 * @param {number} orderId
 */
export const getAdminOrderTimeline = (orderId) => {
  return apiFetch(`/shop/admin/orders/${orderId}/timeline/`, { method: "GET" });
};
