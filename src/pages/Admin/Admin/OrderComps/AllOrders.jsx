// src\pages\Admin\Admin\OrderComps\AllOrders.jsx
import React, { useState, useEffect } from "react";
import { getAdminOrders } from "../../../../api/shop";
import { createShipment, generateLabels } from "../../../../api/logistics";
import EatpurTable from "../UniComps/Table";
import Badge from "../UniComps/Badge";
import MagicButton from "../UniComps/MagicButton";
import AlertToast from "../UniComps/AlertToast";

export default function AllOrders({
  defaultPaymentStatus = "",
  defaultFulfillmentStatus = "",
  defaultIsReturned = "",
  title = "All Orders",
  subtitle = "Complete list of customer orders across all statuses.",
}) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState(defaultPaymentStatus);
  const [fulfillmentFilter, setFulfillmentFilter] = useState(
    defaultFulfillmentStatus,
  );

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        search,
        payment_status: paymentFilter,
        fulfillment_status: fulfillmentFilter,
        is_returned: defaultIsReturned,
      };
      const res = await getAdminOrders(params);
      const data = res.data || res.results || res;

      if (Array.isArray(data)) {
        setOrders(data);
        setTotalPages(1);
        setTotalRecords(data.length);
      } else if (data.results) {
        setOrders(data.results);
        setTotalRecords(data.count);
        setTotalPages(Math.ceil(data.count / 12));
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset to defaults if props change (e.g. tab switching)
    setPaymentFilter(defaultPaymentStatus);
    setFulfillmentFilter(defaultFulfillmentStatus);
    setSearch("");
    setCurrentPage(1);
  }, [defaultPaymentStatus, defaultFulfillmentStatus, defaultIsReturned]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchOrders(currentPage);
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [
    search,
    paymentFilter,
    fulfillmentFilter,
    currentPage,
    defaultIsReturned,
  ]);

  // LOGISTICS ACTIONS
  const handleDispatch = async (orderId) => {
    if (!window.confirm("Dispatch this order via Ekart?")) return;
    setActionLoading(true);
    try {
      const payload = {
        sale_order_id: orderId,
        payment_mode: "Prepaid", // Map dynamically if COD is supported
        pickup_location_alias: "Primary Warehouse",
        service_type: "SURFACE",
        weight: 1000,
        length: 10,
        height: 10,
        width: 10, // Defaults, can be dynamic
        delayed_dispatch: false,
        obd_shipment: false,
      };
      await createShipment(payload);
      alert("Shipment successfully created!");
      fetchOrders(currentPage);
    } catch (err) {
      alert(err.message || "Dispatch failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const handlePrintLabel = async (trackingIds) => {
    if (!trackingIds || trackingIds.length === 0) return;
    setActionLoading(true);
    try {
      const res = await generateLabels(trackingIds);
      // Handle base64 PDF or download link based on Ekart's JSON response
      console.log("Labels Data:", res);
      alert("Labels generated! Check console for payload.");
    } catch (err) {
      alert(err.message || "Failed to generate labels.");
    } finally {
      setActionLoading(false);
    }
  };

  const getPaymentBadgeType = (status) => {
    switch (status) {
      case "PAID":
        return "success";
      case "PENDING":
        return "warning";
      case "FAILED":
        return "error";
      default:
        return "default";
    }
  };

  const getFulfillmentBadgeType = (status) => {
    switch (status) {
      case "DELIVERED":
        return "success";
      case "PROCESSING":
        return "info";
      case "SHIPPED":
        return "eatpur";
      case "UNFULFILLED":
        return "warning";
      case "CANCELLED":
        return "error";
      default:
        return "default";
    }
  };

  const columns = [
    { header: "Order Info", accessor: "orderDetails" },
    { header: "Customer", accessor: "customerDetails" },
    { header: "Amount", accessor: "amountDetails" },
    { header: "Payment", accessor: "paymentBadge" },
    { header: "Fulfillment", accessor: "fulfillmentBadge" },
    { header: "Logistics Action", accessor: "actions" },
  ];

  const formattedData = orders.map((order) => {
    const hasTracking = order.tracking_ids && order.tracking_ids.length > 0;

    return {
      ...order,
      orderDetails: (
        <div className="flex flex-col">
          <span className="font-bold text-[--color-eatpur-dark]">
            #ORD-{order.id}
          </span>
          <span className="text-xs text-slate-500">
            {new Date(order.order_date).toLocaleDateString()}
          </span>
          {hasTracking && (
            <span className="text-[10px] font-mono text-slate-400 mt-1">
              TRK: {order.tracking_ids[0]}
            </span>
          )}
        </div>
      ),
      customerDetails: (
        <div className="flex flex-col">
          <span className="font-medium text-slate-800">
            {order.customer_name}
          </span>
          <span className="text-xs text-slate-500">{order.customer_phone}</span>
        </div>
      ),
      amountDetails: (
        <span className="font-bold text-[--color-eatpur-green-dark]">
          ₹{order.total_amount}
        </span>
      ),
      paymentBadge: (
        <Badge
          text={order.payment_status}
          type={getPaymentBadgeType(order.payment_status)}
        />
      ),
      fulfillmentBadge: (
        <div className="flex flex-col gap-1 items-start">
          <Badge
            text={order.fulfillment_status.replace("_", " ")}
            type={getFulfillmentBadgeType(order.fulfillment_status)}
          />
          {order.ekart_statuses && order.ekart_statuses[0] && (
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
              {order.ekart_statuses[0]}
            </span>
          )}
        </div>
      ),
      actions: (
        <div className="flex flex-col gap-2">
          {order.payment_status === "PAID" &&
            order.fulfillment_status === "UNFULFILLED" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDispatch(order.id);
                }}
                disabled={actionLoading}
                className="text-xs font-bold uppercase tracking-wider bg-eatpur-green-dark text-white px-3 py-1.5 rounded hover:bg-[--color-eatpur-dark] transition-colors disabled:opacity-50"
              >
                Dispatch Order
              </button>
            )}
          {hasTracking && order.fulfillment_status !== "DELIVERED" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrintLabel(order.tracking_ids);
              }}
              disabled={actionLoading}
              className="text-xs font-bold uppercase tracking-wider bg-slate-800 text-white px-3 py-1.5 rounded hover:bg-black transition-colors disabled:opacity-50"
            >
              Print Label
            </button>
          )}
        </div>
      ),
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2
            className="text-2xl font-medium text-[--color-eatpur-dark]"
            style={{ fontFamily: "var(--font-display, serif)" }}
          >
            {title}
          </h2>
          <p className="text-sm text-[--color-eatpur-text-light] mt-1">
            {subtitle}
          </p>
        </div>
      </div>

      {error && <AlertToast type="error" message={error} />}

      {/* Toolbar */}
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex flex-wrap gap-4 items-center justify-between">
        <input
          type="text"
          placeholder="Search Order ID, Email, Phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-[--color-eatpur-green-dark] w-full md:w-64"
        />

        <div className="flex gap-4">
          {!defaultPaymentStatus && (
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none"
            >
              <option value="">All Payments</option>
              <option value="PAID">Paid</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
            </select>
          )}
          {!defaultFulfillmentStatus && (
            <select
              value={fulfillmentFilter}
              onChange={(e) => setFulfillmentFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none"
            >
              <option value="">All Fulfillment</option>
              <option value="UNFULFILLED">Unfulfilled</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          )}
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-slate-100 rounded-xl"></div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <EatpurTable
            columns={columns}
            data={formattedData}
            showActions={true}
            onViewClick={(order) =>
              alert(
                `View order details for #${order.id} (Routing to Timeline in next phase)`,
              )
            }
          />

          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white px-6 py-4 rounded-xl border border-slate-100">
              <span className="text-sm text-slate-500">
                Page{" "}
                <span className="font-bold text-slate-800">{currentPage}</span>{" "}
                of {totalPages}
              </span>
              <div className="flex gap-3">
                <MagicButton
                  variant="eatpur"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Prev
                </MagicButton>
                <MagicButton
                  variant="eatpur"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next
                </MagicButton>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
