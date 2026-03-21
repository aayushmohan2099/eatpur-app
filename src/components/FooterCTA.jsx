import { motion, useScroll, useTransform } from 'framer-motion';

export default function FooterCTA() {
  const { scrollYProgress } = useScroll();

  // Active from 85% to 100%
  const opacity = useTransform(scrollYProgress, [0.80, 0.85, 1], [0, 1, 1]);
  const y = useTransform(scrollYProgress, [0.80, 0.85, 1], [50, 0, 0]);

  return (
    <motion.section
      style={{ opacity, y }}
      className="fixed inset-0 flex flex-col items-center justify-end pb-24 md:pb-32 px-6 text-center z-20 pointer-events-none"
    >
      <div className="max-w-2xl flex flex-col items-center bg-gradient-radial/50 from-[#040704]/90 to-transparent p-8 rounded-3xl backdrop-blur-[2px]">
        <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-[#FFF8E1] mb-4 drop-shadow-[0_0_20px_rgba(255,201,51,0.2)]">
          Pure food. Honest living.
        </h2>
        <h3 className="text-xl md:text-2xl text-eatpur-gold font-medium mb-8">
          EatPur. Rooted in tradition, crafted for modern wellness.
        </h3>
        
        <div className="flex flex-col sm:flex-row gap-6 items-center pointer-events-auto">
          <button className="px-8 py-4 rounded-full bg-gradient-to-r from-eatpur-gold to-[#FFE07A] text-[#040704] font-bold text-lg hover:shadow-[0_0_30px_rgba(255,201,51,0.4)] transition-all duration-300 hover:scale-105">
            Explore Products
          </button>
          
          <button className="text-eatpur-text-light hover:text-white font-medium text-lg border-b border-transparent hover:border-eatpur-text-light transition-all duration-300">
            Read Our Story
          </button>
        </div>
        
        <p className="text-sm text-eatpur-text mt-8 opacity-70">
          From farm to table, bringing you clean, wholesome millet nutrition every day.
        </p>
      </div>
    </motion.section>
  );
}
