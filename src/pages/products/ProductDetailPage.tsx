import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import useProduct from '../../hooks/useProduct';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { deleteProduct, clearProductOverride } from '../../services/productService';

//  Helpers 
const ratingColor = (r: number) => r >= 3.5 ? '#22C55E' : r >= 2.5 ? '#F59E0B' : '#EF4444';

const StarRating = ({ rating, count }: { rating: number; count?: number }) => {
  const color = ratingColor(rating);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ display: 'inline-flex', gap: 3 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <svg key={i} width="17" height="17" viewBox="0 0 24 24"
            fill={i < Math.floor(rating) ? color : 'none'}
            stroke={color} strokeWidth={1.5}>
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
          </svg>
        ))}
      </span>
      <span style={{ fontSize: 14, fontWeight: 700, color }}>{rating.toFixed(1)}</span>
      {count !== undefined && (
        <span style={{ fontSize: 13, color: 'var(--text-3)' }}>({count.toLocaleString()} reviews)</span>
      )}
    </div>
  );
};

const TRUST = [
  { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', label: 'Secure checkout' },
  { icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', label: 'Free returns' },
  { icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4', label: 'Fast delivery' },
];

//  Page 
const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { product, isLoading, error } = useProduct(Number(id));
  const { addToCart, cartItems, increment, decrement } = useCart();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting]       = useState(false);
  const [deleteError, setDeleteError]     = useState('');
  const [showSaved, setShowSaved]         = useState(false);

  // Show "saved" toast if redirected from edit form
  useEffect(() => {
    if (searchParams.get('saved') === '1') {
      setShowSaved(true);
      setSearchParams({}, { replace: true }); // clean URL
      const t = setTimeout(() => setShowSaved(false), 3000);
      return () => clearTimeout(t);
    }
  }, [searchParams, setSearchParams]);

  // Update tab title whenever the product loads
  useEffect(() => {
    document.title = product ? `${product.title} | CartCrazy` : 'CartCrazy';
  }, [product]);

  // Cart qty for this product
  const cartQty = product ? (cartItems.find(i => i.id === product.id)?.quantity ?? 0) : 0;

  // ESC closes delete confirmation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') setConfirmDelete(false);
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleDelete = async () => {
    if (!product) return;
    setIsDeleting(true);
    setDeleteError('');
    try {
      await deleteProduct(product.id);
      clearProductOverride(product.id);
      navigate('/products', { replace: true });
    } catch {
      setDeleteError('Failed to delete product. Please try again.');
      setIsDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <div className="ent-page">
      {/* Success toast after editing */}
      {showSaved && (
        <div style={{
          position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)',
          zIndex: 9999, background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
          color: '#fff', borderRadius: 12, padding: '13px 22px',
          animation: 'notif-drop 0.42s cubic-bezier(0.34,1.56,0.64,1) both',
          display: 'flex', alignItems: 'center', gap: 10,
          boxShadow: '0 8px 32px rgba(21,128,61,0.40)',
          fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap',
        }}>
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          Product updated successfully!
        </div>
      )}
      <div className="ent-container">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="btn-ghost"
          style={{ padding: '6px 0', marginBottom: 28, display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14 }}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Products
        </button>

        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <LoadingSpinner />
          </div>
        )}

        {error && !isLoading && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            background: 'var(--error-dim)', border: '1px solid rgba(239,68,68,0.20)',
            borderRadius: 'var(--r-lg)', padding: '16px 20px', color: 'var(--error)',
          }}>
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </div>
        )}

        {deleteError && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            background: 'var(--error-dim)', border: '1px solid rgba(239,68,68,0.20)',
            borderRadius: 'var(--r-lg)', padding: '14px 18px', color: 'var(--error)',
            marginBottom: 16, fontSize: 14,
          }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {deleteError}
          </div>
        )}

        {product && !isLoading && (
          <>
            <div className="detail-layout anim-fade-up">

              {/* Left: Image */}
              <div>
                <div className="ent-card detail-img-card">
                  <div style={{
                    position: 'absolute', inset: 0, opacity: 0.04,
                    background: 'radial-gradient(circle at 50% 50%, var(--accent), transparent 70%)',
                    pointerEvents: 'none',
                  }} />
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    style={{ maxHeight: 340, maxWidth: '100%', objectFit: 'contain', position: 'relative', zIndex: 1 }}
                  />
                </div>
              </div>

              {/* Right: Info */}
              <div className="detail-info-sticky">

                <span className="badge badge-indigo" style={{ marginBottom: 16, textTransform: 'capitalize', fontSize: 12 }}>
                  {product.category}
                </span>

                <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)', lineHeight: 1.25, marginBottom: 16 }}>
                  {product.title}
                </h1>

                {product.rating && (
                  <div style={{ marginBottom: 20 }}>
                    <StarRating rating={product.rating} count={product.reviews?.length} />
                  </div>
                )}

                {/* Price + discount */}
                <div style={{
                  display: 'flex', alignItems: 'baseline', gap: 10,
                  marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid var(--border)',
                }}>
                  <span style={{ fontSize: 38, fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--text)' }}>
                    ${product.price.toFixed(2)}
                  </span>
                  <span style={{ fontSize: 14, color: 'var(--text-3)' }}>USD</span>
                  {product.discountPercentage && product.discountPercentage > 0 && (
                    <span className="badge badge-green" style={{ marginLeft: 4 }}>
                      -{Math.round(product.discountPercentage)}% OFF
                    </span>
                  )}
                  {/* Availability from DummyJSON (e.g. "In Stock", "Low Stock", "Out of Stock") */}
                  {product.availabilityStatus ? (
                    <span
                      className="badge"
                      style={{
                        marginLeft: 4,
                        background: product.availabilityStatus === 'In Stock'
                          ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
                        color: product.availabilityStatus === 'In Stock'
                          ? 'var(--success)' : '#D97706',
                      }}
                    >
                      {product.availabilityStatus}
                    </span>
                  ) : (
                    <span className="badge badge-green" style={{ marginLeft: 4 }}>In stock</span>
                  )}
                </div>

                {/* Brand */}
                {product.brand && (
                  <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 16 }}>
                    Brand: <span style={{ color: 'var(--text-2)', fontWeight: 600 }}>{product.brand}</span>
                  </p>
                )}

                {/* Description */}
                <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 28 }}>
                  {product.description}
                </p>

                {/* Cart section customers only, state-driven */}
                {!isAdmin && (
                  <div style={{ marginBottom: 20 }}>
                    {cartQty === 0 ? (
                      <button
                        onClick={() => addToCart(product)}
                        className="btn-primary wide"
                        style={{ padding: '13px', justifyContent: 'center' }}
                      >
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Add to Cart
                      </button>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{
                          display: 'inline-flex', alignItems: 'center',
                          border: '2px solid var(--accent)', borderRadius: 'var(--r-md)',
                          overflow: 'hidden', background: 'var(--accent-dim)',
                        }}>
                          <button
                            onClick={() => decrement(product.id)}
                            style={{ width: 40, height: 40, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 20, color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >&#8722;</button>
                          <span style={{ minWidth: 36, textAlign: 'center', fontSize: 15, fontWeight: 800, color: 'var(--accent)', borderLeft: '1px solid rgba(79,70,229,0.25)', borderRight: '1px solid rgba(79,70,229,0.25)', lineHeight: '40px', height: 40 }}>
                            {cartQty}
                          </span>
                          <button
                            onClick={() => increment(product.id)}
                            style={{ width: 40, height: 40, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 20, color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >+</button>
                        </div>
                        <span style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 500 }}>
                          {cartQty} in cart
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Edit / Delete - admins only */}
                {isAdmin && (
                  <div style={{ marginBottom: 28 }}>
                    <div style={{ display: 'flex', gap: 10, marginBottom: confirmDelete ? 8 : 0 }}>
                      <Link to={`/products/${product.id}/edit`} className="btn-sec" style={{ flex: 1, justifyContent: 'center' }}>
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Product
                      </Link>
                      {!confirmDelete ? (
                        <button className="btn-danger" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setConfirmDelete(true)}>
                          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      ) : (
                        <div style={{ flex: 1, display: 'flex', gap: 6 }}>
                          <button
                            className="btn-danger"
                            style={{ flex: 1, justifyContent: 'center', fontSize: 12 }}
                            disabled={isDeleting}
                            onClick={handleDelete}
                          >
                            {isDeleting ? 'Deleting' : 'Confirm delete'}
                          </button>
                          <button
                            className="btn-sec"
                            style={{ flex: 1, justifyContent: 'center', fontSize: 12 }}
                            onClick={() => setConfirmDelete(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                    {confirmDelete && (
                      <p style={{ fontSize: 11, color: 'var(--text-3)', textAlign: 'center', margin: 0 }}>
                        Press <kbd style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 4, padding: '1px 5px', fontSize: 10 }}>ESC</kbd> to cancel
                      </p>
                    )}
                  </div>
                )}

                {/* Trust badges */}
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10,
                  padding: '16px', background: 'var(--surface-2)',
                  borderRadius: 'var(--r-lg)', border: '1px solid var(--border)',
                }}>
                  {TRUST.map((t) => (
                    <div key={t.label} style={{ textAlign: 'center' }}>
                      <svg width="20" height="20" fill="none" stroke="var(--accent)" viewBox="0 0 24 24" style={{ display: 'block', margin: '0 auto 6px' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={t.icon} />
                      </svg>
                      <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-2)' }}>{t.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Customer Reviews — sourced from DummyJSON product.reviews[] */}
            {product.reviews && product.reviews.length > 0 && (
              <div className="ent-card anim-fade-up" style={{ marginTop: 32, padding: '24px 28px' }}>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', marginBottom: 20 }}>
                  Customer Reviews
                  <span className="badge badge-indigo" style={{ marginLeft: 10, fontSize: 12 }}>
                    {product.reviews.length}
                  </span>
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {product.reviews.map((review, idx) => (
                    <div
                      key={idx}
                      style={{
                        paddingBottom: idx < product.reviews!.length - 1 ? 16 : 0,
                        borderBottom: idx < product.reviews!.length - 1 ? '1px solid var(--border)' : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        {/* Reviewer avatar — initials */}
                        <div style={{
                          width: 32, height: 32, borderRadius: '50%',
                          background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 12, fontWeight: 700, color: 'white', flexShrink: 0,
                        }}>
                          {review.reviewerName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', margin: 0 }}>
                            {review.reviewerName}
                          </p>
                          <p style={{ fontSize: 11, color: 'var(--text-3)', margin: 0 }}>
                            {new Date(review.date).toLocaleDateString()}
                          </p>
                        </div>
                        {/* Star rating for this review */}
                        <div style={{ marginLeft: 'auto', display: 'inline-flex', gap: 2 }}>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg key={i} width="12" height="12" viewBox="0 0 24 24"
                              fill={i < review.rating ? ratingColor(review.rating) : 'none'}
                              stroke={ratingColor(review.rating)} strokeWidth={2}>
                              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p style={{ fontSize: 14, color: 'var(--text-2)', margin: 0, lineHeight: 1.6 }}>
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
