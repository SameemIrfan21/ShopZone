import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './OrderSuccessPage.css';

export default function OrderSuccessPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    axios.get(`/api/orders/${id}`).then(r => setOrder(r.data));
  }, [id]);

  return (
    <div className="success-page fade-in">
      <div className="success-card">
        <div className="success-icon">🎉</div>
        <h1>Order Placed Successfully!</h1>
        <p className="success-sub">Thank you for shopping with ShopZone! Your order has been confirmed.</p>

        {order && (
          <div className="order-details-box">
            <div className="order-id-row">
              <span>Order ID</span>
              <strong>#{order._id?.slice(-8).toUpperCase()}</strong>
            </div>
            <div className="order-id-row">
              <span>Payment</span>
              <strong>💵 Cash on Delivery</strong>
            </div>
            <div className="order-id-row">
              <span>Status</span>
              <span className="badge badge-success">{order.orderStatus}</span>
            </div>
            <div className="order-id-row">
              <span>Total Amount</span>
              <strong>₹{order.totalPrice?.toLocaleString()}</strong>
            </div>
            <div className="order-id-row">
              <span>Deliver To</span>
              <span>{order.shippingAddress?.fullName}, {order.shippingAddress?.city}</span>
            </div>
          </div>
        )}

        <div className="success-items">
          {order?.items?.map((item, i) => (
            <div key={i} className="success-item">
              <img src={item.image || 'https://via.placeholder.com/50'} alt={item.name}
                onError={e => { e.target.src = 'https://via.placeholder.com/50'; }} />
              <div>
                <p className="success-item-name">{item.name}</p>
                <p className="success-item-qty">Qty: {item.quantity} × ₹{item.price?.toLocaleString()}</p>
              </div>
              <span className="success-item-total">₹{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>

        <div className="success-track">
          <div className="track-step done">
            <span className="track-dot">✓</span>
            <div>
              <strong>Order Placed</strong>
              <p>We've received your order</p>
            </div>
          </div>
          <div className="track-line"></div>
          <div className="track-step">
            <span className="track-dot">📦</span>
            <div>
              <strong>Processing</strong>
              <p>Preparing your items</p>
            </div>
          </div>
          <div className="track-line"></div>
          <div className="track-step">
            <span className="track-dot">🚚</span>
            <div>
              <strong>Shipped</strong>
              <p>On the way to you</p>
            </div>
          </div>
          <div className="track-line"></div>
          <div className="track-step">
            <span className="track-dot">🏠</span>
            <div>
              <strong>Delivered</strong>
              <p>Enjoy your purchase!</p>
            </div>
          </div>
        </div>

        <div className="success-actions">
          <Link to="/my-orders" className="btn btn-primary btn-lg">View My Orders</Link>
          <Link to="/" className="btn btn-outline btn-lg">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
