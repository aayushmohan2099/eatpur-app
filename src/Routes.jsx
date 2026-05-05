import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import HomePage from "./pages/HomePage";
import BlogsPage from "./pages/Blog/BlogsPage";
import BlogWriter from "./pages/Blog/BlogWriter";
import PreviewBlog from "./pages/Blog/PreviewBlog";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ProductsPage from "./pages/ProductsPage";
import CheckoutPage from "./pages/CheckoutPage";

// Login now
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/User/Dashboard";

// Placeholders for now
// const ProductsPage = () => <div className="pt-32 text-center text-eatpur-yellow">Products Page</div>;
// const CheckoutPage = () => <div className="pt-32 text-center text-eatpur-yellow">Checkout Page</div>;
const RecipesPage = () => (
  <div className="pt-32 text-center text-eatpur-yellow">Recipes Page</div>
);
const RecipeDetailPage = () => (
  <div className="pt-32 text-center text-eatpur-yellow">Recipe Detail Page</div>
);
const PublishRecipePage = () => (
  <div className="pt-32 text-center text-eatpur-yellow">
    Publish Recipe Page
  </div>
);
// const AboutPage = () => <div className="pt-32 text-center text-eatpur-yellow">About Page</div>;
// const ContactPage = () => <div className="pt-32 text-center text-eatpur-yellow">Contact Page</div>;

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Core Pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/checkout" element={<CheckoutPage />} />
        <Route path="/recipes" element={<RecipesPage />} />
        <Route path="/recipes/new" element={<PublishRecipePage />} />
        <Route path="/recipes/:id" element={<RecipeDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Existing Blogs functionally untouched */}
        <Route path="/blogs" element={<BlogsPage />} />
        <Route path="/blogs/:id" element={<PreviewBlog />} />

        {/* Authoring tools */}
        <Route path="/write-blog" element={<BlogWriter />} />
        <Route path="/preview-blog" element={<PreviewBlog />} />
        <Route path="/preview-blog/:id" element={<PreviewBlog />} />

        {/* Login */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<LoginPage />} />
        <Route path="/user/dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}
