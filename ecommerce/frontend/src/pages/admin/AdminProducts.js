import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AdminSidebar from '../../components/admin/AdminSidebar';
import './AdminPages.css';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    const res = await axios.get('/api/products');
    setProducts(res.data);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await axios.delete(`/api/products/${id}`);
    setProducts(prev => prev.filter(p => p._id !== id));
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="page-top">
          <div>
            <h1>📦 Products</h1>
            <p style={{ color: 'var(--text-light)', fontSize: '14px', marginTop: '4px' }}>{products.length} total products</p>
          </div>
          <Link to="/admin/add-product" className="btn btn-primary">➕ Add Product</Link>
        </div>

        <div className="admin-table-section">
          <div className="table-header">
            <div className="search-bar">
              <input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
              <button>🔍</button>
            </div>
          </div>
          <div className="admin-table-wrap">
            {loading ? (
              <div className="loading-container"><div className="spinner"></div></div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Rating</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr><td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-light)' }}>No products found</td></tr>
                  )}
                  {filtered.map(p => (
                    <tr key={p._id}>
                      <td>
                        <img className="product-thumb"
                          src={p.images?.[0] || 'https://via.placeholder.com/48'}
                          alt={p.name}
                          onError={e => { e.target.src = 'https://via.placeholder.com/48'; }} />
                      </td>
                      <td>
                        <strong style={{ display: 'block', maxWidth: '200px' }}>{p.name}</strong>
                        <small>{p.brand}</small>
                      </td>
                      <td><span className="badge badge-primary">{p.category}</span></td>
                      <td>
                        <strong>₹{p.price?.toLocaleString()}</strong>
                        {p.originalPrice > 0 && <small>MRP ₹{p.originalPrice?.toLocaleString()}</small>}
                      </td>
                      <td>
                        <span style={{ color: p.stock > 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 700 }}>
                          {p.stock}
                        </span>
                      </td>
                      <td>{p.ratings?.toFixed(1)} ⭐</td>
                      <td>
                        <div className="table-actions">
                          <Link to={`/admin/edit-product/${p._id}`} className="btn-edit">✏️ Edit</Link>
                          <button className="btn-del" onClick={() => handleDelete(p._id)}>🗑 Delete</button>
                        </div>
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
