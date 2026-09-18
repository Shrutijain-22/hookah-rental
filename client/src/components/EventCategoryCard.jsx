import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowUpRight, Flame, PartyPopper, HeartHandshake, Wine, GraduationCap, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const iconMap = {
  'House parties': Wine,
  'Birthdays': PartyPopper,
  'Weddings': HeartHandshake,
  'Private events': Flame,
  'College events': GraduationCap,
  'Corporate events': Briefcase,
};

const EventCategoryCard = ({ title, tagline, description, image }) => {
  const navigate = useNavigate();
  const Icon = iconMap[title] || Sparkles;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onClick={() => navigate(`/hookahs?eventType=${encodeURIComponent(title)}`)}
      className="group relative h-80 rounded-3xl overflow-hidden glass-panel glass-panel-hover cursor-pointer flex flex-col justify-end p-6 border border-[#d4af37]/20"
    >
      {/* Background Image */}
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-55"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#07080b] via-[#07080b]/70 to-transparent" />

      {/* Top Icon Badge */}
      <div className="absolute top-5 left-5 w-12 h-12 rounded-2xl bg-black/60 backdrop-blur-md border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] group-hover:bg-[#d4af37] group-hover:text-[#07080b] transition-all">
        <Icon className="w-6 h-6" />
      </div>

      {/* Top Right Arrow */}
      <div className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-[#d4af37] group-hover:text-[#07080b] transition-all">
        <ArrowUpRight className="w-4 h-4" />
      </div>

      {/* Content */}
      <div className="relative z-10 space-y-2">
        <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-bold block">
          Hookah Rental For {title}
        </span>
        <h3 className="text-xl font-bold text-white group-hover:text-[#d4af37] transition-colors">
          {title}
        </h3>
        <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
          {description}
        </p>
        <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-[#d4af37]">
          <span>View Hookahs For This Event</span>
          <span className="w-1 h-1 rounded-full bg-[#d4af37]" />
        </div>
      </div>
    </motion.div>
  );
};

export default EventCategoryCard;
