import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import './AdminPages.css';

const STATUS_COLORS = {
  Placed: 'badge-primary', Processing: 'badge-warning',
  Shipped: 'badge-info', Delivered: 'badge-success', Cancelled: 'badge-danger',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/admin/stats').then(r => setStats(r.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-header">
          <h1>Dashboard</h1>
          <p>Welcome back, Admin! Here's what's happening.</p>
        </div>

        {loading ? (
          <div className="loading-container"><div className="spinner"></div></div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card blue">
                <div className="stat-icon">📦</div>
                <div>
                  <div className="stat-value">{stats?.totalProducts || 0}</div>
                  <div className="stat-label">Total Products</div>
                </div>
                <Link to="/admin/products" className="stat-link">View →</Link>
              </div>
              <div className="stat-card green">
                <div className="stat-icon">🛒</div>
                <div>
                  <div className="stat-value">{stats?.totalOrders || 0}</div>
                  <div className="stat-label">Total Orders</div>
                </div>
                <Link to="/admin/orders" className="stat-link">View →</Link>
              </div>
              <div className="stat-card purple">
                <div className="stat-icon">👥</div>
                <div>
                  <div className="stat-value">{stats?.totalUsers || 0}</div>
                  <div className="stat-label">Customers</div>
                </div>
                <Link to="/admin/customers" className="stat-link">View →</Link>
              </div>
              <div className="stat-card orange">
                <div className="stat-icon">💰</div>
                <div>
                  <div className="stat-value">₹{stats?.totalRevenue?.toLocaleString() || 0}</div>
                  <div className="stat-label">Total Revenue</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
              <h2>Quick Actions</h2>
              <div className="quick-btns">
                <Link to="/admin/add-product" className="quick-btn">
                  <span>➕</span> Add New Product
                </Link>
                <Link to="/admin/orders" className="quick-btn">
                  <span>📋</span> Manage Orders
                </Link>
                <Link to="/admin/customers" className="quick-btn">
                  <span>👤</span> View Customers
                </Link>
                <Link to="/admin/products" className="quick-btn">
                  <span>🏪</span> Manage Products
                </Link>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="admin-table-section">
              <div className="table-header">
                <h2>Recent Orders</h2>
                <Link to="/admin/orders" className="view-all-link">View All →</Link>
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats?.recentOrders?.length === 0 && (
                      <tr><td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-light)', padding: '24px' }}>No orders yet</td></tr>
                    )}
                    {stats?.recentOrders?.map(order => (
                      <tr key={order._id}>
                        <td><strong>#{order._id?.slice(-6).toUpperCase()}</strong></td>
                        <td>{order.user?.name || 'Guest'}<br/><small>{order.user?.email}</small></td>
                        <td>{order.items?.length} item(s)</td>
                        <td><strong>₹{order.totalPrice?.toLocaleString()}</strong></td>
                        <td><span className={`badge ${STATUS_COLORS[order.orderStatus]}`}>{order.orderStatus}</span></td>
                        <td>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
