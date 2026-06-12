// src/pages/Admin/Admin/UniComps/RadarMetricCard.jsx
import React from "react";
import CountUp from "./CountUp";

export default function RadarMetricCard({ title = "Total Views", value = 750000, suffix = "k" }) {
    // Convert 750000 to 750 for the display if suffix is 'k'
    const displayValue = suffix === "k" ? value / 1000 : value;

    return (
        <>
            <style>{`
        .ep-radar-outer {
          width: 100%;
          min-height: 200px;
          border-radius: 16px;
          padding: 2px;
          background: radial-gradient(circle 250px at 0% 0%, var(--color-eatpur-gold-light, #cbb98e), #1a1c1a);
          position: relative;
          overflow: hidden;
        }

        .ep-radar-dot {
          width: 6px;
          aspect-ratio: 1;
          position: absolute;
          background-color: var(--color-eatpur-gold-light, #cbb98e);
          box-shadow: 0 0 12px var(--color-eatpur-gold-light, #cbb98e);
          border-radius: 50%;
          z-index: 2;
          right: 10%;
          top: 10%;
          animation: epMoveDot 6s linear infinite;
        }

        @keyframes epMoveDot {
          0%, 100% { top: 10%; right: 10%; }
          25% { top: 10%; right: calc(100% - 35px); }
          50% { top: calc(100% - 30px); right: calc(100% - 35px); }
          75% { top: calc(100% - 30px); right: 10%; }
        }

        .ep-radar-card {
          z-index: 1;
          width: 100%;
          height: 100%;
          border-radius: 14px;
          background-color: #111312; /* Very dark charcoal */
          background-image: radial-gradient(var(--color-eatpur-dark, #2d3748) 1px, transparent 1px);
          background-size: 20px 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          flex-direction: column;
          color: var(--color-eatpur-white-warm, #fcfaf5);
        }

        .ep-radar-ray {
          width: 150%;
          height: 50px;
          border-radius: 100px;
          position: absolute;
          background-color: var(--color-eatpur-gold-light, #cbb98e);
          opacity: 0.15;
          box-shadow: 0 0 40px var(--color-eatpur-gold-light, #cbb98e);
          filter: blur(15px);
          transform-origin: 0% 50%;
          top: 0%;
          left: 0;
          animation: epSweep 8s linear infinite;
        }

        @keyframes epSweep {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .ep-radar-text {
          font-weight: 800;
          font-size: 3.5rem;
          background: linear-gradient(45deg, #ffffff 10%, var(--color-eatpur-gold-light, #cbb98e), #ffffff);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          font-family: var(--font-display, serif);
          line-height: 1.1;
        }

        .ep-radar-line {
          width: 100%;
          height: 1px;
          position: absolute;
          background-color: rgba(255,255,255,0.05);
        }
        .ep-radar-topl { top: 10%; background: linear-gradient(90deg, rgba(203,185,142,0.4) 30%, transparent 70%); }
        .ep-radar-bottoml { bottom: 10%; }
        .ep-radar-leftl { left: 10%; width: 1px; height: 100%; background: linear-gradient(180deg, rgba(203,185,142,0.4) 30%, transparent 70%); }
        .ep-radar-rightl { right: 10%; width: 1px; height: 100%; }
      `}</style>

            <div className="ep-radar-outer shadow-lg">
                <div className="ep-radar-dot"></div>
                <div className="ep-radar-card">
                    <div className="ep-radar-ray"></div>
                    <div className="ep-radar-text relative z-10">
                        <CountUp end={displayValue} />{suffix}
                    </div>
                    <div className="text-sm tracking-widest uppercase text-gray-400 mt-1 relative z-10" style={{ fontFamily: "var(--font-sans)" }}>
                        {title}
                    </div>

                    <div className="ep-radar-line ep-radar-topl"></div>
                    <div className="ep-radar-line ep-radar-leftl"></div>
                    <div className="ep-radar-line ep-radar-bottoml"></div>
                    <div className="ep-radar-line ep-radar-rightl"></div>
                </div>
            </div>
        </>
    );
}