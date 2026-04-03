import { decryptResponse } from "../utils/decrypt";

const BASE_URL = "http://66.116.207.88:2203/api";
const token = localStorage.getItem("access");

export async function apiFetch(endpoint, options = {}) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    const raw = await res.json();

    // 🔥 AUTO DECRYPT HERE
    const decrypted = decryptResponse(raw);

    if (!decrypted) {
      throw new Error("Decryption failed");
    }

    return decrypted;
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
}
