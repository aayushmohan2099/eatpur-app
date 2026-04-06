import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCartShopping, FaStar, FaEye, FaXmark } from "react-icons/fa6";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const ALL_PRODUCTS = [
  {
    id: 1,
    name: "Sprouted Ragi Flour",
    price: 149,
    description: "Calcium-rich sprouted finger millet flour.",
    category: "Raw Flour",
    healthScore: 92,
    image: "/Products/Sprouted_Ragi_Flour_202604061614.jpeg",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Millet Noodles",
    price: 99,
    description: "Healthy hakka style noodles made purely from millets.",
    category: "Ready to Cook",
    healthScore: 85,
    image: "/Products/Millet_noodles_EATPUR_202604061614.jpeg",
    rating: 4.5,
  },
  {
    id: 3,
    name: "Pearl Millet Cookies",
    price: 129,
    description: "Crispy, crunchy bajra cookies sweetened with jaggery.",
    category: "Ready to Eat",
    healthScore: 78,
    image: "/Products/Pearl_Millet_Cookies_202604061611.jpeg",
    rating: 4.9,
  },
  {
    id: 4,
    name: "Jowar Flakes",
    price: 110,
    description: "Crunchy jowar flakes for a perfect healthy breakfast.",
    category: "Ready to Eat",
    healthScore: 88,
    image: "/Products/Jowar_flakes_for_202604061615.jpeg",
    rating: 4.6,
  },
  {
    id: 5,
    name: "Multi-millet Dosa Mix",
    price: 175,
    description: "Instant dosa mix made with 5 different millets.",
    category: "Ready to Cook",
    healthScore: 90,
    image: "/Products/Multi-millet_Dosa_Mix_202604061614.jpeg",
    rating: 4.7,
  },
  {
    id: 6,
    name: "Barnyard Millet Flour",
    price: 135,
    description: "Perfect fasting flour with high fiber content.",
    category: "Raw Flour",
    healthScore: 95,
    image: "/Products/Barnyard_Millet_Flour_202604061614.jpeg",
    rating: 4.8,
  },
];

const CATEGORIES = ["All", "Ready to Eat", "Ready to Cook", "Raw Flour"];

export default function ProductsPage() {
  const { dispatch } = useCart();
  const [activeFilter, setActiveFilter] = useState("All");
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const filteredProducts =
    activeFilter === "All"
      ? ALL_PRODUCTS
      : ALL_PRODUCTS.filter((p) => p.category === activeFilter);

  return (
    <div className="w-full min-h-screen pb-32 px-6 relative z-10">
      {/* Short Hero Banner */}
      <section className="pt-16 pb-16 px-6 relative flex flex-col items-center justify-center text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-eatpur-green-light/10 to-transparent pointer-events-none -z-10" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img src="/icons/flourish-top.png" alt="" className="h-6 mx-auto mb-4 opacity-50" onError={(e) => e.target.style.display = 'none'} />
          <h1 className="text-6xl md:text-8xl font-display text-eatpur-dark mb-6 leading-[1.1] tracking-tight">
            Our Pantry
          </h1>
          <p className="text-xl md:text-2xl font-serif italic text-eatpur-text max-w-2xl mx-auto">
            Pure millet nutrition, thoughtfully crafted.
          </p>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto">
        {/* Filter Bar */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-6 py-2 rounded-full font-sans font-medium transition-all duration-300 ${activeFilter === category
                ? "bg-[#6B8E23] text-white shadow-md"
                : "bg-[#FFFDF8] text-[#5C4F3A] border border-[#D4C4A8] hover:border-[#6B8E23] hover:text-[#6B8E23]"
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredProducts.map((product, i) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                key={product.id}
                className="vintage-card overflow-hidden flex flex-col group relative bg-[#FFFDF8]/80 backdrop-blur-sm border border-[#D4C4A8]/40 rounded-xl"
              >
                {/* --- NEW: Top Right 30% OFF Tag --- */}
                <div className="absolute top-4 right-4 z-20 bg-[#8B3A2A] text-white font-sans text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md">
                  30% OFF
                </div>

                <div className="h-64 overflow-hidden relative bg-white/30 p-6 pb-0 flex justify-center items-center">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                    src={product.image}
                    alt={product.name}
                    className="h-full object-contain rounded-t-xl drop-shadow-md"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md px-3 py-1 text-[10px] text-[#6B8E23] font-bold uppercase tracking-wider border border-[#6B8E23]/20 shadow-sm rounded">
                    {product.category}
                  </div>

                  <div className="absolute inset-0 bg-[#F4EEE0]/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm pointer-events-none group-hover:pointer-events-auto">
                    <button
                      onClick={() => setQuickViewProduct(product)}
                      className="flex items-center gap-2 border border-[#2E2410] text-[#2E2410] px-6 py-3 rounded-full font-serif hover:bg-[#2E2410] hover:text-white transition-colors"
                    >
                      <FaEye /> Quick View
                    </button>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1 border-t border-[#D4C4A8]/20 bg-white/40">
                  <div className="flex items-center gap-1 text-[#C8922A] text-sm mb-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={i < Math.floor(product.rating) ? "text-[#C8922A]" : "text-gray-200"}
                      />
                    ))}
                    <span className="text-[#5C4F3A] ml-2 text-xs">{product.rating}</span>
                  </div>

                  <h3 className="text-xl font-serif font-semibold text-[#2E2410] mb-1">
                    {product.name}
                  </h3>
                  <p className="text-[#5C4F3A] text-sm mb-4 line-clamp-2 font-sans">
                    {product.description}
                  </p>

                  {/* Eatpur Health Score Meter */}
                  <div className="mt-2 mb-1 w-full bg-[#EADDCA]/50 rounded-full h-1.5 shadow-inner overflow-hidden">
                    <div className="h-full bg-[#6B8E23] rounded-full" style={{ width: `${product.healthScore}%` }}></div>
                  </div>
                  <div className="text-[11px] text-[#5C4F3A] flex justify-between mb-6">
                    <span className="font-medium text-[#6B8E23]">Health Score</span>
                    <span className="font-bold">{product.healthScore}/100</span>
                  </div>

                  {/* --- UPDATED: Price Block with Discount logic --- */}
                  <div className="mt-auto flex items-end justify-between pt-4 border-t border-[#D4C4A8]/20">
                    <div className="flex flex-col">
                      <div className="flex items-start gap-1.5 mb-0.5">
                        <span className="relative text-sm font-sans text-[#5C4F3A]/60">
                          ₹{product.price}
                          {/* Diagonal Strikethrough (Top-Right to Bottom-Left) */}
                          <span className="absolute top-1/2 left-[-10%] w-[120%] h-[1.2px] bg-[#8B3A2A] -rotate-[15deg] origin-center"></span>
                        </span>
                        {/* <sup className="text-[#8B3A2A] font-bold text-[9px] mt-1 tracking-wider uppercase">
                          30% OFF
                        </sup> */}
                      </div>
                      <span className="text-2xl font-bold text-[#3A5A1C]">
                        ₹{Math.round(product.price * 0.7)}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => dispatch({ type: "ADD_ITEM", payload: product })}
                        className="w-11 h-11 rounded-full border border-[#2E2410]/20 text-[#2E2410] flex items-center justify-center hover:scale-110 hover:bg-[#6B8E23] hover:text-white hover:border-[#6B8E23] transition-all shadow-sm"
                        title="Add to Cart"
                      >
                        <FaCartShopping size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#2E2410]/60 backdrop-blur-sm"
            onClick={() => setQuickViewProduct(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#FFFDF8] w-full max-w-4xl max-h-[90vh] overflow-y-auto relative flex flex-col md:flex-row rounded-2xl shadow-2xl border border-[#D4C4A8]/40"
            >
              <button
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 right-4 z-10 text-[#5C4F3A] hover:text-[#2E2410] p-2 bg-white/80 rounded-full shadow-md transition-colors"
              >
                <FaXmark size={20} />
              </button>

              <div className="md:w-1/2 p-8 bg-[#F4EEE0] flex justify-center items-center">
                <img
                  src={quickViewProduct.image}
                  alt={quickViewProduct.name}
                  className="max-h-[400px] w-full object-contain mix-blend-multiply drop-shadow-xl"
                />
              </div>
              <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
                <span className="text-[#6B8E23] font-sans font-bold text-xs tracking-widest uppercase mb-3 px-3 py-1 bg-[#A8C686]/10 rounded inline-block w-fit">
                  {quickViewProduct.category}
                </span>
                <h2 className="text-3xl md:text-4xl font-serif text-[#2E2410] font-bold mb-4">
                  {quickViewProduct.name}
                </h2>

                <div className="flex items-baseline gap-3 mb-6 border-b border-[#D4C4A8]/20 pb-4">
                  <span className="text-3xl font-bold text-[#3A5A1C]">
                    ₹{Math.round(quickViewProduct.price * 0.7)}
                  </span>
                  <span className="relative text-lg font-sans text-[#5C4F3A]/40">
                    ₹{quickViewProduct.price}
                    <span className="absolute top-1/2 left-[-5%] w-[110%] h-[1.5px] bg-[#8B3A2A] -rotate-[12deg] origin-center"></span>
                  </span>
                  <span className="text-[#8B3A2A] font-bold text-xs uppercase tracking-tighter bg-[#8B3A2A]/10 px-2 py-0.5 rounded">
                    30% Savings
                  </span>
                </div>

                <p className="text-[#5C4F3A] font-sans leading-relaxed mb-8">
                  {quickViewProduct.description} This premium product ensures
                  you get all the natural health benefits of pure millet without
                  any artificial additives. Perfect for a balanced, modern
                  lifestyle.
                </p>

                <div className="mb-8 p-5 border border-[#6B8E23]/10 rounded-xl bg-[#A8C686]/5">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-serif font-semibold text-[#2E2410]">Eatpur Health Score</span>
                    <span className="font-bold text-[#6B8E23]">{quickViewProduct.healthScore}/100</span>
                  </div>
                  <div className="w-full bg-white rounded-full h-2 shadow-inner overflow-hidden border border-[#D4C4A8]/20">
                    <div className="h-full bg-[#6B8E23] rounded-full" style={{ width: `${quickViewProduct.healthScore}%` }}></div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    dispatch({ type: "ADD_ITEM", payload: quickViewProduct });
                    setQuickViewProduct(null);
                  }}
                  className="bg-[#6B8E23] hover:bg-[#3A5A1C] text-white w-full flex justify-center items-center gap-3 py-4 text-lg font-sans font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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