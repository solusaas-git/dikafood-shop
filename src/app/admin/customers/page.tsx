'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useNotification } from '@/contexts/NotificationContextNew';
import { useTranslation } from '../../../utils/i18n';
import LucideIcon from '../../../components/ui/icons/LucideIcon';
import { PaginationControls } from '../../../components/ui/navigation/Pagination';

interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLogin?: string;
  customerType: 'final_customer' | 'retail_customer' | 'wholesale_customer';
  dateOfBirth?: string;
  gender?: string;
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints: number;
  lastOrderDate?: string;
  averageOrderValue: number;
  businessInfo?: {
    companyName?: string;
    taxId?: string;
    businessType?: string;
    discountTier?: number;
    creditLimit?: number;
    paymentTerms?: number;
  };
  createdBy?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  updatedBy?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  addresses?: Array<{
    type: string;
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country: string;
    isDefault: boolean;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface CustomerStats {
  totalCustomers: number;
  activeCustomers: number;
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCustomers: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

const CustomersPage = () => {
  const router = useRouter();
  const { addNotification } = useNotification();
  const { t } = useTranslation();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<CustomerStats>({
    totalCustomers: 0,
    activeCustomers: 0,
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0
  });
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalCustomers: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [customerTypeFilter, setCustomerTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creatingCustomer, setCreatingCustomer] = useState(false);
  const [createAddresses, setCreateAddresses] = useState<Array<{
    type: 'shipping' | 'billing' | 'both';
    label?: string;
    firstName?: string;
    lastName?: string;
    company?: string;
    street: string;
    street2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
    phone?: string;
    isDefault: boolean;
    instructions?: string;
  }>>([]);
  const [createFormData, setCreateFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    customerType: 'final_customer' as 'final_customer' | 'retail_customer' | 'wholesale_customer',
    dateOfBirth: '',
    gender: '',
    // Business info for retail/wholesale
    companyName: '',
    taxId: '',
    businessType: '',
    discountTier: 0,
    creditLimit: 0,
    paymentTerms: 0
  });

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
    fetchCustomers(page);
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    setPagination(prev => ({ ...prev, limit: newLimit, currentPage: 1 }));
    fetchCustomers(1, newLimit);
  };

  const fetchCustomers = useCallback(async (page = 1, limit = pagination.limit) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { isActive: statusFilter }),
        ...(customerTypeFilter !== 'all' && { customerType: customerTypeFilter })
      });

      const response = await fetch(`/api/admin/customers?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t('admin.customers.errors.fetchFailed'));
      }

      if (data.success) {
        setCustomers(data.data.customers);
        setPagination(data.data.pagination);
        setStats(data.data.stats);
      }
    } catch (error: any) {
      console.error('Fetch customers error:', error);
      addNotification({
        type: 'error',
        message: error.message || t('admin.customers.errors.fetchFailed')
      });
    } finally {
      setLoading(false);
    }
  }, [pagination.limit, searchTerm, statusFilter, customerTypeFilter, sortBy, sortOrder, t, addNotification]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCreateFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const numericValue = type === 'number' ? parseFloat(value) || 0 : value;
    setCreateFormData(prev => ({
      ...prev,
      [name]: numericValue
    }));
  };

  // Create modal address management functions
  const addCreateAddress = () => {
    const newAddress = {
      type: 'shipping' as 'shipping' | 'billing' | 'both',
      label: '',
      firstName: '',
      lastName: '',
      company: '',
      street: '',
      street2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'Morocco',
      phone: '',
      isDefault: createAddresses.length === 0,
      instructions: ''
    };
    setCreateAddresses([...createAddresses, newAddress]);
  };

  const updateCreateAddress = (index: number, field: string, value: any) => {
    const updatedAddresses = [...createAddresses];
    updatedAddresses[index] = {
      ...updatedAddresses[index],
      [field]: value
    };
    
    // If setting as default, unset other defaults
    if (field === 'isDefault' && value) {
      updatedAddresses.forEach((addr, i) => {
        if (i !== index) addr.isDefault = false;
      });
    }
    
    setCreateAddresses(updatedAddresses);
  };

  const removeCreateAddress = (index: number) => {
    const updatedAddresses = createAddresses.filter((_, i) => i !== index);
    // If we removed the default address, make the first one default
    if (createAddresses[index].isDefault && updatedAddresses.length > 0) {
      updatedAddresses[0].isDefault = true;
    }
    setCreateAddresses(updatedAddresses);
  };

  const copyCreateShippingToBilling = () => {
    const shippingAddress = createAddresses.find(addr => addr.type === 'shipping' || addr.type === 'both');
    if (shippingAddress) {
      const billingAddress = {
        ...shippingAddress,
        type: 'billing' as 'billing',
        label: shippingAddress.label ? `${shippingAddress.label} (Billing)` : 'Billing',
        isDefault: false,
        instructions: ''
      };
      setCreateAddresses([...createAddresses, billingAddress]);
    }
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!createFormData.firstName.trim() || !createFormData.lastName.trim() || 
        !createFormData.email.trim() || !createFormData.password.trim()) {
      addNotification({
        type: 'error',
        message: t('admin.customers.errors.requiredFields')
      });
      return;
    }

    setCreatingCustomer(true);
    try {
      const customerData = {
        firstName: createFormData.firstName.trim(),
        lastName: createFormData.lastName.trim(),
        email: createFormData.email.trim(),
        password: createFormData.password,
        phone: createFormData.phone.trim(),
        customerType: createFormData.customerType,
        dateOfBirth: createFormData.dateOfBirth || null,
        gender: createFormData.gender || null,
        addresses: createAddresses,
        // Business info for retail/wholesale customers
        ...(createFormData.customerType !== 'final_customer' && {
          companyName: createFormData.companyName.trim(),
          taxId: createFormData.taxId.trim(),
          businessType: createFormData.businessType.trim(),
          discountTier: createFormData.discountTier,
          creditLimit: createFormData.creditLimit,
          paymentTerms: createFormData.paymentTerms
        })
      };

      const response = await fetch('/api/admin/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(customerData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t('admin.customers.errors.createFailed'));
      }

      if (data.success) {
        addNotification({
          type: 'success',
          message: t('admin.customers.success.created')
        });
        setShowCreateModal(false);
        setCreateFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          phone: '',
          customerType: 'final_customer',
          dateOfBirth: '',
          gender: '',
          companyName: '',
          taxId: '',
          businessType: '',
          discountTier: 0,
          creditLimit: 0,
          paymentTerms: 0
        });
        setCreateAddresses([]); // Reset addresses
        fetchCustomers(pagination.currentPage);
      }
    } catch (error: any) {
      console.error('Create customer error:', error);
      addNotification({
        type: 'error',
        message: error.message || t('admin.customers.errors.createFailed')
      });
    } finally {
      setCreatingCustomer(false);
    }
  };

  const handleDelete = async (customerId: string) => {
    if (!confirm(`${t('admin.customers.confirmDelete')} ${t('admin.customers.confirmDeleteWarning')}`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/customers/${customerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t('admin.customers.errors.deleteFailed'));
      }

      if (data.success) {
        addNotification({
          type: 'success',
          message: t('admin.customers.success.deleted')
        });
        fetchCustomers(pagination.currentPage);
      }
    } catch (error: any) {
      console.error('Delete customer error:', error);
      addNotification({
        type: 'error',
        message: error.message || t('admin.customers.errors.deleteFailed')
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getCustomerTypeColor = (type: string) => {
    switch (type) {
      case 'final_customer':
        return 'bg-blue-100 text-blue-800';
      case 'retail_customer':
        return 'bg-purple-100 text-purple-800';
      case 'wholesale_customer':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCustomerType = (type: string) => {
    switch (type) {
      case 'final_customer':
        return t('admin.customers.types.final');
      case 'retail_customer':
        return t('admin.customers.types.retail');
      case 'wholesale_customer':
        return t('admin.customers.types.wholesale');
      default:
        return t('admin.customers.types.unknown');
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('admin.customers.title')}</h1>
          <p className="text-gray-600">{t('admin.customers.subtitle')}</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-logo-lime hover:bg-logo-lime/90 text-dark-green-7 px-4 py-2 rounded-lg flex items-center gap-2 font-medium"
        >
          <LucideIcon name="plus" size="sm" />
          {t('admin.customers.addButton')}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <LucideIcon name="users" size="lg" className="text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('admin.customers.stats.totalCustomers')}</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <LucideIcon name="checkcircle" size="lg" className="text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('admin.customers.stats.activeCustomers')}</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeCustomers.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <LucideIcon name="currencydollar" size="lg" className="text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('admin.customers.stats.totalRevenue')}</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <LucideIcon name="shoppingcart" size="lg" className="text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('admin.customers.stats.totalOrders')}</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <LucideIcon name="trendingup" size="lg" className="text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('admin.customers.stats.avgOrderValue')}</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.averageOrderValue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('admin.customers.filters.search')}
            </label>
            <div className="relative">
              <LucideIcon name="search" size="sm" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t('admin.customers.filters.searchPlaceholder')}
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('admin.customers.filters.status')}
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
            >
              <option value="all">{t('admin.customers.filters.allStatus')}</option>
              <option value="true">{t('admin.customers.status.active')}</option>
              <option value="false">{t('admin.customers.status.inactive')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('admin.customers.filters.customerType')}
            </label>
            <select
              value={customerTypeFilter}
              onChange={(e) => setCustomerTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
            >
              <option value="all">{t('admin.customers.filters.allTypes')}</option>
              <option value="final_customer">{t('admin.customers.types.final')}</option>
              <option value="retail_customer">{t('admin.customers.types.retail')}</option>
              <option value="wholesale_customer">{t('admin.customers.types.wholesale')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('admin.customers.filters.sortBy')}
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
            >
              <option value="createdAt">{t('admin.customers.filters.registrationDate')}</option>
              <option value="totalOrders">{t('admin.customers.filters.totalOrders')}</option>
              <option value="totalSpent">{t('admin.customers.filters.totalSpent')}</option>
              <option value="lastOrderDate">{t('admin.customers.filters.lastOrder')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('admin.customers.filters.order')}
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
            >
              <option value="desc">{t('admin.customers.filters.descending')}</option>
              <option value="asc">{t('admin.customers.filters.ascending')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-logo-lime"></div>
          </div>
        ) : customers.length === 0 ? (
          <div className="text-center py-12">
            <LucideIcon name="users" size="3xl" className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('admin.customers.table.noCustomersFound')}</h3>
            <p className="text-gray-500">{t('admin.customers.table.noCustomersMatch')}</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.customers.table.customer')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.customers.table.type')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.customers.table.ordersSpending')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.customers.table.loyaltyPoints')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.customers.table.status')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.customers.table.lastOrder')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.customers.table.registered')}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.customers.table.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customers.map((customer) => (
                    <tr key={customer._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-logo-lime/10 flex items-center justify-center">
                              <span className="text-sm font-medium text-logo-lime">
                                {customer.firstName.charAt(0)}{customer.lastName.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {customer.firstName} {customer.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{customer.email}</div>
                            {customer.phone && (
                              <div className="text-xs text-gray-400">{customer.phone}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCustomerTypeColor(customer.customerType || 'final_customer')}`}>
                          {formatCustomerType(customer.customerType || 'final_customer')}
                        </span>
                        {customer.businessInfo?.companyName && (
                          <div className="text-xs text-gray-500 mt-1">
                            {customer.businessInfo.companyName}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {customer.totalOrders || 0} {t('admin.customers.table.orders')}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatCurrency(customer.totalSpent || 0)}
                        </div>
                        <div className="text-xs text-gray-400">
                          {t('admin.customers.table.avg')}: {formatCurrency(customer.averageOrderValue || 0)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-yellow-600">
                          {customer.loyaltyPoints || 0} {t('admin.customers.table.pts')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(customer.isActive)}`}>
                            {customer.isActive ? t('admin.customers.status.active') : t('admin.customers.status.inactive')}
                          </span>
                          {!customer.isEmailVerified && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              {t('admin.customers.status.unverified')}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {customer.lastOrderDate 
                          ? formatDate(customer.lastOrderDate) 
                          : t('admin.customers.table.never')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(customer.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => router.push(`/admin/customers/${customer._id}`)}
                            className="text-logo-lime hover:text-logo-lime/80 p-1"
                            title={t('admin.customers.actions.view')}
                          >
                            <LucideIcon name="eye" size="sm" />
                          </button>
                          <button
                            onClick={() => router.push(`/admin/customers/${customer._id}/edit`)}
                            className="text-blue-600 hover:text-blue-800 p-1"
                            title={t('admin.customers.actions.edit')}
                          >
                            <LucideIcon name="pencil" size="sm" />
                          </button>
                          <button
                            onClick={() => handleDelete(customer._id)}
                            className="text-red-600 hover:text-red-800 p-1"
                            title={t('admin.customers.actions.delete')}
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
            {pagination.totalCustomers > 0 && (
              <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                <PaginationControls
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.totalCustomers}
                  itemsPerPage={pagination.limit}
                  onPageChange={handlePageChange}
                  onItemsPerPageChange={handleItemsPerPageChange}
                  options={[10, 20, 50, 100]}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Customer Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">{t('admin.customers.modal.title')}</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <LucideIcon name="x" size="lg" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">{t('admin.customers.modal.basicInfo')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('admin.customers.modal.firstName')} *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={createFormData.firstName}
                      onChange={handleCreateFormChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                      placeholder={t('admin.customers.modal.firstNamePlaceholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('admin.customers.modal.lastName')} *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={createFormData.lastName}
                      onChange={handleCreateFormChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                      placeholder={t('admin.customers.modal.lastNamePlaceholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('admin.customers.modal.email')} *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={createFormData.email}
                      onChange={handleCreateFormChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                      placeholder={t('admin.customers.modal.emailPlaceholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('admin.customers.modal.password')} *
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={createFormData.password}
                      onChange={handleCreateFormChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                      placeholder={t('admin.customers.modal.passwordPlaceholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('admin.customers.modal.phone')}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={createFormData.phone}
                      onChange={handleCreateFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                      placeholder={t('admin.customers.modal.phonePlaceholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('admin.customers.modal.customerType')} *
                    </label>
                    <select
                      name="customerType"
                      value={createFormData.customerType}
                      onChange={handleCreateFormChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                    >
                      <option value="final_customer">{t('admin.customers.types.final')}</option>
                      <option value="retail_customer">{t('admin.customers.types.retail')}</option>
                      <option value="wholesale_customer">{t('admin.customers.types.wholesale')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('admin.customers.modal.dateOfBirth')}
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={createFormData.dateOfBirth}
                      onChange={handleCreateFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('admin.customers.modal.gender')}
                    </label>
                    <select
                      name="gender"
                      value={createFormData.gender}
                      onChange={handleCreateFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                    >
                      <option value="">{t('admin.customers.modal.selectGender')}</option>
                      <option value="male">{t('admin.customers.modal.male')}</option>
                      <option value="female">{t('admin.customers.modal.female')}</option>
                      <option value="other">{t('admin.customers.modal.other')}</option>
                      <option value="prefer_not_to_say">{t('admin.customers.modal.preferNotToSay')}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Business Information - Only show for retail/wholesale customers */}
              {(createFormData.customerType === 'retail_customer' || createFormData.customerType === 'wholesale_customer') && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">{t('admin.customers.modal.businessInfo')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('admin.customers.modal.companyName')}
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={createFormData.companyName}
                        onChange={handleCreateFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                        placeholder={t('admin.customers.modal.companyNamePlaceholder')}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tax ID
                      </label>
                      <input
                        type="text"
                        name="taxId"
                        value={createFormData.taxId}
                        onChange={handleCreateFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                        placeholder="Enter tax ID"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Business Type
                      </label>
                      <input
                        type="text"
                        name="businessType"
                        value={createFormData.businessType}
                        onChange={handleCreateFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                        placeholder="e.g., Restaurant, Retail Store"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Discount Tier (%)
                      </label>
                      <input
                        type="number"
                        name="discountTier"
                        value={createFormData.discountTier}
                        onChange={handleCreateFormChange}
                        min="0"
                        max="100"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Credit Limit (MAD)
                      </label>
                      <input
                        type="number"
                        name="creditLimit"
                        value={createFormData.creditLimit}
                        onChange={handleCreateFormChange}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Terms (Days)
                      </label>
                      <input
                        type="number"
                        name="paymentTerms"
                        value={createFormData.paymentTerms}
                        onChange={handleCreateFormChange}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                        placeholder="30"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Address Management */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">{t('admin.customers.modal.addresses')}</h3>
                  <div className="flex gap-2">
                    {createAddresses.some(addr => addr.type === 'shipping' || addr.type === 'both') && (
                      <button
                        type="button"
                        onClick={copyCreateShippingToBilling}
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <LucideIcon name="clipboard" size="sm" />
                        {t('admin.customers.modal.copyShippingToBilling')}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={addCreateAddress}
                      className="text-sm bg-logo-lime text-dark-green-7 px-3 py-1 rounded-lg hover:bg-logo-lime/90 flex items-center gap-1"
                    >
                      <LucideIcon name="plus" size="sm" />
                      {t('admin.customers.modal.addAddress')}
                    </button>
                  </div>
                </div>

                {createAddresses.length === 0 ? (
                  <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
                    <LucideIcon name="buildings" size="xl" className="mx-auto mb-2 text-gray-400" />
                    <p>{t('admin.customers.modal.noAddresses')}</p>
                    <p className="text-sm">{t('admin.customers.modal.noAddressesDescription')}</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {createAddresses.map((address, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              address.type === 'shipping' ? 'bg-green-100 text-green-800' :
                              address.type === 'billing' ? 'bg-blue-100 text-blue-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {address.type === 'both' ? t('admin.customers.modal.shippingAndBilling') : 
                               address.type === 'shipping' ? t('admin.customers.modal.shipping') :
                               address.type === 'billing' ? t('admin.customers.modal.billing') : address.type}
                            </span>
                            {address.isDefault && (
                              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800">
                                {t('admin.customers.modal.default')}
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeCreateAddress(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <LucideIcon name="trash" size="sm" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              {t('admin.customers.modal.addressType')} *
                            </label>
                            <select
                              value={address.type}
                              onChange={(e) => updateCreateAddress(index, 'type', e.target.value)}
                              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-logo-lime focus:border-transparent"
                            >
                              <option value="shipping">{t('admin.customers.modal.shipping')}</option>
                              <option value="billing">{t('admin.customers.modal.billing')}</option>
                              <option value="both">{t('admin.customers.modal.both')}</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              {t('admin.customers.modal.addressLabel')}
                            </label>
                            <input
                              type="text"
                              value={address.label || ''}
                              onChange={(e) => updateCreateAddress(index, 'label', e.target.value)}
                              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-logo-lime focus:border-transparent"
                              placeholder={t('admin.customers.modal.addressLabelPlaceholder')}
                            />
                          </div>

                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={address.isDefault}
                              onChange={(e) => updateCreateAddress(index, 'isDefault', e.target.checked)}
                              className="h-3 w-3 text-logo-lime focus:ring-logo-lime border-gray-300 rounded"
                            />
                            <label className="ml-2 text-xs text-gray-700">
                              {t('admin.customers.modal.default')}
                            </label>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              {t('admin.customers.modal.street')} *
                            </label>
                            <input
                              type="text"
                              value={address.street}
                              onChange={(e) => updateCreateAddress(index, 'street', e.target.value)}
                              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-logo-lime focus:border-transparent"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              {t('admin.customers.modal.city')} *
                            </label>
                            <input
                              type="text"
                              value={address.city}
                              onChange={(e) => updateCreateAddress(index, 'city', e.target.value)}
                              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-logo-lime focus:border-transparent"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              {t('admin.customers.modal.postalCode')} *
                            </label>
                            <input
                              type="text"
                              value={address.postalCode}
                              onChange={(e) => updateCreateAddress(index, 'postalCode', e.target.value)}
                              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-logo-lime focus:border-transparent"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  {t('admin.customers.modal.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={creatingCustomer}
                  className="px-4 py-2 bg-logo-lime text-dark-green-7 rounded-lg hover:bg-logo-lime/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {creatingCustomer ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-dark-green-7"></div>
                      {t('admin.customers.modal.creating')}
                    </>
                  ) : (
                    <>
                      <LucideIcon name="plus" size="sm" />
                      {t('admin.customers.modal.createButton')}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersPage;
