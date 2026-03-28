import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
} from "framer-motion";
import { FaCartShopping, FaBars, FaXmark } from "react-icons/fa6";
import { useCart } from "../context/CartContext";
import ThreeLogo from "./ThreeLogo";
import Chatbot from "./Chatbot";

export default function Navbar() {
  const { state, dispatch } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const location = useLocation();

  const [isPastHero, setIsPastHero] = useState(false);

  const isHome = location.pathname === "/";
  const [isHeroVisible, setIsHeroVisible] = useState(isHome);

  useEffect(() => {
    setIsHeroVisible(isHome);
  }, [isHome]);

  const isCorner = isHome
    ? isPastHero // scroll decides on homepage
    : true; // ALWAYS corner on other pages
  const [isMobile, setIsMobile] = useState(false);

  const { scrollYProgress } = useScroll();
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setIsPastHero(v > 0.15);
  });
  useEffect(() => {
    if (location.pathname !== "/") {
      // On other pages → always corner
      setIsHeroVisible(false);
    } else {
      // On homepage → depends on scroll
      setIsHeroVisible(!isPastHero);
    }
  }, [isPastHero, location.pathname]);
  const { scrollY } = useScroll();

  // Background transition from transparent to blurred dark
  const navBgOpacity = useTransform(scrollY, [0, 50], [0, 0.82]);
  const navBlur = useTransform(scrollY, [0, 50], [0, 20]);
  const navBorderOpacity = useTransform(scrollY, [0, 50], [0, 0.1]);

  const cartCount = state.items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const navItems = [
    { label: "Overview", path: "/" },
    { label: "Products", path: "/products" },
    { label: "Recipes", path: "/recipes" },
    { label: "Blogs", path: "/blogs" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  // Screen resize listener for responsive logo size values
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Intersection Observer for the Hero Section
  useEffect(() => {
    // If we're not on the homepage, the hero is never visible
    if (location.pathname !== "/") {
      return;
    }

    // Default to true when entering homepage
    setIsHeroVisible(true);

    const checkAndObserve = () => {
      const heroEl = document.getElementById("hero-section");
      if (!heroEl) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsHeroVisible(entry.isIntersecting);
        },
        { threshold: 0.6 },
      );

      observer.observe(heroEl);
      return observer;
    };

    // Slight delay to allow DOM render of the new route
    let observer;
    const timeoutId = setTimeout(() => {
      observer = checkAndObserve();
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (observer) observer.disconnect();
    };
  }, [location.pathname]);

  const logoSize = isMobile ? 950 : 1100;
  const halfSize = logoSize / 2;

  // Staggered reveal for desktop links on load
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0, transition: { type: "spring" } },
  };

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 w-full z-[60] flex items-center justify-between px-6 h-11 md:h-12 transition-all"
        style={{
          backgroundColor: useTransform(
            navBgOpacity,
            (v) => `rgba(4, 7, 4, ${v})`,
          ),
          backdropFilter: useTransform(navBlur, (v) => `blur(${v}px)`),
          borderBottom: useTransform(
            navBorderOpacity,
            (v) => `1px solid rgba(255, 201, 51, ${v})`,
          ),
        }}
      >
        {/* Left: Wordmark */}
        <div className="flex-shrink-0 z-50">
          <NavLink
            to="/"
            className="text-eatpur-gold font-display text-lg md:text-xl font-bold tracking-tight"
          >
            <img
              src="/icons/LogoTitle.png"
              alt="EatPur"
              className="h-12 md:h-16 lg:h-18 w-auto object-contain drop-shadow-[0_0_12px_rgba(255,201,51,0.2)]"
            />
          </NavLink>
        </div>

        {/* Center: Desktop Navigation Links */}
        <motion.div
          className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {navItems.map((item, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "text-eatpur-yellow drop-shadow-[0_0_8px_rgba(255,201,51,0.5)]"
                      : "text-eatpur-text hover:text-eatpur-white-warm"
                  }`
                }
              >
                {item.label}
              </NavLink>
            </motion.div>
          ))}
        </motion.div>

        {/* Right: Actions */}
        <motion.div
          className="flex items-center gap-4 z-50"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={() => dispatch({ type: "TOGGLE_CART" })}
            className="relative p-2 text-eatpur-text hover:text-eatpur-yellow transition-colors"
            aria-label="Cart"
          >
            <FaCartShopping size={18} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-eatpur-gold text-eatpur-dark text-[10px] font-bold flex items-center justify-center translate-x-1 -translate-y-1">
                {cartCount}
              </span>
            )}
          </button>

          <NavLink
            to="/products"
            className="hidden md:flex align-center bg-gradient-gold text-eatpur-dark font-semibold px-4 py-1.5 rounded-full text-sm hover:scale-105 transition-transform shadow-[0_0_10px_rgba(255,201,51,0.2)]"
          >
            Explore Products
          </NavLink>

          {/* Mobile Menu Toggle (Burger) */}
          <button
            className="md:hidden p-2 text-eatpur-text hover:text-eatpur-yellow"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaXmark size={20} /> : <FaBars size={20} />}
          </button>
        </motion.div>
      </motion.nav>

      {/* 3D LOGO: Independent Floating Container */}
      <motion.div
        layout
        layoutId="main-logo"
        className="fixed z-50 overflow-hidden"
        initial={false}
        animate={isHeroVisible ? "hero" : "corner"}
        variants={{
          hero: {
            width: logoSize,
            height: logoSize,
            bottom: `calc(50dvh - ${halfSize}px)`,
            right: `calc(50vw - ${halfSize}px)`,
            borderRadius: "0%",
          },
          corner: {
            width: 300,
            height: 300,
            bottom: 0,
            right: 0,
            borderRadius: "50%",
          },
        }}
        transition={{
          layout: {
            type: "spring",
            stiffness: 60,
            damping: 28,
            mass: 1.2
          }
        }}
        style={{
          pointerEvents: isHeroVisible ? "none" : "auto",
          willChange: "transform",
        }}
      >
        <ThreeLogo
          isHeroVisible={isHeroVisible}
          isCorner={!isHeroVisible}
          onClick={() => {
            // In corner state, clicking opens chatbot
            if (!isHeroVisible) {
              setIsChatbotOpen((prev) => !prev);
            }
          }}
        />
      </motion.div>

      {/* Mobile Floating Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 z-40 flex items-center justify-center p-6 bg-eatpur-dark/95 backdrop-blur-xl"
          >
            <div className="flex flex-col items-center gap-8 w-full max-w-sm mt-12">
              <div className="text-eatpur-gold font-display text-4xl mb-4">
                EatPur
              </div>
              {navItems.map((item, idx) => (
                <NavLink
                  key={idx}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `text-2xl font-display transition-colors ${
                      isActive ? "text-eatpur-yellow" : "text-eatpur-text"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Chatbot isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </>
  );
}
