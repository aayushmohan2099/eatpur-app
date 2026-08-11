// src/pages/ProductsPage.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCartShopping,
  FaEye,
  FaXmark,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa6";
import { useCart } from "../context/CartContext";
import { ProductCatalog, getCategories } from "../api/inventory";
import ProductFilters from "./ProductComponents/ProductFilters";
import ProductSortBar from "./ProductComponents/ProductSortBar";
import CartButton from "../components/ui/CartButton";

// ===========================================================================
// DEBOUNCE HOOK (Optimization)
// ===========================================================================
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// ===========================================================================
// SLIDESHOW COMPONENT FOR PRODUCT CARDS
// ===========================================================================
const ImageCarousel = ({ images, alt, onClickView }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Safely handle arrays or strings
  const validImages = Array.isArray(images)
    ? images
    : typeof images === "string" && images.trim() !== ""
      ? [images]
      : [];

  if (validImages.length === 0) {
    return (
      <div className="w-full h-full bg-slate-50 flex items-center justify-center text-eatpur-text-light text-sm italic font-serif">
        No Image Available
      </div>
    );
  }

  if (validImages.length === 1) {
    return (
      <img
        src={validImages[0]}
        alt={alt}
        className="w-full h-full object-contain mix-blend-multiply drop-shadow-md transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
    );
  }

  const next = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % validImages.length);
  };

  const prev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex(
      (prev) => (prev - 1 + validImages.length) % validImages.length,
    );
  };

  return (
    <div className="relative w-full h-full group/carousel flex items-center justify-center">
      <img
        src={validImages[currentIndex]}
        alt={`${alt} - View ${currentIndex + 1}`}
        className="w-full h-full object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-md text-eatpur-dark flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all hover:bg-eatpur-green-dark hover:text-white hover:scale-110 z-20"
        aria-label="Previous image"
      >
        <FaChevronLeft size={12} className="-ml-0.5" />
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-md text-eatpur-dark flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all hover:bg-eatpur-green-dark hover:text-white hover:scale-110 z-20"
        aria-label="Next image"
      >
        <FaChevronRight size={12} className="-mr-0.5" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
        {validImages.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? "w-5 bg-eatpur-green-dark shadow-sm" : "w-1.5 bg-black/20 hover:bg-black/40"}`}
          />
        ))}
      </div>
    </div>
  );
};

// ===========================================================================
// MAIN PAGE COMPONENT
// ===========================================================================
export default function ProductsPage() {
  const { dispatch } = useCart();

  // State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Filter & Sort State
  const [filters, setFilters] = useState({
    q: "",
    category: "",
    size: "",
    min_price: "",
    max_price: "",
    min_weight: "",
    max_weight: "",
  });
  const [sort, setSort] = useState("");

  // NEW: Sidebar state (Auto collapse on mobile)
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsFilterOpen(false);
    handleResize(); // Check on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const debouncedFilters = useDebounce(filters, 500); // 500ms delay

  // Fetch Categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await getCategories();
        const data = res.data || res.results || res;
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCats();
  }, []);

  // Fetch Products
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const params = { ...debouncedFilters, sort };
        const res = await ProductCatalog(params);
        setProducts(res.results || res.data || res);
      } catch (err) {
        console.error("Failed to fetch catalog", err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [debouncedFilters, sort]);

  // Health Score Calculator
  const calculateHealthScore = (product) => {
    if (!product || (!product.protein && !product.fibre)) return 85;
    const score =
      100 -
      Number(product.calories || 0) / 10 +
      Number(product.protein || 0) * 2 +
      Number(product.fibre || 0) * 3 -
      Number(product.fats || 0);
    return Math.min(100, Math.max(50, Math.round(score)));
  };

  return (
    <div className="w-full min-h-screen pb-32 relative z-10 font-sans text-eatpur-dark bg-eatpur-white-warm overflow-x-hidden">
      {/* Hero Banner */}
      <section className="pt-20 pb-16 px-4 md:px-8 relative flex flex-col items-center justify-center text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-eatpur-green-light/20 to-transparent pointer-events-none -z-10" />
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
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-[#2E2410] mb-6 leading-tight tracking-tight">
            Our Pantry
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl font-serif italic text-eatpur-text max-w-2xl mx-auto">
            Pure, normalized nutrition. Filtered precisely to your needs.
          </p>
        </motion.div>
      </section>

      {/* Main Layout - Full Width Spanning */}
      <div className="w-full px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8 items-start">
        {/* LEFT SIDEBAR: Filters (Collapsible width) */}
        {/* <motion.div
          layout
          className={`w-full shrink-0 z-40 transition-all duration-300 ease-in-out ${isFilterOpen ? "lg:w-[320px]" : "lg:w-[220px]"}`}
        >
          <div className="sticky top-24">
            <ProductFilters
              filters={filters}
              setFilters={setFilters}
              categories={categories}
              isOpen={isFilterOpen}
              setIsOpen={setIsFilterOpen}
            />
          </div>
        </motion.div> */}

        {/* RIGHT AREA: Sort Bar & Fluid Grid */}
        <motion.div layout className="flex-1 min-w-0 flex flex-col gap-6">
          {/* Top Sort Bar - Spans full remaining width */}
          <div className="sticky top-24 z-40 w-full shadow-sm rounded-xl">
            <ProductSortBar
              sort={sort}
              setSort={setSort}
              totalCount={products.length}
            />
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                <div
                  key={i}
                  className="animate-pulse bg-white h-[420px] rounded-2xl border border-eatpur-gray-light shadow-sm"
                ></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-2xl border border-eatpur-gray-light shadow-sm w-full">
              <h3 className="font-display text-2xl text-eatpur-dark mb-3">
                No Products Found
              </h3>
              <p className="text-eatpur-text-light font-serif italic text-lg">
                Try adjusting your filters or search terms.
              </p>
              <button
                onClick={() =>
                  setFilters({
                    q: "",
                    category: "",
                    size: "",
                    min_price: "",
                    max_price: "",
                    min_weight: "",
                    max_weight: "",
                  })
                }
                className="mt-6 px-6 py-2 bg-eatpur-green-dark text-white rounded-full font-medium hover:bg-eatpur-dark transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
            >
              <AnimatePresence>
                {products.map((product, i) => {
                  const healthScore = calculateHealthScore(product);
                  const discountPct = Number(product.discount_percentage || 0);

                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      key={product.id}
                      className="vintage-card overflow-hidden flex flex-col group relative bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1 rounded-2xl border border-eatpur-border"
                    >
                      {/* Top Badges */}
                      <div className="absolute top-4 left-4 right-4 z-30 flex justify-between items-start pointer-events-none">
                        {/* Trending Tag */}
                        <div>
                          {product.is_trending && (
                            <span className="bg-eatpur-gold-dark text-white font-sans text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded shadow-md inline-block">
                              Trending
                            </span>
                          )}
                        </div>
                        {/* Discount Tag */}
                        <div>
                          {discountPct > 0 && (
                            <span className="bg-rose-600 text-white font-sans text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md inline-block">
                              {discountPct}% OFF
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Image Area with Slideshow */}
                      <div className="h-64 relative bg-[#FAFCFA] p-6 flex justify-center items-center overflow-hidden">
                        <ImageCarousel
                          images={product.cover_image}
                          alt={product.name}
                        />
                      </div>

                      {/* Content Area */}
                      <div className="p-5 flex flex-col flex-1 bg-white">
                        {/* Meta info */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] text-eatpur-green-dark font-bold uppercase tracking-wider bg-eatpur-green-light/20 px-2.5 py-1 rounded">
                            {product.category_name}
                          </span>
                          <span className="text-[11px] text-eatpur-text-light font-mono font-medium bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">
                            {product.size_name} ({product.weight}
                            {product.unit})
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-serif font-bold text-eatpur-dark mb-2 leading-tight min-h-[3rem] group-hover:text-eatpur-green-dark transition-colors">
                          {product.name}
                        </h3>

                        {/* Health Score Meter */}
                        <div className="mt-2 mb-1 w-full bg-eatpur-yellow-light/30 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-eatpur-green-light to-eatpur-green-dark rounded-full"
                            style={{ width: `${healthScore}%` }}
                          ></div>
                        </div>
                        <div className="text-[11px] text-eatpur-text flex justify-between mb-6">
                          <span className="font-semibold text-eatpur-green-dark">
                            Eatpur Health Score
                          </span>
                          <span className="font-bold">{healthScore}/100</span>
                        </div>

                        {/* Price & Action Footer */}
                        <div className="mt-auto flex items-end justify-between pt-4">
                          <div className="flex flex-col">
                            {Number(product.fixed_price) >
                              Number(product.discounted_price) && (
                              <div className="flex items-start mb-0.5">
                                <span className="relative text-sm font-sans text-eatpur-text-light font-medium">
                                  ₹{product.fixed_price}
                                  <span className="absolute top-1/2 left-[-10%] w-[120%] h-[1.5px] bg-rose-500/80 -rotate-[12deg]"></span>
                                </span>
                              </div>
                            )}
                            <span className="text-2xl font-bold text-eatpur-dark tracking-tight">
                              ₹{product.discounted_price}
                            </span>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setQuickViewProduct(product);
                            }}
                            className="w-12 h-12 rounded-full bg-eatpur-green-dark text-white flex items-center justify-center transform hover:scale-110 hover:bg-eatpur-dark transition-all shadow-md active:scale-95"
                            aria-label="Quick View"
                          >
                            <FaEye size={16} className="-ml-0.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* =========================================================================== */}
      {/* QUICK VIEW MODAL */}
      {/* =========================================================================== */}
      <AnimatePresence>
        {quickViewProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-start md:items-center justify-center p-4 pt-24 md:pt-4 bg-eatpur-dark/70 backdrop-blur-md overflow-y-auto"
            onClick={() => setQuickViewProduct(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto relative flex flex-col md:flex-row rounded-3xl shadow-2xl border border-eatpur-gray-light"
            >
              <button
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 right-4 z-50 text-eatpur-text hover:text-eatpur-dark p-2.5 bg-white/90 rounded-full shadow-lg transition-transform hover:scale-110 border border-slate-100"
              >
                <FaXmark size={20} />
              </button>

              {/* Left Side: Images */}
              <div className="md:w-1/2 p-6 md:p-10 bg-eatpur-green-dark flex flex-col">
                <div className="flex-1 min-h-[300px] md:min-h-[400px] relative rounded-2xl overflow-hidden bg-white shadow-sm border border-slate-100">
                  <ImageCarousel
                    images={quickViewProduct.cover_image}
                    alt={quickViewProduct.name}
                    onClickView={(e) => e.stopPropagation()}
                  />
                </div>

                {/* Visual Thumbnail Strip */}
                {Array.isArray(quickViewProduct.cover_image) &&
                  quickViewProduct.cover_image.length > 1 && (
                    <div className="flex gap-3 mt-6 overflow-x-auto hide-scrollbar pb-2">
                      {quickViewProduct.cover_image.map((img, idx) => (
                        <div
                          key={idx}
                          className="w-16 h-16 shrink-0 rounded-lg border border-slate-200 bg-white p-1 shadow-sm"
                        >
                          <img
                            src={img}
                            alt="thumbnail"
                            className="w-full h-full object-contain mix-blend-multiply"
                          />
                        </div>
                      ))}
                    </div>
                  )}
              </div>

              {/* Right Side: Details */}
              <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-center bg-white relative">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-eatpur-green-dark font-sans font-bold text-[10px] tracking-widest uppercase px-3 py-1 bg-eatpur-green-light/20 rounded">
                    {quickViewProduct.category_name}
                  </span>
                  <span className="text-eatpur-text font-sans font-bold text-[10px] tracking-widest uppercase px-3 py-1 bg-slate-100 rounded">
                    {quickViewProduct.size_name} ({quickViewProduct.weight}
                    {quickViewProduct.unit})
                  </span>
                  {quickViewProduct.is_trending && (
                    <span className="text-eatpur-gold-dark font-sans font-bold text-[10px] tracking-widest uppercase px-3 py-1 bg-eatpur-gold-light/20 rounded">
                      Trending
                    </span>
                  )}
                </div>

                <h2 className="text-3xl md:text-4xl font-serif text-eatpur-dark font-bold mb-2 leading-tight">
                  {quickViewProduct.name}
                </h2>
                <p className="text-xs font-mono text-eatpur-text-light mb-6">
                  PID: {quickViewProduct.pid}
                </p>

                <div className="flex items-baseline gap-4 mb-8 border-b border-eatpur-gray-light pb-6">
                  <span className="text-5xl font-bold text-eatpur-dark tracking-tight">
                    ₹{quickViewProduct.discounted_price}
                  </span>
                  {Number(quickViewProduct.fixed_price) >
                    Number(quickViewProduct.discounted_price) && (
                    <div className="flex flex-col items-start">
                      <span className="relative text-xl font-sans text-eatpur-text-light font-medium">
                        ₹{quickViewProduct.fixed_price}
                        <span className="absolute top-1/2 left-[-5%] w-[110%] h-[2px] bg-rose-500/80 -rotate-[12deg]"></span>
                      </span>
                      <span className="text-rose-600 font-bold text-xs uppercase tracking-wider bg-rose-50 px-2 py-0.5 rounded mt-1">
                        Save {quickViewProduct.discount_percentage}%
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-eatpur-text font-sans leading-relaxed mb-8 text-sm md:text-base">
                  {quickViewProduct.description ||
                    "A pure, healthy product crafted for your wellbeing. Perfect for a balanced, modern lifestyle."}
                </p>

                {/* Macro Nutrients Grid */}
                <div
                  className="
                    flex md:grid
                    grid-cols-4
                    gap-3
                    mb-8

                    overflow-x-auto
                    md:overflow-visible
                    pb-2
                    md:pb-0
                    hide-scrollbar
                    snap-x
                    snap-mandatory
                  "
                >
                  {/* Protein */}
                  <div
                    className="
                      bg-[#FAFCFA]
                      p-3
                      text-center
                      rounded-xl
                      border border-eatpur-gray-light
                      shadow-sm
                      hover:border-eatpur-green-light
                      transition-colors

                      min-w-[110px]
                      md:min-w-0
                      shrink-0
                      snap-start
                    "
                  >
                    <div className="text-[10px] font-bold text-eatpur-text-light uppercase tracking-wider mb-1 whitespace-nowrap">
                      Protein
                    </div>

                    <div className="font-mono text-base font-bold text-eatpur-dark whitespace-nowrap">
                      {quickViewProduct.protein || 0}g
                    </div>
                  </div>

                  {/* Carbs */}
                  <div
                    className="
                      bg-[#FAFCFA]
                      p-3
                      text-center
                      rounded-xl
                      border border-eatpur-gray-light
                      shadow-sm
                      hover:border-eatpur-green-light
                      transition-colors

                      min-w-[110px]
                      md:min-w-0
                      shrink-0
                      snap-start
                    "
                  >
                    <div className="text-[10px] font-bold text-eatpur-text-light uppercase tracking-wider mb-1 whitespace-nowrap">
                      Carbs
                    </div>

                    <div className="font-mono text-base font-bold text-eatpur-dark whitespace-nowrap">
                      {quickViewProduct.carbohydrates || 0}g
                    </div>
                  </div>

                  {/* Fibre */}
                  <div
                    className="
                      bg-[#FAFCFA]
                      p-3
                      text-center
                      rounded-xl
                      border border-eatpur-gray-light
                      shadow-sm
                      hover:border-eatpur-green-light
                      transition-colors

                      min-w-[110px]
                      md:min-w-0
                      shrink-0
                      snap-start
                    "
                  >
                    <div className="text-[10px] font-bold text-eatpur-text-light uppercase tracking-wider mb-1 whitespace-nowrap">
                      Fibre
                    </div>

                    <div className="font-mono text-base font-bold text-eatpur-dark whitespace-nowrap">
                      {quickViewProduct.fibre || 0}g
                    </div>
                  </div>

                  {/* Calories */}
                  <div
                    className="
                      bg-[#FAFCFA]
                      p-3
                      text-center
                      rounded-xl
                      border border-eatpur-gray-light
                      shadow-sm
                      hover:border-eatpur-green-light
                      transition-colors

                      min-w-[110px]
                      md:min-w-0
                      shrink-0
                      snap-start
                    "
                  >
                    <div className="text-[10px] font-bold text-eatpur-text-light uppercase tracking-wider mb-1 whitespace-nowrap">
                      Calories
                    </div>

                    <div className="font-mono text-base font-bold text-eatpur-dark whitespace-nowrap">
                      {quickViewProduct.calories || 0}
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-4">
                  <CartButton
                    onClick={() => {
                      dispatch({ type: "ADD_ITEM", payload: quickViewProduct });
                      setTimeout(() => setQuickViewProduct(null), 1500);
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
