import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaCheck } from "react-icons/fa6";
import { useCart } from "../context/CartContext";

export default function CheckoutPage() {
  const { state, dispatch } = useCart();
  const [isSuccess, setIsSuccess] = useState(false);

  const subtotal = state.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const handleQuantityChange = (id, delta, currentQty) => {
    const newQty = currentQty + delta;
    if (newQty <= 0) {
      dispatch({ type: "REMOVE_ITEM", payload: id });
    } else {
      dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity: newQty } });
    }
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setIsSuccess(true);
    dispatch({ type: "CLEAR_CART" });
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
                          src={item.image}
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
                            onClick={() => handleQuantityChange(item.id, -1, item.quantity)}
                            className="px-3 py-1 text-eatpur-dark hover:bg-black/5 transition-colors font-bold"
                          >
                            -
                          </button>
                          <span className="px-4 py-1 text-sm font-medium text-eatpur-dark min-w-[2.5rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(item.id, 1, item.quantity)}
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
                <span className="text-eatpur-dark font-display font-medium">Subtotal</span>
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
              <p className="text-eatpur-text-light text-sm mb-8 italic font-serif">
                This is a mock payment screen. No actual transaction will occur.
              </p>

              <div className="flex justify-end pt-4 border-t border-black/10">
                <button
                  type="submit"
                  disabled={state.items.length === 0}
                  className="btn-primary w-full md:w-auto px-12 font-medium tracking-wide"
                >
                  Place Order
                </button>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}