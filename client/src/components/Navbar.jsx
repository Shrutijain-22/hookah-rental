import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, ShoppingBag, Menu, X, Shield, PhoneCall } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { bookingCart } = useBooking();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#07080b]/90 backdrop-blur-xl border-b border-[#d4af37]/20 py-3 shadow-2xl shadow-black/80'
          : 'bg-gradient-to-b from-[#07080b]/90 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b8860b] flex items-center justify-center text-[#07080b] shadow-lg shadow-[#d4af37]/20 group-hover:scale-105 transition-transform">
            <Flame className="w-6 h-6 fill-current" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-widest gold-gradient-text uppercase">
              VELVET SMOKE
            </span>
            <span className="text-[10px] tracking-[0.25em] text-[#d4af37]/70 uppercase font-semibold">
              LUXURY HOOKAH RENTALS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link
            to="/"
            className={`transition-colors hover:text-[#d4af37] ${
              location.pathname === '/' ? 'text-[#d4af37]' : 'text-gray-300'
            }`}
          >
            Home
          </Link>
          <Link
            to="/hookahs"
            className={`transition-colors hover:text-[#d4af37] ${
              location.pathname === '/hookahs' ? 'text-[#d4af37]' : 'text-gray-300'
            }`}
          >
            Fleet Catalog
          </Link>
          <a
            href="/#events"
            className="text-gray-300 transition-colors hover:text-[#d4af37]"
          >
            Event Experiences
          </a>
          <a
            href="/#how-it-works"
            className="text-gray-300 transition-colors hover:text-[#d4af37]"
          >
            How It Works
          </a>
          <Link
            to="/status"
            className="text-gray-300 transition-colors hover:text-[#d4af37] flex items-center gap-1.5"
          >
            <Shield className="w-4 h-4 text-[#d4af37]" />
            Track Reservation
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/book"
            className="relative flex items-center gap-2 px-3 py-2 rounded-full glass-panel hover:border-[#d4af37]/50 text-xs font-semibold text-gray-200 transition-colors"
          >
            <ShoppingBag className="w-4 h-4 text-[#d4af37]" />
            <span>Selection</span>
            {bookingCart.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#d4af37] text-[#07080b] font-bold text-[10px] flex items-center justify-center">
                {bookingCart.length}
              </span>
            )}
          </Link>

          <Link
            to="/book"
            className="amber-gradient-btn px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-bold shadow-lg shadow-[#d4af37]/20 flex items-center gap-2"
          >
            <span>Book A Hookah</span>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-3">
          <Link to="/book" className="relative p-2 text-[#d4af37]">
            <ShoppingBag className="w-6 h-6" />
            {bookingCart.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#d4af37] text-[#07080b] font-bold text-[9px] flex items-center justify-center">
                {bookingCart.length}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg text-gray-300 hover:text-[#d4af37] focus:outline-none"
          >
            {mobileOpen ? <X className="w-7 h-7 text-[#d4af37]" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#07080b]/98 border-b border-[#d4af37]/20 px-6 py-6 space-y-4"
          >
            <Link
              to="/"
              className="block text-lg font-medium text-gray-200 hover:text-[#d4af37]"
            >
              Home
            </Link>
            <Link
              to="/hookahs"
              className="block text-lg font-medium text-gray-200 hover:text-[#d4af37]"
            >
              Hookah Fleet
            </Link>
            <a
              href="/#events"
              className="block text-lg font-medium text-gray-200 hover:text-[#d4af37]"
            >
              Event Experiences
            </a>
            <a
              href="/#how-it-works"
              className="block text-lg font-medium text-gray-200 hover:text-[#d4af37]"
            >
              How It Works
            </a>
            <Link
              to="/status"
              className="block text-lg font-medium text-gray-200 hover:text-[#d4af37]"
            >
              Track Reservation
            </Link>
            <Link
              to="/admin/login"
              className="block text-sm font-medium text-gray-400 hover:text-[#d4af37]"
            >
              VIP Concierge Admin
            </Link>
            <div className="pt-4 border-t border-gray-800">
              <Link
                to="/book"
                className="w-full amber-gradient-btn py-3 rounded-full text-center text-sm font-bold uppercase tracking-wider block"
              >
                Reserve Hookah Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
