// src/pages/Admin/Admin/OrderComps/OrderHeader.jsx
import React, { useState, useEffect } from "react";
import { motion, animate, useMotionValue, useTransform } from "framer-motion";
import { getAdminOrderStats } from "../../../../api/shop";
import {
  FaBagShopping,
  FaMoneyBillTrendUp,
  FaClockRotateLeft,
  FaBoxOpen,
} from "react-icons/fa6";

// Helper component for smooth number counting animation
const AnimatedCounter = ({
  from = 0,
  to,
  duration = 1.2,
  isCurrency = false,
}) => {
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => {
    if (isCurrency) {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(latest);
    }
    return Math.floor(latest).toLocaleString("en-IN");
  });

  const [display, setDisplay] = useState(
    isCurrency
      ? new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        }).format(from)
      : from.toLocaleString("en-IN"),
  );

  useEffect(() => {
    const controls = animate(count, to, { duration, ease: "easeOut" });
    const unsubscribe = rounded.on("change", (latest) => setDisplay(latest));

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [to, count, rounded, duration]);

  return <>{display}</>;
};

export default function OrderHeader() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getAdminOrderStats();
        setStats(res.data || res);
      } catch (error) {
        console.error("Failed to load order statistics", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Compute KPI values safely
  const totalOrders = stats?.global_totals?.orders || 0;
  const totalRevenue = parseFloat(stats?.global_totals?.revenue || 0);

  // Pending = Payments not yet cleared
  const pendingPaymentsCount = stats?.status_matrix?.PENDING?.total_count || 0;

  // To Dispatch = Paid but Unfulfilled
  const toDispatchCount =
    stats?.status_matrix?.PAID?.fulfillment_breakdown?.UNFULFILLED?.count || 0;

  const kpis = [
    {
      title: "Total Orders",
      value: totalOrders,
      icon: <FaBagShopping size={24} />,
      colors: "bg-blue-50 text-blue-600 border-blue-200",
      isCurrency: false,
    },
    {
      title: "Total Revenue",
      value: totalRevenue,
      icon: <FaMoneyBillTrendUp size={24} />,
      colors: "bg-emerald-50 text-emerald-600 border-emerald-200",
      isCurrency: true,
    },
    {
      title: "To Dispatch",
      value: toDispatchCount,
      icon: <FaBoxOpen size={24} />,
      colors: "bg-amber-50 text-amber-600 border-amber-200",
      isCurrency: false,
    },
    {
      title: "Pending Payments",
      value: pendingPaymentsCount,
      icon: <FaClockRotateLeft size={24} />,
      colors: "bg-rose-50 text-rose-600 border-rose-200",
      isCurrency: false,
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 bg-white border border-slate-200 rounded-2xl animate-pulse shadow-sm"
          ></div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.1 },
        },
      }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
    >
      {kpis.map((kpi, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { type: "spring", stiffness: 300 },
            },
          }}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow duration-300"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              {kpi.title}
            </p>
            <h3 className="text-2xl md:text-3xl font-display font-bold text-[--color-eatpur-dark]">
              <AnimatedCounter to={kpi.value} isCurrency={kpi.isCurrency} />
            </h3>
          </div>
          <div
            className={`w-14 h-14 rounded-xl flex items-center justify-center border shadow-inner ${kpi.colors}`}
          >
            {kpi.icon}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
