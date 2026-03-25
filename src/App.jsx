import React from "react";
import Navbar from "./components/Navbar";
import CanvasSequence from "./components/CanvasSequence";
import HeroSection from "./components/HeroSection";
import ProductsSection from "./components/ProductsSection";
import BenefitsSection from "./components/BenefitsSection";
import BlogsSection from "./components/BlogsSection";
import FooterCTA from "./components/FooterCTA";

export default function App() {
  return (
    <div className="relative">

      {/* 🎥 VIDEO BACKGROUND */}
      <div className="video-bg">
        <video autoPlay loop muted playsInline className="video-el">
          <source src="/defBg/milletBg.mp4" type="video/mp4" />
        </video>

        <div className="video-overlay"></div>
      </div>

      {/* 🌿 MAIN CONTENT */}
      <div className="relative w-full h-[500vh] bg-eatpur-dark/40">
        <Navbar />
        <HeroSection />
        <ProductsSection />
        <BenefitsSection />
        <BlogsSection />
        <FooterCTA />
      </div>

    </div>
  );
}
