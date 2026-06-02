import React from "react";
import { motion } from "framer-motion";

const RadioGroupField = ({
    label,
    value,
    onChange,
    options = [],
    required = false,
    helperText,
    error,
    disabled = false,
    columns = 2,
}) => {
    const gridCols = {
        1: "grid-cols-1",
        2: "grid-cols-1 md:grid-cols-2",
        3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full"
        >
            {/* Label */}

            {label && (
                <label
                    className="
            mb-5
            block
            font-medium
            text-eatpur-dark
          "
                >
                    {label}

                    {required && (
                        <span className="ml-1 text-red-500">*</span>
                    )}
                </label>
            )}

            {/* Options */}

            <div
                className={`
          grid
          gap-4
          ${gridCols[columns] || gridCols[2]}
        `}
            >
                {options.map((option, index) => {
                    const selected = value === option;

                    return (
                        <motion.button
                            key={option}
                            type="button"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                delay: index * 0.03,
                            }}
                            onClick={() => !disabled && onChange(option)}
                            whileHover={{
                                y: -2,
                            }}
                            whileTap={{
                                scale: 0.98,
                            }}
                            className={`
                relative
                overflow-hidden
                rounded-2xl
                border
                p-4
                text-left
                transition-all
                duration-300

${selected
                                    ? `
      border-eatpur-green-dark
      bg-eatpur-green-light/20
      shadow-lg
      shadow-eatpur-green-light/20
    `
                                    : error
                                        ? `
      border-red-300
      bg-white
    `
                                        : `
      border-eatpur-gold-light
      bg-white
      hover:border-eatpur-gold
      hover:shadow-md
    `
                                }
              `}
                        >
                            {/* Glow */}

                            {selected && (
                                <motion.div
                                    layoutId="eatpur-radio-active"
                                    className="
                    absolute
                    inset-0
                    bg-gradient-to-r
                    from-eatpur-green-light/10
                    via-transparent
                    to-eatpur-gold-light/10
                  "
                                />
                            )}

                            <div className="relative flex items-center gap-4">
                                {/* Radio Circle */}

                                <div
                                    className={`
                    flex
                    h-6
                    w-6
                    items-center
                    justify-center
                    rounded-full
                    border-2
                    transition-all
                    duration-300

${selected
                                            ? `
      border-eatpur-green-dark
      bg-eatpur-green-light/20
      shadow-lg
      shadow-eatpur-green-light/20
    `
                                            : error
                                                ? `
      border-red-300
      bg-white
    `
                                                : `
      border-eatpur-gold-light
      bg-white
      hover:border-eatpur-gold
      hover:shadow-md
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
                        h-2.5
                        w-2.5
                        rounded-full
                        bg-white
                      "
                                        />
                                    )}
                                </div>

                                {/* Text */}

                                <span
                                    className={`
                    font-medium
                    transition-colors

${selected
                                            ? `
      border-eatpur-green-dark
      bg-eatpur-green-light/20
      shadow-lg
      shadow-eatpur-green-light/20
    `
                                            : error
                                                ? `
      border-red-300
      bg-white
    `
                                                : `
      border-eatpur-gold-light
      bg-white
      hover:border-eatpur-gold
      hover:shadow-md
    `
                                        }
                  `}
                                >
                                    {option}
                                </span>
                            </div>

                            {/* Selected Badge */}

                            {selected && (
                                <motion.div
                                    initial={{
                                        opacity: 0,
                                        scale: 0.8,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1,
                                    }}
                                    className="
                    absolute
                    right-3
                    top-3
                    flex
                    h-6
                    w-6
                    items-center
                    justify-center
                    rounded-full
                    bg-eatpur-green-dark
                    text-xs
                    text-white
                  "
                                >
                                    ✓
                                </motion.div>
                            )}
                        </motion.button>
                    );
                })}
            </div>

            {/* Footer */}

            {(helperText || error) && (
                <div className="mt-3">
                    {error ? (
                        <p className="text-sm text-red-500">
                            {error}
                        </p>
                    ) : (
                        <p className="text-sm text-eatpur-text-light">
                            {helperText}
                        </p>
                    )}
                </div>
            )}
        </motion.div>
    );
};

export default RadioGroupField;