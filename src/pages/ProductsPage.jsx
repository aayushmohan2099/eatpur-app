import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCartShopping, FaStar, FaEye, FaXmark } from "react-icons/fa6";
import { useCart } from "../context/CartContext";

const ALL_PRODUCTS = [
  {
    id: 1,
    name: "Sprouted Ragi Flour",
    price: 149,
    description: "Calcium-rich sprouted finger millet flour.",
    category: "Raw Flour",
    image:
      "https://images.unsplash.com/photo-1621245892014-cb1b8b8095b5?auto=format&fit=crop&q=80&w=400",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Millet Noodles",
    price: 99,
    description: "Healthy hakka style noodles made purely from millets.",
    category: "Ready to Cook",
    image:
      "https://images.unsplash.com/photo-1600335895229-6e75511892c8?auto=format&fit=crop&q=80&w=400",
    rating: 4.5,
  },
  {
    id: 3,
    name: "Pearl Millet Cookies",
    price: 129,
    description: "Crispy, crunchy bajra cookies sweetened with jaggery.",
    category: "Ready to Eat",
    image:
      "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=400",
    rating: 4.9,
  },
  {
    id: 4,
    name: "Jowar Flakes",
    price: 110,
    description: "Crunchy jowar flakes for a perfect healthy breakfast.",
    category: "Ready to Eat",
    image:
      "https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?auto=format&fit=crop&q=80&w=400",
    rating: 4.6,
  },
  {
    id: 5,
    name: "Multi-millet Dosa Mix",
    price: 175,
    description: "Instant dosa mix made with 5 different millets.",
    category: "Ready to Cook",
    image:
      "https://images.unsplash.com/photo-1628282362483-e1866cfce06c?auto=format&fit=crop&q=80&w=400",
    rating: 4.7,
  },
  {
    id: 6,
    name: "Barnyard Millet Flour",
    price: 135,
    description: "Perfect fasting flour with high fiber content.",
    category: "Raw Flour",
    image:
      "https://images.unsplash.com/photo-1596649283451-2ba206f0e4b2?auto=format&fit=crop&q=80&w=400",
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
    <div className="w-full min-h-screen top-5 pt-24 pb-32 px-6 relative z-10">
      {/* Short Hero Banner */}
      <div className="max-w-7xl mx-auto rounded-[2rem] overflow-hidden mb-16 relative bg-eatpur-green-dark p-12 md:p-20 text-center flex flex-col items-center justify-center shadow-[0_0_40px_rgba(4,7,4,0.5)] border border-eatpur-gold/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,201,51,0.1)_0%,transparent_70%)] pointer-events-none" />
        <h1
          className="text-5xl md:text-6xl font-display text-gradient-gold mb-4 relative z-10 leading-[1] py-2"
          style={{ fontFamily: "var(--font-hughes)" }}
        >
          Our Products
        </h1>
        <p className="text-xl text-eatpur-text relative z-10">
          Pure millet nutrition, thoughtfully crafted.
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Filter Bar */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 backdrop-blur-md ${
                activeFilter === category
                  ? "bg-eatpur-gold text-eatpur-dark shadow-[0_0_15px_rgba(255,201,51,0.3)]"
                  : "bg-eatpur-dark/50 text-eatpur-text border border-eatpur-gold/20 hover:text-eatpur-yellow hover:border-eatpur-gold/50"
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
            {filteredProducts.map((product) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={product.id}
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
                  <div className="absolute top-4 left-4 bg-eatpur-dark/80 backdrop-blur-md px-3 py-1 rounded-full text-xs text-eatpur-yellow font-bold uppercase tracking-wider border border-eatpur-gold/20">
                    {product.category}
                  </div>
                  <div className="absolute top-4 right-4 bg-eatpur-green-light/20 backdrop-blur-md px-3 py-1 rounded-full text-xs text-eatpur-green-light font-bold border border-eatpur-green-light/30 flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-eatpur-green-light animate-pulse" />{" "}
                    In Stock
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-1 text-eatpur-gold text-sm mb-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={
                          i < Math.floor(product.rating)
                            ? "text-eatpur-gold"
                            : "text-eatpur-text/30"
                        }
                      />
                    ))}
                    <span className="text-eatpur-text ml-2">
                      {product.rating}
                    </span>
                  </div>

                  <h3
                    className="text-xl font-bold text-eatpur-white-warm mb-1"
                    style={{ fontFamily: "var(--font-hughes)" }}
                  >
                    {product.name}
                  </h3>
                  <p className="text-eatpur-text text-sm mb-6 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-2xl font-display text-eatpur-yellow">
                      ₹{product.price}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setQuickViewProduct(product)}
                        className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-eatpur-text hover:text-eatpur-yellow hover:border-eatpur-gold transition-colors"
                        title="Quick View"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() =>
                          dispatch({ type: "ADD_ITEM", payload: product })
                        }
                        className="w-10 h-10 rounded-full bg-eatpur-gold text-eatpur-dark flex items-center justify-center hover:scale-105 shadow-[0_0_10px_rgba(255,201,51,0.2)] transition-transform"
                        title="Add to Cart"
                      >
                        <FaCartShopping />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Quick View Modal Reused */}
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
                <h2
                  className="text-3xl md:text-4xl font-display text-eatpur-yellow mb-4"
                  style={{ fontFamily: "var(--font-hughes)" }}
                >
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
