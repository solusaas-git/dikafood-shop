'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNotification } from '@/contexts/NotificationContextNew';
import LucideIcon from '../../ui/icons/LucideIcon';
import { useTranslation } from '@/utils/i18n';

interface DeliveryMethod {
  _id: string;
  name: string;
  description?: string;
  type: 'delivery' | 'pickup';
  price: number;
  estimatedTime: {
    min: number;
    max: number;
    unit: 'minutes' | 'hours' | 'days';
  };
  availableCities: Array<{
    _id: string;
    name: string;
    nameArabic?: string;
  }>;
  shops: Array<{
    name: string;
    address: string;
    city: string;
    phone?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  }>;
  isActive: boolean;
  sortOrder: number;
  icon: string;
  logo?: string;
  createdAt: string;
  updatedAt: string;
  displayName: string;
  timeDisplay: string;
}

interface City {
  _id: string;
  name: string;
  nameArabic?: string;
  region: string;
  deliveryFee: number;
}

const DeliveryMethodsTab = () => {
  const { t } = useTranslation();
  const [deliveryMethods, setDeliveryMethods] = useState<DeliveryMethod[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingMethod, setEditingMethod] = useState<DeliveryMethod | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'delivery' as 'delivery' | 'pickup',
    price: 0,
    estimatedTime: {
      min: 1,
      max: 2,
      unit: 'hours' as 'minutes' | 'hours' | 'days'
    },
    availableCities: [] as string[],
    shops: [] as Array<{
      name: string;
      address: string;
      city: string;
      phone: string;
    }>,
    isActive: true,
    sortOrder: 0,
    icon: 'truck',
    logo: ''
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  
  // City selection state
  const [citySearchTerm, setCitySearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');

  const { addNotification } = useNotification();

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchDeliveryMethods = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        includeInactive: 'true'
      });

      if (debouncedSearchTerm) {
        params.append('search', debouncedSearchTerm);
      }

      const response = await fetch(`/api/admin/delivery-methods?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t('admin.settings.deliveryMethods.errors.fetchFailed'));
      }

      if (data.success) {
        setDeliveryMethods(data.data.deliveryMethods);
      } else {
        throw new Error(data.message || t('admin.settings.deliveryMethods.errors.fetchFailed'));
      }
    } catch (err: any) {
      console.error('Fetch delivery methods error:', err);
      setError(err.message);
      addNotification({
        type: 'error',
        message: t('admin.settings.deliveryMethods.errors.loadFailed')
      });
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm, addNotification]);

  const fetchCities = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/cities?isActive=true&limit=1000', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      const data = await response.json();
      console.log('Fetched cities response:', data);

      if (data.success) {
        console.log('Setting cities count:', data.data.cities.length);
        setCities(data.data.cities);
      }
    } catch (err: any) {
      console.error('Fetch cities error:', err);
    }
  }, []);

  useEffect(() => {
    fetchDeliveryMethods();
  }, [fetchDeliveryMethods]);

  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Upload logo if a new file is selected
      let logoUrl = formData.logo;
      console.log('Logo file selected:', !!logoFile);
      if (logoFile) {
        console.log('Uploading logo:', logoFile.name);
        const uploadedUrl = await uploadLogo();
        console.log('Upload result:', uploadedUrl);
        if (uploadedUrl) {
          logoUrl = uploadedUrl;
        }
      }

      const submissionData = {
        ...formData,
        logo: logoUrl
      };

      console.log('Final submission data:', submissionData);
      console.log('Logo URL being sent:', logoUrl);
      console.log('Original formData.logo:', formData.logo);

      const url = editingMethod 
        ? `/api/admin/delivery-methods/${editingMethod._id}`
        : '/api/admin/delivery-methods';
      
      const method = editingMethod ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();
      console.log('Submission response:', data);

      if (!response.ok) {
        throw new Error(data.message || t(editingMethod ? 'admin.settings.deliveryMethods.errors.updateFailed' : 'admin.settings.deliveryMethods.errors.createFailed'));
      }

      if (data.success) {
        addNotification({
          type: 'success',
          message: t(editingMethod ? 'admin.settings.deliveryMethods.notifications.updateSuccess' : 'admin.settings.deliveryMethods.notifications.createSuccess')
        });
        
        setShowForm(false);
        setEditingMethod(null);
        resetForm();
        fetchDeliveryMethods();
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      console.error('Submit delivery method error:', err);
      addNotification({
        type: 'error',
        message: err.message || t(editingMethod ? 'admin.settings.deliveryMethods.errors.updateFailed' : 'admin.settings.deliveryMethods.errors.createFailed')
      });
    }
  };

  const handleEdit = (method: DeliveryMethod) => {
    setEditingMethod(method);
    setFormData({
      name: method.name,
      description: method.description || '',
      type: method.type,
      price: method.price,
      estimatedTime: method.estimatedTime,
      availableCities: method.availableCities.map(city => city._id),
      shops: method.shops.map(shop => ({
        name: shop.name,
        address: shop.address,
        city: shop.city,
        phone: shop.phone || ''
      })),
      isActive: method.isActive,
      sortOrder: method.sortOrder,
      icon: method.icon,
      logo: method.logo || ''
    });
    setLogoFile(null);
    setLogoPreview(method.logo || '');
    setShowForm(true);
  };

  const handleDelete = async (methodId: string) => {
    if (!confirm(t('admin.settings.deliveryMethods.confirmDelete'))) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/delivery-methods/${methodId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t('admin.settings.deliveryMethods.errors.deleteFailed'));
      }

      if (data.success) {
        addNotification({
          type: 'success',
          message: t('admin.settings.deliveryMethods.notifications.deleteSuccess')
        });
        fetchDeliveryMethods();
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      console.error('Delete delivery method error:', err);
      addNotification({
        type: 'error',
        message: err.message || t('admin.settings.deliveryMethods.errors.deleteFailed')
      });
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingMethod(null);
    setFormData({
      name: '',
      description: '',
      type: 'delivery',
      price: 0,
      estimatedTime: {
        min: 1,
        max: 2,
        unit: 'hours'
      },
      availableCities: [],
      shops: [],
      isActive: true,
      sortOrder: 0,
      icon: 'truck',
      logo: ''
    });
    setLogoFile(null);
    setLogoPreview('');
    // Reset city search state
    setCitySearchTerm('');
    setSelectedRegion('all');
  };

  // Logo upload functions
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log('File selected:', file?.name, file?.size, file?.type);
    if (file) {
      setLogoFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
        console.log('Preview created');
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadLogo = async (): Promise<string | null> => {
    if (!logoFile) return null;

    const formData = new FormData();
    formData.append('logo', logoFile);

    try {
      const response = await fetch('/api/admin/delivery-methods/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: formData,
      });

      const data = await response.json();
      console.log('Upload response:', data);

      if (data.success) {
        return data.data.url;
      } else {
        console.error('Upload failed:', data.message);
        throw new Error(data.message);
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      addNotification({
        type: 'error',
        message: error.message || t('admin.settings.deliveryMethods.errors.uploadFailed')
      });
      return null;
    }
  };

  // City selection helpers
  const filteredCities = useMemo(() => {
    let filtered = cities;
    
    // Filter by search term
    if (citySearchTerm) {
      filtered = filtered.filter(city => 
        city.name.toLowerCase().includes(citySearchTerm.toLowerCase()) ||
        (city.nameArabic && city.nameArabic.includes(citySearchTerm))
      );
    }
    
    // Filter by region
    if (selectedRegion !== 'all') {
      filtered = filtered.filter(city => city.region === selectedRegion);
    }
    
    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [cities, citySearchTerm, selectedRegion]);

  const availableRegions = useMemo(() => {
    const regions = [...new Set(cities.map(city => city.region))].sort();
    return regions;
  }, [cities]);

  const handleSelectAllCities = () => {
    const allFilteredCityIds = filteredCities.map(city => city._id);
    setFormData(prev => ({
      ...prev,
      availableCities: [...new Set([...prev.availableCities, ...allFilteredCityIds])]
    }));
  };

  const handleDeselectAllCities = () => {
    const filteredCityIds = new Set(filteredCities.map(city => city._id));
    setFormData(prev => ({
      ...prev,
      availableCities: prev.availableCities.filter(id => !filteredCityIds.has(id))
    }));
  };

  const selectedCitiesCount = formData.availableCities.length;
  const filteredSelectedCount = filteredCities.filter(city => 
    formData.availableCities.includes(city._id)
  ).length;

  const addShop = () => {
    setFormData(prev => ({
      ...prev,
      shops: [...prev.shops, { name: '', address: '', city: '', phone: '' }]
    }));
  };

  const removeShop = (index: number) => {
    setFormData(prev => ({
      ...prev,
      shops: prev.shops.filter((_, i) => i !== index)
    }));
  };

  const updateShop = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      shops: prev.shops.map((shop, i) => 
        i === index ? { ...shop, [field]: value } : shop
      )
    }));
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <LucideIcon name="xcircle" size="lg" className="text-red-500" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{t('admin.settings.deliveryMethods.error')}</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
              <button
                onClick={() => fetchDeliveryMethods()}
                className="mt-3 text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded"
              >
                {t('admin.settings.deliveryMethods.tryAgain')}
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
          <h2 className="text-xl font-semibold text-gray-900">{t('admin.settings.deliveryMethods.title')}</h2>
          <p className="text-gray-600">{t('admin.settings.deliveryMethods.subtitle')}</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-logo-lime hover:bg-logo-lime/90 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
        >
          <LucideIcon name="plus" size="md" className="text-white" />
          {t('admin.settings.deliveryMethods.addMethod')}
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
                placeholder={t('admin.settings.deliveryMethods.searchPlaceholder')}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
              />
              <LucideIcon name="magnifyingglass" size="md" className="absolute left-3 top-2.5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Methods Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <LucideIcon name="circlenotch" size="xl" className="animate-spin text-logo-lime" />
            <span className="ml-3 text-gray-600">{t('admin.settings.deliveryMethods.loadingMethods')}</span>
          </div>
        ) : deliveryMethods.length === 0 ? (
          <div className="text-center p-8">
            <LucideIcon name="truck" size="3xl" className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('admin.settings.deliveryMethods.noMethodsFound')}</h3>
            <p className="text-gray-600 mb-4">{t('admin.settings.deliveryMethods.getStarted')}</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 bg-logo-lime text-white rounded-lg hover:bg-logo-lime/90"
            >
              <LucideIcon name="plus" size="md" className="mr-2 text-white" />
              {t('admin.settings.deliveryMethods.addMethod')}
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.settings.deliveryMethods.method')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.settings.deliveryMethods.type')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.settings.deliveryMethods.price')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.settings.deliveryMethods.estimatedTime')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.settings.deliveryMethods.cities')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.settings.deliveryMethods.status')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.settings.deliveryMethods.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {deliveryMethods.map((method) => (
                  <tr key={method._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {method.logo ? (
                          <img
                            src={method.logo}
                            alt={method.name}
                            className="h-8 w-8 object-contain"
                          />
                        ) : (
                          <LucideIcon name={method.icon as any} size="md" className="text-gray-400" />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{method.name}</div>
                          {method.description && (
                            <div className="text-sm text-gray-500 mt-1 max-w-xs truncate">
                              {method.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        method.type === 'delivery'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {method.type === 'delivery' ? t('admin.settings.deliveryMethods.delivery') : t('admin.settings.deliveryMethods.pickup')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {method.price === 0 ? t('admin.settings.deliveryMethods.free') : `${method.price} MAD`}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {method.timeDisplay}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {method.availableCities.length} {t('admin.settings.deliveryMethods.citiesCount')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        method.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {method.isActive ? t('admin.settings.deliveryMethods.active') : t('admin.settings.deliveryMethods.inactive')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(method)}
                          className="text-gray-600 hover:text-logo-lime"
                          title={t('admin.settings.deliveryMethods.edit')}
                        >
                          <LucideIcon name="settings" size="md" />
                        </button>
                        <button
                          onClick={() => handleDelete(method._id)}
                          className="text-gray-600 hover:text-red-600"
                          title={t('admin.settings.deliveryMethods.delete')}
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

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {editingMethod ? t('admin.settings.deliveryMethods.editMethod') : t('admin.settings.deliveryMethods.addNewMethod')}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <LucideIcon name="x" size="lg" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('admin.settings.deliveryMethods.name')} *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                      placeholder={t('admin.settings.deliveryMethods.name')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('admin.settings.deliveryMethods.type')} *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as 'delivery' | 'pickup' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                    >
                      <option value="delivery">{t('admin.settings.deliveryMethods.homeDelivery')}</option>
                      <option value="pickup">{t('admin.settings.deliveryMethods.storePickup')}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.settings.deliveryMethods.description')}
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                    placeholder={t('admin.settings.deliveryMethods.methodDescription')}
                  />
                </div>

                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.settings.deliveryMethods.logo')}
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-4">
                      {logoPreview && (
                        <div className="flex-shrink-0">
                          <img
                            src={logoPreview}
                            alt={t('admin.settings.deliveryMethods.logoPreview')}
                            className="h-12 w-12 object-contain border border-gray-300 rounded-lg"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <input
                          type="file"
                          id="logo-upload"
                          accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
                          onChange={handleLogoChange}
                          className="hidden"
                        />
                        <label
                          htmlFor="logo-upload"
                          className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-logo-lime focus:ring-offset-2"
                        >
                          <LucideIcon name="plus" size="sm" />
                          {logoPreview ? t('admin.settings.deliveryMethods.changeLogo') : t('admin.settings.deliveryMethods.uploadLogo')}
                        </label>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      {t('admin.settings.deliveryMethods.logoFormat')}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('admin.settings.deliveryMethods.price')} *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('admin.settings.deliveryMethods.minTime')} *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.estimatedTime.min}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        estimatedTime: { 
                          ...formData.estimatedTime, 
                          min: parseInt(e.target.value) || 1 
                        } 
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('admin.settings.deliveryMethods.maxTime')} *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.estimatedTime.max}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        estimatedTime: { 
                          ...formData.estimatedTime, 
                          max: parseInt(e.target.value) || 1 
                        } 
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.settings.deliveryMethods.timeUnit')} *
                  </label>
                  <select
                    value={formData.estimatedTime.unit}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      estimatedTime: { 
                        ...formData.estimatedTime, 
                        unit: e.target.value as 'minutes' | 'hours' | 'days' 
                      } 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                  >
                    <option value="minutes">{t('admin.settings.deliveryMethods.minutes')}</option>
                    <option value="hours">{t('admin.settings.deliveryMethods.hours')}</option>
                    <option value="days">{t('admin.settings.deliveryMethods.days')}</option>
                  </select>
                </div>

                {/* Enhanced City Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.settings.deliveryMethods.availableCities')} ({selectedCitiesCount} {t('admin.settings.deliveryMethods.selected')})
                  </label>
                  
                  {/* Search and Filter Controls */}
                  <div className="mb-3 space-y-2">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder={t('admin.settings.deliveryMethods.searchCities')}
                          value={citySearchTerm}
                          onChange={(e) => setCitySearchTerm(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent text-sm"
                        />
                      </div>
                      <select
                        value={selectedRegion}
                        onChange={(e) => setSelectedRegion(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent text-sm"
                      >
                        <option value="all">{t('admin.settings.deliveryMethods.allRegions')}</option>
                        {availableRegions.map(region => (
                          <option key={region} value={region}>{region}</option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Bulk Actions */}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleSelectAllCities}
                        disabled={filteredSelectedCount === filteredCities.length}
                        className="px-3 py-1 text-xs bg-logo-lime text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {t('admin.settings.deliveryMethods.selectAllFiltered')} ({filteredCities.length})
                      </button>
                      <button
                        type="button"
                        onClick={handleDeselectAllCities}
                        disabled={filteredSelectedCount === 0}
                        className="px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {t('admin.settings.deliveryMethods.deselectAllFiltered')}
                      </button>
                      <div className="text-xs text-gray-500 flex items-center">
                        {filteredSelectedCount}/{filteredCities.length} {t('admin.settings.deliveryMethods.filteredCitiesSelected')}
                      </div>
                    </div>
                  </div>

                  {/* Cities List */}
                  <div className="border border-gray-300 rounded-lg">
                    {filteredCities.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 text-sm">
                        {t('admin.settings.deliveryMethods.noCitiesFound')}
                      </div>
                    ) : (
                      <div className="max-h-60 overflow-y-auto p-3 space-y-2">
                        {filteredCities.map((city) => (
                          <label key={city._id} className="flex items-center hover:bg-gray-50 p-2 rounded cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.availableCities.includes(city._id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData(prev => ({
                                    ...prev,
                                    availableCities: [...prev.availableCities, city._id]
                                  }));
                                } else {
                                  setFormData(prev => ({
                                    ...prev,
                                    availableCities: prev.availableCities.filter(id => id !== city._id)
                                  }));
                                }
                              }}
                              className="rounded border-gray-300 text-logo-lime focus:ring-logo-lime mr-3"
                            />
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">{city.name}</div>
                              {city.nameArabic && (
                                <div className="text-xs text-gray-500">{city.nameArabic}</div>
                              )}
                              <div className="text-xs text-gray-400">{city.region}</div>
                            </div>
                            <div className="text-xs text-gray-500">
                              {city.deliveryFee} MAD
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {formData.type === 'pickup' && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {t('admin.settings.deliveryMethods.pickupLocations')}
                      </label>
                      <button
                        type="button"
                        onClick={addShop}
                        className="text-sm text-logo-lime hover:text-logo-lime/80"
                      >
                        {t('admin.settings.deliveryMethods.addLocation')}
                      </button>
                    </div>
                    <div className="space-y-3">
                      {formData.shops.map((shop, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                              type="text"
                              value={shop.name}
                              onChange={(e) => updateShop(index, 'name', e.target.value)}
                              placeholder={t('admin.settings.deliveryMethods.shopName')}
                              className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                            />
                            <input
                              type="text"
                              value={shop.phone}
                              onChange={(e) => updateShop(index, 'phone', e.target.value)}
                              placeholder={t('admin.settings.deliveryMethods.phone')}
                              className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                            />
                            <input
                              type="text"
                              value={shop.address}
                              onChange={(e) => updateShop(index, 'address', e.target.value)}
                              placeholder={t('admin.settings.deliveryMethods.address')}
                              className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                            />
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={shop.city}
                                onChange={(e) => updateShop(index, 'city', e.target.value)}
                                placeholder={t('admin.settings.deliveryMethods.city')}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                              />
                              <button
                                type="button"
                                onClick={() => removeShop(index)}
                                className="px-3 py-2 text-red-600 hover:text-red-800"
                              >
                                <LucideIcon name="trash" size="sm" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('admin.settings.deliveryMethods.sortOrder')}
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
                      <span className="ml-2 text-sm text-gray-700">{t('admin.settings.deliveryMethods.active')}</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-logo-lime hover:bg-logo-lime/90 text-white py-2 px-4 rounded-lg font-medium"
                  >
                    {editingMethod ? t('admin.settings.deliveryMethods.updateMethod') : t('admin.settings.deliveryMethods.createMethod')}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium"
                  >
                    {t('admin.settings.deliveryMethods.cancel')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryMethodsTab;
