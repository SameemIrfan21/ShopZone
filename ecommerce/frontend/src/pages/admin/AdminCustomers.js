import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminSidebar from '../../components/admin/AdminSidebar';
import './AdminPages.css';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get('/api/admin/customers').then(r => setCustomers(r.data)).finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-header">
          <h1>👥 Customers</h1>
          <p>{customers.length} registered customers</p>
        </div>

        <div className="admin-table-section">
          <div className="table-header">
            <div className="search-bar">
              <input placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)} />
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
                    <th>#</th>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr><td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-light)' }}>No customers found</td></tr>
                  )}
                  {filtered.map((c, i) => (
                    <tr key={c._id}>
                      <td>{i + 1}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div className="cust-avatar">{c.name[0].toUpperCase()}</div>
                          <strong>{c.name}</strong>
                        </div>
                      </td>
                      <td>{c.email}</td>
                      <td>{c.phone || <span style={{ color: 'var(--text-light)' }}>—</span>}</td>
                      <td>
                        <small style={{ maxWidth: '160px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {c.address || '—'}
                        </small>
                      </td>
                      <td><small>{new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</small></td>
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
