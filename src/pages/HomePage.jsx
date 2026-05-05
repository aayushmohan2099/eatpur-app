import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HomeAnalytics } from "../api/homepage"; // Ensure this uses the updated client/axios interceptor
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
  FaQuoteLeft,
} from "react-icons/fa6";
import { useCart } from "../context/CartContext";
import Chatbot from "../components/Chatbot";
import FloatingImagesBackground from "./FloatingBG/floatingBG";
import DistortedGallery from "../components/DistortedGallery";

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
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  // Live API Data States
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [topBlogs, setTopBlogs] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const BASE_URL = "https://eatpur.in";

  const fixUrlsDeep = (data) => {
    if (typeof data === "string") {
      return data
        .replace(/https?:\/\/66\.116\.207\.88/g, BASE_URL)
        .replace(/https?:\/\/eatpur\.in/g, BASE_URL);
    }

    if (Array.isArray(data)) {
      return data.map(fixUrlsDeep);
    }

    if (typeof data === "object" && data !== null) {
      const newObj = {};
      for (const key in data) {
        newObj[key] = fixUrlsDeep(data[key]);
      }
      return newObj;
    }

    return data;
  };

  // Fetch Home Analytics
  useEffect(() => {
    const fetchHomeAnalytics = async () => {
      try {
        setIsLoading(true);
        const res = await HomeAnalytics();
        const rawData = res.data?.results || res.data || res;
        const data = fixUrlsDeep(rawData);
        
        // 1. Map Top Blogs
        if (data.top_blogs) setTopBlogs(data.top_blogs);

        // 2. Map Google Form Responses (Reviews)
        if (data.google_form_responses)
          setUserReviews(data.google_form_responses);

        // 3. Flatten Trending Categories into a single array of products
        if (data.trending_by_category) {
          const flatProducts = data.trending_by_category.flatMap((cat) =>
            cat.products.map((prod) => ({
              ...prod,
              categoryName: cat.category?.name || "Ready to Eat",
            })),
          );
          setTrendingProducts(flatProducts);
        }
      } catch (err) {
        console.error("Error fetching home analytics", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHomeAnalytics();
  }, []);

  // Hero Carousel Timer
  useEffect(() => {
    const heroTimer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 3500);
    return () => clearInterval(heroTimer);
  }, []);

  return (
    <div className="w-full relative min-h-screen bg-[#FAFAFA]">
      {/* Hero Section */}
      <section className="relative w-full pt-20 pb-20 md:pt-28 md:pb-32 px-6 overflow-hidden bg-cover bg-center bg-no-repeat bg-[url('/home/Mobanner.png')]">
        {/* Floating 3D Images Background */}
        <FloatingImagesBackground />

        {/* Soft Gradient Overlay */}
        <div className="absolute top-0 right-0 w-full md:w-1/2 h-full bg-gradient-to-l from-eatpur-green-light/90 to-transparent pointer-events-none z-[1]" />

        {/* Content Container */}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
          {/* LEFT SIDE: Image Carousel */}
          <div className="flex-1 w-full flex justify-center md:justify-start lg:pr-12">
            <div className="relative w-full max-w-[340px] md:max-w-[500px] aspect-[3/4]">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 1.2 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {/* PURE IMAGE + SHADOW */}
                <div className="w-full h-full drop-shadow-[0_25px_40px_rgba(0,0,0,0.25)]">
                  <DistortedGallery images={heroImages} />
                </div>
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

      {/* Featured Products (Live API Data) */}
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
          <div className="absolute top-0 left-0 w-16 md:w-32 h-full bg-gradient-to-r from-eatpur-white-warm to-transparent z-10 pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-16 md:w-32 h-full bg-gradient-to-l from-eatpur-white-warm to-transparent z-10 pointer-events-none"></div>

          {isLoading ? (
            <div className="w-full py-20 text-center text-eatpur-text italic font-serif animate-pulse">
              Loading best sellers...
            </div>
          ) : trendingProducts.length > 0 ? (
            <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
              {/* Render the lists twice to create the infinite loop */}
              {[0, 1].map((loopIndex) => (
                <div
                  key={loopIndex}
                  className="flex gap-8 px-4"
                  aria-hidden={loopIndex === 1 ? "true" : "false"}
                >
                  {trendingProducts.map((product) => {
                    const fallbackImage = "/home/prod-carousel/MultiFlour.jpeg";
                    const displayImg =
                      product.media?.[0]?.image ||
                      product.cover_image ||
                      fallbackImage;
                    const healthScore = 90; // Defaulting health score as it's not in the API currently

                    return (
                      <div
                        key={`${loopIndex}-${product.id}`}
                        className="vintage-card w-[280px] md:w-[320px] shrink-0 overflow-hidden flex flex-col group/card relative transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl bg-white"
                      >
                        {/* Top Right Discount Tag */}
                        {product.discounted_price && product.fixed_price && (
                          <div className="absolute top-4 right-4 z-20 bg-[#8B3A2A] text-white font-sans text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md">
                            {Math.round(
                              ((product.fixed_price -
                                product.discounted_price) /
                                product.fixed_price) *
                                100,
                            )}
                            % OFF
                          </div>
                        )}

                        <div className="h-64 overflow-hidden p-6 pb-0 flex items-center justify-center bg-gray-50 relative">
                          <motion.img
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.4 }}
                            src={displayImg}
                            alt={product.name}
                            className="h-full object-contain drop-shadow-md rounded-t-xl mix-blend-multiply"
                            loading="lazy"
                          />
                          <button
                            onClick={() =>
                              setQuickViewProduct({
                                ...product,
                                image: displayImg,
                                healthScore,
                              })
                            }
                            className="absolute inset-0 bg-eatpur-white-warm/80 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity backdrop-blur-sm"
                          >
                            <span className="flex items-center gap-2 border border-eatpur-dark text-eatpur-dark px-6 py-3 rounded-full font-display hover:bg-eatpur-dark hover:text-white transition-colors">
                              <FaEye /> Quick View
                            </span>
                          </button>
                        </div>

                        <div className="p-6 flex flex-col flex-1 border-t border-black/5">
                          <span className="text-eatpur-green-dark text-[11px] uppercase tracking-widest font-semibold mb-1 truncate">
                            {product.categoryName}
                          </span>
                          <h3 className="text-xl font-display font-medium text-eatpur-dark mb-1 truncate">
                            {product.name}
                          </h3>

                          {/* Eatpur Health Score Meter */}
                          <div className="mt-3 mb-4 w-full bg-gray-100 rounded-full h-2 overflow-hidden shadow-inner flex items-center relative">
                            <div
                              className="h-full bg-eatpur-green-dark"
                              style={{ width: `${healthScore}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-eatpur-text flex justify-between mb-2">
                            <span className="font-medium text-eatpur-green-dark">
                              Health Score
                            </span>
                            <span className="font-bold">{healthScore}/100</span>
                          </div>

                          <div className="mt-auto flex items-end justify-between pt-4">
                            <div className="flex flex-col">
                              {product.discounted_price ? (
                                <>
                                  <div className="flex items-start gap-1.5 mb-0.5">
                                    <span className="relative text-sm font-sans text-eatpur-text/60">
                                      ₹{product.fixed_price}
                                      <span className="absolute top-1/2 left-[-10%] w-[120%] h-[1.5px] bg-[#8B3A2A] -rotate-[15deg] origin-center"></span>
                                    </span>
                                  </div>
                                  <span className="text-xl font-bold text-[#3A5A1C]">
                                    ₹{product.discounted_price}
                                  </span>
                                </>
                              ) : (
                                <span className="text-xl font-bold text-[#3A5A1C]">
                                  ₹{product.fixed_price}
                                </span>
                              )}
                            </div>

                            <button
                              onClick={() =>
                                dispatch({
                                  type: "ADD_ITEM",
                                  payload: {
                                    ...product,
                                    image: displayImg,
                                    price:
                                      product.discounted_price ||
                                      product.fixed_price,
                                  },
                                })
                              }
                              className="w-10 h-10 rounded-full border border-eatpur-dark/20 flex items-center justify-center text-eatpur-dark hover:bg-eatpur-green-dark hover:border-eatpur-green-dark hover:text-white transition-all transform hover:scale-105"
                              aria-label="Add to cart"
                            >
                              <FaCartShopping size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full text-center text-eatpur-text italic font-serif">
              Check back soon for new arrivals!
            </div>
          )}
        </div>
        {/* --- PREMIUM SCROLLING CAROUSEL END --- */}

        <div className="mt-12 text-center">
          <Link to="/products" className="btn-ghost shadow-sm">
            View All Products
          </Link>
        </div>
      </section>

      {/* Featured Blogs Section (Live API Data) */}
      <section className="py-24 px-6 bg-white relative border-t border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display text-eatpur-dark mb-4">
              Our Blogs
            </h2>
            <p className="text-eatpur-text font-serif italic">
              Discover modern nutrition through ancient wisdom.
            </p>
          </div>

          {isLoading ? (
            <div className="text-center italic font-serif text-eatpur-text animate-pulse">
              Loading latest stories...
            </div>
          ) : topBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {topBlogs.map((blog, i) => (
                <Link to={`/preview-blog/${blog.id}`} key={blog.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="vintage-card group cursor-pointer flex flex-col h-full border border-black/5 shadow-sm overflow-hidden bg-eatpur-white-warm"
                  >
                    <div className="h-64 overflow-hidden rounded-t-xl bg-gray-100 flex items-center justify-center">
                      <img
                        src={
                          blog.cover_image ||
                          "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400"
                        }
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-8 flex flex-col flex-1 border-t border-black/5">
                      <div className="text-xs font-semibold text-eatpur-green-dark uppercase tracking-wider mb-3">
                        By {blog.display_author || "Anonymous"}
                      </div>
                      <h3 className="text-2xl font-display text-eatpur-dark mb-3 group-hover:text-eatpur-green-dark transition-colors">
                        {blog.title}
                      </h3>
                      <p className="text-eatpur-text line-clamp-3 mb-6 font-serif text-sm opacity-80">
                        {blog.meta_description ||
                          "Read more about this wonderful insight into healthy living..."}
                      </p>
                      <div className="mt-auto flex items-center justify-between text-sm text-eatpur-text-light font-medium">
                        <span>
                          {new Date(blog.created_at).toLocaleDateString()}
                        </span>
                        <span className="flex gap-3">
                          <span className="flex items-center gap-1">
                            <FaEye />{" "}
                            {blog.views_count || blog.likes_count || 0}
                          </span>
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center italic font-serif text-eatpur-text">
              No stories available at the moment.
            </div>
          )}

          <div className="mt-16 text-center">
            <Link to="/blogs" className="btn-primary font-medium tracking-wide">
              View All Blogs
            </Link>
          </div>
        </div>
      </section>

      {/* NEW SECTION: Verified User Reviews (Live API Data) */}
      <section className="py-24 px-6 bg-eatpur-white-warm relative border-t border-black/5 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-semibold text-eatpur-dark mb-4 tracking-tight">
              What Our Family Says
            </h2>
            <p className="text-eatpur-text font-serif italic text-lg md:text-xl opacity-90">
              Real feedback from the EatPur community.
            </p>
          </div>

          {isLoading ? (
            <div className="text-center italic font-serif text-eatpur-text text-lg animate-pulse">
              Loading reviews...
            </div>
          ) : userReviews.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-6 md:gap-8">
              {userReviews.map((review, i) => (
                <motion.figure
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  key={review.id || i}
                  className="relative bg-white rounded-lg border-t-[5px] border-[#E37A2C] shadow-[0_6px_20px_rgba(0,0,0,0.08)] text-[#555] font-sans min-w-[260px] max-w-[340px] w-full text-center mt-[40px] mb-[10px] inline-block transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl"
                >
                  <figcaption className="px-6 pt-14 pb-8">
                    {/* Quote Icon */}
                    <div className="absolute left-1/2 -top-[32px] -translate-x-1/2 bg-white rounded-full shadow-md text-[#E37A2C] w-[64px] h-[64px] flex items-center justify-center text-2xl">
                      <FaQuoteLeft />
                    </div>

                    {/* Review Text */}
                    <blockquote className="mb-6 text-eatpur-dark text-[16px] md:text-[17px] leading-relaxed font-medium">
                      <p className="opacity-90">
                        “{review.response_description}”
                      </p>
                    </blockquote>

                    {/* Name */}
                    <h3 className="text-eatpur-dark text-xl md:text-2xl font-display font-semibold leading-tight mb-1">
                      {review.name}
                    </h3>

                    {/* Subtitle */}
                    <h4 className="text-sm md:text-base font-medium tracking-wide text-eatpur-green-dark opacity-80">
                      Verified Customer
                    </h4>
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          ) : (
            <div className="text-center italic font-serif text-eatpur-text text-lg">
              No reviews yet. Be the first to share your experience!
            </div>
          )}
        </div>
      </section>

      {/* Special Offer Banner / Section */}
      <section className="py-20 px-6 relative bg-transparent text-center">
        {/* The Dark Green Vintage Card */}
        <div className="max-w-4xl mx-auto relative z-10 border border-[#D4C4A8]/40 p-8 md:p-14 rounded-[12px] bg-[#3A5A1C] shadow-[0_8px_30px_rgba(58,40,10,0.15)]">
          <div className="text-[#C8922A] text-sm tracking-[0.3em] mb-4">
            ✦ ─── ─── ✦
          </div>
          <h2 className="text-[#FFFDF8] font-serif text-4xl md:text-5xl mb-4 tracking-wide drop-shadow-sm">
            Special Sale
          </h2>
          <p className="text-[#FFFDF8]/90 font-serif italic text-lg mb-8">
            Up to 30% off on all organic millets.
          </p>
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
                  {quickViewProduct.categoryName || quickViewProduct.category}
                </span>
                <h2 className="text-3xl md:text-4xl font-display text-eatpur-dark mb-4">
                  {quickViewProduct.name}
                </h2>
                <span className="text-2xl font-medium text-eatpur-dark mb-6 border-b border-black/10 pb-4">
                  ₹
                  {quickViewProduct.discounted_price ||
                    quickViewProduct.fixed_price}
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
                    dispatch({
                      type: "ADD_ITEM",
                      payload: {
                        ...quickViewProduct,
                        price:
                          quickViewProduct.discounted_price ||
                          quickViewProduct.fixed_price,
                      },
                    });
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
