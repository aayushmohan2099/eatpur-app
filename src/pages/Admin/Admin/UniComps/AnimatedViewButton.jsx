// src/pages/Admin/Admin/UniComps/AnimatedViewButton.jsx
import React from "react";

export default function AnimatedViewButton({
    onClick,
    text = "View more",
    className = "",
}) {
    return (
        <>
            <style>{`
        .eatpur-view-btn-standalone {
          --fs: 0.8rem;
          --col1: var(--color-eatpur-white-warm, #fcfaf5);
          --col2: rgba(203, 185, 142, 0.35); 
          --col3: var(--color-eatpur-green-dark, #4C7A4F);
          --col4: var(--color-eatpur-dark, #2d3748);
          --pd: 0.35em 0.8em;
          display: grid;
          align-content: baseline;
          appearance: none;
          border: 0;
          grid-template-columns: min-content 1fr;
          padding: var(--pd);
          font-size: var(--fs);
          color: var(--col1);
          background-color: var(--col3);
          border-radius: 6px;
          position: relative;
          transition: all .75s ease-out;
          transform-origin: center;
          cursor: pointer;
          font-family: var(--font-sans);
          font-weight: 500;
          letter-spacing: 0.025em;
        }

        .eatpur-view-btn-standalone:hover {
          color: var(--col4);
          background-color: var(--color-eatpur-gold-light, #cbb98e);
        }

        .eatpur-view-btn-standalone:active {
          animation: eatpurOffset 1s ease-in-out infinite;
          outline: 2px solid var(--col2);
          outline-offset: 0;
        }

        .eatpur-view-btn-standalone::after,
        .eatpur-view-btn-standalone::before {
          content: '';
          align-self: center;
          justify-self: center;
          height: .5em;
          margin: 0 .4em 0 0;
          grid-column: 1;
          grid-row: 1;
          opacity: 1;
        }

        .eatpur-view-btn-standalone::after {
          position: relative;
          border: 2px solid var(--col4);
          border-radius: 50%;
          transition: all .5s ease-out;
          height: .12em;
          width: .12em;
        }

        .eatpur-view-btn-standalone:hover::after {
          border: 2px solid var(--col3);
          transform: rotate(-120deg) translate(10%, 140%);
        }

        .eatpur-view-btn-standalone::before {
          border-radius: 50% 0%;
          border: 4px solid var(--col1);
          transition: all 1s ease-out;
          transform: rotate(45deg);
          height: .45em;
          width: .45em;
        }

        .eatpur-view-btn-standalone:hover::before {
          border-radius: 50%;
          border: 4px solid var(--col1);
          transform: scale(1.15) rotate(0deg);
          animation: eatpurBlink 1.5s ease-out 1s infinite alternate;
        }

        .eatpur-view-btn-standalone:hover > span {
          filter: contrast(150%);
        }

        @keyframes eatpurBlink {
          0%, 10%, 35%, 45%, 100% { transform: scale(1, 1) skewX(0deg); opacity: 1; }
          5% { transform: scale(1.5, .1) skewX(10deg); opacity: .5; }
          40% { transform: scale(1.5, .1) skewX(10deg); opacity: .25; }
        }

        @keyframes eatpurOffset {
          50% { outline-offset: .15em; outline-color: var(--col1); }
          55% { outline-offset: .1em; transform: translateY(1px); }
          80%, 100% { outline-offset: 0; }
        }
      `}</style>

            <button onClick={onClick} className={`eatpur-view-btn-standalone ${className}`}>
                <span>{text}</span>
            </button>
        </>
    );
}