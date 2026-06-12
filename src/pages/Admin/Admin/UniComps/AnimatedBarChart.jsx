// src/pages/Admin/Admin/UniComps/AnimatedBarChart.jsx
import React, { useState, useEffect } from "react";

export default function AnimatedBarChart({
    data = [
        { label: "Mon", value: 30 },
        { label: "Tue", value: 50 },
        { label: "Wed", value: 80 },
        { label: "Thu", value: 40 },
        { label: "Fri", value: 90 },
        { label: "Sat", value: 60 },
        { label: "Sun", value: 100 },
    ],
    title = "Weekly Engagement"
}) {
    const [mounted, setMounted] = useState(false);
    const maxValue = Math.max(...data.map(d => d.value));

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="bg-white p-6 rounded-2xl border border-[--color-eatpur-yellow-light] shadow-sm flex flex-col h-full min-h-[300px]">
            <h2 className="text-lg font-semibold text-[--color-eatpur-dark] mb-6" style={{ fontFamily: "var(--font-display, serif)" }}>
                {title}
            </h2>

            <div className="flex-1 flex items-end justify-between gap-2 mt-auto relative">
                {/* Horizontal grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                    <div className="w-full h-px bg-[--color-eatpur-dark]"></div>
                    <div className="w-full h-px bg-[--color-eatpur-dark]"></div>
                    <div className="w-full h-px bg-[--color-eatpur-dark]"></div>
                    <div className="w-full h-px bg-[--color-eatpur-dark]"></div>
                </div>

                {data.map((item, index) => {
                    const heightPercent = mounted ? (item.value / maxValue) * 100 : 0;
                    // Alternate colors for a natural gradient look
                    const isEven = index % 2 === 0;

                    return (
                        <div key={index} className="flex flex-col items-center w-full group z-10">
                            {/* Tooltip */}
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-2 text-xs font-bold text-[--color-eatpur-dark]">
                                {item.value}
                            </div>

                            {/* Bar (Leaf shaped top) */}
                            <div className="w-full max-w-[40px] bg-[--color-eatpur-white-warm] rounded-[20px_0_0_0] relative overflow-hidden h-[150px] sm:h-[200px] border border-[--color-eatpur-yellow-light]">
                                <div
                                    className={`absolute bottom-0 w-full rounded-[20px_0_0_0] transition-all duration-1000 ease-out ${isEven ? 'bg-[--color-eatpur-green-dark]' : 'bg-[--color-eatpur-gold-light]'}`}
                                    style={{
                                        height: `${heightPercent}%`,
                                        transitionDelay: `${index * 100}ms`
                                    }}
                                ></div>
                            </div>

                            {/* Label */}
                            <span className="mt-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {item.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}