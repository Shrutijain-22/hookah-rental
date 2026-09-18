import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, Mail, ArrowRight, Flame, KeyRound } from 'lucide-react';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setErrorMsg(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDefaults = () => {
    setEmail('admin@velvetsmoke.com');
    setPassword('admin123password');
  };

  return (
    <div className="min-h-screen bg-[#07080b] flex items-center justify-center p-4 pt-20">
      <div className="w-full max-w-md space-y-6">
        {/* Header Icon */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#d4af37] to-[#b8860b] flex items-center justify-center text-[#07080b] mx-auto shadow-2xl shadow-[#d4af37]/20">
            <Shield className="w-8 h-8 fill-current" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">
            Concierge Management Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white gold-gradient-text">
            ADMINISTRATOR ACCESS
          </h1>
        </div>

        {/* Login Form Card */}
        <div className="glass-panel p-8 rounded-3xl border border-[#d4af37]/30 space-y-6 shadow-2xl">
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/40 text-red-400 p-3.5 rounded-xl text-xs font-medium text-center">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 font-medium block mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="admin@velvetsmoke.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 font-medium block mb-1.5">
                Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full amber-gradient-btn py-3.5 rounded-xl text-xs uppercase tracking-wider font-bold shadow-lg shadow-[#d4af37]/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Verifying Token...</span>
              ) : (
                <>
                  <span>Sign In To Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Autofill helper */}
          <div className="pt-4 border-t border-gray-800 text-center space-y-2">
            <span className="text-[11px] text-gray-500 block">Default Admin Credentials</span>
            <button
              type="button"
              onClick={handleFillDefaults}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#d4af37]/20 border border-white/10 text-[11px] text-[#d4af37] font-semibold transition-all inline-flex items-center gap-1.5"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Autofill Admin Credentials</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
