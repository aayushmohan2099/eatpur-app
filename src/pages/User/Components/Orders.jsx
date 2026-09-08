// src/pages/User/Components/Orders.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getCustomerOrders } from "../../../api/customerApi";
import Button3D from "./ui/Button3D";
import StatusBadge3D from "./ui/StatusBadge3D";
import ResponsiveTable from "./ui/ResponsiveTable";
import Review from "./Review";

export default function Orders({ activeSubMenu }) {
  const [orders, setOrders] = useState([]);

  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedOrderForReview, setSelectedOrderForReview] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const isHistoryView = activeSubMenu === "order_history";

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};

      // If viewing active orders, strictly filter out delivered/cancelled
      if (!isHistoryView) {
        params.payment_status = "PAID"; // We only care about paid orders in the active pipeline
        // The backend expects an exact match, so to get all active we leave it blank
        // and filter locally OR we can pass specific statuses if backend supports __in.
        // For now, we'll fetch all and filter locally for simplicity in active view.
      } else {
        if (statusFilter) params.fulfillment_status = statusFilter;
        if (dateFilter) params.start_date = dateFilter; // Simplified date filter
      }

      const res = await getCustomerOrders(params);
      let data = res.data || res.results || res;

      if (!Array.isArray(data)) data = [];

      // Local filter for Active View (Exclude Delivered and Cancelled)
      if (!isHistoryView) {
        data = data.filter(
          (o) =>
            o.fulfillment_status !== "DELIVERED" &&
            o.fulfillment_status !== "CANCELLED",
        );
      }

      setOrders(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load your orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset filters when swapping between Active and History tabs
    setStatusFilter("");
    setDateFilter("");
    fetchOrders();
  }, [activeSubMenu]);

  useEffect(() => {
    // Re-fetch if history filters change
    if (isHistoryView) fetchOrders();
  }, [statusFilter, dateFilter]);

  const columns = [
    {
      header: "Order Details",
      accessor: "id",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-[--color-eatpur-dark]">
            #ORD-{row.id}
          </span>
          <span className="text-xs text-[--color-eatpur-text-light]">
            {new Date(row.order_date).toLocaleDateString("en-IN")}
          </span>
        </div>
      ),
    },
    {
      header: "Items",
      accessor: "items",
      render: (row) => (
        <div className="flex -space-x-3 overflow-hidden">
          {row.items.slice(0, 3).map((item, idx) => (
            <img
              key={idx}
              className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover border border-slate-200"
              src={item.product_image || "/placeholder.png"}
              alt={item.product_name}
              title={item.product_name}
            />
          ))}
          {row.items.length > 3 && (
            <div className="flex h-8 w-8 items-center justify-center rounded-full ring-2 ring-white bg-slate-100 text-xs font-bold text-slate-500">
              +{row.items.length - 3}
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Total",
      accessor: "total_amount",
      render: (row) => (
        <span className="font-bold text-[--color-eatpur-green-dark] font-serif text-lg">
          ₹{row.total_amount}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "fulfillment_status",
      render: (row) => (
        <div className="flex flex-col items-start gap-1">
          <StatusBadge3D status={row.fulfillment_status} />
          {row.tracking_info && row.fulfillment_status !== "DELIVERED" && (
            <span className="text-[10px] font-mono text-slate-400 mt-1">
              TRK: {row.tracking_info.tracking_id}
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Action",
      accessor: "action",
      render: (row) => {
        if (row.fulfillment_status === "DELIVERED") {
          return (
            <button
              onClick={() => {
                setSelectedOrderForReview(row);
                setIsReviewModalOpen(true);
              }}
              className="text-xs font-bold bg-eatpur-green-pale text-eatpur-green-dark border border-eatpur-green-light px-3 py-1.5 rounded-lg hover:bg-eatpur-green-light transition-colors inline-block shadow-sm"
            >
              Leave Review
            </button>
          );
        }
        if (row.tracking_info && row.tracking_info.tracking_url) {
          return (
            <a
              href={row.tracking_info.tracking_url}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-colors inline-block"
            >
              Track Package
            </a>
          );
        }
        return (
          <span className="text-xs text-slate-400 italic">Processing...</span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Dynamic Toolbar for History View */}
      <AnimatePresence>
        {isHistoryView && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white p-4 rounded-2xl border border-[--color-eatpur-border] shadow-sm flex flex-wrap gap-4 items-center justify-between"
          >
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm text-[--color-eatpur-dark] focus:outline-none focus:border-[--color-eatpur-green-dark]"
              >
                <option value="">All Statuses</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="SHIPPED">Shipped</option>
              </select>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm text-[--color-eatpur-dark] focus:outline-none focus:border-[--color-eatpur-green-dark]"
              />
            </div>
            {(statusFilter || dateFilter) && (
              <Button3D
                variant="outline"
                size="sm"
                onClick={() => {
                  setStatusFilter("");
                  setDateFilter("");
                }}
              >
                Clear Filters
              </Button3D>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 bg-white rounded-2xl border border-slate-100 shadow-sm"
            ></div>
          ))}
        </div>
      ) : (
        <ResponsiveTable
          columns={columns}
          data={orders}
          emptyMessage={
            isHistoryView
              ? "No order history found for these filters."
              : "You have no active orders in transit right now."
          }
        />
      )}

      {/* Leave Review Modal Overlay */}
      <Review
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        order={selectedOrderForReview}
      />
    </div>
  );
}
