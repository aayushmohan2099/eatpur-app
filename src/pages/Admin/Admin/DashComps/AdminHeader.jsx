// src/pages/Admin/Admin/AdminHeader.jsx
import React from "react";

export default function AdminHeader({ navLinks, activeTab, handleTabChange }) {
  return (
    <div className="bg-[#3A5A1C] sticky top-[76px] lg:top-[88px] z-[90] shadow-[0_8px_30px_rgba(58,90,28,0.15)] border-t border-[#4C7A4F]/30">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Added justify-center to perfectly align nav items in the center */}
        <nav className="flex justify-center space-x-6 md:space-x-8 overflow-x-auto scrollbar-hide">
          {navLinks.map((link) => (
            <button
              key={link}
              onClick={() => handleTabChange(link)}
              className={`whitespace-nowrap py-3.5 text-sm font-serif tracking-wide transition-all duration-300 relative ${
                activeTab === link
                  ? "text-white font-medium drop-shadow-md"
                  : "text-[#D4C4A8] hover:text-white hover:-translate-y-[1px]"
              }`}
            >
              {link}

              {/* White Glowing Active Indicator Underline */}
              {activeTab === link && (
                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-white rounded-t-md shadow-[0_-2px_10px_rgba(255,255,255,0.6)]" />
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
