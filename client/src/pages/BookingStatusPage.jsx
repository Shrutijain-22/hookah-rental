import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, Calendar, Clock, MapPin, Search, CheckCircle, Clock3, XCircle, Flame, PhoneCall, ArrowRight } from 'lucide-react';

const BookingStatusPage = () => {
  const { reference } = useParams();
  const [searchRef, setSearchRef] = useState(reference || '');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(Boolean(reference));
  const [errorMsg, setErrorMsg] = useState('');

  const fetchStatus = async (refCode) => {
    if (!refCode) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await axios.get(`/api/bookings/reference/${refCode.trim()}`);
      if (res.data.success) {
        setBooking(res.data.data);
      }
    } catch (err) {
      console.error('Fetch booking status error:', err);
      setErrorMsg('No reservation found matching this reference code. Please verify your reference.');
      setBooking(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (reference) {
      fetchStatus(reference);
    }
  }, [reference]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchRef) {
      fetchStatus(searchRef);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080b] text-gray-200 pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Title */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">
            Reservation Verification
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white gold-gradient-text">
            TRACK YOUR BOOKING STATUS
          </h1>
          <p className="text-xs text-gray-400">
            Enter your booking reference code (e.g. HKH-2026-8942) to view live concierge status updates.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="glass-panel p-4 rounded-2xl flex gap-3 border border-[#d4af37]/20">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Enter Reference (e.g. HKH-2026-8942)"
              value={searchRef}
              onChange={(e) => setSearchRef(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-white/10 text-sm text-white placeholder-gray-500 uppercase font-mono tracking-wider focus:outline-none focus:border-[#d4af37]"
            />
          </div>
          <button
            type="submit"
            className="amber-gradient-btn px-6 py-3 rounded-xl text-xs uppercase font-bold tracking-wider"
          >
            Lookup
          </button>
        </form>

        {loading && (
          <div className="glass-panel p-12 rounded-3xl text-center space-y-4 border border-gray-800">
            <div className="w-10 h-10 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[#d4af37]">Retrieving Booking Details...</p>
          </div>
        )}

        {errorMsg && (
          <div className="glass-panel p-8 rounded-3xl text-center space-y-3 border border-red-500/30">
            <XCircle className="w-10 h-10 text-red-400 mx-auto" />
            <p className="text-sm text-red-400 font-medium">{errorMsg}</p>
          </div>
        )}

        {/* Booking Card Display */}
        {booking && (
          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border border-[#d4af37]/30">
            {/* Top Status Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-800">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-gray-400 block font-semibold">
                  Booking Reference Number
                </span>
                <span className="text-2xl font-black text-[#d4af37] font-mono tracking-wider">
                  #{booking.bookingReference}
                </span>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                {booking.status === 'Confirmed' ? (
                  <span className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 font-bold text-xs px-4 py-2 rounded-full flex items-center gap-1.5 shadow-lg shadow-emerald-500/10">
                    <CheckCircle className="w-4 h-4" /> RESERVATION CONFIRMED
                  </span>
                ) : booking.status === 'Cancelled' ? (
                  <span className="bg-red-500/10 border border-red-500/40 text-red-400 font-bold text-xs px-4 py-2 rounded-full flex items-center gap-1.5">
                    <XCircle className="w-4 h-4" /> RESERVATION CANCELLED
                  </span>
                ) : booking.status === 'Completed' ? (
                  <span className="bg-blue-500/10 border border-blue-500/40 text-blue-400 font-bold text-xs px-4 py-2 rounded-full flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" /> RENTAL COMPLETED
                  </span>
                ) : (
                  <span className="bg-[#f59e0b]/10 border border-[#f59e0b]/40 text-[#f59e0b] font-bold text-xs px-4 py-2 rounded-full flex items-center gap-1.5 shadow-lg shadow-[#f59e0b]/10 animate-pulse">
                    <Clock3 className="w-4 h-4" /> PENDING CONCIERGE REVIEW
                  </span>
                )}
              </div>
            </div>

            {/* Event Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div className="bg-black/40 p-4 rounded-2xl border border-white/5 space-y-2">
                <span className="text-gray-500 font-bold block uppercase tracking-wider">Customer Details</span>
                <p className="text-white font-semibold text-sm">{booking.customer.fullName}</p>
                <p className="text-gray-400">{booking.customer.email}</p>
                <p className="text-gray-400">{booking.customer.phone}</p>
              </div>

              <div className="bg-black/40 p-4 rounded-2xl border border-white/5 space-y-2">
                <span className="text-gray-500 font-bold block uppercase tracking-wider">Event Details</span>
                <p className="text-[#d4af37] font-semibold text-sm">{booking.eventDetails.eventType}</p>
                <p className="text-gray-300">
                  {new Date(booking.eventDetails.eventDate).toLocaleDateString()} @ {booking.eventDetails.startTime}
                </p>
                <p className="text-gray-400">{booking.eventDetails.durationHours} Hours Rental</p>
              </div>
            </div>

            <div className="bg-black/40 p-4 rounded-2xl border border-white/5 text-xs space-y-1">
              <span className="text-gray-500 font-bold block uppercase tracking-wider mb-1">Venue Address</span>
              <p className="text-white font-medium">{booking.eventDetails.venueAddress}</p>
            </div>

            {/* Items Requested */}
            <div>
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-2">
                Hookah Fleet Requested:
              </span>
              <div className="space-y-2">
                {booking.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                    <span className="text-white font-bold">{item.title}</span>
                    <span className="text-[#d4af37]">${item.hourlyRate} / hr</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Pricing Estimate */}
            <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 block">Total Estimated Charges</span>
                <span className="text-xs text-emerald-400">No payment required until delivery</span>
              </div>
              <span className="text-2xl font-black text-[#d4af37]">
                ${booking.pricing.estimatedTotal}
              </span>
            </div>

            {/* Concierge Contact Footer */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-800 text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4 text-[#d4af37]" /> Need to modify venue date or time? Contact +1 (800) 555-SMOKE
              </span>
              <Link to="/hookahs" className="text-[#d4af37] font-bold hover:underline flex items-center gap-1">
                Browse More Hookahs <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingStatusPage;
