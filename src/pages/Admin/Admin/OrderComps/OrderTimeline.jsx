// src\pages\Admin\Admin\OrderComps\OrderTimeline.jsx
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "../UniComps/Modal";
import MagicButton from "../UniComps/MagicButton";
import { getAdminOrderTimeline,getCustomerAddressHistory } from "../../../../api/shop";
import {
  FaBoxOpen,
  FaCreditCard,
  FaTruckFast,
  FaLocationDot,
  FaCircleCheck,
  FaCircleXmark,
  FaClockRotateLeft,
} from "react-icons/fa6";
import { FaEnvelope, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";

export default function OrderTimeline({ isOpen, onClose, orderId, order }) {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [customerAddress, setCustomerAddress] = useState(null);

  const fetchTimeline = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminOrderTimeline(orderId);
      const data = res.data || res;
      setTimeline(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load timeline. The order might not exist.");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  const fetchCustomerAddress = useCallback(async () => {
    try {
      const response = await getCustomerAddressHistory(1, 100);
      const payload = response?.data ?? response;
      const records = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.results)
          ? payload.results
          : Array.isArray(payload?.data?.results)
            ? payload.data.results
            : Array.isArray(payload?.data)
              ? payload.data
              : [];
      const orderPhone = String(
        order?.customer_phone || order?.consignee_phone || order?.phone || "",
      ).replace(/\D/g, "");
      const orderEmail = String(
        order?.customer_email || order?.consignee_email || order?.email || "",
      ).toLowerCase();
      const orderIdString = String(orderId);

      const matchingRecord = records.find((record) => {
        const recordOrderIds = [
          ...(Array.isArray(record.order_ids) ? record.order_ids : []),
          record.order_id,
          record.sale_order_id,
          record.order,
        ]
          .filter((id) => id !== undefined && id !== null)
          .map(String);
        const recordPhone = String(
          record.consignee_phone || record.customer_phone || record.phone || "",
        ).replace(/\D/g, "");
        const recordEmail = String(
          record.consignee_email || record.customer_email || record.email || "",
        ).toLowerCase();

        return (
          recordOrderIds.includes(orderIdString) ||
          (orderPhone && recordPhone === orderPhone) ||
          (orderEmail && recordEmail === orderEmail)
        );
      });

      setCustomerAddress(matchingRecord || null);
    } catch (addressError) {
      console.error("Failed to load customer address history:", addressError);
      setCustomerAddress(null);
    }
  }, [order, orderId]);

  useEffect(() => {
    if (isOpen && orderId) {
      fetchTimeline();
      fetchCustomerAddress();
    } else {
      setTimeline([]);
      setCustomerAddress(null);
    }
  }, [isOpen, orderId, fetchTimeline, fetchCustomerAddress]);

  // Helper to determine styling and icons based on the backend's "stage" string
  const getStageConfig = (stage, title) => {
    const s = stage.toUpperCase();
    const t = title.toLowerCase();

    if (s === "ORDER_PLACED") {
      return {
        icon: <FaBoxOpen />,
        bg: "bg-blue-100",
        text: "text-blue-600",
        border: "border-blue-200",
      };
    }
    if (s === "PAYMENT_SUCCESS") {
      return {
        icon: <FaCreditCard />,
        bg: "bg-emerald-100",
        text: "text-emerald-600",
        border: "border-emerald-200",
      };
    }
    if (s === "PAYMENT_FAILED") {
      return {
        icon: <FaCircleXmark />,
        bg: "bg-rose-100",
        text: "text-rose-600",
        border: "border-rose-200",
      };
    }
    if (s === "SHIPMENT_CREATED") {
      return {
        icon: <FaTruckFast />,
        bg: "bg-indigo-100",
        text: "text-indigo-600",
        border: "border-indigo-200",
      };
    }
    if (s === "TRANSIT_EVENT") {
      if (t.includes("delivered")) {
        return {
          icon: <FaCircleCheck />,
          bg: "bg-emerald-100",
          text: "text-emerald-600",
          border: "border-emerald-200",
        };
      }
      if (t.includes("rto") || t.includes("returned")) {
        return {
          icon: <FaClockRotateLeft />,
          bg: "bg-rose-100",
          text: "text-rose-600",
          border: "border-rose-200",
        };
      }
      return {
        icon: <FaLocationDot />,
        bg: "bg-amber-100",
        text: "text-amber-600",
        border: "border-amber-200",
      };
    }
    return {
      icon: <FaCircleCheck />,
      bg: "bg-slate-100",
      text: "text-slate-600",
      border: "border-slate-200",
    };
  };

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20, scale: 0.95 },
    show: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 200 },
    },
  };

  if (!isOpen) return null;

  const fixCurrencyEncoding = (text) => {
    if (!text || typeof text !== "string") return text;

    return text
      .replace(/â¹/g, "\u20B9")
      .replace(/â‚¹/g, "\u20B9")
      .replace(/₹/g, "\u20B9");
  };

  const customerName =
    order?.customer_name ||
    order?.consignee_name ||
    order?.customer?.name ||
    customerAddress?.consignee_name ||
    "-";
  const customerPhone =
    order?.customer_phone ||
    order?.consignee_phone ||
    order?.phone ||
    order?.customer?.phone ||
    customerAddress?.consignee_phone ||
    "";
  const customerEmail =
    order?.customer_email ||
    order?.consignee_email ||
    order?.email ||
    order?.customer?.email ||
    customerAddress?.consignee_email ||
    "";
  const address = [
    order?.drop_location ||
      order?.street_address ||
      order?.address_line ||
      order?.address ||
      customerAddress?.drop_location ||
      customerAddress?.street_address ||
      customerAddress?.address_line,
    order?.drop_city || order?.city || customerAddress?.drop_city || customerAddress?.city,
    order?.drop_state || order?.state || customerAddress?.drop_state || customerAddress?.state,
    order?.drop_pincode || order?.pincode || customerAddress?.drop_pincode || customerAddress?.pincode,
  ]
    .filter(Boolean)
    .join(", ");
  const phoneDigits = String(customerPhone).replace(/\D/g, "");
  const whatsappNumber =
    phoneDigits.length === 10 ? `91${phoneDigits}` : phoneDigits;
  const gmailComposeUrl = customerEmail
    ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(customerEmail)}&su=${encodeURIComponent(`Regarding EatPur Order #ORD-${orderId}`)}`
    : "";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Journey of Order #ORD-${orderId}`}
      maxWidth="max-w-2xl"
      footer={
        <div className="flex w-full flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={phoneDigits.length < 10}
              onClick={() =>
                window.open(`https://wa.me/${whatsappNumber}`, "_blank", "noopener,noreferrer")
              }
              className="inline-flex items-center gap-2 rounded-md bg-emerald-700 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FaWhatsapp aria-hidden="true" /> Push to WhatsApp
            </button>
            <button
              type="button"
              disabled={!gmailComposeUrl}
              onClick={() => window.open(gmailComposeUrl, "_blank", "noopener,noreferrer")}
              className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FaEnvelope aria-hidden="true" /> Send Email
            </button>
          </div>
          <MagicButton variant="neutral" onClick={onClose}>
            Close Timeline
          </MagicButton>
        </div>
      }
    >
      <div className="min-h-[400px] max-h-[70vh] overflow-y-auto custom-scrollbar p-2">
        <section className="mb-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 border-b border-slate-100 pb-3">
            <p className="text-xs font-semibold uppercase text-emerald-700">
              Customer contact
            </p>
          </div>

          <dl className="grid gap-4 text-sm sm:grid-cols-3">
            <div className="min-w-0">
              <dt className="text-xs font-semibold uppercase text-slate-400">Customer Name</dt>
              <dd className="mt-1 break-words font-semibold text-slate-900">{customerName}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase text-slate-400">Phone</dt>
              <dd className="mt-1 break-all text-slate-800">{customerPhone || "Not provided"}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase text-slate-400">Email</dt>
              <dd className="mt-1 break-all text-slate-800">{customerEmail || "Not provided"}</dd>
            </div>
            <div className="sm:col-span-3">
              <dt className="text-xs font-semibold uppercase text-slate-400">Delivery address</dt>
              <dd className="mt-1 leading-5 text-slate-800">{address || "Not provided"}</dd>
            </div>
          </dl>

        </section>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 opacity-50">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-medium">
              Reconstructing Timeline...
            </p>
          </div>
        ) : error ? (
          <div className="bg-rose-50 text-rose-600 p-4 rounded-xl border border-rose-200 text-center font-medium">
            {error}
          </div>
        ) : timeline.length === 0 ? (
          <div className="text-center text-slate-400 py-12 italic">
            No timeline events found for this order.
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="relative border-l-2 border-slate-100 ml-4 md:ml-6 space-y-8 pb-4 mt-2"
          >
            {timeline.map((event, index) => {
              const config = getStageConfig(event.stage, event.title);
              const dateObj = new Date(event.timestamp);
              const timeString = dateObj.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              });
              const dateString = dateObj.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });

              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="relative pl-8 md:pl-10"
                >
                  {/* Connecting Node Icon */}
                  <div
                    className={`absolute -left-[17px] top-1 flex items-center justify-center w-8 h-8 rounded-full border-4 border-white ${config.bg} ${config.text} shadow-sm z-10`}
                  >
                    <span className="text-[12px]">{config.icon}</span>
                  </div>

                  {/* Event Card */}
                  <div
                    className={`bg-white p-4 rounded-2xl border ${config.border} shadow-sm hover:shadow-md transition-shadow`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-2">
                      <h4 className={`font-bold text-base ${config.text}`}>
                        {event.title}
                      </h4>
                      <div className="flex flex-col md:items-end text-xs text-slate-400 font-mono">
                        <span className="font-bold text-slate-600">
                          {dateString}
                        </span>
                        <span>{timeString}</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {fixCurrencyEncoding(event.details)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </Modal>
  );
}
