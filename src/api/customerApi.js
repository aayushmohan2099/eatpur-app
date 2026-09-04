// src/api/customerApi.js
import { apiFetch } from "./client";

// ===========================================================================
// CUSTOMER ORDERS & INVOICES
// ===========================================================================

/**
 * Fetch the authenticated user's order history.
 * @param {Object} params - Optional filters: page, payment_status, fulfillment_status, start_date, end_date
 */
export const getCustomerOrders = (params = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([_, v]) => v !== "" && v !== null && v !== undefined,
    ),
  );
  const queryString = new URLSearchParams(cleanParams).toString();
  const url = queryString
    ? `/shop/customer/orders/?${queryString}`
    : "/shop/customer/orders/";
  return apiFetch(url, { method: "GET" });
};

/**
 * Fetch the authenticated user's invoice list (Only PAID orders).
 * @param {Object} params - Optional filters: page, start_date, end_date
 */
export const getCustomerInvoices = (params = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([_, v]) => v !== "" && v !== null && v !== undefined,
    ),
  );
  const queryString = new URLSearchParams(cleanParams).toString();
  const url = queryString
    ? `/shop/customer/invoices/?${queryString}`
    : "/shop/customer/invoices/";
  return apiFetch(url, { method: "GET" });
};

/**
 * Download the detailed JSON payload to render an invoice for a specific order.
 * @param {number|string} orderId
 */
export const getInvoiceDetails = (orderId) => {
  return apiFetch(`/shop/customer/invoices/${orderId}/download/`, {
    method: "GET",
  });
};
