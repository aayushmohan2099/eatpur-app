// src/pages/User/Components/Sidebar.jsx
import React from "react";

// Export the configuration so Dashboard can reset the sub-menu when the module changes
export const SUB_MENUS = {
  Profile: [
    { id: "personal_info", label: "Personal Info", icon: "User" },
    { id: "addresses", label: "Saved Addresses", icon: "MapPin" },
    { id: "security", label: "Security & Passwords", icon: "Shield" },
  ],
  Orders: [
    { id: "active_orders", label: "Active Orders", icon: "Truck" },
    { id: "order_history", label: "Order History", icon: "Clock" },
    { id: "invoices", label: "Invoices", icon: "FileText" },
  ],
  Wishlist: [
    { id: "all_items", label: "All Items", icon: "Heart" },
    { id: "price_drops", label: "Price Drops", icon: "TrendingDown" },
  ],
  Returns: [
    { id: "active_returns", label: "Active Returns", icon: "RefreshCw" },
    { id: "return_history", label: "Return History", icon: "Archive" },
    { id: "policy", label: "Return Policy", icon: "Info" },
  ],
};

// SVG Icon Helper Component
const Icon = ({ name, className }) => {
  const icons = {
    User: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    ),
    MapPin: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"
      />
    ),
    Shield: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    ),
    Truck: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 14h.01M12 14h.01M16 14h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
      />
    ),
    Clock: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
    FileText: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    ),
    Heart: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    ),
    TrendingDown: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
      />
    ),
    RefreshCw: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    ),
    Archive: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
      />
    ),
    Info: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
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
      {icons[name] || icons.Info}
    </svg>
  );
};

export default function Sidebar({
  isOpen,
  onClose,
  activeModule,
  activeSubMenu,
  setActiveSubMenu,
}) {
  const currentSubMenus = SUB_MENUS[activeModule] || [];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar Container (Floating on Desktop, Semi-Transparent Glass) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72
          bg-white/75
          border-r md:border border-[#DCDFD9]
          transform transition-transform duration-300
          flex flex-col
          md:translate-x-0 md:static md:flex-shrink-0
          md:rounded-3xl md:my-6 md:ml-6
          md:h-[calc(100vh-3rem)]
          shadow-[0_8px_30px_rgba(0,0,0,0.04)]
          overflow-hidden
          ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}`}
      >
        {/* Top Area: Title & Close */}
        <div className="pt-10 px-8 pb-8 bg-transparent relative">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[--color-eatpur-dark] font-display tracking-wide">
                {activeModule} Menu
              </h2>
              {/* Green Title Underline */}
              <div className="w-6 h-0.5 bg-[--color-eatpur-green-dark] mt-3 rounded-full"></div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="md:hidden text-[--color-eatpur-text-light] hover:text-[--color-eatpur-dark] bg-white rounded-full p-2 shadow-sm border border-slate-100 transition-colors"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Dynamic Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-5 pb-8 space-y-1.5 hide-scrollbar">
          {currentSubMenus.map((menu) => {
            const isActive = activeSubMenu === menu.id;
            return (
              <button
                key={menu.id}
                onClick={() => {
                  setActiveSubMenu(menu.id);
                  if (window.innerWidth < 768) onClose(); // Auto-close on mobile
                }}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-sans font-medium transition-all duration-200 text-left ${
                  isActive
                    ? "bg-[--color-eatpur-white-warm] text-[--color-eatpur-green-dark] shadow-sm border border-[--color-eatpur-green-light]/20"
                    : "text-[--color-eatpur-dark] hover:bg-black/5 border border-transparent"
                }`}
              >
                <div
                  className={`flex items-center justify-center ${isActive ? "text-[--color-eatpur-green-dark]" : "text-[--color-eatpur-dark]"}`}
                >
                  <Icon name={menu.icon} className="w-5 h-5" />
                </div>
                {menu.label}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
