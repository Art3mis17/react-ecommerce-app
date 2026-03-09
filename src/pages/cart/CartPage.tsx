import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

const CartPage = () => {
  useEffect(() => { document.title = 'Cart | CartCrazy'; }, []);

  const { cartItems, increment, decrement, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  // Controls whether the checkout success notification is visible
  const [checkedOut, setCheckedOut] = useState(false);

  // Confirmation states for destructive actions
  const [confirmRemoveId, setConfirmRemoveId] = useState<number | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  // ESC dismisses any open confirmation dialog
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setConfirmRemoveId(null);
      setConfirmClear(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  /**
   * Simulates placing an order:
   * 1. Shows the success notification banner immediately (checkedOut = true)
   * 2. After 2 s clears the cart and navigates back to the catalog
   */
  const handleCheckout = () => {
    setCheckedOut(true);
    setTimeout(() => {
      clearCart();
      navigate('/products');
    }, 2000);
  };

  // Derived totals — recomputed on every render (no memoization needed at this scale)
  const total = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const itemCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className="ent-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
        <div className="ent-card anim-fade-up" style={{ textAlign: 'center', maxWidth: 400, padding: '48px 40px' }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20, background: 'var(--surface-2)',
            border: '1px solid var(--border)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 24px',
          }}>
            <svg width="32" height="32" fill="none" stroke="var(--text-3)" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Your cart is empty</h2>
          <p style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 28 }}>
            Looks like you haven&apos;t added anything yet. Start exploring our catalog.
          </p>
          <Link to="/products" className="btn-primary wide" style={{ textDecoration: 'none' }}>
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="ent-page">
      {/*
        Inline checkout success banner.
        position: fixed keeps it pinned to the top-center of the viewport above all content.
        It auto-disappears when handleCheckout's setTimeout fires and navigates away.
        Uses the notif-drop spring animation defined in index.css.
        NOTE: This is self-contained — it is NOT wired to any global toast/context.
      */}
      {checkedOut && (
        <>
          <div style={{
            position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)',
            zIndex: 9999,
            background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
            color: '#fff', borderRadius: 12, padding: '13px 22px',
            display: 'flex', alignItems: 'center', gap: 10,
            fontWeight: 600, fontSize: 14,
            boxShadow: '0 8px 32px rgba(0,0,0,0.22)',
            animation: 'notif-drop 0.42s cubic-bezier(0.34,1.56,0.64,1) both',
            whiteSpace: 'nowrap',
          }}>
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            Order placed! Redirecting…
          </div>
        </>
      )}
      <div className="ent-container">

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Shopping</p>
            <h1 className="ent-title" style={{ margin: 0, display: 'inline-flex', alignItems: 'center', gap: 12 }}>
              Your Cart
              <span className="badge badge-indigo">{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
            </h1>
          </div>
          <button className="btn-ghost" onClick={() => setConfirmClear(true)}
            style={{ fontSize: 13, color: 'var(--error)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear all
          </button>
        </div>

        {/* Clear all confirmation */}
        {confirmClear && (
          <div className="anim-fade-up" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap',
            gap: 12, padding: '12px 18px', marginBottom: 20, borderRadius: 'var(--r-lg)',
            background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.18)',
          }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--error)' }}>
              Remove all {itemCount} {itemCount === 1 ? 'item' : 'items'} from your cart?
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-danger" style={{ padding: '6px 16px', fontSize: 12 }}
                onClick={() => { clearCart(); setConfirmClear(false); }}>
                Yes, clear cart
              </button>
              <button className="btn-sec" style={{ padding: '6px 16px', fontSize: 12 }}
                onClick={() => setConfirmClear(false)}>
                Cancel
              </button>
            </div>
            <span style={{ fontSize: 11, color: 'var(--text-3)', width: '100%' }}>Press Esc to cancel</span>
          </div>
        )}

        <div className="cart-layout">

          {/* Items column — single card, divider-separated rows */}
          <div className="ent-card" style={{ padding: 0, overflow: 'hidden' }}>
            {cartItems.map((item, idx) => (
              <div
                key={item.id}
                className="cart-item-row anim-fade-up"
                style={{
                  padding: '20px 24px',
                  borderBottom: idx < cartItems.length - 1 ? '1px solid var(--border)' : 'none',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                {/* Thumbnail */}
                <div className="cart-item-thumb">
                  <img src={item.thumbnail} alt={item.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>

                {/* Info */}
                <div style={{ minWidth: 0 }}>
                  <span className="badge badge-neutral" style={{ marginBottom: 8, textTransform: 'capitalize', fontSize: 11 }}>{item.category}</span>
                  <p className="clamp-2" style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', lineHeight: 1.4, marginBottom: 6 }}>{item.title}</p>
                  <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em' }}>
                    ${(item.price * item.quantity).toFixed(2)}
                    {item.quantity > 1 && (
                      <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-3)', marginLeft: 8 }}>
                        ${item.price.toFixed(2)} each
                      </span>
                    )}
                  </p>
                </div>

                {/* Controls */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12, flexShrink: 0 }}>
                  {/* Stepper */}
                  <div style={{
                    display: 'inline-flex', alignItems: 'center',
                    border: '1.5px solid var(--border)',
                    borderRadius: 'var(--r-md)',
                    overflow: 'hidden',
                    background: 'var(--surface)',
                  }}>
                    <button
                      onClick={() => decrement(item.id)}
                      style={{
                        width: 34, height: 34, border: 'none', background: 'transparent',
                        cursor: 'pointer', fontSize: 18, fontWeight: 300, color: 'var(--text-2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'background 0.12s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >−</button>
                    <span style={{
                      minWidth: 36, textAlign: 'center', fontSize: 14, fontWeight: 700,
                      color: 'var(--text)', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)',
                      height: 34, lineHeight: '34px',
                    }}>{item.quantity}</span>
                    <button
                      onClick={() => increment(item.id)}
                      style={{
                        width: 34, height: 34, border: 'none', background: 'transparent',
                        cursor: 'pointer', fontSize: 18, fontWeight: 300, color: 'var(--text-2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'background 0.12s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >+</button>
                  </div>
                  {/* Remove */}
                  {confirmRemoveId === item.id ? (
                    <div className="anim-fade-up" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <button
                        onClick={() => { removeFromCart(item.id); setConfirmRemoveId(null); }}
                        className="btn-danger"
                        style={{ padding: '4px 10px', fontSize: 11, lineHeight: 1 }}
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setConfirmRemoveId(null)}
                        className="btn-sec"
                        style={{ padding: '4px 10px', fontSize: 11, lineHeight: 1 }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                  <button
                    onClick={() => setConfirmRemoveId(item.id)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                      fontSize: 12, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 4,
                      transition: 'color 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--error)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}
                  >
                    <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Remove
                  </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Summary sidebar */}
          <div className="cart-summary">
            {/* Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', margin: 0 }}>Order Summary</h2>
            </div>

            {/* Line items */}
            <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {cartItems.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                  <span className="clamp-1" style={{ fontSize: 13, color: 'var(--text-2)', flex: 1 }}>
                    {item.title} × {item.quantity}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap' }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Breakdown */}
            <div style={{ padding: '14px 24px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Subtotal', value: `$${total.toFixed(2)}` },
                { label: 'Shipping', value: null },
                { label: 'Tax (8%)', value: `$${(total * 0.08).toFixed(2)}` },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{label}</span>
                  {value
                    ? <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{value}</span>
                    : <span className="badge badge-green" style={{ fontSize: 11, padding: '2px 10px' }}>Free</span>
                  }
                </div>
              ))}
            </div>

            {/* Total */}
            <div style={{
              padding: '16px 24px',
              borderTop: '2px solid var(--border)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>Total</span>
              <span style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--text)' }}>
                ${(total * 1.08).toFixed(2)}
              </span>
            </div>

            {/* Actions */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                className="btn-primary wide"
                onClick={handleCheckout}
                disabled={checkedOut}
              >
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Secure Checkout
              </button>
              <Link
                to="/products"
                className="btn-sec wide"
                style={{ textDecoration: 'none', justifyContent: 'center' }}
              >
                Continue Shopping
              </Link>
            </div>

            {/* SSL badge */}
            <div style={{
              padding: '12px 24px',
              background: 'var(--surface-2)',
              borderTop: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            }}>
              <svg width="13" height="13" fill="none" stroke="var(--success)" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 500 }}>SSL encrypted · 256-bit secure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;