import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './ProductDetailPage.css';

const PLACEHOLDER = 'https://via.placeholder.com/400x400?text=No+Image';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selImg, setSelImg] = useState(0);
  const [qty, setQty] = useState(1);
  const { user, showNotification, fetchCartCount } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/products/${id}`)
      .then(r => setProduct(r.data))
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) { showNotification('Please login to add to cart', 'warning'); navigate('/login'); return; }
    try {
      await axios.post('/api/cart/add', { productId: product._id, quantity: qty });
      fetchCartCount();
      showNotification(`${product.name} added to cart!`);
    } catch {
      showNotification('Failed to add to cart', 'error');
    }
  };

  const handleBuyNow = async () => {
    if (!user) { showNotification('Please login first', 'warning'); navigate('/login'); return; }
    try {
      await axios.post('/api/cart/add', { productId: product._id, quantity: qty });
      fetchCartCount();
      navigate('/cart');
    } catch {
      showNotification('Error', 'error');
    }
  };

  const discount = product?.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;
  if (!product) return null;

  const imgs = product.images?.length ? product.images : [PLACEHOLDER];

  return (
    <div className="product-detail-page fade-in">
      <div className="product-detail-container">
        {/* Images */}
        <div className="product-images">
          <div className="image-thumbs">
            {imgs.map((img, i) => (
              <img key={i} src={img} alt={product.name} className={`thumb ${selImg === i ? 'active' : ''}`}
                onClick={() => setSelImg(i)} onError={e => { e.target.src = PLACEHOLDER; }} />
            ))}
          </div>
          <div className="image-main">
            <img src={imgs[selImg]} alt={product.name} onError={e => { e.target.src = PLACEHOLDER; }} />
          </div>
          <div className="action-buttons-mobile">
            <button className="btn-add-cart" onClick={handleAddToCart}>🛒 Add to Cart</button>
            <button className="btn-buy-now" onClick={handleBuyNow}>⚡ Buy Now</button>
          </div>
        </div>

        {/* Details */}
        <div className="product-info">
          <p className="detail-brand">{product.brand || product.category}</p>
          <h1 className="detail-name">{product.name}</h1>

          <div className="detail-rating">
            <span className="rating-pill-lg">{product.ratings?.toFixed(1) || '4.0'} ★</span>
            <span className="review-count">{product.numReviews || 0} Ratings</span>
            <span className="separator">|</span>
            <span className="stock-info" style={{ color: product.stock > 0 ? 'var(--success)' : 'var(--danger)' }}>
              {product.stock > 0 ? `✓ In Stock (${product.stock})` : '✗ Out of Stock'}
            </span>
          </div>

          <div className="detail-price">
            <span className="price-main">₹{product.price?.toLocaleString()}</span>
            {product.originalPrice > 0 && (
              <>
                <span className="price-mrp">M.R.P: <s>₹{product.originalPrice?.toLocaleString()}</s></span>
                <span className="price-save">{discount}% off</span>
              </>
            )}
          </div>

          {product.originalPrice > 0 && (
            <div className="savings-banner">
              💰 You save ₹{(product.originalPrice - product.price).toLocaleString()} on this order!
            </div>
          )}

          <div className="delivery-info">
            <div className="delivery-row">
              <span className="delivery-label">🚚 Delivery</span>
              <span>Free delivery on orders above ₹499</span>
            </div>
            <div className="delivery-row">
              <span className="delivery-label">🔄 Returns</span>
              <span>30-day return policy</span>
            </div>
            <div className="delivery-row">
              <span className="delivery-label">💳 Payment</span>
              <span>Cash on Delivery available</span>
            </div>
          </div>

          {/* Quantity */}
          <div className="qty-row">
            <span className="qty-label">Quantity:</span>
            <div className="qty-controls">
              <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
            </div>
          </div>

          <div className="action-buttons">
            <button className="btn-add-cart" onClick={handleAddToCart} disabled={product.stock === 0}>
              🛒 Add to Cart
            </button>
            <button className="btn-buy-now" onClick={handleBuyNow} disabled={product.stock === 0}>
              ⚡ Buy Now
            </button>
          </div>

          {/* Description */}
          <div className="product-description">
            <h3>Product Description</h3>
            <p>{product.description}</p>
          </div>

          <div className="product-specs">
            <div className="spec-row"><span>Category</span><span>{product.category}</span></div>
            {product.brand && <div className="spec-row"><span>Brand</span><span>{product.brand}</span></div>}
            <div className="spec-row"><span>Availability</span>
              <span style={{ color: product.stock > 0 ? 'var(--success)' : 'var(--danger)' }}>
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
