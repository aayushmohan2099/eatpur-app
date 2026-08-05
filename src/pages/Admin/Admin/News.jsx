// src/pages/Admin/Admin/News.jsx
import React from "react";

export default function NewsWorkspace({ activeSubTab }) {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm min-h-[500px] flex flex-col">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-slate-800">
                    {activeSubTab === "Pending Approval" ? "Pending News Articles" : "Published News Articles"}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                    Manage, organize, and inspect all news content published or waiting for review.
                </p>
            </div>

            {/* Content Table Container matching your design style */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex-1 flex flex-col">
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase bg-slate-50/50">
                                <th className="py-3 px-4">ID</th>
                                <th className="py-3 px-4">Title</th>
                                <th className="py-3 px-4">Author</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4">Date Created</th>
                                <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-slate-700">
                            {/* Render dynamic rows or placeholder when empty */}
                            <tr>
                                <td colSpan="6" className="text-center py-16 text-slate-400 text-sm">
                                    No data records available to display for "{activeSubTab}".
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}