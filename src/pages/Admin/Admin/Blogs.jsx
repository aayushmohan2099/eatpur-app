// src/pages/Admin/Admin/Blogs.jsx
import React from "react";
import BlogsList from "./BlogComps/BlogsList";
import BlogAnalytics from "./BlogComps/BlogAnalytics";
import AuthorsList from "./BlogComps/AuthorsList";

export default function BlogsWorkspace({ activeSubTab }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200">
      {activeSubTab === "Blog Analytics" && <BlogAnalytics />}
      {activeSubTab === "Pending Approval" && <BlogsList status="PENDING" />}
      {activeSubTab === "Published Blogs" && <BlogsList status="APPROVED" />}
      {activeSubTab === "Push Blogs" && <p> Push blogs to external Blog Sites</p>}
      {activeSubTab === "Authors" && <AuthorsList />}
    </div>
  );
}
