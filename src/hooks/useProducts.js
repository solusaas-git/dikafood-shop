/**
 * 📦 Products Hook - Clean Product Data Management
 * Custom hook for product operations using the new API service
 */

import { useState, useEffect } from 'react';
import { api } from '../services/api.js';

export const useProducts = (initialParams = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const loadProducts = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.getProducts({ ...initialParams, ...params });
      
      if (response.success && response.data) {
        setProducts(response.data.products || response.data);
        setTotal(response.data.total || response.data.length);
        setCurrentPage(params.page || 1);
      } else {
        setError(response.message || 'Failed to load products');
      }
    } catch (err) {
      console.error('Failed to load products:', err);
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, []);

  return {
    products,
    loading,
    error,
    total,
    currentPage,
    loadProducts,
    refresh: () => loadProducts({ page: currentPage })
  };
};

export const useProduct = (productId) => {
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadProduct = async () => {
    if (!productId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const [productResponse, variantsResponse] = await Promise.all([
        api.getProduct(productId),
        api.getProductVariants(productId)
      ]);
      
      if (productResponse.success && productResponse.data) {
        setProduct(productResponse.data);
      } else {
        setError(productResponse.message || 'Failed to load product');
      }
      
      if (variantsResponse.success && variantsResponse.data) {
        setVariants(variantsResponse.data);
      }
    } catch (err) {
      console.error('Failed to load product:', err);
      setError(err.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [productId]);

  return {
    product,
    variants,
    loading,
    error,
    refresh: loadProduct
  };
};

export const useFeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadFeaturedProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.getFeaturedProducts();
      
      if (response.success && response.data) {
        setProducts(response.data);
      } else {
        setError(response.message || 'Failed to load featured products');
      }
    } catch (err) {
      console.error('Failed to load featured products:', err);
      setError(err.message || 'Failed to load featured products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  return {
    products,
    loading,
    error,
    refresh: loadFeaturedProducts
  };
};

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.getCategories();
      
      if (response.success && response.data) {
        setCategories(response.data);
      } else {
        setError(response.message || 'Failed to load categories');
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
      setError(err.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refresh: loadCategories
  };
};

export const useBrands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadBrands = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.getBrands();
      
      if (response.success && response.data) {
        setBrands(response.data);
      } else {
        setError(response.message || 'Failed to load brands');
      }
    } catch (err) {
      console.error('Failed to load brands:', err);
      setError(err.message || 'Failed to load brands');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBrands();
  }, []);

  return {
    brands,
    loading,
    error,
    refresh: loadBrands
  };
}; 