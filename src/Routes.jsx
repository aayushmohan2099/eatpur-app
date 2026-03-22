// Routes.jsx
import { Routes, Route } from "react-router-dom";
import App from "./App";
import BlogsPage from "./pages/BlogsPage";
import BlogWriter from "./pages/BlogWriter";
import PreviewBlog from "./pages/PreviewBlog";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/blogs" element={<BlogsPage />} />
      <Route path="/write-blog" element={<BlogWriter />} />
      <Route path="/preview-blog" element={<PreviewBlog />} />
      <Route path="/preview-blog/:id" element={<PreviewBlog />} />
    </Routes>
  );
}