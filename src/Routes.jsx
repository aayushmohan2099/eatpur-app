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

// Role-Based Dashboards
import Dashboard from "./pages/User/Dashboard"; // Customer Dashboard

// Admin Dashboard - Routes
import AdminDashboard from "./pages/Admin/Admin/Dashboard";

import StaffDashboard from "./pages/Admin/Staff/Dashboard";
import InventoryManagerDashboard from "./pages/Admin/InventoryManager/Dashboard";

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

//  Google form
const FeedbackRedirect = () => {
  window.location.href = "https://forms.gle/zTjzmXDamQ9HTyru6";
  return null;
};

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

        {/* Role-Specific Dashboard Routes */}
        <Route path="/user/dashboard" element={<Dashboard />} />
        {/* Admin Dashboard Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route
          path="/admin/dashboard/:tab/:subTab"
          element={<AdminDashboard />}
        />
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
        <Route
          path="/inventory/dashboard"
          element={<InventoryManagerDashboard />}
        />
      </Route>
      {/* Google form */}
      <Route path="/feedback" element={<FeedbackRedirect />} />
    </Routes>
  );
}
