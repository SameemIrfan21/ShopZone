import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './ProductCard.css';

const PLACEHOLDER = 'https://via.placeholder.com/300x300?text=No+Image';

export default function ProductCard({ product }) {
  const { user, showNotification, fetchCartCount } = useAuth();
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) { showNotification('Please login to add to cart', 'warning'); return; }
    try {
      await axios.post('/api/cart/add', { productId: product._id, quantity: 1 });
      fetchCartCount();
      showNotification(`${product.name} added to cart!`);
    } catch {
      showNotification('Failed to add to cart', 'error');
    }
  };

  return (
    <Link to={`/product/${product._id}`} className="product-card">
      <div className="product-card-img">
        <img
          src={product.images?.[0] || PLACEHOLDER}
          alt={product.name}
          onError={e => { e.target.src = PLACEHOLDER; }}
        />
        {discount > 0 && <span className="discount-badge">{discount}% off</span>}
      </div>
      <div className="product-card-body">
        <p className="product-brand">{product.brand || product.category}</p>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-rating">
          <span className="rating-pill">
            {product.ratings?.toFixed(1) || '4.0'} ★
          </span>
          <span className="rating-count">({product.numReviews || 0})</span>
        </div>
        <div className="product-price">
          <span className="price-current">₹{product.price?.toLocaleString()}</span>
          {product.originalPrice > 0 && (
            <span className="price-original">₹{product.originalPrice?.toLocaleString()}</span>
          )}
          {discount > 0 && (
            <span className="price-discount">{discount}% off</span>
          )}
        </div>
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          🛒 Add to Cart
        </button>
      </div>
    </Link>
  );
}
