import { useMemo, useState } from "react";

import {
  INITIAL_FORM_DATA,
  SURVEY_SECTIONS,
} from "../constants/surveyQuestions";

const useSurveyForm = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const [errors, setErrors] = useState({});

  const [submitted, setSubmitted] = useState(false);

  const [loading, setLoading] = useState(false);

  /*
   * ----------------------------------
   * Helpers
   * ----------------------------------
   */

  const totalSteps = SURVEY_SECTIONS.length;

  const currentSection = SURVEY_SECTIONS[currentStep - 1];

  const progress = useMemo(() => {
    return Math.round((currentStep / totalSteps) * 100);
  }, [currentStep, totalSteps]);

  /*
   * ----------------------------------
   * Update Single Field
   * ----------------------------------
   */

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  };

  /*
   * ----------------------------------
   * Validation
   * ----------------------------------
   */

  const validateSection = () => {
    if (!currentSection) {
      return true;
    }

    const newErrors = {};

    currentSection.questions.forEach((question) => {
      if (!question.required) {
        return;
      }

      const value = formData[question.id];

      switch (question.type) {
        case "text":
        case "textarea":
        case "radio":
          if (!value || value === "") {
            newErrors[question.id] = "This field is required";
          }
          break;

        case "checkbox":
          if (!value || value.length === 0) {
            newErrors[question.id] = "Please select at least one option";
          }
          break;

        case "rating":
          if (!value) {
            newErrors[question.id] = "Please select a rating";
          }
          break;

        case "slider":
          if (value === null || value === undefined) {
            newErrors[question.id] = "Please select a value";
          }
          break;

        case "matrix":
          if (!value || Object.keys(value).length < question.rows.length) {
            newErrors[question.id] = "Please answer all rows";
          }
          break;

        default:
          break;
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /*
   * ----------------------------------
   * Navigation
   * ----------------------------------
   */

  const nextStep = () => {
    const valid = validateSection();

    if (!valid) {
      return false;
    }

    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }

    return true;
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  /*
   * ----------------------------------
   * Submit
   * ----------------------------------
   */

  const submitSurvey = async () => {
    const valid = validateSection();

    if (!valid) {
      return false;
    }

    try {
      setLoading(true);

      /*
       * API CALL GOES HERE
       *
       * Example:
       *
       * await api.post(
       *   "/survey/eatpur",
       *   formData
       * );
       */

      console.log("Survey Submission:", formData);

      setSubmitted(true);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return true;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /*
   * ----------------------------------
   * Reset
   * ----------------------------------
   */

  const resetSurvey = () => {
    setCurrentStep(1);
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    setSubmitted(false);
    setLoading(false);
  };

  /*
   * ----------------------------------
   * Return
   * ----------------------------------
   */

  return {
    formData,
    errors,
    loading,
    submitted,

    currentStep,
    totalSteps,
    currentSection,
    progress,

    updateField,

    nextStep,
    previousStep,

    submitSurvey,

    resetSurvey,

    setCurrentStep,
    setFormData,
    setErrors,
  };
};

export default useSurveyForm;
