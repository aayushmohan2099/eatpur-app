import React, { useState, useEffect } from "react";
import { getBlogs } from "../api/blogs";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaLeaf,
  FaCartShopping,
  FaEye,
  FaXmark,
  FaChild,
  FaDumbbell,
  FaHouseUser,
  FaBowlFood,
  FaSeedling,
  FaCommentDots,
} from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Chatbot from "../components/Chatbot";
import FloatingImagesBackground from "./FloatingBG/floatingBG";

// Mock Data
const products = [
  {
    id: 1,
    name: "Hakka Multi Millet Noodles Pcs",
    price: 227,
    description:
      "Delicious hakka-style noodles made from nutritious millets, offering a healthy twist to your favorite Indo-Chinese dish.",
    category: "Ready to Cook",
    healthScore: 92,
    image: "/home/prod-carousel/HakkaMultiMilletNoodles.jpeg",
  },
  {
    id: 2,
    name: "Pasta Multi Millet",
    price: 171,
    description:
      "Wholesome multi-millet pasta packed with fiber and nutrients, perfect for a guilt-free Italian meal.",
    category: "Ready to Cook",
    healthScore: 85,
    image: "/home/prod-carousel/PastaMultiMillet.jpeg",
  },
  {
    id: 3,
    name: "Roasted Mixture Multi",
    price: 85,
    description:
      "Crunchy roasted millet snack mix, lightly spiced for a healthy and satisfying munch anytime.",
    category: "Ready to Eat",
    healthScore: 78,
    image: "/home/prod-carousel/RoastedMixtureMulti.jpeg",
  },
  {
    id: 4,
    name: "Namkeen Chips Multi Millet Soya based Chatpata Masala",
    price: 193,
    description:
      "Crispy millet and soya-based chips with a tangy chatpata masala flavor, combining taste with nutrition.",
    category: "Ready to Cook",
    healthScore: 92,
    image: "/home/prod-carousel/NamkeenChipsMultiMillet.jpeg",
  },
  {
    id: 5,
    name: "Cookies Millet Butter Kaju",
    price: 125,
    description:
      "Rich and crunchy millet cookies infused with butter and kaju, offering a healthy indulgent snack.",
    category: "Ready to Cook",
    healthScore: 85,
    image: "/home/prod-carousel/CookiesMilletButterKaju.jpeg",
  },
  {
    id: 6,
    name: "Millet Energy Bar Chocolate Light",
    price: 57,
    description:
      "Light chocolate-flavored millet energy bar, perfect for a quick healthy boost on the go.",
    category: "Ready to Eat",
    healthScore: 78,
    image: "/home/prod-carousel/MilletEnergyBar.jpeg",
  },
  {
    id: 7,
    name: "Millet Granola Muesli Chocolate",
    price: 447,
    description:
      "Nutritious millet granola muesli blended with chocolate for a tasty and energizing breakfast option.",
    category: "Ready to Cook",
    healthScore: 92,
    image: "/home/prod-carousel/MilletGranolaMuesli.jpeg",
  },
  {
    id: 8,
    name: "Multi Flour",
    price: 207,
    description:
      "Premium blend of multiple millets flour, ideal for making healthy rotis, breads, and everyday meals.",
    category: "Ready to Cook",
    healthScore: 85,
    image: "/home/prod-carousel/MultiFlour.jpeg",
  },
];

const heroImages = [
  "/home/home-carousel/pic1.jpeg",
  "/home/home-carousel/pic2.jpeg",
  "/home/home-carousel/pic3.jpeg",
  "/home/home-carousel/pic4.jpeg",
  "/home/home-carousel/pic5.jpeg",
  "/home/home-carousel/pic6.jpeg",
  "/home/home-carousel/pic7.jpeg",
  "/home/home-carousel/pic8.jpeg",
  "/home/home-carousel/pic9.jpeg",
  "/home/home-carousel/pic10.jpeg",
  "/home/home-carousel/pic11.jpeg",
];

export default function HomePage() {
  const { dispatch } = useCart();
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [trendingBlogs, setTrendingBlogs] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await getBlogs();
        const data = res.data.results || res.data;
        const sorted = [...data].sort(
          (a, b) => (b.likes_count || 0) - (a.likes_count || 0),
        );
        setTrendingBlogs(sorted.slice(0, 3));
      } catch (err) {
        console.error("Error fetching blogs", err);
      }
    };
    fetchBlogs();
  }, []);

  // Hero Carousel Timer
  useEffect(() => {
    const heroTimer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 3500);
    return () => clearInterval(heroTimer);
  }, []);

  return (
    <div className="w-full relative min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full pt-20 pb-20 md:pt-28 md:pb-32 px-6 overflow-hidden bg-cover bg-center bg-no-repeat bg-[url('/home/Mobanner.png')]">
        {/* ✅ Floating 3D Images Background */}
        <FloatingImagesBackground />

        {/* Soft Gradient Overlay - Flipped to the right side to keep text readable */}
        <div className="absolute top-0 right-0 w-full md:w-1/2 h-full bg-gradient-to-l from-eatpur-green-light/90 to-transparent pointer-events-none z-[1]" />

        {/* Content Container */}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
          {/* LEFT SIDE: Image Carousel */}
          <div className="flex-1 w-full flex justify-center md:justify-start lg:pr-12">
            <div className="relative w-full max-w-[340px] md:max-w-[400px] aspect-[3/4]">
              {/* Layer 1: The Orange Outline Border (Appears First) */}
              <motion.div
                initial={{ opacity: 0, rotate: 0, scale: 0.9 }}
                animate={{ opacity: 1, rotate: 8, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                className="absolute inset-0 border-[6px] border-[#E37A2C] z-0 pointer-events-none shadow-lg rounded-sm"
              ></motion.div>

              {/* Layer 2: The Solid Orange Block (Appears Second) */}
              <motion.div
                initial={{ opacity: 0, rotate: 0, scale: 0.9 }}
                animate={{ opacity: 1, rotate: 4, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
                className="absolute inset-0 bg-[#E37A2C] z-10 pointer-events-none shadow-md rounded-sm"
              ></motion.div>

              {/* Layer 3: The Image Carousel */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 1.2 }}
                className="absolute inset-0 z-20 bg-[#DFD1D1] shadow-2xl overflow-hidden border-[4px] md:border-[5px] border-[#E37A2C] rounded-sm"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentHeroIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full p-2 md:p-3"
                  >
                    {/* SVG Filter for Dissolve Animation */}
                    <svg width="0" height="0" className="absolute hidden">
                      <defs>
                        <filter
                          id={`turbulent-dissolve-${currentHeroIndex}`}
                          x="0%"
                          y="0%"
                          width="100%"
                          height="100%"
                        >
                          <feTurbulence
                            type="fractalNoise"
                            baseFrequency=".012"
                            result="noise"
                          />
                          <feColorMatrix
                            type="luminanceToAlpha"
                            in="noise"
                            result="alphaNoise"
                          />
                          <feComponentTransfer
                            in="alphaNoise"
                            result="animatedAlpha"
                          >
                            <feFuncA type="linear" slope="0">
                              <animate
                                attributeName="slope"
                                values="0; 0.5; 1; 1.5; 2; 3; 5"
                                dur="1.2s"
                                fill="freeze"
                              />
                            </feFuncA>
                          </feComponentTransfer>
                          <feComponentTransfer
                            in="animatedAlpha"
                            result="discreteAlpha"
                          >
                            <feFuncA type="discrete" tableValues="0 1" />
                          </feComponentTransfer>
                          <feGaussianBlur
                            stdDeviation="1"
                            in="discreteAlpha"
                            result="blurredAlpha"
                          />
                          <feComposite
                            operator="in"
                            in="SourceGraphic"
                            in2="blurredAlpha"
                          />
                        </filter>
                      </defs>
                    </svg>

                    <img
                      src={heroImages[currentHeroIndex]}
                      className="w-full h-full object-contain mix-blend-multiply"
                      style={{
                        filter: `url(#turbulent-dissolve-${currentHeroIndex})`,
                      }}
                      alt={`EatPur Highlight ${currentHeroIndex + 1}`}
                    />
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>
          </div>

          {/* RIGHT SIDE: Texts and Buttons */}
          <motion.div
            className="flex-1 flex flex-col items-center md:items-start text-center md:text-left lg:pl-8"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 bg-eatpur-green-dark/10 text-eatpur-dark px-4 py-1.5 rounded-full text-sm font-medium mb-6 backdrop-blur-sm border border-eatpur-green-dark/20 shadow-sm">
              <FaLeaf className="text-eatpur-green-dark" />
              <span>100% Natural • No Maida • High Fiber</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-display text-eatpur-dark leading-tight mb-6 tracking-tight drop-shadow-sm">
              Millets... <br />
              Fuel Your Body
              <br />
              <span className="italic text-eatpur-green-dark">Naturally</span>
            </h1>

            <p className="text-eatpur-text text-lg md:text-xl mb-10 max-w-md font-display leading-relaxed drop-shadow-sm">
              Smart nutrition for modern life – ready in minutes. Pure,
              wholesome, and tradition-rich grains.
            </p>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Link
                to="/products"
                className="btn-primary flex items-center gap-2 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                Shop Now
              </Link>
              <Link
                to="/recipes"
                className="btn-ghost bg-black/50 backdrop-blur-sm border border-eatpur-dark/20 text-white hover:text-white hover:!bg-[#cf7324] hover:border-[#cf7324] shadow-md hover:shadow-xl transition-all duration-300"
              >
                Explore Recipes
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MOBILE ONLY: Auto-Scrolling Product Carousel */}
      <section className="block md:hidden w-full py-8 overflow-hidden bg-transparent">
        <div className="flex marquee-container">
          {/* Doubled array [1-5, 1-5] creates the seamless infinite loop */}
          {[1, 2, 3, 4, 5, 1, 2, 3, 4, 5].map((item, index) => (
            <div
              key={index}
              className="w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 mx-3 bg-[#FFFDF8]/70 backdrop-blur-md border border-[#D4C4A8]/80 rounded-[16px] p-3 shadow-[0_4px_12px_rgba(58,40,10,0.06)] flex items-center justify-center"
            >
              <img
                src={`/home/carousel/${item}.png`}
                alt={`Carousel Product ${item}`}
                className="w-full h-full object-contain drop-shadow-md"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentElement.innerHTML =
                    '<span class="text-3xl">🌾</span>';
                }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Shop by Need Section */}
      <section className="py-12 px-6 relative border-t border-black/5 bg-white/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 flex flex-col items-center">
            <h2 className="text-3xl md:text-4xl font-display text-eatpur-dark flex items-center gap-4">
              <img
                src="/icons/flourish-left.png"
                alt="~"
                className="h-6 opacity-60 hidden md:block"
                onError={(e) => (e.target.style.display = "none")}
              />
              🌿 Shop by Need 🌿
              <img
                src="/icons/flourish-right.png"
                alt="~"
                className="h-6 opacity-60 hidden md:block"
                onError={(e) => (e.target.style.display = "none")}
              />
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {[
              { title: "Kids Nutrition", icon: FaChild },
              { title: "Fitness & Weight Loss", icon: FaDumbbell },
              { title: "Daily Family Staples", icon: FaHouseUser },
              { title: "Quick Meals (2-5 min)", icon: FaBowlFood },
              { title: "Organic Living", icon: FaSeedling },
            ].map((cat, i) => (
              <Link
                to={`/products?need=${cat.title.toLowerCase().replace(/ & | /g, "-")}`}
                key={i}
                className="vintage-card w-40 h-44 md:w-48 md:h-52 flex flex-col items-center justify-center p-4 hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="w-16 h-16 rounded-full bg-eatpur-green-light/20 flex items-center justify-center text-eatpur-green-dark mb-4 group-[.hover]:bg-eatpur-green-light/40">
                  <cat.icon size={32} />
                </div>
                <h3 className="font-display font-medium text-eatpur-dark text-center text-[15px] leading-tight">
                  {cat.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 relative border-t border-black/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display text-eatpur-dark mb-4">
              Trending Products
            </h2>
            <p className="text-eatpur-text font-serif italic">
              Crafted from nature's finest grains.
            </p>
          </div>
        </div>

        {/* --- PREMIUM SCROLLING CAROUSEL START --- */}
        <div className="relative w-full max-w-[100vw] overflow-hidden group">
          {/* Optional: Premium Fade Masks for the edges */}
          <div className="absolute top-0 left-0 w-16 md:w-32 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-16 md:w-32 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

          {/* The Scrolling Track */}
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
            {/* Render the lists twice to create the infinite loop */}
            {[0, 1].map((loopIndex) => (
              <div
                key={loopIndex}
                className="flex gap-8 px-4"
                aria-hidden={loopIndex === 1 ? "true" : "false"}
              >
                {products.map((product) => (
                  <div
                    key={`${loopIndex}-${product.id}`}
                    className="vintage-card w-[280px] md:w-[320px] shrink-0 overflow-hidden flex flex-col group/card relative transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl"
                  >
                    {/* Top Right 30% OFF Tag */}
                    <div className="absolute top-4 right-4 z-20 bg-[#8B3A2A] text-white font-sans text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md">
                      30% OFF
                    </div>

                    <div className="h-64 overflow-hidden p-6 pb-0 flex items-center justify-center bg-white/50 relative">
                      <motion.img
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.4 }}
                        src={product.image}
                        alt={product.name}
                        className="h-full object-contain drop-shadow-md rounded-t-xl"
                        loading="lazy"
                      />
                      <button
                        onClick={() => setQuickViewProduct(product)}
                        className="absolute inset-0 bg-eatpur-white-warm/80 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity backdrop-blur-sm"
                      >
                        <span className="flex items-center gap-2 border border-eatpur-dark text-eatpur-dark px-6 py-3 rounded-full font-display hover:bg-eatpur-dark hover:text-white transition-colors">
                          <FaEye /> Quick View
                        </span>
                      </button>
                    </div>

                    <div className="p-6 flex flex-col flex-1 border-t border-black/5 bg-white">
                      <span className="text-eatpur-green-dark text-[11px] uppercase tracking-widest font-semibold mb-1">
                        {product.category}
                      </span>
                      <h3 className="text-xl font-display font-medium text-eatpur-dark mb-1">
                        {product.name}
                      </h3>

                      {/* Eatpur Health Score Meter */}
                      <div className="mt-3 mb-4 w-full bg-gray-100 rounded-full h-2 overflow-hidden shadow-inner flex items-center relative">
                        <div
                          className="h-full bg-eatpur-green-dark"
                          style={{ width: `${product.healthScore}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-eatpur-text flex justify-between mb-2">
                        <span className="font-medium text-eatpur-green-dark">
                          Health Score
                        </span>
                        <span className="font-bold">
                          {product.healthScore}/100
                        </span>
                      </div>

                      <div className="mt-auto flex items-end justify-between pt-4">
                        <div className="flex flex-col">
                          <div className="flex items-start gap-1.5 mb-0.5">
                            <span className="relative text-sm font-sans text-eatpur-text/60">
                              ₹{product.price}
                              {/* Diagonal Strikethrough */}
                              <span className="absolute top-1/2 left-[-10%] w-[120%] h-[1.5px] bg-[#8B3A2A] -rotate-[15deg] origin-center"></span>
                            </span>
                          </div>
                          {/* New Discounted Price */}
                          <span className="text-xl font-bold text-[#3A5A1C]">
                            ₹{Math.round(product.price - product.price * 0.3)}
                          </span>
                        </div>

                        <button
                          onClick={() =>
                            dispatch({ type: "ADD_ITEM", payload: product })
                          }
                          className="w-10 h-10 rounded-full border border-eatpur-dark/20 flex items-center justify-center text-eatpur-dark hover:bg-eatpur-green-dark hover:border-eatpur-green-dark hover:text-white transition-all transform hover:scale-105"
                          aria-label="Add to cart"
                        >
                          <FaCartShopping size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        {/* --- PREMIUM SCROLLING CAROUSEL END --- */}

        <div className="mt-12 text-center">
          <Link to="/products" className="btn-ghost shadow-sm">
            View All Products
          </Link>
        </div>
      </section>

      {/* Featured Blogs Section */}
      <section className="py-24 px-6 bg-eatpur-white-warm relative border-t border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display text-eatpur-dark mb-4">
              Our Blogs
            </h2>
            <p className="text-eatpur-text font-serif italic">
              Discover modern nutrition through ancient wisdom.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trendingBlogs.map((blog, i) => (
              <Link to={`/blogs/${blog.slug || blog.id}`} key={blog.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="vintage-card group cursor-pointer flex flex-col h-full border border-black/5 shadow-sm overflow-hidden"
                >
                  <div className="h-64 overflow-hidden rounded-t-xl bg-gray-100 flex items-center justify-center">
                    <img
                      src={
                        blog.image ||
                        "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400"
                      }
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-8 flex flex-col flex-1 border-t border-black/5 bg-white">
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      {blog.tags?.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] uppercase tracking-widest font-semibold text-eatpur-green-dark border border-eatpur-green-dark/20 px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-2xl font-display text-eatpur-dark mb-3 group-hover:text-eatpur-green-dark transition-colors">
                      {blog.title}
                    </h3>
                    <p className="text-eatpur-text line-clamp-3 mb-6 font-serif text-sm">
                      {blog.content?.replace(/<[^>]*>?/gm, "") ||
                        "Explore our thoughts and recipes..."}
                    </p>
                    <div className="mt-auto flex items-center justify-between text-sm text-eatpur-text-light font-medium">
                      <span>
                        {new Date(
                          blog.created_at || Date.now(),
                        ).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaEye /> {blog.views_count || 0}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link to="/blogs" className="btn-primary font-medium tracking-wide">
              View All Blogs
            </Link>
          </div>
        </div>
      </section>

      {/* Special Offer Banner / Section */}
      <section className="py-20 px-6 relative bg-transparent text-center">
        {/* The Dark Green Vintage Card */}
        <div className="max-w-4xl mx-auto relative z-10 border border-[#D4C4A8]/40 p-8 md:p-14 rounded-[12px] bg-[#3A5A1C] shadow-[0_8px_30px_rgba(58,40,10,0.15)]">
          {/* Top Decorative Element */}
          <div className="text-[#C8922A] text-sm tracking-[0.3em] mb-4">
            ✦ ─── ─── ✦
          </div>

          <h2 className="text-[#FFFDF8] font-serif text-4xl md:text-5xl mb-4 tracking-wide drop-shadow-sm">
            Special Sale
          </h2>

          <p className="text-[#FFFDF8]/90 font-serif italic text-lg mb-8">
            Up to 30% off on all organic millets.
          </p>

          {/* Bottom Decorative Element */}
          <div className="text-[#C8922A] text-sm tracking-[0.3em] mb-8">
            ✦ ─── ─── ✦
          </div>

          <Link
            to="/products"
            className="inline-block bg-[#FFFDF8] text-[#3A5A1C] font-sans font-semibold px-8 py-3 rounded-[6px] hover:bg-[#EADDCA] transition-colors shadow-sm"
          >
            View Deals
          </Link>
        </div>
      </section>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-eatpur-dark/40 backdrop-blur-sm"
            onClick={() => setQuickViewProduct(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="vintage-card w-full max-w-4xl max-h-[90vh] overflow-y-auto relative flex flex-col md:flex-row hide-scrollbar"
            >
              <button
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 right-4 z-10 text-eatpur-text hover:text-eatpur-dark p-2 bg-white/80 rounded-full"
              >
                <FaXmark size={20} />
              </button>

              <div className="md:w-1/2 p-8 bg-eatpur-white-warm flex items-center justify-center">
                <img
                  src={quickViewProduct.image}
                  alt={quickViewProduct.name}
                  className="w-full max-h-[400px] object-contain mix-blend-multiply"
                />
              </div>
              <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
                <span className="text-eatpur-green-dark font-medium text-xs tracking-widest uppercase mb-3">
                  {quickViewProduct.category}
                </span>
                <h2 className="text-3xl md:text-4xl font-display text-eatpur-dark mb-4">
                  {quickViewProduct.name}
                </h2>
                <span className="text-2xl font-medium text-eatpur-dark mb-6 border-b border-black/10 pb-4">
                  ₹{quickViewProduct.price}
                </span>
                <p className="text-eatpur-text leading-relaxed mb-6 gap-2">
                  {quickViewProduct.description} This premium product ensures
                  you get all the natural health benefits of pure millet without
                  any artificial additives.
                </p>

                {/* Health Score in Modal */}
                <div className="mb-8 p-4 border border-green-900/10 rounded-lg bg-green-50/50">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-eatpur-dark">
                      Eatpur Health Score
                    </span>
                    <span className="font-bold text-eatpur-green-dark">
                      {quickViewProduct.healthScore}/100
                    </span>
                  </div>
                  <div className="w-full bg-white rounded-full h-1.5 shadow-inner">
                    <div
                      className="h-full bg-eatpur-green-dark rounded-full"
                      style={{ width: `${quickViewProduct.healthScore}%` }}
                    ></div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    dispatch({ type: "ADD_ITEM", payload: quickViewProduct });
                    setQuickViewProduct(null);
                  }}
                  className="btn-primary w-full flex justify-center items-center gap-3 py-4 text-base"
                >
                  <FaCartShopping /> Add to Cart
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Chatbot Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-eatpur-green-dark text-white p-4 rounded-full shadow-lg hover:-translate-y-1 transition-all group flex items-center justify-center border border-black/10"
        aria-label="Open Chat"
      >
        <FaCommentDots size={24} />
      </button>

      <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}
