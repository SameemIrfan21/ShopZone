import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AdminSidebar.css';

const links = [
  { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
  { path: '/admin/products', icon: '📦', label: 'Products' },
  { path: '/admin/add-product', icon: '➕', label: 'Add Product' },
  { path: '/admin/orders', icon: '🛒', label: 'Orders' },
  { path: '/admin/customers', icon: '👥', label: 'Customers' },
];

export default function AdminSidebar() {
  const location = useLocation();
  return (
    <aside className="admin-sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-logo">ShopZone</span>
        <span className="sidebar-role">Admin Panel</span>
      </div>
      <nav className="sidebar-nav">
        {links.map(l => (
          <Link
            key={l.path}
            to={l.path}
            className={`sidebar-link ${location.pathname === l.path ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{l.icon}</span>
            <span>{l.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
