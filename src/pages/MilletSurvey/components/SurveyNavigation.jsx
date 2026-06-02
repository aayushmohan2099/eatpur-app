import React from "react";
import { motion } from "framer-motion";

const SurveyNavigation = ({
    currentStep,
    totalSteps,
    onBack,
    onNext,
    onSubmit,
    loading = false,
}) => {
    const isFirstStep =
        currentStep === 1;

    const isLastStep =
        currentStep === totalSteps;

    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 10,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            className="
        rounded-3xl
        border
        border-eatpur-yellow-light
        bg-white
        p-5
        shadow-sm
      "
        >
            <div
                className="
          flex
          flex-col
          gap-4

          md:flex-row
          md:items-center
          md:justify-between
        "
            >
                {/* Left Side */}

                <div>
                    <p
                        className="
              text-xs
              uppercase
              tracking-wide
              text-eatpur-text-light
            "
                    >
                        Current Step
                    </p>

                    <p
                        className="
              mt-1
              text-lg
              font-semibold
              text-eatpur-dark
            "
                    >
                        Step {currentStep} of{" "}
                        {totalSteps}
                    </p>
                </div>

                {/* Right Side */}

                <div
                    className="
            flex
            flex-col-reverse
            gap-3

            sm:flex-row
          "
                >
                    {/* Back Button */}

                    {!isFirstStep && (
                        <motion.button
                            whileHover={{
                                y: -2,
                            }}
                            whileTap={{
                                scale: 0.98,
                            }}
                            type="button"
                            onClick={onBack}
                            disabled={loading}
                            className="
                inline-flex
                items-center
                justify-center
                gap-2

                rounded-2xl
                border
                border-eatpur-gold-light

                bg-white

                px-6
                py-3

                font-medium
                text-eatpur-dark

                transition-all
                duration-300

                hover:border-eatpur-gold
                hover:shadow-md

                disabled:cursor-not-allowed
                disabled:opacity-50
              "
                        >
                            <span>←</span>

                            <span>
                                Previous
                            </span>
                        </motion.button>
                    )}

                    {/* Next / Submit */}

                    {!isLastStep ? (
                        <motion.button
                            whileHover={{
                                y: -2,
                            }}
                            whileTap={{
                                scale: 0.98,
                            }}
                            type="button"
                            onClick={onNext}
                            disabled={loading}
                            className="
                inline-flex
                items-center
                justify-center
                gap-2

                rounded-2xl

                bg-eatpur-green-dark

                px-8
                py-3

                font-medium
                text-white

                shadow-lg
                shadow-eatpur-green-light/20

                transition-all
                duration-300

                hover:shadow-xl

                disabled:cursor-not-allowed
                disabled:opacity-50
              "
                        >
                            <span>
                                Continue
                            </span>

                            <span>→</span>
                        </motion.button>
                    ) : (
                        <motion.button
                            whileHover={{
                                y: -2,
                            }}
                            whileTap={{
                                scale: 0.98,
                            }}
                            type="button"
                            onClick={onSubmit}
                            disabled={loading}
                            className="
                inline-flex
                items-center
                justify-center
                gap-2

                rounded-2xl

                bg-gradient-to-r
                from-eatpur-green-dark
                via-eatpur-green-dark
                to-eatpur-green-light

                px-8
                py-3

                font-semibold
                text-white

                shadow-lg
                shadow-eatpur-green-light/30

                transition-all
                duration-300

                hover:shadow-xl

                disabled:cursor-not-allowed
                disabled:opacity-50
              "
                        >
                            {loading ? (
                                <>
                                    <svg
                                        className="
                      h-5
                      w-5
                      animate-spin
                    "
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <circle
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            opacity="0.25"
                                        />

                                        <path
                                            d="M22 12A10 10 0 0012 2"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                        />
                                    </svg>

                                    <span>
                                        Submitting...
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span>🌾</span>

                                    <span>
                                        Submit Survey
                                    </span>
                                </>
                            )}
                        </motion.button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default SurveyNavigation;