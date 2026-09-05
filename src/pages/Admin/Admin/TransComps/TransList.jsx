// src/pages/Admin/Admin/TransComps/TransList.jsx
import React, { useState, useEffect } from "react";
import { getAdminTransactions } from "../../../../api/shop";
import EatpurTable from "../UniComps/Table";
import Badge from "../UniComps/Badge";
import MagicButton from "../UniComps/MagicButton";
import AlertToast from "../UniComps/AlertToast";

export default function TransList() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [processorTypeFilter, setProcessorTypeFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const fetchTransactions = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        search,
        status: statusFilter,
        processor_type: processorTypeFilter,
        date_from: dateFrom,
        date_to: dateTo,
      };

      const res = await getAdminTransactions(params);
      const data = res.data || res.results || res;

      if (Array.isArray(data)) {
        setTransactions(data);
        setTotalPages(1);
        setTotalRecords(data.length);
      } else if (data.results) {
        setTransactions(data.results);
        setTotalRecords(data.count);
        setTotalPages(Math.ceil(data.count / 15)); // Assuming DRF page_size=15
      } else {
        setTransactions([]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch transaction logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTransactions(currentPage);
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [
    search,
    statusFilter,
    processorTypeFilter,
    dateFrom,
    dateTo,
    currentPage,
  ]);

  const getStatusBadgeType = (status) => {
    switch (status) {
      case "SUCCESS":
        return "success";
      case "FAILED":
        return "error";
      case "CANCELLED":
        return "error";
      case "REFUNDED":
        return "warning";
      case "PENDING":
        return "warning";
      case "INITIATED":
        return "info";
      default:
        return "default";
    }
  };

  const formattedData = transactions.map((txn) => ({
    ...txn,

    txnDetails: (
      <div className="flex flex-col gap-1">
        <span
          className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded inline-block max-w-[180px] truncate"
          title={txn.transaction_id}
        >
          {txn.transaction_id}
        </span>

        <span className="text-[10px] text-slate-500 uppercase font-bold">
          {new Date(txn.transaction_date).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </span>
      </div>
    ),

    orderDetails: (
      <div className="flex flex-col">
        <span className="font-bold text-[--color-eatpur-dark]">
          #ORD-{txn.order_id}
        </span>

        <span className="text-xs font-medium text-slate-600 mt-0.5">
          {txn.customer_name || "Guest"}
        </span>

        <span className="text-xs text-slate-400">
          {txn.customer_phone || txn.customer_email || "Guest"}
        </span>
      </div>
    ),

    gatewayDetails: (
      <div className="flex flex-col items-start gap-1">
        <span className="font-bold text-slate-700 text-xs">
          {txn.processor_name || "-"}
        </span>

        <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded uppercase">
          {txn.processor_type || "-"}
        </span>
      </div>
    ),

    amountDetails: (
      <span className="font-bold text-[--color-eatpur-green-dark] font-serif text-lg">
        {"\u20B9"}
        {txn.order_total_amount || "0.00"}
      </span>
    ),

    statusBadge: (
      <Badge
        text={txn.status_name || "-"}
        type={getStatusBadgeType(txn.status_name)}
      />
    ),
  }));

  const columns = [
    {
      header: "Txn ID & Date",
      accessor: "txnDetails",
      render: (row) => (
        <div className="flex flex-col gap-1">
          <span
            className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded inline-block max-w-[180px] truncate"
            title={row.transaction_id}
          >
            {row.transaction_id}
          </span>
          <span className="text-[10px] text-slate-500 uppercase font-bold">
            {new Date(row.transaction_date).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </span>
        </div>
      ),
    },
    {
      header: "Order & Customer",
      accessor: "orderDetails",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-[--color-eatpur-dark]">
            #ORD-{row.order_id}
          </span>
          <span className="text-xs font-medium text-slate-600 mt-0.5">
            {row.customer_name}
          </span>
          <span className="text-xs text-slate-400">
            {row.customer_phone || row.customer_email || "Guest"}
          </span>
        </div>
      ),
    },
    {
      header: "Gateway",
      accessor: "gatewayDetails",
      render: (row) => (
        <div className="flex flex-col items-start gap-1">
          <span className="font-bold text-slate-700 text-xs">
            {row.processor_name}
          </span>
          <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded uppercase">
            {row.processor_type}
          </span>
        </div>
      ),
    },
    {
      header: "Amount",
      accessor: "amountDetails",
      render: (row) => (
        <span className="font-bold text-[--color-eatpur-green-dark] font-serif text-lg">
          ₹{row.order_total_amount}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "statusBadge",
      render: (row) => (
        <Badge
          text={row.status_name}
          type={getStatusBadgeType(row.status_name)}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {error && <AlertToast type="error" message={error} />}

      {/* Unified Toolbar */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-wrap gap-4 items-end justify-between shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[--color-eatpur-green-dark]"
            >
              <option value="">All Statuses</option>
              <option value="SUCCESS">Success</option>
              <option value="FAILED">Failed</option>
              <option value="PENDING">Pending</option>
              <option value="INITIATED">Initiated</option>
              <option value="REFUNDED">Refunded</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {/* Processor Type Filter */}
          <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Method
            </label>
            <select
              value={processorTypeFilter}
              onChange={(e) => {
                setProcessorTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[--color-eatpur-green-dark]"
            >
              <option value="">All Methods</option>
              <option value="UPI">UPI</option>
              <option value="CARD">Card</option>
              <option value="WALLET">Wallet</option>
              <option value="NETBANKING">Net Banking</option>
            </select>
          </div>

          {/* Date Filters */}
          <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Date Range
            </label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[--color-eatpur-green-dark]"
              />
              <span className="text-slate-400 text-xs">to</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[--color-eatpur-green-dark]"
              />
            </div>
          </div>

          {(statusFilter || processorTypeFilter || dateFrom || dateTo) && (
            <button
              onClick={() => {
                setStatusFilter("");
                setProcessorTypeFilter("");
                setDateFrom("");
                setDateTo("");
                setCurrentPage(1);
              }}
              className="mt-4 text-xs font-bold uppercase tracking-wider text-rose-500 hover:text-rose-700 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Search */}
        <div className="w-full md:w-64">
          <input
            type="text"
            placeholder="Search Txn ID, Phone, Order..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-800 focus:outline-none focus:border-[--color-eatpur-green-dark]"
          />
        </div>
      </div>

      {/* Table Area */}
      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-slate-100 rounded-xl"></div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <EatpurTable
            columns={columns}
            data={formattedData}
            emptyMessage="No transactions found matching your criteria."
            onViewClick={(txn) => {
              // Extract the nested response JSON string to show the admin
              const jsonString = JSON.stringify(txn.response, null, 2);
              alert(
                `Gateway Response Data:\n\n${jsonString.substring(0, 500)}...`,
              );
            }}
          />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white px-6 py-4 rounded-xl border border-slate-100 shadow-sm">
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
