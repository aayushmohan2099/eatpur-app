// src/pages/Admin/Admin/ProdComps/ProductEditorModal.jsx
import React, { useState, useEffect } from "react";
import Modal from "../UniComps/Modal";
import MagicButton from "../UniComps/MagicButton";
import {
  getProductVariants,
  deleteProduct,
  updateProduct,
  getCategories,
} from "../../../../api/inventory";

export default function ProductEditorModal({
  product,
  isOpen,
  onClose,
  onRefresh,
}) {
  const [variants, setVariants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedVariantId, setExpandedVariantId] = useState(null);
  const [enlargedImage, setEnlargedImage] = useState(null);

  // Base product editable fields
  const [baseDetails, setBaseDetails] = useState({
    name: "",
    description: "",
    ingredients: "",
    cooking_instructions: "",
    highlights: "",
    category_id: "",
  });

  useEffect(() => {
    if (isOpen && product) {
      setBaseDetails({
        name: product.name || "",
        description: product.description || "",
        ingredients: product.ingredients || "",
        cooking_instructions: product.cooking_instructions || "",
        highlights: product.highlights || "",
        category_id: "", // Pre-filled dynamically when variants fetch
      });
      fetchVariants(product.id);
      fetchCategoriesList();
    } else {
      setVariants([]);
      setExpandedVariantId(null);
      setEnlargedImage(null);
    }
  }, [isOpen, product]);

  const fetchCategoriesList = async () => {
    try {
      const res = await getCategories();
      const data = res.data || res.results || res;
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  const fetchVariants = async (id) => {
    setLoading(true);
    try {
      const res = await getProductVariants(id);
      const rawData = res.data || res;

      if (rawData.length > 0) {
        setBaseDetails({
          name: rawData[0].name || "",
          description: rawData[0].description || "",
          ingredients: rawData[0].ingredients || "",
          cooking_instructions: rawData[0].cooking_instructions || "",
          highlights: rawData[0].highlights || "",
          category_id: rawData[0].category?.id || "",
        });
      }

      // Map data to ensure profile, tag, and media fields exist for controlled inputs
      const processedVariants = rawData.map((v) => ({
        ...v,
        profile: v.profile || {
          calories: "",
          protein: "",
          carbohydrates: "",
          fibre: "",
          fats: "",
        },
        shipping_dimension: v.shipping_dimension || {
          weight: "",
          length: "",
          height: "",
          width: "",
        },
        tags: v.tags || [],
        deletedTagIds: [],
        newTags: [],
        tagInputValue: "",
        media: v.media || [],
        deletedMediaIds: [],
        newImages: [], // File objects
        newImagePreviews: [], // Object URLs
      }));

      setVariants(processedVariants);
    } catch (err) {
      console.error("Failed to load product variants", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBaseChange = (e) => {
    const { name, value } = e.target;
    setBaseDetails((prev) => ({ ...prev, [name]: value }));
  };

  // ----------------------------------------------------------------
  // Variant Field Handlers
  // ----------------------------------------------------------------
  const handleVariantChange = (variantId, field, value) => {
    setVariants((prev) =>
      prev.map((v) => (v.id === variantId ? { ...v, [field]: value } : v)),
    );
  };

  const handleProfileChange = (variantId, field, value) => {
    setVariants((prev) =>
      prev.map((v) =>
        v.id === variantId
          ? { ...v, profile: { ...v.profile, [field]: value } }
          : v,
      ),
    );
  };

  // ----------------------------------------------------------------
  // Tag Handlers
  // ----------------------------------------------------------------
  const handleAddTag = (variantId) => {
    setVariants((prev) =>
      prev.map((v) => {
        if (v.id === variantId && v.tagInputValue.trim() !== "") {
          const newTag = { tag_name: v.tagInputValue.trim() };
          return {
            ...v,
            newTags: [...v.newTags, newTag],
            tagInputValue: "", // reset input
          };
        }
        return v;
      }),
    );
  };

  const handleRemoveTag = (variantId, tag, isNew = false, index = -1) => {
    setVariants((prev) =>
      prev.map((v) => {
        if (v.id === variantId) {
          if (isNew) {
            const updatedNewTags = [...v.newTags];
            updatedNewTags.splice(index, 1);
            return { ...v, newTags: updatedNewTags };
          } else {
            return { ...v, deletedTagIds: [...v.deletedTagIds, tag.id] };
          }
        }
        return v;
      }),
    );
  };

  // ----------------------------------------------------------------
  // Media Handlers
  // ----------------------------------------------------------------
  const handleAddMedia = (variantId, e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setVariants((prev) =>
      prev.map((v) => {
        if (v.id === variantId) {
          const previews = files.map((file) => URL.createObjectURL(file));
          return {
            ...v,
            newImages: [...v.newImages, ...files],
            newImagePreviews: [...(v.newImagePreviews || []), ...previews],
          };
        }
        return v;
      }),
    );

    // Reset file input so same files can be selected again if needed
    e.target.value = null;
  };

  const handleRemoveMedia = (
    variantId,
    mediaItem,
    isNew = false,
    index = -1,
  ) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    setVariants((prev) =>
      prev.map((v) => {
        if (v.id === variantId) {
          if (isNew) {
            const updatedImages = [...v.newImages];
            const updatedPreviews = [...v.newImagePreviews];

            updatedImages.splice(index, 1);
            URL.revokeObjectURL(updatedPreviews[index]); // Free memory
            updatedPreviews.splice(index, 1);

            return {
              ...v,
              newImages: updatedImages,
              newImagePreviews: updatedPreviews,
            };
          } else {
            return {
              ...v,
              deletedMediaIds: [...v.deletedMediaIds, mediaItem.id],
            };
          }
        }
        return v;
      }),
    );
  };

  // ----------------------------------------------------------------
  // Actions
  // ----------------------------------------------------------------
  const handleUpdateVariant = async (variant) => {
    try {
      const formData = new FormData();
      formData.append("name", baseDetails.name);
      formData.append("description", baseDetails.description);
      formData.append("ingredients", baseDetails.ingredients);
      formData.append("cooking_instructions", baseDetails.cooking_instructions);
      formData.append("highlights", baseDetails.highlights);
      formData.append("fixed_price", variant.fixed_price || 0);
      formData.append("category_id", baseDetails.category_id);
      formData.append("discounted_price", variant.discounted_price || 0);
      formData.append("quantity", variant.quantity || 0);

      // Nested Profile Data
      formData.append("profile", JSON.stringify(variant.profile));

      // Shipping Dimensions Data
      if (variant.shipping_dimension) {
        formData.append(
          "shipping_dimension",
          JSON.stringify(variant.shipping_dimension),
        );
      }

      // Tags Data
      formData.append("delete_tag_ids", JSON.stringify(variant.deletedTagIds));
      formData.append("new_tags", JSON.stringify(variant.newTags));

      // Media Data
      formData.append(
        "delete_media_ids",
        JSON.stringify(variant.deletedMediaIds),
      );
      variant.newImages.forEach((file) => {
        formData.append("new_images", file);
      });

      await updateProduct(variant.id, formData);
      alert(`Variant ${variant.size?.size_name} updated successfully!`);

      // Refresh to reset state and clear object URLs
      fetchVariants(product.id);
      onRefresh();
    } catch (err) {
      alert("Failed to update variant.");
    }
  };

  const handleDeleteVariant = async (variantId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this specific size/variant?",
      )
    ) {
      return;
    }

    try {
      await deleteProduct(variantId);

      alert("Product variant deleted successfully.");

      window.location.href = "/admin/dashboard/products/all-products";
    } catch (err) {
      // 404 after soft-delete is expected — do not show an error.
      if (err?.response?.status === 404) {
        alert("Product variant deleted successfully.");

        window.location.href = "/admin/dashboard/products/all-products";

        return;
      }

      console.error("Delete variant error:", err);
      alert("Failed to delete variant. Please try again.");
    }
  };

  const handleDeleteEntireProduct = async () => {
    if (
      !window.confirm(
        "CRITICAL: Delete ALL sizes and variants of this product?",
      )
    ) {
      return;
    }

    try {
      const promises = variants.map((v) => deleteProduct(v.id));

      await Promise.all(promises);

      alert("Product and all its variants deleted successfully.");

      window.location.href = "/admin/dashboard/products/all-products";
    } catch (err) {
      // 404 after soft-delete is expected — do not show an error.
      if (err?.response?.status === 404) {
        alert("Product and all its variants deleted successfully.");

        window.location.href = "/admin/dashboard/products/all-products";

        return;
      }

      console.error("Delete entire product error:", err);
      alert("Failed to delete entire product collection. Please try again.");
    }
  };

  if (!product) return null;

  return (
    <>
      {/* Full Screen Image Enlarger Overlay */}
      {enlargedImage && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in"
          onClick={() => setEnlargedImage(null)}
        >
          <img
            src={enlargedImage}
            alt="Enlarged product media"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
          <button className="absolute top-6 right-6 text-white text-3xl font-bold hover:text-rose-500 transition-colors">
            &times;
          </button>
        </div>
      )}

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Product Management"
        maxWidth="max-w-4xl"
        closeOnBackdropClick={false}
        footer={
          <>
            <MagicButton variant="danger" onClick={handleDeleteEntireProduct}>
              Delete Entire Product Collection
            </MagicButton>
            <MagicButton
              variant="neutral"
              onClick={onClose}
              className="bg-slate-100 text-slate-700 border-slate-300"
            >
              Close
            </MagicButton>
          </>
        }
      >
        {loading ? (
          <div className="py-12 text-center text-slate-400">
            Loading comprehensive data...
          </div>
        ) : (
          <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
            {/* Base Product Detail Section */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-slate-800">
                  Base Product Settings
                </h4>
                <span className="text-xs font-mono bg-slate-200 px-2 py-1 rounded text-slate-600">
                  Category: {product.category_name}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={baseDetails.name}
                    onChange={handleBaseChange}
                    className="w-full px-3 py-2 rounded border border-slate-300 focus:border-[--color-eatpur-green-dark] outline-none text-sm bg-white"
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Product Type
                  </label>
                  <select
                    name="category_id"
                    value={baseDetails.category_id}
                    onChange={handleBaseChange}
                    className="w-full px-3 py-2 rounded border border-slate-300 focus:border-[--color-eatpur-green-dark] outline-none text-sm bg-white"
                  >
                    <option value="" disabled>
                      Select Type
                    </option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-1">
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Category by Need
                  </label>
                  <select
                    name="need_category_id"
                    value={baseDetails.need_category_id}
                    onChange={handleBaseChange}
                    className="w-full px-3 py-2 rounded border border-slate-300 focus:border-[--color-eatpur-green-dark] outline-none text-sm bg-white"
                  >
                    <option value="" disabled>
                      Select Category
                    </option>
                    <option value="">Kids Nutrition</option>
                    <option value="">Fitness & Weight Loss</option>
                    <option value="">Daily Family Staples</option>
                    <option value="">Quick Meals</option>
                    <option value="">Organic Living</option>
                  </select>
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={baseDetails.description}
                    onChange={handleBaseChange}
                    rows="3"
                    className="w-full px-3 py-2 rounded border border-slate-300 focus:border-[--color-eatpur-green-dark] outline-none text-sm bg-white"
                  ></textarea>
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Ingredients
                  </label>
                  <textarea
                    name="ingredients"
                    value={baseDetails.ingredients}
                    onChange={handleBaseChange}
                    rows="2"
                    className="w-full px-3 py-2 rounded border border-slate-300 focus:border-[--color-eatpur-green-dark] outline-none text-sm bg-white"
                  ></textarea>
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Cooking Instructions
                  </label>
                  <textarea
                    name="cooking_instructions"
                    value={baseDetails.cooking_instructions}
                    onChange={handleBaseChange}
                    rows="3"
                    className="w-full px-3 py-2 rounded border border-slate-300 focus:border-[--color-eatpur-green-dark] outline-none text-sm bg-white"
                  ></textarea>
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Produt Meta Description (Highlights)
                  </label>
                  <textarea
                    name="highlights"
                    value={baseDetails.highlights}
                    onChange={handleBaseChange}
                    rows="1"
                    className="w-full px-3 py-2 rounded border border-slate-300 focus:border-[--color-eatpur-green-dark] outline-none text-sm bg-white"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Sizes / Variants Collapsible Table */}
            <div>
              <h4 className="font-semibold text-slate-800 mb-3">
                Sizes & Variants
              </h4>
              <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                {variants.map((v) => (
                  <div
                    key={v.id}
                    className="border-b border-slate-200 last:border-0"
                  >
                    {/* Collapsible Header */}
                    <div
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                      onClick={() =>
                        setExpandedVariantId(
                          expandedVariantId === v.id ? null : v.id,
                        )
                      }
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-medium text-[--color-eatpur-dark]">
                          {v.size?.size_name}
                        </span>
                        <span className="text-xs text-slate-500">
                          {v.size?.weight} {v.size?.unit}
                        </span>
                        <span className="text-xs font-mono bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200">
                          {v.pid}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-slate-600">
                          Qty: <b>{v.quantity}</b>
                        </span>
                        <span className="text-slate-600">
                          Price: <b>₹{v.fixed_price}</b>
                        </span>
                        <span className="text-slate-400 text-xs">
                          {expandedVariantId === v.id ? "▼" : "▶"}
                        </span>
                      </div>
                    </div>

                    {/* Expanded Edit Form */}
                    {expandedVariantId === v.id && (
                      <div className="p-5 bg-slate-50 border-t border-slate-200 space-y-6">
                        {/* 1. Core Variant Details */}
                        <div>
                          <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                            Pricing & Inventory
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-slate-500 mb-1">
                                Fixed Price (₹)
                              </label>
                              <input
                                type="number"
                                value={v.fixed_price}
                                onChange={(e) =>
                                  handleVariantChange(
                                    v.id,
                                    "fixed_price",
                                    e.target.value,
                                  )
                                }
                                className="w-full px-3 py-2 rounded border border-slate-300 text-sm bg-white outline-none focus:border-[--color-eatpur-green-dark]"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-500 mb-1">
                                Discount Price (₹)
                              </label>
                              <input
                                type="number"
                                value={v.discounted_price}
                                onChange={(e) =>
                                  handleVariantChange(
                                    v.id,
                                    "discounted_price",
                                    e.target.value,
                                  )
                                }
                                className="w-full px-3 py-2 rounded border border-slate-300 text-sm bg-white outline-none focus:border-[--color-eatpur-green-dark]"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-500 mb-1">
                                Stock Quantity
                              </label>
                              <input
                                type="number"
                                value={v.quantity}
                                onChange={(e) =>
                                  handleVariantChange(
                                    v.id,
                                    "quantity",
                                    e.target.value,
                                  )
                                }
                                className="w-full px-3 py-2 rounded border border-slate-300 text-sm bg-white outline-none focus:border-[--color-eatpur-green-dark]"
                              />
                            </div>
                          </div>
                        </div>

                        {/* 2. Product Profile (Nutritional) */}
                        <div>
                          <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                            Nutritional Profile
                          </h5>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-slate-500 mb-1">
                                Calories (kcal)
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                value={v.profile?.calories || ""}
                                onChange={(e) =>
                                  handleProfileChange(
                                    v.id,
                                    "calories",
                                    e.target.value,
                                  )
                                }
                                className="w-full px-2 py-1.5 rounded border border-slate-300 text-sm bg-white outline-none focus:border-[--color-eatpur-green-dark]"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-500 mb-1">
                                Protein (g)
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                value={v.profile?.protein || ""}
                                onChange={(e) =>
                                  handleProfileChange(
                                    v.id,
                                    "protein",
                                    e.target.value,
                                  )
                                }
                                className="w-full px-2 py-1.5 rounded border border-slate-300 text-sm bg-white outline-none focus:border-[--color-eatpur-green-dark]"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-500 mb-1">
                                Carbs (g)
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                value={v.profile?.carbohydrates || ""}
                                onChange={(e) =>
                                  handleProfileChange(
                                    v.id,
                                    "carbohydrates",
                                    e.target.value,
                                  )
                                }
                                className="w-full px-2 py-1.5 rounded border border-slate-300 text-sm bg-white outline-none focus:border-[--color-eatpur-green-dark]"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-500 mb-1">
                                Fibre (g)
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                value={v.profile?.fibre || ""}
                                onChange={(e) =>
                                  handleProfileChange(
                                    v.id,
                                    "fibre",
                                    e.target.value,
                                  )
                                }
                                className="w-full px-2 py-1.5 rounded border border-slate-300 text-sm bg-white outline-none focus:border-[--color-eatpur-green-dark]"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-500 mb-1">
                                Fats (g)
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                value={v.profile?.fats || ""}
                                onChange={(e) =>
                                  handleProfileChange(
                                    v.id,
                                    "fats",
                                    e.target.value,
                                  )
                                }
                                className="w-full px-2 py-1.5 rounded border border-slate-300 text-sm bg-white outline-none focus:border-[--color-eatpur-green-dark]"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Shipping Dimensions (Ekart Required) */}
                        <div className="pt-4 border-t border-slate-200">
                          <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                            Shipping Dimensions
                          </h5>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-slate-500 mb-1">
                                Gross Weight (g)
                              </label>
                              <input
                                type="number"
                                min="1"
                                value={v.shipping_dimension?.weight || ""}
                                onChange={(e) =>
                                  handleVariantChange(
                                    v.id,
                                    "shipping_dimension",
                                    {
                                      ...v.shipping_dimension,
                                      weight: e.target.value,
                                    },
                                  )
                                }
                                className="w-full px-2 py-1.5 rounded border border-slate-300 text-sm bg-white outline-none focus:border-[--color-eatpur-green-dark]"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-500 mb-1">
                                Length (cm)
                              </label>
                              <input
                                type="number"
                                min="1"
                                value={v.shipping_dimension?.length || ""}
                                onChange={(e) =>
                                  handleVariantChange(
                                    v.id,
                                    "shipping_dimension",
                                    {
                                      ...v.shipping_dimension,
                                      length: e.target.value,
                                    },
                                  )
                                }
                                className="w-full px-2 py-1.5 rounded border border-slate-300 text-sm bg-white outline-none focus:border-[--color-eatpur-green-dark]"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-500 mb-1">
                                Width (cm)
                              </label>
                              <input
                                type="number"
                                min="1"
                                value={v.shipping_dimension?.width || ""}
                                onChange={(e) =>
                                  handleVariantChange(
                                    v.id,
                                    "shipping_dimension",
                                    {
                                      ...v.shipping_dimension,
                                      width: e.target.value,
                                    },
                                  )
                                }
                                className="w-full px-2 py-1.5 rounded border border-slate-300 text-sm bg-white outline-none focus:border-[--color-eatpur-green-dark]"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-500 mb-1">
                                Height (cm)
                              </label>
                              <input
                                type="number"
                                min="1"
                                value={v.shipping_dimension?.height || ""}
                                onChange={(e) =>
                                  handleVariantChange(
                                    v.id,
                                    "shipping_dimension",
                                    {
                                      ...v.shipping_dimension,
                                      height: e.target.value,
                                    },
                                  )
                                }
                                className="w-full px-2 py-1.5 rounded border border-slate-300 text-sm bg-white outline-none focus:border-[--color-eatpur-green-dark]"
                              />
                            </div>
                          </div>
                        </div>

                        {/* 3. Product Tags */}
                        <div>
                          <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                            Product Tags
                          </h5>

                          {/* Active Tags Render */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            {/* Render Old Tags (that aren't marked for deletion) */}
                            {v.tags
                              .filter((t) => !v.deletedTagIds.includes(t.id))
                              .map((tag) => (
                                <div
                                  key={tag.id}
                                  className="inline-flex items-center gap-1 bg-[--color-eatpur-white-warm] border border-[--color-eatpur-yellow-light] text-[--color-eatpur-green-dark] px-2.5 py-1 rounded-md text-xs font-medium"
                                >
                                  {tag.tag_name}
                                  <button
                                    onClick={() =>
                                      handleRemoveTag(v.id, tag, false)
                                    }
                                    className="ml-1 text-[--color-eatpur-gold-dark] hover:text-rose-600 transition-colors focus:outline-none"
                                    title="Remove tag"
                                  >
                                    &times;
                                  </button>
                                </div>
                              ))}

                            {/* Render Newly Added Tags */}
                            {v.newTags.map((newTag, idx) => (
                              <div
                                key={`new-${idx}`}
                                className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-1 rounded-md text-xs font-medium"
                              >
                                {newTag.tag_name}
                                <button
                                  onClick={() =>
                                    handleRemoveTag(v.id, newTag, true, idx)
                                  }
                                  className="ml-1 text-emerald-500 hover:text-rose-600 transition-colors focus:outline-none"
                                  title="Remove new tag"
                                >
                                  &times;
                                </button>
                              </div>
                            ))}
                          </div>

                          {/* Tag Input */}
                          <div className="flex items-center gap-2 max-w-sm">
                            <input
                              type="text"
                              placeholder="e.g. #GlutenFree"
                              value={v.tagInputValue}
                              onChange={(e) =>
                                handleVariantChange(
                                  v.id,
                                  "tagInputValue",
                                  e.target.value,
                                )
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleAddTag(v.id);
                                }
                              }}
                              className="flex-1 px-3 py-1.5 rounded border border-slate-300 text-sm bg-white outline-none focus:border-[--color-eatpur-green-dark]"
                            />
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                handleAddTag(v.id);
                              }}
                              className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium rounded transition-colors"
                            >
                              Add
                            </button>
                          </div>
                        </div>

                        {/* 4. Product Media */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                              Product Media
                            </h5>
                            <div>
                              <label
                                htmlFor={`media-upload-${v.id}`}
                                className="cursor-pointer text-xs font-medium px-3 py-1.5 bg-white border border-slate-300 hover:border-[--color-eatpur-green-dark] text-slate-700 hover:text-[--color-eatpur-green-dark] rounded transition-colors inline-block shadow-sm"
                              >
                                + Add Photos
                              </label>
                              <input
                                id={`media-upload-${v.id}`}
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={(e) => handleAddMedia(v.id, e)}
                              />
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-4">
                            {/* Render Old Media (that aren't marked for deletion) */}
                            {v.media
                              .filter((m) => !v.deletedMediaIds.includes(m.id))
                              .map((mediaItem) => (
                                <div
                                  key={mediaItem.id}
                                  className="relative group w-24 h-24 rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden"
                                >
                                  <img
                                    src={mediaItem.image}
                                    alt="Product"
                                    className="w-full h-full object-cover cursor-zoom-in transition-transform duration-300 group-hover:scale-105"
                                    onClick={() =>
                                      setEnlargedImage(mediaItem.image)
                                    }
                                  />
                                  <button
                                    onClick={() =>
                                      handleRemoveMedia(v.id, mediaItem, false)
                                    }
                                    className="absolute top-1 right-1 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-600 focus:outline-none"
                                    title="Delete Image"
                                  >
                                    &times;
                                  </button>
                                </div>
                              ))}

                            {/* Render Newly Added Media Previews */}
                            {v.newImagePreviews &&
                              v.newImagePreviews.map((previewUrl, idx) => (
                                <div
                                  key={`new-media-${idx}`}
                                  className="relative group w-24 h-24 rounded-lg border-2 border-emerald-400 bg-emerald-50 shadow-sm overflow-hidden"
                                >
                                  <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none z-10"></div>
                                  <img
                                    src={previewUrl}
                                    alt="New Upload Preview"
                                    className="w-full h-full object-cover cursor-zoom-in transition-transform duration-300 group-hover:scale-105"
                                    onClick={() => setEnlargedImage(previewUrl)}
                                  />
                                  <button
                                    onClick={() =>
                                      handleRemoveMedia(v.id, null, true, idx)
                                    }
                                    className="absolute top-1 right-1 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-600 focus:outline-none z-20"
                                    title="Cancel Upload"
                                  >
                                    &times;
                                  </button>
                                  <span className="absolute bottom-0 left-0 right-0 bg-emerald-500 text-white text-[10px] text-center font-bold tracking-wider py-0.5 z-20">
                                    NEW
                                  </span>
                                </div>
                              ))}

                            {v.media.filter(
                              (m) => !v.deletedMediaIds.includes(m.id),
                            ).length === 0 &&
                              (!v.newImagePreviews ||
                                v.newImagePreviews.length === 0) && (
                                <div className="w-full p-4 border border-dashed border-slate-300 rounded-lg text-center text-sm text-slate-400 bg-slate-50">
                                  No images available for this variant.
                                </div>
                              )}
                          </div>
                        </div>

                        {/* Variant Action Footer */}
                        <div className="flex justify-between items-center pt-4 mt-2 border-t border-slate-200">
                          <button
                            onClick={() => handleDeleteVariant(v.id)}
                            className="text-xs text-rose-600 hover:text-rose-800 font-medium underline"
                          >
                            Delete Size
                          </button>
                          <MagicButton
                            variant="eatpur"
                            onClick={() => handleUpdateVariant(v)}
                          >
                            Save Variant Changes
                          </MagicButton>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
