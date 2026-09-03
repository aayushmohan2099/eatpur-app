// src/api/logistics.js
import { apiFetch } from "./client";

// ===========================================================================
// 1. EKART AUTHENTICATION (ADMIN)
// ===========================================================================

/**
 * Forces a manual refresh of the Ekart Bearer token.
 */
export const refreshEkartToken = () => {
  return apiFetch("/logistics/auth/refresh/", {
    method: "POST",
  });
};

/**
 * Checks the current active status and expiry of the Ekart token.
 */
export const getEkartTokenStatus = () => {
  return apiFetch("/logistics/auth/refresh/", {
    method: "GET",
  });
};

// ===========================================================================
// 2. SERVICEABILITY & PRICING (CHECKOUT/CUSTOMER)
// ===========================================================================

/**
 * Checks if Ekart delivers to a given pincode (COD, Prepaid, Pickup/Drop).
 * @param {number|string} pincode
 */
export const checkPincodeServiceability = (pincode) => {
  return apiFetch(`/logistics/serviceability/check/${pincode}/`, {
    method: "GET",
  });
};

/**
 * Gets real-time shipping rate estimates based on weight, dimensions, and pincode.
 * @param {Object} payload - { pickupPincode, dropPincode, invoiceAmount, weight, length, height, width, serviceType, paymentType, codAmount }
 */
export const getShippingEstimate = (payload) => {
  return apiFetch("/logistics/serviceability/estimate/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

// ===========================================================================
// 3. SHIPMENT MANAGEMENT (ADMIN)
// ===========================================================================

/**
 * Dispatches a SaleOrder to Ekart and generates the tracking ID.
 * @param {Object} payload - { sale_order_id, payment_mode, pickup_location_alias, service_type, weight, length, height, width, delayed_dispatch, obd_shipment }
 */
export const createShipment = (payload) => {
  return apiFetch("/logistics/shipment/create/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

/**
 * Cancels a shipment via Ekart API and updates the local status.
 * @param {string} tracking_id
 */
export const cancelShipment = (tracking_id) => {
  return apiFetch("/logistics/shipment/cancel/", {
    method: "DELETE",
    body: JSON.stringify({ tracking_id }),
  });
};

/**
 * Fetches JSON data containing the PDF labels for the requested tracking IDs.
 * @param {Array<string>} tracking_ids
 */
export const generateLabels = (tracking_ids) => {
  return apiFetch("/logistics/shipment/labels/", {
    method: "POST",
    body: JSON.stringify({ tracking_ids }),
  });
};

/**
 * Generates a pickup manifest URL for the courier boy.
 * @param {Array<string>} tracking_ids
 */
export const generateManifest = (tracking_ids) => {
  return apiFetch("/logistics/shipment/manifest/", {
    method: "POST",
    body: JSON.stringify({ tracking_ids }),
  });
};

// ===========================================================================
// 4. TRACKING VISIBILITY
// ===========================================================================

/**
 * (Customer/Admin) Lightweight fetch of local DB tracking events. Fast and safe.
 * @param {string} tracking_id
 */
export const getCustomerTracking = (tracking_id) => {
  return apiFetch(`/logistics/tracking/customer/${tracking_id}/`, {
    method: "GET",
  });
};

/**
 * (Admin Only) Forces a live sync from Ekart's servers and updates local DB.
 * @param {string} tracking_id
 */
export const syncLiveTracking = (tracking_id) => {
  return apiFetch(`/logistics/tracking/sync/${tracking_id}/`, {
    method: "GET",
  });
};

// ===========================================================================
// 5. NON-DELIVERY REPORTS (ADMIN)
// ===========================================================================

/**
 * Submits an NDR action (Re-Attempt or RTO) to Ekart.
 * @param {Object} payload - { tracking_id, action, reattempt_date, updated_phone, updated_address, instructions }
 */
export const submitNDRAction = (payload) => {
  return apiFetch("/logistics/ndr/action/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

// ===========================================================================
// 6. ADMIN DASHBOARD & ANALYTICS
// ===========================================================================

/**
 * Returns high-level KPIs: Total Shipped, Delivered, In Transit, RTOs, Pending NDRs.
 */
export const getLogisticsOverview = () => {
  return apiFetch("/logistics/dashboard/overview/", {
    method: "GET",
  });
};

/**
 * Aggregates order values and COD amounts processed through the logistics pipeline.
 */
export const getShippingFinancials = () => {
  return apiFetch("/logistics/dashboard/financials/", {
    method: "GET",
  });
};

/**
 * Paginated view of every API request made to Ekart.
 * @param {number|null} statusCode - Optional filter for HTTP status codes (e.g., 400, 502)
 */
export const getApiAuditLogs = (statusCode = null) => {
  const query = statusCode ? `?status=${statusCode}` : "";
  return apiFetch(`/logistics/dashboard/audit-logs/${query}`, {
    method: "GET",
  });
};

// ===========================================================================
// 7. WAREHOUSE / ADDRESS MANAGEMENT (ADMIN)
// ===========================================================================

/**
 * Fetches all registered Ekart addresses/warehouses and syncs local DB.
 */
export const getEkartAddresses = () => {
  return apiFetch("/logistics/address/", {
    method: "GET",
  });
};

/**
 * Registers a new warehouse/pickup address with Ekart and local DB.
 * @param {Object} payload - { alias, phone, address_line1, address_line2, pincode, city, state, country, latitude, longitude }
 */
export const createEkartAddress = (payload) => {
  return apiFetch("/logistics/address/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};