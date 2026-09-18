import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Sparkles, SlidersHorizontal, Flame } from 'lucide-react';
import HookahCard from '../components/HookahCard';
import HookahDetailModal from '../components/HookahDetailModal';

const FleetPage = () => {
  const [hookahs, setHookahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeModalHookah, setActiveModalHookah] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const eventFilter = searchParams.get('eventType') || '';
  const [selectedHoses, setSelectedHoses] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchHookahs = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (eventFilter) params.append('eventType', eventFilter);
        if (selectedHoses) params.append('hoses', selectedHoses);
        if (searchQuery) params.append('search', searchQuery);

        const res = await axios.get(`/api/hookahs?${params.toString()}`);
        if (res.data.success) {
          setHookahs(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch hookahs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHookahs();
  }, [eventFilter, selectedHoses, searchQuery]);

  return (
    <div className="min-h-screen bg-[#07080b] text-gray-200 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">
            VIP Equipment Fleet
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white gold-gradient-text">
            LUXURY HOOKAH COLLECTION
          </h1>
          <p className="text-sm text-gray-400">
            Handcrafted glass, gold electroplated brass, aerospace aluminum, and real carbon fiber hookahs equipped for events of any size.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 border border-[#d4af37]/20">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search hookahs or specs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <span className="text-xs text-gray-400 font-medium flex items-center gap-1 mr-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#d4af37]" /> Hoses:
            </span>
            {['', '1', '2', '4'].map((h) => (
              <button
                key={h}
                onClick={() => setSelectedHoses(h)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedHoses === h
                    ? 'bg-[#d4af37] text-[#07080b]'
                    : 'bg-white/5 border border-white/10 text-gray-300 hover:text-white'
                }`}
              >
                {h === '' ? 'All Fleet' : `${h} ${h === '1' ? 'Hose' : 'Hoses'}`}
              </button>
            ))}
          </div>

          {/* Event Filter Tag clear */}
          {eventFilter && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-400">Event:</span>
              <span className="bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40 px-3 py-1 rounded-full font-bold flex items-center gap-1">
                {eventFilter}
                <button
                  onClick={() => setSearchParams({})}
                  className="ml-1 hover:text-white"
                >
                  ✕
                </button>
              </span>
            </div>
          )}
        </div>

        {/* Fleet Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-96 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : hookahs.length === 0 ? (
          <div className="glass-panel rounded-3xl p-16 text-center space-y-4 border border-gray-800">
            <Flame className="w-12 h-12 text-[#d4af37] mx-auto opacity-50" />
            <h3 className="text-xl font-bold text-white">No Hookahs Found</h3>
            <p className="text-xs text-gray-400">
              Try adjusting your search criteria or hose filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedHoses('');
                setSearchParams({});
              }}
              className="amber-gradient-btn px-6 py-2.5 rounded-full text-xs font-bold"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {hookahs.map((hookah) => (
              <HookahCard
                key={hookah._id}
                hookah={hookah}
                onQuickView={setActiveModalHookah}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail Specs Modal */}
      {activeModalHookah && (
        <HookahDetailModal
          hookah={activeModalHookah}
          onClose={() => setActiveModalHookah(null)}
        />
      )}
    </div>
  );
};

export default FleetPage;
