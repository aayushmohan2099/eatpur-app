import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FaCheck } from "react-icons/fa6";
import { useCart } from "../context/CartContext";

export default function CheckoutPage() {
  const { state, dispatch } = useCart();
  const [step, setStep] = useState(1); // 1: Delivery, 2: Summary, 3: Payment
  const [isSuccess, setIsSuccess] = useState(false);

  // Very dummy logic
  const handleNext = (e) => {
    e.preventDefault();
    if (step < 3) setStep(step + 1);
  };

  const handlePlaceOrder = () => {
    setIsSuccess(true);
    dispatch({ type: "CLEAR_CART" });
  };

  const subtotal = state.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

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
          <h2
            className="text-3xl font-display text-eatpur-dark mb-4 tracking-wide"
          >
            Order Successful!
          </h2>
          <p className="text-eatpur-text font-serif italic mb-8">
            Thank you! Your premium millet foods will arrive soon.
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
        <h1
          className="text-4xl font-display text-eatpur-dark mb-10 text-center leading-[1] py-2 tracking-tight"
        >
          Checkout
        </h1>

        {/* Progress Bar */}
        <div className="flex justify-between items-center mb-12 relative px-4 text-xs font-sans font-bold uppercase tracking-widest text-eatpur-text-light">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-black/5 -z-10 -translate-y-1/2" />
          <div
            className={`absolute top-1/2 left-0 h-0.5 bg-eatpur-green-dark -z-10 -translate-y-1/2 transition-all duration-500`}
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          />

          {["Delivery Details", "Order Summary", "Payment"].map((label, i) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors duration-300 shadow-sm ${step >= i + 1 ? "bg-eatpur-green-dark border-eatpur-green-dark text-white font-medium" : "bg-white border-black/10 text-eatpur-text"}`}
              >
                {i + 1}
              </div>
              <span
                className={
                  step >= i + 1 ? "text-eatpur-green-dark font-semibold" : "text-eatpur-text-light"
                }
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        <div className="vintage-card bg-white border border-black/5 p-8 md:p-12 rounded-2xl shadow-sm">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleNext}
                className="space-y-6 font-sans"
              >
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
                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    className="btn-primary w-full md:w-auto px-12 font-medium tracking-wide"
                  >
                    Continue
                  </button>
                </div>
              </motion.form>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 font-sans"
              >
                <div className="space-y-4 max-h-[40vh] overflow-y-auto hide-scrollbar">
                  {state.items.length === 0 ? (
                    <p className="text-eatpur-text text-center py-4 font-serif italic text-lg">
                      Your cart is empty.
                    </p>
                  ) : (
                    state.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 bg-eatpur-white-warm p-4 rounded-xl border border-black/5 shadow-inner"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover mix-blend-multiply border border-black/5"
                        />
                        <div className="flex-1">
                          <h4 className="text-eatpur-dark font-display font-medium text-lg">
                            {item.name}
                          </h4>
                          <p className="text-eatpur-text-light text-sm min-w-10 font-sans tracking-widest uppercase">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <div className="text-eatpur-green-dark font-semibold text-lg font-serif">
                          ₹{item.price * item.quantity}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="border-t border-black/10 pt-6 flex justify-between items-center text-xl">
                  <span className="text-eatpur-dark font-display font-medium">Subtotal</span>
                  <span className="text-eatpur-green-dark font-semibold font-serif text-2xl">
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between pt-4">
                  <button onClick={() => setStep(1)} className="btn-ghost font-medium">
                    Back
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={state.items.length === 0}
                    className="btn-primary px-12 font-medium tracking-wide"
                  >
                    Proceed to Payment
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 text-center py-8 font-sans"
              >
                <div className="w-20 h-20 mx-auto bg-eatpur-white-warm rounded-full flex items-center justify-center border border-eatpur-green-dark/30 mb-6 shadow-inner">
                  <span className="text-eatpur-green-dark text-3xl font-serif font-bold">
                    ₹
                  </span>
                </div>
                <h3 className="text-2xl text-eatpur-dark mb-2 font-display">
                  Total Amount to Pay
                </h3>
                <p className="text-4xl text-eatpur-green-dark font-semibold mb-8 font-serif">
                  ₹{subtotal.toFixed(2)}
                </p>
                <p className="text-eatpur-text-light text-sm mb-12 italic font-serif">
                  This is a mock payment screen. No actual transaction will occur.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button onClick={() => setStep(2)} className="btn-ghost font-medium">
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    className="btn-primary px-12 font-medium tracking-wide"
                  >
                    Place Order
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
