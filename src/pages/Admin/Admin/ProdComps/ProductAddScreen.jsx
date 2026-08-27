import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct, getCategories } from "../../../../api/inventory";
import { inputRegex } from "@tiptap/extension-image";

// Icon Helpers
const CheckIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    strokeWidth={3}
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);
const TrashIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);
const PlusIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const STEPS = [
  "Base Details",
  "Sizes & Nutrition",
  "Tags & Media",
  "Review & Submit",
];

export default function ProductAddScreen() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  // -----------------------------------------------------------------------
  // STATE MANAGEMENT
  // -----------------------------------------------------------------------
  const [baseDetails, setBaseDetails] = useState({
    name: "",
    description: "",
    ingredients: "",
    cooking_instructions: "",
    highlights: "",
    category_id: "",
  });

  const createEmptyVariant = () => ({
    id: Date.now() + Math.random(), // Temp ID for React key rendering
    size: { size_name: "MEDIUM", weight: "", unit: "g" },
    fixed_price: "",
    discounted_price: "",
    quantity: "",
    profile: {
      calories: "",
      protein: "",
      carbohydrates: "",
      fibre: "",
      fats: "",
    },
  });

  const [variants, setVariants] = useState([createEmptyVariant()]);

  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]); // Array of { tag_name: string }

  const [images, setImages] = useState([]); // Array of File objects
  const [imagePreviews, setImagePreviews] = useState([]); // Array of Object URLs

  // -----------------------------------------------------------------------
  // INITIALIZATION
  // -----------------------------------------------------------------------
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await getCategories();
        const data = res.data || res.results || res;
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
    fetchCats();
  }, []);

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  // -----------------------------------------------------------------------
  // HANDLERS
  // -----------------------------------------------------------------------
  const handleAddVariant = () => {
    setVariants([...variants, createEmptyVariant()]);
  };

  const handleRemoveVariant = (idToRemove) => {
    if (variants.length === 1) {
      alert("You must have at least one variant.");
      return;
    }
    setVariants(variants.filter((v) => v.id !== idToRemove));
  };

  const updateVariant = (id, field, value, nestedKey = null) => {
    setVariants(
      variants.map((v) => {
        if (v.id === id) {
          if (nestedKey) {
            return { ...v, [nestedKey]: { ...v[nestedKey], [field]: value } };
          }
          return { ...v, [field]: value };
        }
        return v;
      }),
    );
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim()) {
      // Prevent duplicates
      if (
        !tags.find(
          (t) => t.tag_name.toLowerCase() === tagInput.trim().toLowerCase(),
        )
      ) {
        setTags([...tags, { tag_name: tagInput.trim() }]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagName) => {
    setTags(tags.filter((t) => t.tag_name !== tagName));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setImages((prev) => [...prev, ...files]);

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...previews]);

    e.target.value = null; // Reset input
  };

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    const newPreviews = [...imagePreviews];

    newImages.splice(index, 1);
    URL.revokeObjectURL(newPreviews[index]); // Free memory
    newPreviews.splice(index, 1);

    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  // -----------------------------------------------------------------------
  // SUBMISSION
  // -----------------------------------------------------------------------
  const handleSubmit = async () => {
    if (!baseDetails.name || !baseDetails.category_id) {
      alert("Product Name and Category are required.");
      setCurrentStep(1);
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();

      // 1. Core Fields
      formData.append("name", baseDetails.name);
      formData.append("description", baseDetails.description);
      formData.append("ingredients", baseDetails.ingredients);
      formData.append("cooking_instructions", baseDetails.cooking_instructions);
      formData.append("highlights", baseDetails.highlights);
      formData.append("category_id", baseDetails.category_id);

      // 2. Variants (Clean out the temp IDs before sending)
      const cleanVariants = variants.map((v) => {
        const { id, ...rest } = v;
        return rest;
      });
      formData.append("variants", JSON.stringify(cleanVariants));

      // 3. Tags
      formData.append("tags", JSON.stringify(tags));

      // 4. Images
      images.forEach((file) => {
        formData.append("images", file);
      });

      await createProduct(formData);

      alert("Product Collection Created Successfully!");
      navigate("/admin/dashboard/products/all-products");
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to create product.");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------------------------------------
  // RENDER HELPERS
  // -----------------------------------------------------------------------
  const renderStepIndicators = () => (
    <div className="flex items-center justify-between mb-8 relative">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-eatpur-gray-light z-0 rounded-full"></div>
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-eatpur-green z-0 rounded-full transition-all duration-500"
        style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
      ></div>

      {STEPS.map((stepName, idx) => {
        const stepNum = idx + 1;
        const isActive = currentStep === stepNum;
        const isPassed = currentStep > stepNum;

        return (
          <div
            key={stepName}
            className="relative z-10 flex flex-col items-center"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors duration-300 border-2 ${
                isActive
                  ? "bg-eatpur-green-dark border-eatpur-green-dark text-white shadow-md"
                  : isPassed
                    ? "bg-eatpur-dark text-white border-eatpur-dark"
                    : "bg-white text-eatpur-dark border-eatpur-gray-light"
              }`}
            >
              {isPassed ? <CheckIcon /> : stepNum}
            </div>
            <span
              className={`absolute -bottom-6 text-xs font-semibold whitespace-nowrap ${isActive || isPassed ? "text-eatpur-dark" : "text-eatpur-text-light"}`}
            >
              {stepName}
            </span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto pb-20 pt-4 animate-fade-in font-[family-name:var(--font-sans)]">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-eatpur-dark font-[family-name:var(--font-display)]">
          Add New Product
        </h1>
        <p className="text-eatpur-text-light mt-1">
          Create a base product, add size variants, and configure nutritional
          profiles.
        </p>
      </div>

      {renderStepIndicators()}

      <div className="bg-eatpur-card rounded-[--radius-card] shadow-[var(--shadow-card)] border border-eatpur-border mt-12 overflow-hidden">
        {/* ========================================== */}
        {/* STEP 1: BASE DETAILS                       */}
        {/* ========================================== */}
        {currentStep === 1 && (
          <div className="p-6 md:p-8 space-y-6">
            <h2 className="text-xl font-semibold text-eatpur-dark border-b border-eatpur-border pb-3">
              Core Identity
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-eatpur-text mb-1.5">
                  Product Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Organic Almond Milk"
                  value={baseDetails.name}
                  onChange={(e) =>
                    setBaseDetails({ ...baseDetails, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-[--radius-button] border border-slate-300 focus:border-eatpur-green focus:ring-1 focus:ring-eatpur-green-soft outline-none transition-all bg-eatpur-bg-light"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-eatpur-text mb-1.5">
                  Category *
                </label>
                <select
                  value={baseDetails.category_id}
                  onChange={(e) =>
                    setBaseDetails({
                      ...baseDetails,
                      category_id: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-[--radius-button] border border-slate-300 focus:border-eatpur-green focus:ring-1 focus:ring-eatpur-green-soft outline-none transition-all bg-eatpur-bg-light"
                >
                  <option value="" disabled>
                    -- Select a Category --
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-eatpur-text mb-1.5">
                  Base Product Description
                </label>
                <textarea
                  rows="2"
                  placeholder="Write a compelling description that applies to all sizes of this product..."
                  value={baseDetails.description}
                  onChange={(e) =>
                    setBaseDetails({
                      ...baseDetails,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-[--radius-button] border border-slate-300 focus:border-eatpur-green focus:ring-1 focus:ring-eatpur-green-soft outline-none transition-all bg-eatpur-bg-light resize-y"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-eatpur-text mb-1.5">
                  Product Ingredients
                </label>
                <textarea
                  rows="2"
                  placeholder="Describe the ingredients of this product..."
                  value={baseDetails.ingredients}
                  onChange={(e) =>
                    setBaseDetails({
                      ...baseDetails,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-[--radius-button] border border-slate-300 focus:border-eatpur-green focus:ring-1 focus:ring-eatpur-green-soft outline-none transition-all bg-eatpur-bg-light resize-y"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-eatpur-text mb-1.5">
                  Instructions for cooking this product
                </label>
                <textarea
                  rows="4"
                  placeholder="Write instructions for cooking this product, that applies to all sizes of this product..."
                  value={baseDetails.cooking_instructions}
                  onChange={(e) =>
                    setBaseDetails({
                      ...baseDetails,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-[--radius-button] border border-slate-300 focus:border-eatpur-green focus:ring-1 focus:ring-eatpur-green-soft outline-none transition-all bg-eatpur-bg-light resize-y"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-eatpur-text mb-1.5">
                  Product Highlights (Meta Description)
                </label>
                <textarea
                  rows="1"
                  placeholder="Write all compelling highlights that applies to all sizes of this product..."
                  value={baseDetails.highlights}
                  onChange={(e) =>
                    setBaseDetails({
                      ...baseDetails,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-[--radius-button] border border-slate-300 focus:border-eatpur-green focus:ring-1 focus:ring-eatpur-green-soft outline-none transition-all bg-eatpur-bg-light resize-y"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* STEP 2: VARIANTS & NUTRITION               */}
        {/* ========================================== */}
        {currentStep === 2 && (
          <div className="p-6 md:p-8 bg-eatpur-bg-light">
            <div className="flex justify-between items-center mb-6 border-b border-eatpur-border pb-3">
              <h2 className="text-xl font-semibold text-eatpur-dark">
                Sizes & Variations
              </h2>
              <button
                onClick={handleAddVariant}
                className="flex items-center gap-1 bg-eatpur-green-pale hover:bg-eatpur-green-soft text-eatpur-green-dark px-3 py-1.5 rounded-[--radius-button] font-medium text-sm transition-colors border border-eatpur-green-light"
              >
                <PlusIcon /> Add Size
              </button>
            </div>

            <div className="space-y-6">
              {variants.map((variant, index) => (
                <div
                  key={variant.id}
                  className="bg-white border border-eatpur-border rounded-[--radius-card] shadow-sm relative overflow-hidden"
                >
                  {/* Variant Header */}
                  <div className="bg-eatpur-white-warm px-4 py-3 border-b border-eatpur-border flex justify-between items-center">
                    <span className="font-bold text-eatpur-dark tracking-wide">
                      Variant #{index + 1}
                    </span>
                    {variants.length > 1 && (
                      <button
                        onClick={() => handleRemoveVariant(variant.id)}
                        className="text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 p-1.5 rounded transition-colors"
                        title="Delete Variant"
                      >
                        <TrashIcon />
                      </button>
                    )}
                  </div>

                  <div className="p-5 space-y-6">
                    {/* Physical Properties */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-eatpur-text-light mb-3">
                        Size & Pricing
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                        <div className="col-span-2">
                          <label className="block text-xs font-semibold text-slate-500 mb-1">
                            Size Classification
                          </label>
                          <select
                            value={variant.size.size_name}
                            onChange={(e) =>
                              updateVariant(
                                variant.id,
                                "size_name",
                                e.target.value,
                                "size",
                              )
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded focus:border-eatpur-green outline-none text-sm"
                          >
                            <option value="SMALL">Small</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="LARGE">Large</option>
                          </select>
                        </div>
                        <div className="col-span-1">
                          <label className="block text-xs font-semibold text-slate-500 mb-1">
                            Weight/Vol
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={variant.size.weight}
                            onChange={(e) =>
                              updateVariant(
                                variant.id,
                                "weight",
                                e.target.value,
                                "size",
                              )
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded focus:border-eatpur-green outline-none text-sm"
                            placeholder="e.g. 500"
                          />
                        </div>
                        <div className="col-span-1">
                          <label className="block text-xs font-semibold text-slate-500 mb-1">
                            Unit
                          </label>
                          <select
                            value={variant.size.unit}
                            onChange={(e) =>
                              updateVariant(
                                variant.id,
                                "unit",
                                e.target.value,
                                "size",
                              )
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded focus:border-eatpur-green outline-none text-sm"
                          >
                            <option value="g">g</option>
                            <option value="kg">kg</option>
                            <option value="ml">ml</option>
                            <option value="l">l</option>
                            <option value="oz">oz</option>
                            <option value="lb">lb</option>
                            <option value="pcs">pcs</option>
                          </select>
                        </div>
                        <div className="col-span-1">
                          <label className="block text-xs font-semibold text-slate-500 mb-1">
                            MRP (₹)
                          </label>
                          <input
                            type="number"
                            value={variant.fixed_price}
                            onChange={(e) =>
                              updateVariant(
                                variant.id,
                                "fixed_price",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded focus:border-eatpur-green outline-none text-sm"
                            placeholder="0.00"
                          />
                        </div>
                        <div className="col-span-1">
                          <label className="block text-xs font-semibold text-slate-500 mb-1">
                            Sell Price (₹)
                          </label>
                          <input
                            type="number"
                            value={variant.discounted_price}
                            onChange={(e) =>
                              updateVariant(
                                variant.id,
                                "discounted_price",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded focus:border-eatpur-green outline-none text-sm"
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                      <div className="mt-4 md:w-1/3">
                        <label className="block text-xs font-semibold text-slate-500 mb-1">
                          Initial Stock Quantity
                        </label>
                        <input
                          type="number"
                          value={variant.quantity}
                          onChange={(e) =>
                            updateVariant(
                              variant.id,
                              "quantity",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded focus:border-eatpur-green outline-none text-sm"
                          placeholder="e.g. 50"
                        />
                      </div>
                    </div>

                    {/* Nutritional Profile */}
                    <div className="pt-4 border-t border-slate-100">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-eatpur-text-light mb-3">
                        Nutritional Profile (per 100g/serving)
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1">
                            Calories (kcal)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={variant.profile.calories}
                            onChange={(e) =>
                              updateVariant(
                                variant.id,
                                "calories",
                                e.target.value,
                                "profile",
                              )
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded focus:border-eatpur-green outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1">
                            Protein (g)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={variant.profile.protein}
                            onChange={(e) =>
                              updateVariant(
                                variant.id,
                                "protein",
                                e.target.value,
                                "profile",
                              )
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded focus:border-eatpur-green outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1">
                            Carbs (g)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={variant.profile.carbohydrates}
                            onChange={(e) =>
                              updateVariant(
                                variant.id,
                                "carbohydrates",
                                e.target.value,
                                "profile",
                              )
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded focus:border-eatpur-green outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1">
                            Fibre (g)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={variant.profile.fibre}
                            onChange={(e) =>
                              updateVariant(
                                variant.id,
                                "fibre",
                                e.target.value,
                                "profile",
                              )
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded focus:border-eatpur-green outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1">
                            Fats (g)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={variant.profile.fats}
                            onChange={(e) =>
                              updateVariant(
                                variant.id,
                                "fats",
                                e.target.value,
                                "profile",
                              )
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded focus:border-eatpur-green outline-none text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* STEP 3: TAGS & MEDIA                       */}
        {/* ========================================== */}
        {currentStep === 3 && (
          <div className="p-6 md:p-8 space-y-8">
            <div className="border-b border-eatpur-border pb-3 mb-6">
              <h2 className="text-xl font-semibold text-eatpur-dark">
                Global Tags & Media
              </h2>
              <p className="text-sm text-eatpur-text-light mt-1">
                Tags and images uploaded here will automatically apply to all
                variants created in Step 2.
              </p>
            </div>

            {/* Tags Section */}
            <div className="bg-eatpur-white-warm p-5 rounded-lg border border-eatpur-border">
              <label className="block text-sm font-semibold text-eatpur-dark mb-2">
                Product Tags
              </label>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="e.g. SugarFree, Vegan, Bestseller"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddTag(e)}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-[--radius-button] focus:border-eatpur-green outline-none"
                />
                <button
                  onClick={handleAddTag}
                  type="button"
                  className="px-5 py-2 bg-eatpur-green-dark text-white font-medium rounded-[--radius-button] hover:bg-eatpur-orange transition-colors"
                >
                  Add Tag
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.length === 0 && (
                  <span className="text-sm text-slate-400 italic">
                    No tags added yet.
                  </span>
                )}
                {tags.map((tag, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-white border border-eatpur-green-light text-eatpur-green-dark px-3 py-1.5 rounded-full text-sm shadow-sm"
                  >
                    <span className="font-medium">#{tag.tag_name}</span>
                    <button
                      onClick={() => handleRemoveTag(tag.tag_name)}
                      className="text-rose-400 hover:text-rose-600 focus:outline-none"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Media Section */}
            <div className="bg-eatpur-white-warm p-5 rounded-lg border border-eatpur-border">
              <label className="block text-sm font-semibold text-eatpur-dark mb-2">
                Product Images
              </label>
              <div className="mb-4">
                <label
                  htmlFor="bulk-image-upload"
                  className="cursor-pointer inline-flex items-center justify-center px-6 py-3 border-2 border-dashed border-eatpur-green text-eatpur-dark font-medium rounded-[--radius-card] hover:bg-eatpur-green-pale] transition-colors w-full md:w-auto"
                >
                  <svg
                    className="w-6 h-6 mr-2 text-eatpur-green"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  Browse & Upload Images
                </label>
                <input
                  id="bulk-image-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>

              <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
                {imagePreviews.map((preview, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-lg border border-slate-200 overflow-hidden group shadow-sm bg-white"
                  >
                    <img
                      src={preview}
                      alt={`Upload ${idx}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => handleRemoveImage(idx)}
                        className="bg-rose-500 text-white p-2 rounded-full hover:bg-rose-600 transform hover:scale-110 transition-all shadow-lg"
                        title="Remove Image"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* STEP 4: REVIEW & SUBMIT                    */}
        {/* ========================================== */}
        {currentStep === 4 && (
          <div className="p-6 md:p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-eatpur-green-pale text-eatpur-green rounded-full flex items-center justify-center mx-auto mb-4 border border-eatpur-green-light">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-eatpur-dark font-[family-name:var(--font-display)]">
                Ready to Publish
              </h2>
              <p className="text-eatpur-text-light">
                Review the configuration below before creating the product
                collection.
              </p>
            </div>

            <div className="bg-eatpur-bg-light border border-eatpur-border rounded-[--radius-card] p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Base Details
                </h4>
                <p className="text-sm">
                  <span className="font-semibold text-slate-600 w-24 inline-block">
                    Name:
                  </span>{" "}
                  <span className="text-eatpur-dark font-medium">
                    {baseDetails.name || "-"}
                  </span>
                </p>
                <p className="text-sm mt-1">
                  <span className="font-semibold text-slate-600 w-24 inline-block">
                    Category ID:
                  </span>{" "}
                  <span className="text-eatpur-dark">
                    {categories.find(
                      (c) => String(c.id) === String(baseDetails.category_id),
                    )?.name || "-"}
                  </span>
                </p>

                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-6 mb-2">
                  Global Media & Tags
                </h4>
                <p className="text-sm">
                  <span className="font-semibold text-slate-600 w-24 inline-block">
                    Images:
                  </span>{" "}
                  <span className="text-eatpur-dark font-bold">
                    {images.length}
                  </span>{" "}
                  file(s)
                </p>
                <p className="text-sm mt-1">
                  <span className="font-semibold text-slate-600 w-24 inline-block">
                    Tags:
                  </span>{" "}
                  <span className="text-eatpur-dark font-medium">
                    {tags.map((t) => t.tag_name).join(", ") || "None"}
                  </span>
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Configured Variants ({variants.length})
                </h4>
                <div className="space-y-3">
                  {variants.map((v, i) => (
                    <div
                      key={i}
                      className="bg-white p-3 rounded border border-slate-200 shadow-sm text-sm"
                    >
                      <p className="font-bold text-eatpur-dark mb-1">
                        {v.size.size_name}{" "}
                        <span className="font-normal text-slate-500">
                          ({v.size.weight}
                          {v.size.unit})
                        </span>
                      </p>
                      <div className="flex justify-between text-slate-600">
                        <span>
                          Price: ₹{v.discounted_price || v.fixed_price}
                        </span>
                        <span>Qty: {v.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* FOOTER NAVIGATION                          */}
        {/* ========================================== */}
        <div className="bg-eatpur-white-warm border-t border-eatpur-border p-4 md:px-8 flex justify-between items-center rounded-b-[--radius-card]">
          <button
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            disabled={currentStep === 1 || loading}
            className={`px-5 py-2.5 rounded-[--radius-button] font-medium transition-colors ${currentStep === 1 ? "opacity-0 cursor-default" : "text-slate-600 bg-white border border-slate-300 hover:bg-slate-50"}`}
          >
            &larr; Back
          </button>

          {currentStep < STEPS.length ? (
            <button
              onClick={() =>
                setCurrentStep((prev) => Math.min(STEPS.length, prev + 1))
              }
              className="px-6 py-2.5 bg-eatpur-dark hover:bg-eatpur-green-dark text-white font-medium rounded-[--radius-button] shadow-sm transition-colors flex items-center gap-2"
            >
              Next Step &rarr;
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`px-8 py-2.5 bg-eatpur-dark hover:bg-[#d67641] text-white font-bold rounded-[--radius-button] shadow-md transition-all flex items-center gap-2 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <CheckIcon /> Create Product
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Simple Animations */}
      <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.4s ease-out forwards;
                }
            `}</style>
    </div>
  );
}
