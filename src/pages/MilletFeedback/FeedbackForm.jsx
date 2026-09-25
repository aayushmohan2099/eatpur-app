// src/pages/MilletFeedback/FeedbackForm.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaHeart, FaArrowRight, FaLocationDot } from "react-icons/fa6";
import { apiFetch } from "../../api/client";
import Logo3D from "../../assets/Logo3D.png";
import FloatingImagesBackground from "../../pages/FloatingBG/floatingBG";

export default function FeedbackForm() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "", // Mapped to "Location" visually
    review: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a star rating so we know how we did!");
      return;
    }

    setIsSubmitting(true);

    // Exact mapping to Django GoogleFormResponse Model
    const payload = {
      name: formData.name || "Anonymous",
      mobile: formData.mobile || "N/A",
      email: formData.email || "N/A",
      address: formData.address || "N/A",
      stars: rating, // Explicitly sending stars
      response_description: formData.review || "No written review provided.",
      response_url: "Direct Platform Survey",
    };

    try {
      await apiFetch("/google-form-response/", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      alert(error.message || "Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Dynamic text based on star rating
  const getRatingText = (val) => {
    switch (val) {
      case 1:
        return "Very Dissatisfied 😞";
      case 2:
        return "Could be better 😕";
      case 3:
        return "It was Okay 😐";
      case 4:
        return "Really Good! 🙂";
      case 5:
        return "Absolutely Loved It! 💚";
      default:
        return "Select your rating";
    }
  };

  // --- Animations ---
  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 200,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" } },
  };

  const starContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.2 },
    },
  };

  const starItemVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 300 },
    },
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 overflow-hidden bg-[--color-eatpur-white-warm]">
      {/* 1. Immersive Animated Background */}
      <FloatingImagesBackground />

      {/* 2. Main Card Container */}
      <div className="relative z-10 w-full max-w-3xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_20px_60px_rgba(0,0,0,0.05)] rounded-[2rem] md:rounded-[3rem] overflow-hidden"
        >
          {/* Header Area */}
          <div className="bg-gradient-to-br from-[--color-eatpur-green-dark] to-[#4A6B18] px-8 py-10 md:px-12 md:py-14 text-center relative overflow-hidden">
            {/* Decorative background overlay pattern inside header */}
            <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg width=\\'20\\' height=\\'20\\' viewBox=\\'0 0 20 20\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'%23ffffff\\' fill-opacity=\\'1\\' fill-rule=\\'evenodd\\'%3E%3Ccircle cx=\\'3\\' cy=\\'3\\' r=\\'3\\'/%3E%3Cg/%3E%3C/svg%3E')]"></div>

            <motion.img
              variants={itemVariants}
              src={Logo3D}
              alt="EatPur Naturals"
              className="w-24 md:w-72 mx-auto mb-6 drop-shadow-xl relative z-10 bg-white/40 p-3 rounded-2xl backdrop-blur-md border border-white/20"
            />
            <motion.h1
              variants={itemVariants}
              className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight mb-3 relative z-10"
            >
              Share Your Experience
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-emerald-100 font-serif text-lg md:text-xl max-w-xl mx-auto relative z-10"
            >
              Your honest feedback helps us bring the finest natural millets to
              your table.
            </motion.p>
          </div>

          {/* Form / Success Area */}
          <div className="p-8 md:p-12">
            <AnimatePresence mode="wait">
              {isSuccess ? (
                // SUCCESS STATE
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center py-10"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12, delay: 0.2 }}
                    className="w-28 h-28 bg-emerald-100 text-[--color-eatpur-green-dark] rounded-full flex items-center justify-center mb-8 shadow-inner border-[6px] border-white"
                  >
                    <FaHeart size={50} className="animate-pulse" />
                  </motion.div>
                  <h2 className="text-3xl md:text-4xl font-display font-bold text-[--color-eatpur-dark] mb-4">
                    Thank You, {formData.name.split(" ")[0] || "Friend"}!
                  </h2>
                  <p className="text-slate-500 font-serif text-lg max-w-md mx-auto mb-8 leading-relaxed">
                    We deeply appreciate your time. Your feedback fuels our
                    journey to build a healthier, happier tomorrow.
                  </p>
                  <button
                    onClick={() => (window.location.href = "/")}
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    Return to Shop <FaArrowRight />
                  </button>
                </motion.div>
              ) : (
                // FORM STATE
                <motion.form
                  key="form"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -20 }}
                  onSubmit={handleSubmit}
                  className="space-y-10"
                >
                  {/* --- STAR RATING SECTION --- */}
                  <motion.div variants={itemVariants} className="text-center">
                    <h3 className="text-xl md:text-2xl font-display font-bold text-[--color-eatpur-dark] mb-6">
                      How was your experience with our products?{" "}
                      <span className="text-rose-500">*</span>
                    </h3>

                    <motion.div
                      variants={starContainerVariants}
                      className="flex justify-center gap-2 md:gap-4 mb-4"
                    >
                      {[1, 2, 3, 4, 5].map((star) => {
                        const isActive = star <= (hoverRating || rating);
                        return (
                          <motion.button
                            key={star}
                            variants={starItemVariants}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.85 }}
                            className="focus:outline-none transition-transform relative group"
                          >
                            {/* Glow effect behind active stars */}
                            {isActive && (
                              <motion.div
                                layoutId="starGlow"
                                className="absolute inset-0 bg-[#ffd000] blur-xl opacity-30 rounded-full"
                              />
                            )}
                            <FaStar
                              size={window.innerWidth < 768 ? 44 : 56}
                              className={`relative z-10 transition-all duration-300 ${
                                isActive
                                  ? "text-[#ffd000] drop-shadow-[0_4px_8px_rgba(182,158,102,0.4)]"
                                  : "text-slate-200 hover:text-slate-300"
                              }`}
                            />
                          </motion.button>
                        );
                      })}
                    </motion.div>

                    {/* Dynamic Rating Text */}
                    <div className="h-6">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={hoverRating || rating}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className={`font-medium ${
                            (hoverRating || rating) > 0
                              ? "text-[--color-eatpur-green-dark]"
                              : "text-slate-400"
                          }`}
                        >
                          {getRatingText(hoverRating || rating)}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                  </motion.div>

                  <div className="w-full h-[1px] bg-slate-100"></div>

                  {/* --- PERSONAL DETAILS SECTION --- */}
                  <motion.div variants={itemVariants} className="space-y-6">
                    <h3 className="text-lg font-display font-bold text-[--color-eatpur-dark]">
                      Tell us a bit about yourself
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Name */}
                      <div className="flex flex-col">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 ml-1">
                          Full Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          required
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="E.g. Ayush Srivastava"
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 placeholder-slate-400 outline-none focus:border-[--color-eatpur-green-dark] focus:bg-white focus:ring-4 focus:ring-[--color-eatpur-green-light]/20 transition-all shadow-inner"
                        />
                      </div>

                      {/* Mobile */}
                      <div className="flex flex-col">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 ml-1">
                          Mobile Number
                        </label>
                        <input
                          type="tel"
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleChange}
                          placeholder="+91 98765 43210"
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 placeholder-slate-400 outline-none focus:border-[--color-eatpur-green-dark] focus:bg-white focus:ring-4 focus:ring-[--color-eatpur-green-light]/20 transition-all shadow-inner font-mono tracking-wide"
                        />
                      </div>

                      {/* Location / Address */}
                      <div className="flex flex-col md:col-span-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 ml-1 flex items-center gap-1">
                          <FaLocationDot className="text-[--color-eatpur-green-dark]" />{" "}
                          Your Location
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="City, State (e.g., Lucknow, UP)"
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 placeholder-slate-400 outline-none focus:border-[--color-eatpur-green-dark] focus:bg-white focus:ring-4 focus:ring-[--color-eatpur-green-light]/20 transition-all shadow-inner"
                        />
                      </div>

                      {/* Email */}
                      <div className="flex flex-col md:col-span-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 ml-1">
                          Email Address (Optional)
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="hello@eatpur.in"
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 placeholder-slate-400 outline-none focus:border-[--color-eatpur-green-dark] focus:bg-white focus:ring-4 focus:ring-[--color-eatpur-green-light]/20 transition-all shadow-inner"
                        />
                      </div>
                    </div>
                  </motion.div>

                  <div className="w-full h-[1px] bg-slate-100"></div>

                  {/* --- REVIEW TEXT SECTION --- */}
                  <motion.div variants={itemVariants} className="flex flex-col">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 ml-1">
                      Remarks
                    </label>
                    <textarea
                      name="review"
                      value={formData.review}
                      onChange={handleChange}
                      placeholder="What did you love? What can we do better? Let us know!"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-slate-800 placeholder-slate-400 outline-none focus:border-[--color-eatpur-green-dark] focus:bg-white focus:ring-4 focus:ring-[--color-eatpur-green-light]/20 transition-all resize-none shadow-inner min-h-[140px]"
                    />
                  </motion.div>

                  {/* --- SUBMIT BUTTON --- */}
                  <motion.div variants={itemVariants} className="pt-4">
                    <motion.button
                      whileHover={{ scale: 1.01, translateY: -2 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isSubmitting}
                      type="submit"
                      className={`w-full py-5 rounded-full font-display font-bold text-lg tracking-wide text-white shadow-[0_10px_30px_rgba(107,142,35,0.3)] transition-all ${
                        isSubmitting
                          ? "bg-slate-400 cursor-not-allowed shadow-none"
                          : "bg-gradient-to-r from-[--color-eatpur-green-dark] to-[#517112] hover:shadow-[0_15px_40px_rgba(107,142,35,0.4)]"
                      }`}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-3">
                          <svg
                            className="animate-spin h-6 w-6 text-white"
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
                          Sending Feedback...
                        </span>
                      ) : (
                        "Submit My Feedback"
                      )}
                    </motion.button>
                    <p className="text-center text-xs text-slate-400 mt-6 font-serif">
                      Your information is secure. Thank you for helping EatPur
                      grow.
                    </p>
                  </motion.div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
