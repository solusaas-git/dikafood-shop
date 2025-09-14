'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '../../utils/i18n';
import LucideIcon from '../ui/icons/LucideIcon';

const TopProducts = () => {
  const { t } = useTranslation();
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        setLoading(true);
        
        // Import the API service
        const { api } = await import('../../services/api.js');
        
        // Use the API service which handles authentication headers correctly
        const response = await api.request('/admin/dashboard/top-products');
        
        if (response.success) {
          console.log('Top products data:', response.data);
          setTopProducts(response.data);
        } else {
          setError(response.message || t('admin.error.loadingProducts'));
        }
      } catch (err) {
        setError(t('admin.error.loadingProducts'));
        console.error('Top products error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex items-center space-x-4 p-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="text-right">
                  <div className="h-5 bg-gray-200 rounded w-12 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-16 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-14 mb-1"></div>
                  <div className="h-2 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
        </div>
        <div className="text-center py-8">
          <LucideIcon name="alertcircle" size="lg" color="red" className="mx-auto mb-3" />
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{t('admin.products.top')}</h3>
        <Link 
          href="/admin/products"
          className="text-sm text-logo-lime hover:text-logo-lime/80 font-medium"
        >
          {t('admin.products.viewAll')}
        </Link>
      </div>

      <div className="space-y-4">
        {topProducts.map((product, index) => (
          <div 
            key={`top-product-${index}-${product.id}`} 
            className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors"
          >
            <div className="flex items-center space-x-4">
              {/* Rank Badge */}
              <div className="flex-shrink-0">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  index === 0 ? 'bg-yellow-100 text-yellow-800' :
                  index === 1 ? 'bg-gray-100 text-gray-800' :
                  index === 2 ? 'bg-orange-100 text-orange-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {index + 1}
                </div>
              </div>

              {/* Product Image */}
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-200">
                <img 
                  src={product.image || '/images/placeholder-brand.svg'} 
                  alt={product.name}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    // Try different fallbacks
                    if (e.target.src.includes('placeholder-brand.svg')) {
                      e.target.src = '/images/logo.svg';
                    } else if (!e.target.src.includes('placeholder-brand.svg')) {
                      e.target.src = '/images/placeholder-brand.svg';
                    }
                  }}
                />
              </div>

              {/* Product Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium text-gray-900 truncate">
                    {product.name}
                  </h4>
                  {product.variant !== 'Default' && (
                    <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                      {product.variant}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {product.brand} • {product.price.toLocaleString()} MAD
                </p>
              </div>
            </div>
            
            {/* Sales Stats */}
            <div className="text-right flex-shrink-0">
              <p className="text-lg font-semibold text-gray-900">
                {product.totalOrdered}
              </p>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                {t('admin.products.unitsSold')}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {product.orderCount} {t('admin.products.orders')}
              </p>
              <p className="text-xs text-gray-400">
                ~{Math.round(product.totalOrdered / product.orderCount)} {t('admin.products.perOrder')}
              </p>
            </div>
          </div>
        ))}
      </div>

      {topProducts.length === 0 && !loading && (
        <div className="text-center py-8">
          <LucideIcon name="package" size="lg" color="gray" className="mx-auto mb-3" />
          <p className="text-gray-500">{t('admin.products.noData')}</p>
        </div>
      )}
    </div>
  );
};

export default TopProducts;
