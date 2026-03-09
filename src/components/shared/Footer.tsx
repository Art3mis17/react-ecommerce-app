import priceTagIcon from '../../assets/price-tag.svg';

const Footer = () => (
  <footer style={{
    background: 'var(--surface)',
    borderTop: '1px solid var(--border)',
    padding: '28px 24px',
    position: 'relative',
    overflow: 'hidden',
  }}>
    {/* Abstract: faint wave sweep */}
    <svg
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      viewBox="0 0 1200 80" preserveAspectRatio="none"
    >
      <path
        d="M0,40 C150,80 350,0 600,40 C850,80 1050,10 1200,40 L1200,80 L0,80 Z"
        fill="rgba(79,70,229,0.03)"
      />
      <path
        d="M0,55 C200,20 400,70 700,45 C900,30 1100,60 1200,50 L1200,80 L0,80 Z"
        fill="rgba(124,58,237,0.04)"
      />
    </svg>
    {/* Dot grid — right side */}
    <svg
      aria-hidden="true"
      style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: 200, pointerEvents: 'none', opacity: 0.13 }}
      viewBox="0 0 200 80"
    >
      <defs>
        <pattern id="ftr-dots" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="#4F46E5" />
        </pattern>
      </defs>
      <rect width="200" height="80" fill="url(#ftr-dots)" />
    </svg>
    <div className="ent-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className="nav-brand-icon" style={{ width: 28, height: 28, borderRadius: 8 }}>
          <img src={priceTagIcon} width={14} height={14} alt="" />
        </div>
        <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: '-0.02em', color: 'var(--text)' }}>CartCrazy</span>
      </div>
      <p style={{ fontSize: 13, color: 'var(--text-3)' }}>
        &copy; {new Date().getFullYear()} CartCrazy. Powered by{' '}
        <a href="https://dummyjson.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', fontWeight: 500 }}>DummyJSON API</a>.
      </p>
      <div style={{ display: 'flex', gap: 16 }}>
        {['Privacy', 'Terms', 'Support'].map(item => (
          <span key={item} style={{ fontSize: 13, color: 'var(--text-3)', cursor: 'default', transition: 'color 0.15s' }}>{item}</span>
        ))}
      </div>
    </div>
  </footer>
);

export default Footer;