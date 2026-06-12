// src/pages/Admin/Admin/StaffMgmnt.jsx
import React from "react";
import StaffList from "./StaffComps/StaffList";
import RoleMgmnt from "./StaffComps/RoleMgmnt";

export default function StaffMgmnt({ activeSubTab }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      {activeSubTab === "All Staff" && <StaffList activeSubTab={activeSubTab} />}

      {activeSubTab === "Roles & Permissions" && <RoleMgmnt />}

      {activeSubTab === "Activity Logs" && (
        <div className="py-16 text-center">
          <p className="text-[--color-eatpur-gold-light] font-display text-3xl mb-2">
            Activity Logs
          </p>
          <p className="text-[--color-eatpur-text-light] text-sm">
            Workspace Under Construction
          </p>
        </div>
      )}
    </div>
  );
}