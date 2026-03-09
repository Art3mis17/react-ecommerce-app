import { useState, useEffect } from 'react';
import type { Product } from '../models/types';
import { getProductById } from '../services/productService';

// Custom hook – fetches a single product by id
const useProduct = (id: number) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setError('');

    getProductById(id)
      .then(setProduct)
      .catch(() => setError('Product not found or failed to load.'))
      .finally(() => setIsLoading(false));
  }, [id]);

  return { product, isLoading, error };
};

export default useProduct;
