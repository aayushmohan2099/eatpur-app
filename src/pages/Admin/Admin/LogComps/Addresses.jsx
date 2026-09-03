// src/pages/Admin/Admin/LogComps/Addresses.jsx
import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaLocationDot,
  FaPhone,
  FaBuilding,
  FaRotateRight,
} from "react-icons/fa6";
import { getEkartAddresses } from "../../../../api/logistics";
import AddAddress from "./Comps/AddAddress";
import AlertToast from "../UniComps/AlertToast";

export default function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchAddresses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getEkartAddresses();
      // Safely extract the array whether it's wrapped in 'data' or returned directly
      const data = res.data || res.results || res;
      setAddresses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load addresses:", err);
      setError("Failed to sync addresses from Ekart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  return (
    <div className="space-y-6 relative">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-medium text-slate-800 font-serif">
            Saved Warehouses & Pickups
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage locations registered with Ekart for dispatch and returns.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAddresses}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium disabled:opacity-50"
          >
            <FaRotateRight className={loading ? "animate-spin" : ""} />
            Sync
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-eatpur-green-dark text-white rounded-lg hover:bg-green-800 transition-colors text-sm font-medium shadow-sm"
          >
            <FaPlus /> Add Location
          </button>
        </div>
      </div>

      {error && <AlertToast type="error" message={error} />}

      {/* Content Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-48 bg-slate-100 rounded-2xl border border-slate-200"
            ></div>
          ))}
        </div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 border border-dashed border-slate-300 rounded-2xl">
          <FaBuilding className="mx-auto text-slate-300 mb-4" size={48} />
          <h3 className="text-lg font-medium text-slate-700">
            No Addresses Found
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            You haven't registered any pickup locations with Ekart yet.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-6 py-2 bg-eatpur-green-dark text-white rounded-lg text-sm font-medium shadow-sm"
          >
            Register First Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {addresses.map((addr) => (
            <div
              key={addr.id || addr.alias}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-[--color-eatpur-green-dark] transition-colors"
            >
              <div className="absolute right-0 top-0 w-2 h-full bg-[--color-eatpur-green-dark] opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-lg uppercase tracking-wider">
                  {addr.alias}
                </h3>
                <span className="text-[10px] font-bold bg-green-50 text-green-700 px-2 py-1 rounded">
                  ACTIVE
                </span>
              </div>

              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-start gap-3">
                  <FaLocationDot className="mt-1 shrink-0 text-[--color-eatpur-green-dark]" />
                  <p className="leading-relaxed">
                    {addr.address_line1}
                    {addr.address_line2 && (
                      <>
                        <br />
                        {addr.address_line2}
                      </>
                    )}
                    <br />
                    {addr.city && `${addr.city}, `}
                    {addr.state} -{" "}
                    <span className="font-mono font-bold text-slate-800">
                      {addr.pincode}
                    </span>
                    <br />
                    {addr.country}
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <FaPhone className="shrink-0 text-[--color-eatpur-green-dark]" />
                  <span className="font-mono">{addr.phone}</span>
                </div>

                {addr.latitude && addr.longitude && (
                  <div className="text-xs text-slate-400 font-mono mt-4 pt-4 border-t border-slate-50">
                    GPS: {addr.latitude}, {addr.longitude}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Address Modal Component */}
      <AddAddress
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          setIsAddModalOpen(false);
          fetchAddresses();
        }}
      />
    </div>
  );
}
