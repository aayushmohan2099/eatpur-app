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
          className="fixed inset-0 bg-[--color-eatpur-overlay-dark] backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[--color-eatpur-card] border-r border-[--color-eatpur-border] transform transition-transform duration-[--transition-medium] flex flex-col md:translate-x-0 md:static md:flex-shrink-0 ${
          isOpen
            ? "translate-x-0 shadow-[var(--shadow-premium)]"
            : "-translate-x-full"
        }`}
      >
        {/* Desktop Title / Mobile Close Area */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-[--color-eatpur-border] bg-[--color-eatpur-bg-light]">
          <span className="text-lg font-bold text-[--color-eatpur-dark] font-[family-name:var(--font-display)] tracking-wide">
            {activeModule} Menu
          </span>
          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="md:hidden text-[--color-eatpur-text-light] hover:text-[--color-eatpur-clay] transition-colors"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Dynamic Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {currentSubMenus.map((menu) => {
            const isActive = activeSubMenu === menu.id;
            return (
              <button
                key={menu.id}
                onClick={() => {
                  setActiveSubMenu(menu.id);
                  if (window.innerWidth < 768) onClose(); // Auto-close on mobile after selection
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-[--radius-button] font-medium transition-all duration-[--transition-fast] text-left ${
                  isActive
                    ? "bg-[--color-eatpur-green-pale] text-[--color-eatpur-dark] shadow-sm border border-[--color-eatpur-green-soft]"
                    : "text-[--color-eatpur-text-light] hover:bg-[--color-eatpur-gray-light] hover:text-[--color-eatpur-text] border border-transparent"
                }`}
              >
                <Icon
                  name={menu.icon}
                  className={`w-5 h-5 ${isActive ? "text-[--color-eatpur-green]" : "text-[--color-eatpur-text-light]"}`}
                />
                {menu.label}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
