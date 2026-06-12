// src/pages/Admin/Admin/StaffComps/RoleMgmnt.jsx
import React, { useState, useEffect } from "react";
import { getRoles, createRole, deleteRole } from "../../../../api/userApi";

import EatpurTable from "../UniComps/Table";
import Modal from "../UniComps/Modal";
import MagicButton from "../UniComps/MagicButton";
import Badge from "../UniComps/Badge";

export default function RoleMgmnt() {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newRoleName, setNewRoleName] = useState("");

    // Table Columns Setup
    const roleColumns = [
        { header: "ID", accessor: "displayId" },
        { header: "Role Name", accessor: "roleBadge" },
        { header: "Created On", accessor: "formattedDate" },
        { header: "Actions", accessor: "customActions" },
    ];

    const fetchRolesData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getRoles();

            const rawRoles = response.results || response.data || response || [];

            const processedRoles = rawRoles.map((role) => ({
                ...role,
                displayId: role.id ? `#ROL-${role.id}` : "—",
                roleBadge: <Badge text={role.role_name} type="eatpur" />,
                formattedDate: role.created_at
                    ? new Date(role.created_at).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    })
                    : "—",
                customActions: (
                    <div className="flex justify-end pr-4">
                        <MagicButton
                            variant="danger"
                            className="!min-w-[6em] !h-[2em] !text-[11px]"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteRole(role.id);
                            }}
                        >
                            Delete
                        </MagicButton>
                    </div>
                ),
            }));

            setRoles(processedRoles);
        } catch (err) {
            console.error("Error fetching roles:", err);
            setError("Failed to load roles list. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRolesData();
    }, []);

    // Handlers
    const handleCreateRole = async () => {
        if (!newRoleName.trim()) return;

        setIsSubmitting(true);
        try {
            // Sending role_name formatted cleanly to the backend
            await createRole({ role_name: newRoleName.trim().toUpperCase() });
            setIsModalOpen(false);
            setNewRoleName("");
            fetchRolesData(); // Refresh the table
        } catch (err) {
            console.error("Error creating role:", err);
            alert(
                "Failed to create role. It may already exist or you might not have the correct permissions (role_id=5)."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteRole = async (roleId) => {
        if (
            !window.confirm(
                "Are you absolutely sure you want to delete this role? Users assigned to this role might be affected."
            )
        ) {
            return;
        }

        try {
            await deleteRole(roleId);
            fetchRolesData(); // Refresh the table
        } catch (err) {
            console.error("Error deleting role:", err);
            alert("Failed to delete the role. Please check your permissions.");
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2
                        className="text-2xl font-medium text-[--color-eatpur-dark]"
                        style={{ fontFamily: "var(--font-display, serif)" }}
                    >
                        System Roles
                    </h2>
                    <p className="text-sm text-[--color-eatpur-text-light] mt-1">
                        Manage global role definitions and authorization layers.
                    </p>
                </div>
                <div>
                    <MagicButton variant="eatpur" onClick={() => setIsModalOpen(true)}>
                        + Create New Role
                    </MagicButton>
                </div>
            </div>

            {/* Error Feedback */}
            {error && (
                <div className="p-4 rounded-xl border border-rose-100 bg-rose-50 text-rose-800 text-sm flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span>⚠️</span>
                        <p>{error}</p>
                    </div>
                    <button
                        onClick={fetchRolesData}
                        className="text-xs font-semibold underline uppercase tracking-wider hover:text-rose-900"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Table Loading State */}
            {loading ? (
                <div className="w-full rounded-xl border border-[--color-eatpur-yellow-light] bg-white overflow-hidden shadow-sm">
                    <div className="h-12 bg-[--color-eatpur-white-warm] border-b border-[--color-eatpur-yellow-light] flex items-center px-6">
                        <div className="h-4 w-1/4 bg-slate-200 rounded animate-pulse"></div>
                    </div>
                    <div className="p-6 space-y-4">
                        {[1, 2, 3].map((idx) => (
                            <div
                                key={idx}
                                className="flex items-center justify-between py-2 border-b border-slate-50 last:border-none"
                            >
                                <div className="h-4 w-1/5 bg-slate-100 rounded animate-pulse"></div>
                                <div className="h-8 w-20 bg-slate-200 rounded-md animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="w-full">
                    <EatpurTable
                        columns={roleColumns}
                        data={roles}
                        showActions={false} // Disabled native actions as we use customActions column mapping
                    />
                </div>
            )}

            {/* CREATE NEW ROLE MODAL */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setNewRoleName("");
                }}
                title="Create System Role"
                description="Define a new operational role. Note: This will be converted to UPPERCASE internally."
                footer={
                    <div className="flex justify-end gap-3 w-full">
                        <button
                            onClick={() => {
                                setIsModalOpen(false);
                                setNewRoleName("");
                            }}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <MagicButton
                            variant="eatpur"
                            onClick={handleCreateRole}
                            disabled={!newRoleName.trim() || isSubmitting}
                            className="!min-w-[8em]"
                        >
                            {isSubmitting ? "Creating..." : "Confirm Create"}
                        </MagicButton>
                    </div>
                }
            >
                <div className="mt-2 mb-4">
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                        Role Name *
                    </label>
                    <input
                        type="text"
                        value={newRoleName}
                        onChange={(e) => setNewRoleName(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:border-[--color-eatpur-green-dark] focus:ring-1 focus:ring-[--color-eatpur-green-dark] transition-all bg-gray-50 uppercase"
                        placeholder="e.g., INVENTORY_MANAGER"
                        autoFocus
                    />
                </div>
            </Modal>
        </div>
    );
}