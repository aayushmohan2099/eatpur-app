// src/components/Announcement.jsx
import React, { useState, useEffect } from "react";
import { FaBullhorn, FaEdit, FaPlus, FaSave, FaTrash } from "react-icons/fa";
// Apne shop.js ka sahi path yahan dalein
import { 
  getAnnouncementList, 
  createAnnouncement, 
  updateAnnouncement, 
  deleteAnnouncement 
} from "../../../api/shop"; 

export default function Announcement() {
  // State for all announcements
  const [announcements, setAnnouncements] = useState([]);
  
  // State for form data (Create & Update)
  const [formData, setFormData] = useState({ id: null, title: "", message: "", is_active: true });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load announcements on mount
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const data = await getAnnouncementList();
      if (Array.isArray(data)) {
        setAnnouncements(data);
      }
    } catch (error) {
      console.error("Failed to fetch announcements:", error);
    }
  };

  // Handle Form Inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle Create & Update Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing) {
        await updateAnnouncement(formData.id, formData);
      } else {
        await createAnnouncement(formData);
      }
      // Reset form and refresh list
      resetForm();
      fetchAnnouncements();
    } catch (error) {
      console.error("Error saving announcement:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // Edit Button Click
  const handleEdit = (announcement) => {
    setFormData(announcement);
    setIsEditing(true);
  };

  // Delete Button Click
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      try {
        await deleteAnnouncement(id);
        fetchAnnouncements();
      } catch (error) {
        console.error("Error deleting announcement:", error);
      }
    }
  };

  // Reset form to default
  const resetForm = () => {
    setFormData({ id: null, title: "", message: "", is_active: true });
    setIsEditing(false);
  };

  return (
    <div className="w-full bg-slate-50/70 px-4 py-5 font-sans sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Announcements</h1>
            <p className="mt-1 text-sm text-slate-500">
              {announcements.length} {announcements.length === 1 ? "announcement" : "announcements"}
            </p>
          </div>
        </header>

        <div className="flex flex-col gap-5">
          <section className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-800">
                {isEditing ? "Edit announcement" : "New announcement"}
              </h2>
            </div>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-4 p-5"
            >
              <div>
                <label htmlFor="announcement-title" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Title
                </label>
                <input
                  id="announcement-title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-[#3A5A1C] focus:ring-2 focus:ring-[#3A5A1C]/15"
                  placeholder="e.g. Diwali Sale"
                />
              </div>

              <div>
                <label htmlFor="announcement-message" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Message
                </label>
                <textarea
                  id="announcement-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full resize-y rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-[#3A5A1C] focus:ring-2 focus:ring-[#3A5A1C]/15"
                  placeholder="Enter announcement text"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <label className="flex w-fit cursor-pointer items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="h-4 w-4 accent-[#3A5A1C]"
                  />
                  Active
                </label>
                <div className="flex flex-wrap gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded bg-[#3A5A1C] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#2f4917] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isEditing ? <FaSave aria-hidden="true" /> : <FaPlus aria-hidden="true" />}
                  {loading ? "Saving..." : isEditing ? "Save changes" : "Create announcement"}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="min-h-10 rounded border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                )}
                </div>
              </div>
            </form>
          </section>

          <section className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-800">All announcements</h2>
              <span className="text-sm tabular-nums text-slate-500">{announcements.length} total</span>
            </div>

            {announcements.length === 0 ? (
              <div className="flex min-h-32 flex-col items-center justify-center px-5 py-6 text-center">
                <FaBullhorn className="mb-3 text-2xl text-slate-300" aria-hidden="true" />
                <p className="text-sm font-medium text-slate-700">No announcements yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] border-collapse text-left">
                  <thead className="bg-slate-50">
                    <tr className="border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
                      <th className="px-4 py-3">Title</th>
                      <th className="px-4 py-3">Message</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {announcements.map((item) => (
                      <tr key={item.id} className="align-top transition hover:bg-slate-50/70">
                        <td className="max-w-44 px-4 py-3 text-sm font-medium text-slate-800">{item.title}</td>
                        <td className="max-w-md whitespace-normal break-words px-4 py-3 text-sm leading-5 text-slate-600">
                          {item.message}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${item.is_active ? "text-emerald-700" : "text-slate-500"}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${item.is_active ? "bg-emerald-500" : "bg-slate-400"}`} />
                            {item.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => handleEdit(item)}
                              className="rounded p-2 text-slate-500 transition hover:bg-slate-100 hover:text-[#3A5A1C]"
                              title="Edit announcement"
                              aria-label={`Edit ${item.title}`}
                            >
                              <FaEdit size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(item.id)}
                              className="rounded p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                              title="Delete announcement"
                              aria-label={`Delete ${item.title}`}
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}