// src\pages\Admin\Admin\DashComps\HBList.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus,
  FaTrash,
  FaStar,
  FaRegStar,
  FaXmark,
  FaExpand,
} from "react-icons/fa6";
import {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from "../../../../api/authApi";
import MagicButton from "../UniComps/MagicButton";
import AlertToast from "../UniComps/AlertToast";
import Modal from "../UniComps/Modal";

export default function HBList() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals State
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add Form State
  const [formData, setFormData] = useState({
    title: "",
    display_order: 0,
    click_url: "",
    is_featured: true,
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await getBanners();
      const data = res.data || res.results || res;
      setBanners(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load banners.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleToggleFeatured = async (banner) => {
    try {
      const updatedStatus = !banner.is_featured;
      // Optimistic UI update
      setBanners(
        banners.map((b) =>
          b.id === banner.id ? { ...b, is_featured: updatedStatus } : b,
        ),
      );
      await updateBanner(banner.id, { is_featured: updatedStatus }, false);
    } catch (err) {
      alert("Failed to update status");
      fetchBanners(); // Revert on failure
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this banner?")) return;
    try {
      await deleteBanner(id);
      setBanners(banners.filter((b) => b.id !== id));
    } catch (err) {
      alert("Failed to delete banner.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) {
      alert("Please select an image.");
      return;
    }

    setIsSubmitting(true);
    const data = new FormData();
    data.append("title", formData.title);
    data.append("display_order", formData.display_order);
    data.append("is_featured", formData.is_featured);
    if (formData.click_url) data.append("click_url", formData.click_url);
    data.append("image", selectedImage);

    try {
      await createBanner(data);
      setIsAddOpen(false);
      setFormData({
        title: "",
        display_order: 0,
        click_url: "",
        is_featured: true,
      });
      setSelectedImage(null);
      setPreviewUrl(null);
      fetchBanners();
    } catch (err) {
      console.error(err);
      alert("Failed to upload banner.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 min-h-[500px]">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-5 rounded-2xl border border-slate-200 shadow-sm gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-[--color-eatpur-dark]">
            Homepage Banners
          </h2>
          <p className="text-sm text-slate-500">
            Manage slideshow images displayed on the customer storefront.
          </p>
        </div>
        <MagicButton variant="eatpur" onClick={() => setIsAddOpen(true)}>
          <FaPlus className="mr-2 inline" /> Add Banner
        </MagicButton>
      </div>

      {error && <AlertToast type="error" message={error} />}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-slate-200 rounded-2xl"></div>
          ))}
        </div>
      ) : banners.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-300">
          <p className="text-slate-500 font-medium">
            No banners uploaded yet. Add your first promotional banner!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {banners.map((banner) => (
              <motion.div
                key={banner.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group flex flex-col relative"
              >
                {/* Image Area */}
                <div
                  className="relative h-48 w-full cursor-pointer bg-slate-100 overflow-hidden"
                  onClick={() => {
                    setSelectedPreview(banner);
                    setIsPreviewOpen(true);
                  }}
                >
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <FaExpand className="text-white opacity-0 group-hover:opacity-100 text-3xl drop-shadow-md transition-opacity duration-300 transform scale-50 group-hover:scale-100" />
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    {banner.is_featured ? (
                      <span className="bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-md flex items-center gap-1">
                        <FaStar /> Live
                      </span>
                    ) : (
                      <span className="bg-slate-800 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-md flex items-center gap-1">
                        <FaRegStar /> Hidden
                      </span>
                    )}
                  </div>
                </div>

                {/* Info & Actions */}
                <div className="p-4 flex flex-col justify-between flex-1 bg-white relative z-10 border-t border-slate-100">
                  <div className="mb-4">
                    <h3
                      className="font-bold text-slate-800 truncate"
                      title={banner.title}
                    >
                      {banner.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 truncate">
                      {banner.click_url
                        ? `🔗 ${banner.click_url}`
                        : "No link attached"}
                    </p>
                    <p className="text-[10px] font-mono text-slate-400 mt-1">
                      Order Index: {banner.display_order}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
                    <button
                      onClick={() => handleToggleFeatured(banner)}
                      className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded transition-colors ${
                        banner.is_featured
                          ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                          : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                      }`}
                    >
                      {banner.is_featured ? "Hide Banner" : "Set as Featured"}
                    </button>

                    <button
                      onClick={() => handleDelete(banner.id)}
                      className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-full transition-colors"
                      title="Delete Banner"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* ========================================== */}
      {/* ADD BANNER MODAL                           */}
      {/* ========================================== */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Upload New Banner"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 pb-2">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Banner Title / Alt Text *
            </label>
            <input
              required
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[--color-eatpur-green-dark]"
              placeholder="e.g. Summer Millets Sale"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Image File *
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors relative cursor-pointer">
              <input
                required={!selectedImage}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="h-32 mx-auto object-cover rounded-lg shadow-sm"
                />
              ) : (
                <div className="text-slate-500 py-6">
                  <span className="text-3xl block mb-2">📸</span>
                  <span className="text-sm font-medium">
                    Click to upload image
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Display Order
              </label>
              <input
                type="number"
                min="0"
                value={formData.display_order}
                onChange={(e) =>
                  setFormData({ ...formData, display_order: e.target.value })
                }
                className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[--color-eatpur-green-dark]"
              />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="is_featured"
                checked={formData.is_featured}
                onChange={(e) =>
                  setFormData({ ...formData, is_featured: e.target.checked })
                }
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <label
                htmlFor="is_featured"
                className="text-sm font-bold text-slate-700 cursor-pointer"
              >
                Set as Featured
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Click URL (Optional)
            </label>
            <input
              type="url"
              value={formData.click_url}
              onChange={(e) =>
                setFormData({ ...formData, click_url: e.target.value })
              }
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[--color-eatpur-green-dark]"
              placeholder="https://eatpur.in/products"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
            <MagicButton variant="eatpur" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Uploading..." : "Save Banner"}
            </MagicButton>
          </div>
        </form>
      </Modal>

      {/* ========================================== */}
      {/* FULLSCREEN PREVIEW MODAL                   */}
      {/* ========================================== */}
      <AnimatePresence>
        {isPreviewOpen && selectedPreview && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-md cursor-zoom-out"
              onClick={() => setIsPreviewOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 max-w-5xl w-full"
            >
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="absolute -top-12 right-0 text-white hover:text-rose-400 transition-colors p-2 bg-black/20 rounded-full"
              >
                <FaXmark size={24} />
              </button>
              <img
                src={selectedPreview.image}
                alt={selectedPreview.title}
                className="w-full h-auto max-h-[85vh] object-contain rounded-lg shadow-2xl"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                <h2 className="text-white text-2xl font-bold font-display">
                  {selectedPreview.title}
                </h2>
                {selectedPreview.click_url && (
                  <p className="text-blue-300 text-sm mt-1">
                    {selectedPreview.click_url}
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
