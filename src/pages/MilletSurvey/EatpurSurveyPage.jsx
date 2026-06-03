// src/pages/MilletSurvey/EatpurSurveyPage.jsx
import React from "react";
import { AnimatePresence, motion } from "framer-motion";

import SurveyHero from "./components/SurveyHero";
import SurveyStepper from "./components/SurveyStepper";
import SurveyNavigation from "./components/SurveyNavigation";

import BasicProfileSection from "./components/sections/BasicProfileSection";
import FoodHabitsSection from "./components/sections/FoodHabitsSection";
import PainPointsSection from "./components/sections/PainPointsSection";
import ProductValidationSection from "./components/sections/ProductValidationSection";
import PricingSection from "./components/sections/PricingSection";
import LeadCollectionSection from "./components/sections/LeadCollectionSection";

import FloatingImagesBackground from "../../pages/FloatingBG/floatingBG";

import useSurveyForm from "./hooks/useSurveyForm";

import { SURVEY_META, SURVEY_SECTIONS } from "./constants/surveyQuestions";

export default function EatpurSurveyPage() {
  const {
    formData,
    errors,
    loading,
    submitted,

    currentStep,
    totalSteps,
    progress,

    updateField,

    nextStep,
    previousStep,

    submitSurvey,
  } = useSurveyForm();

  const renderSection = () => {
    const commonProps = {
      formData,
      updateField,
      errors,
    };

    switch (currentStep) {
      case 1:
        return <BasicProfileSection {...commonProps} />;

      case 2:
        return <FoodHabitsSection {...commonProps} />;

      case 3:
        return <PainPointsSection {...commonProps} />;

      case 4:
        return <ProductValidationSection {...commonProps} />;

      case 5:
        return <PricingSection {...commonProps} />;

      case 6:
        return <LeadCollectionSection {...commonProps} />;

      default:
        return null;
    }
  };

  /*
   * ----------------------------------
   * Success Screen
   * ----------------------------------
   */

  if (submitted) {
    return (
      <div className="min-h-screen bg-eatpur-white-warm px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
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
              p-10
              text-center
              shadow-xl
            "
          >
            <div className="mb-6 text-6xl">🌾</div>

            <h1
              className="
                font-display
                text-4xl
                text-eatpur-dark
              "
            >
              Thank You!
            </h1>

            <p
              className="
                mx-auto
                mt-4
                max-w-2xl
                text-eatpur-text-light
              "
            >
              Your feedback helps us build healthier millet foods for modern
              Indian families.
            </p>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <div
                className="
                  rounded-2xl
                  border
                  border-green-200
                  p-5
                "
              >
                ✓ Free Sample Interest Recorded
              </div>

              <div
                className="
                  rounded-2xl
                  border
                  border-green-200
                  p-5
                "
              >
                ✓ Launch Offers
              </div>

              <div
                className="
                  rounded-2xl
                  border
                  border-green-200
                  p-5
                "
              >
                ✓ Product Testing Opportunities
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  /*
   * ----------------------------------
   * Main Survey
   * ----------------------------------
   */

  return (
    // <div className="min-h-screen eatpur-animated-bg">
    <div
      className="
        relative
        min-h-screen
        eatpur-animated-bg
        overflow-hidden
      "
    >
      {/* Decorative Background */}

      <FloatingImagesBackground />

      {/* <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            left-0
            top-0
            h-96
            w-96
            rounded-full
            bg-eatpur-green-light/20
            blur-3xl
          "
        />

        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, -60, 0],
          }}
          transition={{
            duration: 24,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            right-0
            top-60
            h-96
            w-96
            rounded-full
            bg-eatpur-yellow-light/30
            blur-3xl
          "
        />

        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -80, 0],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            left-1/2
            top-1/3
            h-[500px]
            w-[500px]
            -translate-x-1/2

            rounded-full
            bg-eatpur-gold-light/15

            blur-3xl
          "
        />
      </div> */}

      <div className="relative z-10">
        {/* Hero */}

        <SurveyHero
          brand={SURVEY_META.brand}
          title={SURVEY_META.title}
          description={SURVEY_META.description}
          estimatedTime={SURVEY_META.estimatedTime}
        />

        <div
          className="
            mx-auto
            max-w-6xl
            px-4
            pb-16
            md:px-6
          "
        >
          {/* Stepper */}

          <SurveyStepper
            steps={SURVEY_SECTIONS.map((section, index) => ({
              id: index + 1,
              title: section.title,
            }))}
            currentStep={currentStep}
          />

          {/* Progress */}

          <div className="mt-8">
            <div className="mb-2 flex justify-between">
              <span
                className="
                  text-sm
                  text-eatpur-text-light
                "
              >
                Survey Progress
              </span>

              <span
                className="
                  text-sm
                  font-medium
                  text-eatpur-green-dark
                "
              >
                {progress}%
              </span>
            </div>

            <div
              className="
                h-3
                overflow-hidden
                rounded-full
                bg-gray-200
              "
            >
              <motion.div
                animate={{
                  width: `${progress}%`,
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

          {/* Section */}

          <div className="mt-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{
                  opacity: 0,
                  x: 25,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: -25,
                }}
                transition={{
                  duration: 0.3,
                }}
              >
                {renderSection()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}

          <div className="mt-8">
            <SurveyNavigation
              currentStep={currentStep}
              totalSteps={totalSteps}
              onBack={previousStep}
              onNext={nextStep}
              onSubmit={submitSurvey}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
