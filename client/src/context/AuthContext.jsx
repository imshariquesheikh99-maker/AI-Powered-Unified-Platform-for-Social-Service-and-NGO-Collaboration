import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const DEMO_USERS = [
  { role: 'admin', label: '👑 Admin (Platform Overseer)', email: 'admin@sahayak.ai' },
  { role: 'ngo', label: '🏢 NGO (Asha Children Foundation - Verified)', email: 'ngo.asha@sahayak.ai' },
  { role: 'ngo_pending', label: '🏢 NGO (Seva Alliance - Pending Verification)', email: 'ngo.food@sahayak.ai' },
  { role: 'volunteer', label: '🤝 Volunteer (Sharique Raza - Tech & Education)', email: 'volunteer.arjun@sahayak.ai' },
  { role: 'donor', label: '💳 Donor (Rohit - Philanthropist)', email: 'donor.rohit@sahayak.ai' },
  { role: 'beneficiary', label: '🤲 Beneficiary (Ramesh - Seeking Aid)', email: 'beneficiary.ramesh@sahayak.ai' }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('sahayak_token') || null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      const data = await api.getMe();
      if (data.success) {
        setUser(data.user);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Auth verification error:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, [token]);

  const login = async (email, password) => {
    const data = await api.login(email, password);
    if (data.success) {
      localStorage.setItem('sahayak_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true, user: data.user };
    }
    return { success: false, message: data.message };
  };

  const register = async (userData) => {
    const data = await api.register(userData);
    if (data.success) {
      localStorage.setItem('sahayak_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true, user: data.user };
    }
    return { success: false, message: data.message };
  };

  const loginAsDemoRole = async (email) => {
    setLoading(true);
    const result = await login(email, 'password123');
    setLoading(false);
    return result;
  };

  const logout = () => {
    localStorage.removeItem('sahayak_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      loginAsDemoRole,
      logout,
      refreshUser: fetchCurrentUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
