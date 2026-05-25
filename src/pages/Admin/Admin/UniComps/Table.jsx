import React from "react";

export default function EatpurTable({
  columns,
  data = [],
  maxRows,
  showActions = true,
  onViewClick,
}) {
  // Slice data array cleanly if a maximum number of rows is passed
  const displayedData = maxRows ? data.slice(0, maxRows) : data;

  return (
    <div className="w-full overflow-hidden rounded-xl border border-[--color-eatpur-yellow-light] bg-white shadow-sm">
      {/* Dynamic Keyframes injected safely to keep button animations self-contained */}
      <style>{`
        .eatpur-view-btn {
          --fs: 0.8rem;
          --col1: var(--color-eatpur-white-warm);
          --col2: rgba(203, 185, 142, 0.35); /* Translucent Eatpur gold-light */
          --col3: var(--color-eatpur-green-dark);
          --col4: var(--color-eatpur-dark);
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

        .eatpur-view-btn:hover {
          color: var(--col4);
          background-color: var(--color-eatpur-gold-light);
        }

        .eatpur-view-btn:active {
          animation: eatpurOffset 1s ease-in-out infinite;
          outline: 2px solid var(--col2);
          outline-offset: 0;
        }

        .eatpur-view-btn::after,
        .eatpur-view-btn::before {
          content: '';
          align-self: center;
          justify-self: center;
          height: .5em;
          margin: 0 .4em 0 0;
          grid-column: 1;
          grid-row: 1;
          opacity: 1;
        }

        .eatpur-view-btn::after {
          position: relative;
          border: 2px solid var(--col4);
          border-radius: 50%;
          transition: all .5s ease-out;
          height: .12em;
          width: .12em;
        }

        .eatpur-view-btn:hover::after {
          border: 2px solid var(--col3);
          transform: rotate(-120deg) translate(10%, 140%);
        }

        .eatpur-view-btn::before {
          border-radius: 50% 0%;
          border: 4px solid var(--col1);
          transition: all 1s ease-out;
          transform: rotate(45deg);
          height: .45em;
          width: .45em;
        }

        .eatpur-view-btn:hover::before {
          border-radius: 50%;
          border: 4px solid var(--col1);
          transform: scale(1.15) rotate(0deg);
          animation: eatpurBlink 1.5s ease-out 1s infinite alternate;
        }

        .eatpur-view-btn:hover > span {
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

      <div className="overflow-x-auto">
        <table
          className="w-full text-left border-collapse"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          <thead>
            <tr className="border-b border-[--color-eatpur-yellow-light] bg-[--color-eatpur-white-warm]">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className="px-6 py-4 text-xs font-semibold tracking-wider uppercase text-[--color-eatpur-dark]"
                >
                  {col.header}
                </th>
              ))}
              {showActions && (
                <th className="px-6 py-4 text-xs font-semibold tracking-wider uppercase text-[--color-eatpur-dark] text-right">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-[--color-eatpur-white-warm]">
            {displayedData.length > 0 ? (
              displayedData.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className="hover:bg-[--color-eatpur-white-warm]/40 transition-colors duration-150 border-b border-[--color-eatpur-yellow-light] last:border-none"
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={colIdx}
                      className="px-6 py-3.5 text-sm font-normal text-[--color-eatpur-text]"
                    >
                      {row[col.accessor] !== undefined &&
                      row[col.accessor] !== null
                        ? React.isValidElement(row[col.accessor])
                          ? row[col.accessor]
                          : String(row[col.accessor])
                        : "—"}
                    </td>
                  ))}

                  {showActions && (
                    <td className="px-6 py-3.5 text-sm text-right whitespace-nowrap">
                      <div className="inline-flex justify-end w-full">
                        <button
                          onClick={() => onViewClick?.(row)}
                          className="eatpur-view-btn"
                        >
                          <span>View more</span>
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (showActions ? 1 : 0)}
                  className="px-6 py-12 text-center text-sm font-medium text-[--color-eatpur-text-light]"
                >
                  No data records available to display.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
