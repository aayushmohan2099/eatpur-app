// src/pages/Admin/Admin/UniComps/Badge.jsx
import React from "react";

const typeStyles = {
    success: "bg-emerald-100 text-emerald-800 border-emerald-200",
    warning: "bg-amber-100 text-amber-800 border-amber-200",
    danger: "bg-rose-100 text-rose-800 border-rose-200",
    info: "bg-blue-100 text-blue-800 border-blue-200",
    neutral: "bg-slate-100 text-slate-800 border-slate-200",
    eatpur: "bg-[--color-eatpur-white-warm] text-[--color-eatpur-green-dark] border-[--color-eatpur-yellow-light]",
};

export default function Badge({ text, type = "neutral", icon }) {
    const currentStyle = typeStyles[type] || typeStyles.neutral;

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${currentStyle}`}
            style={{ fontFamily: "var(--font-sans)" }}
        >
            {icon && <span>{icon}</span>}
            {text}
        </span>
    );
}