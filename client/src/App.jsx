import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import FleetPage from './pages/FleetPage';
import BookingWizardPage from './pages/BookingWizardPage';
import BookingStatusPage from './pages/BookingStatusPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <Router>
          <div className="min-h-screen bg-[#07080b] flex flex-col justify-between selection:bg-[#d4af37] selection:text-[#07080b]">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/hookahs" element={<FleetPage />} />
                <Route path="/book" element={<BookingWizardPage />} />
                <Route path="/status" element={<BookingStatusPage />} />
                <Route path="/booking-confirmation/:reference" element={<BookingStatusPage />} />
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute>
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </BookingProvider>
    </AuthProvider>
  );
}

export default App;
