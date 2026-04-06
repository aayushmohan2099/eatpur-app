import React from "react";
import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaYoutube,
  FaLocationDot,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-eatpur-white-warm border-t border-black/5 pt-16 pb-8 z-10 relative mt-auto">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        {/* Column 1: Brand */}
        <div className="space-y-6">
          <Link to="/" className="flex flex-col">
            <h2 className="font-display font-bold text-2xl text-eatpur-dark tracking-wide">
              EATPUR NATURALS
            </h2>
            <span className="text-[9px] tracking-[0.25em] text-eatpur-text-light uppercase mt-1">
              PURE & WHOLESOME
            </span>
          </Link>
          <p className="text-eatpur-text leading-relaxed text-sm pr-4">
            Fuel your body naturally with our premium millet-based products.
            Ancient grains for modern nutrition.
          </p>
          <div className="flex gap-3">
            <a
              href="https://www.instagram.com/eatpurnaturals?igsh=bXI2dzE2b245NXk0"
              className="w-9 h-9 rounded-full border border-eatpur-green-dark/20 flex items-center justify-center text-eatpur-green-dark hover:bg-eatpur-green-dark hover:text-white transition-all duration-300"
            >
              <FaInstagram size={16} />
            </a>
            <a
              href="https://www.facebook.com/share/172ssGW4HB/"
              className="w-9 h-9 rounded-full border border-eatpur-green-dark/20 flex items-center justify-center text-eatpur-green-dark hover:bg-eatpur-green-dark hover:text-white transition-all duration-300"
            >
              <FaFacebook size={16} />
            </a>
            <a
              href="#"
              className="w-9 h-9 rounded-full border border-eatpur-green-dark/20 flex items-center justify-center text-eatpur-green-dark hover:bg-eatpur-green-dark hover:text-white transition-all duration-300"
            >
              <FaTwitter size={16} />
            </a>
            <a
              href="#"
              className="w-9 h-9 rounded-full border border-eatpur-green-dark/20 flex items-center justify-center text-eatpur-green-dark hover:bg-eatpur-green-dark hover:text-white transition-all duration-300"
            >
              <FaYoutube size={16} />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 className="text-eatpur-dark font-display font-bold text-lg mb-6 tracking-wide">
            Quick Links
          </h4>
          <ul className="space-y-3">
            <li>
              <Link
                to="/products"
                className="text-eatpur-text hover:text-eatpur-green-dark transition-colors text-sm"
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                to="/recipes"
                className="text-eatpur-text hover:text-eatpur-green-dark transition-colors text-sm"
              >
                Recipes
              </Link>
            </li>
            <li>
              <Link
                to="/blogs"
                className="text-eatpur-text hover:text-eatpur-green-dark transition-colors text-sm"
              >
                Blog
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="text-eatpur-text hover:text-eatpur-green-dark transition-colors text-sm"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="text-eatpur-text hover:text-eatpur-green-dark transition-colors text-sm"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Categories */}
        <div>
          <h4 className="text-eatpur-dark font-display font-bold text-lg mb-6 tracking-wide">
            Categories
          </h4>
          <ul className="space-y-3">
            <li>
              <Link
                to="/products?category=ready-to-eat"
                className="text-eatpur-text hover:text-eatpur-green-dark transition-colors text-sm"
              >
                Ready to Eat
              </Link>
            </li>
            <li>
              <Link
                to="/products?category=ready-to-cook"
                className="text-eatpur-text hover:text-eatpur-green-dark transition-colors text-sm"
              >
                Ready to Cook
              </Link>
            </li>
            <li>
              <Link
                to="/products?category=raw-flour"
                className="text-eatpur-text hover:text-eatpur-green-dark transition-colors text-sm"
              >
                Raw Flour
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Contact Us */}
        <div>
          <h4 className="text-eatpur-dark font-display font-bold text-lg mb-6 tracking-wide">
            Contact Us
          </h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <FaLocationDot className="text-eatpur-green-dark mt-1" size={14} />
              <span className="text-eatpur-text text-sm">New Delhi, India</span>
            </li>
            <li className="flex items-center gap-3">
              <FaPhone className="text-eatpur-green-dark" size={14} />
              <span className="text-eatpur-text text-sm">+91 90440 48080</span>
            </li>
            <li className="flex items-center gap-3">
              <FaEnvelope className="text-eatpur-green-dark" size={14} />
              <span className="text-eatpur-text text-sm">lovelesh@eatpur.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-black/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-eatpur-text-light">
        <p className="flex items-center gap-2">
          © {new Date().getFullYear()} Eatpur Naturals. All rights reserved. Powered by 
          <span className="flex items-center gap-1 font-medium text-eatpur-text">
            TechnoHorizon
          </span>
        </p>
        <div className="flex gap-6">
          <Link
            to="#"
            className="hover:text-eatpur-green-dark transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            to="#"
            className="hover:text-eatpur-green-dark transition-colors"
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
