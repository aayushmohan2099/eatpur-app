import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import { FaCartShopping, FaBars, FaXmark, FaRegUser, FaMagnifyingGlass } from "react-icons/fa6";
import { useCart } from "../context/CartContext";
import Chatbot from "./Chatbot";
import { getMe, logoutUser } from "../api/authApi";

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
    { label: "Shop", path: "/products" },
    { label: "About Us", path: "/about" },
    { label: "Recipes", path: "/recipes" },
    { label: "Blogs", path: "/blogs" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <>
      <nav className="w-full relative z-[60] bg-transparent flex flex-col">

        {/* Top faint solid border matching the screenshot */}
        <div className="w-full border-t border-[#D4C4A8]/60"></div>

        {/* Tier 1: Spacer (Left), Logo (Center), Icons (Right) */}
        <div className="w-full max-w-[1280px] mx-auto px-6 pt-8 pb-6 flex items-center justify-between">

          {/* Left Spacer (to keep logo perfectly centered) */}
          <div className="flex-1 hidden md:block"></div>

          {/* Mobile menu toggle (Left on mobile) */}
          <div className="w-16 md:hidden flex items-center">
            <button
              className="p-2 text-[#2E2410] hover:text-[#6B8E23] transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <FaXmark size={24} /> : <FaBars size={22} />}
            </button>
          </div>

          {/* Center Logo */}
          <NavLink to="/" className="flex flex-col items-center justify-center flex-1 md:flex-none decoration-transparent group">
            <h1 className="font-serif text-[38px] md:text-[46px] leading-none text-[#2E2410] tracking-[0.02em] group-hover:text-[#3A5A1C] transition-colors">
              EATPUR NATURALS
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <div className="w-10 md:w-16 h-[1px] bg-[#5C4F3A]/40"></div>
              <span className="font-serif text-[9px] md:text-[11px] tracking-[0.35em] text-[#5C4F3A] uppercase">
                PURE & WHOLESOME
              </span>
              <div className="w-10 md:w-16 h-[1px] bg-[#5C4F3A]/40"></div>
            </div>
          </NavLink>

          {/* Right Actions */}
          <div className="flex-1 flex justify-end items-center gap-5 md:gap-7 text-[#2E2410]">
            <button
              className="hover:text-[#6B8E23] transition-colors"
              aria-label="Search"
            >
              <FaMagnifyingGlass size={18} />
            </button>

            <button
              onClick={() => dispatch({ type: "TOGGLE_CART" })}
              className="relative hover:text-[#6B8E23] transition-colors"
              aria-label="Cart"
            >
              <FaCartShopping size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#8B3A2A] text-white text-[9px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <div className="relative user-menu hidden md:block">
              {!user ? (
                /* NOT LOGGED IN: 'Subscribe' text, navigates directly to login, no dropdown */
                <button
                  onClick={() => navigate("/login")}
                  className="hover:text-[#6B8E23] transition-colors font-serif font-medium tracking-wide"
                >
                  Subscribe
                </button>
              ) : (
                /* LOGGED IN: Shows Username, click opens Profile/Logout dropdown */
                <>
                  <button
                    onClick={() => setIsUserMenuOpen((prev) => !prev)}
                    className="flex items-center gap-2 hover:text-[#6B8E23] transition-colors font-serif font-medium tracking-wide"
                  >
                    <FaRegUser size={16} />
                    {user.username}
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-4 w-48 bg-[#FFFDF8] border border-[#D4C4A8] rounded-xl shadow-[0_8px_24px_rgba(58,40,10,0.08)] p-2 z-[200] text-[#2E2410]"
                      >
                        <NavLink
                          to="/user/dashboard"
                          className="block px-4 py-2.5 text-sm font-sans hover:text-[#6B8E23] hover:bg-[#EADDCA]/30 rounded transition-colors"
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
                          className="w-full text-left px-4 py-2.5 text-sm font-sans text-[#8B3A2A] hover:bg-[#8B3A2A]/10 rounded mt-1 transition-colors"
                        >
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tier 2: The Dashed Divider Line */}
        <div className="w-full border-b border-dashed border-[#D4C4A8]"></div>

        {/* Tier 3: Centered Links */}
        <div className="hidden md:flex w-full items-center justify-center py-5 gap-12">
          {navItems.map((item, idx) => (
            <NavLink
              key={idx}
              to={item.path}
              className={({ isActive }) =>
                `text-[15px] font-serif transition-colors duration-300 ${isActive
                  ? "text-[#6B8E23] font-medium"
                  : "text-[#2E2410] hover:text-[#6B8E23]"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Mobile Floating Menu Overlay (Updated to Vintage Theme) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 z-[150] bg-[#F4EEE0] p-6 flex flex-col"
          >
            <div className="flex justify-end mb-8">
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-[#3A5A1C] p-2 hover:bg-[#D4C4A8]/30 rounded-full transition-colors">
                <FaXmark size={28} />
              </button>
            </div>

            <div className="flex flex-col gap-6 w-full px-4 text-center">
              <div className="text-[#2E2410] font-serif text-3xl mb-4 font-medium border-b border-[#D4C4A8] pb-6 uppercase tracking-wider">
                Eatpur Naturals
              </div>

              {navItems.map((item, idx) => (
                <NavLink
                  key={idx}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `text-xl font-serif transition-colors py-2 ${isActive ? "text-[#6B8E23]" : "text-[#5C4F3A] hover:text-[#2E2410]"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}

              <div className="w-full h-[1px] border-b border-dashed border-[#D4C4A8] my-4"></div>

              {!user ? (
                <NavLink
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-xl font-serif text-[#2E2410] hover:text-[#6B8E23] transition-colors"
                >
                  Login / Register
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