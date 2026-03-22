import { motion, useScroll, useTransform } from "framer-motion";

export default function ProductsSection() {
  const { scrollYProgress } = useScroll();

  // Active from 15% to 40%
  const opacity = useTransform(
    scrollYProgress,
    [0.1, 0.15, 0.35, 0.45],
    [0, 1, 1, 0],
  );
  const x = useTransform(
    scrollYProgress,
    [0.1, 0.15, 0.35, 0.45],
    [-50, 0, 0, -50],
  );

  return (
    <motion.section
      style={{ opacity, x }}
      className="fixed inset-0 flex items-start justify-start pt-20 md:pt-32 p-8 md:p-24 z-10 pointer-events-none"
    >
      <div className="max-w-xl text-left bg-gradient-radial/50 from-[#040704]/80 to-transparent p-4 md:p-8 rounded-2xl backdrop-blur-[2px]">
        <h2 className="text-4xl md:text-6xl font-bold text-eatpur-gold tracking-tight leading-tight mb-6 drop-shadow-[0_6px_25px_rgba(0,0,0,0.95)]">
          Crafted from nature’s finest grains.
        </h2>

        <div className="space-y-6 text-lg md:text-xl text-eatpur-text-light font-light leading-relaxed drop-shadow-[0_6px_25px_rgba(0,0,0,0.95)]">
          <p>
            Pure millets, minimally processed to preserve their natural
            nutrition and authenticity.
          </p>
          <p>
            Every product is thoughtfully created for balance, nourishment, and
            everyday wellness.
          </p>
        </div>
      </div>
    </motion.section>
  );
}
