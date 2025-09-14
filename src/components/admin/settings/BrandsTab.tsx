'use client';

import React, { useState, useEffect } from 'react';
import { useNotification } from '@/contexts/NotificationContextNew';
import LucideIcon from '../../ui/icons/LucideIcon';
import { useTranslation } from '@/utils/i18n';

interface Brand {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: {
    url: string;
    alt: string;
  };
  website?: string;
  email?: string;
  phone?: string;
  isActive: boolean;
  isFeatured: boolean;
  productCount: number;
  averageRating: number;
  totalSales: number;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface BrandsResponse {
  brands: Brand[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const BrandsTab = () => {
  const { t } = useTranslation();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    email: '',
    phone: '',
    isActive: true,
    isFeatured: false,
    sortOrder: 0,
    logo: {
      url: '',
      alt: ''
    }
  });

  // File upload state
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const { addNotification } = useNotification();

  const fetchBrands = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        includeInactive: 'true'
      });

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await fetch(`/api/admin/brands?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t('admin.settings.brands.errors.fetchFailed'));
      }

      if (data.success) {
        setBrands(data.data.brands);
        setPagination(data.data.pagination);
      } else {
        throw new Error(data.message || t('admin.settings.brands.errors.fetchFailed'));
      }
    } catch (err: any) {
      console.error('Fetch brands error:', err);
      setError(err.message);
      addNotification({
        type: 'error',
        message: t('admin.settings.brands.errors.loadFailed')
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleLogoUpload = async (file: File) => {
    try {
      setUploadingLogo(true);
      
      const uploadFormData = new FormData();
      uploadFormData.append('logo', file);

      const response = await fetch('/api/admin/brands/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: uploadFormData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t('admin.settings.brands.errors.uploadFailed'));
      }

      if (data.success) {
        setFormData(prev => ({
          ...prev,
          logo: {
            url: data.data.url,
            alt: formData.name || 'Brand logo'
          }
        }));
        setLogoPreview(data.data.url);
        addNotification({
          type: 'success',
          message: t('admin.settings.brands.notifications.uploadSuccess')
        });
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      console.error('Upload logo error:', err);
      addNotification({
        type: 'error',
        message: err.message || t('admin.settings.brands.errors.uploadFailed')
      });
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Auto-upload
      handleLogoUpload(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingBrand 
        ? `/api/admin/brands/${editingBrand._id}`
        : '/api/admin/brands';
      
      const method = editingBrand ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t(editingBrand ? 'admin.settings.brands.errors.updateFailed' : 'admin.settings.brands.errors.createFailed'));
      }

      if (data.success) {
        addNotification({
          type: 'success',
          message: t(editingBrand ? 'admin.settings.brands.notifications.updateSuccess' : 'admin.settings.brands.notifications.createSuccess')
        });
        
        setShowForm(false);
        setEditingBrand(null);
        resetForm();
        fetchBrands(pagination.page);
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      console.error('Submit brand error:', err);
      addNotification({
        type: 'error',
        message: err.message || t(editingBrand ? 'admin.settings.brands.errors.updateFailed' : 'admin.settings.brands.errors.createFailed')
      });
    }
  };

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      description: brand.description || '',
      website: brand.website || '',
      email: brand.email || '',
      phone: brand.phone || '',
      isActive: brand.isActive,
      isFeatured: brand.isFeatured,
      sortOrder: brand.sortOrder,
      logo: brand.logo || { url: '', alt: '' }
    });
    setLogoPreview(brand.logo?.url || '');
    setShowForm(true);
  };

  const handleDelete = async (brandId: string) => {
    if (!confirm(t('admin.settings.brands.confirmDelete'))) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/brands/${brandId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t('admin.settings.brands.errors.deleteFailed'));
      }

      if (data.success) {
        addNotification({
          type: 'success',
          message: t('admin.settings.brands.notifications.deleteSuccess')
        });
        fetchBrands(pagination.page);
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      console.error('Delete brand error:', err);
      addNotification({
        type: 'error',
        message: err.message || t('admin.settings.brands.errors.deleteFailed')
      });
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingBrand(null);
    setFormData({
      name: '',
      description: '',
      website: '',
      email: '',
      phone: '',
      isActive: true,
      isFeatured: false,
      sortOrder: 0,
      logo: { url: '', alt: '' }
    });
    setLogoFile(null);
    setLogoPreview('');
  };

  const handleSearch = () => {
    fetchBrands(1);
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <LucideIcon name="xcircle" size="lg" color="error" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{t('admin.settings.brands.error')}</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
              <button
                onClick={() => fetchBrands()}
                className="mt-3 text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded"
              >
                {t('admin.settings.brands.tryAgain')}
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
          <h2 className="text-xl font-semibold text-gray-900">{t('admin.settings.brands.title')}</h2>
          <p className="text-gray-600">{t('admin.settings.brands.subtitle')}</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-logo-lime hover:bg-logo-lime/90 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
        >
          <LucideIcon name="plus" size="md" color="white" />
          {t('admin.settings.brands.addBrand')}
        </button>
      </div>

      {/* Search */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder={t('admin.settings.brands.searchPlaceholder')}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
              />
              <LucideIcon name="magnifyingglass" size="md" color="gray" className="absolute left-3 top-2.5" />
            </div>
          </div>
          <button
            onClick={handleSearch}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium"
          >
            {t('admin.settings.brands.search')}
          </button>
        </div>
      </div>

      {/* Brand Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {editingBrand ? t('admin.settings.brands.editBrand') : t('admin.settings.brands.addNewBrand')}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <LucideIcon name="x" size="lg" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Logo Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('admin.settings.brands.brandLogo')}
                  </label>
                  <div className="flex items-start gap-4">
                    {/* Logo Preview */}
                    <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                      {logoPreview ? (
                        <img
                          src={logoPreview}
                          alt={t('admin.settings.brands.logoPreview')}
                          className="w-full h-full object-contain rounded-lg"
                        />
                      ) : (
                        <LucideIcon name="certificate" size="xl" color="gray" />
                      )}
                    </div>
                    
                    {/* Upload Controls */}
                    <div className="flex-1">
                      <input
                        type="file"
                        id="logo-upload"
                        accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="logo-upload"
                        className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium cursor-pointer hover:bg-gray-50 ${
                          uploadingLogo ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {uploadingLogo ? (
                          <>
                            <LucideIcon name="circlenotch" size="sm" className="animate-spin mr-2" />
                            {t('admin.settings.brands.uploading')}
                          </>
                        ) : (
                          <>
                            <LucideIcon name="plus" size="sm" className="mr-2" />
                            {t('admin.settings.brands.chooseLogo')}
                          </>
                        )}
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        {t('admin.settings.brands.logoFormat')}
                      </p>
                      {logoPreview && (
                        <button
                          type="button"
                          onClick={() => {
                            setLogoPreview('');
                            setFormData(prev => ({ ...prev, logo: { url: '', alt: '' } }));
                          }}
                          className="text-red-600 hover:text-red-800 text-sm mt-1"
                        >
                          {t('admin.settings.brands.removeLogo')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('admin.settings.brands.brandName')} *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                      placeholder={t('admin.settings.brands.brandNamePlaceholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('admin.settings.brands.website')}
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                      placeholder="https://example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('admin.settings.brands.email')}
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                      placeholder="contact@brand.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('admin.settings.brands.phone')}
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                      placeholder="+212 6XX XXX XXX"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.settings.brands.description')}
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                    placeholder={t('admin.settings.brands.descriptionPlaceholder')}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('admin.settings.brands.sortOrder')}
                    </label>
                    <input
                      type="number"
                      value={formData.sortOrder}
                      onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-center mt-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="rounded border-gray-300 text-logo-lime focus:ring-logo-lime"
                      />
                      <span className="ml-2 text-sm text-gray-700">{t('admin.settings.brands.active')}</span>
                    </label>
                  </div>

                  <div className="flex items-center mt-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                        className="rounded border-gray-300 text-logo-lime focus:ring-logo-lime"
                      />
                      <span className="ml-2 text-sm text-gray-700">{t('admin.settings.brands.featured')}</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-logo-lime hover:bg-logo-lime/90 text-white py-2 px-4 rounded-lg font-medium"
                  >
                    {editingBrand ? t('admin.settings.brands.updateBrand') : t('admin.settings.brands.createBrand')}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium"
                  >
                    {t('admin.settings.brands.cancel')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Brands Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <LucideIcon name="circlenotch" size="xl" color="logo-lime" className="animate-spin" />
            <span className="ml-3 text-gray-600">{t('admin.settings.brands.loadingBrands')}</span>
          </div>
        ) : brands.length === 0 ? (
          <div className="text-center p-8">
            <LucideIcon name="certificate" size="3xl" color="gray" className="mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('admin.settings.brands.noBrandsFound')}</h3>
            <p className="text-gray-600 mb-4">{t('admin.settings.brands.getStarted')}</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 bg-logo-lime text-white rounded-lg hover:bg-logo-lime/90"
            >
              <LucideIcon name="plus" size="md" color="white" className="mr-2" />
              {t('admin.settings.brands.addBrand')}
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.settings.brands.brand')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.settings.brands.contact')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.settings.brands.products')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.settings.brands.status')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.settings.brands.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {brands.map((brand) => (
                  <tr key={brand._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* Brand Logo */}
                        <div className="w-12 h-12 flex-shrink-0">
                          {brand.logo?.url ? (
                            <img
                              src={brand.logo.url}
                              alt={brand.logo.alt || brand.name}
                              className="w-full h-full object-contain rounded-lg border border-gray-200"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                              <LucideIcon name="certificate" size="md" color="gray" />
                            </div>
                          )}
                        </div>
                        
                        {/* Brand Info */}
                        <div>
                          <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                            {brand.name}
                            {brand.isFeatured && (
                              <LucideIcon name="star" size="sm" color="warning" />
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{brand.slug}</div>
                          {brand.description && (
                            <div className="text-sm text-gray-500 mt-1 max-w-xs truncate">
                              {brand.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {brand.website && (
                          <a 
                            href={brand.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-logo-lime hover:text-logo-lime/80"
                          >
                            {t('admin.settings.brands.website')}
                          </a>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{brand.email}</div>
                      <div className="text-sm text-gray-500">{brand.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {brand.productCount} {t('admin.settings.brands.productsCount')}
                      </div>
                      {brand.averageRating > 0 && (
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <LucideIcon name="star" size="sm" color="warning" />
                          {brand.averageRating.toFixed(1)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        brand.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {brand.isActive ? t('admin.settings.brands.active') : t('admin.settings.brands.inactive')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(brand)}
                          className="text-gray-600 hover:text-logo-lime"
                          title={t('admin.settings.brands.edit')}
                        >
                          <LucideIcon name="gear" size="md" />
                        </button>
                        <button
                          onClick={() => handleDelete(brand._id)}
                          className="text-gray-600 hover:text-red-600"
                          title={t('admin.settings.brands.delete')}
                          disabled={brand.productCount > 0}
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
        )}
      </div>
    </div>
  );
};

export default BrandsTab;
