// src/pages/Admin/Admin/UniComps/EatpurKpiCard.jsx
import React, { useEffect, useState } from "react";
import CountUp from "./CountUp";

export default function EatpurKpiCard({ title, value, prefix, percent, icon, color = "eatpur" }) {
    const [fillWidth, setFillWidth] = useState(0);

    // Colors mapped to Eatpur theme
    const themeMap = {
        eatpur: { bg: "bg-[--color-eatpur-green-dark]", text: "text-[--color-eatpur-green-dark]", bar: "#4C7A4F" },
        gold: { bg: "bg-[--color-eatpur-gold-light]", text: "text-[#b39e6a]", bar: "#cbb98e" },
        warning: { bg: "bg-amber-500", text: "text-amber-600", bar: "#f59e0b" },
        danger: { bg: "bg-rose-500", text: "text-rose-600", bar: "#ef4444" },
    };

    const theme = themeMap[color] || themeMap.eatpur;

    // Trigger progress bar animation on mount
    useEffect(() => {
        const timer = setTimeout(() => setFillWidth(percent), 100);
        return () => clearTimeout(timer);
    }, [percent]);

    return (
        <div className="bg-white p-6 rounded-2xl border border-[--color-eatpur-yellow-light] shadow-sm hover:shadow-md transition-shadow duration-300 relative overflow-hidden group">
            {/* Decorative leaf-like background blob */}
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-[--color-eatpur-white-warm] rounded-[40px_0_40px_40px] opacity-50 transform rotate-12 transition-transform duration-500 group-hover:scale-110"></div>

            <div className="flex items-center relative z-10">
                {/* Leaf-shaped icon container */}
                <span className={`relative flex items-center justify-center w-10 h-10 ${theme.bg} text-white rounded-[16px_4px_16px_16px] shadow-sm`}>
                    {icon || (
                        <svg width="20" fill="currentColor" height="20" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1362 1185q0 153-99.5 263.5t-258.5 136.5v175q0 14-9 23t-23 9h-135q-13 0-22.5-9.5t-9.5-22.5v-175q-66-9-127.5-31t-101.5-44.5-74-48-46.5-37.5-17.5-18q-17-21-2-41l103-135q7-10 23-12 15-2 24 9l2 2q113 99 243 125 37 8 74 8 81 0 142.5-43t61.5-122q0-28-15-53t-33.5-42-58.5-37.5-66-32-80-32.5q-39-16-61.5-25t-61.5-26.5-62.5-31-56.5-35.5-53.5-42.5-43.5-49-35.5-58-21-66.5-8.5-78q0-138 98-242t255-134v-180q0-13 9.5-22.5t22.5-9.5h135q14 0 23 9t9 23v176q57 6 110.5 23t87 33.5 63.5 37.5 39 29 15 14q17 18 5 38l-81 146q-8 15-23 16-14 3-27-7-3-3-14.5-12t-39-26.5-58.5-32-74.5-26-85.5-11.5q-95 0-155 43t-60 111q0 26 8.5 48t29.5 41.5 39.5 33 56 31 60.5 27 70 27.5q53 20 81 31.5t76 35 75.5 42.5 62 50 53 63.5 31.5 76.5 13 94z"></path>
                        </svg>
                    )}
                </span>
                <p className="ml-3 text-[--color-eatpur-dark] font-medium text-lg tracking-wide" style={{ fontFamily: "var(--font-sans)" }}>
                    {title}
                </p>
                <p className={`ml-auto font-semibold flex items-center text-sm ${theme.text}`}>
                    {percent > 0 ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1792 1792" fill="currentColor" className="w-3 h-3 mr-1">
                            <path d="M1408 1216q0 26-19 45t-45 19h-896q-26 0-45-19t-19-45 19-45l448-448q19-19 45-19t45 19l448 448q19 19 19 45z"></path>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1792 1792" fill="currentColor" className="w-3 h-3 mr-1 rotate-180">
                            <path d="M1408 1216q0 26-19 45t-45 19h-896q-26 0-45-19t-19-45 19-45l448-448q19-19 45-19t45 19l448 448q19 19 19 45z"></path>
                        </svg>
                    )}
                    {Math.abs(percent)}%
                </p>
            </div>

            <div className="mt-5 relative z-10">
                <p className="text-3xl font-bold text-[--color-eatpur-dark] mb-4" style={{ fontFamily: "var(--font-display, serif)" }}>
                    <CountUp end={value} prefix={prefix} />
                </p>

                {/* Animated Progress Bar */}
                <div className="w-full h-1.5 bg-[--color-eatpur-white-warm] rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${fillWidth}%`, backgroundColor: theme.bar }}
                    ></div>
                </div>
            </div>
        </div>
    );
}