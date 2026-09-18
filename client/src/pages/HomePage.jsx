import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Flame, Sparkles, ShieldCheck, Clock, Truck, ChevronRight, Award, Star, ArrowRight } from 'lucide-react';
import HookahCard from '../components/HookahCard';
import HookahDetailModal from '../components/HookahDetailModal';
import EventCategoryCard from '../components/EventCategoryCard';

const eventCategories = [
  {
    title: 'House parties',
    tagline: 'High-energy vibes for home lounges',
    description: 'Rent multi-hose RGB LED cube hookahs delivered to your house party or apartment lounge.',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'Birthdays',
    tagline: 'VIP celebration lounge experience',
    description: 'Rent 24K gold & crystal centerpiece hookahs delivered to your birthday celebration.',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'Weddings',
    tagline: 'Elegance for receptions & after-parties',
    description: 'Rent handcrafted Bohemian crystal & brass hookahs for wedding receptions and VIP after-parties.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'Private events',
    tagline: 'Discreet luxury concierge service',
    description: 'Rent matte black obsidian and carbon fiber hookahs with full shisha & coal concierge service.',
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'College events',
    tagline: 'High-capacity party performance',
    description: 'Rent shatterproof multi-hose party hookahs for campus events and fraternity gatherings.',
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'Corporate events',
    tagline: 'Sophisticated networking lounges',
    description: 'Rent classic Egyptian brass hookahs for corporate galas, brand launches, and executive mixers.',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80',
  },
];

const HomePage = () => {
  const [featuredHookahs, setFeaturedHookahs] = useState([]);
  const [activeModalHookah, setActiveModalHookah] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHookahs = async () => {
      try {
        const res = await axios.get('/api/hookahs?featured=true');
        if (res.data.success) {
          setFeaturedHookahs(res.data.data);
        }
      } catch (err) {
        console.error('Error loading hookahs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHookahs();
  }, []);

  return (
    <div className="min-h-screen bg-[#07080b] text-gray-200 pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-24">
        {/* Background Image & Smoke Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&w=2000&q=80"
            alt="Luxury Hookah Setup"
            className="w-full h-full object-cover opacity-35 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07080b] via-[#07080b]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07080b] via-transparent to-[#07080b]" />
        </div>

        {/* Ambient Gold Glow Spotlights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#d4af37]/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border-[#d4af37]/30 text-[#d4af37] text-xs font-bold uppercase tracking-widest shadow-xl">
              <Sparkles className="w-4 h-4 fill-current" />
              <span>Hookah Equipment Rentals For Parties & Events</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
              RENT PREMIUM HOOKAHS FOR YOUR <br />
              <span className="gold-gradient-text">PARTY, BIRTHDAY & EVENTS</span>
            </h1>

            <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-300 font-normal leading-relaxed">
              Choose from our wide variety of luxury 1-hose, 2-hose, and 4-hose hookahs. We deliver the hookah setups, fresh coconut coals, and premium flavor mixes directly to your event venue or party location.
            </p>
          </motion.div>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              to="/hookahs"
              className="w-full sm:w-auto amber-gradient-btn px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-3 shadow-2xl shadow-[#d4af37]/30"
            >
              <span>Browse Hookah Models</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/book"
              className="w-full sm:w-auto px-8 py-4 rounded-full glass-panel glass-panel-hover text-sm font-bold text-gray-200 flex items-center justify-center gap-2 border border-white/20"
            >
              <span>Book A Hookah Setup</span>
            </Link>
          </motion.div>

          {/* Quick Metrics Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-center"
          >
            <div className="glass-panel p-4 rounded-2xl">
              <span className="text-2xl font-black text-[#d4af37] block">Various Models</span>
              <span className="text-xs text-gray-400">Gold, Crystal, Carbon Fiber & Cube</span>
            </div>
            <div className="glass-panel p-4 rounded-2xl">
              <span className="text-2xl font-black text-[#d4af37] block">Delivery & Setup</span>
              <span className="text-xs text-gray-400">Direct To Your Party Address</span>
            </div>
            <div className="glass-panel p-4 rounded-2xl">
              <span className="text-2xl font-black text-[#d4af37] block">1 - 4+ Hoses</span>
              <span className="text-xs text-gray-400">Multi-User Party Setups</span>
            </div>
            <div className="glass-panel p-4 rounded-2xl">
              <span className="text-2xl font-black text-[#d4af37] block">Full Service</span>
              <span className="text-xs text-gray-400">Includes Coals & Shisha Flavors</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Fleet Showcase */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">
              Hookah Inventory
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 gold-gradient-text">
              FEATURED HOOKAH MODELS TO RENT
            </h2>
          </div>
          <Link
            to="/hookahs"
            className="mt-4 md:mt-0 text-sm font-bold text-[#d4af37] hover:text-[#f3e5ab] flex items-center gap-1 group"
          >
            <span>View All Hookah Models</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredHookahs.map((hookah) => (
              <HookahCard
                key={hookah._id}
                hookah={hookah}
                onQuickView={setActiveModalHookah}
              />
            ))}
          </div>
        )}
      </section>

      {/* Event Experiences Section */}
      <section id="events" className="py-20 bg-black/40 border-y border-gray-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">
              Rent For Any Event Location
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white gold-gradient-text">
              HOOKAH SETUPS FOR YOUR OCCASION
            </h2>
            <p className="text-sm text-gray-400">
              We deliver and set up hookahs for your house parties, birthday bashes, weddings, corporate galas, and private events.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventCategories.map((cat, idx) => (
              <EventCategoryCard key={idx} {...cat} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - The VIP Flow */}
      <section id="how-it-works" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">
            How Hookah Rental Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white gold-gradient-text">
            4 EASY STEPS TO RENT A HOOKAH
          </h2>
          <p className="text-sm text-gray-400">
            We deliver the hookahs, set them up with fresh coals & shisha, and pick them up when your party ends.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="glass-panel p-6 rounded-3xl text-center space-y-4 border border-[#d4af37]/20 relative">
            <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30 flex items-center justify-center font-black text-xl mx-auto">
              1
            </div>
            <h3 className="text-lg font-bold text-white">Choose Hookah Model</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Pick your preferred hookah style (Gold, Crystal, Carbon, Acrylic Cube) and number of hoses.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl text-center space-y-4 border border-[#d4af37]/20 relative">
            <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30 flex items-center justify-center font-black text-xl mx-auto">
              2
            </div>
            <h3 className="text-lg font-bold text-white">Set Event Date & Time</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Select your party date, start time, rental duration (2h to 12h), and delivery address.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl text-center space-y-4 border border-[#d4af37]/20 relative">
            <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30 flex items-center justify-center font-black text-xl mx-auto">
              3
            </div>
            <h3 className="text-lg font-bold text-white">Delivery & Setup</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              We arrive at your event address, prepare fresh coals, set up the hookahs, and ensure smooth airflow.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl text-center space-y-4 border border-[#d4af37]/20 relative">
            <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30 flex items-center justify-center font-black text-xl mx-auto">
              4
            </div>
            <h3 className="text-lg font-bold text-white">Hassle-Free Pickup</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              When your rental duration finishes, our team returns to pick up the hookahs without disturbing your guests.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-[#d4af37]/30 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white gold-gradient-text">
              NEED HOOKAHS FOR YOUR UPCOMING PARTY?
            </h2>
            <p className="text-sm text-gray-300">
              Submit your hookah rental request now to secure your preferred hookah models for your event date.
            </p>
            <Link
              to="/book"
              className="inline-flex items-center justify-center gap-2 amber-gradient-btn px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wider shadow-2xl shadow-[#d4af37]/30"
            >
              <span>Submit Hookah Rental Request</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Hookah Spec Modal */}
      {activeModalHookah && (
        <HookahDetailModal
          hookah={activeModalHookah}
          onClose={() => setActiveModalHookah(null)}
        />
      )}
    </div>
  );
};

export default HomePage;
