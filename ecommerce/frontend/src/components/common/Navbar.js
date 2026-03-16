import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, cartCount } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const isAdmin = user?.role === 'admin';
  const isAdminPage = location.pathname.startsWith('/admin');

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  if (isAdminPage && !user) return null;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to={isAdmin ? '/admin/dashboard' : '/'} className="navbar-logo">
          <span className="logo-text">ShopZone</span>
          <span className="logo-tagline">Explore <em>Plus</em></span>
        </Link>

        {/* Search (user only) */}
        {!isAdmin && (
          <form className="navbar-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search for products, brands and more"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button type="submit">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
          </form>
        )}

        {/* Nav actions */}
        <div className="navbar-actions">
          {isAdmin ? (
            <>
              <Link to="/admin/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/admin/products" className="nav-link">Products</Link>
              <Link to="/admin/orders" className="nav-link">Orders</Link>
              <Link to="/admin/customers" className="nav-link">Customers</Link>
              <button className="nav-btn logout-btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              {user ? (
                <>
                  <div className="nav-user-menu">
                    <button className="nav-user-btn" onClick={() => setMenuOpen(!menuOpen)}>
                      <span className="user-avatar">{user.name[0].toUpperCase()}</span>
                      <span>{user.name.split(' ')[0]}</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7 10l5 5 5-5z"/>
                      </svg>
                    </button>
                    {menuOpen && (
                      <div className="dropdown-menu">
                        <Link to="/my-orders" onClick={() => setMenuOpen(false)}>
                          📦 My Orders
                        </Link>
                        <button onClick={handleLogout}>🚪 Logout</button>
                      </div>
                    )}
                  </div>
                  <Link to="/cart" className="cart-btn">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
                      <path d="M16 10a4 4 0 01-8 0"/>
                    </svg>
                    <span>Cart</span>
                    {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login" className="nav-btn login-btn">Login</Link>
                  <Link to="/register" className="nav-btn signup-btn">Sign Up</Link>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Category bar (user only) */}
      {!isAdmin && (
        <div className="category-bar">
          <div className="category-bar-inner">
            {['Electronics', 'Mobiles', 'Fashion', 'Home', 'Appliances', 'Furniture', 'Beauty', 'Toys', 'Sports'].map(cat => (
              <Link key={cat} to={`/products?category=${cat}`} className="category-link">{cat}</Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
