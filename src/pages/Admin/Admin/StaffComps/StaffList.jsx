// src/pages/Admin/Admin/StaffComps/StaffList.jsx
import React, { useState, useEffect } from "react";
import {
    getUsers,
    getUserDetail,
    getRoles,
    createUser,
    updateUser,
    deleteUser,
} from "../../../../api/userApi";

import EatpurTable from "../UniComps/Table";
import Modal from "../UniComps/Modal";
import MagicButton from "../UniComps/MagicButton";
import Badge from "../UniComps/Badge";

export default function StaffMgmnt({ activeSubTab }) {
    // --- STATE MANAGEMENT ---
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 15; // As defined in Django backend

    // Modal & Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create"); // 'create' | 'edit'
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    const initialFormState = {
        username: "",
        email: "",
        mobile: "",
        password: "", // Only required on create
        role: "", // role ID
        is_active: true,
        is_staff: false,
    };
    const [formData, setFormData] = useState(initialFormState);

    // --- DATA FETCHING ---
    const fetchUsersData = async (page = 1) => {
        try {
            setLoading(true);
            setError(null);
            const response = await getUsers(page);

            // Handle DRF standard paginated response { count, next, previous, results }
            const rawUsers = response.results || response.data || response || [];
            const count = response.count || rawUsers.length;

            // Process for EatpurTable
            const processedUsers = rawUsers.map((user) => {
                // Status Badge Mapping
                let statusBadge = user.is_active ? (
                    <Badge text="Active" type="success" />
                ) : (
                    <Badge text="Inactive" type="danger" />
                );

                if (user.is_deleted) {
                    statusBadge = <Badge text="Deleted" type="neutral" />;
                }

                // Role Badge Mapping
                const roleName = user.role?.role_name || "Unassigned";

                return {
                    ...user,
                    displayId: user.id ? `#USR-${user.id}` : "—",
                    roleText: <Badge text={roleName} type="eatpur" />,
                    statusText: statusBadge,
                    formattedDate: user.created_at
                        ? new Date(user.created_at).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        })
                        : "—",
                    customActions: (
                        <div className="flex justify-end pr-4">
                            <MagicButton
                                variant="primary"
                                className="!min-w-[6em] !h-[2em] !text-[11px]" // Tailored smaller for table row
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenEdit(user.id);
                                }}
                            >
                                Update
                            </MagicButton>
                        </div>
                    ),
                };
            });

            setUsers(processedUsers);
            setTotalItems(count);
            setTotalPages(Math.ceil(count / itemsPerPage) || 1);
            setCurrentPage(page);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError("Failed to load staff list. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const fetchRolesData = async () => {
        try {
            const response = await getRoles();
            const rawRoles = response.results || response.data || response || [];
            setRoles(rawRoles);
        } catch (err) {
            console.error("Error fetching roles:", err);
        }
    };

    useEffect(() => {
        // Only load All Staff if we are on the right sub-tab
        if (activeSubTab === "All Staff" || !activeSubTab) {
            fetchUsersData(currentPage);
            fetchRolesData();
        }
    }, [activeSubTab, currentPage]);

    // --- MODAL HANDLERS ---
    const handleOpenCreate = () => {
        setModalMode("create");
        setFormData(initialFormState);
        setSelectedUserId(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = async (userId) => {
        try {
            setIsModalOpen(true);
            setModalMode("edit");
            setSelectedUserId(userId);
            setFormData({ ...initialFormState, username: "Loading..." }); // Temporary UI feedback

            // Fetch ALL specific fields from the detailed endpoint
            const detailedUser = await getUserDetail(userId);

            setFormData({
                username: detailedUser.username || "",
                email: detailedUser.email || "",
                mobile: detailedUser.mobile || "",
                password: "", // Leave blank, only submit if they want to change it
                role: detailedUser.role?.id || "",
                is_active: detailedUser.is_active ?? true,
                is_staff: detailedUser.is_staff ?? false,
            });
        } catch (err) {
            console.error("Failed to fetch user details:", err);
            setIsModalOpen(false);
            alert("Failed to fetch user details.");
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => {
            setFormData(initialFormState);
            setSelectedUserId(null);
        }, 200); // Wait for modal fade-out animation
    };

    // --- FORM HANDLERS ---
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // Clean up payload (remove empty password on update)
            const payload = { ...formData };
            if (modalMode === "edit" && !payload.password) {
                delete payload.password;
            }
            // Ensure role is sent as null if empty, not empty string
            if (!payload.role) payload.role = null;

            if (modalMode === "create") {
                await createUser(payload);
            } else {
                await updateUser(selectedUserId, payload);
            }

            handleCloseModal();
            fetchUsersData(currentPage); // Refresh data
        } catch (err) {
            console.error(`Error during user ${modalMode}:`, err);
            alert(`Failed to ${modalMode} user. Check the console for details.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this account?")) return;
        setIsSubmitting(true);
        try {
            await deleteUser(selectedUserId);
            handleCloseModal();
            fetchUsersData(currentPage);
        } catch (err) {
            console.error("Error deleting user:", err);
            alert("Failed to delete user.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- TABLE COLUMNS ---
    const userColumns = [
        { header: "ID", accessor: "displayId" },
        { header: "Username", accessor: "username" },
        { header: "Email", accessor: "email" },
        { header: "Role", accessor: "roleText" },
        { header: "Status", accessor: "statusText" },
        { header: "Created", accessor: "formattedDate" },
        { header: "Actions", accessor: "customActions" },
    ];

    // Render a placeholder if not on the All Staff tab
    if (activeSubTab && activeSubTab !== "All Staff") {
        return (
            <div className="pt-32 text-center text-[--color-eatpur-gold-light] font-display text-3xl">
                {activeSubTab} Workspace Under Construction
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2
                        className="text-2xl font-medium text-[--color-eatpur-dark]"
                        style={{ fontFamily: "var(--font-display, serif)" }}
                    >
                        Staff Directory
                    </h2>
                    <p className="text-sm text-[--color-eatpur-text-light] mt-1">
                        Manage system access, assign roles, and update staff information.
                    </p>
                </div>
                <div>
                    <MagicButton variant="eatpur" onClick={handleOpenCreate}>
                        + Create New User
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
                        onClick={() => fetchUsersData(currentPage)}
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
                        {[1, 2, 3, 4, 5].map((idx) => (
                            <div
                                key={idx}
                                className="flex items-center justify-between py-2 border-b border-slate-50 last:border-none"
                            >
                                <div className="h-4 w-1/5 bg-slate-100 rounded animate-pulse"></div>
                                <div className="h-4 w-1/5 bg-slate-100 rounded animate-pulse"></div>
                                <div className="h-8 w-20 bg-slate-200 rounded-md animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="w-full">
                    <EatpurTable
                        columns={userColumns}
                        data={users}
                        showActions={false} // Using customActions column mapping instead
                    />

                    {/* Pagination UI */}
                    {users.length > 0 && totalPages > 1 && (
                        <div className="flex items-center justify-between px-5 py-4 bg-white border border-[--color-eatpur-yellow-light] rounded-xl mt-4 shadow-sm">
                            <div className="flex justify-between flex-1 sm:hidden">
                                <button
                                    onClick={() => fetchUsersData(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 text-sm font-medium border rounded-md disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() =>
                                        fetchUsersData(Math.min(totalPages, currentPage + 1))
                                    }
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 text-sm font-medium border rounded-md disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                <p className="text-sm text-[--color-eatpur-text]">
                                    Showing{" "}
                                    <span className="font-medium text-[--color-eatpur-green-dark]">
                                        {(currentPage - 1) * itemsPerPage + 1}
                                    </span>{" "}
                                    to{" "}
                                    <span className="font-medium text-[--color-eatpur-green-dark]">
                                        {Math.min(currentPage * itemsPerPage, totalItems)}
                                    </span>{" "}
                                    of <span className="font-medium">{totalItems}</span> results
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => fetchUsersData(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1.5 text-sm font-medium border border-[--color-eatpur-yellow-light] text-[--color-eatpur-dark] rounded hover:bg-slate-50 disabled:opacity-50 transition-colors"
                                    >
                                        Previous
                                    </button>
                                    <span className="px-3 py-1.5 text-sm font-medium bg-[--color-eatpur-white-warm] border border-[--color-eatpur-yellow-light] text-[--color-eatpur-green-dark] rounded shadow-inner">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() =>
                                            fetchUsersData(Math.min(totalPages, currentPage + 1))
                                        }
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1.5 text-sm font-medium border border-[--color-eatpur-yellow-light] text-[--color-eatpur-dark] rounded hover:bg-slate-50 disabled:opacity-50 transition-colors"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* CREATE / UPDATE MODAL */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={modalMode === "create" ? "Create New User" : "Update User"}
                description={
                    modalMode === "create"
                        ? "Enter the credentials and assign a role to the new staff member."
                        : "Modify existing credentials or alter the system role for this user."
                }
                maxWidth="max-w-2xl" // Slightly wider for grid layout
                footer={
                    <div className="flex justify-end gap-3 w-full">
                        {modalMode === "edit" && (
                            <div className="flex-1">
                                <button
                                    onClick={handleDelete}
                                    disabled={isSubmitting}
                                    className="px-4 py-2 text-sm font-medium text-rose-600 bg-rose-50 border border-rose-100 rounded-lg hover:bg-rose-100 transition-colors disabled:opacity-50"
                                >
                                    Delete Account
                                </button>
                            </div>
                        )}
                        <button
                            onClick={handleCloseModal}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <MagicButton
                            variant={modalMode === "create" ? "eatpur" : "primary"}
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="!min-w-[8em]"
                        >
                            {isSubmitting
                                ? "Saving..."
                                : modalMode === "create"
                                    ? "Create User"
                                    : "Save Changes"}
                        </MagicButton>
                    </div>
                }
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
                    {/* Username */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                            Username *
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:border-[--color-eatpur-green-dark] focus:ring-1 focus:ring-[--color-eatpur-green-dark] transition-all bg-gray-50"
                            placeholder="johndoe123"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                            Email Address *
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:border-[--color-eatpur-green-dark] focus:ring-1 focus:ring-[--color-eatpur-green-dark] transition-all bg-gray-50"
                            placeholder="john@eatpur.in"
                        />
                    </div>

                    {/* Mobile */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                            Mobile Number *
                        </label>
                        <input
                            type="text"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:border-[--color-eatpur-green-dark] focus:ring-1 focus:ring-[--color-eatpur-green-dark] transition-all bg-gray-50"
                            placeholder="+91 9876543210"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                            {modalMode === "create" ? "Password *" : "New Password"}
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:border-[--color-eatpur-green-dark] focus:ring-1 focus:ring-[--color-eatpur-green-dark] transition-all bg-gray-50"
                            placeholder={
                                modalMode === "create" ? "••••••••" : "Leave blank to keep same"
                            }
                        />
                    </div>

                    {/* Role Dropdown */}
                    <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                            System Role
                        </label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:border-[--color-eatpur-green-dark] focus:ring-1 focus:ring-[--color-eatpur-green-dark] transition-all bg-white"
                        >
                            <option value="">-- No Role Assigned --</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.role_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Toggles */}
                    <div className="md:col-span-2 flex gap-8 py-3 border-t border-gray-100 mt-2">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                name="is_active"
                                checked={formData.is_active}
                                onChange={handleInputChange}
                                className="w-4 h-4 text-[--color-eatpur-green-dark] bg-gray-100 border-gray-300 rounded focus:ring-[--color-eatpur-green-dark] cursor-pointer"
                            />
                            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                                Account Active
                            </span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                name="is_staff"
                                checked={formData.is_staff}
                                onChange={handleInputChange}
                                className="w-4 h-4 text-[--color-eatpur-green-dark] bg-gray-100 border-gray-300 rounded focus:ring-[--color-eatpur-green-dark] cursor-pointer"
                            />
                            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                                Admin Panel Access (is_staff)
                            </span>
                        </label>
                    </div>
                </div>
            </Modal>
        </div>
    );
}