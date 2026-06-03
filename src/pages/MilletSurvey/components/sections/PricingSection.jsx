import React from "react";
import { motion } from "framer-motion";

import { SURVEY_SECTIONS } from "../../constants/surveyQuestions";

import RadioGroupField from "../fields/RadioGroupField";
import CheckboxGroupField from "../fields/CheckboxGroupField";
import SliderField from "../fields/SliderField";

const PricingSection = ({ formData, updateField, errors }) => {
  const section = SURVEY_SECTIONS.find((item) => item.key === "pricing");

  const priceRangeQuestion = section.questions.find(
    (q) => q.id === "priceRange",
  );

  const purchaseChannelsQuestion = section.questions.find(
    (q) => q.id === "purchaseChannels",
  );

  const purchaseIntentQuestion = section.questions.find(
    (q) => q.id === "purchaseIntent",
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
          Section 5
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
        {/* Q14 */}

        <RadioGroupField
          label={priceRangeQuestion.question}
          value={formData.priceRange}
          onChange={(value) => updateField("priceRange", value)}
          options={priceRangeQuestion.options}
          required={priceRangeQuestion.required}
          columns={1}
          error={errors.priceRange}
        />

        {/* Q15 */}

        <CheckboxGroupField
          label={purchaseChannelsQuestion.question}
          value={formData.purchaseChannels}
          onChange={(value) => updateField("purchaseChannels", value)}
          options={purchaseChannelsQuestion.options}
          required={purchaseChannelsQuestion.required}
          columns={2}
          error={errors.purchaseChannels}
        />

        {/* Q16 */}

        <SliderField
          label={purchaseIntentQuestion.question}
          value={formData.purchaseIntent}
          onChange={(value) => updateField("purchaseIntent", value)}
          min={purchaseIntentQuestion.min}
          max={purchaseIntentQuestion.max}
          leftLabel={purchaseIntentQuestion.leftLabel}
          rightLabel={purchaseIntentQuestion.rightLabel}
          required={purchaseIntentQuestion.required}
          error={errors.purchaseIntent}
        />
      </div>

      {/* Pricing Insight Card */}

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
          <div className="text-2xl">💰</div>

          <div>
            <h3
              className="
                font-semibold
                text-eatpur-dark
              "
            >
              Purchase Intent Insights
            </h3>

            <p
              className="
                mt-2
                text-sm
                leading-6
                text-eatpur-text-light
              "
            >
              This section helps determine acceptable pricing, preferred buying
              channels, and overall willingness to try Eatpur products before
              launch.
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
                If most respondents choose ₹100–200 pricing, prefer
                Amazon/Blinkit, and give purchase intent scores of 8–10, Eatpur
                has strong validation for initial market launch.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PricingSection;
