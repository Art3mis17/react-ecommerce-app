type SpinnerProps = {
  message?: string;
  size?: 'sm' | 'md';
};

const LoadingSpinner = ({ message = 'Loading…', size = 'md' }: SpinnerProps) => {
  const dim = size === 'sm' ? 18 : 36;
  const isSm = size === 'sm';
  return (
    <div
      style={{
        display: 'inline-flex', flexDirection: isSm ? 'row' : 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: isSm ? 8 : 14,
        ...(isSm ? {} : { minHeight: 240 }),
      }}
    >
      <svg
        className="animate-spin"
        style={{ width: dim, height: dim, color: 'var(--accent)', flexShrink: 0 }}
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" style={{ opacity: 0.15 }} />
        <path fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
      {!isSm && (
        <span style={{ fontSize: 14, color: 'var(--text-3)', fontWeight: 500 }}>
          {message}
        </span>
      )}
    </div>
  );
};

export default LoadingSpinner;
