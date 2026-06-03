import React from "react";
import { motion } from "framer-motion";

const CheckboxGroupField = ({
  label,
  value = [],
  onChange,
  options = [],
  required = false,
  helperText,
  error,
  disabled = false,
  columns = 1,
}) => {
  const handleToggle = (option) => {
    if (value.includes(option)) {
      onChange(value.filter((item) => item !== option));
    } else {
      onChange([...value, option]);
    }
  };

  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
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
            font-semibold
            text-lg
            text-eatpur-dark
          "
        >
          {label}

          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      {/* Options */}

      <div
        className={`
          grid
          gap-4
          ${gridCols[columns] || gridCols[1]}
        `}
      >
        {options.map((option, index) => {
          const checked = value.includes(option);

          return (
            <motion.button
              key={option}
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
                delay: index * 0.03,
              }}
              whileHover={{
                y: -2,
              }}
              whileTap={{
                scale: 0.98,
              }}
              onClick={() => {
                if (disabled) return;
                handleToggle(option);
              }}
              className={`
                group
                relative
                overflow-hidden
                rounded-2xl
                border
                p-4
                text-left
                transition-all
                duration-300

${
  checked
    ? `
      border-eatpur-green-dark
      bg-eatpur-green-dark
    `
    : error
      ? `
      border-red-300
      bg-white
    `
      : `
      border-eatpur-gold-light
      bg-white
    `
}
              `}
            >
              {/* Animated Background */}

              {checked && (
                <motion.div
                  layoutId="eatpur-checkbox-active"
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
                {/* Checkbox */}

                <div
                  className="
                    relative
                    flex
                    h-7
                    w-7
                    shrink-0
                    items-center
                    justify-center
                  "
                >
                  <div
                    className={`
                      absolute
                      inset-0
                      rounded-lg
                      border-2
                      transition-all
                      duration-300

${
  checked
    ? `
      border-eatpur-green-dark
      bg-eatpur-green-dark
    `
    : error
      ? `
      border-red-300
      bg-white
    `
      : `
      border-eatpur-gold-light
      bg-white
    `
}
                    `}
                  />

                  <svg
                    className={`
                      relative
                      h-4
                      w-4
                      text-white
                      transition-all
                      duration-300

                      ${checked ? "scale-100 opacity-100" : "scale-0 opacity-0"}
                    `}
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M5 13L9 17L19 7"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                {/* Text */}

                <span
                  className={`
    font-medium
    transition-colors

    ${checked ? "text-white" : error ? "text-red-600" : "text-eatpur-dark"}
  `}
                >
                  {option}
                </span>
              </div>

              {/* Selected Badge */}

              {checked && (
                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.7,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  className="
                    absolute
                    right-3
                    top-3

                    rounded-full
                    bg-white
                    text-eatpur-green-dark

                    px-2
                    py-1

                    text-[10px]
                    font-semibold
                  "
                >
                  Selected
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Selected Count */}

      {value.length > 0 && (
        <div className="mt-4">
          <span
            className="
              inline-flex
              items-center
              rounded-full
              border
              border-eatpur-green-light
              bg-eatpur-green-light/10
              px-3
              py-1

              text-sm
              font-medium
              text-eatpur-green-dark
            "
          >
            {value.length} Options Selected
          </span>
        </div>
      )}

      {/* Footer */}

      {(helperText || error) && (
        <div className="mt-3">
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

export default CheckboxGroupField;
