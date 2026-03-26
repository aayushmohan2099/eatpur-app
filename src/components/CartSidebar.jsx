import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMinus, FaPlus, FaTrash, FaXmark } from 'react-icons/fa6';

export default function CartSidebar() {
  const { state, dispatch } = useCart();
  const navigate = useNavigate();

  const subtotal = state.items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {state.isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-eatpur-dark/70 backdrop-blur-sm z-40"
            onClick={() => dispatch({ type: 'TOGGLE_CART', payload: false })}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-eatpur-dark/95 backdrop-blur-[30px] border-l border-eatpur-gold/20 z-50 flex flex-col shadow-2xl"
          >
            <div className="p-6 flex items-center justify-between border-b border-eatpur-gold/10">
              <h2 className="text-2xl text-eatpur-yellow font-bold">Your Cart</h2>
              <button
                onClick={() => dispatch({ type: 'TOGGLE_CART', payload: false })}
                className="p-2 text-eatpur-text hover:text-eatpur-yellow transition-colors"
              >
                <FaXmark size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar">
              {state.items.length === 0 ? (
                <div className="text-center text-eatpur-text py-10">
                  Your cart is empty.
                </div>
              ) : (
                state.items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <img src={item.image || '/placeholder.png'} alt={item.name} className="w-20 h-20 object-cover rounded-lg border border-eatpur-gold/10" />
                    <div className="flex-1">
                      <h3 className="text-eatpur-white-warm font-semibold">{item.name}</h3>
                      <p className="text-eatpur-gold text-sm">₹{item.price}</p>
                      
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, quantity: Math.max(1, item.quantity - 1) } })}
                          className="w-8 h-8 rounded-full bg-eatpur-green-dark border border-eatpur-gold/20 flex items-center justify-center text-eatpur-text hover:text-eatpur-yellow hover:border-eatpur-gold transition-colors"
                        >
                          <FaMinus size={12} />
                        </button>
                        <span className="text-eatpur-white-warm">{item.quantity}</span>
                        <button
                          onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, quantity: item.quantity + 1 } })}
                          className="w-8 h-8 rounded-full bg-eatpur-green-dark border border-eatpur-gold/20 flex items-center justify-center text-eatpur-text hover:text-eatpur-yellow hover:border-eatpur-gold transition-colors"
                        >
                          <FaPlus size={12} />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: { id: item.id } })}
                      className="p-2 text-red-400/70 hover:text-red-400 transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))
              )}
            </div>

            {state.items.length > 0 && (
              <div className="p-6 border-t border-eatpur-gold/10 bg-eatpur-green-dark/50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-eatpur-text">Subtotal</span>
                  <span className="text-xl text-eatpur-yellow font-bold">₹{subtotal.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => {
                    dispatch({ type: 'TOGGLE_CART', payload: false });
                    navigate('/products/checkout');
                  }}
                  className="w-full btn-primary flex justify-center py-4"
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
