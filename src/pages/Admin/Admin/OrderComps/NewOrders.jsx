// src\pages\Admin\Admin\OrderComps\NewOrders.jsx
import React, { useState, useEffect } from "react";
import AllOrders from "./AllOrders";
import { getAdminOrderStats } from "../../../../api/shop";

export default function NewOrders() {
  const [pendingCount, setPendingCount] = useState("...");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getAdminOrderStats();
        // Extract PAID and UNFULFILLED from the matrix
        const data = res.data || res;
        const unfulfilledPaid =
          data.status_matrix?.PAID?.fulfillment_breakdown?.UNFULFILLED?.count ||
          0;
        setPendingCount(unfulfilledPaid);
      } catch (err) {
        console.error("Failed to fetch order stats", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Kanban / Pipeline Header Specific to New Orders */}
      <div className="bg-gradient-to-r from-[--color-eatpur-green-dark] to-emerald-800 rounded-2xl p-6 text-white shadow-lg flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold font-serif mb-1">
            Action Required
          </h2>
          <p className="text-black text-sm">
            These orders have been paid and are waiting to be dispatched to
            Ekart.
          </p>
        </div>
        <div className="bg-white/20 px-6 py-3 rounded-xl backdrop-blur-sm border border-white/30 text-center">
          <div className="text-4xl font-bold">{pendingCount}</div>
          <div className="text-xs uppercase tracking-widest mt-1 font-semibold text-emerald-50">
            Pending Dispatch
          </div>
        </div>
      </div>

      {/* Reusing AllOrders with strict filters to only show Actionable New Orders */}
      <AllOrders
        defaultPaymentStatus="PAID"
        defaultFulfillmentStatus="UNFULFILLED"
        title="Fulfillment Queue"
        subtitle="Review and dispatch these orders."
      />
    </div>
  );
}
