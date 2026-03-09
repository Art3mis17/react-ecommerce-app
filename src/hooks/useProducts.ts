import { useState, useEffect } from 'react';
import type { Product } from '../models/types';
import { getAllProducts, getAllCategories, getProductsByCategory, searchProducts } from '../services/productService';

/**
 * Custom hook — fetches the product catalog with support for:
 *  - Category filtering (via DummyJSON /category/:slug)
 *  - Full-text search    (via DummyJSON /search?q=)
 *
 * Priority: if searchQuery is set it wins over selectedCategory.
 * Clearing both returns the full catalog.
 */
const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Load the category list once on mount — independent of the product fetch
  useEffect(() => {
    getAllCategories()
      .then(setCategories)
      .catch((err) => console.error('Failed to load categories', err));
  }, []);

  // Re-fetch products whenever the search query or selected category changes.
  // Keyword search takes priority over category filter.
  useEffect(() => {
    setIsLoading(true);
    setError('');

    let request: Promise<Product[]>;

    if (searchQuery.trim()) {
      // Full-text search — ignores category filter while active
      request = searchProducts(searchQuery.trim());
    } else if (selectedCategory) {
      request = getProductsByCategory(selectedCategory);
    } else {
      // No filter — fetch all products (limit=0 returns the full catalog)
      request = getAllProducts(0);
    }

    request
      .then(setProducts)
      .catch(() => setError('Failed to load products. Please try again later.'))
      .finally(() => setIsLoading(false));
  }, [selectedCategory, searchQuery]);

  return {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    isLoading,
    error,
  };
};

export default useProducts;

