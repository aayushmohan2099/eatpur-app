// src/api/authApi.js
import { apiFetch } from "./client";

export const getCaptcha = () => {
  return apiFetch("/global/captcha/");
};

export const loginUser = (data) => {
  return apiFetch("/auth/login/", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const registerUser = (data) => {
  return apiFetch("/auth/register/", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const socialAuth = (data) => {
  return apiFetch("/auth/social/", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const refreshToken = (refresh) => {
  return apiFetch("/auth/refresh/", {
    method: "POST",
    body: JSON.stringify({ refresh }),
  });
};

export const getMe = () => {
  return apiFetch("/auth/me/");
};

export const logoutUser = (refresh) => {
  return apiFetch("/auth/logout/", {
    method: "POST",
    body: JSON.stringify({ refresh }),
  });
};

// ===========================================================================
// FRONT PAGE BANNERS (ADMIN)
// ===========================================================================

export const getBanners = () => {
  return apiFetch("/auth/banners/");
};

export const createBanner = (formData) => {
  return apiFetch("/auth/banners/", {
    method: "POST",
    body: formData,
  });
};

export const updateBanner = (id, data, isFormData = false) => {
  return apiFetch(`/auth/banners/${id}/`, {
    method: "PATCH",
    body: isFormData ? data : JSON.stringify(data),
  });
};

export const deleteBanner = (id) => {
  return apiFetch(`/auth/banners/${id}/`, {
    method: "DELETE",
  });
};
