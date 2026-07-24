// src/pages/Admin/Admin/Dashboard.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import AdminHeader from "./DashComps/AdminHeader";
import AdminSidebar from "./DashComps/AdminSidebar";

// Workspaces
import BlogsWorkspace from "./Blogs";
import StaffMgmnt from "./StaffMgmnt";
import ProductsWorkspace from "./Products";
import StockMgmnt from "./StockMgmnt";
import NewsWorkspace from "./News";

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
      name: "News", // <-- 2. Added News to Registry
      path: "/admin/dashboard/news/",
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
    Inventory: ["Stock Levels", "Warehouses"],
    Orders: ["All Orders", "New Orders", "Processing", "Completed", "Returns"],
    Customers: ["Customer List", "Customer Segments", "Loyalty Program"],
    Reviews: ["All Reviews", "Pending Approval", "Reported"],
    Grievances: ["Active Tickets", "Resolved", "Automated Responses"],
    Blogs: [
      "Blog Analytics",
      "Pending Approval",
      "Published Blogs",
      "Push Blogs",
      "Authors",
    ],
    News: [
      "Published news",
    ],
    "Staff Management": ["All Staff", "Roles & Permissions", "Activity Logs"],
  };

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [activeSubTab, setActiveSubTab] = useState("Overview");

  // Helper arrays for your components to consume cleanly
  const navLinkNames = navRegistry.map((item) => item.name);

  // 2. URL SYNC (Reads real-time location to keep UI tabs active)
  // useEffect(() => {
  //   // Check if we are physically on an standalone page route like blogs
  //   const matchedRegistryItem = navRegistry.find(
  //     (item) => item.isExternalPage && location.pathname.startsWith(item.path),
  //   );

  //   if (matchedRegistryItem) {
  //     setActiveTab(matchedRegistryItem.name);
  //     // Fallback fallback default layout sub-tab if none selected
  //     if (!activeSubTab)
  //       setActiveSubTab(sidebarSubLinks[matchedRegistryItem.name][0]);
  //   } else if (tab) {
  //     // Map back standard lowercase url params to UI Title Strings
  //     const cleanTabName = navLinkNames.find(
  //       (n) => n.toLowerCase().replace(/\s+/g, "-") === tab,
  //     );
  //     if (cleanTabName) {
  //       setActiveTab(cleanTabName);

  //       if (subTab) {
  //         const cleanSubName = sidebarSubLinks[cleanTabName].find(
  //           (s) => s.toLowerCase().replace(/\s+/g, "-") === subTab,
  //         );
  //         if (cleanSubName) setActiveSubTab(cleanSubName);
  //       }
  //     }
  //   }
  // }, [location.pathname, tab, subTab]);

  // 2. URL SYNC (Reads real-time location to keep UI tabs active)
  useEffect(() => {
    const matchedRegistryItem = navRegistry.find(
      (item) => item.isExternalPage && location.pathname.startsWith(item.path),
    );

    if (matchedRegistryItem) {
      setActiveTab(matchedRegistryItem.name);
      if (!activeSubTab && sidebarSubLinks[matchedRegistryItem.name]) {
        setActiveSubTab(sidebarSubLinks[matchedRegistryItem.name][0]);
      }
    } else if (tab) {
      const cleanTabName = navLinkNames.find(
        (n) => n.toLowerCase().replace(/\s+/g, "-") === tab,
      );
      if (cleanTabName) {
        setActiveTab(cleanTabName);

        if (subTab) {
          // Safe lookup using optional chaining (?.)
          const cleanSubName = sidebarSubLinks[cleanTabName]?.find(
            (s) => s.toLowerCase().replace(/\s+/g, "-") === subTab,
          );
          if (cleanSubName) setActiveSubTab(cleanSubName);
        }
      }
    }
  }, [location.pathname, tab, subTab]);

  // 3. CENTRALIZED ROUTING HANDLER
  // const handleTabChange = (tabName) => {
  //   const targetRoute = navRegistry.find((item) => item.name === tabName);

  //   if (!targetRoute) return;

  //   if (targetRoute.isExternalPage) {
  //     setActiveTab(tabName);
  //     setActiveSubTab(sidebarSubLinks[tabName][0]);
  //     navigate(targetRoute.path);
  //   } else {
  //     // Format pretty, SEO-friendly parameters automatically: "Staff Management" -> "staff-management"
  //     const urlTab = tabName.toLowerCase().replace(/\s+/g, "-");
  //     const firstSubTab = sidebarSubLinks[tabName][0];
  //     const urlSubTab = firstSubTab.toLowerCase().replace(/\s+/g, "-");

  //     setActiveTab(tabName);
  //     setActiveSubTab(firstSubTab);
  //     navigate(`/admin/dashboard/${urlTab}/${urlSubTab}`);
  //   }
  // };

  // Safe callback modification for internal sidebar link clicks
  // const handleSubTabChange = (subTabName) => {
  //   setActiveSubTab(subTabName);
  //   const urlTab = activeTab.toLowerCase().replace(/\s+/g, "-");
  //   const urlSubTab = subTabName.toLowerCase().replace(/\s+/g, "-");

  //   // Check if the current layout module handles sub tabs natively or needs route paths updated
  //   const currentRoute = navRegistry.find((item) => item.name === activeTab);
  //   if (currentRoute && !currentRoute.isExternalPage) {
  //     navigate(`/admin/dashboard/${urlTab}/${urlSubTab}`);
  //   }
  // };

  const handleTabChange = (tabName) => {
    const targetRoute = navRegistry.find((item) => item.name === tabName);

    if (!targetRoute) return;

    if (targetRoute.isExternalPage) {
      setActiveTab(tabName);
      if (sidebarSubLinks[tabName]) {
        setActiveSubTab(sidebarSubLinks[tabName][0]);
      }
      navigate(targetRoute.path);
    } else {
      // Format pretty, SEO-friendly parameters automatically: "Staff Management" -> "staff-management"
      const urlTab = tabName.toLowerCase().replace(/\s+/g, "-");
      const firstSubTab = sidebarSubLinks[tabName] ? sidebarSubLinks[tabName][0] : "overview";
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
            <div className="text-sm text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
              Last updated: Just now
            </div>
          </div>

          {/* DYNAMIC COMPONENT LOADER PLACEHOLDER */}
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
          {activeTab === "Products" && (
            <ProductsWorkspace activeSubTab={activeSubTab} />
          )}
          {activeTab === "Inventory" && (
            <StockMgmnt activeSubTab={activeSubTab} />
          )}
          {/* Blogs Workspace Workspace Container */}
          {activeTab === "Blogs" && (
            <BlogsWorkspace activeSubTab={activeSubTab} />
          )}

          {/* Staff Management Workspace Container */}
          {activeTab === "Staff Management" && (
            <StaffMgmnt activeSubTab={activeSubTab} />
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
            className={`text-xs font-medium mt-3 ${kpi.trend.startsWith("+") ? "text-emerald-600" : "text-rose-600"
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
  const [exactDate, setExactDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["Ready to Cook", "Ready to Eat", "Cookies", "Muesli"];

  const rawOrders = [
    { id: 8924, customer: "John Doe", date: "2026-06-15", category: "Ready to Cook", status: "Delivered", amount: "$124.00" },
    { id: 8925, customer: "Sarah Smith", date: "2026-06-18", category: "Ready to Eat", status: "Delivered", amount: "$89.50" },
    { id: 8926, customer: "Michael Brown", date: "2026-07-01", category: "Cookies", status: "Delivered", amount: "$210.00" },
    { id: 8927, customer: "Emily Davis", date: "2026-07-10", category: "Muesli", status: "Delivered", amount: "$54.20" },
    { id: 8928, customer: "David Wilson", date: "2026-07-20", category: "Ready to Cook", status: "Delivered", amount: "$145.00" },
  ];

  const filteredOrders = useMemo(() => {
    return rawOrders.filter((order) => {
      const matchesCategory = selectedCategory === "all" || order.category === selectedCategory;

      let matchesDate = true;
      if (exactDate) {
        matchesDate = order.date === exactDate;
      } else if (startDate && endDate) {
        matchesDate = order.date >= startDate && order.date <= endDate;
      } else if (startDate) {
        matchesDate = order.date >= startDate;
      } else if (endDate) {
        matchesDate = order.date <= endDate;
      }

      return matchesCategory && matchesDate;
    });
  }, [exactDate, startDate, endDate, selectedCategory, rawOrders]);

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm h-full min-h-[400px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-slate-800">Recent Orders</h2>
        <button className="text-sm text-emerald-600 font-medium hover:text-emerald-700">
          View All
        </button>
      </div>

      {/* Embedded Sales & Category Filters Toolbar */}
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mb-6 flex flex-wrap gap-4 items-end justify-between">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Exact Date Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase">Exact Date</label>
            <input
              type="date"
              value={exactDate}
              onChange={(e) => {
                setExactDate(e.target.value);
                setStartDate("");
                setEndDate("");
              }}
              className="bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3A5A1C]"
            />
          </div>

          {/* Date Range - Start */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setExactDate("");
              }}
              className="bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3A5A1C]"
            />
          </div>

          {/* Date Range - End */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setExactDate("");
              }}
              className="bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3A5A1C]"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3A5A1C] cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {(exactDate || startDate || endDate || selectedCategory !== "all") && (
          <button
            onClick={() => {
              setExactDate("");
              setStartDate("");
              setEndDate("");
              setSelectedCategory("all");
            }}
            className="text-xs font-medium text-slate-500 hover:text-slate-800 border border-dashed border-slate-300 px-3 py-1.5 rounded-md transition-colors"
          >
            Reset Filters
          </button>
        )}
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-sm text-slate-500">
              <th className="pb-3 font-medium">Order ID</th>
              <th className="pb-3 font-medium">Customer</th>
              <th className="pb-3 font-medium">Category</th>
              <th className="pb-3 font-medium">Date</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-700">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-slate-50 last:border-none"
                >
                  <td className="py-4 font-medium text-slate-900">
                    #ORD-{row.id}
                  </td>
                  <td className="py-4">{row.customer}</td>
                  <td className="py-4">
                    <span className="px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-600 border border-slate-200">
                      {row.category}
                    </span>
                  </td>
                  <td className="py-4 text-slate-500">{row.date}</td>
                  <td className="py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                      {row.status}
                    </span>
                  </td>
                  <td className="py-4 text-right font-medium">{row.amount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-8 text-slate-400 text-sm">
                  No orders match your specified date filters or category.
                </td>
              </tr>
            )}
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