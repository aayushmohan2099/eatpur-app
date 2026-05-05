import { decryptResponse } from "../utils/decrypt";

const BASE_URL = "https://eatpur.in/api";

// 🔥 Added: Queue for holding requests while the token is seamlessly refreshing
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

    // detect public routes
    const isPublic = NO_AUTH_ENDPOINTS.includes(endpoint);

    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    // ONLY attach token for protected APIs
    if (token && !isPublic) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    let res = await fetch(`${BASE_URL}${endpoint}`, {
      headers,
      ...options,
    });

    // 🔥 SURGICAL FIX: Automatic Token Refresh Interceptor
    if (!isPublic && (res.status === 401 || res.status === 403)) {
      const refreshToken = localStorage.getItem("refresh");

      if (!refreshToken) throw new Error("Session expired. No refresh token.");

      if (isRefreshing) {
        // If a refresh is already in progress, wait in line, then retry original request
        token = await new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });
        headers["Authorization"] = `Bearer ${token}`;
        res = await fetch(`${BASE_URL}${endpoint}`, { headers, ...options });
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
          headers["Authorization"] = `Bearer ${token}`;
          res = await fetch(`${BASE_URL}${endpoint}`, { headers, ...options });
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

    return decrypted;
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
}
