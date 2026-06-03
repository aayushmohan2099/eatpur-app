import React from "react";
import { motion } from "framer-motion";

import { SURVEY_SECTIONS } from "../../constants/surveyQuestions";

import CheckboxGroupField from "../fields/CheckboxGroupField";
import MatrixQuestionField from "../fields/MatrixQuestionField";
import RadioGroupField from "../fields/RadioGroupField";

const ProductValidationSection = ({ formData, updateField, errors }) => {
  const section = SURVEY_SECTIONS.find(
    (item) => item.key === "productValidation",
  );

  const preferredProductsQuestion = section.questions.find(
    (q) => q.id === "preferredProducts",
  );

  const buyingFactorsQuestion = section.questions.find(
    (q) => q.id === "buyingFactors",
  );

  const packagingStyleQuestion = section.questions.find(
    (q) => q.id === "packagingStyle",
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
          Section 4
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
        {/* Q11 */}

        <CheckboxGroupField
          label={preferredProductsQuestion.question}
          value={formData.preferredProducts}
          onChange={(value) => updateField("preferredProducts", value)}
          options={preferredProductsQuestion.options}
          required={preferredProductsQuestion.required}
          columns={2}
          error={errors.preferredProducts}
        />

        {/* Q12 */}

        <MatrixQuestionField
          label={buyingFactorsQuestion.question}
          value={formData.buyingFactors}
          onChange={(value) => updateField("buyingFactors", value)}
          rows={buyingFactorsQuestion.rows}
          columns={buyingFactorsQuestion.columns}
          required={buyingFactorsQuestion.required}
          error={errors.buyingFactors}
        />

        {/* Q13 */}

        <RadioGroupField
          label={packagingStyleQuestion.question}
          value={formData.packagingStyle}
          onChange={(value) => updateField("packagingStyle", value)}
          options={packagingStyleQuestion.options}
          required={packagingStyleQuestion.required}
          columns={2}
          error={errors.packagingStyle}
        />
      </div>

      {/* Strategy Insight Card */}

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
          <div className="text-2xl">🚀</div>

          <div>
            <h3
              className="
                font-semibold
                text-eatpur-dark
              "
            >
              Product Validation Insights
            </h3>

            <p
              className="
                mt-2
                text-sm
                leading-6
                text-eatpur-text-light
              "
            >
              This section helps identify which products consumers actually
              want, what factors influence purchase decisions, and how Eatpur
              products should be positioned in the market.
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
                If consumers rate "Taste" and "Nutrition" as Very Important
                while selecting Millet Cookies and Millet Snacks, those become
                priority products for launch.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductValidationSection;
