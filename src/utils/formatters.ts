/** Convert a DummyJSON category slug to a display label: "mens-shirts" → "Mens Shirts" */
export const slugToLabel = (slug: string): string =>
  slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
