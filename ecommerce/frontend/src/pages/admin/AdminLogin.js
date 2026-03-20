import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api';
import { useAuth } from '../../context/AuthContext';
import './AdminLogin.css';

export default function AdminLogin() {
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
      if (res.data.user.role !== 'admin') {
        setError('Access denied. Admin only.');
        return;
      }
      login(res.data.user, res.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card fade-in">
        <div className="admin-login-header">
          <div className="admin-login-icon">🛡️</div>
          <h1>ShopZone</h1>
          <p>Admin Panel</p>
        </div>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Admin Email</label>
            <input type="email" className="form-control" placeholder="admin@ecommerce.com"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" placeholder="Enter password"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button type="submit" className={`btn btn-primary btn-block btn-lg ${loading ? 'btn-disabled' : ''}`}>
            {loading ? 'Logging in...' : '🔐 Login as Admin'}
          </button>
        </form>
        <p className="admin-hint">Default: admin@ecommerce.com / admin123</p>
      </div>
    </div>
  );
}
