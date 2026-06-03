import React from "react";
import { motion } from "framer-motion";

const TextInputField = ({
  label,
  value,
  onChange,
  placeholder = "",
  required = false,
  type = "text",
  name,
  error,
  helperText,
  disabled = false,
  maxLength,
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

      <div className="relative group">
        <input
          id={name}
          name={name}
          type={type}
          value={value || ""}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          className={`
        peer
        w-full
        bg-transparent
        px-4
        py-4
        text-lg
        text-eatpur-dark
        placeholder:text-eatpur-text-light/60
        
        border-0
        border-b-2
        
        transition-all
        duration-300
        
        focus:outline-none
          ${
            error
              ? "border-red-300"
              : "border-eatpur-gold-light focus:border-eatpur-green-dark"
          }
        
        disabled:cursor-not-allowed
        disabled:opacity-60

    `}
        />

        {/* Animated Border */}

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

      <div className="mt-2 flex justify-between">
        <div>
          {error ? (
            <p className="text-sm text-red-500">{error}</p>
          ) : helperText ? (
            <p className="text-sm text-eatpur-text-light">{helperText}</p>
          ) : null}
        </div>

        {maxLength && (
          <span
            className="
              text-xs
              text-eatpur-text-light
            "
          >
            {(value || "").length}/{maxLength}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default TextInputField;
