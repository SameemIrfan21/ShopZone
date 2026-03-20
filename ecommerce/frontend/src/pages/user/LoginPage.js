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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', form);
      login(res.data.user, res.data.token);
      navigate(res.data.user.role === 'admin' ? '/admin/dashboard' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <h1>ShopZone</h1>
          <p>Get access to your Orders, Wishlist and Recommendations</p>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card fade-in">
          <h2>Login</h2>
          <p className="auth-sub">Welcome back! Please enter your details.</p>
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
              {loading ? 'Logging in...' : 'Login'}
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
