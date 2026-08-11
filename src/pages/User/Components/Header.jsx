// src/pages/User/Components/Header.jsx
import React from "react";

const MODULES = [
  { id: "Profile", label: "Profile", icon: "User" },
  { id: "Orders", label: "Orders", icon: "Bag" },
  { id: "Wishlist", label: "Wishlist", icon: "Heart" },
  { id: "Returns", label: "Returns", icon: "Return" },
];

const HeaderIcon = ({ name, className }) => {
  const icons = {
    User: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    ),
    Bag: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
      />
    ),
    Heart: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    ),
    Return: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
      />
    ),
  };
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      {icons[name]}
    </svg>
  );
};

export default function Header({
  onMenuClick,
  user,
  activeModule,
  setActiveModule,
}) {
  return (
    <header className="bg-white/75 z-30 sticky top-0 pt-6 px-4 md:px-8">
      {/* Mobile Top Row (Hamburger Menu) */}
      <div className="flex md:hidden items-center justify-between mb-4">
        <span className="font-display font-bold text-xl text-[--color-eatpur-dark]">
          Dashboard
        </span>
        <button
          onClick={onMenuClick}
          className="p-2 text-[--color-eatpur-text] bg-white border border-[#DCDFD9] shadow-sm rounded-lg hover:bg-[--color-eatpur-gray-light] transition-colors"
        >
          <svg
            className="w-5 h-5"
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

      {/* Module Tabs Row (Matches image_bbc618.jpg) */}
      <div className="w-full border-b border-[#DCDFD9]">
        <div className="flex gap-8 overflow-x-auto hide-scrollbar">
          {MODULES.map((mod) => {
            const isActive = activeModule === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => setActiveModule(mod.id)}
                className={`flex items-center gap-2 pb-4 relative whitespace-nowrap font-medium text-sm md:text-base transition-colors ${
                  isActive
                    ? "text-[--color-eatpur-green-dark]"
                    : "text-[--color-eatpur-text-light] hover:text-[--color-eatpur-dark]"
                }`}
              >
                <HeaderIcon
                  name={mod.icon}
                  className={`w-5 h-5 ${isActive ? "text-[--color-eatpur-green-dark]" : "text-[--color-eatpur-text-light]"}`}
                />
                {mod.label}

                {/* Active Indicator Underline */}
                {isActive && (
                  <span className="absolute bottom-[-1px] left-0 w-full h-[2.5px] bg-[--color-eatpur-green-dark] rounded-t-sm"></span>
                )}
              </button>
            );
          })}
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
