// src/pages/Admin/Admin/CreateCoupon.jsx
import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";
import {
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getCouponList
} from "../../../api/shop.js"; 

export default function CreateCoupon() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const initialFormState = {
    coupon_code: "",
    description: "",
    start_date: "",
    expire_date: "",
    discount_type: "percentage",
    discount_value: "",
    min_order_value: "", // Added
    is_auto_apply: false, // Added
  };

  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCouponsData();
  }, []);

  const fetchCouponsData = async () => {
    setLoading(true);
    try {
      const data = await getCouponList();
      setCoupons(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      setError("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "discount_type") {
      setFormData((prev) => ({ 
        ...prev, 
        [name]: value,
        is_auto_apply: value === "flat" ? true : false 
      }));
    } else {
      setFormData((prev) => ({ 
        ...prev, 
        [name]: type === 'checkbox' ? checked : value 
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const couponPayload = {
        coupon_code: formData.coupon_code.trim().toUpperCase(),
        description: formData.description,
        start_date: formData.start_date
          ? `${formData.start_date}T00:00:00`
          : "",
        discount_value: formData.discount_value,
        min_order_value: formData.min_order_value,
        is_auto_apply: formData.is_auto_apply,
        status_name: "ONGOING",
        end_date: formData.expire_date
          ? `${formData.expire_date}T23:59:59`
          : "",
        discount_type:
          formData.discount_type === "flat"
            ? "FLAT"
            : "PERCENT",
      };

      if (editingId) {
        await updateCoupon(editingId, couponPayload);
        alert("Coupon updated successfully!");
      } else {
        await createCoupon(couponPayload);
        alert("Coupon created successfully!");
      }

      setFormData(initialFormState);
      setEditingId(null);
      fetchCouponsData();
    } catch (err) {
      setError(err.message || "Something went wrong saving the coupon.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (coupon) => {
    setEditingId(coupon.id);
    setFormData({
      coupon_code: coupon.coupon_code,
      description: coupon.description,
      start_date: coupon.start_date ? coupon.start_date.split("T")[0] : "",
      expire_date: (coupon.end_date || coupon.expire_date)
        ? (coupon.end_date || coupon.expire_date).split("T")[0]
        : "",
      discount_type:
        coupon.discount_type === "FLAT"
          ? "flat"
          : "percentage",
      discount_value: coupon.discount_value,
      min_order_value: coupon.min_order_value || "",
      is_auto_apply: coupon.is_auto_apply || false,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      try {
        await deleteCoupon(id);
        fetchCouponsData();
      } catch (err) {
        alert("Failed to delete coupon.");
      }
    }
  };

  const cancelEdit = () => {
    setFormData(initialFormState);
    setEditingId(null);
  };

  const getCouponStatus = (coupon) => {
    const endDate = coupon.end_date || coupon.expire_date;
    if (endDate && new Date(endDate) < new Date()) {
      return "EXPIRED";
    }

    return coupon.status || coupon.status_name || "ONGOING";
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          {editingId ? "Edit Coupon" : "Create New Coupon"}
        </h2>
        <p className="text-slate-500 text-sm">Manage discount offers and codes for customers.</p>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-slate-50 p-6 rounded-xl border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          
          <div className="flex flex-col">
            <label className="text-sm font-medium text-slate-700 mb-1">Coupon Code *</label>
            <input required type="text" name="coupon_code" value={formData.coupon_code} onChange={handleInputChange} className="p-2 border rounded focus:border-green-600 outline-none uppercase" placeholder="e.g. FLAT50" />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-slate-700 mb-1">Discount Type *</label>
            <select name="discount_type" value={formData.discount_type} onChange={handleInputChange} className="p-2 border rounded focus:border-green-600 outline-none">
              <option value="percentage">Percentage (%)</option>
              <option value="flat">Flat Amount (₹)</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-slate-700 mb-1">
              {formData.discount_type === "percentage" ? "Discount Percentage *" : "Flat Discount Amount *"}
            </label>
            <div className="relative">
              {formData.discount_type === "flat" && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">₹</span>
              )}
              
              <input 
                required 
                type="number" 
                name="discount_value" 
                value={formData.discount_value} 
                onChange={handleInputChange} 
                className={`w-full p-2 border rounded focus:border-green-600 outline-none ${
                  formData.discount_type === "flat" ? "pl-7" : "pr-8"
                }`} 
                placeholder={formData.discount_type === "percentage" ? "e.g. 10" : "e.g. 50"} 
                min="0"
                max={formData.discount_type === "percentage" ? "100" : undefined}
              />

              {formData.discount_type === "percentage" && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">%</span>
              )}
            </div>
          </div>

          {/* MINIMUM ORDER VALUE */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-slate-700 mb-1">Min Order Value (₹) *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">₹</span>
              <input 
                required 
                type="number" 
                name="min_order_value" 
                value={formData.min_order_value} 
                onChange={handleInputChange} 
                className="w-full p-2 pl-7 border rounded focus:border-green-600 outline-none" 
                placeholder="e.g. 499" 
                min="0"
              />
            </div>
          </div>

          {/* AUTO APPLY BADGE */}
          <div className="flex flex-col justify-center pt-2 md:pt-6">
            <label className="flex items-center gap-2 cursor-not-allowed opacity-80">
              <input 
                type="checkbox" 
                checked={formData.is_auto_apply}
                readOnly
                className="w-4 h-4 text-green-600 accent-green-600"
              />
              <span className="text-sm font-medium text-slate-700">Auto Apply at Checkout</span>
            </label>
            <p className={`text-xs mt-1 font-medium ${formData.discount_type === "flat" ? "text-green-600" : "text-slate-500"}`}>
              {formData.discount_type === "flat" 
                ? "Always ON for Flat Discount" 
                : "OFF for Percentage Discount"}
            </p>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-slate-700 mb-1">Start Date *</label>
            <input required type="date" name="start_date" value={formData.start_date} onChange={handleInputChange} className="p-2 border rounded focus:border-green-600 outline-none" />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-slate-700 mb-1">Expire Date *</label>
            <input required type="date" name="expire_date" value={formData.expire_date} onChange={handleInputChange} className="p-2 border rounded focus:border-green-600 outline-none" />
          </div>

          <div className="flex flex-col lg:col-span-4">
            <label className="text-sm font-medium text-slate-700 mb-1">Description</label>
            <input type="text" name="description" value={formData.description} onChange={handleInputChange} className="p-2 border rounded focus:border-green-600 outline-none" placeholder="What is this coupon for?" />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2">
            {editingId ? <FaEdit /> : <FaPlus />} {loading ? "Saving..." : editingId ? "Update Coupon" : "Create Coupon"}
          </button>
          
          {editingId && (
            <button type="button" onClick={cancelEdit} className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-2 rounded-lg font-medium flex items-center gap-2">
              <FaTimes /> Cancel
            </button>
          )}
        </div>
      </form>

      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-4">All Coupons</h3>
        {loading && coupons.length === 0 ? (
          <p className="text-slate-500">Loading coupons...</p>
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
                  <th className="p-4 font-semibold">Sr.No</th>
                  <th className="p-4 font-semibold">Coupon Code</th>
                  <th className="p-4 font-semibold">Discount</th>
                  <th className="p-4 font-semibold">Min Order</th>
                  <th className="p-4 font-semibold">Start Date</th>
                  <th className="p-4 font-semibold">Expire Date</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {coupons.map((coupon, index) => (
                  <tr key={coupon.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-slate-600">{index+1}</td>
                    <td className="p-4 font-bold text-slate-800 uppercase tracking-wide">
                      {coupon.coupon_code}
                    </td>
                    <td className="p-4 text-slate-600">
                      {coupon.discount_type === "percentage" ? `${coupon.discount_value}%` : `₹${coupon.discount_value}`}
                    </td>
                    <td className="p-4 text-slate-600">
                      {coupon.min_order_value ? `₹${coupon.min_order_value}` : "-"}
                    </td>
                    <td className="p-4 text-slate-600 text-sm">
                      {coupon.start_date ? new Date(coupon.start_date).toLocaleDateString() : "-"}
                    </td>
                    <td className="p-4 text-slate-600 text-sm">
                      {coupon.end_date ? new Date(coupon.end_date).toLocaleDateString() : "-"}
                    </td>
                    <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          getCouponStatus(coupon) === "EXPIRED"
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}>
                          {getCouponStatus(coupon)}
                      </span>
                    </td>
                    <td className="p-4 flex items-center justify-end gap-3">
                      <button onClick={() => handleEdit(coupon)} className="text-blue-500 hover:text-blue-700 p-2 bg-blue-50 rounded-lg">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(coupon.id)} className="text-red-500 hover:text-red-700 p-2 bg-red-50 rounded-lg">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
                {coupons.length === 0 && !loading && (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-400">
                      No coupons found. Create one above!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}