// src/pages/Admin/Admin/OrderComps/AllOrders.jsx
import React, { useState, useEffect } from "react";
import { getAdminOrders } from "../../../../api/shop";
import { generateLabels } from "../../../../api/logistics";
import EatpurTable from "../UniComps/Table";
import Badge from "../UniComps/Badge";
import MagicButton from "../UniComps/MagicButton";
import AlertToast from "../UniComps/AlertToast";
import DispatchOrder from "./DispatchOrder";
import OrderTimeline from "./OrderTimeline";
import DownloadInvoice from "../../../User/Components/InvoiceComps/DownloadInvoice";
import OrderHeader from "./OrderHeader";
import { createPrintLabel } from "./createPrintLabel";
import { FaCircleInfo } from "react-icons/fa6";

// Helper component for beautiful info tooltips
const InfoTooltip = ({ content }) => (
  <div className="group relative inline-flex items-center justify-center ml-1.5 cursor-help z-20">
    <FaCircleInfo className="text-slate-400 hover:text-slate-600 transition-colors text-xs" />
    <div className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[11px] p-3 rounded-lg shadow-xl text-left whitespace-pre-line leading-relaxed border border-slate-700">
      {content}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
    </div>
  </div>
);

export default function AllOrders({
  defaultPaymentStatus = "",
  defaultFulfillmentStatus = "",
  defaultIsReturned = "",
  title = "All Orders",
  subtitle = "Complete list of customer orders across all statuses.",
}) {
  const PAGE_SIZE = 10;
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
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Dispatch Modal State
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [selectedOrderForDispatch, setSelectedOrderForDispatch] =
    useState(null);

  // Timeline Modal State
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);
  const [selectedOrderIdForTimeline, setSelectedOrderIdForTimeline] =
    useState(null);

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: 1,
        page_size: PAGE_SIZE,
        search,
        payment_status: paymentFilter,
        fulfillment_status: fulfillmentFilter,
        is_returned: defaultIsReturned,
        date_from: dateFrom,
        date_to: dateTo,
      };
      const firstResponse = await getAdminOrders(params);
      const getPageData = (response) => {
        const data = response?.data ?? response;
        return {
          results: Array.isArray(data) ? data : data?.results || [],
          count: data?.count ?? response?.count,
        };
      };

      const firstPage = getPageData(firstResponse);
      const allOrders = [...firstPage.results];
      const totalCount = Number(firstPage.count) || allOrders.length;
      const apiPageCount = firstPage.results.length
        ? Math.ceil(totalCount / firstPage.results.length)
        : 1;

      // Fetch the remaining pages so the client-side pagination cannot lose rows.
      if (firstPage.count && firstPage.results.length < totalCount) {
        for (let apiPage = 2; apiPage <= apiPageCount; apiPage += 1) {
          const response = await getAdminOrders({ ...params, page: apiPage });
          allOrders.push(...getPageData(response).results);
        }
      }

      const uniqueOrders = Array.from(
        new Map(allOrders.map((order) => [order.id, order])).values(),
      );
      const startIndex = (page - 1) * PAGE_SIZE;
      setOrders(uniqueOrders.slice(startIndex, startIndex + PAGE_SIZE));
      setTotalRecords(totalCount);
      setTotalPages(Math.max(1, Math.ceil(totalCount / PAGE_SIZE)));
      if (uniqueOrders.length !== totalCount) {
        setTotalRecords(uniqueOrders.length);
        setTotalPages(Math.max(1, Math.ceil(uniqueOrders.length / PAGE_SIZE)));
      } else {
        setTotalRecords(totalCount);
      }
    } catch (err) {
      console.error(err);
      if (page > 1) {
        setCurrentPage(1);
        return;
      }
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
    dateFrom,
    dateTo,
  ]);

  // LOGISTICS ACTIONS
  const openDispatchModal = (order) => {
    setSelectedOrderForDispatch(order);
    setIsDispatchModalOpen(true);
  };

  const handlePrintLabel = async (trackingIds) => {
    if (!trackingIds || trackingIds.length === 0) return;

    setActionLoading(true);

    try {
      const res = await generateLabels(trackingIds);
      const responseData = res?.data || res;
      const labels =
        responseData?.data ||
        responseData?.labels ||
        (Array.isArray(responseData) ? responseData : []);

      if (!labels.length) {
        throw new Error("No label data was returned by Ekart.");
      }

      // Print each generated label.
      labels.forEach((label, index) => {
        setTimeout(() => {
          createPrintLabel(label);
        }, index * 500);
      });
    } catch (err) {
      console.error("Print label error:", err);
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

  const formattedData = orders.map((order, index) => {
    const hasTracking = order.tracking_ids && order.tracking_ids.length > 0;

    return {
      ...order,
      rowNumber: (currentPage - 1) * PAGE_SIZE + index + 1,
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
            text={
              order.fulfillment_status === "SHIPPED"
                ? "Ready for Pickup"
                : order.fulfillment_status.replace("_", " ")
            }
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
                  openDispatchModal(order);
                }}
                disabled={actionLoading}
                className="text-xs font-bold uppercase tracking-wider bg-eatpur-green-dark text-white px-3 py-1.5 rounded hover:bg-[--color-eatpur-dark] transition-colors disabled:opacity-50"
              >
                Dispatch Order
              </button>
            )}
          <div className="flex items-center gap-2">
            {hasTracking &&
              order.fulfillment_status !== "DELIVERED" &&
              order.fulfillment_status !== "CANCELLED" && (
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
            {order.payment_status === "PAID" && (
              <DownloadInvoice
                orderId={order.id}
                invoiceNumber={order.invoice_number}
                buttonLabel="Download Invoice"
                onClick={(e) => e.stopPropagation()}
                className="text-xs font-bold uppercase tracking-wider bg-slate-200 text-slate-800 px-3 py-1.5 rounded hover:bg-slate-300 transition-colors disabled:opacity-50"
              />
            )}
          </div>
        </div>
      ),
    };
  });

  return (
    <div className="space-y-6">
      {/* 1. Header with Stats & Animation */}
      <OrderHeader />

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
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              From Date
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-[--color-eatpur-green-dark]"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              To Date
            </label>
            <input
              type="date"
              value={dateTo}
              min={dateFrom || undefined}
              onChange={(e) => {
                setDateTo(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-[--color-eatpur-green-dark]"
            />
          </div>

          {(dateFrom || dateTo) && (
            <button
              type="button"
              onClick={() => {
                setDateFrom("");
                setDateTo("");
                setCurrentPage(1);
              }}
              className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-[--color-eatpur-dark] transition-colors"
            >
              Clear Dates
            </button>
          )}
        </div>

        <input
          type="text"
          placeholder="Search Order ID, Email, Phone..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="bg-white border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-[--color-eatpur-green-dark] w-full md:w-64"
        />

        <div className="flex gap-4">
          {!defaultPaymentStatus && (
            <div className="flex flex-col">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center">
                Payment
                <InfoTooltip
                  content="PAID: Money successfully transferred.&#10;PENDING: Paid but confirmation pending from RazorPay.&#10;FAILED: Ordered but cancelled/failed payment."
                />
              </label>
              <select
                value={paymentFilter}
                onChange={(e) => {
                  setPaymentFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-white border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none"
              >
                <option value="">All Payments</option>
                <option value="PAID">Paid</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed / Unpaid</option>
              </select>
            </div>
          )}

          {!defaultFulfillmentStatus && (
            <div className="flex flex-col">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center">
                Fulfillment
                <InfoTooltip
                  content="UNFULFILLED: Paid but NOT dispatched.&#10;PROCESSING: Paid & dispatched but not confirmed by EKART.&#10;READY FOR PICKUP: Label generated, courier approaching.&#10;DELIVERED: Package delivery successful.&#10;CANCELLED: Cancelled by Seller in Admin Panel."
                />
              </label>
              <select
                value={fulfillmentFilter}
                onChange={(e) => {
                  setFulfillmentFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-white border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none"
              >
                <option value="">All Fulfillment</option>
                <option value="UNFULFILLED">Unfulfilled</option>
                <option value="PROCESSING">Processing</option>
                <option value="SHIPPED">Ready for Pickup</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
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
            onViewClick={(order) => {
              setSelectedOrderIdForTimeline(order.id);
              setIsTimelineModalOpen(true);
            }}
          />

          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white px-6 py-4 rounded-xl border border-slate-100">
              <span className="text-sm text-slate-500">
                Page{" "}
                <span className="font-bold text-slate-800">{currentPage}</span>{" "}
                of {totalPages} ({totalRecords} orders)
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

      {/* Dispatch Modal Overlay */}
      <DispatchOrder
        isOpen={isDispatchModalOpen}
        onClose={() => setIsDispatchModalOpen(false)}
        order={selectedOrderForDispatch}
        onSuccess={() => {
          setIsDispatchModalOpen(false);
          fetchOrders(currentPage);
        }}
      />

      {/* Timeline Modal Overlay */}
      <OrderTimeline
        isOpen={isTimelineModalOpen}
        onClose={() => setIsTimelineModalOpen(false)}
        orderId={selectedOrderIdForTimeline}
      />
    </div>
  );
}
