// src/pages/Admin/Admin/Transactions.jsx
import React from "react";
import Overview from "./TransComps/Overview";
import TransList from "./TransComps/TransList";

export default function TransactionsWorkspace({ activeSubTab }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[500px]">
      {activeSubTab === "Overview" && <Overview />}
      {activeSubTab === "Transaction List" && <TransList />}
    </div>
  );
}
