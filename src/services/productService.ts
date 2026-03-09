import axios from 'axios';
import type { Product } from '../models/types';

/**
 * DummyJSON Products API — https://dummyjson.com/docs/products
 *
 * NOTE: All write operations (POST /add, PATCH /:id, DELETE /:id) are
 * simulated by DummyJSON — they return a valid response but do NOT persist
 * changes server-side. The localStorage override layer below compensates so
 * admin edits remain visible after navigating away.
 */
const BASE_URL = 'https://dummyjson.com/products';

// ─── DummyJSON list response wrapper ────────────────────────────────────────
// All list/search/category endpoints return { products: [...], total, skip, limit }
interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

// ─── Local edit overrides ─────────────────────────────────────────────────────
// DummyJSON simulates writes without persisting them. We save PATCH results to
// localStorage so admin edits stay visible across navigation.
const OVERRIDES_KEY = 'cartcrazy_product_overrides';

const getOverrides = (): Record<number, Product> => {
  try { return JSON.parse(localStorage.getItem(OVERRIDES_KEY) || '{}'); }
  catch { return {}; }
};

/** Merges a product into the local override map. Called after every successful update. */
const setProductOverride = (product: Product): void => {
  const overrides = getOverrides();
  overrides[product.id] = product;
  localStorage.setItem(OVERRIDES_KEY, JSON.stringify(overrides));
};

/** Removes a single product from the override map. Called after a successful delete. */
export const clearProductOverride = (id: number): void => {
  const overrides = getOverrides();
  delete overrides[id];
  localStorage.setItem(OVERRIDES_KEY, JSON.stringify(overrides));
};
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch all products.
 * limit=0 returns the full catalog (DummyJSON default page size is 30).
 */
export const getAllProducts = async (limit = 0): Promise<Product[]> => {
  const response = await axios.get<ProductsResponse>(`${BASE_URL}?limit=${limit}`);
  return response.data.products;
};

/**
 * Fetch a single product by id.
 * Checks the local override cache first so admin edits are immediately reflected.
 */
export const getProductById = async (id: number): Promise<Product> => {
  const overrides = getOverrides();
  if (overrides[id]) return overrides[id];
  const response = await axios.get<Product>(`${BASE_URL}/${id}`);
  return response.data;
};

/**
 * Full-text search across product titles, descriptions and categories.
 * Uses DummyJSON's dedicated search endpoint: /products/search?q=
 */
export const searchProducts = async (q: string): Promise<Product[]> => {
  const response = await axios.get<ProductsResponse>(
    `${BASE_URL}/search?q=${encodeURIComponent(q)}`,
  );
  return response.data.products;
};

/**
 * Fetch the flat list of category slug strings.
 * e.g. ["beauty", "smartphones", "laptops", ...]
 * Uses /category-list to get plain strings directly (not the richer /categories objects).
 */
export const getAllCategories = async (): Promise<string[]> => {
  const response = await axios.get<string[]>(`${BASE_URL}/category-list`);
  return response.data;
};

/** Fetch all products belonging to a specific category slug. */
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  const response = await axios.get<ProductsResponse>(`${BASE_URL}/category/${category}`);
  return response.data.products;
};

/**
 * Simulate creating a new product.
 * DummyJSON's create endpoint is POST /products/add.
 * Returns the new product with a fake incremented id; changes are not persisted.
 */
export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  const response = await axios.post<Product>(`${BASE_URL}/add`, product);
  return response.data;
};

/**
 * Simulate updating a product via PATCH.
 * DummyJSON returns the merged product. We also persist locally via
 * setProductOverride so the change is visible until the session is cleared.
 */
export const updateProduct = async (id: number, product: Partial<Product>): Promise<Product> => {
  const response = await axios.patch<Product>(`${BASE_URL}/${id}`, product);
  // Merge API response with our payload to ensure all sent fields are reflected
  const updated: Product = { ...response.data, ...product, id };
  setProductOverride(updated);
  return updated;
};

/**
 * Simulate deleting a product.
 * Caller must also call clearProductOverride(id) to clean up the local cache.
 */
export const deleteProduct = async (id: number): Promise<Product> => {
  const response = await axios.delete<Product>(`${BASE_URL}/${id}`);
  return response.data;
};
