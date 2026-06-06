import React from "react";
import { motion } from "framer-motion";

import { SURVEY_SECTIONS } from "../../constants/surveyQuestions";

import CheckboxGroupField from "../fields/CheckBoxGroupField";
import TextInputField from "../fields/TextInputField";
import TextAreaField from "../fields/TextAreaField";

const LeadCollectionSection = ({ formData, updateField, errors }) => {
  const section = SURVEY_SECTIONS.find((item) => item.key === "leadCollection");

  const leadPreferencesQuestion = section.questions.find(
    (q) => q.id === "leadPreferences",
  );

  const whatsappQuestion = section.questions.find(
    (q) => q.id === "whatsappNumber",
  );

  const suggestionsQuestion = section.questions.find(
    (q) => q.id === "suggestions",
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
          Section 6
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
        {/* Q17 */}

        <CheckboxGroupField
          label={leadPreferencesQuestion.question}
          value={formData.leadPreferences}
          onChange={(value) => updateField("leadPreferences", value)}
          options={leadPreferencesQuestion.options}
          required={leadPreferencesQuestion.required}
          columns={2}
          error={errors.leadPreferences}
        />

        {/* Q18 */}

        <TextInputField
          label={whatsappQuestion.question}
          value={formData.whatsappNumber}
          onChange={(value) => updateField("whatsappNumber", value)}
          placeholder={whatsappQuestion.placeholder}
          required={whatsappQuestion.required}
          type={whatsappQuestion.inputType}
          name="whatsappNumber"
          maxLength={whatsappQuestion.maxLength}
          helperText="Optional. We'll only use this for updates you choose to receive."
          error={errors.whatsappNumber}
        />

        {/* Q19 */}

        <TextAreaField
          label={suggestionsQuestion.question}
          value={formData.suggestions}
          onChange={(value) => updateField("suggestions", value)}
          placeholder={suggestionsQuestion.placeholder}
          required={suggestionsQuestion.required}
          rows={suggestionsQuestion.rows}
          maxLength={suggestionsQuestion.maxLength}
          name="suggestions"
          helperText="Your feedback helps us improve future Eatpur products."
          error={errors.suggestions}
        />
      </div>

      {/* Final CTA Card */}

      <div
        className="
          mt-10
          rounded-2xl
          border
          border-eatpur-green-light
          bg-gradient-to-r
          from-eatpur-green-light/10
          via-white
          to-eatpur-gold-light/10
          p-6
        "
      >
        <div
          className="
            flex
            items-start
            gap-4
          "
        >
          <div className="text-3xl">🌾</div>

          <div>
            <h3
              className="
                text-lg
                font-semibold
                text-eatpur-dark
              "
            >
              Thank you for helping shape Eatpur Naturals LLP
            </h3>

            <p
              className="
                mt-2
                text-sm
                leading-6
                text-eatpur-text-light
              "
            >
              Your responses directly influence which millet products we launch,
              how they're packaged, priced, and made available to consumers
              across India.
            </p>

            <div
              className="
                mt-4
                flex
                flex-wrap
                gap-2
              "
            >
              <span
                className="
                  rounded-full
                  bg-white
                  px-3
                  py-1
                  text-xs
                  font-medium
                  text-eatpur-green-dark
                  shadow-sm
                "
              >
                Free Samples
              </span>

              <span
                className="
                  rounded-full
                  bg-white
                  px-3
                  py-1
                  text-xs
                  font-medium
                  text-eatpur-green-dark
                  shadow-sm
                "
              >
                Launch Offers
              </span>

              <span
                className="
                  rounded-full
                  bg-white
                  px-3
                  py-1
                  text-xs
                  font-medium
                  text-eatpur-green-dark
                  shadow-sm
                "
              >
                Product Testing
              </span>

              <span
                className="
                  rounded-full
                  bg-white
                  px-3
                  py-1
                  text-xs
                  font-medium
                  text-eatpur-green-dark
                  shadow-sm
                "
              >
                Healthy Recipes
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LeadCollectionSection;
