import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBlogs } from "../api/blogs";

export default function BlogsSection() {
  const { scrollYProgress } = useScroll();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);

  // Active from 65% to 85%
  const opacity = useTransform(
    scrollYProgress,
    [0.6, 0.65, 0.8, 0.9],
    [0, 1, 1, 0],
  );
  const y = useTransform(
    scrollYProgress,
    [0.6, 0.65, 0.8, 0.9],
    [50, 0, 0, -50],
  );

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await getBlogs();
        const data = res.data.results || res.data;

        // ✅ sort by likes_count (desc)
        const sorted = [...data].sort(
          (a, b) => (b.likes_count || 0) - (a.likes_count || 0),
        );

        // ✅ take top 3
        setBlogs(sorted.slice(0, 3));
      } catch (err) {
        console.error("Error fetching blogs", err);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <motion.section
      style={{ opacity, y }}
      className="fixed inset-0 flex flex-col items-center justify-center p-6 z-20 pointer-events-none"
    >
      <div className="text-center mb-12 max-w-2xl bg-[#040704]/40 p-6 rounded-2xl backdrop-blur-md">
        <h2 className="text-4xl md:text-5xl font-bold text-eatpur-gold tracking-tight mb-4 drop-shadow-md">
          Trending Blogs
        </h2>
        <p className="text-eatpur-text-light text-lg">
          Discover what the community is loving—insights, recipes, and stories
          around healthy living.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 max-w-6xl pointer-events-auto">
        {blogs.map((blog, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -10, scale: 1.02 }}
            className="group relative w-full md:w-1/3 bg-[#0B140B]/80 border border-[#2A3F2A]/50 rounded-2xl p-6 cursor-pointer overflow-hidden backdrop-blur-md shadow-xl transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-eatpur-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="text-eatpur-green-light text-xs font-semibold uppercase tracking-wider mb-2">
              {blog.read_time || "5 min read"}
            </div>

            <h3 className="text-2xl text-[#E6D8A8] font-bold mb-3 group-hover:text-eatpur-yellow transition-colors duration-300">
              {blog.title}
            </h3>

            <p className="text-eatpur-text text-sm leading-relaxed">
              {blog.description || blog.content?.slice(0, 100)}
            </p>
          </motion.div>
        ))}
      </div>

      {/* 🔥 SEE MORE BUTTON */}
      <motion.div
        className="mt-10 pointer-events-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <button
          onClick={() => navigate("/blogs")}
          className="group relative px-8 py-3 rounded-full border border-eatpur-gold bg-eatpur-gold text-black font-medium tracking-wide overflow-hidden transition-all duration-500 hover:scale-[1.06] hover:shadow-[0_10px_40px_rgba(255,201,51,0.35)] active:scale-95"
        >
          {/* 🌟 Glow background (soft spread) */}
          <span className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition duration-500 blur-xl"></span>

          {/* ✨ Shimmer sweep */}
          <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700">
            <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:left-[100%] transition-all duration-1000"></span>
          </span>

          {/* TEXT */}
          <span className="relative z-10 flex items-center gap-2">
            See All Blogs
            <span className="transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110">
              →
            </span>
          </span>
        </button>
      </motion.div>
    </motion.section>
  );
}
