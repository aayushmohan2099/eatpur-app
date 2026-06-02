import React from "react";
import { motion } from "framer-motion";

const SurveyStepper = ({
    steps = [],
    currentStep = 1,
}) => {
    return (
        <div className="mt-6">
            {/* Desktop Stepper */}

            <div
                className="
          hidden
          md:block
        "
            >
                <div
                    className="
            rounded-3xl
            border
            border-eatpur-yellow-light
            bg-white
            p-6
            shadow-sm
          "
                >
                    <div className="flex items-center">
                        {steps.map(
                            (step, index) => {
                                const isCompleted =
                                    currentStep >
                                    step.id;

                                const isCurrent =
                                    currentStep ===
                                    step.id;

                                const isLast =
                                    index ===
                                    steps.length - 1;

                                return (
                                    <React.Fragment
                                        key={step.id}
                                    >
                                        {/* Step */}

                                        <div
                                            className="
                        flex
                        flex-col
                        items-center
                        text-center
                      "
                                        >
                                            <motion.div
                                                initial={{
                                                    scale: 0.9,
                                                }}
                                                animate={{
                                                    scale:
                                                        isCurrent
                                                            ? 1.05
                                                            : 1,
                                                }}
                                                transition={{
                                                    duration: 0.2,
                                                }}
                                                className={`
                          flex
                          h-12
                          w-12
                          items-center
                          justify-center
                          rounded-full
                          border-2
                          text-sm
                          font-semibold
                          transition-all
                          duration-300

                          ${isCompleted
                                                        ? `
                                border-eatpur-green-dark
                                bg-eatpur-green-dark
                                text-white
                              `
                                                        : isCurrent
                                                            ? `
                                border-eatpur-green-dark
                                bg-eatpur-green-light/15
                                text-eatpur-green-dark
                              `
                                                            : `
                                border-eatpur-gold-light
                                bg-white
                                text-eatpur-text-light
                              `
                                                    }
                        `}
                                            >
                                                {isCompleted
                                                    ? "✓"
                                                    : step.id}
                                            </motion.div>

                                            <div className="mt-3">
                                                <p
                                                    className={`
                            text-sm
                            font-medium

                            ${isCurrent
                                                            ? "text-eatpur-green-dark"
                                                            : isCompleted
                                                                ? "text-eatpur-dark"
                                                                : "text-eatpur-text-light"
                                                        }
                          `}
                                                >
                                                    {step.title}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Connector */}

                                        {!isLast && (
                                            <div
                                                className="
                          relative
                          mx-4
                          flex-1
                        "
                                            >
                                                <div
                                                    className="
                            h-1
                            rounded-full
                            bg-gray-200
                          "
                                                />

                                                <motion.div
                                                    initial={{
                                                        width: 0,
                                                    }}
                                                    animate={{
                                                        width:
                                                            currentStep >
                                                                step.id
                                                                ? "100%"
                                                                : "0%",
                                                    }}
                                                    transition={{
                                                        duration: 0.4,
                                                    }}
                                                    className="
                            absolute
                            left-0
                            top-0
                            h-1
                            rounded-full
                            bg-eatpur-green-dark
                          "
                                                />
                                            </div>
                                        )}
                                    </React.Fragment>
                                );
                            }
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Stepper */}

            <div className="md:hidden">
                <div
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
              items-center
              justify-between
            "
                    >
                        <div>
                            <p
                                className="
                  text-xs
                  uppercase
                  tracking-wide
                  text-eatpur-text-light
                "
                            >
                                Current Section
                            </p>

                            <h3
                                className="
                  mt-1
                  text-lg
                  font-semibold
                  text-eatpur-dark
                "
                            >
                                {
                                    steps[
                                        currentStep - 1
                                    ]?.title
                                }
                            </h3>
                        </div>

                        <div
                            className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                bg-eatpur-green-dark
                text-sm
                font-semibold
                text-white
              "
                        >
                            {currentStep}/
                            {steps.length}
                        </div>
                    </div>

                    {/* Progress */}

                    <div className="mt-5">
                        <div
                            className="
                h-2
                overflow-hidden
                rounded-full
                bg-gray-200
              "
                        >
                            <motion.div
                                animate={{
                                    width: `${(currentStep /
                                            steps.length) *
                                        100
                                        }%`,
                                }}
                                transition={{
                                    duration: 0.4,
                                }}
                                className="
                  h-full
                  rounded-full
                  bg-eatpur-green-dark
                "
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SurveyStepper;