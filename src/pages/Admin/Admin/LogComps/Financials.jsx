// src\pages\Admin\Admin\LogComps\Financials.jsx
import React, { useState, useEffect } from "react";
import { getShippingFinancials } from "../../../../api/logistics";
import { FaMoneyBillWave, FaClockRotateLeft, FaWallet } from "react-icons/fa6";

export default function Financials() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFinancials = async () => {
      try {
        setLoading(true);
        const res = await getShippingFinancials();
        setData(res.data || res);
      } catch (err) {
        console.error("Failed to load financials:", err);
        setError("Unable to load shipping financial metrics.");
      } finally {
        setLoading(false);
      }
    };
    fetchFinancials();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 bg-slate-100 rounded-2xl"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200">
        {error}
      </div>
    );
  }

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(val || 0);

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-medium text-slate-800 font-serif">
          Shipping Financials
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Cash on Delivery (COD) tracking and Gross Merchandise Value.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
          <FaMoneyBillWave
            className="absolute right-[-10%] bottom-[-10%] text-white/20"
            size={120}
          />
          <h3 className="text-emerald-100 text-sm font-medium uppercase tracking-wider mb-2">
            Total GMV Shipped
          </h3>
          <span className="text-4xl font-bold font-serif">
            {formatCurrency(data?.gross_merchandise_value_shipped)}
          </span>
          <p className="text-xs text-emerald-100 mt-4">
            Total value of goods dispatched via Ekart
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute right-4 top-4 w-12 h-12 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center">
            <FaClockRotateLeft size={20} />
          </div>
          <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-2">
            Pending COD
          </h3>
          <span className="text-3xl font-bold text-slate-800 font-serif">
            {formatCurrency(data?.cod_pending_collection)}
          </span>
          <p className="text-xs text-slate-400 mt-4">
            To be collected from customers on delivery
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute right-4 top-4 w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
            <FaWallet size={20} />
          </div>
          <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-2">
            Collected COD
          </h3>
          <span className="text-3xl font-bold text-slate-800 font-serif">
            {formatCurrency(data?.cod_successfully_collected)}
          </span>
          <p className="text-xs text-slate-400 mt-4">
            Successfully delivered and collected
          </p>
        </div>
      </div>
    </div>
  );
}
