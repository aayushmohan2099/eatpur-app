import { motion, useScroll, useTransform } from "framer-motion";
import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Preload, useGLTF, Environment } from "@react-three/drei";
import CanvasLoader from "../layout/Loader";

useGLTF.preload("/logo/logo.glb");

// ─── 3D Model (unchanged logic, + shine on hover)
function LogoModel({ scrollYProgress, hovered }) {
  const model = useGLTF("/logo/logo.glb");
  const ref = useRef();
  const shineRef = useRef(0);

  useFrame(() => {
    if (!ref.current) return;

    const scroll = scrollYProgress.get();

    if (scroll < 0.22) {
      ref.current.rotation.y *= 0.9;
    } else {
      ref.current.rotation.y += 0.015;
    }

    // ✨ Shine: boost envMapIntensity on hover
    const targetIntensity = hovered ? 4.5 : 1.0;
    shineRef.current += (targetIntensity - shineRef.current) * 0.06;

    ref.current.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.envMapIntensity = shineRef.current;
      }
    });
  });

  return (
    <group ref={ref} scale={[2.3, 2.3, 2.3]}>
      <primitive object={model.scene} />
    </group>
  );
}

// ─── Canvas (fills its container, no positional logic inside)
function LogoCanvas({ scrollYProgress, hovered }) {
  return (
    <Canvas
      shadows
      frameloop="always"
      dpr={[1, 2]}
      camera={{ fov: 45, position: [0, 0, 6] }}
      style={{ width: "100%", height: "100%" }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <Environment preset="city" />
        <LogoModel scrollYProgress={scrollYProgress} hovered={hovered} />
        <Preload all />
      </Suspense>
    </Canvas>
  );
}

// ─── Hero Section
export default function HeroSection({ setMenuOpen }) {
  const { scrollYProgress } = useScroll();
  const [hovered, setHovered] = useState(false);

  // Whole section fades out (your original)
  const opacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  // ── Container dimensions: full viewport → 120px square ──
  const containerW = useTransform(
    scrollYProgress,
    [0, 0.12, 0.25],
    ["100vw", "100vw", "120px"],
  );

  const containerH = useTransform(
    scrollYProgress,
    [0, 0.12, 0.25],
    ["100vh", "100vh", "120px"],
  );

  // ── Position: anchored bottom-right, starts covering whole screen ──
  // At scroll=0:  right=0, bottom=0  → covers full viewport (position:fixed fills from edges)
  // At scroll=0.25: right=24px, bottom=24px → snug corner widget
  const containerRight = useTransform(
    scrollYProgress,
    [0, 0.12, 0.25],
    ["0px", "0px", "24px"],
  );

  const containerBottom = useTransform(
    scrollYProgress,
    [0, 0.12, 0.25],
    ["0px", "0px", "24px"],
  );

  // Pill-ifies as it shrinks
  const borderRadius = useTransform(
    scrollYProgress,
    [0, 0.12, 0.25],
    ["0%", "0%", "50%"],
  );

  return (
    // Outer section: only used for scroll indicator + z-layer, no opacity fade on logo
    <section className="fixed inset-0 z-10 pointer-events-none">
      {/* ── Logo container: the ONLY thing that moves ── */}
      <motion.div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setMenuOpen((prev) => !prev)}
        style={{
          position: "fixed",
          right: containerRight,
          bottom: containerBottom,
          width: containerW,
          height: containerH,
          borderRadius,
          overflow: "hidden",
          zIndex: 50,
          cursor: "pointer",
          boxShadow: hovered
            ? "0 0 48px 12px rgba(255,201,51,0.22), 0 0 0 1.5px rgba(255,201,51,0.18)"
            : "0 0 0px 0px rgba(255,201,51,0)",
          transition: "box-shadow 0.5s ease",
          pointerEvents: "auto",
        }}
      >
        <LogoCanvas scrollYProgress={scrollYProgress} hovered={hovered} />
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 left-6 text-sm text-white/80 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        ↓ Scroll
      </motion.div>
    </section>
  );
}
