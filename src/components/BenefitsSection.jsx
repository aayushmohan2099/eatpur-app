import { motion, useScroll, useTransform } from 'framer-motion';

export default function BenefitsSection() {
  const { scrollYProgress } = useScroll();

  // Active from 40% to 65%
  const opacity = useTransform(scrollYProgress, [0.35, 0.40, 0.60, 0.70], [0, 1, 1, 0]);
  const x = useTransform(scrollYProgress, [0.35, 0.40, 0.60, 0.70], [50, 0, 0, 50]);

  return (
    <motion.section
      style={{ opacity, x }}
      className="fixed inset-0 flex items-start justify-end pt-20 md:pt-32 p-8 md:p-24 z-10 pointer-events-none"
    >
      <div className="max-w-md text-right bg-gradient-radial/50 from-[#040704]/80 to-transparent p-4 md:p-8 rounded-2xl backdrop-blur-[2px]">
        <h2 className="text-4xl md:text-6xl font-bold text-eatpur-gold tracking-tight leading-tight mb-6 drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
          Naturally powerful.<br/>Effortlessly healthy.
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
