import React from "react";
import { motion } from "framer-motion";

const SliderField = ({
  label,
  value = 5,
  onChange,
  min = 1,
  max = 10,
  required = false,
  helperText,
  error,
  leftLabel = "",
  rightLabel = "",
  disabled = false,
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

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

          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      {/* Score Display */}

      <motion.div
        key={value}
        initial={{
          scale: 0.9,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        className="mb-8 flex justify-center"
      >
        <div
          className="
            rounded-3xl
            border
            border-eatpur-green-light

            bg-gradient-to-r
            from-eatpur-green-light/10
            via-white
            to-eatpur-gold-light/10

            px-8
            py-4

            shadow-md
          "
        >
          <div
            className="
              text-center
              text-xs
              uppercase
              tracking-wider
              text-eatpur-text-light
            "
          >
            Selected Score
          </div>

          <div
            className="
              mt-1
              text-center
              text-4xl
              font-bold
              text-eatpur-green-dark
            "
          >
            {value}
            <span
              className="
                ml-1
                text-lg
                text-eatpur-text-light
              "
            >
              / {max}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Slider */}

      <div
        className={`
    px-2
    ${error ? "rounded-2xl border border-red-300 p-4" : ""}
  `}
      >
        <div className="relative">
          {/* Track */}

          <div
            className="
              absolute
              top-1/2
              h-3
              w-full
              -translate-y-1/2
              rounded-full
              bg-eatpur-yellow-light
            "
          />

          {/* Progress */}

          <motion.div
            animate={{
              width: `${percentage}%`,
            }}
            transition={{
              duration: 0.2,
            }}
            className="
              absolute
              top-1/2
              h-3
              -translate-y-1/2
              rounded-full

              bg-gradient-to-r
              from-eatpur-green-dark
              via-eatpur-green-light
              to-eatpur-gold
            "
          />

          {/* Range */}

          <input
            type="range"
            min={min}
            max={max}
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(Number(e.target.value))}
            className="
              relative
              z-10
              h-3
              w-full
              cursor-pointer
              appearance-none
              bg-transparent

              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:h-7
              [&::-webkit-slider-thumb]:w-7
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-eatpur-green-dark
              [&::-webkit-slider-thumb]:shadow-lg
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:border-4
              [&::-webkit-slider-thumb]:border-white

              [&::-moz-range-thumb]:h-7
              [&::-moz-range-thumb]:w-7
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:border-none
              [&::-moz-range-thumb]:bg-eatpur-green-dark
              [&::-moz-range-thumb]:cursor-pointer
            "
          />
        </div>

        {/* Numbers */}

        <div
          className="
            mt-4
            flex
            justify-between
            text-sm
            font-medium
            text-eatpur-text-light
          "
        >
          {Array.from({ length: max - min + 1 }, (_, i) => min + i).map(
            (number) => (
              <span
                key={number}
                className={
                  number === value ? "text-eatpur-green-dark font-bold" : ""
                }
              >
                {number}
              </span>
            ),
          )}
        </div>
      </div>

      {/* Labels */}

      {(leftLabel || rightLabel) && (
        <div
          className="
            mt-5
            flex
            justify-between
            gap-4

            text-sm
            text-eatpur-text-light
          "
        >
          <span>{leftLabel}</span>
          <span className="text-right">{rightLabel}</span>
        </div>
      )}

      {/* Interpretation */}

      <div className="mt-6 flex justify-center">
        <div
          className="
            rounded-full
            bg-eatpur-white-warm
            px-4
            py-2

            text-sm
            font-medium
            text-eatpur-dark
          "
        >
          {value >= 8
            ? "🔥 Strong Purchase Intent"
            : value >= 6
              ? "👍 Moderate Interest"
              : "⚡ Needs More Convincing"}
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

export default SliderField;
