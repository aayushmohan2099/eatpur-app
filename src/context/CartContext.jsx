// src/context/CartContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from "react";

const CartContext = createContext();

// 1. Automatically load saved cart from LocalStorage on mount
const loadInitialState = () => {
  try {
    const savedCart = localStorage.getItem("eatpur_cart");
    if (savedCart) {
      return { items: JSON.parse(savedCart), isOpen: false };
    }
  } catch (error) {
    console.error("Failed to parse cart from local storage", error);
  }
  return { items: [], isOpen: false };
};

const initialState = loadInitialState();

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const payload = action.payload;

      // 🔥 SURGICAL FIX: Normalize Django API fields to Cart expected fields
      const cartItem = {
        ...payload,
        // Force the API string to a Float so math operations don't return NaN
        price: parseFloat(
          payload.discounted_price || payload.fixed_price || payload.price || 0,
        ),
        // Map the Django cover_image to the image prop the Cart expects
        image: payload.cover_image || payload.image,
      };

      const existingItem = state.items.find((item) => item.id === cartItem.id);

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === cartItem.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
          isOpen: true,
        };
      }

      return {
        ...state,
        items: [...state.items, { ...cartItem, quantity: 1 }],
        isOpen: true,
      };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
      };

    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item,
        ),
      };

    case "TOGGLE_CART":
      return { ...state, isOpen: action.payload ?? !state.isOpen };

    case "CLEAR_CART":
      return { ...state, items: [] };

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // 2. Automatically save cart to LocalStorage whenever items change
  useEffect(() => {
    localStorage.setItem("eatpur_cart", JSON.stringify(state.items));
  }, [state.items]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
