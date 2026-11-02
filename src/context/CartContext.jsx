import React, { createContext, useContext, useReducer, useEffect } from "react";

const CartContext = createContext();

const getCartKey = () => {
  const userId = localStorage.getItem("user_id");
  return userId ? `eatpur_cart_${userId}` : "eatpur_cart_guest";
};

const loadCartItems = () => {
  try {
    const savedCart = localStorage.getItem(getCartKey());
    const items = savedCart ? JSON.parse(savedCart) : [];
    return Array.isArray(items) ? items : [];
  } catch (error) {
    console.error("Failed to load cart:", error);
    return [];
  }
};

// Merge guest cart into the logged-in user's cart.
const mergeGuestCart = () => {
  try {
    const userId = localStorage.getItem("user_id");

    if (!userId) return null;

    const guestCart = JSON.parse(
      localStorage.getItem("eatpur_cart_guest") || "[]",
    );

    if (!Array.isArray(guestCart) || guestCart.length === 0) {
      return loadCartItems();
    }

    const userCartKey = `eatpur_cart_${userId}`;

    const savedUserCart = JSON.parse(localStorage.getItem(userCartKey) || "[]");

    const userCart = Array.isArray(savedUserCart) ? savedUserCart : [];

    const mergedCart = [...userCart];

    guestCart.forEach((guestItem) => {
      const guestId = guestItem.id ?? guestItem.pid;

      const existingIndex = mergedCart.findIndex(
        (item) => String(item.id ?? item.pid) === String(guestId),
      );

      if (existingIndex !== -1) {
        const existingItem = mergedCart[existingIndex];

        mergedCart[existingIndex] = {
          ...existingItem,
          quantity:
            Number(existingItem.quantity || 0) +
            Number(guestItem.quantity || 0),
        };
      } else {
        mergedCart.push({
          ...guestItem,
          id: guestId,
          quantity: Number(guestItem.quantity || 1),
        });
      }
    });

    localStorage.setItem(userCartKey, JSON.stringify(mergedCart));

    localStorage.removeItem("eatpur_cart_guest");

    return mergedCart;
  } catch (error) {
    console.error("Failed to merge guest cart:", error);
    return loadCartItems();
  }
};

const loadInitialState = () => ({
  items: loadCartItems(),
  isOpen: false,
});

function cartReducer(state, action) {
  switch (action.type) {
    case "LOAD_CART":
      return {
        ...state,
        items: action.payload,
        isOpen: false,
      };

    case "ADD_ITEM": {
      const payload = action.payload;

      const cartItem = {
        ...payload,
        id: payload.id ?? payload.pid,
        price: parseFloat(
          payload.discounted_price || payload.fixed_price || payload.price || 0,
        ),
        image: payload.cover_image || payload.image,
      };

      const existingItem = state.items.find(
        (item) => String(item.id) === String(cartItem.id),
      );

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            String(item.id) === String(cartItem.id)
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        };
      }

      return {
        ...state,
        items: [...state.items, { ...cartItem, quantity: 1 }],
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
      return {
        ...state,
        isOpen: action.payload ?? !state.isOpen,
      };

    case "CLEAR_CART":
      return { ...state, items: [] };

    case "OPEN_CART":
      return { ...state, isOpen: true };

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(
    cartReducer,
    undefined,
    loadInitialState,
  );

  // Reload and merge carts whenever authentication changes.
  useEffect(() => {
    const handleAuthChange = () => {
      const userId = localStorage.getItem("user_id");

      if (userId) {
        const mergedCart = mergeGuestCart();

        dispatch({
          type: "LOAD_CART",
          payload: mergedCart || loadCartItems(),
        });
      } else {
        dispatch({
          type: "LOAD_CART",
          payload: loadCartItems(),
        });
      }
    };

    window.addEventListener("eatpur-auth-change", handleAuthChange);

    return () => {
      window.removeEventListener("eatpur-auth-change", handleAuthChange);
    };
  }, []);

  // Save cart items for the currently logged-in user or guest.
  useEffect(() => {
    localStorage.setItem(getCartKey(), JSON.stringify(state.items));
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
