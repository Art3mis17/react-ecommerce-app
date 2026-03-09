const ratingColor = (r: number) => r >= 3.5 ? '#22C55E' : r >= 2.5 ? '#F59E0B' : '#EF4444';

interface StarRatingProps {
  rating: number;
  /** 'sm' = 12px stars (product cards), 'md' = 17px stars (detail page) */
  size?: 'sm' | 'md';
  /** When provided, shows "(N reviews)" after the score — only used in md size */
  count?: number;
}

const StarRating = ({ rating, size = 'md', count }: StarRatingProps) => {
  const color  = ratingColor(rating);
  const px     = size === 'sm' ? 12 : 17;
  const filled = size === 'sm' ? Math.round(rating) : Math.floor(rating);
  const sw     = size === 'sm' ? 2 : 1.5;

  const stars = (
    <span style={{ display: 'inline-flex', gap: size === 'sm' ? 2 : 3 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width={px} height={px} viewBox="0 0 24 24"
          fill={i < filled ? color : 'none'} stroke={color} strokeWidth={sw}>
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </span>
  );

  if (size === 'sm') {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        {stars}
        <span style={{ fontSize: 11, color, fontWeight: 600, marginLeft: 4 }}>{rating?.toFixed(1)}</span>
      </span>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {stars}
      <span style={{ fontSize: 14, fontWeight: 700, color }}>{rating.toFixed(1)}</span>
      {count !== undefined && (
        <span style={{ fontSize: 13, color: 'var(--text-3)' }}>({count.toLocaleString()} reviews)</span>
      )}
    </div>
  );
};

export default StarRating;
