import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import type { LoginCredentials } from '../models/types';
import priceTagIcon from '../assets/price-tag.svg';

type ActiveTab = 'admin' | 'customer';

// Feature bullet points displayed on the left brand panel (desktop only).
// Each entry pairs an SVG path (d attribute) with a short description string.
const FEATURES = [
  { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', text: 'Role-based access || Shop as customer or Manage as admin' },
  { icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z', text: 'Cart management with live quantity controls' },
  { icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z', text: 'Browse thousands of products with category filters' },
];

const LoginPage = () => {
  useEffect(() => { document.title = 'Sign In | CartCrazy'; }, []);

  const { login, loginAsCustomer, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<ActiveTab>('admin');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginCredentials>();

  useEffect(() => {
    if (isAuthenticated) navigate('/products', { replace: true });
  }, [isAuthenticated, navigate]);

  // Switches login mode. Resets the form and clears messages so
  // the user starts fresh without stale error/success text.
  const switchTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    reset();
    setErrorMessage('');
    setSuccessMessage('');
  };

  /**
   * Form submission — two separate login paths:
   *  admin    -> synchronous check against hardcoded demo credentials
   *              (plus an artificial 600 ms delay to feel like a real request)
   *  customer -> async POST to DummyJSON; any valid DummyJSON user works
   *              e.g. username: emilys / password: emilyspass
   *
   * On success: shows success banner, then navigates to /products after 500 ms.
   * On failure: shows the error from the auth function.
   */
  const onSubmit: SubmitHandler<LoginCredentials> = async (data) => {
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    if (activeTab === 'admin') {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const result = login(data);
      setLoading(false);
      if (result.success) {
        setSuccessMessage(result.message);
        setTimeout(() => navigate('/products'), 500);
      } else {
        setErrorMessage(result.message);
      }
    } else {
      const result = await loginAsCustomer(data.username, data.password);
      setLoading(false);
      if (result.success) {
        setSuccessMessage(result.message);
        setTimeout(() => navigate('/products'), 500);
      } else {
        setErrorMessage(result.message);
      }
    }
  };

  return (
    <div className="login-root">

      {/*  Left panel Brand  */}
      <div className="login-left hide-mobile">
        {/* Background decoration */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 360, height: 360, borderRadius: '50%', background: 'rgba(139,92,246,0.22)', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(99,102,241,0.18)', filter: 'blur(50px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '38%', left: '28%', width: 220, height: 220, borderRadius: '50%', background: 'rgba(167,139,250,0.12)', filter: 'blur(30px)', pointerEvents: 'none' }} />
        <svg aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.16 }} viewBox="0 0 500 900" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="login-dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.3" fill="rgba(196,181,253,0.9)" />
            </pattern>
          </defs>
          <rect width="500" height="900" fill="url(#login-dots)" />
        </svg>

        {/* Logo */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 13, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
              <img src={priceTagIcon} width={22} height={22} alt="" />
            </div>
            <span style={{ color: 'white', fontWeight: 800, fontSize: 20, letterSpacing: '-0.03em' }}>CartCrazy</span>
          </div>
        </div>

        {/* Main message */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(167,139,250,1)', fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
            Your Favourite Shopping Destination
          </p>
          <h1 style={{ color: 'white', fontSize: 40, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 20 }}>
            Big brands.<br />Bigger savings.
          </h1>
          <p style={{ color: 'rgba(196,181,253,0.85)', fontSize: 15, lineHeight: 1.65, marginBottom: 40, maxWidth: 400 }}>
            Shop thousands of products across electronics, fashion, home &amp; more.
            Deals so good, you&apos;ll wonder why you ever paid full price.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, background: 'rgba(139,92,246,0.30)', border: '1px solid rgba(139,92,246,0.40)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="14" height="14" fill="none" stroke="rgba(196,181,253,1)" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={f.icon} />
                  </svg>
                </div>
                <span style={{ fontSize: 14, color: 'rgba(196,181,253,0.90)', lineHeight: 1.55 }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trust strip */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 'var(--r-md)', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
            <svg width="14" height="14" fill="none" stroke="rgba(196,181,253,1)" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span style={{ fontSize: 12, color: 'rgba(196,181,253,0.80)', fontWeight: 500 }}>Trusted by 2M+ happy shoppers</span>
          </div>
        </div>
      </div>

      {/*  Right panel  Form  */}
      <div className="login-right">

        {/* Mobile brand strip */}
        <div className="hide-desktop login-mobile-brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={priceTagIcon} width={18} height={18} alt="" />
            </div>
            <span style={{ color: 'white', fontWeight: 800, fontSize: 18 }}>CartCrazy</span>
          </div>
          <p style={{ color: 'rgba(196,181,253,0.9)', fontSize: 13, margin: '8px 0 0' }}>Big brands. Bigger savings.</p>
        </div>

        <div className="anim-fade-up login-form-wrap">
          <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)', marginBottom: 4 }}>
            Welcome back
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 28 }}>
            Sign in to your account to continue.
          </p>

          {/* Role tabs */}
          <div style={{ display: 'flex', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 10, padding: 4, marginBottom: 24 }} role="tablist">
            {(['admin', 'customer'] as const).map((tab) => {
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => switchTab(tab)}
                  style={{
                    flex: 1, padding: '9px 12px', borderRadius: 7,
                    fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer',
                    transition: 'all 0.18s',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    background: active ? 'var(--accent)' : 'transparent',
                    color: active ? 'white' : 'var(--text-2)',
                    boxShadow: active ? '0 2px 8px rgba(79,70,229,0.30)' : 'none',
                  }}
                >
                  {tab === 'admin' ? (
                    <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  ) : (
                    <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                  {tab === 'admin' ? 'Admin' : 'Customer'}
                </button>
              );
            })}
          </div>

          {/* Error / Success */}
          {errorMessage && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--error-dim)', border: '1px solid rgba(239,68,68,0.20)', borderRadius: 'var(--r-md)', padding: '12px 14px', marginBottom: 18, color: 'var(--error)' }} role="alert">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M6.938 17h10.124C18.368 17 19.33 15.333 18.56 14L13.56 5c-.77-1.333-2.694-1.333-3.464 0L5.096 14c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p style={{ fontSize: 13, fontWeight: 500, margin: 0 }}>{errorMessage}</p>
            </div>
          )}
          {successMessage && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--success-dim)', border: '1px solid rgba(16,185,129,0.20)', borderRadius: 'var(--r-md)', padding: '12px 14px', marginBottom: 18, color: 'var(--success)' }} role="status">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p style={{ fontSize: 13, fontWeight: 500, margin: 0 }}>{successMessage}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label className="ent-label" htmlFor="login-username">Username</label>
              <input
                id="login-username"
                type="text"
                placeholder="Enter your username"
                autoComplete="username"
                className={`ent-input${errors.username ? ' error' : ''}`}
                {...register('username', { required: 'Username is required' })}
              />
              {errors.username && <p style={{ marginTop: 5, fontSize: 12, color: 'var(--error)', fontWeight: 500 }}>{errors.username.message}</p>}
            </div>

            <div>
              <label className="ent-label" htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                className={`ent-input${errors.password ? ' error' : ''}`}
                {...register('password', { required: 'Password is required' })}
              />
              {errors.password && <p style={{ marginTop: 5, fontSize: 12, color: 'var(--error)', fontWeight: 500 }}>{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary wide"
              style={{ marginTop: 4, padding: '13px 22px' }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 15, height: 15, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', animation: 'spin 1s linear infinite' }} />
                  Signing in
                </span>
              ) : (
                <>
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  {activeTab === 'admin' ? 'Sign In as Admin' : 'Sign In as Customer'}
                </>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div style={{ marginTop: 24, padding: '14px 16px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)' }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
              {activeTab === 'admin' ? 'Admin credentials' : 'Demo customer credentials'}
            </p>
            {activeTab === 'admin' ? (
              <p style={{ fontSize: 13, color: 'var(--text-2)', margin: 0 }}>
                Username: <strong style={{ color: 'var(--text)' }}>admin</strong>&nbsp;&nbsp;
                Password: <strong style={{ color: 'var(--text)' }}>admin</strong>
              </p>
            ) : (
              <p style={{ fontSize: 13, color: 'var(--text-2)', margin: 0 }}>
                Username: <strong style={{ color: 'var(--text)' }}>emilys</strong>&nbsp;&nbsp;
                Password: <strong style={{ color: 'var(--text)' }}>emilyspass</strong>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
