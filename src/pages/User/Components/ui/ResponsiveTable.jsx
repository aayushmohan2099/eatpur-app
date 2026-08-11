// src/pages/User/Components/ui/ResponsiveTable.jsx
import React from "react";
import { motion } from "framer-motion";

export default function ResponsiveTable({
  columns,
  data,
  emptyMessage = "No records found.",
  onRowClick = null,
}) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full p-8 text-center bg-white rounded-2xl border-2 border-dashed border-[--color-eatpur-gray-light] text-[--color-eatpur-text-light] font-serif italic">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* ======================================================== */}
      {/* DESKTOP VIEW (Standard Table)                            */}
      {/* ======================================================== */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-2xl border border-[--color-eatpur-border] shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[--color-eatpur-white-warm] border-b-2 border-[--color-eatpur-green-light]">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className="px-6 py-4 font-display font-bold text-[--color-eatpur-dark] text-sm uppercase tracking-wider"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[--color-eatpur-border]">
            {data.map((row, rowIndex) => (
              <motion.tr
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: rowIndex * 0.05 }}
                key={rowIndex}
                onClick={() => onRowClick && onRowClick(row)}
                className={`transition-colors ${onRowClick ? "cursor-pointer hover:bg-[--color-eatpur-bg-light]" : ""}`}
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-6 py-4 text-sm text-[--color-eatpur-text] font-medium"
                  >
                    {/* Check if a custom render function was provided for this column, otherwise use raw data */}
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ======================================================== */}
      {/* MOBILE VIEW (Card Stack)                                 */}
      {/* ======================================================== */}
      <div className="md:hidden flex flex-col gap-4">
        {data.map((row, rowIndex) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: rowIndex * 0.05 }}
            key={rowIndex}
            onClick={() => onRowClick && onRowClick(row)}
            className={`bg-white p-5 rounded-2xl border-2 border-[--color-eatpur-border] shadow-[0_4px_10px_rgba(0,0,0,0.03)] border-b-[4px] flex flex-col gap-3 ${onRowClick ? "cursor-pointer active:scale-95 active:border-b-2 transition-transform" : ""}`}
          >
            {columns.map((col, colIndex) => (
              <div
                key={colIndex}
                className="flex justify-between items-center gap-4"
              >
                <span className="text-[11px] font-bold uppercase tracking-wider text-[--color-eatpur-text-light]">
                  {col.header}
                </span>
                <span className="text-sm font-semibold text-[--color-eatpur-dark] text-right break-words max-w-[60%]">
                  {col.render ? col.render(row) : row[col.accessor]}
                </span>
              </div>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
