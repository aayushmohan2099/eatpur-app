// src/pages/Admin/Admin/UniComps/AlertToast.jsx
import React from "react";

export default function AlertToast({ type = "info", message }) {
    const config = {
        success: {
            wrapper: "bg-emerald-50 border-emerald-500 text-emerald-900 hover:bg-emerald-100",
            iconColor: "text-emerald-600",
            icon: <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        },
        info: {
            wrapper: "bg-blue-50 border-blue-500 text-blue-900 hover:bg-blue-100",
            iconColor: "text-blue-600",
            icon: <path d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        },
        warning: {
            wrapper: "bg-amber-50 border-amber-500 text-amber-900 hover:bg-amber-100",
            iconColor: "text-amber-500",
            icon: <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        },
        error: {
            wrapper: "bg-rose-50 border-rose-500 text-rose-900 hover:bg-rose-100",
            iconColor: "text-rose-600",
            icon: <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        }
    };

    const current = config[type] || config.info;

    return (
        <div
            role="alert"
            className={`border-l-4 p-3 rounded-r-lg flex items-center transition duration-300 ease-in-out transform hover:scale-[1.02] shadow-sm ${current.wrapper}`}
            style={{ fontFamily: "var(--font-sans)" }}
        >
            <svg
                stroke="currentColor"
                viewBox="0 0 24 24"
                fill="none"
                className={`h-5 w-5 flex-shrink-0 mr-3 ${current.iconColor}`}
                xmlns="http://www.w3.org/2000/svg"
            >
                {current.icon}
            </svg>
            <p className="text-sm font-medium">{message}</p>
        </div>
    );
}