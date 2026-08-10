import React from "react";

const MilletButton = ({
  children,
  text,
  className = "",
  disabled,
  onClick,
  type = "button",
  ...props
}) => {
  return (
    <div className={`millet-btn-wrapper ${className}`}>
      {/* 
              The SVG is inlined to allow individual elements (leaves, stems, heads) 
              to be animated independently for a true, organic wind effect. 
            */}
      <div className="millet-plant" aria-hidden="true">
        <svg viewBox="0 0 240 260" xmlns="http://www.w3.org/2000/svg">
          {/* Back Left Leaf */}
          <g className="millet-leaf millet-leaf-left">
            <path
              d="M120 260 Q 60 220 40 100 Q 80 150 120 230 Z"
              fill="#597F1F"
            />
            <path
              d="M120 260 Q 60 220 40 100 Q 50 160 120 240 Z"
              fill="#83AD2A"
            />
          </g>

          {/* Back Right Leaf */}
          <g className="millet-leaf millet-leaf-right">
            <path
              d="M120 260 Q 180 230 210 120 Q 160 160 120 230 Z"
              fill="#4B6E16"
            />
            <path
              d="M120 260 Q 180 230 210 120 Q 190 170 120 240 Z"
              fill="#6A9221"
            />
          </g>

          {/* Left Millet Head & Stem */}
          <g className="millet-head millet-head-left">
            <path
              d="M110 250 Q 90 180 75 120"
              stroke="#79A327"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
            {/* Seed texture trick: heavy dashed strokes over a solid base */}
            <path
              d="M75 120 Q 65 90 60 60"
              stroke="#C88E17"
              strokeWidth="16"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M75 120 Q 65 90 60 60"
              stroke="#F5C23D"
              strokeWidth="16"
              strokeLinecap="round"
              strokeDasharray="0.1 14"
              fill="none"
            />
          </g>

          {/* Center Millet Head & Stem */}
          <g className="millet-head millet-head-center">
            <path
              d="M120 250 Q 125 150 130 90"
              stroke="#79A327"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M130 90 Q 135 60 140 25"
              stroke="#C88E17"
              strokeWidth="18"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M130 90 Q 135 60 140 25"
              stroke="#F5C23D"
              strokeWidth="18"
              strokeLinecap="round"
              strokeDasharray="0.1 16"
              fill="none"
            />
          </g>

          {/* Right Millet Head & Stem */}
          <g className="millet-head millet-head-right">
            <path
              d="M130 250 Q 160 170 180 110"
              stroke="#79A327"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M180 110 Q 190 80 195 50"
              stroke="#C88E17"
              strokeWidth="15"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M180 110 Q 190 80 195 50"
              stroke="#F5C23D"
              strokeWidth="15"
              strokeLinecap="round"
              strokeDasharray="0.1 13"
              fill="none"
            />
          </g>

          {/* Front Small Leaf (overlaps stems) */}
          <g className="millet-leaf millet-leaf-front">
            <path
              d="M110 260 Q 80 180 100 130 Q 130 180 140 260 Z"
              fill="#6A9221"
            />
            <path
              d="M110 260 Q 80 180 100 130 Q 110 180 120 260 Z"
              fill="#88B82B"
            />
          </g>
        </svg>
      </div>

      <button
        className="millet-btn"
        disabled={disabled}
        onClick={onClick}
        type={type}
        {...props}
      >
        {text || children}
      </button>

      <style>{`
                /* Wrapper limits and positions */
                .millet-btn-wrapper {
                    position: relative;
                    display: inline-flex;
                    justify-content: center;
                    /* DO NOT use overflow: hidden here, we want the plant to extend beyond bounds */
                    margin-top: 140px; /* Provides space for the plant to emerge above */
                }

                /* --- BUTTON STYLES --- */
                .millet-btn {
                    position: relative;
                    z-index: 2;
                    min-width: 260px;
                    height: 80px;
                    padding: 0 40px;
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    border-radius: 22px;
                    background: linear-gradient(135deg, #7B8F2A 0%, #667A20 100%);
                    box-shadow: 
                        0 10px 24px rgba(45, 65, 15, 0.18),
                        inset 0 1px 2px rgba(255, 255, 255, 0.25);
                    color: #F9FBE7;
                    font-family: system-ui, -apple-system, sans-serif;
                    font-size: 1.15rem;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                    cursor: pointer;
                    outline: none;
                    transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
                }

                .millet-btn-wrapper:hover .millet-btn {
                    transform: translateY(-2px);
                    background: linear-gradient(135deg, #859A2F 0%, #6E8423 100%);
                    box-shadow: 
                        0 16px 34px rgba(45, 65, 15, 0.28),
                        inset 0 1px 2px rgba(255, 255, 255, 0.3);
                }

                .millet-btn:active {
                    transform: translateY(2px);
                    box-shadow: 0 4px 12px rgba(45, 65, 15, 0.15);
                }

                /* --- MILLET PLANT DEFAULT & REVEAL STATE --- */
                .millet-plant {
                    position: absolute;
                    bottom: 30px; /* Starts hidden deep behind the button */
                    left: 50%;
                    width: clamp(140px, 18vw, 180px);
                    z-index: 1;
                    pointer-events: none;
                    
                    /* Reveal Animation Defaults */
                    opacity: 0;
                    transform: translateX(-50%) translateY(45px) scale(0.75);
                    transition: 
                        opacity 0.45s ease-out,
                        transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
                }

                .millet-btn-wrapper:hover .millet-plant {
                    opacity: 1;
                    transform: translateX(-50%) translateY(5px) scale(1);
                }

                /* --- INDIVIDUAL SVG WIND ANIMATIONS --- */
                /* Transform origins mapped exactly to the SVG path bases */
                .millet-leaf-left {
                    transform-origin: 120px 260px;
                    animation: sway-leaf-l 5.2s ease-in-out infinite;
                }
                .millet-leaf-right {
                    transform-origin: 120px 260px;
                    animation: sway-leaf-r 6.1s ease-in-out infinite;
                }
                .millet-leaf-front {
                    transform-origin: 120px 260px;
                    animation: sway-leaf-f 4.5s ease-in-out infinite;
                }
                
                .millet-head-left {
                    transform-origin: 110px 250px;
                    animation: sway-head-l 4.8s ease-in-out infinite 0.2s;
                }
                .millet-head-center {
                    transform-origin: 120px 250px;
                    animation: sway-head-c 5.5s ease-in-out infinite 0.5s;
                }
                .millet-head-right {
                    transform-origin: 130px 250px;
                    animation: sway-head-r 5.1s ease-in-out infinite 0.1s;
                }

                /* KEYFRAMES FOR ORGANIC SWAYING */
                /* Movements are intentionally tiny (0.5 to 2.5 degrees max) to simulate gentle wind */
                
                @keyframes sway-leaf-l {
                    0%, 100% { transform: rotate(0deg); }
                    33% { transform: rotate(-2.5deg); }
                    66% { transform: rotate(1.2deg); }
                }
                
                @keyframes sway-leaf-r {
                    0%, 100% { transform: rotate(0deg); }
                    40% { transform: rotate(2.2deg); }
                    75% { transform: rotate(-1.5deg); }
                }

                @keyframes sway-leaf-f {
                    0%, 100% { transform: rotate(0deg); }
                    30% { transform: rotate(1.5deg); }
                    70% { transform: rotate(-1.0deg); }
                }

                @keyframes sway-head-l {
                    0%, 100% { transform: rotate(0deg); }
                    35% { transform: rotate(-1.5deg); }
                    65% { transform: rotate(0.8deg); }
                }

                @keyframes sway-head-c {
                    0%, 100% { transform: rotate(0deg); }
                    45% { transform: rotate(1.2deg); }
                    75% { transform: rotate(-1.2deg); }
                }

                @keyframes sway-head-r {
                    0%, 100% { transform: rotate(0deg); }
                    35% { transform: rotate(1.8deg); }
                    70% { transform: rotate(-1.0deg); }
                }

                /* --- ACCESSIBILITY / REDUCED MOTION --- */
                @media (prefers-reduced-motion: reduce) {
                    .millet-plant {
                        transition: opacity 0.3s ease;
                        transform: translateX(-50%) translateY(5px) scale(1) !important;
                    }
                    .millet-btn-wrapper:hover .millet-plant {
                        transform: translateX(-50%) translateY(5px) scale(1) !important;
                    }
                    .millet-leaf-left, .millet-leaf-right, .millet-leaf-front,
                    .millet-head-left, .millet-head-center, .millet-head-right {
                        animation: none !important;
                    }
                    .millet-btn {
                        transition: box-shadow 0.2s ease, background 0.2s ease;
                    }
                    .millet-btn-wrapper:hover .millet-btn {
                        transform: none;
                    }
                }
            `}</style>
    </div>
  );
};

export default MilletButton;
