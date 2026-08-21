// src/components/ui/CartButton.jsx
import React, { useState } from "react";
import { FaCartShopping, FaBox } from "react-icons/fa6";

export default function CartButton({
  onClick,
  onAnimationComplete,
  className = "",
  disabled = false,
  text = "Add to Cart",
  addedText = "Added!",
}) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = (e) => {
    if (disabled || isClicked) return;

    setIsClicked(true);

    // Add item immediately
    if (onClick) onClick(e);

    setTimeout(() => {
      setIsClicked(false);

      if (onAnimationComplete) {
        onAnimationComplete();
      }
    }, 1500);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isClicked}
      className={`eatpur-cart-button ${isClicked ? "clicked" : ""} ${className}`}
    >
      <span className="add-to-cart font-display">{text}</span>
      <span className="added font-display">{addedText}</span>

      <FaCartShopping className="cart-icon" />
      <FaBox className="box-icon" />

      <style>{`
        .eatpur-cart-button {
          position: relative;
          width: 100%;
          height: 60px; /* Fixed height for animation container */
          border: 0;
          border-radius: 16px;
          background-color: var(--color-eatpur-green-dark, #6B8E23);
          outline: none;
          cursor: pointer;
          color: #fff;
          transition: 0.3s ease-in-out;
          overflow: hidden;
          font-weight: bold;
          font-size: 1.125rem;
          box-shadow: 0 4px 15px rgba(107, 142, 35, 0.3);
        }

        .eatpur-cart-button:hover:not(:disabled) {
          background-color: var(--color-eatpur-dark, #2E2E2E);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(46, 46, 46, 0.4);
        }

        .eatpur-cart-button:active:not(:disabled) {
          transform: scale(0.97);
        }

        .eatpur-cart-button:disabled {
          opacity: 0.8;
          cursor: default;
        }

        /* Initial States */
        .cart-icon {
          position: absolute;
          z-index: 2;
          top: 50%;
          left: -10%;
          font-size: 1.5em;
          transform: translate(-50%, -50%);
        }
        
        .box-icon {
          position: absolute;
          z-index: 3;
          top: -20%;
          left: 52%;
          font-size: 1.1em;
          transform: translate(-50%, -50%);
        }

        .eatpur-cart-button span {
          position: absolute;
          z-index: 3;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          white-space: nowrap;
        }

        .add-to-cart { opacity: 1; }
        .added { opacity: 0; }

        /* Animation States */
        .eatpur-cart-button.clicked .cart-icon {
          animation: slideCart 1.5s ease-in-out forwards;
        }
        .eatpur-cart-button.clicked .box-icon {
          animation: dropBox 1.5s ease-in-out forwards;
        }
        .eatpur-cart-button.clicked .add-to-cart {
          animation: fadeOutText 1.5s ease-in-out forwards;
        }
        .eatpur-cart-button.clicked .added {
          animation: fadeInText 1.5s ease-in-out forwards;
        }

        /* Keyframes */
        @keyframes slideCart {
          0% { left: -10%; }
          40%, 60% { left: 50%; }
          100% { left: 110%; }
        }

        @keyframes dropBox {
          0%, 40% { top: -20%; }
          60% { top: 40%; left: 52%; }
          100% { top: 40%; left: 112%; }
        }

        @keyframes fadeOutText {
          0% { opacity: 1; }
          20%, 100% { opacity: 0; }
        }

        @keyframes fadeInText {
          0%, 80% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </button>
  );
}
