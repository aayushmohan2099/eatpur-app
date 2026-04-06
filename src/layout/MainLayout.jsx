import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartSidebar from '../components/CartSidebar';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="relative min-h-screen flex flex-col font-sans text-eatpur-text">
      {/* Background is now handled globally in index.css (Cream + SVG Noise) */}
      <div className="relative z-10 flex-grow flex flex-col w-full">
        <Navbar />
        <CartSidebar />
        <main className="flex-grow w-full">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
