// src/api/blogs.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://66.116.207.88:2203/api",
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

const fixUrlsDeep = (data) => {
  if (typeof data === "string") {
    return data.replace(
      "http://66.116.207.88/media/",
      "http://66.116.207.88:2203/media/"
    );
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