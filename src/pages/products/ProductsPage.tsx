import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useProducts from '../../hooks/useProducts';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import type { Product } from '../../models/types';

const ratingColor = (r: number) => r >= 3.5 ? '#22C55E' : r >= 2.5 ? '#F59E0B' : '#EF4444';

/** Convert a DummyJSON category slug to a display label: "mens-shirts" → "Mens Shirts" */
const slugToLabel = (slug: string) =>
  slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

const StarRow = ({ rating }: { rating: number }) => (
  <span style={{ display: 'inline-flex', gap: 2, alignItems: 'center' }}>
    {Array.from({ length: 5 }).map((_, i) => (
      <svg key={i} width="12" height="12" viewBox="0 0 24 24"
        fill={i < Math.round(rating) ? ratingColor(rating) : 'none'}
        stroke={ratingColor(rating)} strokeWidth={2}>
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
      </svg>
    ))}
    <span style={{ fontSize: 11, color: ratingColor(rating), fontWeight: 600, marginLeft: 4 }}>{rating?.toFixed(1)}</span>
  </span>
);

const ProductsPage = () => {
  useEffect(() => { document.title = 'Products | CartCrazy'; }, []);

  const {
    products, categories,
    selectedCategory, setSelectedCategory,
    searchQuery, setSearchQuery,
    isLoading, error,
  } = useProducts();
  const { addToCart, cartItems, increment, decrement } = useCart();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  // Category panel open state + outside-click + ESC dismiss
  const [catOpen, setCatOpen] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!catOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCatOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [catOpen]);

  /** Pick a category from the panel */
  const pickCategory = useCallback((cat: string) => {
    setSelectedCategory(cat);
    setSearchQuery('');
    setCatOpen(false);
  }, [setSelectedCategory, setSearchQuery]);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addToCart(product);
  };

  const getQty = (productId: number) =>
    cartItems.find((i) => i.id === productId)?.quantity ?? 0;

  return (
    <div className="ent-page">
      <div className="ent-container">

        {/*  Page header  */}
        <div className="anim-fade-up" style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: 8 }}>
                Product Catalog
              </p>
              <h1 className="ent-title">
                {selectedCategory
                  ? <><span className="gradient-text">{selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}</span></>
                  : <><span className="gradient-text">All Products</span></>
                }
              </h1>
              <p style={{ color: 'var(--text-2)', fontSize: 15, marginTop: 8 }}>
                {isLoading ? 'Loading…' : `${products.length} product${products.length !== 1 ? 's' : ''} found`}
              </p>
            </div>

            {isAdmin && (
              <button
                onClick={() => navigate('/products/new')}
                className="btn-primary"
                style={{ width: 'auto', alignSelf: 'flex-start', marginTop: 8 }}
              >
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Product
              </button>
            )}
          </div>
        </div>

        {/*  Category filter  */}
        <div ref={catRef} className="anim-fade-up" style={{ marginBottom: 16, position: 'relative', zIndex: 50, animationDelay: '0.05s' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Filter toggle button */}
            <button
              onClick={() => setCatOpen(prev => !prev)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '9px 16px', borderRadius: 'var(--r-lg)',
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
                background: catOpen ? 'var(--accent)' : 'var(--surface)',
                color: catOpen ? 'white' : 'var(--text)',
                border: `1px solid ${catOpen ? 'transparent' : 'var(--border)'}`,
                boxShadow: catOpen ? '0 2px 8px rgba(79,70,229,0.30)' : 'var(--shadow-xs)',
                transition: 'all 0.15s ease',
              }}
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Categories
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                style={{ transition: 'transform 0.2s', transform: catOpen ? 'rotate(180deg)' : 'rotate(0)' }}>
                <polyline points="6 9 12 15 18 9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Active category chip */}
            {selectedCategory && !searchQuery && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', borderRadius: 'var(--r-pill)',
                fontSize: 12, fontWeight: 600,
                background: 'rgba(79,70,229,0.10)', color: 'var(--accent)',
                border: '1px solid rgba(79,70,229,0.18)',
              }}>
                {slugToLabel(selectedCategory)}
                <button
                  onClick={() => { setSelectedCategory(''); setSearchQuery(''); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: 'var(--accent)' }}
                  aria-label="Clear category"
                >
                  <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
          </div>

          {/* Dropdown panel — multi-column grid, responsive */}
          {catOpen && (
            <div className="cat-dropdown-panel" style={{
              position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 8, zIndex: 50,
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--r-lg)', boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
              padding: 8,
              display: 'grid', gap: 4,
              maxHeight: '60vh', overflowY: 'auto',
              animation: 'fade-up-in 0.18s ease both',
            }}>
              <button
                onClick={() => pickCategory('')}
                style={{
                  padding: '9px 14px', borderRadius: 'var(--r-md)',
                  fontSize: 13, fontWeight: !selectedCategory ? 700 : 500,
                  cursor: 'pointer', textAlign: 'left',
                  background: !selectedCategory ? 'rgba(79,70,229,0.08)' : 'transparent',
                  color: !selectedCategory ? 'var(--accent)' : 'var(--text-2)',
                  border: 'none', transition: 'background 0.12s',
                }}
                onMouseEnter={e => { if (selectedCategory) e.currentTarget.style.background = 'var(--surface-2)'; }}
                onMouseLeave={e => { if (selectedCategory) e.currentTarget.style.background = 'transparent'; }}
              >
                All Products
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => pickCategory(cat)}
                  style={{
                    padding: '9px 14px', borderRadius: 'var(--r-md)',
                    fontSize: 13, fontWeight: selectedCategory === cat ? 700 : 500,
                    cursor: 'pointer', textAlign: 'left',
                    background: selectedCategory === cat ? 'rgba(79,70,229,0.08)' : 'transparent',
                    color: selectedCategory === cat ? 'var(--accent)' : 'var(--text-2)',
                    border: 'none', transition: 'background 0.12s',
                    textTransform: 'capitalize',
                  }}
                  onMouseEnter={e => { if (selectedCategory !== cat) e.currentTarget.style.background = 'var(--surface-2)'; }}
                  onMouseLeave={e => { if (selectedCategory !== cat) e.currentTarget.style.background = 'transparent'; }}
                >
                  {slugToLabel(cat)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/*  Search bar  */}
        <div className="anim-fade-up" style={{ marginBottom: 32, animationDelay: '0.08s' }}>
          <div style={{ position: 'relative', maxWidth: 480 }}>
            <svg
              width="16" height="16" fill="none" stroke="var(--text-3)" viewBox="0 0 24 24"
              style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              className="ent-input"
              type="text"
              placeholder="Search products…"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setSelectedCategory(''); }}
              style={{ paddingLeft: 40, paddingRight: searchQuery ? 36 : 13 }}
            />
            {/* Clear search button */}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-3)', display: 'flex', alignItems: 'center',
                }}
                aria-label="Clear search"
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {/* Active search indicator */}
          {searchQuery && !isLoading && (
            <p style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 8 }}>
              {products.length} result{products.length !== 1 ? 's' : ''} for “{searchQuery}”
            </p>
          )}
        </div>

        {/*  States  */}
        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <LoadingSpinner />
          </div>
        )}

        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            background: 'var(--error-dim)', border: '1px solid rgba(239,68,68,0.20)',
            borderRadius: 'var(--r-lg)', padding: '16px 20px', color: 'var(--error)',
          }}>
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p style={{ fontWeight: 600, fontSize: 14 }}>Failed to load products</p>
              <p style={{ fontSize: 13, opacity: 0.8 }}>{error}</p>
            </div>
          </div>
        )}

        {/*  Product grid  */}
        {!isLoading && !error && (
          <div className="stagger" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 20,
          }}>
            {products.map((product) => (
              <div
                key={product.id}
                className="product-card anim-fade-up"
                onClick={() => navigate(`/products/${product.id}`)}
              >
                {/* Image area */}
                <div className="product-card-img">
                  <div className="product-card-overlay" />
                  <img src={product.thumbnail} alt={product.title} loading="lazy" />
                </div>

                {/* Body */}
                <div className="product-card-body">
                  <span className="badge badge-indigo" style={{ marginBottom: 10, alignSelf: 'flex-start', textTransform: 'capitalize' }}>
                    {product.category}
                  </span>
                  <p className="clamp-2" style={{
                    fontSize: 14, fontWeight: 600, color: 'var(--text)',
                    lineHeight: 1.45, flex: 1, marginBottom: 10,
                  }}>
                    {product.title}
                  </p>

                  {product.rating && (
                    <div style={{ marginBottom: 12 }}>
                      <StarRow rating={product.rating} />
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                    <div>
                      <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)' }}>
                        ${product.price.toFixed(2)}
                      </span>
                      {/* Show discount badge if the product has one */}
                      {product.discountPercentage && product.discountPercentage > 0 && (
                        <span className="badge badge-green" style={{ marginLeft: 8, fontSize: 11 }}>
                          -{Math.round(product.discountPercentage)}%
                        </span>
                      )}
                    </div>
                    {!isAdmin && (getQty(product.id) === 0 ? (
                      <button
                        className="btn-primary"
                        onClick={(e) => handleAddToCart(e, product)}
                        style={{ width: 'auto', padding: '8px 14px', fontSize: 13, borderRadius: 'var(--r-md)' }}
                      >
                        <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                        Add
                      </button>
                    ) : (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          display: 'inline-flex', alignItems: 'center',
                          border: '2px solid var(--accent)',
                          borderRadius: 'var(--r-md)', overflow: 'hidden',
                          background: 'var(--accent-dim)',
                        }}
                      >
                        <button
                          onClick={(e) => { e.stopPropagation(); decrement(product.id); }}
                          style={{
                            width: 32, height: 32, border: 'none', background: 'transparent',
                            cursor: 'pointer', fontSize: 18, fontWeight: 400, color: 'var(--accent)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >−</button>
                        <span style={{
                          minWidth: 28, textAlign: 'center', fontSize: 13, fontWeight: 800,
                          color: 'var(--accent)', lineHeight: '32px', height: 32,
                          borderLeft: '1px solid rgba(79,70,229,0.25)',
                          borderRight: '1px solid rgba(79,70,229,0.25)',
                        }}>
                          {getQty(product.id)}
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); increment(product.id); }}
                          style={{
                            width: 32, height: 32, border: 'none', background: 'transparent',
                            cursor: 'pointer', fontSize: 18, fontWeight: 400, color: 'var(--accent)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >+</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && products.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{
              width: 64, height: 64, borderRadius: 'var(--r-xl)',
              background: 'var(--surface-2)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <svg width="28" height="28" fill="none" stroke="var(--text-3)" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>No products found</h3>
            <p style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 20 }}>Try a different category or search term.</p>
            <button onClick={() => { setSelectedCategory(''); setSearchQuery(''); }} className="btn-ghost">Clear filter</button>
          </div>
        )}

        {/* End of products */}
        {!isLoading && !error && products.length > 0 && (
          <div style={{
            textAlign: 'center', padding: '48px 0 24px',
            borderTop: '1px solid var(--border)', marginTop: 40,
          }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '10px 20px', borderRadius: 'var(--r-pill)',
              background: 'var(--surface-2)', border: '1px solid var(--border)',
            }}>
              <svg width="14" height="14" fill="none" stroke="var(--accent)" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 500 }}>
                You've reached the end — {products.length} product{products.length !== 1 ? 's' : ''} shown
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;