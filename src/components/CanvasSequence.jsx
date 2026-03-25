import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, useMotionValueEvent } from "framer-motion";

const FRAME_COUNT = 480;

// Helper to pad the frame index (e.g., 1 -> '0001')
const currentFrame = (index) =>
  `/sequence/${index.toString().padStart(4, "0")}.jpg`;

export default function CanvasSequence() {
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const { scrollYProgress } = useScroll(); // tracks 0 to 1 over the whole page

  // Transform scroll progress (0 to 1) into a frame index (1 to 374)
  const frameIndex = useTransform(scrollYProgress, [0, 1], [1, FRAME_COUNT]);

  // Preload all 374 images for smooth playback
  useEffect(() => {
    const loadedImages = [];
    let loadedCount = 0;

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      img.onload = () => {
        loadedCount++;
        // We could track progress here, but for now we just load silently.
      };
      loadedImages.push(img);
    }
    setImages(loadedImages);
  }, []);

  // Draw the initial frame once images are loaded
  useEffect(() => {
    if (images.length > 0 && images[0].complete && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      drawFrame(ctx, images[0], canvas);
    }
  }, [images]);

  // Handle drawing when scroll changes
  useMotionValueEvent(frameIndex, "change", (latest) => {
    if (images.length === 0 || !canvasRef.current) return;

    // Determine which discrete frame we are on
    const currentFrameIndex = Math.floor(latest) - 1;

    // Ensure we are within array bounds
    const safeIndex = Math.max(0, Math.min(FRAME_COUNT - 1, currentFrameIndex));
    const img = images[safeIndex];

    if (img && img.complete) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      drawFrame(ctx, img, canvas);
    }
  });

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      const dpr = window.devicePixelRatio || 1;

      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;

      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0); // reset
      ctx.scale(dpr, dpr);

      const latest = frameIndex.get();
      const currentFrameIndex = Math.floor(latest) - 1;
      const safeIndex = Math.max(
        0,
        Math.min(FRAME_COUNT - 1, currentFrameIndex),
      );

      if (
        images.length > 0 &&
        images[safeIndex] &&
        images[safeIndex].complete
      ) {
        drawFrame(ctx, images[safeIndex], canvas);
      }
    };

    // Initialize canvas sizes
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [images, frameIndex]);

  // Helper to draw image covering the canvas (like object-fit: cover)
  const drawFrame = (ctx, img, canvas) => {
    const canvasWidth = canvas.clientWidth;
    const canvasHeight = canvas.clientHeight;

    const canvasRatio = canvasWidth / canvasHeight;

    const imgRatio = img.width / img.height;

    let renderWidth, renderHeight, xOffset, yOffset;

    if (canvasRatio > imgRatio) {
      // Canvas is wider than image aspect ratio
      renderWidth = canvasWidth;
      renderHeight = canvasWidth / imgRatio;
      xOffset = 0;
      yOffset = (canvasHeight - renderHeight) / 2;
    } else {
      // Canvas is taller than image aspect ratio
      renderWidth = canvasHeight * imgRatio;
      renderHeight = canvasHeight;
      xOffset = (canvasWidth - renderWidth) / 2;
      yOffset = 0;
    }

    // We clear with the EatPur primary dark green color to blend perfectly
    ctx.fillStyle = "#040704";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, xOffset, yOffset, renderWidth, renderHeight);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-[100svh] z-0 overflow-hidden bg-[#040704] pointer-events-none">
      <canvas ref={canvasRef} className="block w-full h-full" />
      {/* Subtle overlay gradient to blend edges if needed, though matching background color should be perfect */}
      {/* <div className="absolute inset-0 bg-gradient-radial from-transparent to-[#040704]/40 mix-blend-multiply" /> */}
    </div>
  );
}
