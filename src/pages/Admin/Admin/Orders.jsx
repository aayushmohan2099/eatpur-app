// src/pages/Admin/Admin/Orders.jsx
import React from "react";
import AllOrders from "./OrderComps/AllOrders";
import NewOrders from "./OrderComps/NewOrders";

export default function OrdersWorkspace({ activeSubTab }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[500px]">
      {activeSubTab === "All Orders" && <AllOrders />}

      {activeSubTab === "New Orders" && <NewOrders />}

      {activeSubTab === "Processing" && (
        <AllOrders
          defaultFulfillmentStatus="PROCESSING"
          title="Processing Orders"
          subtitle="Orders currently being handled by Ekart Logistics."
        />
      )}

      {activeSubTab === "Completed" && (
        <AllOrders
          defaultFulfillmentStatus="DELIVERED"
          title="Completed Orders"
          subtitle="Successfully delivered orders."
        />
      )}

      {activeSubTab === "Returns" && (
        <AllOrders
          defaultIsReturned="true"
          title="Returned Orders (RTO)"
          subtitle="Orders that were returned to origin."
        />
      )}
    </div>
  );
}
