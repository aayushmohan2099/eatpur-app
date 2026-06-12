// src/pages/Admin/Admin/UniComps/Modal.jsx
import React, { useEffect } from "react";

export default function Modal({
    isOpen,
    onClose,
    title,
    description,
    children,
    footer,
    maxWidth = "max-w-md",
    closeOnBackdropClick = true,
}) {
    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={() => closeOnBackdropClick && onClose?.()}
        >
            <div
                className={`bg-white rounded-xl shadow-xl w-full ${maxWidth} p-6 border border-[--color-eatpur-yellow-light] transform transition-all animate-in zoom-in-95 duration-200`}
                onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
            >
                {/* Header */}
                {(title || description) && (
                    <div className="mb-5">
                        {title && (
                            <h3
                                className="text-xl font-bold text-gray-900 mb-2"
                                style={{ fontFamily: "var(--font-display, serif)" }}
                            >
                                {title}
                            </h3>
                        )}
                        {description && (
                            <p
                                className="text-sm text-gray-600"
                                style={{ fontFamily: "var(--font-sans)" }}
                            >
                                {description}
                            </p>
                        )}
                    </div>
                )}

                {/* Body content */}
                <div style={{ fontFamily: "var(--font-sans)" }}>{children}</div>

                {/* Optional Footer (Usually Action Buttons) */}
                {footer && (
                    <div
                        className="flex justify-end gap-3 mt-6 pt-4 border-t border-[--color-eatpur-white-warm]"
                        style={{ fontFamily: "var(--font-sans)" }}
                    >
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}