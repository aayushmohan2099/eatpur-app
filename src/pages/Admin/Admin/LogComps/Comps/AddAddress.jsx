// src/pages/Admin/Admin/LogComps/Comps/AddAddress.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaXmark } from "react-icons/fa6";
import { createEkartAddress } from "../../../../../api/logistics";

export default function AddAddress({ isOpen, onClose, onSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    alias: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    pincode: "",
    city: "",
    state: "",
    country: "India",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Restrict phone and pincode to numbers
    if (
      (name === "phone" || name === "pincode") &&
      value &&
      !/^\d+$/.test(value)
    )
      return;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Basic Validation
    if (formData.phone.length < 10) {
      setError("Phone number must be at least 10 digits.");
      return;
    }
    if (formData.pincode.length !== 6) {
      setError("Please enter a valid 6-digit Pincode.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createEkartAddress(formData);
      alert("Address successfully registered with Ekart!");
      setFormData({
        alias: "",
        phone: "",
        address_line1: "",
        address_line2: "",
        pincode: "",
        city: "",
        state: "",
        country: "India",
      });
      onSuccess(); // Trigger parent refresh
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Failed to register address. Alias might already exist.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl relative z-10 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div>
              <h3 className="text-xl font-bold text-slate-800 font-serif">
                Register New Location
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                This will be synced instantly with Ekart Logistics.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
            >
              <FaXmark />
            </button>
          </div>

          {/* Form Body */}
          <div className="p-6 overflow-y-auto hide-scrollbar">
            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                {error}
              </div>
            )}

            <form
              id="addAddressForm"
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Location Alias *
                  </label>
                  <input
                    required
                    type="text"
                    name="alias"
                    placeholder="e.g., Primary Warehouse"
                    value={formData.alias}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[--color-eatpur-green-dark] transition-colors"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Must be unique. Will be used in dispatch API.
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Phone Number *
                  </label>
                  <input
                    required
                    type="text"
                    name="phone"
                    maxLength={10}
                    placeholder="10 digit mobile"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[--color-eatpur-green-dark] transition-colors font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Address Line 1 *
                </label>
                <input
                  required
                  type="text"
                  name="address_line1"
                  placeholder="Building, Street, Area"
                  value={formData.address_line1}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[--color-eatpur-green-dark] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Address Line 2 (Optional)
                </label>
                <input
                  type="text"
                  name="address_line2"
                  placeholder="Landmark, locality"
                  value={formData.address_line2}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[--color-eatpur-green-dark] transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Pincode *
                  </label>
                  <input
                    required
                    type="text"
                    name="pincode"
                    maxLength={6}
                    value={formData.pincode}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[--color-eatpur-green-dark] transition-colors font-mono"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    City
                  </label>
                  <input
                    required
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[--color-eatpur-green-dark] transition-colors"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    State *
                  </label>
                  <input
                    required
                    type="text"
                    name="state"
                    placeholder="e.g. UP"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[--color-eatpur-green-dark] transition-colors uppercase"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    value="India"
                    readOnly
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="addAddressForm"
              disabled={isSubmitting}
              className="px-8 py-2.5 bg-eatpur-green-dark text-white text-sm font-bold rounded-lg shadow-sm hover:bg-green-800 transition-all disabled:opacity-50 disabled:cursor-wait flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Registering...
                </>
              ) : (
                "Save & Sync"
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
