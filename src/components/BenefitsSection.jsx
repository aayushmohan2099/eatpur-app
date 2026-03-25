import { motion, useScroll, useTransform } from "framer-motion";

export default function BenefitsSection() {
  const { scrollYProgress } = useScroll();

  // Active from 40% to 65%
  const opacity = useTransform(
    scrollYProgress,
    [0.35, 0.4, 0.6, 0.7],
    [0, 1, 1, 0],
  );
  const x = useTransform(
    scrollYProgress,
    [0.35, 0.4, 0.6, 0.7],
    [50, 0, 0, 50],
  );

  return (
    <motion.section
      style={{ opacity, x }}
      className="fixed inset-0 flex items-start justify-end pt-20 md:pt-32 p-8 md:p-24 z-10 pointer-events-none"
    >
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

      <div className="max-w-md text-right bg-gradient-radial/50 from-[#040704]/80 to-transparent p-4 md:p-8 rounded-2xl backdrop-blur-[2px]">
        <h2 className="text-4xl md:text-6xl font-bold text-eatpur-gold tracking-tight leading-tight mb-6 drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
          Naturally powerful.
          <br />
          Effortlessly healthy.
        </h2>
        <ul className="space-y-4 text-lg md:text-xl text-eatpur-text-light font-light leading-relaxed list-none drop-shadow-[0_6px_25px_rgba(0,0,0,0.95)]">
          <li>Rich in fiber, protein, and essential nutrients.</li>
          <li>Supports digestion, energy, and overall wellness.</li>
          <li>Clean, wholesome nutrition—free from unnecessary processing.</li>
        </ul>
      </div>
    </motion.section>
  );
}
