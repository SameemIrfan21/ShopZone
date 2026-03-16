import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../../components/user/ProductCard';
import './ProductsPage.css';

const CATEGORIES = ['All', 'Electronics', 'Mobiles', 'Fashion', 'Home', 'Appliances', 'Furniture', 'Beauty', 'Toys', 'Sports'];

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState('newest');

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || 'All';

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category && category !== 'All') params.set('category', category);
    params.set('sort', sort);
    axios.get(`/api/products?${params}`)
      .then(r => setProducts(r.data))
      .finally(() => setLoading(false));
  }, [search, category, sort]);

  const setCategory = (cat) => {
    const p = new URLSearchParams(searchParams);
    if (cat === 'All') p.delete('category');
    else p.set('category', cat);
    setSearchParams(p);
  };

  return (
    <div className="products-page">
      {/* Filters sidebar */}
      <aside className="filters-panel">
        <h3 className="filter-title">Filters</h3>
        <div className="filter-section">
          <h4 className="filter-label">Category</h4>
          {CATEGORIES.map(cat => (
            <label key={cat} className={`filter-option ${category === cat ? 'active' : ''}`}>
              <input type="radio" name="category" checked={category === cat} onChange={() => setCategory(cat)} />
              {cat}
            </label>
          ))}
        </div>
        <div className="filter-section">
          <h4 className="filter-label">Sort By</h4>
          {[
            { value: 'newest', label: 'Newest First' },
            { value: 'price_asc', label: 'Price: Low to High' },
            { value: 'price_desc', label: 'Price: High to Low' },
          ].map(s => (
            <label key={s.value} className={`filter-option ${sort === s.value ? 'active' : ''}`}>
              <input type="radio" name="sort" checked={sort === s.value} onChange={() => setSort(s.value)} />
              {s.label}
            </label>
          ))}
        </div>
      </aside>

      {/* Products area */}
      <main className="products-main">
        <div className="products-header">
          <div>
            <h2 className="products-heading">
              {search ? `Results for "${search}"` : category !== 'All' ? category : 'All Products'}
            </h2>
            {!loading && <p className="products-count">{products.length} products found</p>}
          </div>
        </div>

        {loading ? (
          <div className="loading-container"><div className="spinner"></div></div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No products found</h3>
            <p>Try a different category or search term</p>
          </div>
        ) : (
          <div className="products-grid-main">
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </main>
    </div>
  );
}
