// src/api/userApi.js
import { apiFetch } from "./client";

// ===========================================================================
// 1, 2 & 3) USER APIS
// ===========================================================================

/**
 * 1) Fetches a paginated list of active users (15 items per page).
 * @param {number} page - The page number to fetch.
 */
export const getUsers = (page = 1) => {
    return apiFetch(`/admin/users/?page=${page}`);
};

/**
 * 1) Fetches ALL related fields of a specific user alongside their role details.
 * @param {number|string} userId - The unique ID of the user.
 */
export const getUserDetail = (userId) => {
    return apiFetch(`/admin/users/detail/${userId}/`);
};

/**
 * 2) Creates a new user record.
 * Note: If uploading an avatar file, pass a FormData object as data and 
 * set headers: { "Content-Type": "multipart/form-data" } to override the default JSON header.
 * @param {Object|FormData} data - The payload containing user registration details.
 */
export const createUser = (data) => {
    const isFormData = data instanceof FormData;
    return apiFetch("/admin/users/create/", {
        method: "POST",
        headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
        body: isFormData ? data : JSON.stringify(data),
    });
};

/**
 * 3) Updates an existing user's record.
 * Note: If updating an avatar file, pass a FormData object as data and 
 * set headers: { "Content-Type": "multipart/form-data" }.
 * @param {number|string} userId - The unique ID of the user to update.
 * @param {Object|FormData} data - The configuration details to update.
 */
export const updateUser = (userId, data) => {
    const isFormData = data instanceof FormData;
    return apiFetch(`/admin/users/update-delete/${userId}/`, {
        method: "PUT", // Alternatively, change to "PATCH" if partial updates are preferred
        headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
        body: isFormData ? data : JSON.stringify(data),
    });
};

/**
 * 3) Performs a soft-delete on a user record while recording their final tracking IP.
 * @param {number|string} userId - The unique ID of the user to delete.
 */
export const deleteUser = (userId) => {
    return apiFetch(`/admin/users/update-delete/${userId}/`, {
        method: "DELETE",
    });
};


// ===========================================================================
// 4 & 5) ROLE APIS
// ===========================================================================

/**
 * 4) Fetches a listing of all non-deleted roles.
 */
export const getRoles = () => {
    return apiFetch("/admin/roles/");
};

/**
 * 5) Creates a new system role.
 * (Enforced on backend: Only allowed for users where role_id = 5)
 * @param {Object} data - Payload containing role configuration (e.g., role_name).
 */
export const createRole = (data) => {
    return apiFetch("/admin/roles/create/", {
        method: "POST",
        body: JSON.stringify(data),
    });
};

/**
 * 5) Updates an existing system role configuration.
 * (Enforced on backend: Only allowed for users where role_id = 5)
 * @param {number|string} roleId - The lookup ID (primary key) of the target role.
 * @param {Object} data - Payload containing modified role specifications.
 */
export const updateRole = (roleId, data) => {
    return apiFetch(`/admin/roles/${roleId}/`, {
        method: "PUT",
    });
};

/**
 * 5) Deletes a system role configuration.
 * (Enforced on backend: Only allowed for users where role_id = 5)
 * @param {number|string} roleId - The lookup ID (primary key) of the target role.
 */
export const deleteRole = (roleId) => {
    return apiFetch(`/admin/roles/${roleId}/`, {
        method: "DELETE",
    });
};