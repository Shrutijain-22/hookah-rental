import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Eye, ArrowRight, Play, Flame, Layers } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { useNavigate } from 'react-router-dom';

const HookahCard = ({ hookah, onQuickView }) => {
  const { selectHookahForBooking } = useBooking();
  const navigate = useNavigate();

  const handleBookNow = (e) => {
    e.stopPropagation();
    selectHookahForBooking(hookah);
    navigate('/book');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col group relative"
    >
      {/* Top Image & Media Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-black/40 cursor-pointer" onClick={() => onQuickView(hookah)}>
        <img
          src={hookah.images[0]}
          alt={hookah.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#10121a] via-transparent to-transparent opacity-80" />

        {/* Featured Badge */}
        {hookah.isFeatured && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-[#d4af37] to-[#f59e0b] text-[#07080b] font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
            <Sparkles className="w-3 h-3 fill-current" />
            VIP Choice
          </div>
        )}

        {/* Video Available Badge */}
        {hookah.videoUrl && (
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-[#d4af37] border border-[#d4af37]/30 p-2 rounded-full shadow-lg">
            <Play className="w-3.5 h-3.5 fill-current" />
          </div>
        )}

        {/* Quick View Floating Overlay Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-xs">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(hookah);
            }}
            className="px-4 py-2 rounded-full bg-white/10 hover:bg-[#d4af37] text-white hover:text-[#07080b] border border-white/20 text-xs font-bold transition-all flex items-center gap-2 shadow-xl"
          >
            <Eye className="w-4 h-4" />
            <span>Quick View Specs</span>
          </button>
        </div>

        {/* Price & Hose Overlay */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-[#07080b]/90 border border-[#d4af37]/40 text-[#d4af37] font-bold text-xs px-3 py-1 rounded-lg backdrop-blur-md">
              {hookah.hosesCount} {hookah.hosesCount === 1 ? 'Hose' : 'Hoses'}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-400 block font-medium">Rental Rate</span>
            <span className="text-xl font-extrabold gold-gradient-text">
              ${hookah.hourlyRate} <span className="text-xs text-gray-400 font-normal">/ hr</span>
            </span>
          </div>
        </div>
      </div>

      {/* Card Details Body */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-lg font-bold text-white group-hover:text-[#d4af37] transition-colors">
            {hookah.title}
          </h3>
          <p className="text-xs text-[#d4af37]/80 font-medium mt-1 line-clamp-1">
            {hookah.tagline || hookah.material}
          </p>
          <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">
            {hookah.description}
          </p>
        </div>

        {/* Suitable Events Tags */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          {hookah.eventSuitability.slice(0, 3).map((event, idx) => (
            <span
              key={idx}
              className="text-[10px] bg-white/5 border border-white/10 text-gray-300 px-2.5 py-0.5 rounded-full"
            >
              {event}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-gray-800/80 flex items-center gap-3">
          <button
            onClick={() => onQuickView(hookah)}
            className="flex-1 py-2.5 rounded-xl border border-[#d4af37]/30 hover:border-[#d4af37] text-gray-300 hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Specs & Media</span>
          </button>
          <button
            onClick={handleBookNow}
            className="flex-1 amber-gradient-btn py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#d4af37]/10"
          >
            <span>Reserve</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default HookahCard;
