'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useNotification } from '@/contexts/NotificationContextNew';
import { useTranslation } from '../../../../utils/i18n';
import LucideIcon from '../../../../components/ui/icons/LucideIcon';
import ImageThumbnailGallery from '../../../../components/admin/ImageThumbnailGallery';
import { api } from '../../../../services/api.js';

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  brand: {
    _id: string;
    name: string;
    slug: string;
    logo?: {
      url: string;
      alt: string;
    };
  };
  images: Array<{
    url: string;
    alt: string;
    isPrimary: boolean;
  }>;
  variants: Array<{
    _id: string;
    size: string; // This is the actual field name in DB
    name?: string; // Fallback for compatibility
    sku: string;
    price: number;
    promotionalPrice?: number;
    cost?: number;
    stock: number; // This is the actual field name in DB
    inventory?: {
      quantity: number;
      lowStockThreshold: number;
      trackQuantity: boolean;
    };
    weight?: number;
    dimensions?: {
      length: number;
      width: number;
      height: number;
    };
    isDefault?: boolean;
    isActive: boolean;
    featured?: boolean;
  }>;
  tags: string[];
  features: string[];
  allergens: string[];
  status: 'draft' | 'active' | 'archived';
  visibility: 'visible' | 'hidden';
  seo: {
    title?: string;
    description?: string;
    keywords: string[];
  };
  pricing: {
    basePrice: number;
    promotionalPrice?: number;
    cost?: number;
  };
  inventory: {
    trackQuantity: boolean;
    quantity: number;
    lowStockThreshold: number;
  };
  shipping: {
    weight?: number;
    dimensions?: {
      length: number;
      width: number;
      height: number;
    };
    requiresShipping: boolean;
  };
  totalSales: number;
  averageRating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

const ViewProductPage = () => {
  const params = useParams();
  const router = useRouter();
  const { addNotification } = useNotification();
  const { t } = useTranslation();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const productId = params.id as string;

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.request(`/admin/products/${productId}`, {
        method: 'GET'
      });

      if (response.success) {
        setProduct(response.data.product);
      } else {
        throw new Error(response.message || t('admin.viewProduct.errors.fetchFailed'));
      }
    } catch (err: any) {
      console.error('Fetch product error:', err);
      setError(err.message);
      addNotification({
        type: 'error',
        message: t('admin.viewProduct.errors.loadFailed')
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!product) return;
    
    if (!confirm(`${t('admin.viewProduct.confirmDelete')} "${product.name}"? ${t('admin.viewProduct.confirmDeleteWarning')}`)) {
      return;
    }

    try {
      const response = await api.request(`/admin/products/${productId}`, {
        method: 'DELETE'
      });

      if (response.success) {
        addNotification({
          type: 'success',
          message: t('admin.viewProduct.success.deleted')
        });
        router.push('/admin/products');
      } else {
        throw new Error(response.message || t('admin.viewProduct.errors.deleteFailed'));
      }
    } catch (err: any) {
      console.error('Delete product error:', err);
      addNotification({
        type: 'error',
        message: err.message || t('admin.viewProduct.errors.deleteFailed')
      });
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <LucideIcon name="circlenotch" size="xl" color="logo-lime" className="animate-spin" />
          <span className="ml-3 text-gray-600">{t('admin.viewProduct.loading')}</span>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <LucideIcon name="xcircle" size="lg" color="error" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{t('admin.viewProduct.error')}</h3>
              <p className="mt-1 text-sm text-red-700">{error || t('admin.viewProduct.errors.notFound')}</p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => fetchProduct()}
                  className="text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded"
                >
                  {t('admin.viewProduct.tryAgainButton')}
                </button>
                <Link
                  href="/admin/products"
                  className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded"
                >
                  {t('admin.viewProduct.backToProductsButton')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
  const totalInventory = product.variants.reduce((sum, variant) => sum + (variant.stock || variant.inventory?.quantity || 0), 0);
  const lowestPrice = product.variants.length > 0 ? Math.min(...product.variants.map(v => v.promotionalPrice || v.price || 0)) : 0;
  const highestPrice = product.variants.length > 0 ? Math.max(...product.variants.map(v => v.promotionalPrice || v.price || 0)) : 0;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="text-gray-600 hover:text-gray-900"
          >
            <LucideIcon name="arrowleft" size="lg" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <div className="flex items-center gap-4 mt-1">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                product.status === 'active' ? 'bg-green-100 text-green-800' :
                product.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {t(`admin.products.status.${product.status}`)}
              </span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                product.visibility === 'visible' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {t(`admin.editProduct.status.${product.visibility}`)}
              </span>
              {product.variants && product.variants.length > 0 && (
                <span className="text-sm text-gray-500">SKU: {product.variants[0]?.sku}</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/products/${productId}/edit`}
            className="bg-logo-lime hover:bg-logo-lime/90 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
          >
            <LucideIcon name="gear" size="md" color="white" />
            {t('admin.viewProduct.editButton')}
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
          >
            <LucideIcon name="trash" size="md" color="white" />
            {t('admin.viewProduct.deleteButton')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Images */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <ImageThumbnailGallery 
              images={product.images}
              title={t('admin.viewProduct.sections.productImages')}
              showControls={false}
              maxHeight="500px"
            />
          </div>

          {/* Product Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('admin.viewProduct.sections.productDetails')}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.addProduct.basicInfo.description')}</label>
                <div className="text-sm text-gray-900 whitespace-pre-wrap border border-gray-200 rounded-lg p-3 bg-gray-50">
                  {product.description || t('admin.viewProduct.noDescription')}
                </div>
              </div>
              
              {product.shortDescription && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.addProduct.basicInfo.shortDescription')}</label>
                  <div className="text-sm text-gray-900 border border-gray-200 rounded-lg p-3 bg-gray-50">
                    {product.shortDescription}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.viewProduct.categoryAndBrand')}</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <LucideIcon name="tag" size="sm" color="gray" />
                    <span className="text-sm text-gray-900">{product.category.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {product.brand.logo?.url ? (
                      <img 
                        src={product.brand.logo.url} 
                        alt={product.brand.name}
                        className="w-6 h-6 object-contain"
                      />
                    ) : (
                      <LucideIcon name="certificate" size="sm" color="gray" />
                    )}
                    <span className="text-sm text-gray-900">{product.brand.name}</span>
                  </div>
                </div>
              </div>

              {product.tags.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.addProduct.tags.title')}</label>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {product.features && product.features.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.addProduct.features.title')}</label>
                  <div className="space-y-2">
                    {product.features.map((feature, index) => (
                      <div key={index} className="bg-blue-50 text-blue-900 text-sm px-3 py-2 rounded-lg flex items-center gap-2">
                        <LucideIcon name="check" size="sm" color="blue" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {product.allergens && product.allergens.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.addProduct.allergies.title')}</label>
                  <div className="space-y-2">
                    {product.allergens.map((allergen, index) => (
                      <div key={index} className="bg-red-50 text-red-900 text-sm px-3 py-2 rounded-lg flex items-center gap-2">
                        <LucideIcon name="alerttriangle" size="sm" color="red" />
                        <span>{allergen}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Variants */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('admin.addProduct.variants.title')}</h2>
            {product.variants && product.variants.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('admin.viewProduct.table.variant')}</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('admin.addProduct.variants.sku')}</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('admin.viewProduct.table.price')}</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('admin.viewProduct.table.inventory')}</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('admin.viewProduct.table.featured')}</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('admin.viewProduct.table.status')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {product.variants.map((variant) => (
                    <tr key={variant._id}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">{variant.size || variant.name}</span>
                          {variant.isDefault && (
                            <span className="bg-logo-lime text-white text-xs px-2 py-1 rounded">{t('admin.viewProduct.defaultVariant')}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{variant.sku || t('admin.viewProduct.notAvailable')}</td>
                      <td className="px-4 py-3">
                        {variant.promotionalPrice ? (
                          <div>
                            <div className="text-sm font-medium text-green-600">${variant.promotionalPrice.toFixed(2)}</div>
                            <div className="text-xs text-gray-500 line-through">${variant.price.toFixed(2)}</div>
                          </div>
                        ) : (
                          <div className="text-sm font-medium text-gray-900">${(variant.price || 0).toFixed(2)}</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-900">{variant.stock || variant.inventory?.quantity || 0} {t('admin.viewProduct.units')}</div>
                        {(variant.stock || variant.inventory?.quantity || 0) <= (variant.inventory?.lowStockThreshold || 5) && (
                          <div className="text-xs text-red-600">{t('admin.viewProduct.lowStock')}</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {variant.featured ? (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 flex items-center gap-1 w-fit">
                            <LucideIcon name="star" size="xs" />
                            {t('admin.viewProduct.featured')}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          (variant.stock || variant.inventory?.quantity || 0) > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {(variant.stock || variant.inventory?.quantity || 0) > 0 ? t('admin.viewProduct.inStock') : t('admin.viewProduct.outOfStock')}
                        </span>
                      </td>
                    </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <LucideIcon name="storefront" size="3xl" color="gray" className="mx-auto mb-2" />
                <p>{t('admin.viewProduct.noVariants')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('admin.viewProduct.sections.quickStats')}</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{t('admin.viewProduct.stats.totalSales')}</span>
                <span className="text-sm font-medium text-gray-900">{product.totalSales}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{t('admin.viewProduct.stats.totalInventory')}</span>
                <span className="text-sm font-medium text-gray-900">{totalInventory} {t('admin.viewProduct.units')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{t('admin.viewProduct.stats.variants')}</span>
                <span className="text-sm font-medium text-gray-900">{product.variants?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{t('admin.viewProduct.stats.priceRange')}</span>
                <span className="text-sm font-medium text-gray-900">
                  {lowestPrice === highestPrice 
                    ? `$${lowestPrice.toFixed(2)}`
                    : `$${lowestPrice.toFixed(2)} - $${highestPrice.toFixed(2)}`
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('admin.viewProduct.sections.reviews')}</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <LucideIcon 
                      key={i} 
                      name="star" 
                      size="sm" 
                      className={i < Math.floor(product.averageRating) ? "text-yellow-500" : "text-gray-300"} 
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {product.averageRating.toFixed(1)} ({product.reviewCount} {t('admin.viewProduct.reviews')})
                </span>
              </div>
            </div>
          </div>

          {/* SEO */}
          {(product.seo?.title || product.seo?.description || (product.seo?.keywords && product.seo.keywords.length > 0)) && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('admin.addProduct.seo.title')}</h2>
              <div className="space-y-3">
                {product.seo?.title && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.addProduct.seo.seoTitle')}</label>
                    <p className="text-sm text-gray-900">{product.seo.title}</p>
                  </div>
                )}
                {product.seo?.description && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.addProduct.seo.seoDescription')}</label>
                    <p className="text-sm text-gray-900">{product.seo.description}</p>
                  </div>
                )}
                {product.seo?.keywords && product.seo.keywords.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.addProduct.seo.keywords')}</label>
                    <div className="flex flex-wrap gap-1">
                      {product.seo.keywords.map((keyword, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('admin.viewProduct.sections.timestamps')}</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{t('admin.viewProduct.timestamps.created')}</span>
                <span className="text-sm text-gray-900">{new Date(product.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{t('admin.viewProduct.timestamps.updated')}</span>
                <span className="text-sm text-gray-900">{new Date(product.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProductPage;
