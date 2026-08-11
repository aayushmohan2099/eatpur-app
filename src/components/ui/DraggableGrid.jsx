// src/components/ui/DraggableGrid.jsx
"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { motion, useMotionValue, animate } from "framer-motion";

const defaultItems = [
  {
    image: {
      src: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/612d1402-0ad9-4135-3bbc-a30a6a252b00/w=800",
    },
    alt: "",
  },
  {
    image: {
      src: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/6d2ad64a-102d-4eab-0efe-31479e34b500/w=800",
    },
    alt: "",
  },
  {
    image: {
      src: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/be854dd1-37aa-4fc7-f569-fdb948109300/w=800",
    },
    alt: "",
  },
  {
    image: {
      src: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/51984031-9176-484b-f5e0-4af9a8e9ed00/w=800",
    },
    alt: "",
  },
  {
    image: {
      src: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/34ce1842-4b7a-4d52-0302-38582c341700/w=800",
    },
    alt: "",
  },
];

const COMPONENT_DEFAULTS = {
  items: defaultItems,
  columns: 15,
  imageWidth: 200,
  imageHeight: 200,
  rounded: 3,
  gap: 5,
  enableWheel: false,
  placeholderColor: "#1a1a1f",
  renderItem: null, // NEW: Allows passing custom React components instead of images
};

function getItemColor(index) {
  const hue = (index * 137.508) % 360;
  return `hsl(${hue}, 55%, 55%)`;
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function fillAndShuffle(items, target, seed) {
  if (items.length === 0) return [];
  const rand = mulberry32(seed);
  const out = [];
  const refill = () => {
    const pool = items.slice();
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool;
  };
  let pool = refill();
  while (out.length < target) {
    if (pool.length === 0) pool = refill();
    const next = pool.pop();
    if (out.length > 0 && next === out[out.length - 1] && pool.length > 0) {
      const swap = pool.pop();
      out.push(swap);
      pool.push(next);
    } else {
      out.push(next);
    }
  }
  return out;
}

export default function DraggableGrid(props) {
  const mergedProps = { ...COMPONENT_DEFAULTS, ...props };
  const {
    items,
    columns,
    imageWidth,
    imageHeight,
    rounded,
    gap,
    enableWheel,
    onItemClick,
    renderItem,
    style,
  } = mergedProps;

  const containerRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const [containerSize, setContainerSize] = useState({ w: 800, h: 600 });
  const [isDragging, setIsDragging] = useState(false);
  const initializedRef = useRef(false);

  const pointerDownPos = useRef(null);
  const wheelAnimX = useRef(null);
  const wheelAnimY = useRef(null);
  const failedImages = useRef(new Set());
  const [, forceRender] = useState(0);

  const safeItems =
    Array.isArray(items) && items.length > 0 ? items : defaultItems;
  const safeColumns = Math.max(1, Math.min(20, Math.floor(columns || 5)));
  const safeImageWidth = Math.max(20, Math.min(4000, imageWidth ?? 150));
  const safeImageHeight = Math.max(20, Math.min(4000, imageHeight ?? 210));
  const safeGap = Math.max(0, Math.min(100, gap ?? 4)) * 4;
  const r = Math.max(0, Math.min(20, rounded ?? 3));
  const radius = (r / 20) * (Math.min(safeImageWidth, safeImageHeight) / 2);

  const rows = safeColumns;
  const totalCells = safeColumns * rows;
  const displayItems = useMemo(
    () => fillAndShuffle(safeItems, totalCells, 0xc0ffee),
    [safeItems, totalCells],
  );

  const gridW = safeColumns * safeImageWidth + (safeColumns - 1) * safeGap;
  const gridH = rows * safeImageHeight + (rows - 1) * safeGap;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setContainerSize({ w: rect.width, h: rect.height });
      }
    };
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const maxX = safeGap;
  const minX = Math.min(maxX, containerSize.w - gridW - safeGap);
  const maxY = safeGap;
  const minY = Math.min(maxY, containerSize.h - gridH - safeGap);

  const dragConstraints = {
    left: minX,
    right: maxX,
    top: minY,
    bottom: maxY,
  };

  useEffect(() => {
    if (initializedRef.current) return;
    if (containerSize.w === 0 || containerSize.h === 0) return;

    x.set(maxX);
    y.set(maxY);
    initializedRef.current = true;
  }, [containerSize.w, containerSize.h, maxX, maxY, x, y]);

  useEffect(() => {
    if (!enableWheel) return;
    const el = containerRef.current;
    if (!el) return;

    const clamp = (v, mn, mx) => Math.min(Math.max(v, mn), mx);

    const onWheel = (e) => {
      e.preventDefault();
      const curX = x.get();
      const curY = y.get();
      const targetX = clamp(curX - e.deltaX, minX, maxX);
      const targetY = clamp(curY - e.deltaY, minY, maxY);

      if (wheelAnimX.current) wheelAnimX.current.stop();
      if (wheelAnimY.current) wheelAnimY.current.stop();

      wheelAnimX.current = animate(x, targetX, {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      });
      wheelAnimY.current = animate(y, targetY, {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      });
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      if (wheelAnimX.current) wheelAnimX.current.stop();
      if (wheelAnimY.current) wheelAnimY.current.stop();
    };
  }, [enableWheel, minX, maxX, minY, maxY, x, y]);

  const handlePointerDown = useCallback((e) => {
    pointerDownPos.current = { x: e.clientX, y: e.clientY, t: Date.now() };
  }, []);

  const handlePointerUp = useCallback(
    (e, item, index) => {
      const start = pointerDownPos.current;
      pointerDownPos.current = null;
      if (!start) return;
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      const moved = Math.hypot(dx, dy);
      if (moved < 5) {
        onItemClick?.(item, index);
      }
    },
    [onItemClick],
  );

  const handleImageError = useCallback((index) => {
    failedImages.current.add(index);
    forceRender((n) => n + 1);
  }, []);

  const wrapperStyle = {
    position: "relative",
    width: "100%",
    height: "100%",
    minWidth: 600,
    minHeight: 600,
    margin: 0,
    boxSizing: "border-box",
    overflow: "hidden",
    touchAction: "none",
    userSelect: "none",
    cursor: isDragging ? "grabbing" : "grab",
    ...style,
  };

  const gridStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: gridW,
    height: gridH,
    boxSizing: "border-box",
    display: "grid",
    gridTemplateColumns: `repeat(${safeColumns}, ${safeImageWidth}px)`,
    gridAutoRows: `${safeImageHeight}px`,
    gap: `${safeGap}px`,
    willChange: "transform",
  };

  return (
    <div ref={containerRef} style={wrapperStyle}>
      <motion.div
        style={{ ...gridStyle, x, y }}
        drag
        dragConstraints={dragConstraints}
        dragElastic={0}
        dragMomentum={true}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
      >
        {displayItems.map((item, index) => {
          const src = item?.image?.src;
          const alt = item?.alt ?? item?.image?.alt ?? "";
          const failed = failedImages.current.has(index);

          // If a custom render function is provided, let it handle the content entirely
          if (renderItem) {
            return (
              <div
                key={index}
                onPointerDown={handlePointerDown}
                onPointerUp={(e) => handlePointerUp(e, item, index)}
                style={{
                  position: "relative",
                  width: safeImageWidth,
                  height: safeImageHeight,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: isDragging ? "grabbing" : "pointer",
                  overflow: "visible", // Allows the quote icon to pop out perfectly
                }}
              >
                {renderItem(item, index)}
              </div>
            );
          }

          // Fallback default image behavior
          return (
            <div
              key={index}
              onPointerDown={handlePointerDown}
              onPointerUp={(e) => handlePointerUp(e, item, index)}
              style={{
                position: "relative",
                width: safeImageWidth,
                height: safeImageHeight,
                overflow: "hidden",
                borderRadius: radius,
                backgroundColor: getItemColor(index),
                color: "rgba(255,255,255,0.85)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily:
                  "Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                fontSize: Math.max(
                  14,
                  Math.round(Math.min(safeImageWidth, safeImageHeight) * 0.16),
                ),
                fontWeight: 600,
                cursor: isDragging ? "grabbing" : "pointer",
              }}
            >
              <span style={{ position: "relative", zIndex: 0 }}>
                {index + 1}
              </span>
              {src && !failed ? (
                <img
                  src={src}
                  alt={alt}
                  draggable={false}
                  onError={() => handleImageError(index)}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    pointerEvents: "none",
                    userSelect: "none",
                    display: "block",
                    zIndex: 1,
                  }}
                />
              ) : null}
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
