import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('velvet_admin_token') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setAdmin(res.data.user);
        } else {
          logout();
        }
      } catch (err) {
        console.warn('Token validation failed, logging out');
        logout();
      } finally {
        setLoading(false);
      }
    };
    verifyToken();
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    if (res.data.success) {
      setToken(res.data.token);
      setAdmin(res.data.user);
      localStorage.setItem('velvet_admin_token', res.data.token);
      return res.data;
    }
  };

  const logout = () => {
    setToken('');
    setAdmin(null);
    localStorage.removeItem('velvet_admin_token');
  };

  return (
    <AuthContext.Provider value={{ admin, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
