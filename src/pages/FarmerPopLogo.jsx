import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import eatpurFarmerPopLogo from "../assets/temp/EatpurFarmerPopLogo.png";

export default function FarmerPopLogo({ onOpenForm, formRoute = "/farmer-form" }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const navigate = useNavigate();

  // Page load hone ke 0.6 sec baad neeche se upar pop hoga
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  if (isClosed) return null;

  const handleClick = () => {
    if (onOpenForm) {
      onOpenForm();
    } else {
      navigate(formRoute, { state: { openFarmerForm: true } });
    }
  };

  return (
    <div
      className={`fixed bottom-4 left-5 z-[400] transition-all duration-700 ease-out sm:bottom-6 sm:left-6 ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-28 opacity-0"
      }`}
    >
      <div className="relative flex flex-col items-end">
        {/* Optional Close Button */}
        <button
          type="button"
          onClick={() => setIsClosed(true)}
          aria-label="Close popup"
          className="mb-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs font-bold text-white shadow transition hover:bg-black"
        >
          ✕
        </button>

        {/* Clickable Pop-up Image */}
        <button
          type="button"
          onClick={handleClick}
          aria-label="Open Farmer Connect Form"
          className="group cursor-pointer"
        >
          <img
            src={eatpurFarmerPopLogo}
            alt="EatPur Farmer Connect"
            className="h-24 w-auto object-contain drop-shadow-2xl transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-105 sm:h-32"
          />
        </button>
      </div>
    </div>
  );
}