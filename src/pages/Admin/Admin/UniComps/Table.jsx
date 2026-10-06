// src/pages/Admin/Admin/UniComps/Table.jsx
import React from "react";

export default function EatpurTable({
  columns,
  data = [],
  maxRows,
  showActions = true,
  onViewClick,
  selectable = false,
  selectedIds = [],
  onToggleRow,
  onToggleAll,
  currentPage = 1,     
  itemsPerPage = 10,    
}) {
  // Slice data array cleanly if a maximum number of rows is passed
  const displayedData = maxRows ? data.slice(0, maxRows) : data;
  const allDisplayedRowsSelected =
    displayedData.length > 0 &&
    displayedData.every((row) => selectedIds.includes(String(row.id)));
  const selectionColumn = columns.find(
    (column) => column.header?.toLowerCase() === "select",
  );

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

      <div className="space-y-2 p-2 md:hidden">
        {displayedData.length > 0 ? (
          displayedData.map((row, rowIdx) => (
            <article
              key={row.id ?? rowIdx}
              className="rounded-lg border border-[--color-eatpur-yellow-light] bg-[--color-eatpur-white-warm] p-3 shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between gap-3 border-b border-[--color-eatpur-yellow-light] pb-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-[--color-eatpur-text-light]">
                  Record {row.rowNumber ?? ((currentPage - 1) * itemsPerPage + rowIdx + 1)}
                </span>
                {selectionColumn ? (
                  <div className="flex h-8 w-8 items-center justify-center">
                    {row[selectionColumn.accessor]}
                  </div>
                ) : selectable ? (
                  <input
                    type="checkbox"
                    aria-label={`Select order ${row.id}`}
                    checked={selectedIds.includes(String(row.id))}
                    onChange={(event) => onToggleRow?.(row, event.target.checked)}
                    className="h-5 w-5 cursor-pointer accent-emerald-700"
                  />
                ) : null}
              </div>
              <dl className="grid grid-cols-1 gap-2">
                {columns.filter((column) => column !== selectionColumn).map((col, colIdx) => {
                  const value = row[col.accessor];
                  const isCustomContent = React.isValidElement(value);
                  const isWideField = /location|address/i.test(String(col.header || ""));
                  const layoutClass = isCustomContent || isWideField
                    ? "grid-cols-1 gap-y-1"
                    : "grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)] items-start";

                  return (
                    <div key={colIdx} className={`grid min-w-0 gap-x-3 ${layoutClass}`}>
                      <dt className="text-xs font-semibold text-[--color-eatpur-text-light]">{col.header}</dt>
                      <dd className={`min-w-0 w-full break-words text-sm text-[--color-eatpur-text] ${isCustomContent || isWideField ? "text-left" : "text-right"}`}>
                        {value !== undefined && value !== null
                          ? isCustomContent
                            ? value
                            : String(value)
                          : "—"}
                      </dd>
                    </div>
                  );
                })}
              </dl>
              {showActions && (
                <button
                  type="button"
                  onClick={() => onViewClick?.(row)}
                  className="mt-3 flex min-h-11 w-full items-center justify-center rounded-md bg-[#3A5A1C] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#2E2410] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3A5A1C] focus-visible:ring-offset-2"
                >
                  View more
                </button>
              )}
            </article>
          ))
        ) : (
          <p className="px-4 py-10 text-center text-sm font-medium text-[--color-eatpur-text-light]">
            No data records available to display.
          </p>
        )}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table
          className="w-full text-left border-collapse"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          <thead>
            <tr className="border-b border-[--color-eatpur-yellow-light] bg-[--color-eatpur-white-warm]">
              {selectable && (
                <th className="w-12 px-3 py-4 text-center">
                  <input
                    type="checkbox"
                    aria-label="Select all orders on this page"
                    checked={allDisplayedRowsSelected}
                    onChange={(event) =>
                      onToggleAll?.(displayedData, event.target.checked)
                    }
                    className="h-4 w-4 cursor-pointer accent-emerald-700"
                  />
                </th>
              )}
              <th className="px-6 py-4 text-xs font-semibold tracking-wider uppercase text-[--color-eatpur-dark] w-16">
                S.No.
              </th>
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
                  {/* YAHAN S.NO CALCULATION CHANGE KI HAI */}
                  {selectable && (
                    <td className="w-12 px-3 py-3.5 text-center">
                      <input
                        type="checkbox"
                        aria-label={`Select order ${row.id}`}
                        checked={selectedIds.includes(String(row.id))}
                        onChange={(event) =>
                          onToggleRow?.(row, event.target.checked)
                        }
                        className="h-4 w-4 cursor-pointer accent-emerald-700"
                      />
                    </td>
                  )}
                  <td className="px-6 py-3.5 text-sm font-semibold text-[--color-eatpur-dark]">
                    {row.rowNumber ?? ((currentPage - 1) * itemsPerPage + rowIdx + 1)}
                  </td>
                  
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
                  colSpan={columns.length + 1 + (showActions ? 1 : 0) + (selectable ? 1 : 0)}
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