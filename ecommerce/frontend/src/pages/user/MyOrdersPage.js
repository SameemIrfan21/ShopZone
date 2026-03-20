import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api';
import './MyOrdersPage.css';

const STATUS_COLORS = {
  Placed: 'badge-primary',
  Processing: 'badge-warning',
  Shipped: 'badge-info',
  Delivered: 'badge-success',
  Cancelled: 'badge-danger',
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/orders/my').then(r => setOrders(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div className="myorders-page fade-in">
      <div className="myorders-container">
        <h2 className="myorders-title">📦 My Orders</h2>

        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No orders yet!</h3>
            <p>Start shopping to place your first order.</p>
            <Link to="/products" className="btn btn-primary btn-lg mt-2">Shop Now</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div className="order-card-item" key={order._id}>
                <div className="order-card-header">
                  <div>
                    <span className="order-id">Order #{order._id?.slice(-8).toUpperCase()}</span>
                    <span className="order-date">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <span className={`badge ${STATUS_COLORS[order.orderStatus] || 'badge-primary'}`}>
                    {order.orderStatus}
                  </span>
                </div>

                <div className="order-items-preview">
                  {order.items?.map((item, i) => (
                    <div className="order-item-row" key={i}>
                      <img src={item.image || 'https://via.placeholder.com/50'} alt={item.name}
                        onError={e => { e.target.src = 'https://via.placeholder.com/50'; }} />
                      <div className="order-item-details">
                        <p className="order-item-name">{item.name}</p>
                        <p className="order-item-meta">Qty: {item.quantity} × ₹{item.price?.toLocaleString()}</p>
                      </div>
                      <span className="order-item-subtotal">₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="order-card-footer">
                  <div className="order-address">
                    <span>📍 {order.shippingAddress?.fullName}, {order.shippingAddress?.city}, {order.shippingAddress?.state}</span>
                  </div>
                  <div className="order-total-row">
                    <span>💵 Cash on Delivery</span>
                    <strong>Total: ₹{order.totalPrice?.toLocaleString()}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
