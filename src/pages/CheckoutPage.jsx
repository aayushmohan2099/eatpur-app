// src/pages/CheckoutPage.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
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
import { addAddress, getAddresses } from "../api/userApi";
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
  const [serviceability, setServiceability] = useState(null);
  const [shippingEstimate, setShippingEstimate] = useState(null);
  const [isEstimating, setIsEstimating] = useState(false);
  const [dimensionsSignature, setDimensionsSignature] = useState("");
  const shippingEstimateRequestId = useRef(0);

  // --- COUPON STATES ---
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [availableCoupons, setAvailableCoupons] = useState([]); 
  const [couponError, setCouponError] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  
  // Address States
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [addressSaveMessage, setAddressSaveMessage] = useState("");
  const [isAddressSaveError, setIsAddressSaveError] = useState(false);
  const savedAddressSignature = useRef(null);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [isLoadingSavedAddresses, setIsLoadingSavedAddresses] = useState(false);
  const [showSavedAddresses, setShowSavedAddresses] = useState(false);

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

  const [cartDimensions, setCartDimensions] = useState({
    weight: 0,
    length: 0,
    height: 0,
    width: 0,
  });

  const subtotal = state.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const cartSignature = state.items
    .map((item) => `${item.id}:${item.quantity}`)
    .join("|");

  useEffect(() => {
    let isMounted = true;
    const loadSavedAddresses = async () => {
      setIsLoadingSavedAddresses(true);
      try {
        const response = await getAddresses();
        const addresses = Array.isArray(response)
          ? response
          : Array.isArray(response?.results)
            ? response.results
            : Array.isArray(response?.data?.results)
              ? response.data.results
              : Array.isArray(response?.data)
                ? response.data
                : [];

        if (isMounted) setSavedAddresses(addresses);
      } catch (error) {
        console.error("Failed to load saved addresses:", error);
      } finally {
        if (isMounted) setIsLoadingSavedAddresses(false);
      }
    };
    loadSavedAddresses();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (state.items.length === 0 && !isSuccess) {
      navigate("/products");
    }
  }, [state.items, navigate, isSuccess]);

  useEffect(() => {
    let isCurrentCart = true;
    const calculateAccurateDimensions = async () => {
      let tWeight = 0;
      let tLength = 0;
      let tHeight = 0;
      let tWidth = 0;

      for (const item of state.items) {
        try {
          const productDetail = await getProductById(item.id);
          const dim = productDetail.shipping_dimension || {
            weight: 500, length: 10, height: 10, width: 10,
          };
          tWeight += (Number(dim.weight) || 500) * item.quantity;
          tLength += Number(dim.length) || 10;
          tHeight += Number(dim.height) || 10;
          tWidth += Number(dim.width) || 10;
        } catch (err) {
          tWeight += 500 * item.quantity;
          tLength += 10; tHeight += 10; tWidth += 10;
        }
      }

      if (!isCurrentCart) return;
      setCartDimensions({ weight: tWeight, length: tLength, height: tHeight, width: tWidth });
      setDimensionsSignature(cartSignature);
    };

    if (state.items.length > 0) {
      calculateAccurateDimensions();
    } else {
      setCartDimensions({ weight: 0, length: 0, height: 0, width: 0 });
      setDimensionsSignature(cartSignature);
    }
    return () => {
      isCurrentCart = false;
    };
  }, [state.items, cartSignature]);

  // ==========================================
  // FETCH ONLY AUTO-APPLY COUPONS FOR THE LIST
  // ==========================================
  const fetchAvailableCoupons = useCallback(async () => {
    if (state.items.length === 0) return;

    try {
      const response = await getCouponList();
      const coupons = Array.isArray(response) ? response : response?.results || response?.data || [];
      const now = new Date();
      
      const eligibleCoupons = coupons.filter((item) => {
        const startDate = item.start_date ? new Date(item.start_date) : null;
        const endDate = item.end_date ? new Date(item.end_date) : null;
        const status = String(item.status || item.status_name || "").toUpperCase();
        const isAuto = item.is_auto_apply === true || String(item.is_auto_apply).toLowerCase() === "true";

        return (
          isAuto && 
          status === "ONGOING" &&
          (!startDate || startDate <= now) &&
          (!endDate || endDate >= now) &&
          subtotal >= Number(item.min_order_value || 0)
        );
      });

      setAvailableCoupons(eligibleCoupons);

      // Remove applied coupon if subtotal drops below its minimum requirement
      setAppliedCoupon((prevApplied) => {
        if (prevApplied) {
          const originalCoupon = coupons.find(c => String(c.coupon_code).toUpperCase() === prevApplied.code);
          if (originalCoupon && subtotal < Number(originalCoupon.min_order_value || 0)) {
            setCouponError(`Subtotal dropped below ₹${originalCoupon.min_order_value}. Coupon removed.`);
            return null;
          }
          return prevApplied;
        }
        return null;
      });

    } catch (error) {
      console.error("Coupon fetch failed", error);
    }
  }, [state.items.length, subtotal]);

  useEffect(() => {
    fetchAvailableCoupons();
  }, [subtotal, fetchAvailableCoupons]);


  // ==========================================
  // DIRECT LIST CLICK HANDLER
  // ==========================================
  const handleSelectAvailableCoupon = (couponDetails) => {
    setCouponError("");
    const couponType = String(couponDetails.coupon_type || couponDetails.discount_type || "FLAT").toUpperCase();
    
    setAppliedCoupon({
      code: couponDetails.coupon_code,
      type: couponType,
      value: parseFloat(couponDetails.discount_value || 0),
      source: "manual",
    });
    setCouponInput("");
  };

  const handleQuantityChange = (id, delta, currentQty) => {
    const newQty = currentQty + delta;
    if (newQty <= 0) {
      dispatch({ type: "REMOVE_ITEM", payload: { id } });
    } else {
      dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity: newQty } });
    }
    shippingEstimateRequestId.current += 1;
    setShippingEstimate(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryDetails((prev) => ({ ...prev, [name]: value }));
  };

  const selectSavedAddress = (address) => {
    const fullName = String(address.consignee_name || address.name || "").trim();
    const [firstName = "", ...lastNameParts] = fullName.split(/\s+/);
    const selectedPincode = String(address.pincode || address.drop_pincode || "").replace(/\D/g, "");
    const alreadyChecked = selectedPincode === pincode && serviceability !== null;

    setDeliveryDetails((prev) => ({
      ...prev,
      firstName,
      lastName: lastNameParts.join(" "),
      phone: String(address.consignee_phone || address.phone || ""),
      alt_phone: String(address.alternative_phone || address.alt_phone || ""),
      address_line: String(address.street_address || address.address_line || address.address || ""),
      city: String(address.city || ""),
      state: String(address.state || ""),
      saveAddress: false,
    }));
    setPincode(selectedPincode);
    setShowSavedAddresses(false);
    setAddressSaveMessage("");
    setIsAddressSaveError(false);

    if (!alreadyChecked) {
      setServiceability(null);
      setShippingEstimate(null);
      if (/^\d{6}$/.test(selectedPincode)) {
        handleCheckPincode(selectedPincode);
      }
    }
  };

  const getCheckoutAddress = () => ({
    title: "Checkout Address",
    consignee_name: [deliveryDetails.firstName, deliveryDetails.lastName].map((n) => n.trim()).filter(Boolean).join(" "),
    consignee_phone: deliveryDetails.phone.trim(),
    alternative_phone: deliveryDetails.alt_phone.trim(),
    street_address: deliveryDetails.address_line.trim(),
    city: deliveryDetails.city.trim(),
    state: deliveryDetails.state.trim(),
    pincode,
  });

  const handleSaveAddressChange = async (event) => {
    if (!event.target.checked) {
      setDeliveryDetails((prev) => ({ ...prev, saveAddress: false }));
      setAddressSaveMessage("");
      setIsAddressSaveError(false);
      return;
    }

    const address = getCheckoutAddress();
    const requiredFields = [address.consignee_name, address.consignee_phone, address.street_address, address.city, address.state, address.pincode];
    if (requiredFields.some((value) => !value)) {
      setAddressSaveMessage("Fill in the name, phone, address, city, state, and pincode first.");
      setIsAddressSaveError(true);
      return;
    }

    const signature = JSON.stringify(address);
    setIsSavingAddress(true);
    setAddressSaveMessage("Saving address...");
    setIsAddressSaveError(false);

    try {
      if (savedAddressSignature.current !== signature) {
        await addAddress(address);
        savedAddressSignature.current = signature;
      }
      setDeliveryDetails((prev) => ({ ...prev, saveAddress: true }));
      setAddressSaveMessage("Address saved to your account.");
    } catch (error) {
      setAddressSaveMessage(error.message || "Could not save this address.");
      setIsAddressSaveError(true);
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleCheckPincode = async (pincodeToCheck = pincode) => {
    const normalizedPincode = String(pincodeToCheck || "").replace(/\D/g, "");
    if (!/^\d{6}$/.test(normalizedPincode)) {
      alert("Please enter a valid 6-digit Pincode.");
      return;
    }
    setIsCheckingPincode(true);
    shippingEstimateRequestId.current += 1;
    setServiceability(null);
    setShippingEstimate(null);

    try {
      const res = await checkPincodeServiceability(normalizedPincode);
      if (res.is_serviceable || res.status === true) {
        setServiceability(true);
        if (res.details) {
          setDeliveryDetails((prev) => ({
            ...prev,
            city: res.details.city || prev.city,
            state: res.details.state || prev.state,
          }));
        }
      } else {
        setServiceability(false);
      }
    } catch (err) {
      alert("Failed to verify pincode. Please try again.");
    } finally {
      setIsCheckingPincode(false);
    }
  };

  const fetchShippingEstimate = useCallback(async (validPincode, dimensions, invoiceAmount) => {
    const requestId = ++shippingEstimateRequestId.current;
    setIsEstimating(true);
    try {
      const payload = {
        pickupPincode: 226022,
        dropPincode: parseInt(validPincode),
        invoiceAmount,
        weight: dimensions.weight || 500,
        length: dimensions.length || 10,
        height: dimensions.height || 10,
        width: dimensions.width || 10,
        serviceType: "SURFACE",
        codAmount: 0,
        shippingDirection: "FORWARD",
      };

      const res = await getShippingEstimate(payload);
      if (requestId !== shippingEstimateRequestId.current) return;

      if (res.success && res.pricing) {
        setShippingEstimate(res.pricing);
      } else {
        setShippingEstimate(null);
        alert("We couldn't calculate exact shipping charges for this location.");
      }
    } catch (err) {
      if (requestId !== shippingEstimateRequestId.current) return;
      setShippingEstimate(null);
      alert("Ekart API failed to return shipping estimates.");
    } finally {
      if (requestId === shippingEstimateRequestId.current) {
        setIsEstimating(false);
      }
    }
  }, []);

  useEffect(() => {
    if (serviceability !== true || !pincode || !cartSignature || dimensionsSignature !== cartSignature) {
      return;
    }
    fetchShippingEstimate(pincode, cartDimensions, subtotal);
  }, [serviceability, pincode, cartSignature, dimensionsSignature, cartDimensions, subtotal, fetchShippingEstimate]);

  // ==========================================
  // MANUAL COUPON HANDLER (TEXT INPUT)
  // ==========================================
  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setIsApplyingCoupon(true);
    setCouponError("");

    try {
      const code = couponInput.trim().toUpperCase();
      let couponDetails = null;

      try {
        const response = await getCouponList();
        const responseData = response?.data ?? response;
        const coupons = Array.isArray(responseData) ? responseData : responseData?.results || [];
        
        couponDetails = coupons.find((c) => c.coupon_code?.trim().toUpperCase() === code);
        if (!couponDetails) throw new Error("Invalid coupon code.");

        const endDate = couponDetails.end_date || couponDetails.expire_date;
        const startDate = couponDetails.start_date ? new Date(couponDetails.start_date) : null;
        const parsedEndDate = endDate ? new Date(endDate) : null;
        const now = new Date();
        const couponStatus = String(couponDetails.status || couponDetails.status_name || "").toUpperCase();
        
        const isExpired = couponStatus === "EXPIRED" || (parsedEndDate && !Number.isNaN(parsedEndDate.getTime()) && parsedEndDate < now);
        const isNotStartedYet = startDate && !Number.isNaN(startDate.getTime()) && startDate > now;

        if (isExpired) {
          setCouponError("This coupon has expired.");
          return;
        }
        if (isNotStartedYet) {
          setCouponError("This coupon is not active yet.");
          return;
        }

        if (subtotal < Number(couponDetails.min_order_value || 0)) {
          setCouponError(`Minimum order value for this coupon is ₹${couponDetails.min_order_value}`);
          return;
        }

      } catch (error) {
        if (error.message === "Invalid coupon code.") throw error;
      }

      const couponType = String(couponDetails.coupon_type || couponDetails.discount_type || "FLAT").toUpperCase();

      setAppliedCoupon({
        code: couponDetails.coupon_code,
        type: couponType,
        value: parseFloat(couponDetails.discount_value || 0),
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
    setAppliedCoupon(null);
    setCouponError("");
  };

  // ==========================================
  // FINAL TOTAL CALCULATIONS
  // ==========================================
  let discountAmount = 0;
  let isFreeShipping = false;

  if (appliedCoupon) {
    const cType = String(appliedCoupon.type).toUpperCase();
    
    if (cType === "PERCENT" || cType === "ONE_TIME" || cType === "PERCENTAGE") {
      discountAmount = (subtotal * appliedCoupon.value) / 100;
    } else if (cType === "FLAT") {
      discountAmount = appliedCoupon.value;
    } else if (cType === "FREE_SHIPPING") {
      isFreeShipping = true; 
      discountAmount = 0;
    }
    
    discountAmount = Math.min(discountAmount, subtotal);
  }

  const rawShippingCharge = shippingEstimate ? parseFloat(shippingEstimate.shipping_charge) : 0;
  const shippingCharge = isFreeShipping ? 0 : rawShippingCharge;
  
  const taxableAmount = subtotal - discountAmount;
  const finalTotal = taxableAmount + shippingCharge;

  const buildCheckoutPayload = () => {
    const payload = {
      items: state.items.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
      consignee_name: [deliveryDetails.firstName.trim(), deliveryDetails.lastName.trim()].filter(Boolean).join(" "),
      consignee_phone: deliveryDetails.phone,
      drop_location: deliveryDetails.address_line,
      drop_city: deliveryDetails.city,
      drop_state: deliveryDetails.state,
      drop_pincode: pincode,
      pickup_location_alias: "Primary Warehouse",
      service_type: "SURFACE",
      save_address: deliveryDetails.saveAddress && savedAddressSignature.current !== JSON.stringify(getCheckoutAddress()),
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
    if (deliveryDetails.phone.trim() && deliveryDetails.phone.trim() === deliveryDetails.alt_phone.trim()) {
      alert("Phone Number and Alternate Phone Number cannot be the same!");
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (state.items.length === 0) return;
    if (!validatePhoneNumbers()) return;
    if (!serviceability || !shippingEstimate) {
      alert("Please check serviceability to calculate shipping costs first.");
      return;
    }
    if (!deliveryDetails.firstName || !deliveryDetails.address_line || !deliveryDetails.city || !deliveryDetails.state) {
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

      const options = {
        key: orderData.key_id,
        amount: orderData.amount, 
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

  if (isSuccess) {
    return (
      <div className="w-full min-h-screen pt-24 pb-32 px-6 flex items-center justify-center relative z-10 bg-eatpur-white-warm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="vintage-card bg-white max-w-lg w-full p-12 rounded-2xl text-center flex flex-col items-center border border-black/5 shadow-sm"
        >
          <div className="w-24 h-24 bg-eatpur-green-light/20 rounded-full flex items-center justify-center mb-6 border border-eatpur-green-dark text-eatpur-green-dark shadow-inner">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
              <FaCheck size={48} />
            </motion.div>
          </div>
          <h2 className="text-3xl font-display text-eatpur-dark mb-4 tracking-wide">Order Successful!</h2>
          <p className="text-eatpur-text font-serif italic mb-8">Thank you! Your premium millet foods are being prepared for dispatch.</p>
          <Link to="/products" className="btn-primary font-medium tracking-wide">Continue Shopping</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen pt-24 pb-32 px-6 relative z-10 bg-eatpur-white-warm">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-display text-eatpur-dark mb-10 text-center leading-[1] py-2 tracking-tight">Secure Checkout</h1>
        <div className="vintage-card bg-white border border-black/5 p-8 md:p-12 rounded-2xl shadow-sm">
          
          {/* STEP 1: SERVICEABILITY CHECK */}
          <div className="mb-10 pb-10 border-b border-black/10">
            <h3 className="text-2xl font-display text-eatpur-dark mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-eatpur-green-dark text-white flex items-center justify-center text-sm">1</span>
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
                    shippingEstimateRequestId.current += 1;
                    setPincode(e.target.value.replace(/\D/g, ""));
                    setServiceability(null);
                    setShippingEstimate(null);
                  }}
                  className={`w-full bg-eatpur-white-warm border pl-11 pr-4 py-3 rounded-xl text-eatpur-dark focus:outline-none transition-colors shadow-inner font-mono text-lg tracking-widest ${
                    serviceability === true ? "border-eatpur-green-dark bg-green-50" : serviceability === false ? "border-red-400 bg-red-50" : "border-black/10 focus:border-eatpur-green-dark"
                  }`}
                />
              </div>
              <button
                type="button"
                onClick={() => handleCheckPincode()}
                disabled={isCheckingPincode || !/^\d{6}$/.test(pincode) || state.items.length === 0}
                className="btn-primary w-full sm:w-1/3 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {isCheckingPincode ? "Checking..." : "Check Availability"}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {serviceability === true && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 flex items-center gap-2 text-eatpur-green-dark font-medium bg-green-50 px-4 py-2.5 rounded-lg border border-green-200">
                  <FaCheck /> Great! We deliver to {pincode} via Ekart Logistics.
                </motion.div>
              )}
              {serviceability === false && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 text-red-600 font-medium bg-red-50 px-4 py-2.5 rounded-lg border border-red-200">
                  Sorry, we currently do not deliver to this pincode.
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* STEP 2: DELIVERY DETAILS & PAYMENT */}
          <form onSubmit={handlePlaceOrder} className="space-y-12 font-sans">
            <div className="space-y-6">
              <h3 className="text-2xl font-display text-eatpur-dark border-b border-black/10 pb-3 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-eatpur-green-dark text-white flex items-center justify-center text-sm shadow-sm">2</span>
                Shipping Address
              </h3>

              {showSavedAddresses && (
                <div className="rounded-xl border border-eatpur-green-dark/20 bg-white p-3 shadow-sm">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-eatpur-dark">Saved addresses</p>
                    <button type="button" onClick={() => setShowSavedAddresses(false)} className="text-xs font-medium text-eatpur-text-light hover:text-eatpur-dark">Close</button>
                  </div>
                  {isLoadingSavedAddresses ? (
                    <p className="px-2 py-3 text-sm text-eatpur-text-light">Loading addresses...</p>
                  ) : savedAddresses.length === 0 ? (
                    <p className="px-2 py-3 text-sm text-eatpur-text-light">No saved addresses yet.</p>
                  ) : (
                    <div className="max-h-72 space-y-2 overflow-y-auto">
                      {savedAddresses.map((address, index) => (
                        <button key={index} type="button" onClick={() => selectSavedAddress(address)} className="block w-full rounded-lg border border-black/5 px-3 py-3 text-left transition-colors hover:border-eatpur-green-dark/40 hover:bg-green-50">
                          <span className="block text-xs font-semibold uppercase text-eatpur-green-dark">{address.title || "Saved address"}</span>
                          <span className="mt-1 block text-sm font-semibold text-eatpur-dark">{address.consignee_name || address.name || "Name not provided"}</span>
                          <span className="mt-2 block text-sm leading-5 text-eatpur-text">{[address.street_address, address.city, address.state, address.pincode || address.drop_pincode].filter(Boolean).join(", ")}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Input Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-eatpur-dark text-sm mb-2 font-medium">First Name <span className="text-red-500">*</span></label>
                  <input required type="text" name="firstName" value={deliveryDetails.firstName} onChange={handleInputChange} onFocus={() => setShowSavedAddresses(true)} className="w-full bg-eatpur-white-warm border border-black/10 rounded-xl px-4 py-3 focus:outline-none focus:border-eatpur-green-dark" />
                </div>
                <div>
                  <label className="block text-eatpur-dark text-sm mb-2 font-medium">Last Name <span className="text-slate-400">(optional)</span></label>
                  <input type="text" name="lastName" value={deliveryDetails.lastName} onChange={handleInputChange} onFocus={() => setShowSavedAddresses(true)} className="w-full bg-eatpur-white-warm border border-black/10 rounded-xl px-4 py-3 focus:outline-none focus:border-eatpur-green-dark" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-eatpur-dark text-sm mb-2 font-medium">Address Line (House, Street, Area) <span className="text-red-500">*</span></label>
                  <input required type="text" name="address_line" value={deliveryDetails.address_line} onChange={handleInputChange} onFocus={() => setShowSavedAddresses(true)} className="w-full bg-eatpur-white-warm border border-black/10 rounded-xl px-4 py-3 focus:outline-none focus:border-eatpur-green-dark" />
                </div>
                <div>
                  <label className="block text-eatpur-dark text-sm mb-2 font-medium">City <span className="text-red-500">*</span></label>
                  <input required type="text" name="city" value={deliveryDetails.city} onChange={handleInputChange} onFocus={() => setShowSavedAddresses(true)} className="w-full bg-eatpur-white-warm border border-black/10 rounded-xl px-4 py-3 focus:outline-none focus:border-eatpur-green-dark" />
                </div>
                <div>
                  <label className="block text-eatpur-dark text-sm mb-2 font-medium">State <span className="text-red-500">*</span></label>
                  <input required type="text" name="state" value={deliveryDetails.state} onChange={handleInputChange} onFocus={() => setShowSavedAddresses(true)} className="w-full bg-eatpur-white-warm border border-black/10 rounded-xl px-4 py-3 focus:outline-none focus:border-eatpur-green-dark" />
                </div>
                <div>
                  <label className="block text-eatpur-dark text-sm mb-2 font-medium">Mobile Number <span className="text-red-500">*</span></label>
                  <input required type="tel" name="phone" maxLength={10} value={deliveryDetails.phone} onChange={(e) => setDeliveryDetails((p) => ({ ...p, phone: e.target.value.replace(/\D/g, "") }))} onFocus={() => setShowSavedAddresses(true)} className="w-full bg-eatpur-white-warm border border-black/10 rounded-xl px-4 py-3 focus:outline-none focus:border-eatpur-green-dark font-mono tracking-widest" />
                </div>
                <div>
                  <label className="block text-eatpur-dark text-sm mb-2 font-medium">Alternate Mobile <span className="text-red-500">*</span></label>
                  <input required type="tel" name="alt_phone" maxLength={10} value={deliveryDetails.alt_phone} onChange={(e) => setDeliveryDetails((p) => ({ ...p, alt_phone: e.target.value.replace(/\D/g, "") }))} onFocus={() => setShowSavedAddresses(true)} className="w-full bg-eatpur-white-warm border border-black/10 rounded-xl px-4 py-3 focus:outline-none focus:border-eatpur-green-dark font-mono tracking-widest" />
                </div>
                <div>
                  <label className="block text-eatpur-text-light text-sm mb-2 font-medium">Pincode</label>
                  <input type="text" value={pincode} readOnly className="w-full bg-gray-100 border border-black/5 rounded-xl px-4 py-3 text-eatpur-text-light cursor-not-allowed font-mono tracking-widest" />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <input type="checkbox" id="saveAddress" checked={deliveryDetails.saveAddress} onChange={handleSaveAddressChange} disabled={isSavingAddress} className="w-5 h-5 accent-eatpur-green-dark border-black/20 rounded cursor-pointer" />
                <label htmlFor="saveAddress" className="text-eatpur-dark font-medium cursor-pointer text-sm">Save this New Address</label>
              </div>
            </div>

            {/* Order Summary & Logistics Cost */}
            <div className="space-y-6 pt-6 border-t border-black/10">
              <h3 className="text-2xl font-display text-eatpur-dark border-b border-black/10 pb-3 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-eatpur-green-dark text-white flex items-center justify-center text-sm shadow-sm">3</span>
                Order Summary
              </h3>

              {/* Items */}
              <div className="space-y-4 max-h-[35vh] overflow-y-auto hide-scrollbar">
                {state.items.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-eatpur-white-warm p-4 rounded-xl border border-black/5 shadow-inner">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <img src={item.image || "/placeholder.png"} alt={item.name} className="w-16 h-16 rounded-lg object-cover mix-blend-multiply border border-black/5 bg-white p-1" />
                      <div>
                        <h4 className="text-eatpur-dark font-display font-medium text-lg">{item.name}</h4>
                        <p className="text-eatpur-green-dark font-semibold text-sm font-serif">₹{item.price} each</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                      <div className="flex items-center border border-black/10 rounded-lg bg-white overflow-hidden shadow-sm">
                        <button type="button" onClick={() => handleQuantityChange(item.id, -1, item.quantity)} className="px-3 py-1 text-eatpur-dark hover:bg-eatpur-white-warm font-bold">-</button>
                        <span className="px-4 py-1 text-sm font-bold text-eatpur-dark min-w-[2.5rem] text-center border-x border-black/5">{item.quantity}</span>
                        <button type="button" onClick={() => handleQuantityChange(item.id, 1, item.quantity)} className="px-3 py-1 text-eatpur-dark hover:bg-eatpur-white-warm font-bold">+</button>
                      </div>
                      <div className="text-eatpur-dark font-bold text-lg font-serif min-w-[4rem] text-right">₹{item.price * item.quantity}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* COUPON SECTION - ONLY SHOW IF PINCODE IS SERVICEABLE */}
              {serviceability === true && (
                <div className="bg-eatpur-white-warm border border-black/10 rounded-xl p-4 md:p-6 mt-4 shadow-sm">
                  <h4 className="text-eatpur-dark font-medium mb-3 flex items-center gap-2">
                    <FaTag className="text-eatpur-green-dark" /> Available Offers & Coupons
                  </h4>
                  
                  {/* Manual Input */}
                  {!appliedCoupon ? (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input type="text" placeholder="Enter Promo Code (e.g. FLAT50)" value={couponInput} onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(""); }} className="flex-1 bg-white border border-black/10 rounded-lg px-4 py-2.5 focus:outline-none focus:border-eatpur-green-dark uppercase" />
                      <button type="button" onClick={handleApplyCoupon} disabled={!couponInput.trim() || isApplyingCoupon} className="bg-eatpur-dark text-white px-6 py-2.5 rounded-lg hover:bg-black font-medium disabled:opacity-50">
                        {isApplyingCoupon ? "Applying..." : "Apply"}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FaCheck className="text-green-600" />
                        <span className="text-green-700 font-bold tracking-wider">{appliedCoupon.code}</span>
                        <span className="text-green-600 text-sm">Applied</span>
                      </div>
                      <button type="button" onClick={handleRemoveCoupon} className="text-red-500 hover:text-red-700 p-1" title="Remove Coupon"><FaXmark /></button>
                    </div>
                  )}
                  {couponError && <p className="mt-2 text-sm font-medium text-red-600">{couponError}</p>}

                  {/* Available Coupons List (ONLY AUTO APPLY COUPONS, BUT REQUIRED MANUAL CLICK TO APPLY) */}
                  {availableCoupons.length > 0 && (
                    <div className="mt-5 space-y-3 pt-3 border-t border-black/5">
                      <p className="text-sm font-semibold text-eatpur-dark">Select an offer from below:</p>
                      {availableCoupons.map((coupon) => (
                        <div key={coupon.id} className="flex items-center justify-between p-3 border border-eatpur-green-dark/20 bg-white rounded-lg shadow-sm">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="bg-green-50 border border-eatpur-green-dark/30 text-eatpur-green-dark font-bold px-2 py-1 rounded text-xs tracking-widest border-dashed uppercase">
                                {coupon.coupon_code}
                              </span>
                              <span className="text-sm font-bold text-eatpur-dark">
                                {String(coupon.coupon_type).toUpperCase() === "FREE_SHIPPING" ? "Free Delivery" : 
                                 String(coupon.coupon_type).toUpperCase() === "PERCENT" || String(coupon.coupon_type).toUpperCase() === "ONE_TIME" ? `${parseFloat(coupon.discount_value)}% OFF` : 
                                 `₹${parseFloat(coupon.discount_value)} OFF`}
                              </span>
                            </div>
                            {coupon.description && <p className="text-xs text-eatpur-text-light mt-1.5">{coupon.description}</p>}
                          </div>

                          {appliedCoupon?.code === coupon.coupon_code ? (
                            <span className="text-eatpur-green-dark font-bold text-sm flex items-center gap-1.5 px-3">
                              <FaCheck /> Applied
                            </span>
                          ) : (
                            <button 
                              type="button" 
                              onClick={() => handleSelectAvailableCoupon(coupon)}
                              className="text-white bg-eatpur-green-dark hover:bg-eatpur-dark transition-colors font-semibold text-xs px-4 py-2 rounded-lg"
                            >
                              Apply
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Pricing Breakdown */}
              <div className="bg-eatpur-white-warm rounded-xl p-6 border border-black/5 mt-6 shadow-inner">
                <div className="flex justify-between items-center text-eatpur-text mb-3 font-medium">
                  <span className="flex items-center gap-2"><FaBoxOpen /> Cart Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center text-eatpur-text mb-4 font-medium">
                  <span className="flex items-center gap-2">
                    {appliedCoupon && isFreeShipping ? (
                      <>
                        <FaTag className="text-eatpur-green-dark" />
                        Free Delivery Applied ({appliedCoupon.code})
                      </>
                    ) : (
                      <>
                        <FaTruckFast className="text-eatpur-green-dark" />
                        Shipping Estimate
                      </>
                    )}
                    {isEstimating && <span className="animate-pulse text-xs text-eatpur-gold-dark ml-2">(Calculating...)</span>}
                  </span>
                  <span>
                    {isEstimating ? (
                      <span className="w-12 h-4 bg-black/10 animate-pulse rounded block"></span>
                    ) : isFreeShipping ? (
                      <div className="flex items-center gap-2">
                        <span className="line-through text-slate-400 text-sm">₹{rawShippingCharge.toFixed(2)}</span>
                        <span className="text-green-600 font-bold">Free</span>
                      </div>
                    ) : (
                      `₹${shippingCharge.toFixed(2)}`
                    )}
                  </span>
                </div>

                {/* Show standard discount if it's NOT a free shipping coupon */}
                {appliedCoupon && !isFreeShipping && discountAmount > 0 && (
                  <div className="flex justify-between items-center text-green-700 mb-4 font-medium text-sm">
                    <span className="flex items-center gap-2">
                      <FaTag /> Coupon Applied ({appliedCoupon.code})
                    </span>
                    <span>- ₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-xl pt-4 border-t border-black/10">
                  <span className="text-eatpur-dark font-display font-bold">Total to Pay</span>
                  <span className="text-eatpur-green-dark font-bold font-serif text-3xl">
                    ₹{finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Submission */}
            <div className="pt-8 border-t border-black/10 flex flex-col items-center">
              <button
                type="submit"
                disabled={state.items.length === 0 || isProcessing || !serviceability || !shippingEstimate || isEstimating}
                className={`btn-primary w-full md:w-2/3 py-4 text-lg font-bold tracking-wider rounded-2xl flex justify-center items-center gap-3 shadow-lg transform transition-transform hover:-translate-y-1 ${
                  isProcessing || !serviceability || !shippingEstimate || isEstimating ? "opacity-75 cursor-wait hover:translate-y-0" : ""
                }`}
              >
                {isProcessing ? "Processing Secure Payment..." : "Pay Securely with Razorpay"}
              </button>
              <p className="text-xs text-eatpur-text-light font-sans mt-4 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span> Thankyou for shopping with Us!
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}