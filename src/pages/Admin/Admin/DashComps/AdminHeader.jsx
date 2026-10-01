// src/pages/Admin/Admin/AdminHeader.jsx
import React, { useState } from "react";
import { FaBars, FaChevronRight, FaTimes } from "react-icons/fa";

export default function AdminHeader({ navLinks, activeTab, handleTabChange }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const selectTab = (link) => {
    handleTabChange(link);
    setIsMenuOpen(false);
  };

  return (
    <div className="bg-[#3A5A1C] sticky top-[72px] lg:top-[80px] z-[90] shadow-[0_8px_30px_rgba(58,90,28,0.15)] border-t border-[#4C7A4F]/30">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2.5 md:hidden">
          <div className="flex min-w-0 flex-col">
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#D4C4A8]">
              Admin panel
            </span>
            <span className="truncate text-sm font-medium text-white">{activeTab}</span>
          </div>
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label={isMenuOpen ? "Close admin menu" : "Open admin menu"}
            aria-expanded={isMenuOpen}
            aria-controls="admin-dashboard-navigation"
            className="flex min-h-10 items-center justify-center gap-2 rounded-lg border border-white/20 px-3 text-xs font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            {isMenuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
            <span>{isMenuOpen ? "Close" : "Menu"}</span>
          </button>
        </div>

        <nav
          id="admin-dashboard-navigation"
          className={`${isMenuOpen ? "block" : "hidden"} -mx-4 max-h-[70vh] overflow-y-auto overscroll-contain border-t border-[#D8DDCB] bg-[#F7F5ED] px-4 pb-4 pt-3 shadow-[0_14px_24px_rgba(26,43,18,0.18)] sm:-mx-6 sm:px-6 md:mx-0 md:block md:max-h-none md:overflow-x-auto md:overflow-y-visible md:border-0 md:bg-transparent md:p-0 md:shadow-none scrollbar-hide`}
        >
          <div className="flex flex-col gap-1 md:flex-row md:justify-center md:gap-0 md:space-x-6 lg:space-x-8">
            {navLinks.map((link) => (
              <button
                key={link}
                onClick={() => selectTab(link)}
                className={`relative flex min-h-11 w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-serif transition-colors md:min-h-0 md:w-auto md:justify-start md:rounded-none md:px-0 md:py-3.5 md:text-center md:tracking-wide md:transition-all md:duration-300 ${
                  activeTab === link
                    ? "bg-[#3A5A1C] font-semibold text-white shadow-sm ring-1 ring-[#3A5A1C] md:bg-transparent md:font-medium md:text-white md:shadow-none md:ring-0 md:drop-shadow-md"
                    : "text-[#35432B] hover:bg-[#E7ECD9] md:text-[#D4C4A8] md:hover:bg-transparent md:hover:-translate-y-[1px]"
                }`}
              >
                {link}
                <FaChevronRight
                  size={11}
                  className={`ml-3 shrink-0 md:hidden ${activeTab === link ? "text-[#E5C76B]" : "text-[#829078]"}`}
                />
                {activeTab === link && (
                  <span className="absolute bottom-0 left-0 right-0 hidden h-[3px] rounded-t-md bg-white shadow-[0_-2px_10px_rgba(255,255,255,0.6)] md:block" />
                )}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
