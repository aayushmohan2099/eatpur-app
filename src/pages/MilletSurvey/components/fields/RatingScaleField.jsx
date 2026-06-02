import React from "react";
import { motion } from "framer-motion";

const RatingScaleField = ({
    label,
    value,
    onChange,
    min = 1,
    max = 5,
    required = false,
    helperText,
    error,
    leftLabel = "",
    rightLabel = "",
}) => {
    const ratings = Array.from(
        { length: max - min + 1 },
        (_, i) => min + i
    );

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

            {/* Rating Options */}

            <div
                className={`
    flex
    flex-wrap
    justify-center
    gap-3
    md:gap-4

    ${error
                        ? "rounded-2xl border border-red-300 p-4"
                        : ""
                    }
  `}
            >
                {ratings.map((rating, index) => {
                    const selected = rating === value;

                    return (
                        <motion.button
                            key={rating}
                            type="button"
                            initial={{
                                opacity: 0,
                                y: 10,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                delay: index * 0.05,
                            }}
                            whileHover={{
                                y: -3,
                            }}
                            whileTap={{
                                scale: 0.96,
                            }}
                            onClick={() => onChange(rating)}
                            className={`
                relative
                flex
                h-14
                w-14
                items-center
                justify-center

                rounded-2xl
                border
                text-lg
                font-semibold

                transition-all
                duration-300

                ${selected
                                    ? `
                      border-eatpur-green-dark
                      bg-eatpur-green-dark
                      text-white
                      shadow-lg
                      shadow-eatpur-green-light/30
                    `
                                    : `
                      border-eatpur-gold-light
                      bg-white
                      text-eatpur-dark

                      hover:border-eatpur-gold
                      hover:bg-eatpur-yellow-light/20
                    `
                                }
              `}
                        >
                            {selected && (
                                <motion.div
                                    layoutId="eatpur-rating-selected"
                                    className="
                    absolute
                    inset-0
                    rounded-2xl
                    bg-eatpur-green-dark
                  "
                                />
                            )}

                            <span className="relative z-10">
                                {rating}
                            </span>
                        </motion.button>
                    );
                })}
            </div>

            {/* Scale Labels */}

            {(leftLabel || rightLabel) && (
                <div
                    className="
            mt-4
            flex
            justify-between
            gap-4
            text-sm
            text-eatpur-text-light
          "
                >
                    <span>{leftLabel}</span>
                    <span className="text-right">
                        {rightLabel}
                    </span>
                </div>
            )}

            {/* Selected Value */}

            {value ? (
                <div className="mt-5 flex justify-center">
                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.9,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                        }}
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
                        Selected Rating: {value}/{max}
                    </motion.div>
                </div>
            ) : null}

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

export default RatingScaleField;