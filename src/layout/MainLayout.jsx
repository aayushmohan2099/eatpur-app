import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartSidebar from '../components/CartSidebar';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="relative min-h-screen flex flex-col font-sans text-eatpur-text bg-eatpur-dark">
      {/* Global Video Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover scale-105 filter blur-[2px] opacity-40"
        >
          <source src="/defBg/milletBg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-eatpur-dark/80 to-eatpur-green-dark/95 backdrop-blur-[4px]"></div>
      </div>

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
