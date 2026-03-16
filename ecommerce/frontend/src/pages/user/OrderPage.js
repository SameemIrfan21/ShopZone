import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './OrderPage.css';

export default function OrderPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, showNotification, setCartCount } = useAuth();
  const { cart = [], total = 0, delivery = 0, discount = 0 } = location.state || {};

  const [step, setStep] = useState(1); // 1=address, 2=review, 3=payment
  const [address, setAddress] = useState({
    fullName: user?.name || '',
    address: user?.address || '',
    city: '',
    state: '',
    pincode: '',
    phone: user?.phone || ''
  });
  const [loading, setLoading] = useState(false);

  if (!cart.length) {
    navigate('/cart');
    return null;
  }

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const items = cart.map(item => ({
        product: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.images?.[0] || ''
      }));
      const res = await axios.post('/api/orders', {
        items,
        shippingAddress: address,
        totalPrice: total,
        deliveryCharge: delivery,
        discount
      });
      setCartCount(0);
      showNotification('🎉 Order placed successfully!');
      navigate(`/order-success/${res.data._id}`);
    } catch (err) {
      showNotification('Failed to place order', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-page fade-in">
      <div className="order-container">
        {/* Steps */}
        <div className="order-steps">
          {['Delivery Address', 'Order Review', 'Payment'].map((s, i) => (
            <div key={i} className={`step ${step > i + 1 ? 'done' : step === i + 1 ? 'active' : ''}`}>
              <div className="step-num">{step > i + 1 ? '✓' : i + 1}</div>
              <span>{s}</span>
            </div>
          ))}
        </div>

        <div className="order-body">
          {/* STEP 1: Address */}
          {step === 1 && (
            <div className="order-card fade-in">
              <h2>📍 Delivery Address</h2>
              <div className="address-grid">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input className="form-control" value={address.fullName}
                    onChange={e => setAddress({ ...address, fullName: e.target.value })} placeholder="Enter full name" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input className="form-control" value={address.phone}
                    onChange={e => setAddress({ ...address, phone: e.target.value })} placeholder="10-digit mobile number" required />
                </div>
                <div className="form-group full">
                  <label className="form-label">Address (House No, Building, Street, Area) *</label>
                  <textarea className="form-control" value={address.address} rows="2"
                    onChange={e => setAddress({ ...address, address: e.target.value })} placeholder="Enter complete address" required />
                </div>
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input className="form-control" value={address.city}
                    onChange={e => setAddress({ ...address, city: e.target.value })} placeholder="Enter city" required />
                </div>
                <div className="form-group">
                  <label className="form-label">State *</label>
                  <input className="form-control" value={address.state}
                    onChange={e => setAddress({ ...address, state: e.target.value })} placeholder="Enter state" required />
                </div>
                <div className="form-group">
                  <label className="form-label">PIN Code *</label>
                  <input className="form-control" value={address.pincode}
                    onChange={e => setAddress({ ...address, pincode: e.target.value })} placeholder="6-digit PIN" required />
                </div>
              </div>
              <button className="next-btn"
                disabled={!address.fullName || !address.phone || !address.address || !address.city || !address.state || !address.pincode}
                onClick={() => setStep(2)}>
                Continue to Review →
              </button>
            </div>
          )}

          {/* STEP 2: Review */}
          {step === 2 && (
            <div className="order-card fade-in">
              <h2>📦 Review Your Order</h2>
              <div className="review-address">
                <strong>📍 Delivering to:</strong>
                <p>{address.fullName}, {address.address}, {address.city}, {address.state} - {address.pincode}</p>
                <p>📞 {address.phone}</p>
                <button className="edit-link" onClick={() => setStep(1)}>Change</button>
              </div>
              <div className="review-items">
                {cart.map(item => item.product && (
                  <div className="review-item" key={item._id}>
                    <img src={item.product.images?.[0] || 'https://via.placeholder.com/60'} alt={item.product.name}
                      onError={e => { e.target.src = 'https://via.placeholder.com/60'; }} />
                    <div className="review-item-info">
                      <p className="review-item-name">{item.product.name}</p>
                      <p className="review-item-qty">Qty: {item.quantity}</p>
                    </div>
                    <div className="review-item-price">₹{(item.product.price * item.quantity).toLocaleString()}</div>
                  </div>
                ))}
              </div>
              <button className="next-btn" onClick={() => setStep(3)}>Continue to Payment →</button>
            </div>
          )}

          {/* STEP 3: Payment */}
          {step === 3 && (
            <div className="order-card fade-in">
              <h2>💳 Payment</h2>
              <div className="payment-options">
                <label className="payment-option selected">
                  <input type="radio" checked readOnly />
                  <div className="payment-icon">💵</div>
                  <div>
                    <strong>Cash on Delivery</strong>
                    <p>Pay when your order arrives</p>
                  </div>
                  <span className="payment-check">✓</span>
                </label>
                <div className="payment-note">
                  ℹ️ Only Cash on Delivery is available at this time.
                </div>
              </div>
              <div className="final-summary">
                <div className="summary-line">
                  <span>Items Total</span>
                  <span>₹{(total - delivery).toLocaleString()}</span>
                </div>
                {delivery > 0 && <div className="summary-line">
                  <span>Delivery Charge</span><span>₹{delivery}</span>
                </div>}
                {discount > 0 && <div className="summary-line green">
                  <span>Discount</span><span>- ₹{discount.toLocaleString()}</span>
                </div>}
                <div className="summary-line total">
                  <span>Order Total</span><span>₹{total.toLocaleString()}</span>
                </div>
              </div>
              <button className="place-order-btn-final" onClick={handlePlaceOrder} disabled={loading}>
                {loading ? 'Placing Order...' : '🎉 Place Order — ₹' + total.toLocaleString()}
              </button>
            </div>
          )}
        </div>

        {/* Mini summary sidebar */}
        <div className="order-sidebar">
          <div className="order-sidebar-card">
            <h3>Order Summary</h3>
            <div className="sidebar-items">
              {cart.map(item => item.product && (
                <div key={item._id} className="sidebar-item">
                  <span className="sidebar-item-name">{item.product.name}</span>
                  <span>×{item.quantity}</span>
                  <span>₹{(item.product.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="sidebar-total">
              <span>Total</span>
              <strong>₹{total.toLocaleString()}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
