// src/pages/User/Components/ui/Button3D.jsx
import React from "react";
import { motion } from "framer-motion";

export default function Button3D({
  children,
  onClick,
  variant = "primary", // primary, accent, gold, dark, danger, outline
  size = "md", // sm, md, lg
  fullWidth = false,
  disabled = false,
  className = "",
  type = "button",
  ...props
}) {
  // Color Variants
  const variants = {
    primary:
      "bg-[--color-eatpur-green-dark] text-white border-[#4C7A4F] hover:bg-[#7a9e32]",
    accent:
      "bg-[--color-eatpur-orange] text-white border-[#b05f32] hover:bg-[#e38552]",
    gold: "bg-[--color-eatpur-gold] text-white border-[--color-eatpur-gold-dark] hover:bg-[#c7af77]",
    dark: "bg-[--color-eatpur-dark] text-white border-[#1a1a1a] hover:bg-[#3d3d3d]",
    danger: "bg-rose-500 text-white border-rose-700 hover:bg-rose-400",
    outline:
      "bg-white text-[--color-eatpur-dark] border-[--color-eatpur-gray-light] hover:bg-[--color-eatpur-white-warm]",
  };

  // Size Variants
  const sizes = {
    sm: "px-4 py-1.5 text-sm rounded-lg",
    md: "px-6 py-2.5 text-base rounded-xl",
    lg: "px-8 py-3.5 text-lg rounded-2xl",
  };

  const baseStyles =
    "relative inline-flex items-center justify-center font-display font-semibold transition-colors duration-150 outline-none select-none";
  const wClass = fullWidth ? "w-full" : "w-auto";
  const disabledStyles = disabled
    ? "opacity-60 cursor-not-allowed border-b-0 translate-y-[4px]"
    : "border-b-[4px] active:border-b-0 active:translate-y-[4px]";

  return (
    <motion.button
      whileTap={!disabled ? { scale: 0.98 } : {}}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${wClass} ${disabledStyles} ${className}`}
      {...props}
    >
      {/* Optional: Add a subtle inner top highlight for more 3D realism */}
      <div className="absolute top-0 left-0 w-full h-1/3 bg-white/10 rounded-t-full pointer-events-none"></div>

      <span className="flex items-center gap-2 relative z-10">{children}</span>
    </motion.button>
  );
}
