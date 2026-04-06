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
    <div className="w-full min-h-screen px-6 relative z-10">
      {/* Hero Section */}
      <section className="pt-16 pb-16 px-6 relative flex flex-col items-center justify-center text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-[#A8C686]/20 to-transparent pointer-events-none -z-10" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img src="/icons/flourish-top.png" alt="" className="h-6 mx-auto mb-4 opacity-50" onError={(e) => e.target.style.display = 'none'} />
          <h1 className="text-6xl md:text-8xl font-serif text-[#2E2410] mb-6 leading-[1.1] tracking-tight">
            Our Blogs
          </h1>
          <p className="text-xl md:text-2xl font-serif italic text-[#5C4F3A] max-w-2xl mx-auto">
            Insights, recipes & stories around millet lifestyle.
          </p>
        </motion.div>
      </section>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto mb-16"
      >
        <div className="vintage-card bg-white p-8 border border-black/5 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-eatpur-green-light/10 to-transparent pointer-events-none"></div>

          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl text-eatpur-dark font-display font-medium mb-2 leading-[1] py-2">
              Write your own Blog ✍️
            </h2>
            <p className="text-eatpur-text text-sm md:text-base">
              Share your ideas, recipes, or stories with the world.
              <span className="text-eatpur-green-dark font-medium ml-1">
                No signup required.
              </span>
            </p>
          </div>

          <button
            onClick={() => navigate("/write-blog")}
            className="btn-primary flex-shrink-0 relative z-10 font-medium"
          >
            Start Writing →
          </button>
        </div>
      </motion.div>

      {/* LOADING */}
      {loading && (
        <div className="text-center text-eatpur-text font-serif italic">Loading stories...</div>
      )}

      {/* BLOG GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {blogs.map((blog, idx) => (
          <motion.div
            key={blog.id || idx}
            onClick={() => navigate(`/preview-blog/${blog.id}`)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="vintage-card bg-white p-6 flex flex-col cursor-pointer border border-black/5 hover:-translate-y-1 transition-transform group"
          >
            {/* TITLE */}
            <h2 className="text-2xl text-eatpur-dark font-display font-medium mb-3 group-hover:text-eatpur-green-dark transition-colors">
              {blog.title}
            </h2>

            {/* DESCRIPTION */}
            <p className="text-eatpur-text text-sm leading-relaxed line-clamp-3 mb-6 font-serif">
              {blog.description || blog.content?.slice(0, 120)}
            </p>

            {/* FOOTER */}
            <div className="mt-auto pt-4 border-t border-black/5 flex items-center justify-between text-xs tracking-widest uppercase font-semibold text-eatpur-text-light">
              <span className="text-eatpur-green-dark">
                {blog.read_time || "5 min read"}
              </span>

              <span className="text-eatpur-dark opacity-0 group-hover:opacity-100 transition-opacity">
                Read Story →
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {!loading && blogs.length === 0 && (
        <div className="text-center text-eatpur-text font-serif italic mt-20">
          No stories found organically.
        </div>
      )}
    </div>
  );
}
