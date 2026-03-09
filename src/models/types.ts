// Product model matching DummyJSON API — https://dummyjson.com/docs/products
interface ProductReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  /** Primary image (DummyJSON calls this 'thumbnail') */
  thumbnail: string;
  /** Additional product images */
  images?: string[];
  /** Aggregate star rating (0–5 scale) */
  rating?: number;
  /** Number of items currently in stock */
  stock?: number;
  /** Percentage discount off the listed price */
  discountPercentage?: number;
  brand?: string;
  availabilityStatus?: string;
  /** Individual customer reviews */
  reviews?: ProductReview[];
  tags?: string[];
}

// Cart item extends product with quantity
export interface CartItem extends Product {
  quantity: number;
}

/** Allowed role values — drives access control throughout the app. */
type UserRole = 'admin' | 'customer';

// Auth models
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  /** Assigned locally after login; not part of the API response. */
  role?: UserRole;
}

export interface LoginCredentials {
  username: string;
  password: string;
}
