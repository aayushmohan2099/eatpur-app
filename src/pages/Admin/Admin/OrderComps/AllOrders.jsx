// src\pages\Admin\Admin\OrderComps\AllOrders.jsx
import React, { useState, useEffect } from "react";
import { getAdminOrders } from "../../../../api/shop";
import { generateLabels } from "../../../../api/logistics";
import EatpurTable from "../UniComps/Table";
import Badge from "../UniComps/Badge";
import MagicButton from "../UniComps/MagicButton";
import AlertToast from "../UniComps/AlertToast";
import DispatchOrder from "./DispatchOrder";
import OrderTimeline from "./OrderTimeline";

// Label Helper
const createPrintLabel = (label) => {
  const printWindow = window.open("", "_blank", "width=900,height=1200");

  if (!printWindow) {
    alert("Please allow pop-ups to print the shipping label.");
    return;
  }

  const trackingNumber =
    label.wbn || label.swiftId || (label.wbns && label.wbns[0]) || "";

  const consigneeAddress = [
    label.consigneeAddress,
    label.consigneeCity,
    label.consigneeState,
    label.consigneePincode,
  ]
    .filter(Boolean)
    .join(", ");

  const returnAddress = [
    label.returnAddress,
    label.returnCity,
    label.returnState,
    label.returnPincode,
  ]
    .filter(Boolean)
    .join(", ");

  /*
   * CODE-128 barcode using an online-free SVG representation.
   * The barcode is generated from the tracking number.
   */
  const code128Patterns = [
    "212222",
    "222122",
    "222221",
    "121223",
    "121322",
    "131222",
    "122213",
    "122312",
    "132212",
    "221213",
    "221312",
    "231212",
    "112232",
    "122132",
    "122231",
    "113222",
    "123122",
    "123221",
    "223211",
    "221132",
    "221231",
    "213212",
    "223112",
    "312131",
    "311222",
    "321122",
    "321221",
    "312212",
    "322112",
    "322211",
    "212123",
    "212321",
    "232121",
    "111323",
    "131123",
    "131321",
    "112313",
    "132113",
    "132311",
    "211313",
    "231113",
    "231311",
    "112133",
    "112331",
    "132131",
    "113123",
    "113321",
    "133121",
    "313121",
    "211331",
    "231131",
    "213113",
    "213311",
    "213131",
    "311123",
    "311321",
    "331121",
    "312113",
    "312311",
    "332111",
    "314111",
    "221411",
    "431111",
    "111224",
    "111422",
    "121124",
    "121421",
    "141122",
    "141221",
    "112214",
    "112412",
    "122114",
    "122411",
    "142112",
    "142211",
    "241211",
    "221114",
    "413111",
    "241112",
    "134111",
    "111242",
    "121142",
    "121241",
    "114212",
    "124112",
    "124211",
    "411212",
    "421112",
    "421211",
    "212141",
    "214121",
    "412121",
    "111143",
    "111341",
    "131141",
    "114113",
    "114311",
    "411113",
    "411311",
    "113141",
    "114131",
    "311141",
    "411131",
    "211412",
    "211214",
    "211232",
    "2331112",
  ];

  const code128B = {};

  for (let i = 0; i < 96; i++) {
    code128B[String.fromCharCode(32 + i)] = i;
  }

  const createBarcodeSVG = (value) => {
    if (!value) return "";

    let checksum = 104;
    let encoded = [104];

    for (let i = 0; i < value.length; i++) {
      const charCode = value.charCodeAt(i);

      if (charCode < 32 || charCode > 127) continue;

      const code = code128B[String.fromCharCode(charCode)];
      encoded.push(code);
      checksum += code * i;
    }

    checksum %= 103;
    encoded.push(checksum);
    encoded.push(106);

    const moduleWidth = 2;
    const height = 80;

    let x = 10;
    let bars = "";

    encoded.forEach((code) => {
      const pattern = code128Patterns[code];

      let black = true;

      for (let i = 0; i < pattern.length; i++) {
        const width = parseInt(pattern[i], 10) * moduleWidth;

        if (black) {
          bars += `<rect x="${x}" y="0" width="${width}" height="${height}" />`;
        }

        x += width;
        black = !black;
      }
    });

    return `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 ${x + 10} ${height}"
        width="100%"
        height="95"
        preserveAspectRatio="none"
      >
        <rect width="100%" height="100%" fill="white"/>
        <g fill="black">
          ${bars}
        </g>
      </svg>
    `;
  };

  const barcodeSVG = createBarcodeSVG(trackingNumber);

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Shipping Label - ${label.orderNumber || trackingNumber}</title>

        <style>
          @page {
            size: 100mm 150mm;
            margin: 0;
          }

          * {
            box-sizing: border-box;
          }

          html,
          body {
            margin: 0;
            padding: 0;
            background: white;
            font-family: Arial, Helvetica, sans-serif;
            color: #111827;
          }

          body {
            width: 100mm;
            min-height: 150mm;
          }

          .label {
            width: 100mm;
            min-height: 150mm;
            padding: 5mm;
            background: white;
          }

          .top {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 1.5px solid #111;
            padding-bottom: 3mm;
          }

          .brand {
            font-size: 20px;
            font-weight: 800;
            letter-spacing: 1px;
            color: #173f2a;
          }

          .vendor {
            font-size: 9px;
            margin-top: 1mm;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: .8px;
          }

          .payment {
            border: 1px solid #111;
            padding: 2mm 3mm;
            font-size: 10px;
            font-weight: 800;
            text-transform: uppercase;
          }

          .section {
            padding: 3mm 0;
            border-bottom: 1px solid #d1d5db;
          }

          .section-title {
            font-size: 8px;
            font-weight: 800;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 1.5mm;
          }

          .name {
            font-size: 15px;
            font-weight: 800;
            margin-bottom: 1mm;
          }

          .phone {
            font-size: 10px;
            font-weight: 700;
            margin-bottom: 1.5mm;
          }

          .address {
            font-size: 10px;
            line-height: 1.45;
          }

          .tracking {
            text-align: center;
            padding: 3mm 0 2mm;
          }

          .tracking-label {
            font-size: 8px;
            font-weight: 800;
            letter-spacing: 1px;
            color: #6b7280;
            text-transform: uppercase;
          }

          .tracking-number {
            font-size: 16px;
            font-weight: 900;
            letter-spacing: 1.5px;
            margin-top: 1mm;
          }

          .barcode {
            width: 100%;
            margin-top: 2mm;
          }

          .barcode-number {
            font-family: monospace;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 2px;
            margin-top: 1mm;
          }

          .details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            border-top: 1px solid #111;
            border-left: 1px solid #111;
          }

          .detail {
            padding: 2mm;
            border-right: 1px solid #111;
            border-bottom: 1px solid #111;
          }

          .detail-label {
            font-size: 7px;
            color: #6b7280;
            text-transform: uppercase;
            font-weight: 800;
          }

          .detail-value {
            font-size: 9px;
            font-weight: 800;
            margin-top: 1mm;
          }

          .return {
            font-size: 8px;
            line-height: 1.4;
            color: #4b5563;
          }

          .footer {
            text-align: center;
            padding-top: 3mm;
            font-size: 7px;
            color: #9ca3af;
          }

          @media print {
            html,
            body {
              width: 100mm;
              height: 150mm;
            }

            .label {
              page-break-after: avoid;
            }
          }
        </style>
      </head>

      <body>
        <div class="label">

          <div class="top">
            <div>
              <div class="brand">EATPUR Naturals LLP</div>
              <div class="vendor">Fuel Your Body Naturally</div>
            </div>

            <div class="payment">
              ${label.paymentMode || "PREPAID"}
            </div>
          </div>

          <div class="section">
            <div class="section-title">
              Ship To
            </div>

            <div class="name">
              ${label.consigneeName || ""}
            </div>

            <div class="phone">
              ${label.consigneePhone || ""}
            </div>

            <div class="address">
              ${consigneeAddress}
            </div>
          </div>

          <div class="tracking">
            <div class="tracking-label">
              Tracking / AWB
            </div>

            <div class="tracking-number">
              ${trackingNumber}
            </div>

            <div class="barcode">
              ${barcodeSVG}
            </div>

            <div class="barcode-number">
              ${trackingNumber}
            </div>
          </div>

          <div class="details">

            <div class="detail">
              <div class="detail-label">
                Order
              </div>
              <div class="detail-value">
                ${label.orderNumber || "-"}
              </div>
            </div>

            <div class="detail">
              <div class="detail-label">
                Invoice
              </div>
              <div class="detail-value">
                ${label.invoiceNumber || "-"}
              </div>
            </div>

            <div class="detail">
              <div class="detail-label">
                Amount
              </div>
              <div class="detail-value">
                ₹${label.totalAmount || "0.00"}
              </div>
            </div>

            <div class="detail">
              <div class="detail-label">
                Courier
              </div>
              <div class="detail-value">
                ${label.vendor || "EKART"}
              </div>
            </div>

          </div>

          <div class="section">
            <div class="section-title">
              Return Address
            </div>

            <div class="return">
              ${returnAddress}
              <br />
              ${label.returnPhone || ""}
            </div>
          </div>

          <div class="footer">
            Thank you for choosing EATPUR!
          </div>

        </div>

        <script>
          window.onload = function () {
            setTimeout(function () {
              window.print();

              setTimeout(function () {
                window.close();
              }, 500);
            }, 300);
          };
        </script>

      </body>
    </html>
  `);

  printWindow.document.close();
};

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
    try {
      const params = {
        page,
        search,
        payment_status: paymentFilter,
        fulfillment_status: fulfillmentFilter,
        is_returned: defaultIsReturned,
        date_from: dateFrom,
        date_to: dateTo,
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

      console.log("Labels Data:", res);
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
                  openDispatchModal(order);
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
