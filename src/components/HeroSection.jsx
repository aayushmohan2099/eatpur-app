import { motion, useScroll, useTransform } from "framer-motion";
import { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Preload,
  useGLTF,
  Environment,
} from "@react-three/drei";

import CanvasLoader from "../layout/Loader";

const mouse = { x: 0, y: 0 };
useGLTF.preload("/logo/logo.glb");

function LogoModel({ scrollYProgress }) {
  const model = useGLTF("/logo/logo.glb");
  const ref = useRef();

  // 🎯 Smooth transforms
  const scale = useTransform(scrollYProgress, [0, 0.25], [2.8, 0.5]);
  const posX = useTransform(scrollYProgress, [0, 0.25], [0, 3.2]);
  const posY = useTransform(scrollYProgress, [0, 0.25], [0, -2.5]);

  useFrame(() => {
    if (!ref.current) return;

    const scroll = scrollYProgress.get();

    // ❌ NO rotation in hero
    if (scroll < 0.22) {
      ref.current.rotation.y *= 0.9; // gently settle
      return;
    }

    // ✅ Rotation ONLY when small & bottom-right
    ref.current.rotation.y += 0.015;
  });

  return (
    <group ref={ref} position={[0, 0, 0]} scale={[2.3, 2.3, 2.3]}>
      <primitive object={model.scene} />

      {/* 🎯 Apply transforms here (important!) */}
      <group ref={ref}>
        <motion.group scale={scale} position-x={posX} position-y={posY}>
          <primitive object={model.scene} />
        </motion.group>
      </group>
    </group>
  );
}

function LogoCanvas({ scrollYProgress }) {
  return (
    <Canvas
      shadows
      frameloop="always"
      dpr={[1, 2]}
      camera={{ fov: 45, position: [0, 0, 6] }}
      className="absolute inset-0"
    >
      <Suspense fallback={<CanvasLoader />}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <Environment preset="city" />

        <LogoModel scrollYProgress={scrollYProgress} />

        <OrbitControls enableZoom={false} enablePan={false} />
        <Preload all />
      </Suspense>
    </Canvas>
  );
}

export default function HeroSection({ setMenuOpen }) {
  const { scrollYProgress } = useScroll();

  const opacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <motion.section style={{ opacity }} className="fixed inset-0 z-10">
      {/* 🔥 Clickable overlay for interaction */}
      <motion.div
        className="absolute inset-0 z-20 cursor-pointer"
        whileHover={{ scale: 1.02 }}
        onClick={() => setMenuOpen((prev) => !prev)}
      />

      <LogoCanvas scrollYProgress={scrollYProgress} />

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 left-6 text-sm text-white/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        ↓ Scroll
      </motion.div>
    </motion.section>
  );
}
