import React, { useMemo } from "react";

const images = [
  "/home/carousel/1.png",
  "/home/carousel/2.png",
  "/home/carousel/3.png",
  "/home/carousel/4.png",
  "/home/carousel/5.png",
  "/home/carousel/6.png",
  "/home/carousel/7.png",
  "/home/carousel/8.png",
  "/home/carousel/9.png",
  "/home/carousel/10.png",
];

const getRandom = (min, max) => Math.random() * (max - min) + min;

export default function FloatingImagesBackground() {
  const items = useMemo(() => {
    // Reduced count slightly so the larger objects don't clutter the screen
    return Array.from({ length: 14 }).map((_, i) => {
      const depth = getRandom(-300, 100); // Deeper Z-axis

      // Increased sizes for a macro/premium feel
      const size = getRandom(100, 150);

      // Slower durations feel more luxurious and weightless
      const duration = getRandom(40, 75);

      // Negative delays so elements are already on screen when it loads
      const delay = getRandom(-60, 0);

      // Horizontal drift for organic, non-linear movement
      const drift = getRandom(-15, 15);

      // Closer items are sharper and more opaque; further items fade into the background
      const isForeground = depth > -50;
      const blur = isForeground ? 0 : Math.abs(depth + 50) / 40;
      const opacity = isForeground ? getRandom(0.7, 0.9) : getRandom(0.2, 0.5);

      return {
        id: i,
        src: images[i % images.length],
        left: `${getRandom(5, 95)}%`,
        size,
        duration,
        delay,
        drift,
        depth,
        blur,
        opacity,
        rotateStart: getRandom(-45, 45),
        rotateEnd: getRandom(180, 360) * (Math.random() > 0.5 ? 1 : -1),
      };
    });
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
      <div
        className="w-full h-full"
        style={{
          perspective: "1200px", // Deeper perspective
          transformStyle: "preserve-3d",
        }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="absolute will-change-transform"
            style={{
              left: item.left,
              width: `${item.size}px`,
              height: `${item.size}px`,
              // Using CSS variables to pass dynamic values cleanly to the stylesheet
              "--duration": `${item.duration}s`,
              "--delay": `${item.delay}s`,
              "--drift": `${item.drift}vw`,
              "--depth": `${item.depth}px`,
              "--r-start": `${item.rotateStart}deg`,
              "--r-end": `${item.rotateEnd}deg`,
              animation: `floatOrganic var(--duration) linear infinite`,
              animationDelay: "var(--delay)",
              transform: `translateZ(var(--depth))`,
              filter: `blur(${item.blur}px)`,
              opacity: item.opacity,
            }}
          >
            <img
              src={item.src}
              alt=""
              className="w-full h-full object-contain"
              style={{
                // Warm, subtle drop shadow for realistic physical presence
                filter: "drop-shadow(0 15px 25px rgba(46, 36, 16, 0.15))",
                animation: `tumbleOrganic calc(var(--duration) * 1.5) linear infinite`,
              }}
            />
          </div>
        ))}
      </div>

      <style>{`
        /* Organic floating animation: 
          Moves slowly bottom to top while drifting slightly left/right 
        */
        @keyframes floatOrganic {
          0% {
            transform: translateY(-120vh) translateX(0) translateZ(var(--depth));
          }
          50% {
            transform: translateY(0vh) translateX(var(--drift))
              translateZ(var(--depth));
          }
          100% {
            transform: translateY(120vh) translateX(0) translateZ(var(--depth));
          }
        }

        /* Graceful tumbling: 
          Softer rotation that doesn't flip erratically on the 3D axis
        */
        @keyframes tumbleOrganic {
          0% {
            transform: rotate(var(--r-start)) rotateX(0deg) rotateY(0deg);
          }
          50% {
            transform: rotate(calc(var(--r-start) + (var(--r-end) / 2)))
              rotateX(15deg) rotateY(15deg);
          }
          100% {
            transform: rotate(calc(var(--r-start) + var(--r-end))) rotateX(0deg)
              rotateY(0deg);
          }
        }
      `}</style>
    </div>
  );
}
