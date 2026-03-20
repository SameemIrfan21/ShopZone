import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../api';
import { useAuth } from '../../context/AuthContext';
import './CartPage.css';

const PLACEHOLDER = 'https://via.placeholder.com/80x80?text=No+Image';

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setCartCount, showNotification } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { fetchCart(); }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get('/api/cart');
      setCart(res.data);
      setCartCount(res.data.length);
    } finally {
      setLoading(false);
    }
  };

  const updateQty = async (productId, qty) => {
    const res = await axios.put('/api/cart/update', { productId, quantity: qty });
    setCart(res.data);
    setCartCount(res.data.length);
  };

  const removeItem = async (productId) => {
    const res = await axios.delete(`/api/cart/remove/${productId}`);
    setCart(res.data);
    setCartCount(res.data.length);
    showNotification('Item removed from cart');
  };

  const total = cart.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  const originalTotal = cart.reduce((sum, item) => sum + (item.product?.originalPrice || item.product?.price || 0) * item.quantity, 0);
  const discount = originalTotal - total;
  const delivery = total >= 499 ? 0 : 40;
  const finalTotal = total + delivery;

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  if (cart.length === 0) return (
    <div className="cart-page fade-in">
      <div className="empty-cart">
        <div className="empty-cart-icon">🛒</div>
        <h2>Your cart is empty!</h2>
        <p>Add items to it now.</p>
        <Link to="/products" className="btn btn-primary btn-lg">Shop Now</Link>
      </div>
    </div>
  );

  return (
    <div className="cart-page fade-in">
      <div className="cart-container">
        <div className="cart-main">
          <h2 className="cart-title">My Cart <span>({cart.length} item{cart.length > 1 ? 's' : ''})</span></h2>
          {cart.map(item => {
            if (!item.product) return null;
            const p = item.product;
            const itemDiscount = p.originalPrice
              ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
              : 0;
            return (
              <div className="cart-item" key={item._id}>
                <img src={p.images?.[0] || PLACEHOLDER} alt={p.name}
                  onError={e => { e.target.src = PLACEHOLDER; }} />
                <div className="cart-item-info">
                  <Link to={`/product/${p._id}`} className="cart-item-name">{p.name}</Link>
                  <p className="cart-item-brand">{p.brand || p.category}</p>
                  <div className="cart-item-price">
                    <span className="cart-price">₹{p.price?.toLocaleString()}</span>
                    {p.originalPrice > 0 && <span className="cart-original">₹{p.originalPrice?.toLocaleString()}</span>}
                    {itemDiscount > 0 && <span className="cart-discount">{itemDiscount}% off</span>}
                  </div>
                  <div className="cart-item-actions">
                    <div className="qty-ctrl">
                      <button onClick={() => updateQty(p._id, item.quantity - 1)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQty(p._id, item.quantity + 1)}>+</button>
                    </div>
                    <button className="remove-btn" onClick={() => removeItem(p._id)}>🗑 Remove</button>
                  </div>
                </div>
                <div className="cart-item-total">
                  ₹{(p.price * item.quantity).toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="cart-summary">
          <h3 className="summary-title">Price Details</h3>
          <div className="summary-row">
            <span>Price ({cart.length} items)</span>
            <span>₹{originalTotal.toLocaleString()}</span>
          </div>
          {discount > 0 && (
            <div className="summary-row discount-row">
              <span>Discount</span>
              <span>− ₹{discount.toLocaleString()}</span>
            </div>
          )}
          <div className="summary-row">
            <span>Delivery Charges</span>
            <span style={{ color: delivery === 0 ? 'var(--success)' : 'inherit' }}>
              {delivery === 0 ? 'FREE' : `₹${delivery}`}
            </span>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-row total-row">
            <span>Total Amount</span>
            <span>₹{finalTotal.toLocaleString()}</span>
          </div>
          {discount > 0 && (
            <p className="summary-savings">You will save ₹{discount.toLocaleString()} on this order</p>
          )}
          <button className="place-order-btn" onClick={() => navigate('/order', { state: { cart, total: finalTotal, delivery, discount } })}>
            Proceed to Order →
          </button>
        </div>
      </div>
    </div>
  );
}
