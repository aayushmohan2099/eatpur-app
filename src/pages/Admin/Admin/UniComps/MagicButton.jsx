// src/pages/Admin/Admin/UniComps/MagicButton.jsx
import React from "react";

const colorMap = {
  primary: "#3b82f6", // Blue
  success: "#10b981", // Emerald Green
  danger: "#ef4444", // Red
  warning: "#f59e0b", // Amber/Orange
  eatpur: "var(--color-eatpur-green-dark, #4C7A4F)", // Eatpur Brand Green
  dark: "var(--color-eatpur-dark, #2d3748)",
};

export default function MagicButton({
  children,
  variant = "eatpur",
  onClick,
  disabled = false,
  className = "",
  type = "button",
}) {
  const activeColor = colorMap[variant] || colorMap.eatpur;

  return (
    <>
      <style>{`
              .magic-action-btn {
                font-family: var(--font-sans, inherit);
                display: inline-block;
                min-width: 8em;
                padding: 0 1.5em;
                height: 2.2em;
                line-height: 2.1em;
                overflow: hidden;
                cursor: pointer;
                font-size: 13px;
                font-weight: 500;
                z-index: 1;
                color: var(--magic-color);
                border: 1.5px solid var(--magic-color);
                border-radius: 6px;
                position: relative;
                background: transparent;
                transition: color 0.3s ease;
                text-align: center;
              }

              .magic-action-btn::before {
                content: "";
                position: absolute;
                inset: 0;
                background: var(--magic-color);
                z-index: -1;
                transform: scaleX(0);
                transform-origin: left;
                transition: transform 0.3s ease;
              }

              .magic-action-btn:not(:disabled):hover {
                color: white;
              }

              .magic-action-btn:not(:disabled):hover::before {
                transform: scaleX(1);
              }

              .magic-action-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                filter: grayscale(100%);
              }
      `}</style>

      <button
        type={type}
        className={`magic-action-btn ${className}`}
        style={{ "--magic-color": activeColor }}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    </>
  );
}