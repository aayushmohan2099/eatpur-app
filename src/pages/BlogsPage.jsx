// src/pages/BlogsPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBlogs } from "../api/blogs";
import { motion } from "framer-motion";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    try {
      const res = await getBlogs();
      setBlogs(res.data.results || res.data); // handles pagination/non-pagination
    } catch (err) {
      console.error("Error fetching blogs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-[#040704]/10 px-6 py-20">
      {/* HEADER */}
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <h1 className="text-5xl font-bold text-eatpur-gold mb-4">Our Blogs</h1>
        <p className="text-eatpur-text-light text-lg">
          Insights, recipes & stories around millet lifestyle.
        </p>
        <br></br>
        <button
          onClick={() => navigate("/")}
          className="mb-6 px-4 py-2 rounded-lg border border-eatpur-gold text-eatpur-gold hover:bg-eatpur-gold hover:text-black transition"
        >
          ← Back to Homepage
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto mb-16"
      >
        <div className="relative bg-gradient-to-r from-[#0B140B]/90 to-[#040704]/90 border border-[#2A3F2A]/50 rounded-3xl p-8 backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Glow */}
          <div className="absolute inset-0 bg-eatpur-gold/5 opacity-20 blur-2xl"></div>

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl text-eatpur-gold font-bold mb-2">
                Write your own Blog ✍️
              </h2>
              <p className="text-eatpur-text-light text-sm md:text-base">
                Share your ideas, recipes, or stories with the world.
                <span className="text-eatpur-green-light">
                  {" "}
                  No signup required.
                </span>
              </p>
            </div>

            <button
              onClick={() => navigate("/write-blog")}
              className="group relative px-6 py-3 rounded-full border border-eatpur-gold text-eatpur-gold font-medium overflow-hidden transition hover:scale-105 hover:shadow-[0_0_25px_rgba(255,201,51,0.25)]"
            >
              <span className="absolute inset-0 bg-eatpur-gold/10 opacity-0 group-hover:opacity-100 transition"></span>
              <span className="relative z-10 flex items-center gap-2">
                Start Writing →
              </span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* LOADING */}
      {loading && (
        <div className="text-center text-eatpur-text-light">
          Loading blogs...
        </div>
      )}

      {/* BLOG GRID */}
      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {blogs.map((blog, idx) => (
          <motion.div
            key={blog.id || idx}
            onClick={() => navigate(`/preview-blog/${blog.id}`)}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ y: -10, scale: 1.02 }}
            className="group relative bg-[#0B140B]/80 border border-[#2A3F2A]/50 rounded-2xl p-6 backdrop-blur-md shadow-xl transition-all duration-500 cursor-pointer overflow-hidden"
          >
            {/* Glow Hover */}
            <div className="absolute inset-0 bg-gradient-to-b from-eatpur-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />

            {/* TITLE */}
            <h2 className="text-2xl text-[#E6D8A8] font-bold mb-3 group-hover:text-eatpur-yellow transition">
              {blog.title}
            </h2>

            {/* DESCRIPTION */}
            <p className="text-eatpur-text text-sm leading-relaxed line-clamp-3">
              {blog.description || blog.content?.slice(0, 120)}
            </p>

            {/* FOOTER */}
            <div className="mt-6 flex items-center justify-between text-sm">
              <span className="text-eatpur-green-light">
                {blog.read_time || "5 min read"}
              </span>

              <span className="text-eatpur-gold opacity-0 group-hover:opacity-100 transition">
                Read →
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {!loading && blogs.length === 0 && (
        <div className="text-center text-eatpur-text-light mt-20">
          No blogs found.
        </div>
      )}
    </div>
  );
}
