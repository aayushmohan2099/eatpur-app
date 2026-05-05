import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBlogs, reactToBlog } from "../../api/blogs";
import { motion, AnimatePresence } from "framer-motion";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in (adjust based on your auth logic, e.g., checking token)
  const isAuthenticated = !!localStorage.getItem("access");

  const fetchBlogs = async (search = "") => {
    setLoading(true);
    try {
      // Passes search param to the backend (searches title, meta_description, author)
      const res = await getBlogs(search ? { search } : {});
      const data = res.data?.results || res.data?.HEALTHY_LIFE?.results || [];

      setBlogs(data);
    } catch (err) {
      console.error("Error fetching blogs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search input slightly for better UX
    const delayDebounceFn = setTimeout(() => {
      fetchBlogs(searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Handle inline liking on the grid level
  const handleReaction = async (e, blogId) => {
    e.stopPropagation(); // Prevent navigating to the blog post
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    // Optimistic UI Update for instant frontend feedback
    setBlogs((prev) =>
      prev.map((blog) =>
        blog.id === blogId
          ? { ...blog, likes_count: (blog.likes_count || 0) + 1 }
          : blog,
      ),
    );

    try {
      await reactToBlog(blogId, "like");
    } catch (err) {
      console.error("Failed to react", err);
      // Revert the like visually if the API call fails
      setBlogs((prev) =>
        prev.map((blog) =>
          blog.id === blogId
            ? { ...blog, likes_count: Math.max((blog.likes_count || 1) - 1, 0) }
            : blog,
        ),
      );
    }
  };

  return (
    <div className="w-full min-h-screen px-6 relative z-10 bg-[#FAFAFA]">
      {/* Hero Section */}
      <section className="pt-16 pb-12 px-6 relative flex flex-col items-center justify-center text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-[#A8C686]/20 to-transparent pointer-events-none -z-10" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src="/icons/flourish-top.png"
            alt=""
            className="h-6 mx-auto mb-4 opacity-50"
            onError={(e) => (e.target.style.display = "none")}
          />
          <h1 className="text-6xl md:text-8xl font-serif text-[#2E2410] mb-6 leading-[1.1] tracking-tight">
            Our Blogs
          </h1>
          <p className="text-xl md:text-2xl font-serif italic text-[#5C4F3A] max-w-2xl mx-auto">
            Insights, recipes & stories around the millet lifestyle.
          </p>
        </motion.div>
      </section>

      {/* CTA: Write a Blog */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto mb-10"
      >
        <div className="vintage-card bg-white p-8 border border-black/5 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm rounded-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-eatpur-green-light/10 to-transparent pointer-events-none"></div>

          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl text-eatpur-dark font-display font-medium mb-2 leading-[1] py-2">
              Write your own Blog ✍️
            </h2>
            <p className="text-eatpur-text text-sm md:text-base">
              Share your ideas, recipes, or stories with the world.
              <span className="text-eatpur-green-dark font-medium ml-1">
                No signup required to publish.
              </span>
            </p>
          </div>

          <button
            onClick={() => navigate("/write-blog")}
            className="btn-primary flex-shrink-0 relative z-10 font-medium px-6 py-3 rounded-lg shadow-sm"
          >
            Start Writing →
          </button>
        </div>
      </motion.div>

      {/* Search & Filter Bar */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="relative flex items-center w-full shadow-sm rounded-full bg-white border border-black/10 overflow-hidden focus-within:border-eatpur-green-dark transition-colors">
          <span className="pl-6 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search stories, authors, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-4 px-4 bg-transparent outline-none text-eatpur-dark font-sans"
          />
        </div>
      </div>

      {/* BLOG GRID */}
      {loading && blogs.length === 0 ? (
        <div className="text-center text-eatpur-text font-serif italic py-20 animate-pulse">
          Loading stories...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto pb-24">
          {blogs.map((blog, idx) => (
            <motion.div
              key={blog.id || idx}
              onClick={() => navigate(`/preview-blog/${blog.id}`)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="vintage-card bg-white rounded-xl flex flex-col cursor-pointer border border-black/5 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group overflow-hidden h-full"
            >
              {/* Optional Cover Image Preview */}
              {blog.cover_image && (
                <div className="w-full h-48 overflow-hidden bg-gray-100">
                  <img
                    src={blog.cover_image}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              <div className="p-6 flex flex-col flex-grow">
                {/* Meta details */}
                <div className="text-xs font-semibold text-eatpur-green-dark uppercase tracking-wider mb-3">
                  By {blog.display_author || "Anonymous"}
                </div>

                {/* TITLE */}
                <h2 className="text-2xl text-eatpur-dark font-display font-medium mb-3 group-hover:text-eatpur-green-dark transition-colors leading-tight">
                  {blog.title}
                </h2>

                {/* DESCRIPTION */}
                <p className="text-eatpur-text text-sm leading-relaxed line-clamp-3 mb-6 font-serif opacity-80">
                  {blog.meta_description ||
                    "A captivating story from the EatPur community. Click to read more about this journey."}
                </p>

                {/* FOOTER */}
                <div className="mt-auto pt-4 border-t border-black/5 flex items-center justify-between text-sm text-eatpur-text-light font-medium">
                  {/* Interactions (Protected) */}
                  {/* Interactions (Protected) */}
                  <div className="flex gap-4">
                    <button
                      onClick={(e) => handleReaction(e, blog.id)}
                      className="flex items-center gap-1.5 hover:text-red-500 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        ></path>
                      </svg>
                      <span>{blog.likes_count || 0}</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Anyone can view comments, so just navigate to the post
                        navigate(`/preview-blog/${blog.id}`);
                      }}
                      className="flex items-center gap-1.5 hover:text-eatpur-green-dark transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        ></path>
                      </svg>
                      <span>{blog.comments_count || 0}</span>
                    </button>
                  </div>

                  <span className="text-xs uppercase tracking-widest bg-eatpur-white-warm px-2 py-1 rounded-md">
                    {blog.read_time_minutes || 1} min read
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && blogs.length === 0 && (
        <div className="text-center text-eatpur-text font-serif italic py-20">
          No stories found matching your search.
        </div>
      )}

      {/* AUTH MODAL */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl p-8 md:p-10 max-w-md w-full shadow-2xl relative border border-eatpur-green-dark/10"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>

              <div className="text-center">
                <div className="w-16 h-16 bg-eatpur-green-light/20 rounded-full flex items-center justify-center mx-auto mb-6 text-eatpur-green-dark">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                    ></path>
                  </svg>
                </div>

                <h3 className="text-2xl font-display text-eatpur-dark mb-3">
                  Join the Conversation
                </h3>

                <p className="text-eatpur-text mb-8 leading-relaxed">
                  We'd love to hear your thoughts! Please sign in or create an
                  account to like, comment, and connect with other writers in
                  the EatPur community.
                </p>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => navigate("/signup")}
                    className="w-full bg-eatpur-green-dark text-white py-3 rounded-lg font-medium hover:bg-opacity-90 transition-all shadow-sm"
                  >
                    Create an Account
                  </button>
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full bg-white text-eatpur-dark border border-black/10 py-3 rounded-lg font-medium hover:bg-gray-50 transition-all"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
