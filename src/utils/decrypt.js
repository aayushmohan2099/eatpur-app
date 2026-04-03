const SECRET_API_KEY = import.meta.env.VITE_SECRET_API_KEY || "HEALTHY_LIFE";

export function decryptResponse(encryptedResponse) {
  try {
    if (!encryptedResponse?.data) {
      return encryptedResponse; // fallback (non-encrypted)
    }

    let encoded = encryptedResponse.data;

    // Restore padding
    const pad = encoded.length % 4;
    if (pad) encoded += "=".repeat(4 - pad);

    // URL-safe → standard base64
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");

    // Decode base64
    const raw = atob(base64);

    // Remove SECRET_API_KEY prefix
    if (!raw.startsWith(SECRET_API_KEY)) {
      throw new Error("Invalid secret key — possible tampering");
    }

    const jsonStr = raw.slice(SECRET_API_KEY.length);

    return JSON.parse(jsonStr);
  } catch (err) {
    console.error("❌ Decryption failed:", err);
    return null;
  }
}
