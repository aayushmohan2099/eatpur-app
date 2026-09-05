// src\pages\Admin\Admin\OrderComps\OrderTimeline.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "../UniComps/Modal";
import MagicButton from "../UniComps/MagicButton";
import { getAdminOrderTimeline } from "../../../../api/shop";
import {
  FaBoxOpen,
  FaCreditCard,
  FaTruckFast,
  FaLocationDot,
  FaCircleCheck,
  FaCircleXmark,
  FaClockRotateLeft,
} from "react-icons/fa6";

export default function OrderTimeline({ isOpen, onClose, orderId }) {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && orderId) {
      fetchTimeline();
    } else {
      setTimeline([]);
    }
  }, [isOpen, orderId]);

  const fetchTimeline = async () => {
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
  };

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Journey of Order #ORD-${orderId}`}
      maxWidth="max-w-2xl"
      footer={
        <div className="flex justify-end w-full">
          <MagicButton variant="neutral" onClick={onClose}>
            Close Timeline
          </MagicButton>
        </div>
      }
    >
      <div className="min-h-[400px] max-h-[70vh] overflow-y-auto custom-scrollbar p-2">
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
