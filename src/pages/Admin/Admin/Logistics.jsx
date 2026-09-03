// src\pages\Admin\Admin\Logistics.jsx
import React from "react";
import Overview from "./LogComps/Overview";
import Financials from "./LogComps/Financials";
import Audit from "./LogComps/Audit";
import Addresses from "./LogComps/Addresses";

export default function LogisticsWorkspace({ activeSubTab }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[500px]">
      {activeSubTab === "Overview" && <Overview />}
      {activeSubTab === "Financials" && <Financials />}
      {activeSubTab === "Saved Addresses" && <Addresses />}
      {activeSubTab === "Audit Logs" && <Audit />}
    </div>
  );
}
