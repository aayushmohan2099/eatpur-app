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
    <div className="w-full min-h-screen pt-24 pb-32 px-6 relative z-10">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto rounded-[2rem] overflow-hidden mb-16 relative bg-eatpur-green-dark p-12 md:p-20 text-center flex flex-col items-center justify-center shadow-[0_0_40px_rgba(4,7,4,0.5)] border border-eatpur-gold/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,201,51,0.1)_0%,transparent_70%)] pointer-events-none" />
        <h1 className="text-5xl md:text-6xl font-display text-gradient-gold mb-4 relative z-10">Our Blogs</h1>
        <p className="text-xl text-eatpur-text relative z-10 mb-8">
          Insights, recipes & stories around millet lifestyle.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto mb-16"
      >
        <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-eatpur-gold/5 blur-2xl pointer-events-none"></div>

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl text-gradient-gold font-bold mb-2">
                Write your own Blog ✍️
              </h2>
              <p className="text-eatpur-text text-sm md:text-base">
                Share your ideas, recipes, or stories with the world.
                <span className="text-eatpur-green-light font-medium ml-1">
                  No signup required.
                </span>
              </p>
            </div>

            <button
              onClick={() => navigate("/write-blog")}
              className="btn-primary flex-shrink-0"
            >
              Start Writing →
            </button>
          </div>
        </div>
      </motion.div>

      {/* LOADING */}
      {loading && (
        <div className="text-center text-eatpur-text">
          Loading blogs...
        </div>
      )}

      {/* BLOG GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {blogs.map((blog, idx) => (
          <motion.div
            key={blog.id || idx}
            onClick={() => navigate(`/preview-blog/${blog.id}`)}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ y: -6, scale: 1.02 }}
            className="glass-card rounded-2xl p-6 flex flex-col glow-hover cursor-pointer"
          >
            {/* TITLE */}
            <h2 className="text-2xl text-eatpur-white-warm font-bold mb-3 group-hover:text-eatpur-yellow transition-colors">
              {blog.title}
            </h2>

            {/* DESCRIPTION */}
            <p className="text-eatpur-text text-sm leading-relaxed line-clamp-3 mb-6">
              {blog.description || blog.content?.slice(0, 120)}
            </p>

            {/* FOOTER */}
            <div className="mt-auto pt-4 border-t border-eatpur-gold/10 flex items-center justify-between text-sm">
              <span className="text-eatpur-green-light">
                {blog.read_time || "5 min read"}
              </span>

              <span className="text-eatpur-gold opacity-0 group-hover:opacity-100 transition-opacity">
                Read →
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {!loading && blogs.length === 0 && (
        <div className="text-center text-eatpur-text mt-20">
          No blogs found.
        </div>
      )}
    </div>
  );
}
