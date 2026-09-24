// src/pages/Admin/Admin/Orders.jsx
import React from "react";
import AllOrders from "./OrderComps/AllOrders";
import NewOrders from "./OrderComps/NewOrders";

export default function OrdersWorkspace({ activeSubTab }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[500px]">
      {activeSubTab === "All Orders" && <AllOrders />}
    </div>
  );
}
