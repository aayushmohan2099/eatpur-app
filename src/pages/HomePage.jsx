import React, { useState, useEffect } from "react";
import { getBlogs } from "../api/blogs";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import {
  FaLeaf,
  FaHeart,
  FaBolt,
  FaWheatAwn,
  FaCartShopping,
  FaEye,
  FaXmark,
} from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

// Mock Data
const products = [
  {
    id: 1,
    name: "Sprouted Ragi Flour",
    price: 149,
    description: "Calcium-rich sprouted finger millet flour.",
    category: "Raw Flour",
    image:
      "https://images.unsplash.com/photo-1621245892014-cb1b8b8095b5?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 2,
    name: "Millet Noodles",
    price: 99,
    description: "Healthy hakka style noodles made purely from millets.",
    category: "Ready to Cook",
    image:
      "https://images.unsplash.com/photo-1600335895229-6e75511892c8?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 3,
    name: "Pearl Millet Cookies",
    price: 129,
    description: "Crispy, crunchy bajra cookies sweetened with jaggery.",
    category: "Ready to Eat",
    image:
      "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=400",
  },
];

const trendingBlogs = [
  {
    id: 1,
    title: "The Ancient Supergrain Revival",
    author: "Lovelesh",
    date: "Oct 12, 2024",
    likes: 230,
    readTime: "5 min",
  },
  {
    id: 2,
    title: "Why Millets > Rice for Weight Loss",
    author: "Sunita",
    date: "Oct 05, 2024",
    likes: 185,
    readTime: "6 min",
  },
  {
    id: 3,
    title: "A Complete Guide to Sprouting at Home",
    author: "Ankit",
    date: "Sep 29, 2024",
    likes: 312,
    readTime: "8 min",
  },
];

export default function HomePage() {
  const { scrollYProgress } = useScroll();
  const { dispatch } = useCart();
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [trendingBlogs, setTrendingBlogs] = useState([]);

  // Smooth out scroll
  const smoothY = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });

  // Hero animations
  const heroOpacity = useTransform(smoothY, [0, 0.15], [1, 0]);
  const heroY = useTransform(smoothY, [0, 0.15], [0, -100]);

  // Why choose millets section animation
  const featuresOpacity = useTransform(smoothY, [0.1, 0.25, 0.45], [0, 1, 0]);
  const featuresY = useTransform(smoothY, [0.1, 0.25], [100, 0]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await getBlogs();
        const data = res.data.results || res.data;

        // sort by likes
        const sorted = [...data].sort(
          (a, b) => (b.likes_count || 0) - (a.likes_count || 0),
        );

        // take top 3
        setTrendingBlogs(sorted.slice(0, 3));
      } catch (err) {
        console.error("Error fetching blogs", err);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="w-full relative min-h-[400vh]">
      {/* 
        The actual global video background is in MainLayout. 
        We use transparent/dark sections here to overlay it. 
      */}

      {/* Hero Section */}
      <motion.section
        id="hero-section"
        className="h-screen w-full flex flex-col items-center justify-center text-center px-6 fixed top-0 left-0 pointer-events-none"
        style={{ opacity: heroOpacity, y: heroY }}
      >
        <div className="pointer-events-auto flex flex-col items-center justify-center translate-y-[180px] md:translate-y-[220px]">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", delay: 0.4 }}
            className="text-lg md:text-6xl font-bold text-eatpur-gold tracking-tight leading-tight max-w-2xl mx-auto mb-10 mt-28 md:mt-32"
          >
            Coming Soon....
          </motion.p>
        </div>
      </motion.section>

      {/* Spacer to push content down so scroll works correctly */}
      <div className="h-[100vh] w-full" />

      {/* Why Choose Millets Section */}
      <motion.section className="min-h-screen w-full flex flex-col justify-center items-center py-20 px-6 z-10 relative bg-eatpur-green-dark/80 backdrop-blur-3xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display text-gradient-gold mb-4">
            Why Choose Millets?
          </h2>
          <p className="text-eatpur-text text-lg">
            Ancient supergrains. Modern nutrition.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto w-full">
          {[
            {
              icon: FaLeaf,
              color: "text-eatpur-green-light",
              title: "100% Natural",
              desc: "Pure millet goodness with no artificial additives or preservatives.",
            },
            {
              icon: FaHeart,
              color: "text-eatpur-gold",
              title: "Heart Healthy",
              desc: "Low glycemic index, high in fiber for better heart health.",
            },
            {
              icon: FaBolt,
              color: "text-eatpur-gold",
              title: "Energy Boost",
              desc: "Slow-release carbs for sustained energy throughout the day.",
            },
            {
              icon: FaWheatAwn,
              color: "text-eatpur-green-light opacity-70",
              title: "Gluten Free",
              desc: "Naturally gluten-free, perfect for sensitive diets.",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, type: "spring" }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass-card p-8 rounded-2xl flex flex-col items-center text-center glow-hover group"
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 bg-eatpur-dark/50 border border-eatpur-gold/20 group-hover:scale-110 transition-transform ${feature.color}`}
              >
                <feature.icon size={32} />
              </div>
              <h3 className="text-xl font-bold text-eatpur-white-warm mb-3">
                {feature.title}
              </h3>
              <p className="text-eatpur-text/80 leading-relaxed text-sm">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Featured Products */}
      <section className="min-h-screen w-full bg-eatpur-dark py-24 px-6 z-10 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display text-gradient-gold mb-4">
              Featured Products
            </h2>
            <p className="text-eatpur-text text-lg">
              Crafted from nature's finest grains.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="glass-card rounded-2xl overflow-hidden flex flex-col group glow-hover"
              >
                <div className="h-64 overflow-hidden relative">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <button
                    onClick={() => setQuickViewProduct(product)}
                    className="absolute inset-0 bg-eatpur-dark/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <span className="flex items-center gap-2 bg-eatpur-gold text-eatpur-dark px-4 py-2 rounded-full font-bold">
                      <FaEye /> Quick View
                    </span>
                  </button>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-eatpur-white-warm mb-1">
                    {product.name}
                  </h3>
                  <p className="text-eatpur-text text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-xl font-display text-eatpur-yellow">
                      ₹{product.price}
                    </span>
                    <button
                      onClick={() =>
                        dispatch({ type: "ADD_ITEM", payload: product })
                      }
                      className="w-10 h-10 rounded-full bg-eatpur-gold/10 border border-eatpur-gold/30 flex items-center justify-center text-eatpur-gold hover:bg-eatpur-gold hover:text-eatpur-dark transition-all"
                    >
                      <FaCartShopping size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Blogs */}
      <section className="py-24 px-6 bg-eatpur-green-dark/40 z-10 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display text-gradient-gold mb-4 leading-normal">
              Blogs
            </h2>
            <p className="text-eatpur-text text-lg">
              Insights, recipes, and stories around healthy living.
            </p>
          </div>

          <div className="flex overflow-x-auto pb-8 gap-6 snap-x hide-scrollbar lg:grid lg:grid-cols-3 lg:overflow-visible">
            {trendingBlogs.map((blog, i) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="min-w-[300px] lg:min-w-0 glass-card p-6 rounded-2xl flex flex-col snap-start shrink-0 cursor-pointer glow-hover"
              >
                <div className="text-sm text-eatpur-text mb-4 flex justify-between items-center">
                  <span>{blog.created_at || blog.date}</span>
                  <span className="flex items-center gap-1 text-eatpur-gold">
                    <FaHeart size={12} /> {blog.likes_count || 0}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-eatpur-white-warm mb-4 line-clamp-2">
                  {blog.title}
                </h3>
                <div className="mt-auto text-sm text-eatpur-text/80 pt-4 border-t border-eatpur-gold/10 flex justify-between">
                  <span>By {blog.author}</span>
                  <span>{"5 min"}</span>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link to="/blogs" className="btn-ghost inline-block">
              View All Blogs
            </Link>
          </div>
        </div>
      </section>

      {/* Final About CTA */}
      <section className="py-32 px-6 bg-gradient-to-b from-transparent to-eatpur-dark z-10 relative flex flex-col justify-center items-center text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,201,51,0.05)_0%,transparent_60%)] pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative z-10"
        >
          <h2 className="text-5xl md:text-7xl font-display text-gradient-gold mb-6">
            Pure food. Honest living.
          </h2>
          <p className="text-xl md:text-2xl text-eatpur-text-light mb-4">
            EatPur. Rooted in tradition, crafted for modern wellness.
          </p>
          <p className="text-eatpur-text mb-10 max-w-xl mx-auto">
            From farm to table, bringing you clean, wholesome millet nutrition
            every day.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products" className="btn-primary">
              Explore Products
            </Link>
            <Link to="/about" className="btn-ghost">
              Read Our Story
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-eatpur-dark/70 backdrop-blur-md"
            onClick={() => setQuickViewProduct(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-modal w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl relative flex flex-col md:flex-row drop-shadow-[0_0_30px_rgba(255,201,51,0.1)] hide-scrollbar"
            >
              <button
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 right-4 z-10 text-eatpur-text hover:text-eatpur-yellow p-2 rounded-full bg-eatpur-dark/50 hover:bg-eatpur-dark transition-colors"
              >
                <FaXmark size={24} />
              </button>

              <div className="md:w-1/2 p-4">
                <img
                  src={quickViewProduct.image}
                  alt={quickViewProduct.name}
                  className="w-full h-full object-cover rounded-2xl min-h-[300px]"
                />
              </div>
              <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <span className="text-eatpur-green-light font-bold text-sm tracking-widest uppercase mb-2">
                  {quickViewProduct.category}
                </span>
                <h2 className="text-3xl md:text-4xl font-display text-eatpur-yellow mb-4">
                  {quickViewProduct.name}
                </h2>
                <span className="text-2xl font-light text-eatpur-white-warm mb-6">
                  ₹{quickViewProduct.price}
                </span>
                <p className="text-eatpur-text leading-relaxed mb-8">
                  {quickViewProduct.description} This premium product ensures
                  you get all the natural health benefits of pure millet without
                  any artificial additives. Perfect for a balanced, modern
                  lifestyle.
                </p>
                <button
                  onClick={() => {
                    dispatch({ type: "ADD_ITEM", payload: quickViewProduct });
                    setQuickViewProduct(null);
                  }}
                  className="btn-primary w-full flex justify-center items-center gap-3 py-4 text-lg"
                >
                  <FaCartShopping /> Add to Cart
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
