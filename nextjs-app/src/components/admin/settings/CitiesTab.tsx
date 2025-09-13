'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import LucideIcon from '../../ui/icons/LucideIcon';
import { useNotification } from '@/contexts/NotificationContextNew';
import { useTranslation } from '@/utils/i18n';

interface City {
  _id: string;
  name: string;
  nameArabic?: string;
  region: string;
  country?: string;
  postalCode?: string;
  deliveryAvailable: boolean;
  deliveryFee: number;
  isActive: boolean;
  sortOrder: number;
  createdBy?: {
    firstName: string;
    lastName: string;
  };
  updatedBy?: {
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface CityFormData {
  name: string;
  nameArabic: string;
  region: string;
  country: string;
  postalCode: string;
  deliveryAvailable: boolean;
  deliveryFee: number;
  isActive: boolean;
  sortOrder: number;
}

const CitiesTab = () => {
  const { t } = useTranslation();
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);
  const [error, setError] = useState('');
  const { addNotification } = useNotification();
  const [showModal, setShowModal] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [formData, setFormData] = useState<CityFormData>({
    name: '',
    nameArabic: '',
    region: '',
    country: 'MA',
    postalCode: '',
    deliveryAvailable: true,
    deliveryFee: 0,
    isActive: true,
    sortOrder: 0
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [filterRegion, setFilterRegion] = useState('');
  const [filterActive, setFilterActive] = useState('');
  const [filterDelivery, setFilterDelivery] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchCities = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20'
      });
      
      if (debouncedSearchTerm) params.append('search', debouncedSearchTerm);
      if (filterRegion) params.append('region', filterRegion);
      if (filterActive !== '') params.append('isActive', filterActive);
      if (filterDelivery !== '') params.append('deliveryAvailable', filterDelivery);
      if (sortOrder) params.append('sort', sortOrder);

      const response = await fetch(`/api/admin/cities?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setCities(data.data.cities);
        setTotalPages(data.data.pagination.totalPages);
        setHasInitialLoad(true);
      } else {
        setError(data.message || 'Erreur lors de la récupération des villes');
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchTerm, filterRegion, filterActive, filterDelivery, sortOrder]);

  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const errors: {[key: string]: string} = {};
    if (!formData.name.trim()) errors.name = 'Le nom est requis';
    if (!formData.region.trim()) errors.region = 'La région est requise';
    if (formData.deliveryFee < 0) errors.deliveryFee = 'Les frais de livraison ne peuvent pas être négatifs';
    
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      const url = editingCity ? `/api/admin/cities/${editingCity._id}` : '/api/admin/cities';
      const method = editingCity ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        addNotification({
          type: 'success',
          message: editingCity ? 'City updated successfully' : 'City created successfully'
        });
        setShowModal(false);
        setEditingCity(null);
        resetForm();
        fetchCities();
      } else {
        addNotification({
          type: 'error',
          message: data.message || 'Error saving city'
        });
        setError(data.message || 'Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Error saving city:', error);
      addNotification({
        type: 'error',
        message: 'Connection error. Please try again.'
      });
      setError('Erreur de connexion');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (city: City) => {
    console.log('Editing city:', city.name);
    setEditingCity(city);
    setFormData({
      name: city.name,
      nameArabic: city.nameArabic || '',
      region: city.region,
      country: city.country || 'MA',
      postalCode: city.postalCode || '',
      deliveryAvailable: city.deliveryAvailable,
      deliveryFee: city.deliveryFee,
      isActive: city.isActive,
      sortOrder: city.sortOrder
    });
    setShowModal(true);
  };

  const handleDelete = async (city: City) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la ville "${city.name}" ?`)) return;

    try {
      const response = await fetch(`/api/admin/cities/${city._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        fetchCities();
      } else {
        setError(data.message || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Error deleting city:', error);
      setError('Erreur de connexion');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      nameArabic: '',
      region: '',
      country: 'MA',
      postalCode: '',
      deliveryAvailable: true,
      deliveryFee: 0,
      isActive: true,
      sortOrder: 0
    });
    setFormErrors({});
  };

  const handleAddNew = () => {
    setEditingCity(null);
    resetForm();
    setShowModal(true);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{t('admin.settings.cities.title')}</h2>
          <p className="text-gray-600">{t('admin.settings.cities.subtitle')}</p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-logo-lime hover:bg-logo-lime/90 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
        >
          <LucideIcon name="plus" size="md" />
          {t('admin.settings.cities.addCity')}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('admin.settings.cities.search')}
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('admin.settings.cities.searchPlaceholder')}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
              />
              <LucideIcon name="magnifyingglass" size="md" className="absolute left-3 top-2.5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('admin.settings.cities.region')}
            </label>
            <input
              type="text"
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
              placeholder={t('admin.settings.cities.regionPlaceholder')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('admin.settings.cities.status')}
            </label>
            <select
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
            >
              <option value="">{t('admin.settings.cities.all')}</option>
              <option value="true">{t('admin.settings.cities.active')}</option>
              <option value="false">{t('admin.settings.cities.inactive')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('admin.settings.cities.delivery')}
            </label>
            <select
              value={filterDelivery}
              onChange={(e) => setFilterDelivery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
            >
              <option value="">{t('admin.settings.cities.all')}</option>
              <option value="true">{t('admin.settings.cities.available')}</option>
              <option value="false">{t('admin.settings.cities.notAvailable')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('admin.settings.cities.sort')}
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
            >
              <option value="asc">{t('admin.settings.cities.sortAZ')}</option>
              <option value="desc">{t('admin.settings.cities.sortZA')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <LucideIcon name="alert-circle" size="md" className="text-red-500" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{t('admin.settings.cities.error')}</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Cities Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <LucideIcon name="circlenotch" size="xl" className="animate-spin text-logo-lime" />
            <span className="ml-3 text-gray-600">{t('admin.settings.cities.loadingCities')}</span>
          </div>
        ) : cities.length === 0 ? (
          <div className="text-center p-8">
            <LucideIcon name="map-pin" size="3xl" className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('admin.settings.cities.noCitiesFound')}</h3>
            <p className="text-gray-600 mb-4">{t('admin.settings.cities.getStarted')}</p>
            <button
              onClick={handleAddNew}
              className="inline-flex items-center px-4 py-2 bg-logo-lime text-white rounded-lg hover:bg-logo-lime/90"
            >
              <LucideIcon name="plus" size="md" className="mr-2 text-white" />
              {t('admin.settings.cities.addCity')}
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.settings.cities.city')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.settings.cities.region')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.settings.cities.postalCode')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.settings.cities.delivery')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.settings.cities.fee')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.settings.cities.status')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.settings.cities.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cities.map((city) => (
                    <tr key={city._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{city.name}</div>
                          {city.nameArabic && (
                            <div className="text-sm text-gray-500">{city.nameArabic}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {city.region}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {city.postalCode || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          city.deliveryAvailable
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {city.deliveryAvailable ? t('admin.settings.cities.available') : t('admin.settings.cities.notAvailable')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {city.deliveryFee > 0 ? `${city.deliveryFee} MAD` : t('admin.settings.cities.free')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          city.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {city.isActive ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(city)}
                            className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
                            title="Edit city"
                          >
                            <LucideIcon name="pencil" size="sm" />
                          </button>
                          <button
                            onClick={() => handleDelete(city)}
                            className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-colors"
                            title="Delete city"
                          >
                            <LucideIcon name="trash" size="sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Page {currentPage} sur {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50"
                  >
                    {t('admin.settings.cities.previous')}
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50"
                  >
                    {t('admin.settings.cities.next')}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {editingCity ? t('admin.settings.cities.editCity') : t('admin.settings.cities.addCity')}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <LucideIcon name="x" size="lg" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.settings.cities.cityName')} *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent ${
                      formErrors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Casablanca"
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.settings.cities.arabicName')}
                  </label>
                  <input
                    type="text"
                    value={formData.nameArabic}
                    onChange={(e) => setFormData({ ...formData, nameArabic: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                    placeholder="الدار البيضاء"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.settings.cities.country')} *
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                  >
                    <option value="MA">Maroc</option>
                    <option value="FR">France</option>
                    <option value="ES">Espagne</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.settings.cities.region')} *
                  </label>
                  <input
                    type="text"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent ${
                      formErrors.region ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Casablanca-Settat"
                  />
                  {formErrors.region && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.region}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.settings.cities.postalCode')}
                  </label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                    placeholder="20000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.settings.cities.deliveryFee')}
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.deliveryFee}
                    onChange={(e) => setFormData({ ...formData, deliveryFee: parseFloat(e.target.value) || 0 })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent ${
                      formErrors.deliveryFee ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="0"
                  />
                  {formErrors.deliveryFee && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.deliveryFee}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.settings.cities.sortOrder')}
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.deliveryAvailable}
                      onChange={(e) => setFormData({ ...formData, deliveryAvailable: e.target.checked })}
                      className="rounded border-gray-300 text-logo-lime focus:ring-logo-lime"
                    />
                    <span className="ml-2 text-sm text-gray-700">{t('admin.settings.cities.deliveryAvailable')}</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="rounded border-gray-300 text-logo-lime focus:ring-logo-lime"
                    />
                    <span className="ml-2 text-sm text-gray-700">{t('admin.settings.cities.cityActive')}</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    {t('admin.settings.cities.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-2 bg-logo-lime text-white rounded-lg hover:bg-logo-lime/90 disabled:opacity-50"
                  >
                    {submitting ? t('admin.settings.cities.saving') : t('admin.settings.cities.save')}
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

export default CitiesTab;
