import React from "react";
import { motion } from "framer-motion";

import { SURVEY_SECTIONS } from "../../constants/surveyQuestions";

import RatingScaleField from "../fields/RatingScaleField";
import CheckboxGroupField from "../fields/CheckboxGroupField";
import RadioGroupField from "../fields/RadioGroupField";

const FoodHabitsSection = ({ formData, updateField, errors }) => {
  const section = SURVEY_SECTIONS.find((item) => item.key === "foodHabits");

  const healthQuestion = section.questions.find(
    (q) => q.id === "healthConsciousness",
  );

  const healthyProductsQuestion = section.questions.find(
    (q) => q.id === "healthyProducts",
  );

  const milletExperienceQuestion = section.questions.find(
    (q) => q.id === "milletExperience",
  );

  const milletReasonsQuestion = section.questions.find(
    (q) => q.id === "milletReasons",
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
          Section 2
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
        {/* Q5 */}

        <RatingScaleField
          label={healthQuestion.question}
          value={formData.healthConsciousness}
          onChange={(value) => updateField("healthConsciousness", value)}
          min={healthQuestion.min}
          max={healthQuestion.max}
          leftLabel={healthQuestion.leftLabel}
          rightLabel={healthQuestion.rightLabel}
          required={healthQuestion.required}
          error={errors.healthConsciousness}
        />

        {/* Q6 */}

        <CheckboxGroupField
          label={healthyProductsQuestion.question}
          value={formData.healthyProducts}
          onChange={(value) => updateField("healthyProducts", value)}
          options={healthyProductsQuestion.options}
          required={healthyProductsQuestion.required}
          columns={2}
          error={errors.healthyProducts}
        />

        {/* Q7 */}

        <RadioGroupField
          label={milletExperienceQuestion.question}
          value={formData.milletExperience}
          onChange={(value) => updateField("milletExperience", value)}
          options={milletExperienceQuestion.options}
          required={milletExperienceQuestion.required}
          columns={1}
          error={errors.milletExperience}
        />

        {/* Q8 */}

        <CheckboxGroupField
          label={milletReasonsQuestion.question}
          value={formData.milletReasons}
          onChange={(value) => updateField("milletReasons", value)}
          options={milletReasonsQuestion.options}
          required={milletReasonsQuestion.required}
          columns={2}
          error={errors.milletReasons}
        />
      </div>

      {/* Footer Insight Card */}

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
            items-start
            gap-3
          "
        >
          <div className="text-xl">🥣</div>

          <div>
            <p
              className="
                font-medium
                text-eatpur-dark
              "
            >
              Why we ask these questions
            </p>

            <p
              className="
                mt-1
                text-sm
                text-eatpur-text-light
              "
            >
              These responses help us understand current healthy eating
              behaviors, awareness of millet foods, and the benefits consumers
              expect from healthier food choices.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FoodHabitsSection;
