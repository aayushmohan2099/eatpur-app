import React from "react";
import { motion } from "framer-motion";

import {
    SURVEY_SECTIONS,
} from "../../constants/surveyQuestions";

import RadioGroupField from "../fields/RadioGroupField";
import TextInputField from "../fields/TextInputField";

const BasicProfileSection = ({
    formData,
    updateField,
    errors,
}) => {
    const section = SURVEY_SECTIONS.find(
        (item) => item.key === "basicProfile"
    );

    const ageQuestion =
        section.questions.find(
            (q) => q.id === "ageGroup"
        );

    const cityQuestion =
        section.questions.find(
            (q) => q.id === "city"
        );

    const profileQuestion =
        section.questions.find(
            (q) => q.id === "profileType"
        );

    const familyQuestion =
        section.questions.find(
            (q) => q.id === "familyType"
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
                    Section 1
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

            <div className="space-y-10">
                {/* Q1 */}

                <RadioGroupField
                    label={ageQuestion.question}
                    value={formData.ageGroup}
                    onChange={(value) =>
                        updateField("ageGroup", value)
                    }
                    options={ageQuestion.options}
                    required={ageQuestion.required}
                    error={errors.ageGroup}
                    columns={2}
                />

                {/* Q2 */}

                <TextInputField
                    label={cityQuestion.question}
                    value={formData.city}
                    onChange={(value) =>
                        updateField("city", value)
                    }
                    placeholder={
                        cityQuestion.placeholder
                    }
                    required={cityQuestion.required}
                    name="city"
                    error={errors.city}
                />

                {/* Q3 */}

                <RadioGroupField
                    label={profileQuestion.question}
                    value={formData.profileType}
                    onChange={(value) =>
                        updateField(
                            "profileType",
                            value
                        )
                    }
                    options={
                        profileQuestion.options
                    }
                    required={
                        profileQuestion.required
                    }
                    columns={2}
                    error={errors.profileType}
                />

                {/* Q4 */}

                <RadioGroupField
                    label={familyQuestion.question}
                    value={formData.familyType}
                    onChange={(value) =>
                        updateField(
                            "familyType",
                            value
                        )
                    }
                    options={
                        familyQuestion.options
                    }
                    required={
                        familyQuestion.required
                    }
                    columns={2}
                    error={errors.familyType}
                />
            </div>

            {/* Footer */}

            <div
                className="
          mt-10
          rounded-2xl

          border
          border-eatpur-gold-light

          bg-eatpur-white-warm

          p-4
        "
            >
                <div
                    className="
            flex
            items-center
            gap-3
          "
                >
                    <div className="text-xl">
                        🌾
                    </div>

                    <p
                        className="
              text-sm
              text-eatpur-text-light
            "
                    >
                        Your responses help us
                        understand who our future
                        customers are and how we can
                        build healthier millet foods
                        for Indian families.
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default BasicProfileSection;