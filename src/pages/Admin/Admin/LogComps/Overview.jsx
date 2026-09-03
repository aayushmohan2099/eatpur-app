// src\pages\Admin\Admin\LogComps\Overview.jsx
import React, { useState, useEffect } from "react";
import { getLogisticsOverview } from "../../../../api/logistics";
import {
  FaTruckFast,
  FaCheck,
  FaRoute,
  FaArrowRotateLeft,
  FaTriangleExclamation,
} from "react-icons/fa6";

export default function Overview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        const res = await getLogisticsOverview();
        setData(res.data || res); // Handle varied axios/fetch responses
      } catch (err) {
        console.error("Failed to load logistics overview:", err);
        setError("Unable to load Ekart logistics metrics.");
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-32 bg-slate-100 rounded-2xl"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200">
        {error}
      </div>
    );
  }

  const kpis = [
    {
      title: "Total Shipped",
      value: data?.total_shipped || 0,
      icon: <FaTruckFast className="text-blue-500" size={24} />,
      bg: "bg-blue-50",
    },
    {
      title: "Delivered",
      value: data?.delivered || 0,
      icon: <FaCheck className="text-emerald-500" size={24} />,
      bg: "bg-emerald-50",
    },
    {
      title: "In Transit",
      value: data?.in_transit || 0,
      icon: <FaRoute className="text-amber-500" size={24} />,
      bg: "bg-amber-50",
    },
    {
      title: "RTOs (Returned)",
      value: data?.rtos || 0,
      icon: <FaArrowRotateLeft className="text-rose-500" size={24} />,
      bg: "bg-rose-50",
    },
    {
      title: "Pending NDRs",
      value: data?.pending_ndrs || 0,
      icon: <FaTriangleExclamation className="text-orange-500" size={24} />,
      bg: "bg-orange-50",
    },
    {
      title: "Success Rate",
      value: `${data?.success_rate || 0}%`,
      icon: <FaCheck className="text-eatpur-green-dark" size={24} />,
      bg: "bg-green-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-medium text-slate-800 font-serif">
          Logistics Overview
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Real-time fulfillment metrics synced with Ekart Logistics.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between"
          >
            <div>
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">
                {kpi.title}
              </h3>
              <span className="text-3xl font-bold text-slate-800">
                {kpi.value}
              </span>
            </div>
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center ${kpi.bg}`}
            >
              {kpi.icon}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
