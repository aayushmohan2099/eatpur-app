import { motion, AnimatePresence } from "framer-motion";

const leftLinks = ["Overview", "Products", "Blogs"];
const rightLinks = ["Benefits", "About", "Contact"];

export default function FloatingMenu({ menuOpen }) {
  return (
    <AnimatePresence>
      {menuOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none ">
          {/* LEFT SIDE */}
          <div className="absolute left-1/2 top-1/2">
            {leftLinks.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: 0 }}
                animate={{ opacity: 1, x: -220 }}
                exit={{ opacity: 0, x: 0 }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  position: "absolute",
                  top: `${i * 70 - 70}px`,
                  right: 150,
                }}
                className="flex items-center gap-3 pointer-events-auto"
              >
                {/* BUTTON */}
                <motion.div whileHover={{ scale: 1.05 }}>
                  <button className="relative px-6 py-2.5 md:px-7 md:py-3 rounded-full border-2 border-eatpur-gold text-[#FFF8E1] font-medium tracking-wide overflow-hidden transition-transform duration-200 group hover:shadow-[0_0_25px_rgba(255,201,51,0.3)]">
                    {/* GOLD SLIDE BACKGROUND */}
                    <span className="absolute inset-0 bg-eatpur-gold rounded-full transform -translate-x-full transition-transform duration-300 group-hover:translate-x-0 z-0"></span>

                    {/* TEXT */}
                    <span className="relative z-10 group-hover:text-[#040704]">
                      {item}
                    </span>
                  </button>
                </motion.div>

                {/* LINE */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: 120 }}
                  exit={{ width: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="h-[2px] bg-eatpur-gold"
                />
              </motion.div>
            ))}
          </div>

          {/* RIGHT SIDE */}
          <div className="absolute left-1/2 top-1/2">
            {rightLinks.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: 0 }}
                animate={{ opacity: 1, x: 220 }}
                exit={{ opacity: 0, x: 0 }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  position: "absolute",
                  top: `${i * 70 - 70}px`,
                  left: 150,
                }}
                className="flex items-center gap-3 pointer-events-auto"
              >
                {/* LINE */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: 120 }}
                  exit={{ width: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="h-[2px] bg-eatpur-gold"
                />
                {/* BUTTON */}
                <motion.div whileHover={{ scale: 1.05 }}>
                  <button className="relative px-6 py-2.5 md:px-7 md:py-3 rounded-full border-2 border-eatpur-gold text-[#FFF8E1] font-medium tracking-wide overflow-hidden transition-transform duration-200 group hover:shadow-[0_0_25px_rgba(255,201,51,0.3)]">
                    <span className="absolute inset-0 bg-eatpur-gold rounded-full transform -translate-x-full transition-transform duration-300 group-hover:translate-x-0 z-0"></span>

                    <span className="relative z-10 group-hover:text-[#040704]">
                      {item}
                    </span>
                  </button>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
