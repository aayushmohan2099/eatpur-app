// src/pages/User/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { getMe } from "../../api/authApi"; // Ensure your path is correct
import Header from "./Components/Header";
import Sidebar, { SUB_MENUS } from "./Components/Sidebar";

// ===========================================================================
// PLACEHOLDER COMPONENTS FOR THE HERO SECTION
// ===========================================================================

const PageHeader = ({ title, subtitle }) => (
  <div className="mb-6 md:mb-8">
    <h1 className="text-2xl md:text-3xl font-bold text-[--color-eatpur-dark] font-[family-name:var(--font-display)]">
      {title}
    </h1>
    <p className="text-[--color-eatpur-text-light] mt-1">{subtitle}</p>
  </div>
);

// Generic Wrapper for rendering the active page
const HeroPlaceholder = ({ activeModule, activeSubMenu, user }) => {
  // Find the exact label for the UI
  const subMenuLabel =
    SUB_MENUS[activeModule]?.find((s) => s.id === activeSubMenu)?.label ||
    activeSubMenu;

  return (
    <div className="max-w-5xl mx-auto w-full animate-fade-in">
      <PageHeader
        title={subMenuLabel}
        subtitle={`Manage your ${activeModule.toLowerCase()} > ${subMenuLabel.toLowerCase()} here.`}
      />

      <div className="bg-[--color-eatpur-card] p-6 md:p-8 rounded-[--radius-card] shadow-[var(--shadow-card)] border border-[--color-eatpur-border]">
        {/* If on Profile -> Personal Info, show the user details */}
        {activeModule === "Profile" && activeSubMenu === "personal_info" ? (
          <div>
            <h3 className="text-lg font-semibold text-[--color-eatpur-dark] mb-6 border-b border-[--color-eatpur-border] pb-2">
              Your Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[--color-eatpur-text-light] mb-1">
                  Username
                </p>
                <p className="text-[--color-eatpur-text] font-medium bg-[--color-eatpur-bg-light] px-3 py-2 rounded-[--radius-button] border border-[--color-eatpur-border]">
                  {user?.username || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[--color-eatpur-text-light] mb-1">
                  Email Address
                </p>
                <p className="text-[--color-eatpur-text] font-medium bg-[--color-eatpur-bg-light] px-3 py-2 rounded-[--radius-button] border border-[--color-eatpur-border]">
                  {user?.email || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[--color-eatpur-text-light] mb-1">
                  Mobile Number
                </p>
                <p className="text-[--color-eatpur-text] font-medium bg-[--color-eatpur-bg-light] px-3 py-2 rounded-[--radius-button] border border-[--color-eatpur-border]">
                  {user?.mobile || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[--color-eatpur-text-light] mb-1">
                  Age
                </p>
                <p className="text-[--color-eatpur-text] font-medium bg-[--color-eatpur-bg-light] px-3 py-2 rounded-[--radius-button] border border-[--color-eatpur-border]">
                  {user?.age || "N/A"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Generic Placeholder for all other pages */
          <div className="h-48 md:h-64 flex flex-col items-center justify-center text-center border-2 border-dashed border-[--color-eatpur-green-light] rounded-[--radius-card] bg-[--color-eatpur-green-pale] opacity-80">
            <svg
              className="w-12 h-12 text-[--color-eatpur-green] mb-3 opacity-50"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <p className="text-lg font-medium text-[--color-eatpur-green-dark]">
              {subMenuLabel} Workspace
            </p>
            <p className="text-sm text-[--color-eatpur-text] mt-1 max-w-sm">
              Component for{" "}
              <span className="font-bold">
                {activeModule} &gt; {activeSubMenu}
              </span>{" "}
              will be rendered here.
            </p>
          </div>
        )}
      </div>

      {/* Tailwind basic animation definition */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

// ===========================================================================
// MAIN DASHBOARD LAYOUT
// ===========================================================================

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mobile Sidebar Toggle State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Navigation State
  const [activeModule, setActiveModule] = useState("Profile");
  const [activeSubMenu, setActiveSubMenu] = useState("personal_info");

  // When activeModule changes, reset the subMenu to the first option of the new module
  const handleModuleChange = (module) => {
    setActiveModule(module);
    const firstSubMenu = SUB_MENUS[module][0].id;
    setActiveSubMenu(firstSubMenu);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("access");
        if (token) {
          const data = await getMe(token);
          setUser(data);
        }
      } catch (error) {
        console.error("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[--color-eatpur-bg-light] text-[--color-eatpur-text]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[--color-eatpur-green-soft] border-t-[--color-eatpur-green] rounded-full animate-spin"></div>
          <p className="font-medium animate-pulse">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[--color-eatpur-bg-light] font-[family-name:var(--font-sans)] overflow-hidden">
      {/* 1. Sidebar (Controlled by Dashboard State) */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeModule={activeModule}
        activeSubMenu={activeSubMenu}
        setActiveSubMenu={setActiveSubMenu}
      />

      <div className="flex flex-col flex-1 min-w-0">
        {/* 2. Header (Controls activeModule) */}
        <Header
          onMenuClick={() => setIsSidebarOpen(true)}
          user={user}
          activeModule={activeModule}
          setActiveModule={handleModuleChange}
        />

        {/* 3. Main Hero Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[--color-eatpur-bg-light]">
          <HeroPlaceholder
            activeModule={activeModule}
            activeSubMenu={activeSubMenu}
            user={user}
          />
        </main>
      </div>
    </div>
  );
}
