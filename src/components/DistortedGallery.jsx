import React, { useState, useRef, useEffect } from "react";
import classNames from "classnames";
import "../styles/distortedGallery.css";

export default function DistortedGallery({ images, fullBleed = false }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    setActive(0);
  }, [images]);

  useEffect(() => {
    if (!images.length) return;
    const t = setInterval(() => {
      setActive((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(t);
  }, [images.length]);

  const getIndex = (i) => {
    if (i < 0) return images.length - 1;
    if (i >= images.length) return 0;
    return i;
  };

  const left = getIndex(active - 1);
  const right = getIndex(active + 1);

  return (
    <div
      className={classNames("distorted-gallery w-full h-full relative", {
        "distorted-gallery--full-bleed": fullBleed,
      })}
    >
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          className={classNames("distorted-gallery__image", {
            "s--active": i === active,
          })}
          alt=""
          onError={(event) => {
            if (event.currentTarget.dataset.fallbackApplied) return;
            event.currentTarget.dataset.fallbackApplied = "true";
            event.currentTarget.src = "/home/home-carousel/pic1.jpeg";
          }}
        />
      ))}

      <div
        className="distorted-gallery__control"
        onClick={() => setActive(getIndex(active - 1))}
      >
        <span className="arrow arrow-left" />
      </div>

      <div
        className="distorted-gallery__control distorted-gallery__control--right"
        onClick={() => setActive(getIndex(active + 1))}
      >
        <span className="arrow arrow-right" />
      </div>
    </div>
  );
}
