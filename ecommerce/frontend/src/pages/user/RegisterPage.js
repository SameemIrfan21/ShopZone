import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../api';
import { useAuth } from '../../context/AuthContext';
import './AuthPages.css';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', address: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const getFriendlyError = (err) => {
    const msg = err.response?.data?.message || '';
    if (msg.includes('already registered')) return '⚠️ This email is already registered. Try logging in!';
    if (msg.includes('buffering timed out') || !err.response)
      return '⚠️ Server is starting up, please wait a moment and try again.';
    return msg || '⚠️ Something went wrong. Please try again.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await axios.post('/api/auth/register', form);
      login(res.data.user, res.data.token);
      navigate('/');
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
          <p>Join millions of happy shoppers today</p>
          <div className="auth-brand-features">
            <div className="auth-feature-item">
              <span className="auth-feature-icon">✅</span>
              <span>Free & easy registration</span>
            </div>
            <div className="auth-feature-item">
              <span className="auth-feature-icon">🎁</span>
              <span>Exclusive member deals</span>
            </div>
            <div className="auth-feature-item">
              <span className="auth-feature-icon">🔒</span>
              <span>Your data is safe with us</span>
            </div>
          </div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card fade-in">
          <h2>Create Account ✨</h2>
          <p className="auth-sub">Join ShopZone — it's free!</p>
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-control" placeholder="Enter your full name"
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-control" placeholder="Enter your email"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" placeholder="Create a password (min 6 chars)"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input type="tel" className="form-control" placeholder="Enter your phone number"
                value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Address</label>
              <textarea className="form-control" placeholder="Enter your address" rows="2"
                value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
            </div>
            <button type="submit" className={`btn btn-secondary btn-block btn-lg ${loading ? 'btn-disabled' : ''}`}>
              {loading ? '⏳ Creating account...' : '🚀 Create Account'}
            </button>
          </form>
          <div className="auth-divider"><span>OR</span></div>
          <p className="auth-switch">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
