import { motion, useScroll, useTransform } from "framer-motion";
import { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Preload,
  useGLTF,
  Environment,
} from "@react-three/drei";

// Optional loader (you already have this)
import CanvasLoader from "../layout/Loader";

const mouse = { x: 0, y: 0 };

function LogoModel() {
  const model = useGLTF("/logo/logo.glb");
  const ref = useRef();

  useEffect(() => {
    const handleMouse = (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  return (
    <primitive
      ref={ref}
      object={model.scene}
      scale={2.3}       // 🔥 tweak this based on your model
      position={[0, 0, 0]}
    />
  );
}

function LogoCanvas() {
  return (
    <Canvas
      shadows
      frameloop="always"
      dpr={[1, 2]}
      gl={{ preserveDrawingBuffer: true }}
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [0, 0, 6],
      }}
      className="absolute inset-0"
    >
      <Suspense fallback={<CanvasLoader />}>
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <spotLight position={[-5, 5, 5]} intensity={1} />

        {/* 🔥 HDR lighting for premium reflections */}
        <Environment preset="city" />

        {/* Model */}
        <LogoModel />

        {/* Controls (restricted) */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
        />

        <Preload all />
      </Suspense>
    </Canvas>
  );
}

export default function HeroSection() {
  const { scrollYProgress } = useScroll();

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.16, 1],
    [1, 1, 0, 0]
  );

  const y = useTransform(
    scrollYProgress,
    [0, 0.1, 0.16, 1],
    [0, 0, -100, -100]
  );

  return (
    <motion.section
      style={{ opacity, y }}
      className="fixed inset-0 z-10"
    >
      {/* 3D Logo */}
      <LogoCanvas />

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 left-6 flex items-center gap-2 text-white/80 text-sm tracking-wide"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
      >
        <span style={{ color: "var(--color-eatpur-gold)" }}>
          Scroll down
        </span>

        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ color: "var(--color-eatpur-gold)" }}
        >
          ↓
        </motion.span>
      </motion.div>
    </motion.section>
  );
}