import { motion, useScroll, useTransform } from "framer-motion";

export default function Navbar() {
  const { scrollYProgress } = useScroll();

  const navBackground = useTransform(
    scrollYProgress,
    [0, 0.02, 0.05],
    ["rgba(4, 7, 4, 0)", "rgba(4, 7, 4, 0.4)", "rgba(4, 7, 4, 0.75)"],
  );

  const navBlur = useTransform(
    scrollYProgress,
    [0, 0.02, 0.05],
    ["blur(0px)", "blur(4px)", "blur(12px)"],
  );

  // 🔥 Smooth scroll function
  const scrollToSection = (id) => {
    const sectionMap = {
      overview: 0,
      products: 1,
      benefits: 2,
      blogs: 3,
      about: 4,
    };

    const index = sectionMap[id];
    if (index === undefined) return;

    const totalSections = 5;
    const scrollHeight = document.body.scrollHeight - window.innerHeight;

    const targetScroll = (scrollHeight / (totalSections - 1)) * index;

    window.scrollTo({
      top: targetScroll,
      behavior: "smooth",
    });
  };

  const links = [
    { label: "Overview", id: "overview" },
    { label: "Products", id: "products" },
    { label: "Benefits", id: "benefits" },
    { label: "Blogs", id: "blogs" },
    { label: "About", id: "about" },
  ];

  return (
    <motion.nav
      style={{ backgroundColor: navBackground, backdropFilter: navBlur }}
      className="fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-out"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 h-20 md:h-24 flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => scrollToSection("overview")}
          className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
        >
          <img
            src="/icons/LogoTitle.png"
            alt="EatPur"
            className="h-12 md:h-16 lg:h-18 w-auto object-contain drop-shadow-[0_0_12px_rgba(255,201,51,0.2)]"
          />
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center space-x-10 text-[15px] font-medium text-eatpur-text-light/80">
          {links.map((item) => (
            <button
              key={item.label}
              onClick={() => scrollToSection(item.id)}
              className="relative hover:text-eatpur-yellow transition-all duration-300 ease-out after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-0 after:bg-eatpur-gold after:transition-all after:duration-300 hover:after:w-full"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* CTA */}
        <div>
          <button
            onClick={() => scrollToSection("products")}
            className="relative px-6 py-2.5 md:px-7 md:py-3 rounded-full border-2 border-eatpur-gold text-[#FFF8E1] font-medium tracking-wide overflow-hidden transition-transform duration-200 hover:scale-105 group hover:shadow-[0_0_25px_rgba(255,201,51,0.3)]"
          >
            <span className="absolute inset-0 bg-eatpur-gold rounded-full transform -translate-x-full transition-transform duration-300 group-hover:translate-x-0 z-0"></span>

            <span className="relative z-10 group-hover:text-[#040704]">
              Explore Products
            </span>
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
