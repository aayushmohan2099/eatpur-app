// src/pages/Admin/Admin/TransComps/Overview.jsx
import React, { useState, useEffect } from "react";
import { getAdminTransactionOverview } from "../../../../api/shop";
import {
  FaMoneyBillTransfer,
  FaRegCircleCheck,
  FaChartLine,
  FaBuildingColumns,
} from "react-icons/fa6";

export default function Overview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const fetchOverview = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminTransactionOverview({
        date_from: dateFrom,
        date_to: dateTo,
      });
      setData(res.data || res);
    } catch (err) {
      console.error(err);
      setError("Failed to load transaction overview analytics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, [dateFrom, dateTo]);

  if (loading && !data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-32 bg-slate-100 rounded-2xl"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-rose-50 text-rose-600 rounded-xl border border-rose-200">
        {error}
      </div>
    );
  }

  const { global_totals, status_breakdown, processor_breakdown } = data;

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(val || 0);

  return (
    <div className="space-y-8">
      {/* Header & Date Filters */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-2xl font-medium text-slate-800 font-serif">
            Transactions Overview
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Financial performance across all payment gateways.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-emerald-600"
          />
          <span className="text-slate-400">to</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-emerald-600"
          />
          {(dateFrom || dateTo) && (
            <button
              onClick={() => {
                setDateFrom("");
                setDateTo("");
              }}
              className="text-xs text-rose-500 font-bold ml-2 hover:underline"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Global KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
          <FaMoneyBillTransfer
            className="absolute right-[-5%] bottom-[-10%] text-white/10"
            size={100}
          />
          <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">
            Total Volume Processed
          </h3>
          <span className="text-4xl font-bold font-serif">
            {formatCurrency(global_totals.total_volume)}
          </span>
          <p className="text-xs text-slate-300 mt-3">
            {global_totals.total_transactions} Total Transactions
          </p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
          <FaRegCircleCheck
            className="absolute right-[-5%] bottom-[-10%] text-white/20"
            size={100}
          />
          <h3 className="text-emerald-100 text-sm font-bold uppercase tracking-wider mb-2">
            Successful Volume
          </h3>
          <span className="text-4xl font-bold font-serif">
            {formatCurrency(global_totals.successful_volume)}
          </span>
          <p className="text-xs text-emerald-100 mt-3">
            {global_totals.successful_transactions} Successful Transactions
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-center items-center text-center">
          <FaChartLine className="text-emerald-500 mb-3" size={32} />
          <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">
            Success Rate
          </h3>
          <span className="text-4xl font-bold text-slate-800 font-serif">
            {global_totals.success_rate_percentage}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Status Breakdown */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">
            Volume by Status
          </h3>
          <div className="space-y-3">
            {Object.entries(status_breakdown).map(([statusName, metrics]) => {
              if (metrics.count === 0) return null;
              let barColor = "bg-slate-300";
              if (statusName === "SUCCESS") barColor = "bg-emerald-500";
              if (statusName === "FAILED" || statusName === "CANCELLED")
                barColor = "bg-rose-500";
              if (statusName === "PENDING" || statusName === "INITIATED")
                barColor = "bg-amber-400";

              const percentage =
                global_totals.total_transactions > 0
                  ? (metrics.count / global_totals.total_transactions) * 100
                  : 0;

              return (
                <div
                  key={statusName}
                  className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-600">
                      {statusName} ({metrics.count})
                    </span>
                    <span className="text-sm font-bold text-slate-800">
                      {formatCurrency(metrics.volume)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div
                      className={`${barColor} h-1.5 rounded-full`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Processor Breakdown */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2 flex items-center gap-2">
            <FaBuildingColumns /> Volume by Gateway
          </h3>
          <div className="space-y-4">
            {processor_breakdown.map((proc) => (
              <div
                key={proc.processor_id}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between gap-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-800">
                      {proc.processor_name}
                    </h4>
                    <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200 uppercase">
                      {proc.processor_type}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-600">
                      {formatCurrency(proc.successful_volume)}{" "}
                      <span className="text-xs text-slate-400 font-normal">
                        Success
                      </span>
                    </p>
                    <p className="text-xs font-semibold text-slate-500">
                      {formatCurrency(proc.total_volume)}{" "}
                      <span className="font-normal">Total Attempted</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {processor_breakdown.length === 0 && (
              <p className="text-sm text-slate-400 italic text-center py-4">
                No processor data available.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
