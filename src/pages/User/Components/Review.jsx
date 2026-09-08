// src/pages/User/Components/Review.jsx
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaXmark, FaHeart } from "react-icons/fa6";
import { apiFetch } from "../../../api/client";

export default function Review({ isOpen, onClose, order }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State for User Details
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    comment: "",
  });

  // Pre-fill data if available from the order prop
  useEffect(() => {
    if (isOpen && order) {
      setFormData({
        name: order.consignee_name || order.customer_name || "",
        mobile:
          order.consignee_phone ||
          order.consignee_alternate_phone ||
          order.customer_phone ||
          "",
        email: order.customer_email || "",
        address: order.drop_location || "",
        comment: "",
      });
    }
  }, [isOpen, order]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", damping: 25, stiffness: 300 },
    },
    exit: { opacity: 0, scale: 0.8, y: 50, transition: { duration: 0.2 } },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a star rating!");
      return;
    }

    setIsSubmitting(true);

    // Get the base URL dynamically for the response_url API
    const baseUrl = window.location.origin;

    // Formatting data for the GoogleFormResponse Model webhook
    const payload = {
      name: formData.name || "Anonymous",
      mobile: formData.mobile || "N/A",
      email: formData.email || "N/A",
      address: formData.address || "N/A",
      // Link to the specific order's detail API (assuming standard REST pattern)
      response_url: `/api/shop/customer/orders/${order?.id}/`,
      response_description: `RATING: ${rating}/5 Stars.\nREVIEW: ${formData.comment || "No written comment provided."}`,
    };

    try {
      await apiFetch("/google-form-response/", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setIsSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2500);
    } catch (error) {
      console.error("Failed to submit review:", error);
      alert(error.message || "Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setHoverRating(0);
    setFormData({ name: "", mobile: "", email: "", address: "", comment: "" });
    setIsSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Blurred Backdrop */}
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={handleClose}
          className="absolute inset-0 bg-slate-900/50 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative bg-white w-full max-w-lg rounded-[32px] p-8 shadow-2xl z-10 overflow-hidden"
        >
          {/* Decorative Background Elements */}
          <div className="absolute -top-24 -right-24 w-56 h-56 bg-[--color-eatpur-green-pale] rounded-full blur-3xl opacity-60"></div>
          <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-[--color-eatpur-gold-light] rounded-full blur-3xl opacity-40"></div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-rose-100 hover:text-rose-600 transition-colors z-20"
          >
            <FaXmark />
          </button>

          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center text-center py-12 z-20 relative"
            >
              <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-inner border-[4px] border-white">
                <FaHeart size={44} className="animate-pulse" />
              </div>
              <h3 className="text-3xl font-display font-bold text-[--color-eatpur-dark] mb-3">
                Thank You!
              </h3>
              <p className="text-slate-500 font-serif px-4">
                Your feedback fuels our journey to provide healthier, better
                living.
              </p>
            </motion.div>
          ) : (
            <div className="relative z-20 max-h-[80vh] overflow-y-auto hide-scrollbar pb-2">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-display font-bold text-[--color-eatpur-dark]">
                  Rate your Experience
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Order{" "}
                  <span className="font-bold text-[--color-eatpur-green-dark]">
                    #ORD-{order?.id}
                  </span>
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center space-y-5"
              >
                {/* Interactive Stars */}
                <div className="flex gap-2 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      type="button"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="focus:outline-none transition-colors"
                    >
                      <FaStar
                        size={40}
                        className={`transition-all duration-300 ${
                          star <= (hoverRating || rating)
                            ? "text-[--color-eatpur-gold] drop-shadow-lg scale-110"
                            : "text-slate-200"
                        }`}
                      />
                    </motion.button>
                  ))}
                </div>

                {/* Input Fields Grid */}
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 ml-1">
                      Full Name *
                    </label>
                    <input
                      required
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-[--color-eatpur-green-dark] focus:bg-white transition-all shadow-inner"
                    />
                  </div>

                  {/* Mobile */}
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 ml-1">
                      Mobile Number *
                    </label>
                    <input
                      required
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="10-digit number"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-[--color-eatpur-green-dark] focus:bg-white transition-all shadow-inner font-mono tracking-wide"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col sm:col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 ml-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="hello@eatpur.in"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-[--color-eatpur-green-dark] focus:bg-white transition-all shadow-inner"
                    />
                  </div>

                  {/* Address */}
                  <div className="flex flex-col sm:col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 ml-1">
                      Delivery Address *
                    </label>
                    <input
                      required
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Your delivery location..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-[--color-eatpur-green-dark] focus:bg-white transition-all shadow-inner"
                    />
                  </div>
                </div>

                {/* Comment Area */}
                <div className="w-full relative pt-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 ml-1">
                    Your Feedback
                  </label>
                  <textarea
                    name="comment"
                    value={formData.comment}
                    onChange={handleChange}
                    placeholder="Tell us what you loved (or what we can improve)..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-700 outline-none focus:border-[--color-eatpur-green-dark] focus:bg-white transition-all resize-none shadow-inner"
                    rows="3"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting || rating === 0}
                  type="submit"
                  className={`w-full py-4 mt-2 rounded-2xl font-bold tracking-wide text-white shadow-lg transition-all ${
                    rating === 0 || isSubmitting
                      ? "bg-slate-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-[--color-eatpur-green-dark] to-emerald-500 hover:shadow-xl hover:from-emerald-600 hover:to-emerald-400"
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    "Submit Feedback"
                  )}
                </motion.button>
              </form>
            </div>
          )}
        </motion.div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </AnimatePresence>,
    document.body,
  );
}
