'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useNotification } from '@/contexts/NotificationContextNew';
import LucideIcon from '../../ui/icons/LucideIcon';
import { useTranslation } from '@/utils/i18n';

interface PaymentMethod {
  _id: string;
  name: string;
  key: string;
  description?: string;
  type: 'cash' | 'card' | 'bank_transfer' | 'digital_wallet' | 'other';
  provider?: string;
  fees: {
    type: 'fixed' | 'percentage' | 'none';
    amount: number;
  };
  minimumAmount: number;
  maximumAmount?: number;
  processingTime: string;
  instructions?: string;
  isActive: boolean;
  sortOrder: number;
  icon: string;
  logo?: string;
  createdAt: string;
  updatedAt: string;
  displayName: string;
  hasConfiguration: boolean;
}

const PaymentMethodsTab = () => {
  const { t } = useTranslation();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    key: '',
    description: '',
    type: 'cash' as 'cash' | 'card' | 'bank_transfer' | 'digital_wallet' | 'other',
    provider: '',
    fees: {
      type: 'none' as 'fixed' | 'percentage' | 'none',
      amount: 0
    },
    minimumAmount: 0,
    maximumAmount: '',
    processingTime: 'instant',
    instructions: '',
    isActive: true,
    sortOrder: 0,
    icon: 'credit-card',
    logo: ''
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');

  const { addNotification } = useNotification();

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchPaymentMethods = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        includeInactive: 'true'
      });

      if (debouncedSearchTerm) {
        params.append('search', debouncedSearchTerm);
      }

      const response = await fetch(`/api/admin/payment-methods?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t('admin.settings.paymentMethods.errors.fetchFailed'));
      }

      if (data.success) {
        setPaymentMethods(data.data.paymentMethods);
      } else {
        throw new Error(data.message || t('admin.settings.paymentMethods.errors.fetchFailed'));
      }
    } catch (err: any) {
      console.error('Fetch payment methods error:', err);
      setError(err.message);
      addNotification({
        type: 'error',
        message: t('admin.settings.paymentMethods.errors.loadFailed')
      });
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm, addNotification]);

  useEffect(() => {
    fetchPaymentMethods();
  }, [fetchPaymentMethods]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Upload logo if a new file is selected
      let logoUrl = formData.logo;
      if (logoFile) {
        const uploadedUrl = await uploadLogo();
        if (uploadedUrl) {
          logoUrl = uploadedUrl;
        }
      }

      const submitData = {
        ...formData,
        logo: logoUrl,
        maximumAmount: formData.maximumAmount ? parseFloat(formData.maximumAmount) : null
      };

      const url = editingMethod 
        ? `/api/admin/payment-methods/${editingMethod._id}`
        : '/api/admin/payment-methods';
      
      const method = editingMethod ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t(editingMethod ? 'admin.settings.paymentMethods.errors.updateFailed' : 'admin.settings.paymentMethods.errors.createFailed'));
      }

      if (data.success) {
        addNotification({
          type: 'success',
          message: t(editingMethod ? 'admin.settings.paymentMethods.notifications.updateSuccess' : 'admin.settings.paymentMethods.notifications.createSuccess')
        });
        
        setShowForm(false);
        setEditingMethod(null);
        resetForm();
        fetchPaymentMethods();
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      console.error('Submit payment method error:', err);
      addNotification({
        type: 'error',
        message: err.message || t(editingMethod ? 'admin.settings.paymentMethods.errors.updateFailed' : 'admin.settings.paymentMethods.errors.createFailed')
      });
    }
  };

  const handleEdit = (method: PaymentMethod) => {
    setEditingMethod(method);
    setFormData({
      name: method.name,
      key: method.key,
      description: method.description || '',
      type: method.type,
      provider: method.provider || '',
      fees: method.fees,
      minimumAmount: method.minimumAmount,
      maximumAmount: method.maximumAmount?.toString() || '',
      processingTime: method.processingTime,
      instructions: method.instructions || '',
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
    if (!confirm(t('admin.settings.paymentMethods.confirmDelete'))) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/payment-methods/${methodId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t('admin.settings.paymentMethods.errors.deleteFailed'));
      }

      if (data.success) {
        addNotification({
          type: 'success',
          message: t('admin.settings.paymentMethods.notifications.deleteSuccess')
        });
        fetchPaymentMethods();
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      console.error('Delete payment method error:', err);
      addNotification({
        type: 'error',
        message: err.message || t('admin.settings.paymentMethods.errors.deleteFailed')
      });
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingMethod(null);
    setFormData({
      name: '',
      key: '',
      description: '',
      type: 'cash',
      provider: '',
      fees: {
        type: 'none',
        amount: 0
      },
      minimumAmount: 0,
      maximumAmount: '',
      processingTime: 'instant',
      instructions: '',
      isActive: true,
      sortOrder: 0,
      icon: 'credit-card',
      logo: ''
    });
    setLogoFile(null);
    setLogoPreview('');
  };

  // Logo upload functions
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadLogo = async (): Promise<string | null> => {
    if (!logoFile) return null;

    const formData = new FormData();
    formData.append('logo', logoFile);

    try {
      const response = await fetch('/api/admin/payment-methods/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        return data.data.url;
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      addNotification({
        type: 'error',
        message: error.message || t('admin.settings.paymentMethods.errors.uploadFailed')
      });
      return null;
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      cash: 'bg-green-100 text-green-800',
      card: 'bg-blue-100 text-blue-800',
      bank_transfer: 'bg-purple-100 text-purple-800',
      digital_wallet: 'bg-orange-100 text-orange-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[type as keyof typeof colors] || colors.other;
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      cash: t('admin.settings.paymentMethods.types.cash'),
      card: t('admin.settings.paymentMethods.types.card'),
      bank_transfer: t('admin.settings.paymentMethods.types.bankTransfer'),
      digital_wallet: t('admin.settings.paymentMethods.types.digitalWallet'),
      other: t('admin.settings.paymentMethods.types.other')
    };
    return labels[type as keyof typeof labels] || type;
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <LucideIcon name="xcircle" size="lg" color="error" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{t('admin.settings.paymentMethods.error')}</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
              <button
                onClick={() => fetchPaymentMethods()}
                className="mt-3 text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded"
              >
                {t('admin.settings.paymentMethods.tryAgain')}
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
          <h2 className="text-xl font-semibold text-gray-900">{t('admin.settings.paymentMethods.title')}</h2>
          <p className="text-gray-600">{t('admin.settings.paymentMethods.subtitle')}</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-logo-lime hover:bg-logo-lime/90 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
        >
          <LucideIcon name="plus" size="md" color="white" />
          {t('admin.settings.paymentMethods.addMethod')}
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
                placeholder={t('admin.settings.paymentMethods.searchPlaceholder')}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
              />
              <LucideIcon name="magnifyingglass" size="md" color="gray" className="absolute left-3 top-2.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <LucideIcon name="circlenotch" size="xl" color="logo-lime" className="animate-spin" />
            <span className="ml-3 text-gray-600">{t('admin.settings.paymentMethods.loadingMethods')}</span>
          </div>
        ) : paymentMethods.length === 0 ? (
          <div className="text-center p-8">
            <LucideIcon name="credit-card" size="3xl" color="gray" className="mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('admin.settings.paymentMethods.noMethodsFound')}</h3>
            <p className="text-gray-600 mb-4">{t('admin.settings.paymentMethods.getStarted')}</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 bg-logo-lime text-white rounded-lg hover:bg-logo-lime/90"
            >
              <LucideIcon name="plus" size="md" color="white" className="mr-2" />
              {t('admin.settings.paymentMethods.addMethod')}
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.settings.paymentMethods.method')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.settings.paymentMethods.type')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.settings.paymentMethods.provider')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.settings.paymentMethods.fees')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.settings.paymentMethods.minAmount')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.settings.paymentMethods.status')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.settings.paymentMethods.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paymentMethods.map((method) => (
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
                          <LucideIcon name={method.icon as any} size="md" className="text-gray-500" />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{method.name}</div>
                          <div className="text-sm text-gray-500">{method.key}</div>
                          {method.description && (
                            <div className="text-sm text-gray-500 mt-1 max-w-xs truncate">
                              {method.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(method.type)}`}>
                        {getTypeLabel(method.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {method.provider || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {method.fees.type === 'none' ? t('admin.settings.paymentMethods.noFees') : 
                       method.fees.type === 'fixed' ? `${method.fees.amount} MAD` :
                       `${method.fees.amount}%`}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {method.minimumAmount} MAD
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        method.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {method.isActive ? t('admin.settings.paymentMethods.active') : t('admin.settings.paymentMethods.inactive')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(method)}
                          className="text-gray-600 hover:text-logo-lime"
                          title={t('admin.settings.paymentMethods.edit')}
                        >
                          <LucideIcon name="gear" size="md" />
                        </button>
                        <button
                          onClick={() => handleDelete(method._id)}
                          className="text-gray-600 hover:text-red-600"
                          title={t('admin.settings.paymentMethods.delete')}
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
                  {editingMethod ? t('admin.settings.paymentMethods.editMethod') : t('admin.settings.paymentMethods.addNewMethod')}
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
                      {t('admin.settings.paymentMethods.name')} *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                      placeholder={t('admin.settings.paymentMethods.name')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('admin.settings.paymentMethods.key')} *
                    </label>
                    <input
                      type="text"
                      value={formData.key}
                      onChange={(e) => setFormData({ ...formData, key: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                      placeholder={t('admin.settings.paymentMethods.key')}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.settings.paymentMethods.description')}
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                    placeholder={t('admin.settings.paymentMethods.methodDescription')}
                  />
                </div>

                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.settings.paymentMethods.logo')}
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-4">
                      {logoPreview && (
                        <div className="flex-shrink-0">
                          <img
                            src={logoPreview}
                            alt={t('admin.settings.paymentMethods.logoPreview')}
                            className="h-12 w-12 object-contain border border-gray-300 rounded-lg"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <input
                          type="file"
                          id="payment-logo-upload"
                          accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
                          onChange={handleLogoChange}
                          className="hidden"
                        />
                        <label
                          htmlFor="payment-logo-upload"
                          className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-logo-lime focus:ring-offset-2"
                        >
                          <LucideIcon name="plus" size="sm" className="mr-2" />
                          {logoPreview ? t('admin.settings.paymentMethods.changeLogo') : t('admin.settings.paymentMethods.uploadLogo')}
                        </label>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      {t('admin.settings.paymentMethods.logoFormat')}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('admin.settings.paymentMethods.type')} *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                    >
                      <option value="cash">{t('admin.settings.paymentMethods.types.cash')}</option>
                      <option value="card">{t('admin.settings.paymentMethods.types.card')}</option>
                      <option value="bank_transfer">{t('admin.settings.paymentMethods.types.bankTransfer')}</option>
                      <option value="digital_wallet">{t('admin.settings.paymentMethods.types.digitalWallet')}</option>
                      <option value="other">{t('admin.settings.paymentMethods.types.other')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('admin.settings.paymentMethods.provider')}
                    </label>
                    <input
                      type="text"
                      value={formData.provider}
                      onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                      placeholder={t('admin.settings.paymentMethods.providerPlaceholder')}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('admin.settings.paymentMethods.feeType')}
                    </label>
                    <select
                      value={formData.fees.type}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        fees: { ...formData.fees, type: e.target.value as any } 
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                    >
                      <option value="none">{t('admin.settings.paymentMethods.fees.none')}</option>
                      <option value="fixed">{t('admin.settings.paymentMethods.fees.fixed')}</option>
                      <option value="percentage">{t('admin.settings.paymentMethods.fees.percentage')}</option>
                    </select>
                  </div>

                  {formData.fees.type !== 'none' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('admin.settings.paymentMethods.feeAmount')}
                      </label>
                      <input
                        type="number"
                        min="0"
                        step={formData.fees.type === 'percentage' ? '0.01' : '1'}
                        value={formData.fees.amount}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          fees: { ...formData.fees, amount: parseFloat(e.target.value) || 0 } 
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                        placeholder={formData.fees.type === 'percentage' ? '2.5' : '10'}
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('admin.settings.paymentMethods.processingTime')}
                    </label>
                    <input
                      type="text"
                      value={formData.processingTime}
                      onChange={(e) => setFormData({ ...formData, processingTime: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                      placeholder={t('admin.settings.paymentMethods.processingTimePlaceholder')}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('admin.settings.paymentMethods.minimumAmount')}
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.minimumAmount}
                      onChange={(e) => setFormData({ ...formData, minimumAmount: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('admin.settings.paymentMethods.maximumAmount')}
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.maximumAmount}
                      onChange={(e) => setFormData({ ...formData, maximumAmount: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                      placeholder={t('admin.settings.paymentMethods.maximumAmountPlaceholder')}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.settings.paymentMethods.instructions')}
                  </label>
                  <textarea
                    value={formData.instructions}
                    onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                    placeholder={t('admin.settings.paymentMethods.instructionsPlaceholder')}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('admin.settings.paymentMethods.sortOrder')}
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
                      <span className="ml-2 text-sm text-gray-700">{t('admin.settings.paymentMethods.active')}</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-logo-lime hover:bg-logo-lime/90 text-white py-2 px-4 rounded-lg font-medium"
                  >
                    {editingMethod ? t('admin.settings.paymentMethods.updateMethod') : t('admin.settings.paymentMethods.createMethod')}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium"
                  >
                    {t('admin.settings.paymentMethods.cancel')}
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

export default PaymentMethodsTab;
