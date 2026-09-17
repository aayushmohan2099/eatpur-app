// src\pages\HomePage.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HomeAnalytics } from "../api/homepage"; // Ensure this uses the updated client/axios interceptor
import { motion, AnimatePresence } from "framer-motion";
import {
  FaLeaf,
  FaCartShopping,
  FaEye,
  FaXmark,
  FaChild,
  FaDumbbell,
  FaHouseUser,
  FaBowlFood,
  FaSeedling,
  FaCommentDots,
  FaQuoteLeft,
  FaStar,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa6";
import { useCart } from "../context/CartContext";
import Chatbot from "../components/Chatbot";
import FloatingImagesBackground from "./FloatingBG/floatingBG";
import DistortedGallery from "../components/DistortedGallery";
import FssaiLogo from "../assets/Img/fssailogo.png";
import StartupIndiaLogo from "../assets/Img/startupindlogo.png";
import NutrihubLogo from "../assets/Img/nutrihublogo.jpeg";
import MSMELogo from "../assets/Img/MSME_Logo_India.png";
import {
  ThreeDScrollTriggerContainer,
  ThreeDScrollTriggerRow,
} from "../components/ui/ThreeDScrollTrigger";
import LeafButton from "../components/ui/LeafButton";
import DraggableGrid from "../components/ui/DraggableGrid";
import FssaiLicense from "../certificates/EATPURFssaiLicense.pdf";
import MSMECertificate from "../certificates/EATPUR _ Udyam Registration Certificate.pdf";
import StartupMOU from "../certificates/Startup certificate.pdf";
import NutriDoc from "../certificates/EATPUR NATURALS LLP MoU with Nutrihub,ICAR-IIMR soft copy_signed.pdf";
import { createProductComment, getProductComments } from "../api/inventory";
import CartButton from "../components/ui/CartButton";

export default function HomePage() {
  const { dispatch } = useCart();

  // Shailendra Merger: Navigation controls
  const navigate = useNavigate();
  const redirectToLoginAfterCartAnimation = useRef(false);
  const isDeployedServer =
    import.meta.env.PROD &&
    !["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);

  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Shailendra Merger: Active tab states
  const [activeTab, setActiveTab] = useState("nutrition");
  const [quickViewReviews, setQuickViewReviews] = useState([]);
  const [loadingQuickViewReviews, setLoadingQuickViewReviews] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    content: "",
    images: [],
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  // Live API Data States
  const [heroImages, setHeroImages] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [productRatings, setProductRatings] = useState([]);

  const [topBlogs, setTopBlogs] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Shailendra Merger: Producty to cart addons
  const handleAddToCart = (product, image) => {
    if (!localStorage.getItem("access")) {
      dispatch({ type: "TOGGLE_CART", payload: false });
      redirectToLoginAfterCartAnimation.current = true;
      return;
    }

    dispatch({
      type: "ADD_ITEM",
      payload: {
        ...product,
        id: product.id ?? product.pid,
        ...(image ? { image } : {}),
        price: product.discounted_price || product.fixed_price,
      },
    });
  };

  const BASE_URL = "https://eatpur.in";

  const fixUrlsDeep = (data) => {
    if (typeof data === "string") {
      return data
        .replace(/https?:\/\/66\.116\.207\.88/g, BASE_URL)
        .replace(/https?:\/\/eatpur\.in/g, BASE_URL);
    }

    if (Array.isArray(data)) {
      return data.map(fixUrlsDeep);
    }

    if (typeof data === "object" && data !== null) {
      const newObj = {};
      for (const key in data) {
        newObj[key] = fixUrlsDeep(data[key]);
      }
      return newObj;
    }

    return data;
  };

  // Fetch Home Analytics
  useEffect(() => {
    const fetchHomeAnalytics = async () => {
      try {
        setIsLoading(true);
        const res = await HomeAnalytics();
        const rawData = res.data?.results || res.data || res;
        const data = fixUrlsDeep(rawData);

        // 1. Map Top Blogs
        if (data.top_blogs) setTopBlogs(data.top_blogs);

        // 2. Map Google Form Responses (Reviews)
        if (data.google_form_responses)
          setUserReviews(data.google_form_responses);

        // 3. Flatten Trending Categories into a single array of products
        if (data.trending_by_category) {
          const flatProducts = data.trending_by_category.flatMap((cat) =>
            cat.products.map((prod) => ({
              ...prod,
              ...(prod.profile ||
                prod.nutrition_profile ||
                prod.product_profile ||
                {}),
              categoryName: cat.category?.name || "Ready to Eat",
            })),
          );
          setTrendingProducts(flatProducts);

          // Shailendra Merger: Entries for rating
          const ratingEntries = await Promise.all(
            flatProducts.map(async (product) => {
              const catalogRating =
                product.average_rating ??
                product.avg_rating ??
                product.rating_average ??
                product.rating;
              if (catalogRating != null) return null;

              try {
                const response = await getProductComments(product.pid);
                const ratings = (Array.isArray(response) ? response : [])
                  .map((review) => Number(review.rating))
                  .filter(
                    (rating) =>
                      Number.isFinite(rating) && rating >= 1 && rating <= 5,
                  );
                if (ratings.length === 0) return null;

                return [
                  product.pid,
                  {
                    average:
                      ratings.reduce((sum, rating) => sum + rating, 0) /
                      ratings.length,
                    count: ratings.length,
                  },
                ];
              } catch (error) {
                console.error(
                  `Failed to load rating for ${product.pid}`,
                  error,
                );
                return null;
              }
            }),
          );
          setProductRatings(Object.fromEntries(ratingEntries.filter(Boolean)));
        }

        // 4. Map Featured Banners for Hero Carousel
        if (data.featured_banners && data.featured_banners.length > 0) {
          const bannerUrls = data.featured_banners.map(
            (banner) => banner.image,
          );
          setHeroImages(bannerUrls);
        } else {
          // Fallback if no banners are set in admin
          setHeroImages([
            "/home/home-carousel/pic1.jpeg",
            "/home/home-carousel/pic2.jpeg",
            "/home/home-carousel/pic3.jpeg",
          ]);
        }
      } catch (err) {
        console.error("Error fetching home analytics", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHomeAnalytics();
  }, []);

  // Shailendra Merger: loading reviews and creating comments per product
  useEffect(() => {
    if (!quickViewProduct || activeTab !== "reviews") return;

    let isCurrent = true;
    const loadReviews = async () => {
      setLoadingQuickViewReviews(true);
      try {
        const response = await getProductComments(quickViewProduct.pid);
        if (isCurrent)
          setQuickViewReviews(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error(
          `Failed to load reviews for ${quickViewProduct.pid}`,
          error,
        );
        if (isCurrent) setQuickViewReviews([]);
      } finally {
        if (isCurrent) setLoadingQuickViewReviews(false);
      }
    };

    loadReviews();
    return () => {
      isCurrent = false;
    };
  }, [quickViewProduct, activeTab]);

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    if (reviewForm.rating === 0) {
      alert("Please select a star rating before submitting.");
      return;
    }
    if (!reviewForm.content.trim()) return;

    setSubmittingReview(true);
    const formData = new FormData();
    formData.append("rating", reviewForm.rating);
    formData.append("content", reviewForm.content);
    reviewForm.images.forEach((file) => formData.append("images", file));

    try {
      await createProductComment(quickViewProduct.pid, formData);
      setReviewForm({ rating: 0, content: "", images: [] });
      const updatedReviews = await getProductComments(quickViewProduct.pid);
      const reviews = Array.isArray(updatedReviews) ? updatedReviews : [];
      setQuickViewReviews(reviews);
      const ratings = reviews
        .map((review) => Number(review.rating))
        .filter(
          (rating) => Number.isFinite(rating) && rating >= 1 && rating <= 5,
        );
      if (ratings.length > 0) {
        setProductRatings((previous) => ({
          ...previous,
          [quickViewProduct.pid]: {
            average:
              ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length,
            count: ratings.length,
          },
        }));
      }
    } catch (error) {
      alert(error.message || "Failed to submit review. Are you logged in?");
    } finally {
      setSubmittingReview(false);
    }
  };

  // Hero Carousel Timer
  useEffect(() => {
    if (heroImages.length === 0) return;
    const heroTimer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 3500);
    return () => clearInterval(heroTimer);
  }, [heroImages.length]);

  return (
    <div className="w-full relative min-h-screen bg-[#FAFAFA]">
      {/* Hero Section */}
      <section className="relative w-full pt-20 pb-20 md:pt-28 md:pb-32 px-6 overflow-hidden bg-cover bg-center bg-no-repeat bg-[url('/home/Mobanner.png')]">
        {/* Floating 3D Images Background */}
        <FloatingImagesBackground />

        {/* Soft Gradient Overlay */}
        <div className="absolute top-0 right-0 w-full md:w-1/2 h-full bg-gradient-to-l from-eatpur-green-light/90 to-transparent pointer-events-none z-[1]" />

        {/* Content Container */}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
          {/* LEFT SIDE: Image Carousel */}
          <div className="flex-1 w-full flex justify-center md:justify-start lg:pr-12">
            <div className="relative w-full max-w-[340px] md:max-w-[500px] aspect-[3/4]">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 1.2 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {/* PURE IMAGE + SHADOW */}
                <div className="w-full h-full drop-shadow-[0_25px_40px_rgba(0,0,0,0.25)]">
                  {heroImages.length > 0 && (
                    <DistortedGallery images={heroImages} />
                  )}
                </div>
              </motion.div>
            </div>
          </div>

          {/* RIGHT SIDE: Texts and Buttons */}
          <motion.div
            className="flex-1 flex flex-col items-center md:items-start text-center md:text-left lg:pl-8"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 bg-eatpur-green-dark/10 text-eatpur-dark px-4 py-1.5 rounded-full text-sm font-medium mb-6 backdrop-blur-sm border border-eatpur-green-dark/20 shadow-sm">
              <FaLeaf className="text-eatpur-green-dark" />
              <span>Natural • No Maida • High Fiber</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-display text-eatpur-dark leading-tight mb-6 tracking-tight drop-shadow-sm">
              Millets... <br />
              Fuel Your Body
              <br />
              <span className="italic text-eatpur-green-dark">Naturally</span>
            </h1>

            <p className="text-eatpur-text text-lg md:text-xl mb-10 max-w-md font-display leading-relaxed drop-shadow-sm">
              Smart nutrition for modern life – ready in minutes. Pure,
              wholesome, and tradition-rich grains.
            </p>
            {/* <Link
                to="/products"
                className="btn-primary flex items-center gap-2 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                Shop Now
              </Link> */}
            <LeafButton>Explore Recipes</LeafButton>
          </motion.div>
        </div>
      </section>

      {/* Trusted & Certified */}
      <section className="bg-white py-16 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
          <h2 className="text-3xl md:text-5xl font-display font-semibold text-eatpur-dark mb-4 tracking-tight">
            Trusted & Certified
          </h2>
          <p className="text-eatpur-text font-serif italic text-lg md:text-xl opacity-90">
            Recognized and certified by leading organizations.
          </p>
        </div>

        <ThreeDScrollTriggerContainer className="w-full pt-8 pb-8 overflow-visible">
          {/* Base velocity controls speed. Direction 1 scrolls Right */}
          <ThreeDScrollTriggerRow baseVelocity={2} direction={1}>
            {/* FSSAI */}
            <div className="flex flex-col items-center min-w-[220px] mx-14 md:mx-20">
              <a
                href={FssaiLicense}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex flex-col items-center
                  min-w-[220px]
                  mx-14 md:mx-20
                  cursor-pointer
                  hover:-translate-y-2
                  transition-transform
                  duration-300
                "
              >
                <img
                  src={FssaiLogo}
                  alt="FSSAI"
                  className="h-24 w-auto object-contain drop-shadow-sm mix-blend-multiply"
                />

                <h3 className="mt-5 text-lg font-display font-semibold text-eatpur-dark text-center">
                  FSSAI Certified
                </h3>
              </a>
            </div>

            {/* Startup India */}
            <div className="flex flex-col items-center min-w-[220px] mx-14 md:mx-20">
              <a
                href={StartupMOU}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex flex-col items-center
                  min-w-[220px]
                  mx-14 md:mx-20
                  cursor-pointer
                  hover:-translate-y-2
                  transition-transform
                  duration-300
                "
              >
                <img
                  src={StartupIndiaLogo}
                  alt="Startup India"
                  className="h-24 w-auto object-contain drop-shadow-sm mix-blend-multiply"
                />

                <h3 className="mt-5 text-lg font-display font-semibold text-eatpur-dark text-center">
                  Recognised by
                  <br />
                  <span className="text-eatpur-green-dark">Startup India</span>
                </h3>
              </a>
            </div>

            {/* Nutrihub */}
            <div className="flex flex-col items-center min-w-[220px] mx-14 md:mx-20">
              <a
                href={NutriDoc}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex flex-col items-center
                  min-w-[220px]
                  mx-14 md:mx-20
                  cursor-pointer
                  hover:-translate-y-2
                  transition-transform
                  duration-300
                "
              >
                <img
                  src={NutrihubLogo}
                  alt="Nutrihub"
                  className="h-24 w-auto object-contain drop-shadow-sm mix-blend-multiply"
                />

                <h3 className="mt-5 text-lg font-display font-semibold text-eatpur-dark text-center">
                  Supported by
                  <br />
                  <span className="text-eatpur-green-dark">Nutrihub</span>
                </h3>
              </a>
            </div>

            {/* MSME */}
            <div className="flex flex-col items-center min-w-[220px] mx-14 md:mx-20">
              <a
                href={MSMECertificate}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex flex-col items-center
                  min-w-[220px]
                  mx-14 md:mx-20
                  cursor-pointer
                  hover:-translate-y-2
                  transition-transform
                  duration-300
                "
              >
                <img
                  src={MSMELogo}
                  alt="MSME"
                  className="h-24 w-auto object-contain drop-shadow-sm mix-blend-multiply"
                />

                <h3 className="mt-5 text-lg font-display font-semibold text-eatpur-dark text-center">
                  Recognised by
                  <br />
                  <span className="text-eatpur-green-dark">
                    MSME Division, GOI
                  </span>
                </h3>
              </a>
            </div>
          </ThreeDScrollTriggerRow>
        </ThreeDScrollTriggerContainer>
      </section>

      {/* Shop by Need Section */}
      {/* <section className="py-12 px-6 relative bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 flex flex-col items-center">
            <h2 className="text-3xl md:text-5xl font-display font-semibold text-eatpur-dark mb-4 tracking-tight">
              <img
                src="/icons/flourish-left.png"
                alt="~"
                className="h-6 opacity-60 hidden md:block"
                onError={(e) => (e.target.style.display = "none")}
              />
              🌿 Shop by Need 🌿
              <img
                src="/icons/flourish-right.png"
                alt="~"
                className="h-6 opacity-60 hidden md:block"
                onError={(e) => (e.target.style.display = "none")}
              />
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {[
              { title: "Kids Nutrition", icon: FaChild },
              { title: "Fitness & Weight Loss", icon: FaDumbbell },
              { title: "Daily Family Staples", icon: FaHouseUser },
              { title: "Quick Meals (2-5 min)", icon: FaBowlFood },
              { title: "Organic Living", icon: FaSeedling },
            ].map((cat, i) => (
              <Link
                to={`/products?need=${cat.title.toLowerCase().replace(/ & | /g, "-")}`}
                key={i}
                className="vintage-card w-40 h-44 md:w-48 md:h-52 flex flex-col items-center justify-center p-4 hover:-translate-y-2 transition-transform duration-300"
              >
                <cat.icon size={32} />
                {cat.title}
              </Link>
            ))}
          </div>
        </div>
      </section> */}
      <section className="py-16 md:py-24 px-6 relative bg-[#FAFAF7]">
        {/* Subtle radial luxury glow in background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-emerald-100/30 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 flex flex-col items-center">
            <h2 className="text-3xl md:text-5xl font-display font-semibold text-eatpur-dark mb-4 tracking-tight flex items-center justify-center gap-3">
              <img
                src="/icons/flourish-left.png"
                alt="~"
                className="h-6 opacity-60 hidden md:block"
                onError={(e) => (e.target.style.display = "none")}
              />
              🌿 Shop by Need 🌿
              <img
                src="/icons/flourish-right.png"
                alt="~"
                className="h-6 opacity-60 hidden md:block"
                onError={(e) => (e.target.style.display = "none")}
              />
            </h2>
          </div>

          {/* Responsive grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 justify-items-center">
            {[
              { title: "Kids Nutrition", icon: FaChild },
              { title: "Fitness & Weight Loss", icon: FaDumbbell },
              { title: "Daily Family Staples", icon: FaHouseUser },
              { title: "Quick Meals (2-5 min)", icon: FaBowlFood },
              { title: "Organic Living", icon: FaSeedling },
            ].map((cat, i) => (
              <Link
                to={`/products?need=${cat.title.toLowerCase().replace(/ & | /g, "-")}`}
                key={i}
                className="group w-full max-w-[210px] aspect-[4/5] bg-[#FCFDF9] rounded-3xl border border-emerald-700/20 shadow-[0_4px_24px_rgba(20,83,45,0.05)] hover:border-emerald-600 hover:ring-2 hover:ring-emerald-500/20 hover:shadow-[0_16px_36px_rgba(16,185,129,0.18)] flex flex-col items-center justify-center p-6 text-center transition-all duration-300 ease-out hover:-translate-y-2 relative overflow-hidden"
              >
                {/* Subtle warm green shimmer overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-100/35 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* Premium Icon Badge with Defined Green Ring */}
                <div className="w-14 h-14 rounded-2xl bg-[#F4F7F2] border border-emerald-700/25 flex items-center justify-center mb-5 group-hover:bg-emerald-600 group-hover:border-emerald-600 shadow-sm transition-all duration-300 text-eatpur-dark group-hover:text-white">
                  <cat.icon
                    size={22}
                    className="transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                {/* Typography */}
                <span className="text-sm md:text-base font-semibold text-eatpur-dark leading-snug tracking-tight group-hover:text-emerald-950 transition-colors duration-200">
                  {cat.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products (Live API Data) */}
      <section className="py-24 relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-semibold text-eatpur-dark mb-4 tracking-tight">
              Bestsellers
            </h2>
            <p className="text-eatpur-text font-serif italic text-lg md:text-xl opacity-90">
              Crafted from nature's finest grains.
            </p>
          </div>
        </div>

        {/* --- PREMIUM SCROLLING CAROUSEL START --- */}
        <div className="relative w-full max-w-[100vw] overflow-hidden group">
          <div className="absolute top-0 left-0 w-16 md:w-32 h-full z-10 pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-16 md:w-32 h-full z-10 pointer-events-none"></div>

          {isLoading ? (
            <div className="w-full py-20 text-center text-eatpur-text italic font-serif animate-pulse">
              Loading best sellers...
            </div>
          ) : trendingProducts.length > 0 ? (
            <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
              {/* Render the lists twice to create the infinite loop */}
              {[0, 1].map((loopIndex) => (
                <div
                  key={loopIndex}
                  className="flex gap-8 px-4"
                  aria-hidden={loopIndex === 1 ? "true" : "false"}
                >
                  {trendingProducts.map((product) => {
                    const fallbackImage = "/home/prod-carousel/MultiFlour.jpeg";
                    const productImages =
                      product.cover_image ||
                      product.media
                        ?.map((media) => media.image)
                        .filter(Boolean) ||
                      [];
                    const displayImg =
                      product.media?.[0]?.image ||
                      product.cover_image ||
                      fallbackImage;
                    const healthScore = 90; // Defaulting health score as it's not in the API currently
                    const catalogRating = Number(
                      productRatings[product.pid]?.average ??
                        product.average_rating ??
                        product.avg_rating ??
                        product.rating_average ??
                        product.rating ??
                        0,
                    );
                    const productRating = Number.isFinite(catalogRating)
                      ? Math.min(5, Math.max(0, catalogRating))
                      : 0;
                    const reviewCount =
                      productRatings[product.pid]?.count ??
                      product.review_count ??
                      product.total_reviews ??
                      product.ratings_count ??
                      0;
                    const isOutOfStock =
                      isDeployedServer && Number(product.quantity) === 0;

                    return (
                      <div
                        key={`${loopIndex}-${product.id}`}
                        onClick={() => {
                          if (isOutOfStock) return;
                          setActiveTab("nutrition");
                          setQuickViewReviews([]);
                          setReviewForm({ rating: 0, content: "", images: [] });
                          setQuickViewProduct({
                            ...product,
                            image: displayImg,
                            healthScore,
                          });
                        }}
                        className="vintage-card w-[280px] md:w-[320px] shrink-0 overflow-hidden flex flex-col group/card relative transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl bg-white cursor-pointer"
                      >
                        {isOutOfStock && (
                          <div className="absolute inset-0 z-40 flex items-center justify-center bg-white/35 pointer-events-none">
                            <span className="rounded-full bg-rose-700 px-4 py-2 text-sm font-bold uppercase tracking-widest text-white shadow-lg">
                              Out of Stock
                            </span>
                          </div>
                        )}

                        {Number(product.discount_percentage || 0) > 0 && (
                          <span className="absolute top-4 left-4 z-30 bg-rose-600 text-white font-sans text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md">
                            {product.discount_percentage}% OFF
                          </span>
                        )}

                        <div
                          className={`h-64 relative bg-[#FAFCFA] p-6 flex justify-center items-center overflow-hidden border-b border-eatpur-gray-light/50 ${isOutOfStock ? "blur-[1px] grayscale-[30%]" : ""}`}
                        >
                          <HomeProductImageCarousel
                            images={
                              productImages.length ? productImages : displayImg
                            }
                            alt={product.name}
                          />
                        </div>

                        <div className="p-5 flex flex-col flex-1 bg-white">
                          <div className="flex items-center justify-between mb-3 gap-2">
                            <span className="text-[10px] text-eatpur-green-dark font-bold uppercase tracking-wider bg-eatpur-green-light/20 px-2.5 py-1 rounded truncate">
                              {product.categoryName || product.category_name}
                            </span>
                            <span className="text-[11px] text-eatpur-text-light font-mono font-medium bg-slate-50 border border-slate-100 px-2 py-0.5 rounded whitespace-nowrap">
                              {product.size_name && `${product.size_name} `}
                              {product.weight &&
                                `(${product.weight}${product.unit || ""})`}
                            </span>
                          </div>
                          <h3 className="text-xl font-serif font-bold text-eatpur-dark mb-2 leading-tight min-h-[3rem] group-hover:text-eatpur-green-dark transition-colors">
                            {product.name}
                          </h3>

                          {/* Eatpur Health Score Meter */}
                          <div className="mt-2 mb-1 w-full bg-eatpur-yellow-light/30 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-eatpur-green-light to-eatpur-green-dark rounded-full"
                              style={{ width: `${healthScore}%` }}
                            />
                          </div>
                          <div className="text-[11px] text-eatpur-text flex justify-between mb-6">
                            <span className="font-semibold text-eatpur-green-dark">
                              Eatpur Health Score
                            </span>
                            <span className="font-bold">{healthScore}/100</span>
                          </div>

                          <div className="flex flex-col items-center justify-center gap-1 mb-4 min-h-12 text-center">
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider ${
                                productRating > 0
                                  ? "text-eatpur-green-dark"
                                  : "text-eatpur-text-light"
                              }`}
                            >
                              {productRating > 0 ? "Rate Us" : "No Rating Yet"}
                            </span>
                            <div
                              className="flex items-center justify-center gap-0.5"
                              aria-label={`${productRating.toFixed(1)} out of 5 stars`}
                            >
                              {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                  key={star}
                                  size={13}
                                  className={
                                    star <= Math.round(productRating)
                                      ? "text-amber-400"
                                      : "text-slate-200"
                                  }
                                />
                              ))}
                            </div>
                            {productRating > 0 && (
                              <span className="text-xs font-bold text-eatpur-dark">
                                {productRating.toFixed(1)}
                                {reviewCount > 0 && (
                                  <span className="font-normal text-eatpur-text-light">
                                    {` (${reviewCount})`}
                                  </span>
                                )}
                              </span>
                            )}
                          </div>

                          <div className="mt-auto flex items-end justify-between pt-4">
                            <div className="flex flex-col">
                              {Number(product.fixed_price) >
                              Number(product.discounted_price) ? (
                                <>
                                  <div className="flex items-start mb-0.5">
                                    <span className="relative text-sm font-sans text-eatpur-text-light font-medium">
                                      ₹{product.fixed_price}
                                      <span className="absolute top-1/2 left-[-10%] w-[120%] h-[1.5px] bg-rose-500/80 -rotate-[12deg]"></span>
                                    </span>
                                  </div>
                                  <span className="text-2xl font-bold text-eatpur-dark">
                                    ₹{product.discounted_price}
                                  </span>
                                </>
                              ) : (
                                <span className="text-2xl font-bold text-eatpur-dark">
                                  ₹{product.fixed_price}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full text-center text-eatpur-text italic font-serif">
              Check back soon for new arrivals!
            </div>
          )}
        </div>
        {/* --- PREMIUM SCROLLING CAROUSEL END --- */}

        <div className="mt-12 text-center">
          <Link to="/products" className="btn-ghost shadow-sm">
            View All Products
          </Link>
        </div>
      </section>

      {/* NEW SECTION: Verified User Reviews (Live API Data) */}
      <section className="py-5 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-5">
            <h2 className="text-3xl md:text-5xl font-display font-semibold text-eatpur-dark mb-4 tracking-tight">
              What Our Family Says
            </h2>
            <p className="text-eatpur-text font-serif italic text-lg md:text-xl opacity-90">
              Real feedback from the EatPur community.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center italic font-serif text-eatpur-text text-lg animate-pulse">
            Loading reviews...
          </div>
        ) : userReviews.length > 0 ? (
          <ThreeDScrollTriggerContainer className="w-full">
            {/* Base velocity controls speed. Direction -1 scrolls Left */}
            <ThreeDScrollTriggerRow baseVelocity={2.5} direction={-1}>
              {/* Inner wrapper to handle spacing and layout inside the scrolling row */}
              <div className="flex gap-6 md:gap-8 px-4 pr-6 md:pr-8 py-8 items-center">
                {userReviews.map((review, i) => (
                  <figure
                    key={review.id || i}
                    className="
                      relative
                      bg-white
                      rounded-lg
                      border-t-[5px]
                      border-[#E37A2C]
                      shadow-[0_6px_20px_rgba(0,0,0,0.08)]
                      text-[#555]
                      font-sans
                      shrink-0

                      w-[320px]
                      md:w-[340px]
                      h-[360px]

                      text-center
                      inline-block

                      transition-all
                      duration-300
                      ease-out
                      hover:-translate-y-2
                      hover:shadow-xl
                      cursor-pointer
                    "
                  >
                    <figcaption className="px-6 pt-14 pb-8 whitespace-normal">
                      {/* Quote Icon */}
                      <div className="absolute left-1/2 -top-[32px] -translate-x-1/2 bg-white rounded-full shadow-md text-[#E37A2C] w-[64px] h-[64px] flex items-center justify-center text-2xl">
                        <FaQuoteLeft />
                      </div>

                      {/* Review Text */}
                      <blockquote className="mb-6 text-eatpur-dark text-[16px] md:text-[17px] leading-relaxed font-medium">
                        <p className="opacity-90">
                          “{review.response_description}”
                        </p>
                      </blockquote>

                      {/* Name */}
                      <h3 className="text-eatpur-dark text-xl md:text-2xl font-display font-semibold leading-tight mb-1">
                        {review.name}
                      </h3>

                      {/* Subtitle */}
                      <h4 className="text-sm md:text-base font-medium tracking-wide text-eatpur-green-dark opacity-80">
                        Verified Customer
                      </h4>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </ThreeDScrollTriggerRow>
          </ThreeDScrollTriggerContainer>
        ) : (
          <div className="text-center italic font-serif text-eatpur-text text-lg">
            No reviews yet. Be the first to share your experience!
          </div>
        )}
      </section>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-eatpur-dark/40 backdrop-blur-sm"
            onClick={() => setQuickViewProduct(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto relative flex flex-col md:flex-row rounded-3xl shadow-2xl border border-eatpur-gray-light"
            >
              <button
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 right-4 z-10 text-eatpur-text hover:text-eatpur-dark p-2 bg-white/80 rounded-full"
              >
                <FaXmark size={20} />
              </button>

              <div className="md:w-1/2 p-2 bg-eatpur-green-dark flex items-center justify-center">
                <div className="w-full h-full min-h-[300px] md:min-h-[400px] rounded-2xl overflow-hidden bg-white shadow-sm border border-slate-100 flex items-center justify-center">
                  <img
                    src={quickViewProduct.image}
                    alt={quickViewProduct.name}
                    className="w-full max-h-[400px] object-contain mix-blend-multiply"
                  />
                </div>
              </div>
              <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-between bg-white relative">
                <div className="flex flex-wrap gap-2 mb-4">
                  {[
                    "nutrition",
                    "ingredients",
                    "instructions to cook",
                    "reviews",
                  ].map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`font-sans font-bold text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-lg transition-all ${
                        activeTab === tab
                          ? "bg-eatpur-green-dark text-white shadow-sm"
                          : "bg-slate-100 text-eatpur-text hover:bg-slate-200"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                  {quickViewProduct.is_trending && (
                    <span className="text-eatpur-gold-dark font-sans font-bold text-[10px] tracking-widest uppercase px-3 py-1.5 bg-eatpur-gold-light/20 rounded-lg self-center ml-auto">
                      Trending
                    </span>
                  )}
                </div>

                <h2 className="text-3xl md:text-4xl font-display text-eatpur-dark mb-2">
                  {quickViewProduct.name}
                </h2>
                <p className="text-xs font-mono text-eatpur-text-light mb-5">
                  PID: {quickViewProduct.pid}
                </p>
                <div className="flex items-baseline gap-4 mb-6 border-b border-eatpur-gray-light pb-6">
                  <span className="text-5xl font-bold text-eatpur-dark tracking-tight">
                    ₹
                    {quickViewProduct.discounted_price ||
                      quickViewProduct.fixed_price}
                  </span>
                  {Number(quickViewProduct.fixed_price) >
                    Number(quickViewProduct.discounted_price) && (
                    <div className="flex flex-col items-start">
                      <span className="relative text-xl font-sans text-eatpur-text-light font-medium">
                        ₹{quickViewProduct.fixed_price}
                        <span className="absolute top-1/2 left-[-5%] w-[110%] h-[2px] bg-rose-500/80 -rotate-[12deg]"></span>
                      </span>
                      <span className="text-rose-600 font-bold text-xs uppercase tracking-wider bg-rose-50 px-2 py-0.5 rounded mt-1">
                        Save {quickViewProduct.discount_percentage}%
                      </span>
                    </div>
                  )}
                </div>

                {activeTab === "nutrition" && (
                  <div className="mb-6">
                    <p className="text-eatpur-text font-sans leading-relaxed mb-6 text-sm md:text-base">
                      {quickViewProduct.description ||
                        "A pure, healthy product crafted for your wellbeing. Perfect for a balanced, modern lifestyle."}
                    </p>
                    <div className="flex md:grid grid-cols-4 gap-3 mb-6 overflow-x-auto md:overflow-visible pb-2 md:pb-0 hide-scrollbar snap-x snap-mandatory">
                      {[
                        ["Protein", "protein", "g"],
                        ["Carbs", "carbohydrates", "g"],
                        ["Fibre", "fibre", "g"],
                        ["Calories", "calories", ""],
                      ].map(([label, field, suffix]) => (
                        <div
                          key={field}
                          className="bg-[#FAFCFA] p-3 text-center rounded-xl border border-eatpur-gray-light shadow-sm min-w-[110px] md:min-w-0 shrink-0 snap-start"
                        >
                          <div className="text-[10px] font-bold text-eatpur-text-light uppercase tracking-wider mb-1 whitespace-nowrap">
                            {label}
                          </div>
                          <div className="font-mono text-base font-bold text-eatpur-dark whitespace-nowrap">
                            {quickViewProduct[field] || 0}
                            {suffix}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "ingredients" && (
                  <div className="mb-6 p-4 bg-[#FAFCFA] rounded-2xl border border-eatpur-gray-light text-sm text-eatpur-text leading-relaxed min-h-[140px]">
                    {quickViewProduct.ingredients ||
                      "100% natural ingredients without artificial additives or preservatives."}
                  </div>
                )}

                {activeTab === "instructions to cook" && (
                  <div className="mb-6 p-4 bg-[#FAFCFA] rounded-2xl border border-eatpur-gray-light text-sm text-eatpur-text leading-relaxed min-h-[140px]">
                    {quickViewProduct.instructions ||
                      quickViewProduct.how_to_use ||
                      quickViewProduct.cooking_instructions ||
                      "Store in a cool, dry place. Follow packet instructions for best results."}
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="mb-6 h-[280px] flex flex-col">
                    <div className="flex-1 overflow-y-auto pr-2 mb-4 space-y-3 hide-scrollbar">
                      {loadingQuickViewReviews ? (
                        <p className="text-sm italic text-eatpur-text-light text-center mt-4">
                          Loading reviews...
                        </p>
                      ) : quickViewReviews.length === 0 ? (
                        <p className="text-sm italic text-eatpur-text-light text-center mt-4">
                          No reviews yet. Be the first to review!
                        </p>
                      ) : (
                        quickViewReviews.map((review) => (
                          <div
                            key={
                              review.id || `${review.user}-${review.created_at}`
                            }
                            className="p-3 bg-slate-50 rounded-xl border border-slate-100 shadow-sm"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-bold text-sm text-eatpur-dark">
                                {review.username ||
                                  review.user_name ||
                                  review.user ||
                                  "Customer"}
                              </span>
                              <span className="text-xs font-bold text-eatpur-gold-dark flex items-center gap-1">
                                <FaStar /> {review.rating}/5
                              </span>
                            </div>
                            <p className="text-sm text-eatpur-text font-serif">
                              {review.content || review.comment}
                            </p>
                          </div>
                        ))
                      )}
                    </div>

                    <form
                      onSubmit={handleReviewSubmit}
                      className="bg-white p-3 rounded-xl border-2 border-eatpur-green-light/30 shadow-sm flex flex-col gap-2 shrink-0"
                    >
                      <div className="flex justify-between items-center px-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-eatpur-dark">
                          Write a Review
                        </span>
                        <div className="flex items-center gap-1">
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
                              className="focus:outline-none transition-transform hover:scale-125"
                              aria-label={`${star} star rating`}
                            >
                              <FaStar
                                size={16}
                                className={
                                  star <= reviewForm.rating
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-slate-300"
                                }
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <textarea
                        required
                        rows={2}
                        placeholder="Share your experience..."
                        value={reviewForm.content}
                        onChange={(event) =>
                          setReviewForm((previous) => ({
                            ...previous,
                            content: event.target.value,
                          }))
                        }
                        className="w-full text-sm p-2.5 rounded-lg border border-slate-200 bg-slate-50 outline-none focus:border-eatpur-green-dark resize-none font-serif"
                      />
                      <div className="flex justify-between items-center px-1">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(event) => {
                            const files = Array.from(event.target.files || []);
                            if (files.length <= 3)
                              setReviewForm((previous) => ({
                                ...previous,
                                images: files,
                              }));
                            else alert("Maximum 3 images allowed per review.");
                          }}
                          className="w-48 text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-eatpur-green-light/20 file:text-eatpur-green-dark"
                        />
                        <button
                          type="submit"
                          disabled={submittingReview}
                          className="bg-eatpur-green-dark text-white font-bold tracking-wider uppercase text-[10px] py-1.5 px-4 rounded-full disabled:opacity-50 hover:bg-eatpur-dark transition-colors"
                        >
                          {submittingReview ? "Posting..." : "Post Review"}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Health Score in Modal */}
                <div className="mb-8 p-4 border border-green-900/10 rounded-lg bg-green-50/50">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-eatpur-dark">
                      Eatpur Health Score
                    </span>
                    <span className="font-bold text-eatpur-green-dark">
                      {quickViewProduct.healthScore}/100
                    </span>
                  </div>
                  <div className="w-full bg-white rounded-full h-1.5 shadow-inner">
                    <div
                      className="h-full bg-eatpur-green-dark rounded-full"
                      style={{ width: `${quickViewProduct.healthScore}%` }}
                    ></div>
                  </div>
                </div>

                <div className="sticky bottom-0 z-20 mt-auto -mx-8 -mb-8 bg-white/95 px-8 pb-8 pt-4 backdrop-blur-sm md:-mx-10 md:-mb-10 md:px-10">
                  <CartButton
                    onClick={() => handleAddToCart(quickViewProduct)}
                    onAnimationComplete={() => {
                      setQuickViewProduct(null);
                      if (redirectToLoginAfterCartAnimation.current) {
                        redirectToLoginAfterCartAnimation.current = false;
                        navigate("/login", {
                          state: { returnTo: "/" },
                        });
                      }
                    }}
                    className="!h-[58px]"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Chatbot Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-eatpur-green-dark text-white p-4 rounded-full shadow-lg hover:-translate-y-1 transition-all group flex items-center justify-center border border-black/10"
        aria-label="Open Chat"
      >
        <FaCommentDots size={24} />
      </button>

      <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}
