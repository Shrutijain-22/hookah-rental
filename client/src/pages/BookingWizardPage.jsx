import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useBooking } from '../context/BookingContext';
import { Check, Flame, Calendar, Clock, MapPin, User, Mail, Phone, ArrowRight, ArrowLeft, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import CustomLuxuryCalendar from '../components/CustomLuxuryCalendar';

const BookingWizardPage = () => {
  const [step, setStep] = useState(1);
  const [hookahs, setHookahs] = useState([]);
  const [loadingHookahs, setLoadingHookahs] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [stepError, setStepError] = useState('');

  const { bookingCart, setBookingCart, selectHookahForBooking, removeFromCart, clearCart, eventData, setEventData } = useBooking();
  const navigate = useNavigate();

  const getTodayString = () => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const todayStr = getTodayString();

  const [customer, setCustomer] = useState({
    fullName: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    const fetchHookahs = async () => {
      try {
        const res = await axios.get('/api/hookahs');
        if (res.data.success) {
          setHookahs(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load hookahs:', err);
      } finally {
        setLoadingHookahs(false);
      }
    };
    fetchHookahs();
  }, []);

  const toggleCartHookah = (hookah) => {
    const exists = bookingCart.find((item) => item._id === hookah._id);
    if (exists) {
      removeFromCart(hookah._id);
    } else {
      setBookingCart([...bookingCart, { ...hookah, quantity: 1 }]);
    }
  };

  // Step Validations
  const handleProceedStep1 = () => {
    setStepError('');
    if (bookingCart.length === 0) {
      setStepError('Please select at least one hookah setup to proceed.');
      return;
    }
    setStep(2);
  };

  const handleProceedStep2 = () => {
    setStepError('');
    if (!eventData.eventDate) {
      setStepError('Please select an upcoming date from the calendar.');
      return;
    }
    if (eventData.eventDate < todayStr) {
      setStepError('Selected date cannot be in the past. Please select today or a future date.');
      return;
    }
    setStep(3);
  };

  const handleProceedStep3 = () => {
    setStepError('');
    if (!eventData.venueAddress || !eventData.venueAddress.trim()) {
      setStepError('Please enter your full delivery venue address to proceed.');
      return;
    }
    setStep(4);
  };

  // Calculations
  const hourlySubtotal = bookingCart.reduce(
    (sum, item) => sum + (item.hourlyRate || 50) * (item.quantity || 1),
    0
  );
  const duration = Number(eventData.durationHours) || 2;
  const estimatedTotal = hourlySubtotal * duration;

  const handleSubmitBooking = async () => {
    setErrorMsg('');
    if (!customer.fullName || !customer.fullName.trim() || !customer.email || !customer.email.trim() || !customer.phone || !customer.phone.trim()) {
      setErrorMsg('Please complete all contact details (Full Name, Email, Phone).');
      return;
    }
    if (!eventData.eventDate || !eventData.venueAddress || !eventData.venueAddress.trim()) {
      setErrorMsg('Please complete the event date and venue address.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        customer,
        eventDetails: eventData,
        items: bookingCart,
      };

      const res = await axios.post('/api/bookings', payload);

      if (res.data.success) {
        const bookingRef = res.data.data.bookingReference;
        clearCart();
        navigate(`/booking-confirmation/${bookingRef}`);
      }
    } catch (err) {
      console.error('Booking submission error:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to submit booking request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080b] text-gray-200 pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Step Indicator Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">
            VIP Reservation Concierge
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white gold-gradient-text">
            BOOK YOUR HOOKAH EXPERIENCE
          </h1>
          <p className="text-xs text-gray-400">
            No upfront online payment required. Pay upon delivery confirmation.
          </p>
        </div>

        {/* Wizard Progress Bar */}
        <div className="glass-panel p-4 rounded-2xl border border-[#d4af37]/20 flex items-center justify-between gap-2">
          {[
            { num: 1, label: 'Select Fleet' },
            { num: 2, label: 'Date & Time' },
            { num: 3, label: 'Venue Details' },
            { num: 4, label: 'Confirm Request' },
          ].map((s) => (
            <div
              key={s.num}
              onClick={() => {
                setStepError('');
                if (s.num < step) setStep(s.num);
              }}
              className={`flex-1 flex items-center gap-2 cursor-pointer transition-all ${
                step === s.num
                  ? 'text-[#d4af37] font-bold'
                  : step > s.num
                  ? 'text-emerald-400'
                  : 'text-gray-500'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-extrabold transition-all ${
                  step === s.num
                    ? 'bg-[#d4af37] text-[#07080b]'
                    : step > s.num
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-white/5 border border-white/10'
                }`}
              >
                {step > s.num ? <Check className="w-4 h-4" /> : s.num}
              </div>
              <span className="hidden sm:inline text-xs">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Inline Step Error Banner */}
        {stepError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-500/10 border border-amber-500/40 text-amber-300 p-4 rounded-2xl text-xs font-semibold flex items-center gap-3 shadow-lg"
          >
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            <span>{stepError}</span>
          </motion.div>
        )}

        {/* Step 1: Select Hookah */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Step 1: Choose Your Hookah Setup(s)</h2>
              <span className="text-xs text-[#d4af37]">{bookingCart.length} Selected</span>
            </div>

            {loadingHookahs ? (
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-28 rounded-2xl bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {hookahs.map((hookah) => {
                  const isSelected = bookingCart.some((item) => item._id === hookah._id);
                  return (
                    <div
                      key={hookah._id}
                      onClick={() => {
                        setStepError('');
                        toggleCartHookah(hookah);
                      }}
                      className={`glass-panel p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-between gap-4 ${
                        isSelected
                          ? 'border-[#d4af37] bg-[#d4af37]/10'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <img
                          src={hookah.images[0]}
                          alt={hookah.title}
                          className="w-20 h-20 rounded-xl object-cover border border-white/10"
                        />
                        <div>
                          <h3 className="font-bold text-white text-sm">{hookah.title}</h3>
                          <span className="text-xs text-gray-400 block">{hookah.material}</span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-[#d4af37] font-semibold">
                              {hookah.hosesCount} {hookah.hosesCount === 1 ? 'Hose' : 'Hoses'}
                            </span>
                            <span className="text-xs text-gray-400">• ${hookah.hourlyRate} / hr</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                        <button
                          type="button"
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            isSelected
                              ? 'bg-[#d4af37] text-[#07080b]'
                              : 'bg-white/10 text-gray-300 hover:text-white'
                          }`}
                        >
                          {isSelected ? '✓ Selected (Click to Remove)' : '+ Select Hookah'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="pt-4 flex justify-end">
              <button
                onClick={handleProceedStep1}
                className="amber-gradient-btn px-8 py-3.5 rounded-full text-xs uppercase tracking-wider font-bold flex items-center gap-2"
              >
                <span>Continue to Date & Time</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Date, Time & Duration */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <h2 className="text-xl font-bold text-white">Step 2: Select Date, Start Time & Duration</h2>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Side: Interactive Luxury Calendar */}
              <div className="lg:col-span-7">
                <CustomLuxuryCalendar
                  selectedDate={eventData.eventDate}
                  onSelectDate={(dateStr) => {
                    setStepError('');
                    setEventData({ ...eventData, eventDate: dateStr });
                  }}
                />
              </div>

              {/* Right Side: Start Time & Duration Controls */}
              <div className="lg:col-span-5 space-y-6">
                <div className="glass-panel p-6 rounded-3xl space-y-6 border border-[#d4af37]/20 bg-[#0f1118]/90">
                  {/* Start Time Picker */}
                  <div>
                    <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#d4af37]" /> Start Time *
                    </label>
                    <select
                      value={eventData.startTime}
                      onChange={(e) => setEventData({ ...eventData, startTime: e.target.value })}
                      className="w-full p-3.5 rounded-xl bg-black/60 border border-white/20 text-sm text-white focus:outline-none focus:border-[#d4af37]"
                    >
                      {[
                        '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00 (Midnight)'
                      ].map((t) => (
                        <option key={t} value={t} className="bg-[#10121a]">
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Duration Slider */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                        Rental Duration (Hours)
                      </label>
                      <span className="text-sm font-extrabold text-[#d4af37]">{eventData.durationHours} Hours</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="12"
                      step="1"
                      value={eventData.durationHours}
                      onChange={(e) => setEventData({ ...eventData, durationHours: Number(e.target.value) })}
                      className="w-full accent-[#d4af37] cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                      <span>2h Min</span>
                      <span>4h</span>
                      <span>6h</span>
                      <span>12h Max</span>
                    </div>
                  </div>

                  {/* Pricing Estimate Box */}
                  <div className="bg-black/50 p-4 rounded-2xl border border-gray-800 flex items-center justify-between text-sm">
                    <div>
                      <span className="text-gray-400 block text-xs">Hourly Subtotal ({bookingCart.length} hookah setup)</span>
                      <span className="text-white font-bold">${hourlySubtotal} / hr</span>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-400 block text-xs">Estimated Total ({eventData.durationHours} hrs)</span>
                      <span className="text-2xl font-black text-[#d4af37]">${estimatedTotal}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => {
                  setStepError('');
                  setStep(1);
                }}
                className="px-6 py-3 rounded-full border border-white/20 text-xs font-bold text-gray-300 flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              <button
                onClick={handleProceedStep2}
                className="amber-gradient-btn px-8 py-3.5 rounded-full text-xs uppercase tracking-wider font-bold flex items-center gap-2 shadow-xl shadow-[#d4af37]/20"
              >
                <span>Continue to Venue Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Event Type & Venue Info */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <h2 className="text-xl font-bold text-white">Step 3: Event & Delivery Venue Information</h2>

            <div className="glass-panel p-6 rounded-3xl space-y-6 border border-[#d4af37]/20">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-2">
                    Event Type
                  </label>
                  <select
                    value={eventData.eventType}
                    onChange={(e) => setEventData({ ...eventData, eventType: e.target.value })}
                    className="w-full p-3.5 rounded-xl bg-black/60 border border-white/20 text-sm text-white focus:outline-none focus:border-[#d4af37]"
                  >
                    {[
                      'House party',
                      'Birthday',
                      'Wedding',
                      'Private event',
                      'College event',
                      'Corporate event',
                      'Other',
                    ].map((type) => (
                      <option key={type} value={type} className="bg-[#10121a]">
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-2">
                    Estimated Guest Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={eventData.guestCount}
                    onChange={(e) => setEventData({ ...eventData, guestCount: Number(e.target.value) })}
                    className="w-full p-3.5 rounded-xl bg-black/60 border border-white/20 text-sm text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#d4af37]" /> Full Delivery Venue Address *
                  </span>
                  <span className="text-[10px] text-gray-400 font-normal">Street, Suite/Apartment, City</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 742 Evergreen Terrace, Penthouse Suite 400, Downtown"
                  value={eventData.venueAddress}
                  onChange={(e) => {
                    setStepError('');
                    setEventData({ ...eventData, venueAddress: e.target.value });
                  }}
                  className={`w-full p-3.5 rounded-xl bg-black/60 border text-sm text-white focus:outline-none transition-colors ${
                    stepError && (!eventData.venueAddress || !eventData.venueAddress.trim())
                      ? 'border-amber-500 bg-amber-500/10'
                      : 'border-white/20 focus:border-[#d4af37]'
                  }`}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-2">
                  Special Notes or Flavor Preferences (Optional)
                </label>
                <textarea
                  rows="3"
                  placeholder="Mention favorite flavor mixes, access codes, or setup preferences..."
                  value={eventData.specialNotes}
                  onChange={(e) => setEventData({ ...eventData, specialNotes: e.target.value })}
                  className="w-full p-3.5 rounded-xl bg-black/60 border border-white/20 text-sm text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => {
                  setStepError('');
                  setStep(2);
                }}
                className="px-6 py-3 rounded-full border border-white/20 text-xs font-bold text-gray-300 flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              <button
                onClick={handleProceedStep3}
                className="amber-gradient-btn px-8 py-3.5 rounded-full text-xs uppercase tracking-wider font-bold flex items-center gap-2 shadow-xl shadow-[#d4af37]/20"
              >
                <span>Continue to Summary</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Contact & Review */}
        {step === 4 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <h2 className="text-xl font-bold text-white">Step 4: Contact Information & Order Review</h2>

            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/40 text-red-400 p-4 rounded-xl text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Info Form */}
              <div className="glass-panel p-6 rounded-3xl space-y-4 border border-[#d4af37]/20">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#d4af37]">
                  Customer Contact Details
                </h3>

                <div>
                  <label className="text-xs text-gray-400 block mb-1">Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alexander Wright"
                      value={customer.fullName}
                      onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-black/60 border border-white/20 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-400 block mb-1">Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. alex@example.com"
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-black/60 border border-white/20 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-400 block mb-1">Phone Number *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +1 (555) 000-0000"
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-black/60 border border-white/20 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>
              </div>

              {/* Order Summary Box */}
              <div className="glass-panel p-6 rounded-3xl space-y-4 border border-[#d4af37]/20 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#d4af37]">
                    Reservation Summary
                  </h3>

                  <div className="mt-4 space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-gray-800">
                      <span className="text-gray-400">Event Type:</span>
                      <span className="text-white font-medium">{eventData.eventType}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-800">
                      <span className="text-gray-400">Date & Time:</span>
                      <span className="text-white font-medium">{eventData.eventDate} @ {eventData.startTime}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-800">
                      <span className="text-gray-400">Duration:</span>
                      <span className="text-white font-medium">{eventData.durationHours} Hours</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-800">
                      <span className="text-gray-400">Venue Address:</span>
                      <span className="text-white font-medium truncate max-w-[180px]">{eventData.venueAddress}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-200">Estimated Total:</span>
                    <span className="text-2xl font-black text-[#d4af37]">${estimatedTotal}</span>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    disabled={submitting}
                    onClick={handleSubmitBooking}
                    className="w-full amber-gradient-btn py-4 rounded-2xl text-xs uppercase tracking-wider font-bold shadow-xl shadow-[#d4af37]/20 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <span>Dispatching Booking Request...</span>
                    ) : (
                      <>
                        <span>Submit VIP Booking Request</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-start">
              <button
                onClick={() => {
                  setStepError('');
                  setStep(3);
                }}
                className="px-6 py-3 rounded-full border border-white/20 text-xs font-bold text-gray-300 flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BookingWizardPage;
