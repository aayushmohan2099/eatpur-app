// src/pages/CheckoutPage.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  FaCheck,
  FaLocationDot,
  FaBoxOpen,
  FaTruckFast,
  FaTag,
  FaXmark,
} from "react-icons/fa6";
import { useCart } from "../context/CartContext";
import { checkoutOrder, verifyPayment, getCouponList } from "../api/shop";
import { getProductById } from "../api/inventory";
import { useUserRole } from "../utils/useUserRole";
import {
  checkPincodeServiceability,
  getShippingEstimate,
} from "../api/logistics";

// Helper to dynamically load the Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CheckoutPage() {
  const { state, dispatch } = useCart();
  const navigate = useNavigate();
  const { isAdmin } = useUserRole();

  // Standard Checkout States
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Logistics & Pincode States
  const [pincode, setPincode] = useState("");
  const [isCheckingPincode, setIsCheckingPincode] = useState(false);
  const [serviceability, setServiceability] = useState(null); // null, true, or false
  const [shippingEstimate, setShippingEstimate] = useState(null);
  const [isEstimating, setIsEstimating] = useState(false);

  // --- COUPON STATES ---
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [autoCoupon, setAutoCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Delivery Form State
  const [deliveryDetails, setDeliveryDetails] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    alt_phone: "",
    address_line: "",
    city: "",
    state: "",
    saveAddress: false,
  });

  // Dynamic Aggregated Cart Dimensions State
  const [cartDimensions, setCartDimensions] = useState({
    weight: 0,
    length: 0,
    height: 0,
    width: 0,
  });

  // Calculate Base Subtotal
  const subtotal = state.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  // Redirect if cart is empty
  useEffect(() => {
    if (state.items.length === 0 && !isSuccess) {
      navigate("/products");
    }
  }, [state.items, navigate, isSuccess]);

  // Fetch actual Dimensions per product on cart load/change
  useEffect(() => {
    const calculateAccurateDimensions = async () => {
      let tWeight = 0;
      let tLength = 0;
      let tHeight = 0;
      let tWidth = 0;

      for (const item of state.items) {
        try {
          const productDetail = await getProductById(item.id);
          const dim = productDetail.shipping_dimension || {
            weight: 500,
            length: 10,
            height: 10,
            width: 10,
          };

          tWeight += (Number(dim.weight) || 500) * item.quantity;
          tLength += Number(dim.length) || 10;
          tHeight += Number(dim.height) || 10;
          tWidth += Number(dim.width) || 10;
        } catch (err) {
          console.error(`Failed to fetch dimensions for product ${item.id}`, err);
          tWeight += 500 * item.quantity;
          tLength += 10;
          tHeight += 10;
          tWidth += 10;
        }
      }

      setCartDimensions({
        weight: tWeight,
        length: tLength,
        height: tHeight,
        width: tWidth,
      });
    };

    if (state.items.length > 0) {
      calculateAccurateDimensions();
    }
  }, [state.items]);

  // Handle Cart Quantity Changes
  const handleQuantityChange = (id, delta, currentQty) => {
    const newQty = currentQty + delta;
    if (newQty <= 0) {
      dispatch({ type: "REMOVE_ITEM", payload: { id } });
    } else {
      dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity: newQty } });
    }
    setShippingEstimate(null);
    setServiceability(null);
  };

  // Handle Form Inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryDetails((prev) => ({ ...prev, [name]: value }));
  };

  // Check Pincode Serviceability
  const handleCheckPincode = async () => {
    if (!pincode || pincode.length !== 6) {
      alert("Please enter a valid 6-digit Pincode.");
      return;
    }
    setIsCheckingPincode(true);
    setServiceability(null);
    setShippingEstimate(null);

    try {
      const res = await checkPincodeServiceability(pincode);
      if (res.is_serviceable || res.status === true) {
        setServiceability(true);
        if (res.details) {
          setDeliveryDetails((prev) => ({
            ...prev,
            city: res.details.city || prev.city,
            state: res.details.state || prev.state,
          }));
        }
        await fetchShippingEstimate(pincode);
        await applyAutomaticCoupon();
      } else {
        setServiceability(false);
      }
    } catch (err) {
      console.error("Pincode check failed:", err);
      alert("Failed to verify pincode. Please try again.");
    } finally {
      setIsCheckingPincode(false);
    }
  };

  const applyAutomaticCoupon = async () => {
    if (!isAdmin || autoCoupon || state.items.length === 0) return;

    try {
      const response = await getCouponList();
      const coupons = Array.isArray(response)
        ? response
        : response?.results || response?.data || [];
      const now = new Date();
      const coupon = coupons.find((item) => {
        const startDate = item.start_date ? new Date(item.start_date) : null;
        const endDate = item.end_date ? new Date(item.end_date) : null;
        const discountType = item.discount_type?.toUpperCase();

        return (
          item.is_auto_apply &&
          ["FLAT", "FIXED"].includes(discountType) &&
          item.status?.toUpperCase() === "ONGOING" &&
          (!startDate || startDate <= now) &&
          (!endDate || endDate >= now) &&
          subtotal >= Number(item.min_order_value || 0)
        );
      });

      if (coupon) {
        const nextAutoCoupon = {
          code: coupon.coupon_code,
          type: "flat",
          value: Number(coupon.discount_value),
          source: "auto",
        };
        setAutoCoupon(nextAutoCoupon);
        setAppliedCoupon(nextAutoCoupon);
      }
    } catch {
      // Customer checkout does not have access to the admin coupon list.
    }
  };

  // Fetch Accurate Shipping Cost Estimates
  const fetchShippingEstimate = async (validPincode) => {
    setIsEstimating(true);
    try {
      const payload = {
        pickupPincode: 226022,
        dropPincode: parseInt(validPincode),
        invoiceAmount: subtotal, // Should calculate accurately
        weight: cartDimensions.weight || 500,
        length: cartDimensions.length || 10,
        height: cartDimensions.height || 10,
        width: cartDimensions.width || 10,
        serviceType: "SURFACE",
        codAmount: 0,
        shippingDirection: "FORWARD",
      };

      const res = await getShippingEstimate(payload);
      if (res.success && res.pricing) {
        setShippingEstimate(res.pricing);
      } else {
        setShippingEstimate(null);
        alert("We couldn't calculate exact shipping charges for this location.");
      }
    } catch (err) {
      console.error("Failed to fetch estimate:", err);
      setShippingEstimate(null);
      alert("Ekart API failed to return shipping estimates.");
    } finally {
      setIsEstimating(false);
    }
  };

  // --- COUPON HANDLERS ---
  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setIsApplyingCoupon(true);
    setCouponError("");

    try {
      const code = couponInput.trim().toUpperCase();
      let couponDetails = null;

      // Admin sessions can read coupon details, which lets us show the
      // discount immediately. Checkout still validates it on the server.
      if (isAdmin) {
        try {
          const response = await getCouponList();
          const coupons = Array.isArray(response)
            ? response
            : response?.results || response?.data || [];
          couponDetails = coupons.find(
            (coupon) => coupon.coupon_code?.toUpperCase() === code,
          );
        } catch {
          // Checkout still validates the coupon on the server.
        }
      }

      setAppliedCoupon({
        code,
        type:
          ["FLAT", "FIXED"].includes(
            couponDetails?.discount_type?.toUpperCase(),
          )
            ? "flat"
            : ["PERCENT", "PERCENTAGE"].includes(
                  couponDetails?.discount_type?.toUpperCase(),
                )
              ? "percentage"
              : null,
        value: Number(couponDetails?.discount_value || 0),
              source: "manual",
      });
      setCouponInput("");
    } catch (error) {
      setCouponError(error.message || "Error applying coupon. Try again.");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(
      autoCoupon && appliedCoupon?.source === "manual" ? autoCoupon : null,
    );
    setCouponError("");
  };

  // --- FINAL TOTAL CALCULATIONS ---
  // 1. Calculate Discount
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === "percentage") {
      discountAmount = (subtotal * appliedCoupon.value) / 100;
    } else if (appliedCoupon.type === "flat") {
      discountAmount = appliedCoupon.value;
    }
    // Discount can't be more than subtotal
    discountAmount = Math.min(discountAmount, subtotal);
  }

  // 2. Shipping Charge
  const shippingCharge = shippingEstimate
    ? parseFloat(shippingEstimate.shipping_charge)
    : 0;

  // 3. Final Total (Subtotal - Discount + Shipping)
  const finalTotal = subtotal - discountAmount + shippingCharge;

  // Build Checkout Payload
  const buildCheckoutPayload = () => {
    const payload = {
      items: state.items.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
      consignee_name: [
        deliveryDetails.firstName.trim(),
        deliveryDetails.lastName.trim(),
      ]
        .filter(Boolean)
        .join(" "),
      consignee_phone: deliveryDetails.phone,
      drop_location: deliveryDetails.address_line,
      drop_city: deliveryDetails.city,
      drop_state: deliveryDetails.state,
      drop_pincode: pincode,
      pickup_location_alias: "Primary Warehouse",
      service_type: "SURFACE",
      save_address: deliveryDetails.saveAddress,
      subtotal: Number(subtotal.toFixed(2)),
      discount_amount: Number(discountAmount.toFixed(2)),
      shipping_charge: Number(shippingCharge.toFixed(2)),
      total_amount: Number(finalTotal.toFixed(2)),
     
    };

    if (appliedCoupon?.code) {
      payload.coupon_code = appliedCoupon.code;
    }

    if (deliveryDetails.alt_phone.trim()) {
      payload.consignee_alternate_phone = deliveryDetails.alt_phone.trim();
    }

    return payload;
  };

  const validatePhoneNumbers = () => {
    if (
      deliveryDetails.phone.trim() &&
      deliveryDetails.phone.trim() === deliveryDetails.alt_phone.trim()
    ) {
      alert("Phone Number and Alternate Phone Number cannot be the same!");
      return false;
    }

    return true;
  };

  // Simulate Payment
  const handleTestPayment = async () => {
    if (state.items.length === 0) return;
    if (!validatePhoneNumbers()) return;
    if (!serviceability || !shippingEstimate) {
      alert("Please check serviceability to calculate shipping costs first.");
      return;
    }
    if (
      !deliveryDetails.firstName ||
      !deliveryDetails.address_line ||
      !deliveryDetails.city ||
      !deliveryDetails.state
    ) {
      alert("Please fill out all required shipping address fields.");
      return;
    }

    setIsProcessing(true);
    try {
      const payload = buildCheckoutPayload();
      const orderData = await checkoutOrder(payload);

      const fakeRazorpayResponse = {
        razorpay_payment_id: `pay_TEST_${Date.now()}`,
        razorpay_order_id: orderData.razorpay_order_id,
        razorpay_signature: `test_signature_${Date.now()}`,
      };

      await verifyPayment({ ...fakeRazorpayResponse });
      setIsSuccess(true);
      dispatch({ type: "CLEAR_CART" });
    } catch (err) {
      alert(err.message || "Test payment failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Real Place Order
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (state.items.length === 0) return;
    if (!validatePhoneNumbers()) return;
    if (!serviceability || !shippingEstimate) {
      alert("Please check serviceability to calculate shipping costs first.");
      return;
    }

    if (
      !deliveryDetails.firstName ||
      !deliveryDetails.address_line ||
      !deliveryDetails.city ||
      !deliveryDetails.state
    ) {
      alert("Please fill out all required shipping address fields.");
      return;
    }

    setIsProcessing(true);
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      setIsProcessing(false);
      return;
    }

    try {
      const payload = buildCheckoutPayload();
      const orderData = await checkoutOrder(payload);

      const expectedAmount = Math.round(finalTotal * 100);
      if (Number(orderData.amount) !== expectedAmount) {
        throw new Error(
          `Checkout amount mismatch: expected ₹${finalTotal.toFixed(2)}, received ₹${(Number(orderData.amount)).toFixed(2)}.`,
        );
      }

      const options = {
        key: orderData.key_id,
        amount: orderData.amount, // in paise
        currency: orderData.currency,
        name: "EatPur Naturals",
        description: "Premium Millet Foods",
        image: "/logo.png",
        order_id: orderData.razorpay_order_id,
        prefill: {
          name: payload.consignee_name,
          email: orderData.customer?.email || "",
          contact: payload.consignee_alternate_phone,
        },
        theme: { color: "#6B8E23" },
        handler: async function (response) {
          try {
            await verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });
            setIsSuccess(true);
            dispatch({ type: "CLEAR_CART" });
          } catch (verifyError) {
            alert(verifyError.message || "Payment verification failed.");
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        alert(`Payment Failed: ${response.error.description}`);
      });
      rzp.open();
    } catch (err) {
      alert(err.message || "Failed to initialize checkout.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Success Screen
  if (isSuccess) {
    return (
      <div className="w-full min-h-screen pt-24 pb-32 px-6 flex items-center justify-center relative z-10 bg-eatpur-white-warm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="vintage-card bg-white max-w-lg w-full p-12 rounded-2xl text-center flex flex-col items-center border border-black/5 shadow-sm"
        >
          <div className="w-24 h-24 bg-eatpur-green-light/20 rounded-full flex items-center justify-center mb-6 border border-eatpur-green-dark text-eatpur-green-dark shadow-inner">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
            >
              <FaCheck size={48} />
            </motion.div>
          </div>
          <h2 className="text-3xl font-display text-eatpur-dark mb-4 tracking-wide">
            Order Successful!
          </h2>
          <p className="text-eatpur-text font-serif italic mb-8">
            Thank you! Your premium millet foods are being prepared for dispatch.
          </p>
          <Link to="/products" className="btn-primary font-medium tracking-wide">
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen pt-24 pb-32 px-6 relative z-10 bg-eatpur-white-warm">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-display text-eatpur-dark mb-10 text-center leading-[1] py-2 tracking-tight">
          Secure Checkout
        </h1>

        <div className="vintage-card bg-white border border-black/5 p-8 md:p-12 rounded-2xl shadow-sm">
          
          {/* STEP 1: SERVICEABILITY CHECK */}
          <div className="mb-10 pb-10 border-b border-black/10">
            <h3 className="text-2xl font-display text-eatpur-dark mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-eatpur-green-dark text-white flex items-center justify-center text-sm">
                1
              </span>
              Delivery Location
            </h3>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="relative w-full sm:w-2/3">
                <FaLocationDot className="absolute left-4 top-1/2 -translate-y-1/2 text-eatpur-text-light" />
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit Pincode"
                  value={pincode}
                  onChange={(e) => {
                    setPincode(e.target.value.replace(/\D/g, ""));
                    setServiceability(null);
                    setShippingEstimate(null);
                  }}
                  className={`w-full bg-eatpur-white-warm border pl-11 pr-4 py-3 rounded-xl text-eatpur-dark focus:outline-none transition-colors shadow-inner font-mono text-lg tracking-widest ${
                    serviceability === true && shippingEstimate
                      ? "border-eatpur-green-dark bg-green-50"
                      : serviceability === false ||
                          (serviceability === true && !shippingEstimate)
                        ? "border-red-400 bg-red-50"
                        : "border-black/10 focus:border-eatpur-green-dark"
                  }`}
                />
              </div>

              <button
                type="button"
                onClick={handleCheckPincode}
                disabled={
                  isCheckingPincode ||
                  pincode.length !== 6 ||
                  state.items.length === 0
                }
                className="btn-primary w-full sm:w-1/3 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {isCheckingPincode ? "Checking..." : "Check Availability"}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {serviceability === true && shippingEstimate && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 flex items-center gap-2 text-eatpur-green-dark font-medium bg-green-50 px-4 py-2.5 rounded-lg border border-green-200"
                >
                  <FaCheck /> Great! We deliver to {pincode} via Ekart Logistics.
                </motion.div>
              )}
              {serviceability === false && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 text-red-600 font-medium bg-red-50 px-4 py-2.5 rounded-lg border border-red-200"
                >
                  Sorry, we currently do not deliver to this pincode.
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* STEP 2: DELIVERY DETAILS & PAYMENT */}
          <form
            onSubmit={handlePlaceOrder}
            className={`space-y-12 font-sans transition-opacity duration-300 ${
              !serviceability || !shippingEstimate
                ? "opacity-40 pointer-events-none select-none grayscale-[50%]"
                : "opacity-100"
            }`}
          >
            {/* Delivery Details Fields */}
            <div className="space-y-6">
              <h3 className="text-2xl font-display text-eatpur-dark border-b border-black/10 pb-3 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-eatpur-green-dark text-white flex items-center justify-center text-sm shadow-sm">
                  2
                </span>
                Shipping Address
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-eatpur-dark text-sm mb-2 font-medium">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    name="firstName"
                    value={deliveryDetails.firstName}
                    onChange={handleInputChange}
                    className="w-full bg-eatpur-white-warm border border-black/10 rounded-xl px-4 py-3 text-eatpur-dark focus:outline-none focus:border-eatpur-green-dark transition-colors shadow-inner font-serif"
                  />
                </div>
                <div>
                  <label className="block text-eatpur-dark text-sm mb-2 font-medium">
                    Last Name <span className="text-slate-400">(optional)</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={deliveryDetails.lastName}
                    onChange={handleInputChange}
                    className="w-full bg-eatpur-white-warm border border-black/10 rounded-xl px-4 py-3 text-eatpur-dark focus:outline-none focus:border-eatpur-green-dark transition-colors shadow-inner font-serif"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-eatpur-dark text-sm mb-2 font-medium">
                    Address Line (House, Street, Area) <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    name="address_line"
                    value={deliveryDetails.address_line}
                    onChange={handleInputChange}
                    placeholder="House/Flat No., Building, Street, Area"
                    className="w-full bg-eatpur-white-warm border border-black/10 rounded-xl px-4 py-3 text-eatpur-dark focus:outline-none focus:border-eatpur-green-dark transition-colors shadow-inner font-serif"
                  />
                </div>
                <div>
                  <label className="block text-eatpur-dark text-sm mb-2 font-medium">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    name="city"
                    value={deliveryDetails.city}
                    onChange={handleInputChange}
                    className="w-full bg-eatpur-white-warm border border-black/10 rounded-xl px-4 py-3 text-eatpur-dark focus:outline-none focus:border-eatpur-green-dark transition-colors shadow-inner font-serif"
                  />
                </div>
                <div>
                  <label className="block text-eatpur-dark text-sm mb-2 font-medium">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    name="state"
                    value={deliveryDetails.state}
                    onChange={handleInputChange}
                    className="w-full bg-eatpur-white-warm border border-black/10 rounded-xl px-4 py-3 text-eatpur-dark focus:outline-none focus:border-eatpur-green-dark transition-colors shadow-inner font-serif"
                  />
                </div>
                <div>
                  <label className="block text-eatpur-dark text-sm mb-2 font-medium">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="tel"
                    name="phone"
                    maxLength={10}
                    value={deliveryDetails.phone}
                    onChange={(e) =>
                      setDeliveryDetails((prev) => ({
                        ...prev,
                        phone: e.target.value.replace(/\D/g, ""),
                      }))
                    }
                    placeholder="10-digit number"
                    className="w-full bg-eatpur-white-warm border border-black/10 rounded-xl px-4 py-3 text-eatpur-dark focus:outline-none focus:border-eatpur-green-dark transition-colors shadow-inner font-mono tracking-widest"
                  />
                </div>
                <div>
                  <label className="block text-eatpur-dark text-sm mb-2 font-medium">
                    Alternate Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="tel"
                    name="alt_phone"
                    maxLength={10}
                    value={deliveryDetails.alt_phone}
                    onChange={(e) =>
                      setDeliveryDetails((prev) => ({
                        ...prev,
                        alt_phone: e.target.value.replace(/\D/g, ""),
                      }))
                    }
                    placeholder="10-digit number"
                    className="w-full bg-eatpur-white-warm border border-black/10 rounded-xl px-4 py-3 text-eatpur-dark focus:outline-none focus:border-eatpur-green-dark transition-colors shadow-inner font-mono tracking-widest"
                  />
                </div>
                <div>
                  <label className="block text-eatpur-text-light text-sm mb-2 font-medium">
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={pincode}
                    readOnly
                    className="w-full bg-gray-100 border border-black/5 rounded-xl px-4 py-3 text-eatpur-text-light cursor-not-allowed font-mono tracking-widest"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <input
                  type="checkbox"
                  id="saveAddress"
                  name="saveAddress"
                  checked={deliveryDetails.saveAddress}
                  onChange={(e) =>
                    setDeliveryDetails((prev) => ({
                      ...prev,
                      saveAddress: e.target.checked,
                    }))
                  }
                  className="w-5 h-5 accent-eatpur-green-dark border-black/20 rounded cursor-pointer"
                />
                <label
                  htmlFor="saveAddress"
                  className="text-eatpur-dark font-medium cursor-pointer select-none text-sm"
                >
                  Save this New Address
                </label>
              </div>
            </div>

            {/* Order Summary & Logistics Cost */}
            <div className="space-y-6 pt-6 border-t border-black/10">
              <h3 className="text-2xl font-display text-eatpur-dark border-b border-black/10 pb-3 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-eatpur-green-dark text-white flex items-center justify-center text-sm shadow-sm">
                  3
                </span>
                Order Summary
              </h3>

              {/* Items List */}
              <div className="space-y-4 max-h-[35vh] overflow-y-auto hide-scrollbar">
                {state.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-eatpur-white-warm p-4 rounded-xl border border-black/5 shadow-inner"
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <img
                        src={item.image || "/placeholder.png"}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover mix-blend-multiply border border-black/5 bg-white p-1"
                      />
                      <div>
                        <h4 className="text-eatpur-dark font-display font-medium text-lg">
                          {item.name}
                        </h4>
                        <p className="text-eatpur-green-dark font-semibold text-sm font-serif">
                          ₹{item.price} each
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                      <div className="flex items-center border border-black/10 rounded-lg bg-white overflow-hidden shadow-sm">
                        <button
                          type="button"
                          onClick={() =>
                            handleQuantityChange(item.id, -1, item.quantity)
                          }
                          className="px-3 py-1 text-eatpur-dark hover:bg-eatpur-white-warm transition-colors font-bold"
                        >
                          -
                        </button>
                        <span className="px-4 py-1 text-sm font-bold text-eatpur-dark min-w-[2.5rem] text-center border-x border-black/5">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleQuantityChange(item.id, 1, item.quantity)
                          }
                          className="px-3 py-1 text-eatpur-dark hover:bg-eatpur-white-warm transition-colors font-bold"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-eatpur-dark font-bold text-lg font-serif min-w-[4rem] text-right">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* COUPON SECTION */}
              <div className="bg-eatpur-white-warm border border-black/10 rounded-xl p-4 md:p-6 mt-4 shadow-sm">
                <h4 className="text-eatpur-dark font-medium mb-3 flex items-center gap-2">
                  <FaTag className="text-eatpur-green-dark" /> Have a Coupon Code?
                </h4>
                
                {!appliedCoupon || appliedCoupon.source === "auto" ? (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      placeholder="Enter Promo Code (e.g. WELCOME10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="flex-1 bg-white border border-black/10 rounded-lg px-4 py-2.5 text-eatpur-dark focus:outline-none focus:border-eatpur-green-dark uppercase"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={!couponInput.trim() || isApplyingCoupon}
                      className="bg-eatpur-dark text-white px-6 py-2.5 rounded-lg hover:bg-black transition-colors font-medium disabled:opacity-50"
                    >
                      {isApplyingCoupon ? "Applying..." : "Apply"}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FaCheck className="text-green-600" />
                      <span className="text-green-700 font-bold tracking-wider">
                        {appliedCoupon.code}
                      </span>
                      <span className="text-green-600 text-sm">applied</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-red-500 hover:text-red-700 p-1 transition-colors"
                      title="Remove Coupon"
                    >
                        <FaXmark />
                    </button>
                  </div>
                )}
                {couponError && (
                  <p className="text-red-500 text-sm mt-2">{couponError}</p>
                )}
              </div>

              {/* Pricing Breakdown */}
              <div className="bg-eatpur-white-warm rounded-xl p-6 border border-black/5 mt-6 shadow-inner">
                <div className="flex justify-between items-center text-eatpur-text mb-3 font-medium">
                  <span className="flex items-center gap-2">
                    <FaBoxOpen /> Cart Subtotal
                  </span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center text-eatpur-text mb-4 font-medium">
                  <span className="flex items-center gap-2">
                    <FaTruckFast className="text-eatpur-green-dark" />
                    Shipping Estimate
                    {isEstimating && (
                      <span className="animate-pulse text-xs text-eatpur-gold-dark ml-2">
                        (Calculating...)
                      </span>
                    )}
                  </span>
                  <span>
                    {isEstimating ? (
                      <span className="w-12 h-4 bg-black/10 animate-pulse rounded block"></span>
                    ) : (
                      `₹${shippingCharge.toFixed(2)}`
                    )}
                  </span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between items-center text-green-700 mb-4 font-medium text-sm">
                    <span className="flex items-center gap-2">
                      <FaTag /> Coupon Applied 
                    </span>
                    <span>
                      {discountAmount > 0
                        ? `- ₹${discountAmount.toFixed(2)}`
                        : "Calculated at checkout"}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center text-xl pt-4 border-t border-black/10">
                  <span className="text-eatpur-dark font-display font-bold">
                    Total to Pay
                  </span>
                  <span className="text-eatpur-green-dark font-bold font-serif text-3xl">
                    ₹{finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Submission */}
            <div className="pt-8 border-t border-black/10 flex flex-col items-center">
              <button
                type="button"
                onClick={handleTestPayment}
                disabled={
                  state.items.length === 0 ||
                  !serviceability ||
                  !shippingEstimate ||
                  isEstimating ||
                  isProcessing
                }
                className="w-full md:w-2/3 mb-4 py-3 text-sm font-bold tracking-wider rounded-2xl flex justify-center items-center gap-2 border-2 border-dashed border-eatpur-green-dark text-eatpur-green-dark bg-green-50 hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🧪 Simulate Razorpay Payment
              </button>

              <button
                type="submit"
                disabled={
                  state.items.length === 0 ||
                  isProcessing ||
                  !serviceability ||
                  !shippingEstimate ||
                  isEstimating
                }
                className={`btn-primary w-full md:w-2/3 py-4 text-lg font-bold tracking-wider rounded-2xl flex justify-center items-center gap-3 shadow-lg transform transition-transform hover:-translate-y-1 ${
                  isProcessing ||
                  !serviceability ||
                  !shippingEstimate ||
                  isEstimating
                    ? "opacity-75 cursor-wait hover:translate-y-0"
                    : ""
                }`}
              >
                {isProcessing ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
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
                    Processing Secure Payment...
                  </>
                ) : (
                  "Pay Securely with Razorpay"
                )}
              </button>
              <p className="text-xs text-eatpur-text-light font-sans mt-4 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>{" "}
                Thankyou for shopping with Us!
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}