import React from 'react';
import Navbar from './components/Navbar';
import CanvasSequence from './components/CanvasSequence';
import HeroSection from './components/HeroSection';
import ProductsSection from './components/ProductsSection';
import BenefitsSection from './components/BenefitsSection';
import BlogsSection from './components/BlogsSection';
import FooterCTA from './components/FooterCTA';

export default function App() {
  return (
    // The main container provides the physical scroll height (500vh gives a smooth long scroll)
    <div className="relative w-full h-[500vh] bg-eatpur-dark">
      <Navbar />
      
      {/* The sticky canvas background runs the image sequence */}
      <CanvasSequence />

      {/* Overlay Sections that fade in/out based on global scroll progress */}
      <HeroSection />
      <ProductsSection />
      <BenefitsSection />
      <BlogsSection />
      <FooterCTA />
    </div>
  );
}
