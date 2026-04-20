import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCartShopping,
  FaBars,
  FaXmark,
  FaRegUser,
  FaMagnifyingGlass,
} from "react-icons/fa6";
import { useCart } from "../context/CartContext";
import Chatbot from "./Chatbot";
import { getMe, logoutUser } from "../api/authApi";
import Logo from "../assets/Logo3D.png";

export default function Navbar() {
  const { state, dispatch } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access");

    if (!token) {
      setUser(null);
      setLoadingUser(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await getMe();
        setUser(res);
      } catch {
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, [location.pathname]);

  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest(".user-menu")) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const cartCount = state.items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Products", path: "/products" },
    { label: "About Us", path: "/about" },
    { label: "Recipes", path: "/recipes" },
    { label: "Blogs", path: "/blogs" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <>
      <nav className="w-full relative z-[60] bg-transparent border-b border-[#D4C4A8]/40">
        {/* Changed wrapper to purely flex items-center */}
        <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-12 py-4 flex items-center">
          {/* 1. Left: Logo (flex-1 forces it to take equal space as the right side) */}
          <div className="flex-1 flex items-center justify-start">
            <NavLink
              to="/"
              className="flex-shrink-0 decoration-transparent group"
            >
              <img
                src={Logo}
                alt="Eatpur Naturals Logo"
                className="w-24 md:w-30 lg:w-36 h-auto transition-transform duration-500 ease-out group-hover:scale-[1.02]"
              />
            </NavLink>
          </div>

          {/* 2. Center: Desktop Navigation Links (Absolute Center) */}
          <div className="hidden lg:flex items-center justify-center gap-8 xl:gap-12">
            {navItems.map((item, idx) => (
              <NavLink
                key={idx}
                to={item.path}
                className={({ isActive }) =>
                  `relative text-[14px] xl:text-[15px] font-serif tracking-wide transition-colors duration-300 group ${
                    isActive
                      ? "text-[#6B8E23] font-medium"
                      : "text-[#2E2410] hover:text-[#6B8E23]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    <span
                      className={`absolute -bottom-1.5 left-1/2 h-[1.5px] bg-[#6B8E23] transition-all duration-300 ease-out -translate-x-1/2 ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    ></span>
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* 3. Right: Actions (Search, Cart, Subscribe/User, Mobile Menu) */}
          <div className="flex-1 flex items-center justify-end gap-6 md:gap-7 text-[#2E2410]">
            {/* Search */}
            <button
              className="hover:text-[#6B8E23] transition-all duration-300 hover:-translate-y-[2px]"
              aria-label="Search"
            >
              <FaMagnifyingGlass size={18} />
            </button>

            {/* Cart */}
            <button
              onClick={() => dispatch({ type: "TOGGLE_CART" })}
              className="relative hover:text-[#6B8E23] transition-all duration-300 hover:-translate-y-[2px]"
              aria-label="Cart"
            >
              <FaCartShopping size={19} />
              {cartCount > 0 && (
                <span className="absolute -top-2.5 -right-2.5 w-[18px] h-[18px] rounded-full bg-[#8B3A2A] shadow-md text-white text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Menu (Desktop) */}
            <div className="relative user-menu hidden lg:block">
              {!user ? (
                <button
                  onClick={() => navigate("/login")}
                  className="relative text-[14px] xl:text-[15px] hover:text-[#6B8E23] transition-colors font-serif font-medium tracking-wide group"
                >
                  Subscribe
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#6B8E23] transition-all duration-300 group-hover:w-full"></span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setIsUserMenuOpen((prev) => !prev)}
                    className="flex items-center gap-2 hover:text-[#6B8E23] transition-all duration-300 hover:-translate-y-[1px] font-serif font-medium tracking-wide"
                  >
                    <FaRegUser size={16} />
                    {user.username}
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 mt-6 w-52 bg-[#FFFDF8] border border-[#D4C4A8]/50 rounded-lg shadow-[0_12px_40px_rgba(46,36,16,0.08)] py-2 z-[200] text-[#2E2410]"
                      >
                        <NavLink
                          to="/user/dashboard"
                          className="block px-5 py-2.5 text-[14px] font-sans hover:text-[#6B8E23] hover:bg-[#EADDCA]/20 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Profile
                        </NavLink>

                        <button
                          onClick={async () => {
                            const refresh = localStorage.getItem("refresh");
                            await logoutUser(refresh);
                            localStorage.removeItem("access");
                            localStorage.removeItem("refresh");
                            setUser(null);
                            setLoadingUser(false);
                            setIsUserMenuOpen(false);
                            navigate("/login");
                          }}
                          className="w-full text-left px-5 py-2.5 text-[14px] font-sans text-[#8B3A2A] hover:bg-[#8B3A2A]/5 transition-colors"
                        >
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-1 text-[#2E2410] hover:text-[#6B8E23] transition-transform duration-300 hover:scale-110 active:scale-95"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <FaXmark size={24} /> : <FaBars size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Premium Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ type: "tween", duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 z-[150] bg-[#F4EEE0]/95 backdrop-blur-md p-6 flex flex-col shadow-2xl lg:hidden"
          >
            <div className="flex justify-end mb-8">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[#3A5A1C] p-2 hover:bg-[#D4C4A8]/30 rounded-full transition-transform hover:rotate-90 duration-300"
              >
                <FaXmark size={28} />
              </button>
            </div>

            <div className="flex flex-col gap-6 w-full px-4 text-center">
              <div className="text-[#2E2410] font-serif text-2xl mb-6 font-medium border-b border-[#D4C4A8]/40 pb-6 uppercase tracking-[0.2em]">
                Eatpur Naturals
              </div>

              {navItems.map((item, idx) => (
                <NavLink
                  key={idx}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `text-xl font-serif tracking-wide transition-colors py-2 ${
                      isActive
                        ? "text-[#6B8E23]"
                        : "text-[#5C4F3A] hover:text-[#6B8E23]"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}

              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4C4A8]/50 to-transparent my-6"></div>

              {!user ? (
                <NavLink
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-xl font-serif text-[#2E2410] hover:text-[#6B8E23] transition-colors"
                >
                  Subscribe / Login
                </NavLink>
              ) : (
                <>
                  <NavLink
                    to="/user/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-xl font-serif text-[#2E2410] hover:text-[#6B8E23] transition-colors"
                  >
                    Profile
                  </NavLink>
                  <button
                    onClick={async () => {
                      const refresh = localStorage.getItem("refresh");
                      await logoutUser(refresh);
                      localStorage.removeItem("access");
                      localStorage.removeItem("refresh");
                      setUser(null);
                      setIsMobileMenuOpen(false);
                      window.location.href = "/login";
                    }}
                    className="text-xl font-serif text-[#8B3A2A] hover:text-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Chatbot isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </>
  );
}
