import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, Phone, Mail, MapPin, ShieldCheck, Clock, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#050608] border-t border-[#d4af37]/20 pt-16 pb-12 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-gray-800">
          {/* Brand & Tagline */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b8860b] flex items-center justify-center text-[#07080b]">
                <Flame className="w-6 h-6 fill-current" />
              </div>
              <span className="text-xl font-bold tracking-wider gold-gradient-text">
                VELVET SMOKE
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Premier luxury hookah rentals engineered for exclusive house parties, weddings, birthdays, corporate celebrations, and private VIP events.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#d4af37]/80">
              <ShieldCheck className="w-4 h-4" />
              <span>Full-Service Concierge Delivery & Setup Included</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider border-l-2 border-[#d4af37] pl-3">
              Fleet & Services
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/hookahs" className="hover:text-[#d4af37] transition-colors">
                  Browse All Hookahs
                </Link>
              </li>
              <li>
                <Link to="/book" className="hover:text-[#d4af37] transition-colors">
                  Instant Rental Booking
                </Link>
              </li>
              <li>
                <Link to="/status" className="hover:text-[#d4af37] transition-colors">
                  Track Reservation Status
                </Link>
              </li>
              <li>
                <a href="/#how-it-works" className="hover:text-[#d4af37] transition-colors">
                  Concierge Delivery Flow
                </a>
              </li>
            </ul>
          </div>

          {/* Covered Events */}
          <div className="space-y-4">
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider border-l-2 border-[#d4af37] pl-3">
              Event Types
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" /> House Parties & Lounges
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" /> Birthday Celebrations
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" /> Luxury Weddings & Receptions
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" /> Corporate Galas & Networking
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" /> Private VIP After-Parties
              </li>
            </ul>
          </div>

          {/* Direct Concierge Contact */}
          <div className="space-y-4">
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider border-l-2 border-[#d4af37] pl-3">
              Concierge Line
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#d4af37]" />
                <span>+1 (800) 555-SMOKE</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#d4af37]" />
                <span>concierge@velvetsmoke-rentals.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#d4af37]" />
                <span>Operating Hours: 24/7 Event On-Call</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & Admin portal link */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} Velvet Smoke Luxury Hookah Rentals. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/admin/login" className="hover:text-[#d4af37] transition-colors flex items-center gap-1">
              <span>Admin Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
