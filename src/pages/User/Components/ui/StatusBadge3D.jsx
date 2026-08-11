// src/pages/User/Components/ui/StatusBadge3D.jsx
import React from "react";

export default function StatusBadge3D({ status }) {
  // Normalize string for safety
  const safeStatus = (status || "").toString().toLowerCase();

  // Define color mappings based on status keyword
  let colors = "bg-slate-100 text-slate-600 border-slate-300"; // Default

  if (["success", "completed", "delivered", "active"].includes(safeStatus)) {
    colors =
      "bg-[--color-eatpur-green-light] text-[--color-eatpur-dark] border-[--color-eatpur-green-dark]";
  } else if (["pending", "processing", "ongoing"].includes(safeStatus)) {
    colors = "bg-amber-200 text-amber-900 border-amber-500";
  } else if (
    ["failed", "cancelled", "returned", "expired"].includes(safeStatus)
  ) {
    colors = "bg-rose-200 text-rose-900 border-rose-500";
  } else if (["draft", "drafts"].includes(safeStatus)) {
    colors = "bg-slate-200 text-slate-700 border-slate-400";
  }

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border-b-[3px] ${colors}`}
    >
      {status || "Unknown"}
    </span>
  );
}
