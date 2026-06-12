// src/pages/Admin/Admin/UniComps/Card.jsx
import React from "react";

export default function Card({
    title,
    actionText,
    onActionClick,
    children,
    className = "",
    noPadding = false,
}) {
    return (
        <div
            className={`bg-white rounded-xl border border-[--color-eatpur-yellow-light] shadow-sm flex flex-col overflow-hidden ${className}`}
        >
            {/* Optional Card Header */}
            {(title || actionText) && (
                <div className="flex justify-between items-center px-6 py-5 border-b border-[--color-eatpur-white-warm]">
                    {title && (
                        <h2 className="text-lg font-semibold text-[--color-eatpur-dark]">
                            {title}
                        </h2>
                    )}
                    {actionText && (
                        <button
                            onClick={onActionClick}
                            className="text-sm font-medium text-[--color-eatpur-green-dark] hover:text-[--color-eatpur-gold-light] transition-colors"
                        >
                            {actionText}
                        </button>
                    )}
                </div>
            )}

            {/* Card Body */}
            <div className={`flex-1 ${noPadding ? "" : "p-6"}`}>{children}</div>
        </div>
    );
}