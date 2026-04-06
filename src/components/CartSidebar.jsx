import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaMinus, FaPlus, FaTrash, FaXmark } from "react-icons/fa6";

export default function CartSidebar() {
  const { state, dispatch } = useCart();
  const navigate = useNavigate();

  const subtotal = state.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    <AnimatePresence>
      {state.isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={() => dispatch({ type: "TOGGLE_CART", payload: false })}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-eatpur-white-warm backdrop-blur-[30px] border-l border-black/5 z-[9999] flex flex-col shadow-2xl"
          >
            <div className="p-6 flex items-center justify-between border-b border-black/5 bg-white">
              <h2
                className="text-3xl text-eatpur-dark font-display tracking-tight"
              >
                Your Cart
              </h2>
              <button
                onClick={() =>
                  dispatch({ type: "TOGGLE_CART", payload: false })
                }
                className="p-2 text-eatpur-text-light hover:text-eatpur-dark transition-colors bg-white rounded-full border border-black/5 shadow-sm"
              >
                <FaXmark size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar font-sans">
              {state.items.length === 0 ? (
                <div className="text-center text-eatpur-text py-10 font-serif italic text-lg">
                  Your cart is empty.
                </div>
              ) : (
                state.items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center bg-white p-3 rounded-xl border border-black/5 shadow-sm">
                    <img
                      src={item.image || "/placeholder.png"}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg border border-black/5 mix-blend-multiply"
                    />
                    <div className="flex-1">
                      <h3 className="text-eatpur-dark font-display font-medium text-lg leading-tight mb-1">
                        {item.name}
                      </h3>
                      <p className="text-eatpur-green-dark font-serif font-semibold">₹{item.price}</p>

                      <div className="flex items-center gap-3 mt-3">
                        <button
                          onClick={() =>
                            dispatch({
                              type: "UPDATE_QUANTITY",
                              payload: {
                                id: item.id,
                                quantity: Math.max(1, item.quantity - 1),
                              },
                            })
                          }
                          className="w-7 h-7 rounded-full bg-eatpur-white-warm border border-black/10 flex items-center justify-center text-eatpur-dark hover:border-eatpur-green-dark hover:text-eatpur-green-dark shadow-inner transition-colors"
                        >
                          <FaMinus size={10} />
                        </button>
                        <span className="text-eatpur-dark font-medium w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            dispatch({
                              type: "UPDATE_QUANTITY",
                              payload: {
                                id: item.id,
                                quantity: item.quantity + 1,
                              },
                            })
                          }
                          className="w-7 h-7 rounded-full bg-eatpur-white-warm border border-black/10 flex items-center justify-center text-eatpur-dark hover:border-eatpur-green-dark hover:text-eatpur-green-dark shadow-inner transition-colors"
                        >
                          <FaPlus size={10} />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        dispatch({
                          type: "REMOVE_ITEM",
                          payload: { id: item.id },
                        })
                      }
                      className="p-2.5 text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors border border-red-100 mr-1"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {state.items.length > 0 && (
              <div className="p-6 border-t border-black/5 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-eatpur-dark font-serif italic text-lg">Subtotal</span>
                  <span className="text-2xl text-eatpur-green-dark font-serif font-semibold">
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={() => {
                    dispatch({ type: "TOGGLE_CART", payload: false });
                    navigate("/products/checkout");
                  }}
                  className="w-full btn-primary flex justify-center py-4 font-medium tracking-wide shadow-md"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
