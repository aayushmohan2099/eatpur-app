// src/api/client.js
import { decryptResponse } from "../utils/decrypt";

const BASE_URL = "https://eatpur.in/api";

// Queue for holding requests while the token is seamlessly refreshing
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

export async function apiFetch(endpoint, options = {}) {
  const NO_AUTH_ENDPOINTS = [
    "/global/captcha/",
    "/auth/login/",
    "/auth/register/",
    "/auth/refresh/",
  ];

  try {
    let token = localStorage.getItem("access");
    const isPublic = NO_AUTH_ENDPOINTS.includes(endpoint);

    // 1. Build headers safely
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    // 🔥 SURGICAL FIX 1: Strip Content-Type for FormData
    // If FormData is passed, we MUST physically delete the Content-Type key.
    // This allows the browser to automatically set 'multipart/form-data; boundary=...'
    if (options.body instanceof FormData || headers["Content-Type"] === undefined) {
      delete headers["Content-Type"];
    }

    // 2. Attach token
    if (token && !isPublic) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // 🔥 SURGICAL FIX 2: Merge Options Safely
    // 'headers' must come LAST so it overrides any empty headers inside 'options'
    const fetchOptions = {
      ...options,
      headers,
    };

    let res = await fetch(`${BASE_URL}${endpoint}`, fetchOptions);

    // Automatic Token Refresh Interceptor
    if (!isPublic && (res.status === 401 || res.status === 403)) {
      const refreshToken = localStorage.getItem("refresh");

      if (!refreshToken) throw new Error("Session expired. No refresh token.");

      if (isRefreshing) {
        // If a refresh is already in progress, wait in line, then retry original request
        token = await new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });
        fetchOptions.headers["Authorization"] = `Bearer ${token}`;
        res = await fetch(`${BASE_URL}${endpoint}`, fetchOptions);
      } else {
        isRefreshing = true;
        try {
          // Call refresh API directly to avoid infinite loops
          const refreshRes = await fetch(`${BASE_URL}/auth/refresh/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh: refreshToken }),
          });

          if (!refreshRes.ok) throw new Error("Refresh token expired");

          const rawRefresh = await refreshRes.json();
          const decRefresh = decryptResponse(rawRefresh);

          if (!decRefresh || !decRefresh.access)
            throw new Error("Failed to decode refresh data");

          // Update storage with fresh tokens
          token = decRefresh.access;
          localStorage.setItem("access", token);
          if (decRefresh.refresh)
            localStorage.setItem("refresh", decRefresh.refresh);

          processQueue(null, token);

          // Retry the original request seamlessly with the brand new token
          fetchOptions.headers["Authorization"] = `Bearer ${token}`;
          res = await fetch(`${BASE_URL}${endpoint}`, fetchOptions);
        } catch (err) {
          processQueue(err, null);
          // If the refresh token is entirely dead, force logout
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          window.location.href = "/login";
          throw err;
        } finally {
          isRefreshing = false;
        }
      }
    }

    const raw = await res.json();
    const decrypted = decryptResponse(raw);

    if (!decrypted) throw new Error("Decryption failed");

    // 🔥 SURGICAL FIX 3: Catch Backend Errors! 
    // If the HTTP response is 400/401/403/500, throw it so your Modals hit the catch() block instead of faking success.
    if (!res.ok) {
      const errorMsg = decrypted.detail || decrypted.error || "API request failed";
      throw new Error(errorMsg);
    }

    return decrypted;
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
}