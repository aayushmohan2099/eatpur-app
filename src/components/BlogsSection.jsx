import { motion, useScroll, useTransform } from 'framer-motion';

export default function BlogsSection() {
  const { scrollYProgress } = useScroll();

  // Active from 65% to 85%
  const opacity = useTransform(scrollYProgress, [0.60, 0.65, 0.80, 0.90], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0.60, 0.65, 0.80, 0.90], [50, 0, 0, -50]);

  const blogs = [
    { title: "The Ancient Grain for Modern Life", desc: "Why millet is making a massive comeback.", time: "4 min read" },
    { title: "5 Quick Millet Recipes", desc: "Easy, healthy meals for busy professionals.", time: "6 min read" },
    { title: "Sustainable Eating", desc: "How EatPur millets support earth-friendly agriculture.", time: "5 min read" },
  ];

  return (
    <motion.section
      style={{ opacity, y }}
      className="fixed inset-0 flex flex-col items-center justify-center p-6 z-20 pointer-events-none"
    >
      <div className="text-center mb-12 max-w-2xl bg-[#040704]/40 p-6 rounded-2xl backdrop-blur-md">
        <h2 className="text-4xl md:text-5xl font-bold text-eatpur-gold tracking-tight mb-4 drop-shadow-md">
          Trending Blogs
        </h2>
        <p className="text-eatpur-text-light text-lg">
          Discover what the community is loving—insights, recipes, and stories around healthy living.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 max-w-6xl pointer-events-auto">
        {blogs.map((blog, idx) => (
          <motion.div 
            key={idx}
            whileHover={{ y: -10, scale: 1.02 }}
            className="group relative w-full md:w-1/3 bg-[#0B140B]/80 border border-[#2A3F2A]/50 rounded-2xl p-6 cursor-pointer overflow-hidden backdrop-blur-md shadow-xl transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-eatpur-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="text-eatpur-green-light text-xs font-semibold uppercase tracking-wider mb-2">
              {blog.time}
            </div>
            <h3 className="text-2xl text-[#E6D8A8] font-bold mb-3 group-hover:text-eatpur-yellow transition-colors duration-300">
              {blog.title}
            </h3>
            <p className="text-eatpur-text text-sm leading-relaxed">
              {blog.desc}
            </p>
            
            <div className="mt-6 flex items-center text-eatpur-gold text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
              Read Article <span className="ml-2">→</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
