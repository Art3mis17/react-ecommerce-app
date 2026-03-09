import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  useEffect(() => { document.title = '404 Not Found | CartCrazy'; }, []);

  return (
  <div className="ent-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
    <div className="anim-fade-up" style={{ textAlign: 'center', maxWidth: 480, padding: '0 24px' }}>

      <div style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 80, height: 80, borderRadius: 24, marginBottom: 24,
        background: 'linear-gradient(135deg, var(--accent-dim), rgba(124,58,237,0.12))',
        border: '1px solid var(--border)',
      }}>
        <svg width="36" height="36" fill="none" stroke="var(--accent)" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <p style={{
        fontSize: 96, fontWeight: 900, lineHeight: 1,
        margin: '0 0 12px',
        background: 'linear-gradient(135deg, var(--accent) 0%, #7C3AED 100%)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}>
        404
      </p>

      <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 12, letterSpacing: '-0.025em' }}>
        Page Not Found
      </h1>

      <p style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 32 }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Let&apos;s get you back on track.
      </p>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <Link to="/products" className="btn-primary" style={{ textDecoration: 'none' }}>
          <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
          Browse Products
        </Link>
      </div>
    </div>
  </div>
  );
};

export default NotFoundPage;