import React from "react";
import { motion } from "framer-motion";
import ThreeLogo from "./ThreeLogo";

/**
 * HeroLogo
 *
 * Displayed when the hero section is visible.
 * - Sized exactly to logoSize × logoSize
 * - Centered via: bottom = calc(50dvh - halfSize), right = calc(50vw - halfSize)
 * - No rotation (isHeroVisible = true passed to ThreeLogo)
 * - Shine effect active
 */
export default function HeroLogo({ logoSize }) {
  const halfSize = logoSize / 2;

  return (
    <motion.div
      key="hero-logo"
      className="fixed z-50 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.35,
        ease: "easeOut",
      }}
      style={{
        width: logoSize,
        height: logoSize,
        bottom: `calc(50dvh - ${halfSize}px)`,
        right: `calc(50vw - ${halfSize}px)`,
        pointerEvents: "auto",
      }}
    >
      <motion.div
        animate={{
          filter: [
            "drop-shadow(0 0 15px rgba(255, 201, 51, 0.25))",
            "drop-shadow(0 0 30px rgba(255, 215, 0, 0.45))",
            "drop-shadow(0 0 15px rgba(255, 201, 51, 0.25))",
          ],
        }}
        transition={{
          filter: {
            duration: 3,
            ease: "easeInOut",
            repeat: Infinity,
          },
        }}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
        }}
      >
        <ThreeLogo isHeroVisible={true} onClick={() => {}} />
      </motion.div>
    </motion.div>
  );
}
