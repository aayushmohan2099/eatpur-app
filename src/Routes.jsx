import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";

// --- LAZY LOADED PAGES ---
// These will only download when the user navigates to the route!
const HomePage = lazy(() => import("./pages/HomePage"));
const BlogsPage = lazy(() => import("./pages/BlogsPage"));
const BlogWriter = lazy(() => import("./pages/BlogWriter"));
const PreviewBlog = lazy(() => import("./pages/PreviewBlog"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const Dashboard = lazy(() => import("./pages/User/Dashboard"));

// Placeholders for now
const RecipesPage = () => (
  <div className="pt-32 text-center text-[#C8922A] font-serif">
    Recipes Page
  </div>
);
const RecipeDetailPage = () => (
  <div className="pt-32 text-center text-[#C8922A] font-serif">
    Recipe Detail Page
  </div>
);
const PublishRecipePage = () => (
  <div className="pt-32 text-center text-[#C8922A] font-serif">
    Publish Recipe Page
  </div>
);

// --- VINTAGE LOADING FALLBACK ---
const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center">
    <div className="text-[#6B8E23] font-serif text-2xl tracking-[0.2em] uppercase animate-pulse">
      Loading...
    </div>
  </div>
);

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
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

          {/* Authoring tools (Tiptap will ONLY load here now!) */}
          <Route path="/write-blog" element={<BlogWriter />} />
          <Route path="/preview-blog" element={<PreviewBlog />} />

          {/* Login */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/user/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
