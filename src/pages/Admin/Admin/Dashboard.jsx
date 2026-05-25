// src/pages/Admin/Admin/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import AdminHeader from "./DashComps/AdminHeader";
import AdminSidebar from "./DashComps/AdminSidebar";

// Workspaces
import BlogsWorkspace from "./Blogs";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { tab, subTab } = useParams();

  // 1. FUTURE-PROOF NAVIGATION REGISTRY
  // Easily map display names directly to paths or internal views
  const navRegistry = [
    {
      name: "Dashboard",
      path: "/admin/dashboard/main/overview",
      isExternalPage: false,
    },
    {
      name: "Products",
      path: "/admin/dashboard/products/",
      isExternalPage: false,
    },
    {
      name: "Inventory",
      path: "/admin/dashboard/inventory/",
      isExternalPage: false,
    },
    {
      name: "Orders",
      path: "/admin/dashboard/orders/",
      isExternalPage: false,
    },
    {
      name: "Customers",
      path: "/admin/dashboard/customers/",
      isExternalPage: false,
    },
    {
      name: "Reviews",
      path: "/admin/dashboard/reviews/",
      isExternalPage: false,
    },
    {
      name: "Grievances",
      path: "/admin/dashboard/grievances/",
      isExternalPage: false,
    },
    {
      name: "Blogs",
      path: "/admin/dashboard/blogs/",
      isExternalPage: false,
    },
    {
      name: "Staff Management",
      path: "/admin/dashboard/staff/",
      isExternalPage: false,
    },
  ];

  // Dynamic sub-navigation mapping
  const sidebarSubLinks = {
    Dashboard: ["Overview", "Real-time Metrics", "Sales Reports"],
    Products: ["All Products", "Add New Product", "Categories", "Discounts"],
    Inventory: ["Stock Levels", "Suppliers", "Purchase Orders", "Warehouses"],
    Orders: ["All Orders", "Pending", "Processing", "Completed", "Returns"],
    Customers: ["Customer List", "Segments", "Loyalty Program"],
    Reviews: ["All Reviews", "Pending Approval", "Reported"],
    Grievances: ["Active Tickets", "Resolved", "Automated Responses"],
    Blogs: [
      "Blog Analytics",
      "Pending Approval",
      "Published Blogs",
      "Push Blogs",
      "Authors",
    ],
    "Staff Management": ["All Staff", "Roles & Permissions", "Activity Logs"],
  };

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [activeSubTab, setActiveSubTab] = useState("Overview");

  // Helper arrays for your components to consume cleanly
  const navLinkNames = navRegistry.map((item) => item.name);

  // 2. URL SYNC (Reads real-time location to keep UI tabs active)
  useEffect(() => {
    // Check if we are physically on an standalone page route like blogs
    const matchedRegistryItem = navRegistry.find(
      (item) => item.isExternalPage && location.pathname.startsWith(item.path),
    );

    if (matchedRegistryItem) {
      setActiveTab(matchedRegistryItem.name);
      // Fallback fallback default layout sub-tab if none selected
      if (!activeSubTab)
        setActiveSubTab(sidebarSubLinks[matchedRegistryItem.name][0]);
    } else if (tab) {
      // Map back standard lowercase url params to UI Title Strings
      const cleanTabName = navLinkNames.find(
        (n) => n.toLowerCase().replace(/\s+/g, "-") === tab,
      );
      if (cleanTabName) {
        setActiveTab(cleanTabName);

        if (subTab) {
          const cleanSubName = sidebarSubLinks[cleanTabName].find(
            (s) => s.toLowerCase().replace(/\s+/g, "-") === subTab,
          );
          if (cleanSubName) setActiveSubTab(cleanSubName);
        }
      }
    }
  }, [location.pathname, tab, subTab]);

  // 3. CENTRALIZED ROUTING HANDLER
  const handleTabChange = (tabName) => {
    const targetRoute = navRegistry.find((item) => item.name === tabName);

    if (!targetRoute) return;

    if (targetRoute.isExternalPage) {
      setActiveTab(tabName);
      setActiveSubTab(sidebarSubLinks[tabName][0]);
      navigate(targetRoute.path);
    } else {
      // Format pretty, SEO-friendly parameters automatically: "Staff Management" -> "staff-management"
      const urlTab = tabName.toLowerCase().replace(/\s+/g, "-");
      const firstSubTab = sidebarSubLinks[tabName][0];
      const urlSubTab = firstSubTab.toLowerCase().replace(/\s+/g, "-");

      setActiveTab(tabName);
      setActiveSubTab(firstSubTab);
      navigate(`/admin/dashboard/${urlTab}/${urlSubTab}`);
    }
  };

  // Safe callback modification for internal sidebar link clicks
  const handleSubTabChange = (subTabName) => {
    setActiveSubTab(subTabName);
    const urlTab = activeTab.toLowerCase().replace(/\s+/g, "-");
    const urlSubTab = subTabName.toLowerCase().replace(/\s+/g, "-");

    // Check if the current layout module handles sub tabs natively or needs route paths updated
    const currentRoute = navRegistry.find((item) => item.name === activeTab);
    if (currentRoute && !currentRoute.isExternalPage) {
      navigate(`/admin/dashboard/${urlTab}/${urlSubTab}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12 pt-0">
      <AdminHeader
        navLinks={navLinkNames}
        activeTab={activeTab}
        handleTabChange={handleTabChange}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex flex-col md:flex-row gap-8">
        <AdminSidebar
          activeTab={activeTab}
          activeSubTab={activeSubTab}
          setActiveSubTab={handleSubTabChange}
          sidebarSubLinks={sidebarSubLinks}
        />

        <main className="flex-1 space-y-6 overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl font-serif font-medium text-slate-800">
              {activeTab} —{" "}
              <span className="text-sm font-sans text-slate-500 font-normal">
                {activeSubTab}
              </span>
            </h1>
            <div className="text-sm text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
              Last updated: Just now
            </div>
          </div>

          {/* DYNAMIC COMPONENT LOADER PLACEHOLDER */}
          {/* In the future, you can conditionally render separate dashboard modules right here cleanly */}
          {activeTab === "Dashboard" && (
            <>
              <div className="w-full">
                <KpiCardsPlaceholder />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <ChartPlaceholder />
                </div>
                <div className="lg:col-span-1">
                  <TablePlaceholder />
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <RecentOrdersPlaceholder />
                </div>
                <div className="lg:col-span-1">
                  <RecentMessagesPlaceholder />
                </div>
              </div>
            </>
          )}

          {/* Products Workspace Workspace Container */}
          {activeTab === "Blogs" && (
            <BlogsWorkspace activeSubTab={activeSubTab} />
          )}
        </main>
      </div>
    </div>
  );
}

// ==========================================
// PLACEHOLDER COMPONENTS
// ==========================================

function KpiCardsPlaceholder() {
  const kpis = [
    { title: "Total Revenue", value: "$45,231.89", trend: "+20.1%" },
    { title: "Active Orders", value: "1,204", trend: "+12.5%" },
    { title: "New Customers", value: "324", trend: "+5.4%" },
    { title: "Pending Grievances", value: "12", trend: "-2.1%" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, idx) => (
        <div
          key={idx}
          className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
        >
          <h3 className="text-sm font-medium text-slate-500 mb-1">
            {kpi.title}
          </h3>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-semibold text-slate-800">
              {kpi.value}
            </span>
          </div>
          <p
            className={`text-xs font-medium mt-3 ${
              kpi.trend.startsWith("+") ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {kpi.trend} from last month
          </p>
        </div>
      ))}
    </div>
  );
}

function ChartPlaceholder() {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm h-full min-h-[350px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-slate-800">
          Revenue Analytics
        </h2>
        <button className="text-sm text-slate-500 hover:text-slate-900 border border-slate-200 px-3 py-1 rounded-md">
          This Year
        </button>
      </div>
      <div className="flex-1 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center bg-slate-50/50">
        <span className="text-slate-400 font-medium">
          Chart Component Placeholder
        </span>
      </div>
    </div>
  );
}

function TablePlaceholder() {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm h-full min-h-[350px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-slate-800">Top Products</h2>
      </div>
      <div className="flex-1 flex flex-col gap-3">
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-slate-200 animate-pulse"></div>
              <div>
                <div className="h-4 w-24 bg-slate-200 rounded mb-1.5 animate-pulse"></div>
                <div className="h-3 w-16 bg-slate-100 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="h-4 w-12 bg-slate-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentOrdersPlaceholder() {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm h-full min-h-[400px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-slate-800">Recent Orders</h2>
        <button className="text-sm text-emerald-600 font-medium hover:text-emerald-700">
          View All
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-sm text-slate-500">
              <th className="pb-3 font-medium">Order ID</th>
              <th className="pb-3 font-medium">Customer</th>
              <th className="pb-3 font-medium">Date</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-700">
            {[1, 2, 3, 4, 5].map((row) => (
              <tr
                key={row}
                className="border-b border-slate-50 last:border-none"
              >
                <td className="py-4 font-medium text-slate-900">
                  #ORD-{8923 + row}
                </td>
                <td className="py-4">John Doe</td>
                <td className="py-4 text-slate-500">Oct {10 + row}, 2023</td>
                <td className="py-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                    Delivered
                  </span>
                </td>
                <td className="py-4 text-right font-medium">$124.00</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RecentMessagesPlaceholder() {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm h-full min-h-[400px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-slate-800">
          Recent Grievances
        </h2>
      </div>
      <div className="flex-1 flex flex-col gap-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="flex gap-4 items-start border-b border-slate-50 pb-4 last:border-none last:pb-0"
          >
            <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold text-sm shrink-0">
              A
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-800">
                Delayed Delivery
              </h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                My order was supposed to arrive yesterday but I haven't received
                any updates on the tracking portal...
              </p>
              <span className="text-[10px] font-medium text-slate-400 mt-2 block uppercase tracking-wider">
                2 hours ago
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
