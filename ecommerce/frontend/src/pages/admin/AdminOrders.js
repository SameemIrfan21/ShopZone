import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminSidebar from '../../components/admin/AdminSidebar';
import './AdminPages.css';

const STATUSES = ['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const STATUS_COLORS = {
  Placed: 'badge-primary', Processing: 'badge-warning',
  Shipped: 'badge-info', Delivered: 'badge-success', Cancelled: 'badge-danger',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    axios.get('/api/orders').then(r => setOrders(r.data)).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (orderId, status) => {
    await axios.put(`/api/orders/${orderId}/status`, { orderStatus: status });
    setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: status } : o));
  };

  const filtered = filter === 'All' ? orders : orders.filter(o => o.orderStatus === filter);

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-header">
          <h1>🛒 Orders</h1>
          <p>{orders.length} total orders</p>
        </div>

        {/* Filter tabs */}
        <div className="filter-tabs">
          {['All', ...STATUSES].map(s => (
            <button key={s} className={`filter-tab ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
              {s}
              <span className="tab-count">
                {s === 'All' ? orders.length : orders.filter(o => o.orderStatus === s).length}
              </span>
            </button>
          ))}
        </div>

        <div className="admin-table-section">
          <div className="admin-table-wrap">
            {loading ? (
              <div className="loading-container"><div className="spinner"></div></div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Address</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr><td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-light)' }}>No orders found</td></tr>
                  )}
                  {filtered.map(order => (
                    <tr key={order._id}>
                      <td><strong>#{order._id?.slice(-6).toUpperCase()}</strong></td>
                      <td>
                        <strong>{order.user?.name || 'Guest'}</strong>
                        <small>{order.user?.email}</small>
                      </td>
                      <td>
                        {order.items?.slice(0, 2).map((item, i) => (
                          <div key={i} style={{ fontSize: '12px', marginBottom: '2px' }}>
                            • {item.name} ×{item.quantity}
                          </div>
                        ))}
                        {order.items?.length > 2 && <small>+{order.items.length - 2} more</small>}
                      </td>
                      <td><strong>₹{order.totalPrice?.toLocaleString()}</strong><br/><small>💵 COD</small></td>
                      <td>
                        <small>{order.shippingAddress?.fullName}<br/>{order.shippingAddress?.city}, {order.shippingAddress?.state}</small>
                      </td>
                      <td><small>{new Date(order.createdAt).toLocaleDateString('en-IN')}</small></td>
                      <td>
                        <select
                          className="status-select"
                          value={order.orderStatus}
                          onChange={e => updateStatus(order._id, e.target.value)}
                        >
                          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
