import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        {/* LEFT LOGO */}
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

        {/* RIGHT CTA */}
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
  );
}
