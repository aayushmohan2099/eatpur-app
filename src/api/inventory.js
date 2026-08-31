// src/api/inventory.js
import { apiFetch } from "./client";

// ===========================================================================
// 1. PRODUCT LIST & DETAIL
// ===========================================================================

/**
 * Fetch paginated list of products (15 per page).
 * Supports optional filters: category, size, tags
 * @param {Object} params - e.g. { page: 1, category: 5, size: 2, tags: "vegan" }
 */
export const getProducts = (params = {}) => {
  // Convert param object to query string
  const queryString = new URLSearchParams(params).toString();
  const url = queryString
    ? `/inventory/products/?${queryString}`
    : "/inventory/products/";

  return apiFetch(url, { method: "GET" });
};

/**
 * Fetch a single product's deeply nested details (Category, Status, Size, Profile, Media, Tags)
 * @param {number} id - The primary key of the product
 */
export const getProductById = (id) => {
  return apiFetch(`/inventory/products/${id}/`, { method: "GET" });
};

// ===========================================================================
// 2. PRODUCT CREATION (ONE-SHOT)
// ===========================================================================

/**
 * Create a base product with multiple variants (sizes), tags, profile, and images in one shot.
 * Note: Since we are passing Multi-Part Form Data (for images), we must override the default
 * Content-Type header so the browser can automatically set the boundary tag.
 * @param {FormData} formData - Built FormData object containing variants JSON and file uploads
 */
export const createProduct = (formData) => {
  return apiFetch("/inventory/products/", {
    method: "POST",
    body: formData,
    headers: {
      // Deleting Content-Type forces the browser to set it automatically with the correct multipart boundary
      "Content-Type": undefined,
    },
  });
};

// ===========================================================================
// 3. PRODUCT UPDATION
// ===========================================================================

/**
 * Update an existing product. Accepts partial JSON string data and new file arrays.
 * Handles deletions of nested elements (via delete_tag_ids / delete_media_ids).
 * @param {number} id - The primary key of the product
 * @param {FormData} formData - Built FormData object
 */
export const updateProduct = (id, formData) => {
  return apiFetch(`/inventory/products/${id}/`, {
    method: "PATCH",
    body: formData,
    headers: {
      "Content-Type": undefined,
    },
  });
};

// ===========================================================================
// 4. PRODUCT DELETION
// ===========================================================================

/**
 * Soft delete a product and all its nested/associated rows.
 * @param {number} id - The primary key of the product
 */
export const deleteProduct = (id) => {
  return apiFetch(`/inventory/products/${id}/`, { method: "DELETE" });
};

// ===========================================================================
// 5. TOGGLE TRENDING
// ===========================================================================

/**
 * Flips the is_trending boolean on a specific product.
 * @param {number} id - The primary key of the product
 */
export const toggleTrending = (id) => {
  return apiFetch(`/inventory/products/${id}/toggle-trending/`, {
    method: "POST",
  });
};

// ===========================================================================
// 6. GET PRODUCT VARIANTS (SIZES)
// ===========================================================================

/**
 * Retrieves all associated sizes/variants for a given product id.
 * @param {number} id - The primary key of the product
 */
export const getProductVariants = (id) => {
  return apiFetch(`/inventory/products/${id}/variants/`, { method: "GET" });
};

// ===========================================================================
// 7. BULK STATUS REVIEW
// ===========================================================================

/**
 * Shift multiple products from REVIEW directly to OUT_OF_STOCK or REJECTED.
 * @param {Array<number>} productIds - Array of product PKs
 * @param {string} newStatus - "OUT_OF_STOCK" or "REJECTED"
 */
export const bulkReviewAction = (productIds, newStatus) => {
  return apiFetch("/inventory/products/bulk-review-action/", {
    method: "POST",
    body: JSON.stringify({
      product_ids: productIds,
      status: newStatus,
    }),
  });
};

// ===========================================================================
// 8. UPDATE QUANTITY & AUTO-CALCULATE STATUS
// ===========================================================================

/**
 * Update the exact stock count for a product variant.
 * Automatically shifts status between LOW, OUT_OF_STOCK, and IN_STOCK.
 * @param {number} id - The primary key of the product
 * @param {number} quantity - The exact new integer quantity
 */
export const updateProductQuantity = (id, quantity) => {
  return apiFetch(`/inventory/products/${id}/update-quantity/`, {
    method: "POST",
    body: JSON.stringify({ quantity }),
  });
};

// ===========================================================================
// 9. PRODUCT CATEGORY CRUD
// ===========================================================================

export const getCategories = () => {
  return apiFetch("/inventory/categories/", { method: "GET" });
};

export const createCategory = (data) => {
  return apiFetch("/inventory/categories/", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateCategory = (id, data) => {
  return apiFetch(`/inventory/categories/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

export const deleteCategory = (id) => {
  return apiFetch(`/inventory/categories/${id}/`, { method: "DELETE" });
};

// ===========================================================================
// 10. PRODUCT CATALOG (PUBLIC)
// ===========================================================================

export const ProductCatalog = (params = {}) => {
  // Clean out empty strings and nulls to keep the URL clean
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([_, v]) => v !== "" && v !== null && v !== undefined,
    ),
  );
  const queryString = new URLSearchParams(cleanParams).toString();
  const url = queryString
    ? `/inventory/public-catalog/?${queryString}`
    : "/inventory/public-catalog/";
  return apiFetch(url, { method: "GET" });
};

// ===========================================================================
// 11. PRODUCT LIKES (PUBLIC)
// ===========================================================================

/**
 * Toggles a like on a product. Works for both authenticated and anonymous (IP-based) users.
 * @param {string} pid - The unique PID of the product
 */
export const toggleProductLike = (pid) => {
  return apiFetch(`/inventory/products/${pid}/like/`, { method: "POST" });
};

// ===========================================================================
// 12. PRODUCT COMMENTS & REVIEWS (AUTHENTICATED)
// ===========================================================================

/**
 * Fetches all approved reviews/comments for a specific product.
 * @param {string} pid - The unique PID of the product
 */
export const getProductComments = (pid) => {
  return apiFetch(`/inventory/products/${pid}/comments/`, { method: "GET" });
};

/**
 * Submits a new review with up to 3 attached images using FormData.
 * @param {string} pid - The unique PID of the product
 * @param {FormData} formData - Contains 'content', 'rating', and multiple 'images' files.
 */
export const createProductComment = (pid, formData) => {
  return apiFetch(`/inventory/products/${pid}/comments/`, {
    method: "POST",
    body: formData,
    headers: {
      "Content-Type": undefined, // Forces browser to set multipart/form-data with correct boundary
    },
  });
};