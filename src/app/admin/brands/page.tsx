'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useNotification } from '@/contexts/NotificationContextNew';
import LucideIcon from '../../../components/ui/icons/LucideIcon';

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

const BrandsPage = () => {
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

  const fetchBrands = useCallback(async (page = 1) => {
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
        throw new Error(data.message || 'Failed to fetch brands');
      }

      if (data.success) {
        setBrands(data.data.brands);
        setPagination(data.data.pagination);
      } else {
        throw new Error(data.message || 'Failed to fetch brands');
      }
    } catch (err: any) {
      console.error('Fetch brands error:', err);
      setError(err.message);
      addNotification({
        type: 'error',
        message: 'Failed to load brands'
      });
    } finally {
      setLoading(false);
    }
  }, [pagination.limit, addNotification, searchTerm]);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

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
        throw new Error(data.message || 'Failed to upload logo');
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
          message: 'Logo uploaded successfully'
        });
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      console.error('Upload logo error:', err);
      addNotification({
        type: 'error',
        message: err.message || 'Failed to upload logo'
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
        throw new Error(data.message || `Failed to ${editingBrand ? 'update' : 'create'} brand`);
      }

      if (data.success) {
        addNotification({
          type: 'success',
          message: `Brand ${editingBrand ? 'updated' : 'created'} successfully`
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
        message: err.message || `Failed to ${editingBrand ? 'update' : 'create'} brand`
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
    if (!confirm('Are you sure you want to delete this brand? This action cannot be undone.')) {
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
        throw new Error(data.message || 'Failed to delete brand');
      }

      if (data.success) {
        addNotification({
          type: 'success',
          message: 'Brand deleted successfully'
        });
        fetchBrands(pagination.page);
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      console.error('Delete brand error:', err);
      addNotification({
        type: 'error',
        message: err.message || 'Failed to delete brand'
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
            <LucideIcon name="xcircle" size="lg" className="text-red-500" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
              <button
                onClick={() => fetchBrands()}
                className="mt-3 text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded"
              >
                Try Again
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
          <h1 className="text-2xl font-bold text-gray-900">Brands</h1>
          <p className="text-gray-600">Manage your product brands</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-logo-lime hover:bg-logo-lime/90 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
        >
          <LucideIcon name="plus" size="md" className="text-white" />
          Add Brand
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search brands..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                />
              <LucideIcon name="magnifyingglass" size="md" className="absolute left-3 top-2.5 text-gray-400" />
            </div>
          </div>
          <button
            onClick={handleSearch}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium"
          >
            Search
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
                  {editingBrand ? 'Edit Brand' : 'Add New Brand'}
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
                    Brand Logo
                  </label>
                  <div className="flex items-start gap-4">
                    {/* Logo Preview */}
                    <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                      {logoPreview ? (
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          className="w-full h-full object-contain rounded-lg"
                        />
                      ) : (
                        <LucideIcon name="certificate" size="xl" className="text-gray-400" />
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
                            Uploading...
                          </>
                        ) : (
                          <>
                            <LucideIcon name="plus" size="sm" className="mr-2" />
                            Choose Logo
                          </>
                        )}
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        JPEG, PNG, WebP, or SVG. Max 5MB.
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
                          Remove logo
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brand Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                      placeholder="Brand name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website
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
                      Email
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
                      Phone
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
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                    placeholder="Brand description"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sort Order
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
                      <span className="ml-2 text-sm text-gray-700">Active</span>
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
                      <span className="ml-2 text-sm text-gray-700">Featured</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-logo-lime hover:bg-logo-lime/90 text-white py-2 px-4 rounded-lg font-medium"
                  >
                    {editingBrand ? 'Update Brand' : 'Create Brand'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Brands Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <LucideIcon name="circlenotch" size="xl" className="animate-spin text-logo-lime" />
            <span className="ml-3 text-gray-600">Loading brands...</span>
          </div>
        ) : brands.length === 0 ? (
          <div className="text-center p-8">
            <LucideIcon name="certificate" size="3xl" className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No brands found</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first brand.</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 bg-logo-lime text-white rounded-lg hover:bg-logo-lime/90"
            >
              <LucideIcon name="plus" size="md" className="mr-2 text-white" />
              Add Brand
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Brand
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Products
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
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
                              <LucideIcon name="certificate" size="md" className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        
                        {/* Brand Info */}
                        <div>
                          <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                            {brand.name}
                            {brand.isFeatured && (
                              <LucideIcon name="star" size="sm" className="text-yellow-500" />
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
                            Website
                          </a>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{brand.email}</div>
                      <div className="text-sm text-gray-500">{brand.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {brand.productCount} products
                      </div>
                      {brand.averageRating > 0 && (
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <LucideIcon name="star" size="sm" className="text-yellow-500" />
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
                        {brand.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(brand)}
                          className="text-gray-600 hover:text-logo-lime"
                          title="Edit"
                        >
                          <LucideIcon name="settings" size="md" />
                        </button>
                        <button
                          onClick={() => handleDelete(brand._id)}
                          className="text-gray-600 hover:text-red-600"
                          title="Delete"
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

export default BrandsPage;
