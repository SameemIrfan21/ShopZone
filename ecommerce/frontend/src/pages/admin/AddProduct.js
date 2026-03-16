import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import AdminSidebar from '../../components/admin/AdminSidebar';
import './AdminPages.css';

const CATEGORIES = ['Electronics', 'Mobiles', 'Fashion', 'Home', 'Appliances', 'Furniture', 'Beauty', 'Toys', 'Sports'];

const INIT = { name: '', description: '', price: '', originalPrice: '', category: '', brand: '', stock: '', images: '', ratings: '4.0', numReviews: '0', featured: false };

export default function AddProduct() {
  const [form, setForm] = useState(INIT);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      axios.get(`/api/products/${id}`).then(r => {
        const p = r.data;
        setForm({ ...p, images: p.images?.join(', ') || '', price: p.price || '', originalPrice: p.originalPrice || '', stock: p.stock || '' });
      });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setMsg(''); setError('');
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        originalPrice: Number(form.originalPrice) || 0,
        stock: Number(form.stock),
        ratings: Number(form.ratings),
        numReviews: Number(form.numReviews),
        images: form.images.split(',').map(s => s.trim()).filter(Boolean),
      };
      if (isEdit) {
        await axios.put(`/api/products/${id}`, payload);
        setMsg('✅ Product updated successfully!');
      } else {
        await axios.post('/api/products', payload);
        setMsg('✅ Product added successfully!');
        setForm(INIT);
      }
      setTimeout(() => navigate('/admin/products'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const imgUrls = form.images ? form.images.split(',').map(s => s.trim()).filter(Boolean) : [];

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-header">
          <h1>{isEdit ? '✏️ Edit Product' : '➕ Add New Product'}</h1>
          <p>{isEdit ? 'Update product details below' : 'Fill in the details to add a new product'}</p>
        </div>

        <div className="form-card">
          {msg && <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '10px 16px', borderRadius: '4px', marginBottom: '16px', fontWeight: 700 }}>{msg}</div>}
          {error && <div style={{ background: '#fce4ec', color: '#c62828', padding: '10px 16px', borderRadius: '4px', marginBottom: '16px', fontWeight: 700 }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group full">
                <label className="form-label">Product Name *</label>
                <input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Samsung Galaxy S24" required />
              </div>
              <div className="form-group full">
                <label className="form-label">Description *</label>
                <textarea className="form-control" rows="3" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Product description..." required />
              </div>
              <div className="form-group">
                <label className="form-label">Selling Price (₹) *</label>
                <input type="number" className="form-control" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="e.g. 29999" required min="0" />
              </div>
              <div className="form-group">
                <label className="form-label">Original MRP (₹)</label>
                <input type="number" className="form-control" value={form.originalPrice} onChange={e => setForm({ ...form, originalPrice: e.target.value })} placeholder="e.g. 35000" min="0" />
              </div>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select className="form-control" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required>
                  <option value="">Select category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Brand</label>
                <input className="form-control" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} placeholder="e.g. Samsung" />
              </div>
              <div className="form-group">
                <label className="form-label">Stock Quantity *</label>
                <input type="number" className="form-control" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} placeholder="e.g. 50" required min="0" />
              </div>
              <div className="form-group">
                <label className="form-label">Rating (0-5)</label>
                <input type="number" className="form-control" value={form.ratings} onChange={e => setForm({ ...form, ratings: e.target.value })} min="0" max="5" step="any" />
              </div>
              <div className="form-group full">
                <label className="form-label">Image URLs (comma separated)</label>
                <textarea className="form-control" rows="2" value={form.images} onChange={e => setForm({ ...form, images: e.target.value })} placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg" />
                {imgUrls.length > 0 && (
                  <div className="img-preview-row">
                    {imgUrls.map((url, i) => (
                      <img key={i} src={url} alt="preview" onError={e => { e.target.style.display = 'none'; }} />
                    ))}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '14px' }}>
                  <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }} />
                  Mark as Featured Product
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button type="submit" className={`btn btn-primary btn-lg ${loading ? 'btn-disabled' : ''}`}>
                {loading ? 'Saving...' : isEdit ? '✅ Update Product' : '➕ Add Product'}
              </button>
              <button type="button" className="btn btn-outline btn-lg" onClick={() => navigate('/admin/products')}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
