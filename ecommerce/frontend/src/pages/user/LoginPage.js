import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../api';
import { useAuth } from '../../context/AuthContext';
import './AuthPages.css';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const getFriendlyError = (err) => {
    const msg = err.response?.data?.message || '';
    if (msg.includes('Invalid credentials')) return '❌ Wrong email or password. Please try again.';
    if (msg.includes('buffering timed out') || err.code === 'ECONNABORTED' || !err.response)
      return '⚠️ Server is starting up, please wait a moment and try again.';
    return msg || '⚠️ Something went wrong. Please try again.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', form);
      login(res.data.user, res.data.token);
      navigate(res.data.user.role === 'admin' ? '/admin/dashboard' : '/');
    } catch (err) {
      setError(getFriendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <span className="auth-brand-logo">🛍️</span>
          <h1>ShopZone</h1>
          <p>India's most loved shopping destination</p>
          <div className="auth-brand-features">
            <div className="auth-feature-item">
              <span className="auth-feature-icon">🚀</span>
              <span>Fast & secure checkout</span>
            </div>
            <div className="auth-feature-item">
              <span className="auth-feature-icon">📦</span>
              <span>Track orders in real-time</span>
            </div>
            <div className="auth-feature-item">
              <span className="auth-feature-icon">💰</span>
              <span>Exclusive deals & offers</span>
            </div>
          </div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card fade-in">
          <h2>Welcome back 👋</h2>
          <p className="auth-sub">Login to access your ShopZone account</p>
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email" className="form-control" placeholder="Enter your email"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password" className="form-control" placeholder="Enter your password"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required
              />
            </div>
            <button type="submit" className={`btn btn-secondary btn-block btn-lg ${loading ? 'btn-disabled' : ''}`}>
              {loading ? '⏳ Logging in...' : '🔐 Login'}
            </button>
          </form>
          <div className="auth-divider"><span>OR</span></div>
          <p className="auth-switch">
            New to ShopZone? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
