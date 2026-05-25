// src/pages/Admin/Admin/Blogs.jsx
import React from "react";
import BlogsList from "./BlogComps/BlogsList";

export default function BlogsWorkspace({ activeSubTab }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200">
      {activeSubTab === "Blog Analytics" && (
        <p>📁 Render your blog analytics here.</p>
      )}
      {activeSubTab === "Pending Approval" && <BlogsList status="PENDING" />}
      {activeSubTab === "Published Blogs" && <BlogsList status="APPROVED" />}
      {activeSubTab === "Push Blogs" && <p> Push blogs to external Blog Sites</p>}
      {activeSubTab === "Authors" && <p>🏷️ Render your auts here.</p>}
    </div>
  );
}
