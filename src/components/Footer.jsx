import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebook, FaTwitter, FaYoutube, FaLocationDot, FaPhone, FaEnvelope } from 'react-icons/fa6';

export default function Footer() {
  return (
    <footer className="bg-eatpur-dark border-t border-eatpur-gold/10 pt-16 pb-8 z-10 relative">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        {/* Column 1: Brand */}
        <div className="space-y-6">
          <Link to="/" className="text-3xl font-display text-eatpur-yellow">EatPur</Link>
          <p className="text-eatpur-text leading-relaxed">
            Fuel your body naturally with our premium millet-based products. Ancient grains for modern nutrition.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-eatpur-gold hover:text-eatpur-dark hover:bg-eatpur-gold transition-all duration-300">
              <FaInstagram size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-eatpur-gold hover:text-eatpur-dark hover:bg-eatpur-gold transition-all duration-300">
              <FaFacebook size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-eatpur-gold hover:text-eatpur-dark hover:bg-eatpur-gold transition-all duration-300">
              <FaTwitter size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-eatpur-gold hover:text-eatpur-dark hover:bg-eatpur-gold transition-all duration-300">
              <FaYoutube size={18} />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 className="text-eatpur-yellow font-bold text-lg mb-6">Quick Links</h4>
          <ul className="space-y-4">
            <li><Link to="/products" className="text-eatpur-text hover:text-eatpur-white-warm transition-colors">Products</Link></li>
            <li><Link to="/recipes" className="text-eatpur-text hover:text-eatpur-white-warm transition-colors">Recipes</Link></li>
            <li><Link to="/blogs" className="text-eatpur-text hover:text-eatpur-white-warm transition-colors">Blog</Link></li>
            <li><Link to="/about" className="text-eatpur-text hover:text-eatpur-white-warm transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="text-eatpur-text hover:text-eatpur-white-warm transition-colors">Contact</Link></li>
          </ul>
        </div>

        {/* Column 3: Categories */}
        <div>
          <h4 className="text-eatpur-yellow font-bold text-lg mb-6">Categories</h4>
          <ul className="space-y-4">
            <li><Link to="/products?category=ready-to-eat" className="text-eatpur-text hover:text-eatpur-white-warm transition-colors">Ready to Eat</Link></li>
            <li><Link to="/products?category=ready-to-cook" className="text-eatpur-text hover:text-eatpur-white-warm transition-colors">Ready to Cook</Link></li>
            <li><Link to="/products?category=raw-flour" className="text-eatpur-text hover:text-eatpur-white-warm transition-colors">Raw Flour</Link></li>
          </ul>
        </div>

        {/* Column 4: Contact Us */}
        <div>
          <h4 className="text-eatpur-yellow font-bold text-lg mb-6">Contact Us</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <FaLocationDot className="text-eatpur-gold mt-1" />
              <span className="text-eatpur-text">India</span>
            </li>
            <li className="flex items-center gap-3">
              <FaPhone className="text-eatpur-gold" />
              <span className="text-eatpur-text">+91 98765 43210</span>
            </li>
            <li className="flex items-center gap-3">
              <FaEnvelope className="text-eatpur-gold" />
              <span className="text-eatpur-text">hello@eatpur.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-eatpur-gold/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-eatpur-text/60">
        <p>© {new Date().getFullYear()} EatPur. All rights reserved.</p>
        <div className="flex gap-6">
          <Link to="#" className="hover:text-eatpur-white-warm transition-colors">Privacy Policy</Link>
          <Link to="#" className="hover:text-eatpur-white-warm transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
