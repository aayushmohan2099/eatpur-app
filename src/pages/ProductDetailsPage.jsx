//src\pages\ProductDetailsPage.jsx
import React, { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import { FaArrowLeft, FaStar, FaXmark } from "react-icons/fa6";

import {
  ProductCatalog,
  getProductComments,
  createProductComment,
} from "../api/inventory";

import CartButton from "../components/ui/CartButton";
import { useCart } from "../context/CartContext";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { dispatch } = useCart();

  const isModal = Boolean(location.state?.backgroundLocation);

  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);

  const [activeTab, setActiveTab] = useState("nutrition");
  const [activeImage, setActiveImage] = useState(0);

  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    content: "",
    images: [],
  });

  const [submittingReview, setSubmittingReview] = useState(false);

  // Renders content in document.body when in modal mode, so the navbar and
  // floating popups (like Farmer Connect) can never appear above the modal.
  const wrapInPortal = (node) =>
    isModal ? createPortal(node, document.body) : node;

  // Close modal or return to Products page.
  const handleClose = useCallback(() => {
    if (isModal) {
      navigate(-1);
    } else {
      navigate("/products");
    }
  }, [isModal, navigate]);

  // Fetch product using route ID.
  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      setLoadingProduct(true);
      setProduct(null);

      try {
        const response = await ProductCatalog({});

        const productList =
          response?.results ||
          response?.data?.results ||
          response?.data ||
          response ||
          [];

        const foundProduct = Array.isArray(productList)
          ? productList.find((item) => Number(item.id) === Number(id))
          : null;

        if (isMounted) {
          setProduct(foundProduct || null);
        }
      } catch (error) {
        console.error("Failed to load product details:", error);

        if (isMounted) {
          setProduct(null);
        }
      } finally {
        if (isMounted) {
          setLoadingProduct(false);
        }
      }
    };

    fetchProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Reset state when a different product is opened.
  useEffect(() => {
    setActiveTab("nutrition");
    setActiveImage(0);
    setReviews([]);

    setReviewForm({
      rating: 0,
      content: "",
      images: [],
    });
  }, [id]);

  // Escape key closes modal.
  useEffect(() => {
    if (!isModal) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isModal, handleClose]);

  // Lock background page scroll while the modal is open.
  useEffect(() => {
    if (!isModal) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isModal]);

  // Fetch product reviews.
  const fetchReviews = async () => {
    if (!product?.pid) return;

    setLoadingReviews(true);

    try {
      const data = await getProductComments(product.pid);

      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load product reviews:", err);
      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    if (activeTab === "reviews" && product?.pid) {
      fetchReviews();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, product?.pid]);

  // Review image selection.
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length > 3) {
      alert("Maximum 3 images allowed per review.");
      e.target.value = "";
      return;
    }

    setReviewForm((previous) => ({
      ...previous,
      images: files,
    }));
  };

  // Submit review.
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (reviewForm.rating === 0) {
      alert("Please select a star rating before submitting.");
      return;
    }

    if (!reviewForm.content.trim()) return;

    setSubmittingReview(true);

    const formData = new FormData();

    formData.append("rating", reviewForm.rating);
    formData.append("content", reviewForm.content);

    reviewForm.images.forEach((file) => {
      formData.append("images", file);
    });

    try {
      await createProductComment(product.pid, formData);

      setReviewForm({
        rating: 0,
        content: "",
        images: [],
      });

      e.target.reset();

      await fetchReviews();
    } catch (err) {
      alert(err.message || "Failed to submit review. Are you logged in?");
    } finally {
      setSubmittingReview(false);
    }
  };

  // Product loading.
  if (loadingProduct) {
    return wrapInPortal(
      <div
        className={`flex items-center justify-center bg-eatpur-white-warm ${
          isModal ? "fixed inset-0 z-[9998]" : "min-h-screen"
        }`}
      >
        <p className="text-eatpur-green-dark font-semibold">
          Loading product details...
        </p>
      </div>,
    );
  }

  if (!product) {
    return wrapInPortal(
      <div
        className={`flex flex-col items-center justify-center gap-4 bg-eatpur-white-warm ${
          isModal ? "fixed inset-0 z-[9998]" : "min-h-screen"
        }`}
      >
        <h2 className="text-2xl font-bold text-eatpur-dark">
          Product Not Found
        </h2>

        <button
          onClick={handleClose}
          className="px-5 py-2 rounded-full bg-eatpur-green-dark text-white"
        >
          Back to Products
        </button>
      </div>,
    );
  }

  // Product images.
  const images = Array.isArray(product.cover_image)
    ? product.cover_image
    : typeof product.cover_image === "string" && product.cover_image.trim()
      ? [product.cover_image]
      : [];

  const tabs = ["nutrition", "ingredients", "instructions to cook", "reviews"];

  // Product details content.
  const detailsContent = (
    <>
      {/* Header - only shown in full-page mode */}
      {!isModal && (
        <div className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3 bg-white/95 backdrop-blur border-b border-eatpur-gray-light">
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex items-center gap-2 text-sm font-semibold text-eatpur-green-dark hover:text-eatpur-dark transition-colors"
          >
            <FaArrowLeft />
            Back to Products
          </button>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close product details"
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-rose-100 hover:text-rose-600 flex items-center justify-center transition-colors"
          >
            <FaXmark size={20} />
          </button>
        </div>
      )}

      {/* Main Two Column Layout */}
      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-0 ${
          isModal ? "h-full min-h-0" : ""
        }`}
      >
        {/* LEFT: Product Image Gallery */}
        <div
          className={`bg-eatpur-green-dark p-2 ${
            isModal
              ? "h-full min-h-[260px] md:min-h-0 flex flex-col"
              : "p-4 sm:p-6 md:p-8"
          }`}
        >
          <div
            className={`flex items-center justify-center rounded-2xl bg-white overflow-hidden ${
              isModal
                ? "flex-1 min-h-[240px] md:min-h-0"
                : "h-[280px] sm:h-[380px] lg:h-[460px] border border-eatpur-gray-light"
            }`}
          >
            {images.length > 0 ? (
              <img
                src={images[activeImage] || images[0]}
                alt={product.name}
                className="w-full h-full object-contain p-3 sm:p-5"
              />
            ) : (
              <p className="text-eatpur-text-light italic">
                No Image Available
              </p>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-3 mt-3 overflow-x-auto pb-1 shrink-0">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl bg-white p-2 border-2 ${
                    activeImage === index
                      ? "border-white"
                      : "border-eatpur-gray-light"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Product Information */}
        <div
          className={`p-5 sm:p-6 lg:p-8 flex flex-col bg-white ${
            isModal ? "h-full min-h-0 overflow-y-auto" : ""
          }`}
        >
          {/* Tabs at the top */}
          <div className="flex flex-wrap items-center gap-2 mb-5 pr-8">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-2 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-colors ${
                  activeTab === tab
                    ? "bg-eatpur-green-dark text-white shadow-sm"
                    : "bg-slate-100 text-eatpur-text hover:bg-slate-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Product Category and Trending */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            {product.category_name ? (
              <span className="bg-eatpur-green-light/20 text-eatpur-green-dark px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                {product.category_name}
              </span>
            ) : (
              <span />
            )}

            {product.is_trending && (
              <span className="bg-eatpur-gold-light/30 text-eatpur-gold-dark px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                Trending
              </span>
            )}
          </div>

          {/* Product Name */}
          <h1 className="text-3xl md:text-4xl font-serif font-bold leading-tight text-eatpur-dark">
            {product.name}
          </h1>

          <p className="text-xs font-mono text-eatpur-text-light mt-2 mb-6">
            PID: {product.pid}
          </p>

          {/* Price */}
          <div className="flex flex-wrap items-center gap-4 border-b border-eatpur-gray-light pb-6 mb-6">
            <span className="text-4xl font-bold text-eatpur-dark">
              ₹{product.discounted_price}
            </span>

            {Number(product.fixed_price) > Number(product.discounted_price) && (
              <div>
                <span className="relative text-lg text-eatpur-text-light">
                  ₹{product.fixed_price}
                  <span className="absolute left-0 top-1/2 w-full h-px bg-rose-500 -rotate-12" />
                </span>

                <p className="text-xs font-bold text-rose-600">
                  Save {product.discount_percentage}%
                </p>
              </div>
            )}
          </div>

          {/* Tab Content */}
          <div className="min-h-[220px]">
            {/* Nutrition */}
            {activeTab === "nutrition" && (
              <div>
                <p className="text-sm md:text-base text-eatpur-text leading-relaxed mb-6 whitespace-pre-line">
                  {product.description || ""}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  {[
                    ["Protein", `${product.protein || 0}g`],
                    ["Carbs", `${product.carbohydrates || 0}g`],
                    ["Fibre", `${product.fibre || 0}g`],
                    ["Calories", product.calories || 0],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="p-3 sm:p-4 text-center rounded-xl bg-[#FAFCFA] border border-eatpur-gray-light shadow-sm"
                    >
                      <p className="text-[10px] uppercase font-bold text-eatpur-text-light mb-2">
                        {label}
                      </p>

                      <p className="text-base sm:text-lg font-bold font-mono">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ingredients */}
            {activeTab === "ingredients" && (
              <div className="p-5 rounded-2xl bg-[#FAFCFA] border border-eatpur-gray-light text-sm text-eatpur-text leading-relaxed whitespace-pre-line">
                {product.ingredients ||
                  "100% natural ingredients without artificial additives or preservatives."}
              </div>
            )}

            {/* Cooking Instructions */}
            {activeTab === "instructions to cook" && (
              <div className="p-5 rounded-2xl bg-[#FAFCFA] border border-eatpur-gray-light text-sm text-eatpur-text leading-relaxed whitespace-pre-line">
                {product.instructions ||
                  product.how_to_use ||
                  product.cooking_instructions ||
                  "Please follow the instructions on the product pack."}
              </div>
            )}

            {/* Reviews */}
            {activeTab === "reviews" && (
              <div className="flex flex-col gap-4">
                <div className="max-h-[280px] overflow-y-auto space-y-3 pr-1">
                  {loadingReviews ? (
                    <p className="text-sm text-center text-eatpur-text-light">
                      Loading reviews...
                    </p>
                  ) : reviews.length === 0 ? (
                    <p className="text-sm text-center text-eatpur-text-light py-5">
                      No reviews yet. Be the first to review!
                    </p>
                  ) : (
                    reviews.map((review) => (
                      <div
                        key={review.id}
                        className="p-4 rounded-xl bg-slate-50 border border-slate-100"
                      >
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            {review.avatar ? (
                              <img
                                src={review.avatar}
                                alt={review.username || "Reviewer"}
                                className="w-7 h-7 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-eatpur-green-dark text-white flex items-center justify-center text-xs font-bold">
                                {review.username?.charAt(0) || "U"}
                              </div>
                            )}

                            <span className="font-bold text-sm">
                              {review.username || "User"}
                            </span>
                          </div>

                          <span className="text-xs font-bold text-eatpur-gold-dark flex items-center gap-1">
                            <FaStar />
                            {review.rating}/5
                          </span>
                        </div>

                        <p className="text-sm text-eatpur-text">
                          {review.content}
                        </p>

                        {review.attached_images?.length > 0 && (
                          <div className="flex gap-2 mt-3">
                            {review.attached_images.map((image) => (
                              <img
                                key={image.id}
                                src={image.image}
                                alt="Review attachment"
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Add Review Form */}
                <form
                  onSubmit={handleReviewSubmit}
                  className="p-4 rounded-xl border-2 border-eatpur-green-light/30 flex flex-col gap-3"
                >
                  <h3 className="text-xs font-bold uppercase tracking-wider">
                    Write a Review
                  </h3>

                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          setReviewForm((previous) => ({
                            ...previous,
                            rating: star,
                          }))
                        }
                        className="transition-transform hover:scale-110"
                      >
                        <FaStar
                          size={21}
                          className={
                            star <= reviewForm.rating
                              ? "text-yellow-400"
                              : "text-slate-300"
                          }
                        />
                      </button>
                    ))}

                    <span className="text-xs font-bold">
                      {reviewForm.rating
                        ? `${reviewForm.rating}/5`
                        : "Select Rating"}
                    </span>
                  </div>

                  <textarea
                    required
                    rows={3}
                    value={reviewForm.content}
                    onChange={(e) =>
                      setReviewForm((previous) => ({
                        ...previous,
                        content: e.target.value,
                      }))
                    }
                    placeholder="Share your experience..."
                    className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 text-sm outline-none focus:border-eatpur-green-dark resize-none"
                  />

                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="text-xs"
                  />

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="self-end px-5 py-2 rounded-full bg-eatpur-green-dark text-white text-xs font-bold uppercase disabled:opacity-50"
                  >
                    {submittingReview ? "Posting..." : "Post Review"}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Add To Cart */}
          <div className="mt-7 pt-5 border-t border-eatpur-gray-light">
            <CartButton
              onClick={() => {
                dispatch({
                  type: "ADD_ITEM",
                  payload: product,
                });
              }}
              onAnimationComplete={() => {
                // Modal stays open; the cart sidebar renders above it (z-index
                // higher than the modal, see CartSidebar.jsx).
                dispatch({ type: "OPEN_CART" });
              }}
            />
          </div>
        </div>
      </div>
    </>
  );

  // Modal display when opened from ProductsPage.
  // Rendered in a portal on document.body with a very high z-index so the
  // navbar and the Farmer Connect popup stay behind the overlay.
  if (isModal) {
    return createPortal(
      <div
        className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4"
        onClick={handleClose}
      >
        <div
          className="relative w-full max-w-6xl h-[92vh] max-h-[820px] overflow-hidden rounded-3xl border-[8px] border-eatpur-green-dark bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Floating Close Button */}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close product details"
            className="absolute top-3 right-3 z-50 w-11 h-11 rounded-full bg-white shadow-lg hover:bg-slate-100 flex items-center justify-center text-eatpur-dark transition-colors"
          >
            <FaXmark size={20} />
          </button>

          {/* Product Details */}
          <div className="h-full overflow-hidden">{detailsContent}</div>
        </div>
      </div>,
      document.body,
    );
  }

  // Normal full-page display for direct URL visits.
  return (
    <div className="min-h-screen bg-eatpur-white-warm pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-3 sm:px-5">
        <div className="overflow-hidden rounded-2xl sm:rounded-3xl bg-white shadow-xl">
          {detailsContent}
        </div>
      </div>
    </div>
  );
}
