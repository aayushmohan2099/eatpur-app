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

const formatApiError = (value, fieldName = "") => {
  if (value === null || value === undefined) return "";

  if (typeof value === "string" || typeof value === "number") {
    return fieldName ? `${fieldName}: ${value}` : String(value);
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => formatApiError(item, fieldName))
      .filter(Boolean)
      .join(", ");
  }

  if (typeof value === "object") {
    return Object.entries(value)
      .map(([key, nestedValue]) => formatApiError(nestedValue, key))
      .filter(Boolean)
      .join("; ");
  }

  return "";
};

export async function apiFetch(endpoint, options = {}) {
  const NO_AUTH_ENDPOINTS = [
    "/global/captcha/",
    "/auth/login/",
    "/auth/register/",
    "/auth/refresh/",
    "/auth/social/",
  ];

  try {
    const responseType = options.responseType;
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
    if (
      options.body instanceof FormData ||
      headers["Content-Type"] === undefined
    ) {
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

    if (responseType === "blob") {
      const contentType = (res.headers.get("content-type") || "").toLowerCase();
      const responseBlob = await res.blob();
      const isPdfContent =
        contentType.includes("application/pdf") ||
        (await responseBlob.slice(0, 5).text()) === "%PDF-";
      const shouldReadAsText =
        contentType.includes("application/json") ||
        contentType.includes("text/plain") ||
        contentType.includes("text/json") ||
        (!contentType && !isPdfContent);
      const rawText = shouldReadAsText ? await responseBlob.text() : "";

      if (!res.ok) {
        let errorData = null;

        try {
          errorData = rawText ? JSON.parse(rawText) : null;
        } catch {
          errorData = rawText;
        }

        const decodedErrorData =
          errorData && typeof errorData === "object" && "data" in errorData
            ? decryptResponse(errorData)
            : errorData;

        const errorValue =
          decodedErrorData?.detail ||
          decodedErrorData?.error ||
          decodedErrorData?.errors ||
          decodedErrorData?.message ||
          decodedErrorData;
        throw new Error(formatApiError(errorValue) || "API request failed");
      }

      if (
        contentType.includes("application/json") ||
        contentType.includes("text/plain") ||
        contentType.includes("text/json") ||
        (!contentType && rawText)
      ) {
        try {
          const parsed = rawText ? JSON.parse(rawText) : null;
          const decrypted = parsed ? decryptResponse(parsed) : null;

          if (decrypted && typeof decrypted === "object") {
            return decrypted;
          }

          if (parsed && typeof parsed === "object") {
            return parsed;
          }

          if (typeof decrypted === "string" || typeof parsed === "string") {
            const candidate = decrypted ?? parsed;
            if (candidate?.includes("base64,")) {
              const payload = candidate.split("base64,")[1];
              const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
              const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
              const binary = atob(padded);
              const bytes = new Uint8Array(binary.length);

              for (let i = 0; i < binary.length; i += 1) {
                bytes[i] = binary.charCodeAt(i);
              }

              return new Blob([bytes], { type: "application/pdf" });
            }

            return candidate;
          }
        } catch (error) {
          console.warn("Invoice response was text, not a PDF file:", error);
          return rawText || null;
        }
      }

      const blobType = (responseBlob.type || "").toLowerCase();
      if (blobType.includes("application/json") || blobType.includes("text/json")) {
        const text = await responseBlob.text();

        try {
          const parsed = JSON.parse(text);
          const decrypted = parsed ? decryptResponse(parsed) : null;
          const encodedValue =
            typeof decrypted === "string"
              ? decrypted
              : decrypted?.data || parsed?.data;

          if (typeof encodedValue === "string") {
            const payload = encodedValue.includes("base64,")
              ? encodedValue.split("base64,")[1]
              : encodedValue;

            const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
            const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
            const binary = atob(padded);
            const bytes = new Uint8Array(binary.length);

            for (let i = 0; i < binary.length; i += 1) {
              bytes[i] = binary.charCodeAt(i);
            }

            return new Blob([bytes], { type: "application/pdf" });
          }
        } catch (error) {
          console.warn("Encrypted blob decode failed:", error);
        }

        throw new Error(
          "The invoice endpoint returned JSON instead of a PDF file. Please retry the download.",
        );
      }

      if (blobType.includes("application/pdf")) {
        return responseBlob;
      }

      if (rawText) {
        try {
          return JSON.parse(rawText);
        } catch {
          return rawText;
        }
      }

      return responseBlob;
    }

    const responseText = await res.text();
    let raw = null;

    try {
      raw = responseText ? JSON.parse(responseText) : null;
    } catch (parseError) {
      // 🚨 CAUGHT HTML ERROR PAGE (e.g. Django 500/404)
      console.error(
        "CRITICAL: Received HTML instead of JSON. Backend crashed.",
        responseText,
      );
      throw new Error(
        `Server Error (${res.status}): The backend crashed and returned HTML. Check your Django terminal logs!`,
      );
    }

    const decrypted = raw ? decryptResponse(raw) : null;

    // 🔥 SURGICAL FIX 3: Catch Backend Errors!
    // If the HTTP response is 400/401/403/500, throw it so your Modals hit the catch() block instead of faking success.
    if (!res.ok) {
      const errorValue =
        decrypted?.detail || decrypted?.error || decrypted?.errors || decrypted;
      const errorMsg = formatApiError(errorValue) || "API request failed";
      throw new Error(errorMsg);
    }

    return decrypted;
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
}
