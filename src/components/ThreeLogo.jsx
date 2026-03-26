import React, { useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, ContactShadows, useGLTF } from "@react-three/drei";
import * as THREE from "three";

useGLTF.preload("/logo/logo.glb");

function LogoMesh({ hovered, isHeroVisible }) {
  const meshRef = useRef();
  // We use standard ref to lerp material properties
  const materialRef = useRef();

  const { scene } = useGLTF("/logo/logo.glb");

  // Keep a ref for rotation speed state
  const rotSpeed = useRef(0.008);
  const shineRef = useRef(1.0);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // 🎯 TARGET ROTATION (front-facing)
    const targetRotationY = isHeroVisible ? 0 : null;

    // 🎯 ROTATION LOGIC
    if (isHeroVisible) {
      // Stop spinning
      rotSpeed.current = 0;

      // Smoothly reset to front
      meshRef.current.rotation.y +=
        (targetRotationY - meshRef.current.rotation.y) * 0.08;
    } else {
      // Normal spinning in corner
      const targetSpeed = 0.015;
      rotSpeed.current += (targetSpeed - rotSpeed.current) * 0.05;
      meshRef.current.rotation.y += rotSpeed.current;
    }

    // 🌟 Shine logic (unchanged)
    if (materialRef.current) {
      const targetShine = hovered && isHeroVisible ? 4.5 : 1.0;
      shineRef.current += (targetShine - shineRef.current) * 0.06;
      materialRef.current.envMapIntensity = shineRef.current;
      materialRef.current.needsUpdate = true;
    }
  });

  return (
    <group>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />

      <Float
        speed={isHeroVisible ? 0 : 2}
        rotationIntensity={isHeroVisible ? 0 : 0.2}
        floatIntensity={isHeroVisible ? 0 : 0.5}
      >
        <group ref={meshRef}>
          <primitive object={scene} castShadow receiveShadow />
        </group>
      </Float>
    </group>
  );
}

export default function ThreeLogo({ isHeroVisible, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="w-full h-full relative"
      style={{
        transition: "box-shadow 0.5s ease",
        boxShadow:
          hovered && isHeroVisible
            ? "0 0 48px 12px rgba(255,201,51,0.22)"
            : "none",
        borderRadius: "50%", // Keeps the glow round
      }}
      onClick={onClick}
    >
      <Canvas
        shadows
        frameloop="always"
        dpr={
          typeof window !== "undefined"
            ? Math.min(window.devicePixelRatio, 1.5)
            : 1
        }
        camera={{ position: [0, 0, 6], fov: 45 }}
      >
        <Environment preset="city" />
        <Suspense fallback={null}>
          <LogoMesh hovered={hovered} isHeroVisible={isHeroVisible} />
        </Suspense>
      </Canvas>
    </div>
  );
}
