'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useNotification } from '@/contexts/NotificationContextNew';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useTranslation } from '../../../utils/i18n';
import LucideIcon from '../../../components/ui/icons/LucideIcon';
import { PaginationControls } from '../../../components/ui/navigation/Pagination';

interface Product {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  brandDisplayName: string;
  categoryName: string;
  status: 'draft' | 'active' | 'inactive' | 'discontinued';
  featured: boolean;
  isOrganic?: boolean;
  variants: Array<{
    _id: string;
    size: string;
    price: number;
    promotionalPrice?: number;
    stock: number;
    sku: string;
    weight?: number;
    isActive: boolean;
  }>;
  totalStock: number;
  minPrice: number;
  maxPrice: number;
  averageRating?: number;
  reviewCount?: number;
  totalSales?: number;
  viewCount?: number;
  images?: Array<{
    url: string;
    alt: string;
    isPrimary: boolean;
  }>;
  tags?: string[];
  features?: string[];
  allergens?: string[];
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const ProductsPage = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [featuredFilter, setFeaturedFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Column visibility
  const [visibleColumns, setVisibleColumns] = useState({
    product: true,
    brand: true,
    price: true,
    stock: true,
    status: true,
    rating: false,
    sales: false,
    views: false,
    variants: false,
    tags: false,
    organic: false,
    created: false,
    updated: false
  });

  const [showColumnToggler, setShowColumnToggler] = useState(false);

  const { addNotification } = useNotification();

  const handleItemsPerPageChange = (newLimit: number) => {
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
    fetchProducts(1, newLimit);
  };

  const fetchProducts = async (page = 1, limit = pagination.limit) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder
      });

      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter) params.append('status', statusFilter);
      if (featuredFilter) params.append('featured', featuredFilter);

      const response = await fetch(`/api/admin/products?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch products');
      }

      if (data.success) {
        setProducts(data.data.products);
        setPagination(data.data.pagination);
      } else {
        throw new Error(data.message || t('admin.products.fetchError'));
      }
    } catch (err: any) {
      console.error('Fetch products error:', err);
      setError(err.message);
      addNotification({
        type: 'error',
        message: t('admin.products.fetchError')
      });
    } finally {
      setLoading(false);
    }
  };

  // Authentication check
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/admin/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchProducts();
    }
  }, [sortBy, sortOrder, authLoading, isAuthenticated]);

  // Close column toggler when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showColumnToggler && !target.closest('[data-column-toggler]')) {
        setShowColumnToggler(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showColumnToggler]);

  const handleSearch = () => {
    fetchProducts(1);
  };

  const handleStatusChange = async (productId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update product status');
      }

      if (data.success) {
        addNotification({
          type: 'success',
          message: t('admin.products.statusUpdated')
        });
        fetchProducts(pagination.page);
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      console.error('Update status error:', err);
      addNotification({
        type: 'error',
        message: err.message || t('admin.products.updateError')
      });
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm(t('admin.products.discontinueConfirm'))) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete product');
      }

      if (data.success) {
        addNotification({
          type: 'success',
          message: t('admin.products.discontinued')
        });
        fetchProducts(pagination.page);
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      console.error('Delete product error:', err);
      addNotification({
        type: 'error',
        message: err.message || t('admin.products.updateError')
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      draft: 'bg-gray-100 text-gray-800',
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-yellow-100 text-yellow-800',
      discontinued: 'bg-red-100 text-red-800'
    };

    const getStatusText = (status: string) => {
      const statusMap = {
        'draft': t('admin.products.status.draft'),
        'active': t('admin.products.status.active'),
        'inactive': t('admin.products.status.inactive'),
        'discontinued': t('admin.products.status.discontinued')
      };
      return statusMap[status as keyof typeof statusMap] || status;
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status as keyof typeof statusStyles] || statusStyles.draft}`}>
        {getStatusText(status)}
      </span>
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MAD'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatRating = (rating: number, reviewCount: number) => {
    return (
      <div className="flex items-center gap-1">
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <LucideIcon
              key={star}
              name="star"
              size="sm"
              className={star <= rating ? "text-yellow-500" : "text-gray-300"}
            />
          ))}
        </div>
        <span className="text-xs text-gray-500">({reviewCount})</span>
      </div>
    );
  };

  const getPriceDisplay = (product: Product) => {
    // Safety checks
    if (!product.variants || product.variants.length === 0) {
      return <span className="text-sm text-gray-400">{t('admin.products.noVariants')}</span>;
    }

    // Check if any variant has promotional pricing
    const variantsWithPromo = product.variants.filter(v => v.promotionalPrice && v.promotionalPrice > 0);
    const hasPromotion = variantsWithPromo.length > 0;
    
    if (hasPromotion) {
      const promoPrice = variantsWithPromo.map(v => v.promotionalPrice!);
      const minPromoPrice = Math.min(...promoPrice);
      const maxPromoPrice = Math.max(...promoPrice);
      
      return (
        <div>
          <div className="text-sm font-medium text-green-600">
            {minPromoPrice === maxPromoPrice
              ? formatPrice(minPromoPrice)
              : `${formatPrice(minPromoPrice)} - ${formatPrice(maxPromoPrice)}`
            }
          </div>
          <div className="text-xs text-gray-500 line-through">
            {(product.minPrice && product.maxPrice) ? (
              product.minPrice === product.maxPrice
                ? formatPrice(product.minPrice)
                : `${formatPrice(product.minPrice)} - ${formatPrice(product.maxPrice)}`
            ) : 'N/A'}
          </div>
        </div>
      );
    }
    
    // Regular pricing
    if (product.minPrice && product.maxPrice) {
      return (
        <div className="text-sm text-gray-900">
          {product.minPrice === product.maxPrice
            ? formatPrice(product.minPrice)
            : `${formatPrice(product.minPrice)} - ${formatPrice(product.maxPrice)}`
          }
        </div>
      );
    }

    // Fallback: calculate from variants directly
    const prices = product.variants.map(v => v.price).filter(p => p && p > 0);
    if (prices.length > 0) {
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      return (
        <div className="text-sm text-gray-900">
          {minPrice === maxPrice
            ? formatPrice(minPrice)
            : `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`
          }
        </div>
      );
    }

    return <span className="text-sm text-gray-400">{t('admin.products.noPrice')}</span>;
  };

  const toggleColumn = (columnKey: string) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey as keyof typeof prev]
    }));
  };

  const getVisibleColumnsCount = () => {
    return Object.values(visibleColumns).filter(Boolean).length + 1; // +1 for actions column
  };

  // Don't render anything if not authenticated or still loading
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-logo-lime"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <LucideIcon name="xcircle" size="lg" color="error" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{t('admin.products.error')}</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
              <button
                onClick={() => fetchProducts()}
                className="mt-3 text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded"
              >
                {t('admin.products.retryFetch')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('admin.products.title')}</h1>
          <p className="text-gray-600">{t('admin.products.subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Column Toggler */}
          <div className="relative" data-column-toggler>
            <button
              onClick={() => setShowColumnToggler(!showColumnToggler)}
              className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2"
            >
              <LucideIcon name="gear" size="md" />
              {t('admin.products.columns')} ({getVisibleColumnsCount()})
            </button>
            
            {showColumnToggler && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">{t('admin.products.showHideColumns')}</h3>
                  <div className="space-y-2">
                    {[
                      { key: 'product', label: t('admin.products.columns.productInfo'), required: true },
                      { key: 'brand', label: t('admin.products.columns.brandCategory') },
                      { key: 'price', label: t('admin.products.columns.priceRange') },
                      { key: 'stock', label: t('admin.products.columns.stock') },
                      { key: 'status', label: t('admin.products.columns.status') },
                      { key: 'rating', label: t('admin.products.columns.ratingReviews') },
                      { key: 'sales', label: t('admin.products.columns.salesViews') },
                      { key: 'variants', label: t('admin.products.columns.variantDetails') },
                      { key: 'tags', label: t('admin.products.columns.tagsFeatures') },
                      { key: 'organic', label: t('admin.products.columns.organicStatus') },
                      { key: 'created', label: t('admin.products.columns.createdDate') },
                      { key: 'updated', label: t('admin.products.columns.updatedDate') }
                    ].map((column) => (
                      <label key={column.key} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={visibleColumns[column.key as keyof typeof visibleColumns]}
                          onChange={() => !column.required && toggleColumn(column.key)}
                          disabled={column.required}
                          className="rounded border-gray-300 text-logo-lime focus:ring-logo-lime disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <span className={`text-sm ${column.required ? 'text-gray-500' : 'text-gray-700'}`}>
                          {column.label}
                          {column.required && <span className="text-xs ml-1">{t('admin.products.required')}</span>}
                        </span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <button
                      onClick={() => setShowColumnToggler(false)}
                      className="w-full text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded"
                    >
                      {t('admin.products.close')}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <Link
            href="/admin/products/new"
            className="bg-logo-lime hover:bg-logo-lime/90 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
          >
            <LucideIcon name="plus" size="md" color="white" />
            {t('admin.products.addProduct')}
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('admin.products.filters.search')}
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder={t('admin.products.filters.searchPlaceholder')}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
              />
              <LucideIcon name="magnifyingglass" size="md" color="gray" className="absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('admin.products.filters.status')}
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
            >
              <option value="">{t('admin.products.filters.allStatuses')}</option>
              <option value="draft">{t('admin.products.status.draft')}</option>
              <option value="active">{t('admin.products.status.active')}</option>
              <option value="inactive">{t('admin.products.status.inactive')}</option>
              <option value="discontinued">{t('admin.products.status.discontinued')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('admin.products.filters.featured')}
            </label>
            <select
              value={featuredFilter}
              onChange={(e) => setFeaturedFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
            >
              <option value="">{t('admin.products.filters.allProducts')}</option>
              <option value="true">{t('admin.products.featured.yes')}</option>
              <option value="false">{t('admin.products.featured.no')}</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleSearch}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium"
            >
              {t('admin.products.filters.searchButton')}
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <LucideIcon name="circlenotch" size="xl" color="logo-lime" className="animate-spin" />
            <span className="ml-3 text-gray-600">{t('admin.products.loadingProducts')}</span>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center p-8">
            <LucideIcon name="shoppingcart" size="3xl" color="gray" className="mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('admin.products.noProductsFound')}</h3>
            <p className="text-gray-600 mb-4">{t('admin.products.getStarted')}</p>
            <Link
              href="/admin/products/new"
              className="inline-flex items-center px-4 py-2 bg-logo-lime text-white rounded-lg hover:bg-logo-lime/90"
            >
              <LucideIcon name="plus" size="md" color="white" className="mr-2" />
              {t('admin.products.addFirstProduct')}
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {visibleColumns.product && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('admin.products.table.product')}
                      </th>
                    )}
                    {visibleColumns.brand && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('admin.products.table.brandCategory')}
                      </th>
                    )}
                    {visibleColumns.price && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('admin.products.table.priceRange')}
                      </th>
                    )}
                    {visibleColumns.stock && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('admin.products.table.stock')}
                      </th>
                    )}
                    {visibleColumns.status && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('admin.products.table.status')}
                      </th>
                    )}
                    {visibleColumns.rating && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('admin.products.table.ratingReviews')}
                      </th>
                    )}
                    {visibleColumns.sales && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('admin.products.table.salesViews')}
                      </th>
                    )}
                    {visibleColumns.variants && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('admin.products.table.variantDetails')}
                      </th>
                    )}
                    {visibleColumns.tags && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('admin.products.table.tagsFeatures')}
                      </th>
                    )}
                    {visibleColumns.organic && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('admin.products.table.organicStatus')}
                      </th>
                    )}
                    {visibleColumns.created && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('admin.products.table.createdDate')}
                      </th>
                    )}
                    {visibleColumns.updated && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('admin.products.table.updatedDate')}
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.products.table.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      {visibleColumns.product && (
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {product.images && product.images.length > 0 && (
                              <div className="flex-shrink-0 cursor-pointer group relative" title={`${product.images.length} image${product.images.length !== 1 ? 's' : ''} - Click to view all`}>
                                <img
                                  src={product.images.find(img => img.isPrimary)?.url || product.images[0]?.url}
                                  alt={product.images.find(img => img.isPrimary)?.alt || product.name}
                                  className="h-12 w-12 rounded-lg object-contain bg-gray-50 border border-gray-200 group-hover:border-logo-lime transition-colors"
                                />
                                {product.images.length > 1 && (
                                  <div className="absolute -top-1 -right-1 bg-logo-lime text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                                    {product.images.length}
                                  </div>
                                )}
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                {product.name}
                                {product.featured && (
                                  <LucideIcon name="star" size="sm" color="warning" />
                                )}
                              </div>
                              <div className="text-sm text-gray-500">{product.slug}</div>
                              {product.shortDescription && (
                                <div className="text-xs text-gray-400 mt-1 max-w-xs truncate">
                                  {product.shortDescription}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      )}
                      
                      {visibleColumns.brand && (
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{product.brandDisplayName}</div>
                          <div className="text-sm text-gray-500">{product.categoryName}</div>
                        </td>
                      )}
                      
                      {visibleColumns.price && (
                        <td className="px-6 py-4">
                          {getPriceDisplay(product)}
                          <div className="text-sm text-gray-500 mt-1">
                            {product.variants.length} {product.variants.length === 1 ? t('admin.products.variants').slice(0, -1) : t('admin.products.variants')}
                          </div>
                        </td>
                      )}
                      
                      {visibleColumns.stock && (
                        <td className="px-6 py-4">
                          <div className={`text-sm font-medium ${
                            (product.totalStock || 0) > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {product.totalStock || 0} {t('admin.products.inStock')}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.variants?.filter(v => v.isActive).length || 0} actives
                          </div>
                        </td>
                      )}
                      
                      {visibleColumns.status && (
                        <td className="px-6 py-4">
                          {getStatusBadge(product.status)}
                        </td>
                      )}
                      
                      {visibleColumns.rating && (
                        <td className="px-6 py-4">
                          {product.averageRating && product.reviewCount ? (
                            formatRating(product.averageRating, product.reviewCount)
                          ) : (
                            <span className="text-sm text-gray-400">Aucun avis</span>
                          )}
                        </td>
                      )}
                      
                      {visibleColumns.sales && (
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {product.totalSales || 0} {t('admin.products.sales')}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.viewCount || 0} {t('admin.products.views')}
                          </div>
                        </td>
                      )}
                      
                      {visibleColumns.variants && (
                        <td className="px-6 py-4">
                          {product.variants && product.variants.length > 0 ? (
                            <div className="space-y-1">
                              {product.variants.slice(0, 3).map((variant, idx) => (
                                <div key={variant._id || idx} className="text-xs">
                                  <span className="font-medium">{variant.size || 'N/A'}</span>
                                  <span className="text-gray-500 ml-2">
                                    {variant.promotionalPrice && variant.promotionalPrice > 0
                                      ? formatPrice(variant.promotionalPrice)
                                      : variant.price 
                                        ? formatPrice(variant.price)
                                        : 'N/A'
                                    } ({variant.stock || 0})
                                  </span>
                                </div>
                              ))}
                              {product.variants.length > 3 && (
                                <div className="text-xs text-gray-400">
                                  +{product.variants.length - 3} {t('admin.products.variants')}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">{t('admin.products.noVariants')}</span>
                          )}
                        </td>
                      )}
                      
                      {visibleColumns.tags && (
                        <td className="px-6 py-4">
                          {product.tags && product.tags.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {product.tags.slice(0, 3).map((tag, idx) => (
                                <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {tag}
                                </span>
                              ))}
                              {product.tags.length > 3 && (
                                <span className="text-xs text-gray-400">+{product.tags.length - 3}</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">No tags</span>
                          )}
                          {product.features && product.features.length > 0 && (
                            <div className="text-xs text-gray-500 mt-1">
                              {product.features.length} feature{product.features.length !== 1 ? 's' : ''}
                            </div>
                          )}
                        </td>
                      )}
                      
                      {visibleColumns.organic && (
                        <td className="px-6 py-4">
                          {product.isOrganic ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <LucideIcon name="leaf" size="sm" className="mr-1" />
                              {t('admin.products.organic')}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400">{t('admin.products.notOrganic')}</span>
                          )}
                        </td>
                      )}
                      
                      {visibleColumns.created && (
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{formatDate(product.createdAt)}</div>
                        </td>
                      )}
                      
                      {visibleColumns.updated && (
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{formatDate(product.updatedAt)}</div>
                        </td>
                      )}
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/products/${product._id}`}
                            className="text-gray-600 hover:text-logo-lime"
                            title="View"
                          >
                            <LucideIcon name="eye" size="md" />
                          </Link>
                          <Link
                            href={`/admin/products/${product._id}/edit`}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit"
                          >
                            <LucideIcon name="pencil" size="md" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="text-gray-600 hover:text-red-600"
                            title="Delete"
                          >
                            <LucideIcon name="trash" size="md" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.total > 0 && (
              <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                <PaginationControls
                  currentPage={pagination.page}
                  totalPages={pagination.pages}
                  totalItems={pagination.total}
                  itemsPerPage={pagination.limit}
                  onPageChange={(page) => fetchProducts(page)}
                  onItemsPerPageChange={handleItemsPerPageChange}
                  options={[10, 20, 50, 100]}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
