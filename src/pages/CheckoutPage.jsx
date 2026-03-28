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
      <div className="w-full min-h-screen pt-24 pb-32 px-6 flex items-center justify-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-modal max-w-lg w-full p-12 rounded-3xl text-center flex flex-col items-center"
        >
          <div className="w-24 h-24 bg-eatpur-green-light/20 rounded-full flex items-center justify-center mb-6 border border-eatpur-green-light text-eatpur-green-light">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
            >
              <FaCheck size={48} />
            </motion.div>
          </div>
          <h2
            className="text-3xl font-display text-gradient-gold mb-4"
            style={{ fontFamily: "var(--font-hughes)" }}
          >
            Order Successful!
          </h2>
          <p className="text-eatpur-text mb-8">
            Thank you! Your premium millet foods will arrive soon.
          </p>
          <Link to="/products" className="btn-primary">
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen pt-24 pb-32 px-6 relative z-10">
      <div className="max-w-4xl mx-auto">
        <h1
          className="text-4xl font-display text-gradient-gold mb-10 text-center leading-[1] py-2"
          style={{ fontFamily: "var(--font-hughes)" }}
        >
          Checkout
        </h1>

        {/* Progress Bar */}
        <div className="flex justify-between items-center mb-12 relative px-4 text-sm font-bold uppercase tracking-wider">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-eatpur-gold/10 -z-10 -translate-y-1/2" />
          <div
            className={`absolute top-1/2 left-0 h-0.5 bg-eatpur-gold -z-10 -translate-y-1/2 transition-all duration-500`}
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          />

          {["Delivery Details", "Order Summary", "Payment"].map((label, i) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${step >= i + 1 ? "bg-eatpur-gold border-eatpur-gold text-eatpur-dark" : "bg-eatpur-dark border-eatpur-text text-eatpur-text"}`}
              >
                {i + 1}
              </div>
              <span
                className={
                  step >= i + 1 ? "text-eatpur-yellow" : "text-eatpur-text"
                }
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        <div className="glass-card p-8 md:p-12 rounded-3xl">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleNext}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-eatpur-text-light text-sm mb-2">
                      First Name *
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full bg-eatpur-dark/50 border border-eatpur-gold/20 rounded-xl px-4 py-3 text-eatpur-white-warm focus:outline-none focus:border-eatpur-gold transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-eatpur-text-light text-sm mb-2">
                      Last Name *
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full bg-eatpur-dark/50 border border-eatpur-gold/20 rounded-xl px-4 py-3 text-eatpur-white-warm focus:outline-none focus:border-eatpur-gold transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-eatpur-text-light text-sm mb-2">
                    Address *
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full bg-eatpur-dark/50 border border-eatpur-gold/20 rounded-xl px-4 py-3 text-eatpur-white-warm focus:outline-none focus:border-eatpur-gold transition-colors"
                  />
                </div>
                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    className="btn-primary w-full md:w-auto px-12"
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
                className="space-y-8"
              >
                <div className="space-y-4 max-h-[40vh] overflow-y-auto hide-scrollbar">
                  {state.items.length === 0 ? (
                    <p className="text-eatpur-text text-center py-4">
                      Your cart is empty.
                    </p>
                  ) : (
                    state.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 bg-eatpur-dark/30 p-4 rounded-xl border border-eatpur-gold/5"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="text-eatpur-white-warm font-semibold">
                            {item.name}
                          </h4>
                          <p className="text-eatpur-text text-sm min-w-10">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <div className="text-eatpur-yellow font-bold">
                          ₹{item.price * item.quantity}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="border-t border-eatpur-gold/10 pt-6 flex justify-between items-center text-xl font-bold">
                  <span className="text-eatpur-text-light">Subtotal</span>
                  <span className="text-eatpur-yellow">
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between pt-4">
                  <button onClick={() => setStep(1)} className="btn-ghost">
                    Back
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={state.items.length === 0}
                    className="btn-primary px-12"
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
                className="space-y-8 text-center py-8"
              >
                <div className="w-20 h-20 mx-auto bg-eatpur-dark/50 rounded-full flex items-center justify-center border-2 border-eatpur-gold mb-6 shadow-[0_0_20px_rgba(255,201,51,0.2)]">
                  <span className="text-eatpur-yellow text-2xl font-bold">
                    ₹
                  </span>
                </div>
                <h3 className="text-2xl text-eatpur-white-warm mb-2">
                  Total Amount to Pay
                </h3>
                <p className="text-4xl text-eatpur-yellow font-bold mb-8">
                  ₹{subtotal.toFixed(2)}
                </p>
                <p className="text-eatpur-text/60 text-sm mb-12">
                  This is a mock payment screen. No actual transaction will
                  occur.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button onClick={() => setStep(2)} className="btn-ghost">
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    className="btn-primary px-12"
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
