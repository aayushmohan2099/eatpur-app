import React from "react";
import { motion } from "framer-motion";
import ThreeLogo from "./ThreeLogo";

/**
 * CornerLogo
 *
 * Displayed when the hero section is NOT visible (scrolled past, or other page).
 * - Sized exactly 300 × 300
 * - Positioned at bottom: 0, right: 0
 * - Has rotation animation (isHeroVisible = false → ThreeLogo spins)
 * - Clickable → triggers chatbot toggle
 */
export default function CornerLogo({ onChatbotToggle, isMobile }) {
  return (
    <motion.div
      key="corner-logo"
      className="fixed z-50 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.35,
        ease: "easeOut",
      }}
      style={{
        width: isMobile ? 150 : 300,
        height: isMobile ? 150 : 300,
        bottom: -30,
        right: -30,
        pointerEvents: "auto",
        cursor: "pointer",
      }}
    >
      <ThreeLogo isHeroVisible={false} onClick={onChatbotToggle} />
    </motion.div>
  );
}
