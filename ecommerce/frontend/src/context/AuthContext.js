import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/api/auth/profile');
      setUser(res.data);
      fetchCartCount();
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const fetchCartCount = async () => {
    try {
      const res = await axios.get('/api/cart');
      setCartCount(res.data.length);
    } catch {}
  };

  const login = (userData, userToken) => {
    setToken(userToken);
    setUser(userData);
    localStorage.setItem('token', userToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
    fetchCartCount();
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setCartCount(0);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  return (
    <AuthContext.Provider value={{
      user, token, loading, cartCount, notification,
      login, logout, setCartCount, showNotification, fetchCartCount
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
