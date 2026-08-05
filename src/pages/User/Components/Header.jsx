// src/pages/User/Components/Header.jsx
import React from "react";

const MODULES = ["Profile", "Orders", "Wishlist", "Returns"];

export default function Header({
  onMenuClick,
  user,
  activeModule,
  setActiveModule,
}) {
  return (
    <header className="bg-[--color-eatpur-card] z-30 sticky top-0 shadow-[var(--shadow-card)] flex flex-col">
      {/* Top Row: Brand & Profile */}
      <div className="h-16 flex items-center justify-center px-4 md:px-8 border-b border-[--color-eatpur-gray-light]">
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger Icon */}
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 -ml-2 text-[--color-eatpur-text] hover:bg-[--color-eatpur-gray-light] rounded-[--radius-button] transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Bottom Row: Main Module Tabs (Scrollable on Mobile) */}
        <div className="px-4 md:px-8 bg-[--color-eatpur-white-warm]">
          <div className="flex space-x-6 overflow-x-auto hide-scrollbar py-2">
            {MODULES.map((mod) => {
              const isActive = activeModule === mod;
              return (
                <button
                  key={mod}
                  onClick={() => setActiveModule(mod)}
                  className={`whitespace-nowrap py-2 px-1 relative font-medium text-sm md:text-base transition-colors ${
                    isActive
                      ? "text-[--color-eatpur-dark]"
                      : "text-[--color-eatpur-text-light] hover:text-[--color-eatpur-text]"
                  }`}
                >
                  {mod}
                  {/* Active Indicator Underline */}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[--color-eatpur-green] rounded-t-md"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hide scrollbar CSS for the horizontal scrolling tabs */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </header>
  );
}
