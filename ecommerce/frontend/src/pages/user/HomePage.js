import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../../components/user/ProductCard';
import './HomePage.css';

const banners = [
  { title: 'Mega Electronics Sale', subtitle: 'Up to 70% off on top brands', color: '#1565c0', emoji: '📱' },
  { title: 'Fashion Fiesta', subtitle: 'New arrivals every day', color: '#6a1b9a', emoji: '👗' },
  { title: 'Home Essentials', subtitle: 'Upgrade your living space', color: '#00695c', emoji: '🏠' },
];

const categories = [
  { name: 'Mobiles', emoji: '📱', color: '#e3f2fd' },
  { name: 'Electronics', emoji: '💻', color: '#fce4ec' },
  { name: 'Fashion', emoji: '👗', color: '#f3e5f5' },
  { name: 'Home', emoji: '🏠', color: '#e8f5e9' },
  { name: 'Appliances', emoji: '🫗', color: '#fff3e0' },
  { name: 'Beauty', emoji: '💄', color: '#fce4ec' },
  { name: 'Sports', emoji: '⚽', color: '#e0f7fa' },
  { name: 'Toys', emoji: '🧸', color: '#fff9c4' },
];

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bannerIdx, setBannerIdx] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/products').then(r => setProducts(r.data)).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const t = setInterval(() => setBannerIdx(i => (i + 1) % banners.length), 4000);
    return () => clearInterval(t);
  }, []);

  const featured = products.slice(0, 8);
  const deals = products.slice(8, 16);

  return (
    <div className="home-page">
      {/* Hero Banner */}
      <div className="hero-banner" style={{ background: banners[bannerIdx].color }}>
        <div className="hero-content">
          <span className="hero-emoji">{banners[bannerIdx].emoji}</span>
          <div>
            <h1>{banners[bannerIdx].title}</h1>
            <p>{banners[bannerIdx].subtitle}</p>
            <button className="hero-btn" onClick={() => navigate('/products')}>Shop Now →</button>
          </div>
        </div>
        <div className="banner-dots">
          {banners.map((_, i) => (
            <span key={i} className={`dot ${i === bannerIdx ? 'active' : ''}`} onClick={() => setBannerIdx(i)} />
          ))}
        </div>
      </div>

      <div className="home-container">
        {/* Categories */}
        <section className="section">
          <h2 className="section-title">Shop by Category</h2>
          <div className="categories-grid">
            {categories.map(cat => (
              <Link key={cat.name} to={`/products?category=${cat.name}`} className="category-card" style={{ background: cat.color }}>
                <span className="cat-emoji">{cat.emoji}</span>
                <span className="cat-name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">🔥 Featured Products</h2>
            <Link to="/products" className="view-all-btn">View All →</Link>
          </div>
          {loading ? (
            <div className="loading-container"><div className="spinner"></div></div>
          ) : featured.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h3>No products yet</h3>
              <p>Check back later for amazing deals!</p>
            </div>
          ) : (
            <div className="products-grid">
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </section>

        {/* Deals */}
        {deals.length > 0 && (
          <section className="section">
            <div className="section-header">
              <h2 className="section-title">⚡ Today's Deals</h2>
              <Link to="/products" className="view-all-btn">View All →</Link>
            </div>
            <div className="products-grid">
              {deals.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </section>
        )}

        {/* Promo strip */}
        <div className="promo-strip">
          <div className="promo-item">🚚 <span>Free Delivery on orders above ₹499</span></div>
          <div className="promo-item">🔄 <span>Easy 30-day Returns</span></div>
          <div className="promo-item">🔒 <span>100% Secure Payments</span></div>
          <div className="promo-item">⭐ <span>Verified Quality Products</span></div>
        </div>
      </div>
    </div>
  );
}
