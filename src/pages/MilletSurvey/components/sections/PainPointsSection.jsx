import React from "react";
import { motion } from "framer-motion";

import {
    SURVEY_SECTIONS,
} from "../../constants/surveyQuestions";

import CheckboxGroupField from "../fields/CheckboxGroupField";
import RadioGroupField from "../fields/RadioGroupField";

const PainPointsSection = ({
    formData,
    updateField,
    errors,
}) => {
    const section = SURVEY_SECTIONS.find(
        (item) => item.key === "painPoints"
    );

    const painPointsQuestion =
        section.questions.find(
            (q) => q.id === "painPoints"
        );

    const eatingHabitQuestion =
        section.questions.find(
            (q) => q.id === "eatingHabit"
        );

    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 20,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            transition={{
                duration: 0.3,
            }}
            className="
        rounded-3xl
        border
        border-eatpur-yellow-light
        bg-white
        p-6
        shadow-lg
        md:p-8
      "
        >
            {/* Header */}

            <div className="mb-10">
                <div
                    className="
            inline-flex
            items-center
            rounded-full
            bg-eatpur-green-light/15
            px-4
            py-2
            text-sm
            font-medium
            text-eatpur-green-dark
          "
                >
                    Section 3
                </div>

                <h2
                    className="
            mt-4
            font-display
            text-3xl
            text-eatpur-dark
          "
                >
                    {section.title}
                </h2>

                <p
                    className="
            mt-3
            max-w-2xl
            text-eatpur-text-light
          "
                >
                    {section.description}
                </p>
            </div>

            {/* Questions */}

            <div className="space-y-12">
                {/* Q9 */}

                <CheckboxGroupField
                    label={
                        painPointsQuestion.question
                    }
                    value={formData.painPoints}
                    onChange={(value) =>
                        updateField(
                            "painPoints",
                            value
                        )
                    }
                    options={
                        painPointsQuestion.options
                    }
                    required={
                        painPointsQuestion.required
                    }
                    columns={2}
                    error={errors.painPoints}
                />

                {/* Q10 */}

                <RadioGroupField
                    label={
                        eatingHabitQuestion.question
                    }
                    value={formData.eatingHabit}
                    onChange={(value) =>
                        updateField(
                            "eatingHabit",
                            value
                        )
                    }
                    options={
                        eatingHabitQuestion.options
                    }
                    required={
                        eatingHabitQuestion.required
                    }
                    columns={1}
                    error={errors.eatingHabit}
                />
            </div>

            {/* Insight Card */}

            <div
                className="
          mt-10
          rounded-2xl
          border
          border-eatpur-gold-light
          bg-eatpur-white-warm
          p-5
        "
            >
                <div
                    className="
            flex
            items-start
            gap-4
          "
                >
                    <div className="text-2xl">
                        🎯
                    </div>

                    <div>
                        <h3
                            className="
                font-semibold
                text-eatpur-dark
              "
                        >
                            Why this matters
                        </h3>

                        <p
                            className="
                mt-2
                text-sm
                leading-6
                text-eatpur-text-light
              "
                        >
                            Understanding barriers to
                            millet adoption helps us
                            design products, packaging,
                            education, and messaging
                            that solve real consumer
                            problems instead of making
                            assumptions.
                        </p>

                        <div
                            className="
                mt-4
                rounded-xl
                border
                border-eatpur-green-light
                bg-eatpur-green-light/10
                p-3
              "
                        >
                            <p
                                className="
                  text-sm
                  font-medium
                  text-eatpur-green-dark
                "
                            >
                                Example:
                            </p>

                            <p
                                className="
                  mt-1
                  text-sm
                  text-eatpur-text
                "
                            >
                                If "Hard to cook" becomes
                                the biggest pain point,
                                Eatpur can position itself
                                as:
                            </p>

                            <p
                                className="
                  mt-2
                  italic
                  text-eatpur-green-dark
                  font-medium
                "
                            >
                                "Healthy millet foods made
                                easy for modern families."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PainPointsSection;