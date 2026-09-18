import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Shield, Sparkles, Check, ArrowRight, Flame, Layers } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { useNavigate } from 'react-router-dom';

const HookahDetailModal = ({ hookah, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(hookah?.images[0] || '');
  const [showVideo, setShowVideo] = useState(false);
  const [calcHours, setCalcHours] = useState(3);
  const { selectHookahForBooking } = useBooking();
  const navigate = useNavigate();

  if (!hookah) return null;

  const handleBookNow = () => {
    selectHookahForBooking(hookah);
    onClose();
    navigate('/book');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-[#0f1118] border border-[#d4af37]/30 rounded-3xl overflow-hidden shadow-2xl my-8 text-gray-200"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 hover:bg-[#d4af37] text-gray-300 hover:text-[#07080b] transition-all border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left Column: Gallery / Video Player */}
            <div className="p-6 bg-black/50 flex flex-col justify-between space-y-4">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-black">
                {showVideo && hookah.videoUrl ? (
                  <video
                    src={hookah.videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={selectedImage || hookah.images[0]}
                    alt={hookah.title}
                    className="w-full h-full object-cover"
                  />
                )}

                {hookah.videoUrl && !showVideo && (
                  <button
                    onClick={() => setShowVideo(true)}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/20 transition-all group"
                  >
                    <div className="w-16 h-16 rounded-full bg-[#d4af37] text-[#07080b] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 fill-current ml-1" />
                    </div>
                  </button>
                )}
              </div>

              {/* Thumbnails */}
              <div className="flex items-center gap-3">
                {hookah.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedImage(img);
                      setShowVideo(false);
                    }}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === img && !showVideo
                        ? 'border-[#d4af37] scale-105 shadow-md'
                        : 'border-white/10 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}

                {hookah.videoUrl && (
                  <button
                    onClick={() => setShowVideo(true)}
                    className={`w-16 h-16 rounded-xl border-2 bg-black/80 flex flex-col items-center justify-center text-xs transition-all ${
                      showVideo ? 'border-[#d4af37] text-[#d4af37]' : 'border-white/10 text-gray-400'
                    }`}
                  >
                    <Play className="w-5 h-5 fill-current" />
                    <span className="text-[9px] font-bold">VIDEO</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right Column: Specs & Calculator */}
            <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
                    VIP Fleet Specification
                  </span>
                  <span className="text-xs font-bold bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30 px-3 py-1 rounded-full">
                    {hookah.hosesCount} {hookah.hosesCount === 1 ? 'Hose' : 'Hoses'}
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-white mt-2 gold-gradient-text">
                  {hookah.title}
                </h2>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                  {hookah.description}
                </p>
              </div>

              {/* Technical Specifications Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-white/5 p-4 rounded-2xl border border-white/10">
                <div>
                  <span className="text-gray-500 block">Height</span>
                  <span className="text-white font-medium">{hookah.heightCm} cm ({Math.round(hookah.heightCm / 2.54)} inches)</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Craft Material</span>
                  <span className="text-white font-medium truncate block">{hookah.material}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Minimum Duration</span>
                  <span className="text-white font-medium">{hookah.minimumHours || 2} Hours</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Hourly Rate</span>
                  <span className="text-[#d4af37] font-bold">${hookah.hourlyRate} / hr</span>
                </div>
              </div>

              {/* Included Premium Flavors */}
              <div>
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block mb-2">
                  Complimentary Flavor Profiles Included:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {hookah.flavorOptions?.map((flavor, idx) => (
                    <span key={idx} className="text-xs bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20 px-2.5 py-1 rounded-lg flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      {flavor}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hourly Rental Rate Estimator */}
              <div className="bg-[#07080b] p-4 rounded-2xl border border-gray-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Estimate Rental for:</span>
                  <div className="flex gap-1.5">
                    {[2, 3, 4, 6, 8].map((hrs) => (
                      <button
                        key={hrs}
                        onClick={() => setCalcHours(hrs)}
                        className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                          calcHours === hrs
                            ? 'bg-[#d4af37] text-[#07080b]'
                            : 'bg-white/5 text-gray-400 hover:text-white'
                        }`}
                      >
                        {hrs}h
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-800 pt-2 text-sm">
                  <span className="text-gray-300 font-medium">Estimated Rental Cost:</span>
                  <span className="text-xl font-black text-[#d4af37]">
                    ${hookah.hourlyRate * calcHours}
                  </span>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={handleBookNow}
                className="w-full amber-gradient-btn py-3.5 rounded-2xl text-sm font-bold uppercase tracking-wider shadow-xl shadow-[#d4af37]/20 flex items-center justify-center gap-2"
              >
                <span>Reserve This Hookah Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default HookahDetailModal;
