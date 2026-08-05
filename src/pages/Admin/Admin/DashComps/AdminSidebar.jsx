// src/pages/Admin/Admin/AdminSidebar.jsx
import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

export default function AdminSidebar({
  activeTab,
  activeSubTab,
  setActiveSubTab,
  sidebarSubLinks,
}) {
  const [isOpen, setIsOpen] = useState(true);
  const currentSubLinks = sidebarSubLinks[activeTab] || [];

  return (
    <>
      {/* Sidebar Container */}
      <aside
        className={`w-full md:w-64 shrink-0 md:fixed md:left-0 md:top-[135px] lg:top-[147px] md:h-[calc(100vh-147px)] md:border-r md:border-slate-200/60 md:bg-white z-40 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "md:-translate-x-full"
          }`}
      >
        <div className="p-4 bg-white md:bg-transparent sticky top-40 md:top-0 h-full flex flex-col justify-between">
          <div>
            <h3 className="flex justify-center text-xs font-bold color-eatpur-text uppercase tracking-wider mb-4 px-3">
              {activeTab} Menu
            </h3>
            <nav className="flex flex-col space-y-1.5">
              {currentSubLinks.map((subLink) => {
                const isSubActive =
                  activeSubTab === subLink ||
                  (!activeSubTab && currentSubLinks[0] === subLink);

                return (
                  <button
                    key={subLink}
                    onClick={() => setActiveSubTab(subLink)}
                    className={`text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 relative overflow-hidden flex items-center justify-between ${isSubActive
                      ? "text-[#3A5A1C] font-semibold bg-[#3A5A1C]/5 shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                  >
                    {/* Link Label */}
                    <span className="relative z-10">{subLink}</span>

                    {/* Tiny Right Arrow Indicator for Active Item */}
                    {isSubActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3A5A1C] relative z-10" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </aside>

      {/* Desktop Toggle Button positioned precisely adjacent to the sidebar edge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`hidden md:flex fixed top-[50%] -translate-y-1/2 z-50 items-center justify-center w-7 h-12 bg-white border border-slate-200 text-slate-600 shadow-md hover:bg-slate-50 transition-all duration-300 ${isOpen ? "left-64 rounded-r-lg border-l-0" : "left-0 rounded-r-lg border-l-0"
          }`}
        aria-label="Toggle Sidebar"
      >
        {isOpen ? <FaChevronLeft size={12} /> : <FaChevronRight size={12} />}
      </button>
    </>
  );
}