import { decryptResponse } from "../utils/decrypt";

const BASE_URL = "http://66.116.207.88:2203/api";

export async function apiFetch(endpoint, options = {}) {
  const NO_AUTH_ENDPOINTS = [
    "/global/captcha/",
    "/auth/login/",
    "/auth/register/",
    "/auth/refresh/",
  ];

  try {
    const token = localStorage.getItem("access");

    // 🔥 detect public routes
    const isPublic = NO_AUTH_ENDPOINTS.includes(endpoint);

    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    // 🔥 ONLY attach token for protected APIs
    if (token && !isPublic) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers,
      ...options,
    });

    const raw = await res.json();
    const decrypted = decryptResponse(raw);

    if (!decrypted) throw new Error("Decryption failed");

    return decrypted;
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
}
