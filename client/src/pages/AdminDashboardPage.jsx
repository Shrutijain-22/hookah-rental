import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  LogOut,
  Calendar,
  Flame,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Edit,
  Trash2,
  Search,
  Eye,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  Shield,
  Layers,
} from 'lucide-react';

const AdminDashboardPage = () => {
  const { token, logout, admin } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' | 'inventory'

  // Stats state
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    estimatedRevenue: 0,
    totalFleetCount: 0,
  });

  // Bookings state
  const [bookings, setBookings] = useState([]);
  const [bookingFilterStatus, setBookingFilterStatus] = useState('');
  const [bookingSearch, setBookingSearch] = useState('');
  const [selectedBookingModal, setSelectedBookingModal] = useState(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');

  // Fleet state
  const [fleet, setFleet] = useState([]);
  const [showAddHookahModal, setShowAddHookahModal] = useState(false);
  const [editingHookah, setEditingHookah] = useState(null);

  const [loading, setLoading] = useState(true);

  // New Hookah form state
  const [hookahForm, setHookahForm] = useState({
    title: '',
    tagline: '',
    description: '',
    hourlyRate: 65,
    hosesCount: 2,
    images: ['https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&w=1200&q=80'],
    videoUrl: '',
    heightCm: 70,
    material: 'Anodized Aluminum & Glass',
    flavorOptions: 'Double Apple, Mint, Blueberry Ice',
    eventSuitability: 'House parties, Birthdays, Weddings',
    isFeatured: false,
  });

  const headers = { Authorization: `Bearer ${token}` };

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/admin/stats', { headers });
      if (res.data.success) setStats(res.data.stats);
    } catch (err) {
      console.error('Fetch stats error:', err);
    }
  };

  const fetchBookings = async () => {
    try {
      const params = new URLSearchParams();
      if (bookingFilterStatus) params.append('status', bookingFilterStatus);
      if (bookingSearch) params.append('search', bookingSearch);

      const res = await axios.get(`/api/admin/bookings?${params.toString()}`, { headers });
      if (res.data.success) setBookings(res.data.data);
    } catch (err) {
      console.error('Fetch bookings error:', err);
    }
  };

  const fetchFleet = async () => {
    try {
      const res = await axios.get('/api/hookahs');
      if (res.data.success) setFleet(res.data.data);
    } catch (err) {
      console.error('Fetch fleet error:', err);
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([fetchStats(), fetchBookings(), fetchFleet()]);
    setLoading(false);
  };

  useEffect(() => {
    loadAllData();
  }, [bookingFilterStatus, bookingSearch]);

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      const res = await axios.patch(
        `/api/admin/bookings/${bookingId}/status`,
        { status: newStatus, adminNotes: adminNoteInput },
        { headers }
      );
      if (res.data.success) {
        if (selectedBookingModal) {
          setSelectedBookingModal(res.data.data);
        }
        await loadAllData();
      }
    } catch (err) {
      console.error('Status update error:', err);
    }
  };

  const handleSaveHookah = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...hookahForm,
        flavorOptions: typeof hookahForm.flavorOptions === 'string'
          ? hookahForm.flavorOptions.split(',').map((s) => s.trim())
          : hookahForm.flavorOptions,
        eventSuitability: typeof hookahForm.eventSuitability === 'string'
          ? hookahForm.eventSuitability.split(',').map((s) => s.trim())
          : hookahForm.eventSuitability,
        images: Array.isArray(hookahForm.images) ? hookahForm.images : [hookahForm.images],
      };

      if (editingHookah) {
        await axios.put(`/api/admin/hookahs/${editingHookah._id}`, payload, { headers });
      } else {
        await axios.post('/api/admin/hookahs', payload, { headers });
      }

      setShowAddHookahModal(false);
      setEditingHookah(null);
      await fetchFleet();
      await fetchStats();
    } catch (err) {
      console.error('Save hookah error:', err);
    }
  };

  const handleDeleteHookah = async (id) => {
    if (!window.confirm('Are you sure you want to delete this hookah entry?')) return;
    try {
      await axios.delete(`/api/admin/hookahs/${id}`, { headers });
      await fetchFleet();
      await fetchStats();
    } catch (err) {
      console.error('Delete hookah error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080b] text-gray-200 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-[#d4af37]/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#b8860b] flex items-center justify-center text-[#07080b] font-black text-xl shadow-lg">
              <Shield className="w-6 h-6 fill-current" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-bold">
                VIP Concierge Dashboard
              </span>
              <h1 className="text-2xl font-extrabold text-white gold-gradient-text">
                MASTER CONTROL CENTER
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAllData}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 transition-colors border border-white/10"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={logout}
              className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Analytics Key Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs font-semibold">Total Bookings</span>
              <Calendar className="w-4 h-4 text-[#d4af37]" />
            </div>
            <span className="text-2xl font-black text-white">{stats.totalBookings}</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-[#f59e0b]/30 space-y-2 bg-[#f59e0b]/5">
            <div className="flex items-center justify-between text-[#f59e0b]">
              <span className="text-xs font-semibold">Pending Requests</span>
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-2xl font-black text-[#f59e0b]">{stats.pendingBookings}</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 space-y-2 bg-emerald-500/5">
            <div className="flex items-center justify-between text-emerald-400">
              <span className="text-xs font-semibold">Confirmed Events</span>
              <CheckCircle className="w-4 h-4" />
            </div>
            <span className="text-2xl font-black text-emerald-400">{stats.confirmedBookings}</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs font-semibold">Est. Pipeline Revenue</span>
              <DollarSign className="w-4 h-4 text-[#d4af37]" />
            </div>
            <span className="text-2xl font-black text-[#d4af37]">${stats.estimatedRevenue}</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs font-semibold">Fleet Inventory</span>
              <Flame className="w-4 h-4 text-[#d4af37]" />
            </div>
            <span className="text-2xl font-black text-white">{stats.totalFleetCount}</span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-2">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'bookings'
                  ? 'border-[#d4af37] text-[#d4af37]'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Bookings Pipeline</span>
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'inventory'
                  ? 'border-[#d4af37] text-[#d4af37]'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>Hookah Inventory</span>
            </button>
          </div>

          {activeTab === 'inventory' && (
            <button
              onClick={() => {
                setEditingHookah(null);
                setHookahForm({
                  title: '',
                  tagline: '',
                  description: '',
                  hourlyRate: 65,
                  hosesCount: 2,
                  images: ['https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&w=1200&q=80'],
                  videoUrl: '',
                  heightCm: 70,
                  material: 'Anodized Aluminum & Glass',
                  flavorOptions: 'Double Apple, Mint, Blueberry Ice',
                  eventSuitability: 'House parties, Birthdays, Weddings',
                  isFeatured: false,
                });
                setShowAddHookahModal(true);
              }}
              className="amber-gradient-btn px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Hookah</span>
            </button>
          )}
        </div>

        {/* TAB 1: BOOKINGS PIPELINE */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            {/* Filter & Search Toolbar */}
            <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 border border-white/10">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search ref # or customer..."
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
                {['', 'Pending', 'Confirmed', 'Cancelled', 'Completed'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setBookingFilterStatus(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      bookingFilterStatus === st
                        ? 'bg-[#d4af37] text-[#07080b]'
                        : 'bg-white/5 text-gray-300 hover:text-white border border-white/10'
                    }`}
                  >
                    {st === '' ? 'All Bookings' : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Bookings Table */}
            <div className="glass-panel rounded-3xl overflow-hidden border border-white/10">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-black/60 text-gray-400 font-semibold uppercase tracking-wider border-b border-gray-800">
                    <tr>
                      <th className="p-4">Ref Code</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Event & Schedule</th>
                      <th className="p-4">Venue</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {bookings.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="p-8 text-center text-gray-500">
                          No bookings found matching current filters.
                        </td>
                      </tr>
                    ) : (
                      bookings.map((b) => (
                        <tr key={b._id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 font-mono font-bold text-[#d4af37]">
                            #{b.bookingReference}
                          </td>
                          <td className="p-4">
                            <span className="font-bold text-white block">{b.customer?.fullName}</span>
                            <span className="text-gray-400 text-[11px]">{b.customer?.phone}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-[#d4af37] font-semibold block">{b.eventDetails?.eventType}</span>
                            <span className="text-gray-300">
                              {new Date(b.eventDetails?.eventDate).toLocaleDateString()} @ {b.eventDetails?.startTime}
                            </span>
                          </td>
                          <td className="p-4 text-gray-300 max-w-[200px] truncate">
                            {b.eventDetails?.venueAddress}
                          </td>
                          <td className="p-4 font-bold text-white">${b.pricing?.estimatedTotal}</td>
                          <td className="p-4">
                            <span
                              className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                                b.status === 'Confirmed'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                  : b.status === 'Cancelled'
                                  ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                                  : b.status === 'Completed'
                                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                                  : 'bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/40'
                              }`}
                            >
                              {b.status}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => {
                                setSelectedBookingModal(b);
                                setAdminNoteInput(b.adminNotes || '');
                              }}
                              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-[#d4af37] hover:text-[#07080b] font-bold text-xs transition-colors"
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HOOKAH INVENTORY MANAGER */}
        {activeTab === 'inventory' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {fleet.map((item) => (
              <div key={item._id} className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4 relative group">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black">
                  <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md text-[#d4af37] text-xs font-bold">
                    ${item.hourlyRate} / hr
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-white text-base">{item.title}</h3>
                  <p className="text-xs text-[#d4af37] font-medium">{item.hosesCount} Hoses • {item.heightCm}cm</p>
                  <p className="text-xs text-gray-400 line-clamp-2 mt-1">{item.description}</p>
                </div>

                <div className="pt-2 border-t border-gray-800 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setEditingHookah(item);
                      setHookahForm({
                        title: item.title,
                        tagline: item.tagline || '',
                        description: item.description,
                        hourlyRate: item.hourlyRate,
                        hosesCount: item.hosesCount,
                        images: item.images,
                        videoUrl: item.videoUrl || '',
                        heightCm: item.heightCm || 70,
                        material: item.material || '',
                        flavorOptions: Array.isArray(item.flavorOptions) ? item.flavorOptions.join(', ') : item.flavorOptions,
                        eventSuitability: Array.isArray(item.eventSuitability) ? item.eventSuitability.join(', ') : item.eventSuitability,
                        isFeatured: item.isFeatured || false,
                      });
                      setShowAddHookahModal(true);
                    }}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Edit className="w-3.5 h-3.5 text-[#d4af37]" /> Edit
                  </button>

                  <button
                    onClick={() => handleDeleteHookah(item._id)}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* BOOKING DETAILS & STATUS UPDATE MODAL */}
        {selectedBookingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="glass-panel max-w-2xl w-full p-6 rounded-3xl border border-[#d4af37]/30 space-y-6 text-xs max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                <div>
                  <span className="text-gray-400">Manage Booking Status</span>
                  <h2 className="text-xl font-bold text-[#d4af37] font-mono">#{selectedBookingModal.bookingReference}</h2>
                </div>
                <button onClick={() => setSelectedBookingModal(null)} className="text-gray-400 hover:text-white text-lg font-bold">
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/50 p-3 rounded-xl">
                  <span className="text-gray-500 block font-semibold">Customer</span>
                  <span className="text-white font-bold block">{selectedBookingModal.customer?.fullName}</span>
                  <span className="text-gray-400 block">{selectedBookingModal.customer?.email}</span>
                  <span className="text-gray-400 block">{selectedBookingModal.customer?.phone}</span>
                </div>

                <div className="bg-black/50 p-3 rounded-xl">
                  <span className="text-gray-500 block font-semibold">Event Details</span>
                  <span className="text-[#d4af37] font-bold block">{selectedBookingModal.eventDetails?.eventType}</span>
                  <span className="text-gray-300 block">
                    {new Date(selectedBookingModal.eventDetails?.eventDate).toLocaleDateString()} @ {selectedBookingModal.eventDetails?.startTime}
                  </span>
                  <span className="text-gray-400 block">{selectedBookingModal.eventDetails?.durationHours} Hours Rental</span>
                </div>
              </div>

              <div className="bg-black/50 p-3 rounded-xl">
                <span className="text-gray-500 block font-semibold">Venue Address</span>
                <span className="text-white font-medium">{selectedBookingModal.eventDetails?.venueAddress}</span>
              </div>

              {selectedBookingModal.eventDetails?.specialNotes && (
                <div className="bg-black/50 p-3 rounded-xl">
                  <span className="text-gray-500 block font-semibold">Special Customer Notes</span>
                  <span className="text-gray-300">{selectedBookingModal.eventDetails?.specialNotes}</span>
                </div>
              )}

              {/* Admin Note Input */}
              <div>
                <label className="text-gray-400 block font-semibold mb-1">Admin Notes / Concierge Message</label>
                <textarea
                  rows="2"
                  value={adminNoteInput}
                  onChange={(e) => setAdminNoteInput(e.target.value)}
                  placeholder="Notes sent to customer in email update..."
                  className="w-full p-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              {/* Status Update Actions */}
              <div className="pt-4 border-t border-gray-800 space-y-3">
                <span className="text-gray-400 font-bold block">Update Status (Triggers Customer Email):</span>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => handleUpdateBookingStatus(selectedBookingModal._id, 'Confirmed')}
                    className="py-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 font-bold hover:text-[#07080b] transition-all"
                  >
                    ✓ Confirm Booking
                  </button>

                  <button
                    onClick={() => handleUpdateBookingStatus(selectedBookingModal._id, 'Cancelled')}
                    className="py-2.5 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500 font-bold hover:text-white transition-all"
                  >
                    ✕ Cancel Booking
                  </button>

                  <button
                    onClick={() => handleUpdateBookingStatus(selectedBookingModal._id, 'Completed')}
                    className="py-2.5 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500 font-bold hover:text-[#07080b] transition-all"
                  >
                    ★ Mark Completed
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ADD / EDIT HOOKAH INVENTORY MODAL */}
        {showAddHookahModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <form onSubmit={handleSaveHookah} className="glass-panel max-w-2xl w-full p-6 rounded-3xl border border-[#d4af37]/30 space-y-4 text-xs max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <h2 className="text-lg font-bold text-[#d4af37]">
                  {editingHookah ? 'Edit Hookah Specification' : 'Add New Luxury Hookah'}
                </h2>
                <button type="button" onClick={() => setShowAddHookahModal(false)} className="text-gray-400 hover:text-white text-lg font-bold">
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 block mb-1">Hookah Title *</label>
                  <input
                    type="text"
                    required
                    value={hookahForm.title}
                    onChange={(e) => setHookahForm({ ...hookahForm, title: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-black/50 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1">Tagline</label>
                  <input
                    type="text"
                    value={hookahForm.tagline}
                    onChange={(e) => setHookahForm({ ...hookahForm, tagline: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-black/50 border border-white/10 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-400 block mb-1">Description *</label>
                <textarea
                  rows="2"
                  required
                  value={hookahForm.description}
                  onChange={(e) => setHookahForm({ ...hookahForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-black/50 border border-white/10 text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-gray-400 block mb-1">Hourly Rate ($) *</label>
                  <input
                    type="number"
                    required
                    value={hookahForm.hourlyRate}
                    onChange={(e) => setHookahForm({ ...hookahForm, hourlyRate: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-black/50 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1">Hoses Count *</label>
                  <input
                    type="number"
                    required
                    value={hookahForm.hosesCount}
                    onChange={(e) => setHookahForm({ ...hookahForm, hosesCount: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-black/50 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1">Height (cm)</label>
                  <input
                    type="number"
                    value={hookahForm.heightCm}
                    onChange={(e) => setHookahForm({ ...hookahForm, heightCm: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-black/50 border border-white/10 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-400 block mb-1">Image URL *</label>
                <input
                  type="text"
                  required
                  value={Array.isArray(hookahForm.images) ? hookahForm.images[0] : hookahForm.images}
                  onChange={(e) => setHookahForm({ ...hookahForm, images: [e.target.value] })}
                  className="w-full p-2.5 rounded-xl bg-black/50 border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="text-gray-400 block mb-1">Video Preview URL (Optional)</label>
                <input
                  type="text"
                  value={hookahForm.videoUrl}
                  onChange={(e) => setHookahForm({ ...hookahForm, videoUrl: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-black/50 border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="text-gray-400 block mb-1">Craft Material</label>
                <input
                  type="text"
                  value={hookahForm.material}
                  onChange={(e) => setHookahForm({ ...hookahForm, material: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-black/50 border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="text-gray-400 block mb-1">Included Flavors (Comma separated)</label>
                <input
                  type="text"
                  value={hookahForm.flavorOptions}
                  onChange={(e) => setHookahForm({ ...hookahForm, flavorOptions: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-black/50 border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="text-gray-400 block mb-1">Event Suitability (Comma separated)</label>
                <input
                  type="text"
                  value={hookahForm.eventSuitability}
                  onChange={(e) => setHookahForm({ ...hookahForm, eventSuitability: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-black/50 border border-white/10 text-white"
                />
              </div>

              <div className="pt-3 border-t border-gray-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddHookahModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-gray-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="amber-gradient-btn px-6 py-2 rounded-xl font-bold uppercase"
                >
                  Save Listing
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
