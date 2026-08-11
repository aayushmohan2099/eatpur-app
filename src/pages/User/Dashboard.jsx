// src/pages/User/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { getMe } from "../../api/authApi"; // Ensure your path is correct
import Header from "./Components/Header";
import Sidebar, { SUB_MENUS } from "./Components/Sidebar";
import MilletBg from "../../assets/user/millet_user_bg.png";

// ===========================================================================
// ICONS FOR FORMS
// ===========================================================================
const ICONS = {
  User: (
    <>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
      />
      <circle
        cx="12"
        cy="7"
        r="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  Mail: (
    <>
      <rect
        x="2"
        y="4"
        width="20"
        height="16"
        rx="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M22 7l-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
      />
    </>
  ),
  Phone: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
    />
  ),
  Calendar: (
    <>
      <rect
        x="3"
        y="4"
        width="18"
        height="18"
        rx="2"
        ry="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="16"
        y1="2"
        x2="16"
        y2="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="8"
        y1="2"
        x2="8"
        y2="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="3"
        y1="10"
        x2="21"
        y2="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
};

// ===========================================================================
// PLACEHOLDER COMPONENTS FOR THE HERO SECTION
// ===========================================================================

const DashboardField = ({ label, value, icon }) => (
  <div className="flex flex-col gap-2">
    <span className="text-[11px] font-bold uppercase tracking-wider text-[--color-eatpur-text-light]">
      {label}
    </span>
    <div className="flex items-center gap-3 p-3.5 rounded-xl border border-[#DCDFD9] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.01)] hover:border-[--color-eatpur-green-light] transition-colors">
      <svg
        className="w-5 h-5 text-[--color-eatpur-green-dark]"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        viewBox="0 0 24 24"
      >
        {ICONS[icon]}
      </svg>
      <span className="text-sm font-medium text-[--color-eatpur-dark]">
        {value || "N/A"}
      </span>
    </div>
  </div>
);

const PageHeader = ({ title, activeModule }) => (
  <div className="flex items-center gap-6 mb-10">
    <div className="w-24 h-24 rounded-full bg-[--color-eatpur-green-pale] flex items-center justify-center border border-[#DCDFD9] shadow-sm shrink-0">
      <svg
        className="w-10 h-10 text-[--color-eatpur-green-dark]"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        viewBox="0 0 24 24"
      >
        {ICONS.User}
      </svg>
    </div>
    <div>
      <h1 className="text-3xl md:text-4xl font-bold text-[--color-eatpur-dark] font-display mb-1.5 tracking-tight">
        {title}
      </h1>
      <p className="text-[--color-eatpur-text-light] text-sm md:text-base font-serif">
        Manage your{" "}
        <span className="text-[--color-eatpur-green-dark] font-medium">
          {activeModule.toLowerCase()}
        </span>{" "}
        &gt; {title.toLowerCase()} here.
      </p>
    </div>
  </div>
);

// Generic Wrapper for rendering the active page
const HeroPlaceholder = ({ activeModule, activeSubMenu, user }) => {
  // Find the exact label for the UI
  const subMenuLabel =
    SUB_MENUS[activeModule]?.find((s) => s.id === activeSubMenu)?.label ||
    activeSubMenu;

  return (
    <div className="max-w-5xl mx-auto w-full animate-fade-in pb-10">
      <PageHeader title={subMenuLabel} activeModule={activeModule} />

      {/* If on Profile -> Personal Info, show the user details */}
      {activeModule === "Profile" && activeSubMenu === "personal_info" ? (
        <div className="bg-white/75 p-8 md:p-10 rounded-3xl shadow-sm border-r md:border border-[#DCDFD9]">
          <div className="flex items-center gap-3 border-b border-[#DCDFD9] pb-5 mb-8">
            <svg
              className="w-6 h-6 text-[--color-eatpur-green-dark]"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              {ICONS.User}
            </svg>
            <h3 className="text-xl font-bold text-[--color-eatpur-dark] font-display">
              Your Details
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-8">
            <DashboardField
              label="USERNAME"
              value={user?.username}
              icon="User"
            />
            <DashboardField
              label="EMAIL ADDRESS"
              value={user?.email}
              icon="Mail"
            />
            <DashboardField
              label="MOBILE NUMBER"
              value={user?.mobile}
              icon="Phone"
            />
            <DashboardField label="AGE" value={user?.age} icon="Calendar" />
          </div>
        </div>
      ) : (
        /* Generic Placeholder for all other pages */
        <div className="h-64 flex flex-col items-center justify-center text-center border-2 border-dashed border-[#DCDFD9] rounded-[24px] bg-white/50 opacity-90">
          <svg
            className="w-12 h-12 text-[--color-eatpur-green-dark] mb-4 opacity-50"
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
          <p className="text-xl font-display font-bold text-[--color-eatpur-dark]">
            {subMenuLabel} Workspace
          </p>
          <p className="text-sm font-serif text-[--color-eatpur-text-light] mt-2 max-w-sm">
            Component for{" "}
            <span className="font-bold text-[--color-eatpur-green-dark]">
              {activeModule} &gt; {activeSubMenu}
            </span>{" "}
            will be rendered here.
          </p>
        </div>
      )}

      {/* Tailwind basic animation definition */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
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
      <div className="min-h-screen flex items-center justify-center bg-[--color-eatpur-white-warm] text-[--color-eatpur-text]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[--color-eatpur-green-light] border-t-[--color-eatpur-green-dark] rounded-full animate-spin"></div>
          <p className="font-display font-medium text-lg animate-pulse text-[--color-eatpur-dark]">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex h-screen bg-cover bg-center bg-no-repeat font-[family-name:var(--font-sans)] overflow-hidden bg-[--color-eatpur-white-warm]"
      style={{ backgroundImage: `url(${MilletBg})` }}
    >
      {/* 1. Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeModule={activeModule}
        activeSubMenu={activeSubMenu}
        setActiveSubMenu={setActiveSubMenu}
      />

      {/* 2. Main Content Wrapper (Floating Glass Effect) */}
      <div className="flex flex-col flex-1 min-w-0 md:rounded-3xl md:my-6 md:mr-6 md:ml-6 bg-white/75 border-r md:border border-[#DCDFD9] shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden relative z-10">
        {/* Header (Controls activeModule) */}
        <Header
          onMenuClick={() => setIsSidebarOpen(true)}
          user={user}
          activeModule={activeModule}
          setActiveModule={handleModuleChange}
        />

        {/* 3. Main Hero Content Area */}
        <main className="flex-1 overflow-y-auto px-6 md:px-12 pt-8 md:pt-10">
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
