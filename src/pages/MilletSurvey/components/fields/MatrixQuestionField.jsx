import React from "react";
import { motion } from "framer-motion";

const MatrixQuestionField = ({
  label,
  rows = [],
  columns = [],
  value = {},
  onChange,
  required = false,
  helperText,
  error,
  disabled = false,
}) => {
  const handleSelect = (rowKey, columnValue) => {
    onChange({
      ...value,
      [rowKey]: columnValue,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="w-full"
    >
      {/* Question Label */}

      {label && (
        <label
          className="
            mb-6
            block
            font-medium
            text-eatpur-dark
          "
        >
          {label}

          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      {/* ==========================
          Desktop Table
      ========================== */}

      <div
        className={`
    hidden
    overflow-hidden
    rounded-3xl
    border
    ${error ? "border-red-300" : "border-eatpur-gold-light"}
    lg:block
  `}
      >
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-eatpur-white-warm">
              <th
                className="
                  border-b
                  border-eatpur-gold-light
                  px-6
                  py-4
                  text-left
                  font-semibold
                  text-eatpur-dark
                "
              >
                Factor
              </th>

              {columns.map((column) => (
                <th
                  key={column}
                  className="
                    border-b
                    border-eatpur-gold-light
                    px-4
                    py-4
                    text-center
                    text-sm
                    font-medium
                    text-eatpur-dark
                  "
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr
                key={row}
                className="
                  border-b
                  border-eatpur-yellow-light
                  last:border-0
                "
              >
                <td
                  className="
                    px-6
                    py-5
                    font-medium
                    text-eatpur-dark
                  "
                >
                  {row}
                </td>

                {columns.map((column) => {
                  const selected = value?.[row] === column;

                  return (
                    <td
                      key={column}
                      className="
                        px-3
                        py-4
                        text-center
                      "
                    >
                      <button
                        type="button"
                        onClick={() => !disabled && handleSelect(row, column)}
                        className="
                          flex
                          justify-center
                          w-full
                        "
                      >
                        <motion.div
                          whileHover={{
                            scale: 1.08,
                          }}
                          whileTap={{
                            scale: 0.92,
                          }}
                          className={`
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-full
                            border-2
                            transition-all
                            duration-300

                            ${
                              selected
                                ? `
                                  border-eatpur-green-dark
                                  bg-eatpur-green-dark
                                `
                                : `
                                  border-eatpur-gold-light
                                  bg-white
                                `
                            }
                          `}
                        >
                          {selected && (
                            <motion.div
                              initial={{
                                scale: 0,
                              }}
                              animate={{
                                scale: 1,
                              }}
                              className="
                                h-3
                                w-3
                                rounded-full
                                bg-white
                              "
                            />
                          )}
                        </motion.div>
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ==========================
          Mobile Layout
      ========================== */}

      <div className="space-y-5 lg:hidden">
        {rows.map((row, rowIndex) => (
          <motion.div
            key={row}
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: rowIndex * 0.05,
            }}
            className={`
  rounded-3xl
  border
  ${error ? "border-red-300" : "border-eatpur-gold-light"}
  bg-white
  p-5
  shadow-sm
`}
          >
            <h4
              className="
                mb-4
                font-semibold
                text-eatpur-dark
              "
            >
              {row}
            </h4>

            <div className="space-y-3">
              {columns.map((column) => {
                const selected = value?.[row] === column;

                return (
                  <button
                    key={column}
                    type="button"
                    onClick={() => !disabled && handleSelect(row, column)}
                    className={`
                      flex
                      w-full
                      items-center
                      gap-4
                      rounded-2xl
                      border
                      px-4
                      py-3
                      text-left
                      transition-all
                      duration-300

                      ${
                        selected
                          ? `
                            border-eatpur-green-dark
                            bg-eatpur-green-light/10
                          `
                          : `
                            border-eatpur-gold-light
                            bg-white
                          `
                      }
                    `}
                  >
                    <div
                      className={`
                        flex
                        h-6
                        w-6
                        items-center
                        justify-center
                        rounded-full
                        border-2

                        ${
                          selected
                            ? `
                              border-eatpur-green-dark
                              bg-eatpur-green-dark
                            `
                            : `
                              border-eatpur-gold-light
                            `
                        }
                      `}
                    >
                      {selected && (
                        <div
                          className="
                            h-2
                            w-2
                            rounded-full
                            bg-white
                          "
                        />
                      )}
                    </div>

                    <span
                      className={`
                        font-medium

                        ${
                          selected
                            ? "text-eatpur-green-dark"
                            : "text-eatpur-dark"
                        }
                      `}
                    >
                      {column}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Completion Status */}

      <div className="mt-5 flex justify-center">
        <div
          className="
            rounded-full
            border
            border-eatpur-green-light
            bg-eatpur-green-light/10

            px-4
            py-2

            text-sm
            font-medium
            text-eatpur-green-dark
          "
        >
          {Object.keys(value || {}).length} / {rows.length} completed
        </div>
      </div>

      {/* Footer */}

      {(helperText || error) && (
        <div className="mt-4">
          {error ? (
            <p className="text-sm text-red-500">{error}</p>
          ) : (
            <p className="text-sm text-eatpur-text-light">{helperText}</p>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default MatrixQuestionField;
