// src/pages/Admin/Admin/UniComps/HotBadge.jsx
import React from "react";

export default function HotBadge({ text = "Trending" }) {
    return (
        <>
            <style>{`
        .ep-fire-wrapper {
          position: relative;
          width: 24px;
          height: 24px;
          transform: scale(0.6); /* Scaled down to fit nicely in text */
          transform-origin: center bottom;
        }

        .fire-center { animation: scaleUpDown 3s ease-out infinite both; position: absolute; height: 100%; width: 100%; }
        .fire-center .main-fire { position: absolute; width: 100%; height: 100%; background-image: radial-gradient(farthest-corner at 10px 0, #d43300 0%, #ef5a00 95%); transform: scaleX(0.8) rotate(45deg); border-radius: 0 40% 60% 40%; filter: drop-shadow(0 0 10px #d43322); }
        .fire-center .particle-fire { position: absolute; top: 60%; left: 45%; width: 10px; height: 10px; background-color: #ef5a00; border-radius: 50%; filter: drop-shadow(0 0 10px #d43322); animation: particleUp 2s ease-out infinite both; }

        .fire-right { animation: shake 2s ease-out infinite both; position: absolute; height: 100%; width: 100%; }
        .fire-right .main-fire { position: absolute; top: 15%; right: -25%; width: 80%; height: 80%; background-color: #ef5a00; transform: scaleX(0.8) rotate(45deg); border-radius: 0 40% 60% 40%; filter: drop-shadow(0 0 10px #d43322); }
        .fire-right .particle-fire { position: absolute; top: 45%; left: 50%; width: 15px; height: 15px; background-color: #ef5a00; transform: scaleX(0.8) rotate(45deg); border-radius: 50%; filter: drop-shadow(0 0 10px #d43322); animation: particleUp 2s ease-out infinite both; }

        .fire-left { animation: shake 3s ease-out infinite both; position: absolute; height: 100%; width: 100%; }
        .fire-left .main-fire { position: absolute; top: 15%; left: -20%; width: 80%; height: 80%; background-color: #ef5a00; transform: scaleX(0.8) rotate(45deg); border-radius: 0 40% 60% 40%; filter: drop-shadow(0 0 10px #d43322); }
        .fire-left .particle-fire { position: absolute; top: 10%; left: 20%; width: 10%; height: 10%; background-color: #ef5a00; border-radius: 50%; filter: drop-shadow(0 0 10px #d43322); animation: particleUp 3s infinite ease-out both; }

        .fire-bottom .main-fire { position: absolute; top: 30%; left: 20%; width: 75%; height: 75%; background-color: #ff7800; transform: scaleX(0.8) rotate(45deg); border-radius: 0 40% 100% 40%; filter: blur(5px); animation: fireglow 2s ease-out infinite both; }

        @keyframes scaleUpDown { 0%, 100% { transform: scaleY(1) scaleX(1); } 50%, 90% { transform: scaleY(1.1); } 75% { transform: scaleY(0.95); } 80% { transform: scaleX(0.95); } }
        @keyframes shake { 0%, 100% { transform: skewX(0) scale(1); } 50% { transform: skewX(5deg) scale(0.9); } }
        @keyframes particleUp { 0% { opacity: 0; } 20% { opacity: 1; } 80% { opacity: 1; } 100% { opacity: 0; top: -100%; transform: scale(0.5); } }
        @keyframes fireglow { 0%, 100% { background-color: #ef5a00; } 50% { background-color: #ff7800; } }
      `}</style>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200">
                <div className="ep-fire-wrapper">
                    <div className="fire-left"><div className="main-fire"></div><div className="particle-fire"></div></div>
                    <div className="fire-center"><div className="main-fire"></div><div className="particle-fire"></div></div>
                    <div className="fire-right"><div className="main-fire"></div><div className="particle-fire"></div></div>
                    <div className="fire-bottom"><div className="main-fire"></div></div>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 font-sans mt-0.5">
                    {text}
                </span>
            </div>
        </>
    );
}