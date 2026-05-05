// src/api/blogs.js
import axios from "axios";

const BASE_URL = "https://eatpur.in";
const API = axios.create({
  baseURL: "https://eatpur.in/api",
  headers: {
    "X-API-KEY": "EATPURx220326",
  },
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ===========================================================================
// Blog CRUD & Publishing
// ===========================================================================

export const getBlogs = (params = {}) => API.get("/blog/blogs/", { params });

export const getBlogById = (id) => API.get(`/blog/blogs/${id}/`);

export const getFullBlogById = (id) => API.get(`/blog/blogs/${id}/full/`);

export const createBlog = (formData) =>
  // Let Axios auto-detect FormData to inject the boundary tag!
  API.post("/blog/blogs/", formData);

export const updateBlog = (id, formData, isPartial = false) => {
  const method = isPartial ? "patch" : "put";
  // Let Axios auto-detect FormData to inject the boundary tag!
  return API[method](`/blog/blogs/${id}/`, formData);
};

export const deleteBlog = (id) => API.delete(`/blog/blogs/${id}/`);

export const publishBlog = (id) => API.post(`/blog/blogs/${id}/publish/`);

export const unpublishBlog = (id) => API.post(`/blog/blogs/${id}/unpublish/`);

// ===========================================================================
// Reactions
// ===========================================================================

export const reactToBlog = (id, reaction_type) =>
  API.post(`/blog/blogs/${id}/react/`, { reaction_type });

// ===========================================================================
// Comments
// ===========================================================================

export const getBlogComments = (id, params = {}) =>
  API.get(`/blog/blogs/${id}/comments/`, { params });

export const commentOnBlog = (id, data) =>
  API.post(`/blog/blogs/${id}/comments/`, data);

export const approveBlogComment = (commentId) =>
  API.post(`/blog/comments/${commentId}/approve/`);

// ===========================================================================
// URL Fixer & Base64 Decoder Interceptor
// ===========================================================================

const fixUrlsDeep = (data) => {
  if (typeof data === "string") {
    return data
      .replace("http://66.116.207.88", BASE_URL)
      .replace("http://eatpur.in", BASE_URL);
  }

  if (Array.isArray(data)) {
    return data.map(fixUrlsDeep);
  }

  if (typeof data === "object" && data !== null) {
    const newObj = {};
    for (const key in data) {
      newObj[key] = fixUrlsDeep(data[key]);
    }
    return newObj;
  }

  return data;
};

// Robust Base64 decoder that correctly handles UTF-8 (emojis, special characters in blogs)
// Also normalizes URL-safe base64 (_, -) → standard base64 (+, /) before decoding
const decodeBase64UTF8 = (base64) => {
  const standard = base64.replace(/-/g, "+").replace(/_/g, "/");
  const padded = standard.padEnd(
    standard.length + ((4 - (standard.length % 4)) % 4),
    "=",
  );
  const binString = atob(padded);
  const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0));
  return new TextDecoder().decode(bytes);
};

// Central Interceptor
API.interceptors.response.use(
  (response) => {
    // 1. Check if the backend responded with our expected Base64 encoded payload
    if (response.data && typeof response.data.data === "string") {
      let decodedString;

      try {
        decodedString = decodeBase64UTF8(response.data.data);
      } catch (e) {
        // 🚨 NOT BASE64 → skip decoding
        response.data = fixUrlsDeep(response.data);
        return response;
      }

      const SECURITY_PREFIX = "HEALTHY_LIFE";

      if (!decodedString.startsWith(SECURITY_PREFIX)) {
        console.error("Security mismatch: Missing valid prefix.");
        return Promise.reject(new Error("Insecure API response blocked."));
      }

      const rawJsonString = decodedString.slice(SECURITY_PREFIX.length);
      const parsedJson = JSON.parse(rawJsonString);

      response.data = fixUrlsDeep(parsedJson);
    } else {
      // Fallback: If the backend throws a normal error or unencoded response, just fix URLs
      response.data = fixUrlsDeep(response.data);
    }

    return response;
  },
  (error) => {
    // If the error response itself is base64 encoded, decode it so components can read err.response.data
    if (
      error.response &&
      error.response.data &&
      typeof error.response.data.data === "string"
    ) {
      try {
        const decodedString = decodeBase64UTF8(error.response.data.data);
        const SECURITY_PREFIX = "HEALTHY_LIFE";

        if (decodedString.startsWith(SECURITY_PREFIX)) {
          const rawJsonString = decodedString.slice(SECURITY_PREFIX.length);
          error.response.data = fixUrlsDeep(JSON.parse(rawJsonString));
        }
      } catch (e) {
        // Silently fail decoding and pass original error if something goes wrong
      }
    } else if (error.response && error.response.data) {
      error.response.data = fixUrlsDeep(error.response.data);
    }

    return Promise.reject(error);
  },
);

export default API;
