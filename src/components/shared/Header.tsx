import { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import priceTagIcon from '../../assets/price-tag.svg';

const Header = () => {
  const { isAuthenticated, currentUser, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/products', { replace: true });
  };

  return (
    <header className="nav-root" style={{ position: 'relative' }}>
      {/* Dot-grid — fades out before nav items via SVG mask */}
      <svg aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, width: 180, height: 64, pointerEvents: 'none', opacity: 0.13, zIndex: 0 }} viewBox="0 0 180 64" fill="none">
        <defs>
          <pattern id="hdr-dots" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill="#4F46E5" />
          </pattern>
          <linearGradient id="hdr-fade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="40%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id="hdr-mask">
            <rect width="180" height="64" fill="url(#hdr-fade)" />
          </mask>
        </defs>
        <rect width="180" height="64" fill="url(#hdr-dots)" mask="url(#hdr-mask)" />
      </svg>
      {/* Soft glow strictly behind brand icon */}
      <div style={{ position: 'absolute', left: -20, top: -20, width: 110, height: 110, borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,70,229,0.10) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      {/*  Desktop inner  */}
      <div className="nav-inner hide-mobile" style={{ position: 'relative', zIndex: 1 }}>
        <Link to="/products" className="nav-brand">
          <div className="nav-brand-icon">
            <img src={priceTagIcon} width={22} height={22} alt="" />
          </div>
          <span className="nav-brand-name">CartCrazy</span>
        </Link>

        <nav className="nav-items">
          <NavLink to="/products" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Products
          </NavLink>
          {isAdmin && (
            <NavLink to="/products/new" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Product
            </NavLink>
          )}
        </nav>

        <div className="nav-right">
          {/* Cart — visible to guests and customers, hidden for admins */}
          {!isAdmin && (
            <Link to="/cart" className="nav-cart-btn">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Cart
              {totalItems > 0 && <span className="nav-cart-badge">{totalItems}</span>}
            </Link>
          )}
          {/* Authenticated user info */}
          {isAuthenticated && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 'var(--r-md)', background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'white' }}>
                  {currentUser?.username?.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-2)' }}>{currentUser?.username}</span>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 'var(--r-pill)',
                  background: isAdmin ? 'rgba(79,70,229,0.12)' : 'rgba(16,185,129,0.12)',
                  color: isAdmin ? 'var(--accent)' : 'var(--success)',
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                }}>
                  {isAdmin ? 'Admin' : 'Customer'}
                </span>
              </div>
              <button onClick={handleLogout} className="btn-sec" style={{ padding: '7px 14px', fontSize: 13 }}>Sign out</button>
            </>
          )}
          {/* Guest sign-in CTA */}
          {!isAuthenticated && !isLoginPage && (
            <Link to="/login" className="btn-primary" style={{ padding: '8px 18px', fontSize: 14, width: 'auto' }}>Sign in</Link>
          )}
        </div>
      </div>

      {/*  Mobile inner  */}
      <div className="nav-mobile-bar hide-desktop" style={{ position: 'relative', zIndex: 1 }}>
        {/* Left: hamburger */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="btn-icon"
            aria-label="Menu"
            style={{ position: 'relative', zIndex: 1 }}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {/* Center: logo */}
        <Link to="/products" className="nav-brand" style={{ margin: 0 }}>
          <div className="nav-brand-icon">
            <img src={priceTagIcon} width={22} height={22} alt="" />
          </div>
          <span className="nav-brand-name">CartCrazy</span>
        </Link>

        {/* Right: cart or sign-in */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          {!isAdmin ? (
            <Link to="/cart" className="nav-cart-btn" style={{ padding: '8px' }}>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && <span className="nav-cart-badge">{totalItems}</span>}
            </Link>
          ) : <div />}
        </div>
      </div>

      {/*  Mobile drawer menu  */}
      {mobileOpen && (
        <div className="nav-mobile-drawer anim-slide-down">
          {/* User row — only for authenticated users */}
          {isAuthenticated && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 20px 12px', borderBottom: '1px solid var(--border)', marginBottom: 6 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'white', flexShrink: 0 }}>
                {currentUser?.username?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', margin: 0 }}>{currentUser?.username}</p>
                <p style={{ fontSize: 12, color: 'var(--text-3)', margin: 0 }}>{isAdmin ? 'Administrator' : 'Customer'}</p>
              </div>
            </div>
          )}

          <NavLink to="/products" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} onClick={() => setMobileOpen(false)} style={{ padding: '11px 20px', borderRadius: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
            Products
          </NavLink>
          {isAdmin && (
            <NavLink to="/products/new" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} onClick={() => setMobileOpen(false)} style={{ padding: '11px 20px', borderRadius: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Add Product
            </NavLink>
          )}
          {!isAdmin && (
            <NavLink to="/cart" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} onClick={() => setMobileOpen(false)} style={{ padding: '11px 20px', borderRadius: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              Cart {totalItems > 0 && <span className="badge badge-indigo" style={{ marginLeft: 4 }}>{totalItems}</span>}
            </NavLink>
          )}

          <div style={{ padding: '10px 20px 16px', borderTop: '1px solid var(--border)', marginTop: 6 }}>
            {isAuthenticated ? (
              <button onClick={handleLogout} className="btn-danger wide" style={{ fontSize: 14 }}>
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                Sign out
              </button>
            ) : (
              <Link to="/login" className="btn-primary wide" style={{ fontSize: 14, textDecoration: 'none' }} onClick={() => setMobileOpen(false)}>
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;