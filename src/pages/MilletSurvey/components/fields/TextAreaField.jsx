import React from "react";
import { motion } from "framer-motion";

const TextAreaField = ({
  label,
  value,
  onChange,
  placeholder = "",
  required = false,
  name,
  error,
  helperText,
  disabled = false,
  rows = 5,
  maxLength = 500,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="w-full"
    >
      {label && (
        <label
          htmlFor={name}
          className="
            mb-3
            block
            font-medium
            text-eatpur-dark
          "
        >
          {label}

          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <div
        className={`
                group
                relative
                overflow-hidden
                rounded-2xl
                border
                ${error ? "border-red-300" : "border-eatpur-gold-light"}
                bg-white
                transition-all
                duration-300

                focus-within:border-eatpur-green-dark
                focus-within:shadow-lg
                focus-within:shadow-eatpur-green-light/20
            `}
      >
        <textarea
          id={name}
          name={name}
          rows={rows}
          value={value || ""}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="
            peer
            w-full
            resize-none
            bg-transparent

            px-5
            py-4

            text-eatpur-dark
            placeholder:text-eatpur-text-light/60

            outline-none

            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        />

        {/* Animated Bottom Border */}

        <span
          className="
            absolute
            bottom-0
            left-0

            h-[3px]
            w-0

            bg-gradient-to-r
            from-eatpur-green-dark
            via-eatpur-gold
            to-eatpur-green-light

            transition-all
            duration-500

            peer-focus:w-full
          "
        />
      </div>

      <div className="mt-2 flex items-start justify-between gap-4">
        <div>
          {error ? (
            <p className="text-sm text-red-500">{error}</p>
          ) : helperText ? (
            <p className="text-sm text-eatpur-text-light">{helperText}</p>
          ) : null}
        </div>

        <span
          className="
            shrink-0
            text-xs
            text-eatpur-text-light
          "
        >
          {(value || "").length}/{maxLength}
        </span>
      </div>
    </motion.div>
  );
};

export default TextAreaField;
