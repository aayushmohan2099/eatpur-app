// src/pages/ProductsPage.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCartShopping, FaStar, FaEye, FaXmark } from "react-icons/fa6";
import { useCart } from "../context/CartContext";
import { ProductCatalog, getCategories } from "../api/inventory";
import ProductFilters from "./ProductComponents/ProductFilters";
import ProductSortBar from "./ProductComponents/ProductSortBar";

// Debounce Hook to prevent API spam while typing in filters
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

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

  const debouncedFilters = useDebounce(filters, 500); // 500ms delay

  // Fetch Categories on Mount
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

  // Fetch Products based on debounced filters and sort
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

  // UI Helper: Calculate a visual health score from nutritional profile (Base 100)
  const calculateHealthScore = (profile) => {
    if (!profile || (!profile.protein && !profile.fibre)) return 85; // Fallback
    const score =
      100 -
      Number(profile.calories || 0) / 10 +
      Number(profile.protein || 0) * 2 +
      Number(profile.fibre || 0) * 3 -
      Number(profile.fats || 0);
    return Math.min(100, Math.max(50, Math.round(score)));
  };

  return (
    <div className="w-full min-h-screen pb-32 relative z-10 font-sans text-eatpur-dark bg-eatpur-white-warm">
      {/* Hero Banner */}
      <section className="pt-20 pb-16 px-6 relative flex flex-col items-center justify-center text-center">
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
          <h1 className="text-6xl md:text-8xl font-serif text-[#2E2410] mb-6 leading-[1.1] tracking-tight">
            Our Pantry
          </h1>
          <p className="text-lg md:text-xl font-serif italic text-eatpur-text max-w-2xl mx-auto">
            Pure, normalized nutrition. Filtered precisely to your needs.
          </p>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col lg:flex-row gap-8">
        {/* LEFT SIDEBAR: Filters */}
        <div className="lg:w-1/4 w-full">
          <div className="sticky top-24">
            <ProductFilters
              filters={filters}
              setFilters={setFilters}
              categories={categories}
            />
          </div>
        </div>

        {/* RIGHT AREA: Sort Bar & Grid */}
        <div className="lg:w-3/4 w-full">
          <div className="sticky top-24 z-50">
            <ProductSortBar
              sort={sort}
              setSort={setSort}
              totalCount={products.length}
            />
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="animate-pulse bg-white h-96 rounded-xl border border-eatpur-gray-light"
                ></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-eatpur-gray-light">
              <h3 className="font-display text-2xl text-eatpur-dark mb-2">
                No Products Found
              </h3>
              <p className="text-eatpur-text-light">
                Try adjusting your filters or search terms.
              </p>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {products.map((product, i) => {
                  const healthScore = calculateHealthScore(product);
                  const discountPct = product.discount_percentage || 0;

                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      key={product.id}
                      className="vintage-card overflow-hidden flex flex-col group relative bg-white transition-all hover:shadow-lg"
                    >
                      {/* Dynamic Discount Tag */}
                      {discountPct > 0 && (
                        <div className="absolute top-4 right-4 z-20 bg-rose-700 text-white font-sans text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md">
                          {discountPct}% OFF
                        </div>
                      )}

                      {/* Trending Tag */}
                      {product.is_trending && (
                        <div className="absolute top-4 left-4 z-20 bg-eatpur-gold-dark text-white font-sans text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded shadow-md">
                          Trending
                        </div>
                      )}

                      <div className="h-56 overflow-hidden relative bg-eatpur-white-warm p-6 pb-0 flex justify-center items-center">
                        {product.cover_image ? (
                          <motion.img
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.4 }}
                            src={product.cover_image}
                            alt={product.name}
                            className="h-full object-contain rounded-t-xl drop-shadow-md mix-blend-multiply"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-100 flex items-center justify-center text-eatpur-text-light text-sm">
                            No Image
                          </div>
                        )}

                        <div className="absolute inset-0 bg-eatpur-white-warm/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm pointer-events-none group-hover:pointer-events-auto z-10">
                          <button
                            onClick={() => setQuickViewProduct(product)}
                            className="flex items-center gap-2 border-2 border-eatpur-dark text-eatpur-dark px-6 py-2.5 rounded-full font-serif font-medium hover:bg-eatpur-dark hover:text-white transition-colors"
                          >
                            <FaEye /> Quick View
                          </button>
                        </div>
                      </div>

                      <div className="p-5 flex flex-col flex-1 border-t border-eatpur-gray-light bg-white">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] text-eatpur-green-dark font-bold uppercase tracking-wider bg-eatpur-green-light/20 px-2 py-1 rounded">
                            {product.category_name}
                          </span>
                          <span className="text-[10px] text-eatpur-text-light font-mono font-medium bg-slate-100 px-2 py-1 rounded">
                            {product.size_name} ({product.weight}
                            {product.unit})
                          </span>
                        </div>

                        <h3 className="text-lg font-serif font-semibold text-eatpur-dark mb-1 leading-tight line-clamp-2">
                          {product.name}
                        </h3>

                        {/* Health Score Meter */}
                        <div className="mt-4 mb-1 w-full bg-eatpur-yellow-light/40 rounded-full h-1.5 shadow-inner overflow-hidden">
                          <div
                            className="h-full bg-eatpur-green-dark rounded-full"
                            style={{ width: `${healthScore}%` }}
                          ></div>
                        </div>
                        <div className="text-[10px] text-eatpur-text flex justify-between mb-4">
                          <span className="font-medium text-eatpur-green-dark">
                            Eatpur Health Score
                          </span>
                          <span className="font-bold">{healthScore}/100</span>
                        </div>

                        <div className="mt-auto flex items-end justify-between pt-4 border-t border-eatpur-gray-light">
                          <div className="flex flex-col">
                            {Number(product.fixed_price) >
                              Number(product.discounted_price) && (
                              <div className="flex items-start gap-1.5 mb-0.5">
                                <span className="relative text-sm font-sans text-eatpur-text-light font-medium">
                                  ₹{product.fixed_price}
                                  <span className="absolute top-1/2 left-[-10%] w-[120%] h-[1.2px] bg-rose-700 -rotate-[15deg] origin-center"></span>
                                </span>
                              </div>
                            )}
                            <span className="text-2xl font-bold text-eatpur-green-dark">
                              ₹{product.discounted_price}
                            </span>
                          </div>

                          <button
                            onClick={() =>
                              dispatch({ type: "ADD_ITEM", payload: product })
                            }
                            className="w-10 h-10 rounded-full bg-eatpur-white-warm border border-eatpur-green-light text-eatpur-green-dark flex items-center justify-center hover:scale-110 hover:bg-eatpur-green-dark hover:text-white hover:border-eatpur-green-dark transition-all shadow-sm"
                            title="Add to Cart"
                          >
                            <FaCartShopping size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* QUICK VIEW MODAL */}
      <AnimatePresence>
        {quickViewProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setQuickViewProduct(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto relative flex flex-col md:flex-row rounded-2xl shadow-2xl border border-eatpur-gray-light"
            >
              <button
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 right-4 z-10 text-eatpur-text-light hover:text-eatpur-dark p-2 bg-white/90 rounded-full shadow-md transition-colors"
              >
                <FaXmark size={20} />
              </button>

              <div className="md:w-1/2 p-8 bg-eatpur-white-warm flex justify-center items-center">
                {quickViewProduct.cover_image ? (
                  <img
                    src={quickViewProduct.cover_image}
                    alt={quickViewProduct.name}
                    className="max-h-[400px] w-full object-contain mix-blend-multiply drop-shadow-xl"
                  />
                ) : (
                  <div className="text-eatpur-text-light">
                    No Image Available
                  </div>
                )}
              </div>

              <div className="md:w-1/2 p-8 flex flex-col justify-center bg-white">
                <div className="flex gap-2 mb-3">
                  <span className="text-eatpur-green-dark font-sans font-bold text-[10px] tracking-widest uppercase px-3 py-1 bg-eatpur-green-light/20 rounded inline-block">
                    {quickViewProduct.category_name}
                  </span>
                  <span className="text-eatpur-text font-sans font-bold text-[10px] tracking-widest uppercase px-3 py-1 bg-slate-100 rounded inline-block">
                    {quickViewProduct.size_name} ({quickViewProduct.weight}
                    {quickViewProduct.unit})
                  </span>
                </div>

                <h2 className="text-3xl font-display text-eatpur-dark font-bold mb-2">
                  {quickViewProduct.name}
                </h2>
                <p className="text-xs font-mono text-eatpur-text-light mb-4">
                  PID: {quickViewProduct.pid}
                </p>

                <div className="flex items-baseline gap-3 mb-6 border-b border-eatpur-gray-light pb-4">
                  <span className="text-4xl font-bold text-eatpur-green-dark">
                    ₹{quickViewProduct.discounted_price}
                  </span>
                  {Number(quickViewProduct.fixed_price) >
                    Number(quickViewProduct.discounted_price) && (
                    <>
                      <span className="relative text-xl font-sans text-eatpur-text-light font-medium">
                        ₹{quickViewProduct.fixed_price}
                        <span className="absolute top-1/2 left-[-5%] w-[110%] h-[2px] bg-rose-700 -rotate-[12deg] origin-center"></span>
                      </span>
                      <span className="text-rose-700 font-bold text-xs uppercase tracking-wider bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                        {quickViewProduct.discount_percentage}% OFF
                      </span>
                    </>
                  )}
                </div>

                <p className="text-eatpur-text font-sans leading-relaxed mb-6 text-sm">
                  {quickViewProduct.description ||
                    "A pure, healthy product crafted for your wellbeing. Perfect for a balanced, modern lifestyle."}
                </p>

                {/* Macro Nutrients Grid */}
                <div className="grid grid-cols-4 gap-2 mb-6">
                  <div className="bg-eatpur-white-warm p-2 text-center rounded border border-eatpur-gray-light">
                    <div className="text-[10px] font-bold text-eatpur-text-light uppercase">
                      Protein
                    </div>
                    <div className="font-mono text-sm text-eatpur-dark">
                      {quickViewProduct.protein || 0}g
                    </div>
                  </div>
                  <div className="bg-eatpur-white-warm p-2 text-center rounded border border-eatpur-gray-light">
                    <div className="text-[10px] font-bold text-eatpur-text-light uppercase">
                      Carbs
                    </div>
                    <div className="font-mono text-sm text-eatpur-dark">
                      {quickViewProduct.carbohydrates || 0}g
                    </div>
                  </div>
                  <div className="bg-eatpur-white-warm p-2 text-center rounded border border-eatpur-gray-light">
                    <div className="text-[10px] font-bold text-eatpur-text-light uppercase">
                      Fibre
                    </div>
                    <div className="font-mono text-sm text-eatpur-dark">
                      {quickViewProduct.fibre || 0}g
                    </div>
                  </div>
                  <div className="bg-eatpur-white-warm p-2 text-center rounded border border-eatpur-gray-light">
                    <div className="text-[10px] font-bold text-eatpur-text-light uppercase">
                      Calories
                    </div>
                    <div className="font-mono text-sm text-eatpur-dark">
                      {quickViewProduct.calories || 0}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    dispatch({ type: "ADD_ITEM", payload: quickViewProduct });
                    setQuickViewProduct(null);
                  }}
                  className="bg-eatpur-green-dark hover:bg-[#55721c] text-white w-full flex justify-center items-center gap-3 py-3.5 text-base font-display font-bold rounded-xl transition-all shadow-md transform hover:-translate-y-0.5"
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
