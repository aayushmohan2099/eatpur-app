// src/pages/CheckoutPage.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaCheck } from "react-icons/fa6";
import { useCart } from "../context/CartContext";
import { checkoutOrder, verifyPayment } from "../api/shop";

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
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = state.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const handleQuantityChange = (id, delta, currentQty) => {
    const newQty = currentQty + delta;
    if (newQty <= 0) {
      dispatch({ type: "REMOVE_ITEM", payload: { id } });
    } else {
      dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity: newQty } });
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (state.items.length === 0) return;

    setIsProcessing(true);

    // 1. Load Razorpay Script Dynamically
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      setIsProcessing(false);
      return;
    }

    // 2. Build the exact payload Django expects
    const payload = {
      items: state.items.map((item) => ({
        product_id: item.id, // Ensure your CartContext uses the real DB 'id'
        quantity: item.quantity,
      })),
      // coupon_code: "" // Add this later if you implement front-end coupon input
    };

    try {
      // 3. Call our Django Phase 2 Checkout API
      const orderData = await checkoutOrder(payload);

      // 4. Initialize Razorpay Options
      const options = {
        key: orderData.key_id,
        amount: orderData.amount, // In paise
        currency: orderData.currency,
        name: "EatPur",
        description: "Premium Millet Foods",
        image: "/logo.png", // Add actual logo path if you have one
        order_id: orderData.razorpay_order_id,
        prefill: {
          name: orderData.customer.name,
          email: orderData.customer.email,
          contact: orderData.customer.contact,
        },
        theme: {
          color: "#6B8E23", // EatPur Green Dark
        },
        // 5. The Handler - Fires EXACTLY when payment succeeds
        handler: async function (response) {
          try {
            // PHASE 4 Call: Verify the signature on Django server
            await verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });

            // If verification passes, show success!
            setIsSuccess(true);
            dispatch({ type: "CLEAR_CART" });
          } catch (verifyError) {
            alert(
              verifyError.message ||
                "Payment verification failed. Please contact support.",
            );
          }
        },
      };

      // 6. Open the Razorpay Modal
      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        alert(`Payment Failed: ${response.error.description}`);
      });

      rzp.open();
    } catch (err) {
      console.error(err);
      alert(
        err.message ||
          "Failed to initialize checkout. Please check stock or login status.",
      );
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
            Thank you! Your premium millet foods will arrive soon.
          </p>
          <Link
            to="/products"
            className="btn-primary font-medium tracking-wide"
          >
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
          Checkout
        </h1>

        {/* Static Header Steps Indicator */}
        <div className="flex justify-between items-center mb-12 relative px-4 text-xs font-sans font-bold uppercase tracking-widest text-eatpur-text-light">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-eatpur-green-dark -z-10 -translate-y-1/2" />

          {["Delivery Details", "Order Summary", "Payment"].map((label, i) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center border bg-eatpur-green-dark border-eatpur-green-dark text-white font-medium shadow-sm">
                {i + 1}
              </div>
              <span className="text-eatpur-green-dark font-semibold">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Single Combined Form Container */}
        <div className="vintage-card bg-white border border-black/5 p-8 md:p-12 rounded-2xl shadow-sm">
          <form onSubmit={handlePlaceOrder} className="space-y-12 font-sans">
            {/* SECTION 1: Delivery Details */}
            <div className="space-y-6">
              <h3 className="text-2xl font-display text-eatpur-dark border-b border-black/10 pb-3">
                Delivery Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-eatpur-dark text-sm mb-2 font-medium">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full bg-eatpur-white-warm border border-black/10 rounded-xl px-4 py-3 text-eatpur-dark focus:outline-none focus:border-eatpur-green-dark transition-colors shadow-inner font-serif"
                  />
                </div>
                <div>
                  <label className="block text-eatpur-dark text-sm mb-2 font-medium">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full bg-eatpur-white-warm border border-black/10 rounded-xl px-4 py-3 text-eatpur-dark focus:outline-none focus:border-eatpur-green-dark transition-colors shadow-inner font-serif"
                  />
                </div>
              </div>
              <div>
                <label className="block text-eatpur-dark text-sm mb-2 font-medium">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  className="w-full bg-eatpur-white-warm border border-black/10 rounded-xl px-4 py-3 text-eatpur-dark focus:outline-none focus:border-eatpur-green-dark transition-colors shadow-inner font-serif"
                />
              </div>
            </div>

            {/* SECTION 2: Order Summary */}
            <div className="space-y-6 pt-6 border-t border-black/10">
              <h3 className="text-2xl font-display text-eatpur-dark border-b border-black/10 pb-3">
                Order Summary
              </h3>
              <div className="space-y-4 max-h-[40vh] overflow-y-auto hide-scrollbar">
                {state.items.length === 0 ? (
                  <p className="text-eatpur-text text-center py-4 font-serif italic text-lg">
                    Your cart is empty.
                  </p>
                ) : (
                  state.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-eatpur-white-warm p-4 rounded-xl border border-black/5 shadow-inner"
                    >
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <img
                          src={item.image || "/placeholder.png"}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover mix-blend-multiply border border-black/5"
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
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-black/10 rounded-lg bg-white overflow-hidden shadow-inner">
                          <button
                            type="button"
                            onClick={() =>
                              handleQuantityChange(item.id, -1, item.quantity)
                            }
                            className="px-3 py-1 text-eatpur-dark hover:bg-black/5 transition-colors font-bold"
                          >
                            -
                          </button>
                          <span className="px-4 py-1 text-sm font-medium text-eatpur-dark min-w-[2.5rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleQuantityChange(item.id, 1, item.quantity)
                            }
                            className="px-3 py-1 text-eatpur-dark hover:bg-black/5 transition-colors font-bold"
                          >
                            +
                          </button>
                        </div>

                        {/* Item Total */}
                        <div className="text-eatpur-green-dark font-semibold text-lg font-serif min-w-[4rem] text-right">
                          ₹{item.price * item.quantity}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="flex justify-between items-center text-xl pt-2">
                <span className="text-eatpur-dark font-display font-medium">
                  Subtotal
                </span>
                <span className="text-eatpur-green-dark font-semibold font-serif text-2xl">
                  ₹{subtotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* SECTION 3: Payment */}
            <div className="space-y-6 pt-6 border-t border-black/10 text-center">
              <h3 className="text-2xl font-display text-eatpur-dark text-left border-b border-black/10 pb-3">
                Payment
              </h3>
              <div className="w-20 h-20 mx-auto bg-eatpur-white-warm rounded-full flex items-center justify-center border border-eatpur-green-dark/30 mb-4 shadow-inner">
                <span className="text-eatpur-green-dark text-3xl font-serif font-bold">
                  ₹
                </span>
              </div>
              <h4 className="text-xl text-eatpur-dark mb-1 font-display">
                Total Amount to Pay
              </h4>
              <p className="text-4xl text-eatpur-green-dark font-semibold mb-4 font-serif">
                ₹{subtotal.toFixed(2)}
              </p>

              <div className="flex justify-end pt-4 border-t border-black/10">
                <button
                  type="submit"
                  disabled={state.items.length === 0 || isProcessing}
                  className={`btn-primary w-full md:w-auto px-12 font-medium tracking-wide flex justify-center items-center gap-2 ${isProcessing ? "opacity-75 cursor-wait" : ""}`}
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
                      Processing...
                    </>
                  ) : (
                    "Place Secure Order"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
