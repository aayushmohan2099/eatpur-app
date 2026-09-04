// src/pages/User/Components/InvoiceList.jsx
import React, { useState, useEffect } from "react";
import { getCustomerInvoices } from "../../../api/customerApi";
import DownloadInvoice from "./InvoiceComps/DownloadInvoice";
import StatusBadge3D from "./ui/StatusBadge3D";
import ResponsiveTable from "./ui/ResponsiveTable";

export default function InvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getCustomerInvoices();
        const data = res.data || res.results || res;
        setInvoices(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load invoice history.");
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const columns = [
    {
      header: "Invoice No.",
      accessor: "invoice_number",
      render: (row) => (
        <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">
          {row.invoice_number}
        </span>
      ),
    },
    {
      header: "Order Date",
      accessor: "order_date",
      render: (row) => (
        <span className="text-sm text-[--color-eatpur-text-light]">
          {new Date(row.order_date).toLocaleDateString("en-IN")}
        </span>
      ),
    },
    {
      header: "Amount",
      accessor: "total_amount",
      render: (row) => (
        <span className="font-bold text-[--color-eatpur-green-dark] font-serif text-lg">
          ₹{row.total_amount}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "payment_status",
      render: (row) => <StatusBadge3D status={row.payment_status} />,
    },
    {
      header: "Document",
      accessor: "action",
      render: (row) => (
        <DownloadInvoice orderId={row.id} invoiceNumber={row.invoice_number} />
      ),
    },
  ];

  return (
    <div className="space-y-6">
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
              className="h-16 bg-white rounded-2xl border border-slate-100 shadow-sm"
            ></div>
          ))}
        </div>
      ) : (
        <ResponsiveTable
          columns={columns}
          data={invoices}
          emptyMessage="You have no generated invoices yet."
        />
      )}
    </div>
  );
}
