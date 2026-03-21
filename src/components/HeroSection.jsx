import { motion, useScroll, useTransform } from "framer-motion";

export default function HeroSection() {
  const { scrollYProgress } = useScroll();

  // Active from 0 to 15%, fades out smoothly by 20%
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.16, 1],
    [1, 1, 0, 0],
  );

  const y = useTransform(
    scrollYProgress,
    [0, 0.1, 0.16, 1],
    [0, 0, -200, -200],
  );

  return (
    <motion.section
      style={{ opacity, y }}
      className="fixed inset-0 flex items-center justify-center z-10 pointer-events-none"
    >
      {/* 🔥 Black radial shadow background */}
      <div className="absolute inset-0 flex items-center justify-center will-change-transform">
        <div
          className="
      w-[120vw] h-[120vw]
      max-w-[1200px] max-h-[1200px]
      bg-[radial-gradient(circle,rgba(0,0,0,0.9)_0%,rgba(0,0,0,0.7)_30%,rgba(0,0,0,0.4)_60%,transparent_80%)]
      blur-2xl
    "
        />
      </div>

      {/* Logo */}
      <motion.img
        src="/icons/LogoText.png"
        alt="EatPur"
        className="
      relative
      w-[85vw] 
      max-w-[900px] 
      md:w-[70vw] 
      lg:w-[60vw] 
      xl:w-[50vw]
      object-contain
      drop-shadow-[0_0_40px_rgba(255,201,51,0.25)]
    "
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
    </motion.section>
  );
}
