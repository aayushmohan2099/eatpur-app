// src/api/blogs.js
import axios from "axios";
const BASE_URL = "https://eatpur.in";
const API = axios.create({
  baseURL: "https://eatpur.in/api",
  headers: {
    "X-API-KEY": "EATPURx220326",
  },
});

export const getBlogs = (params = {}) => API.get("/blogs/", { params });

export const createBlog = (formData) =>
  API.post("/blogs/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const getBlogById = (id) => {
  return API.get(`/blogs/${id}/`);
};

export const reactToBlog = (id, reaction_type) =>
  API.post(`/blogs/${id}/react/`, { reaction_type });

export const commentOnBlog = (id, data) =>
  API.post(`/blogs/${id}/comment/`, data);

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

// Media interceptor
API.interceptors.response.use((response) => {
  response.data = fixUrlsDeep(response.data);
  return response;
});