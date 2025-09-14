'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useNotification } from '@/contexts/NotificationContextNew';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/utils/i18n';
import LucideIcon from '../../../components/ui/icons/LucideIcon';
import { PaginationControls } from '../../../components/ui/navigation/Pagination';

interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    customerType: string;
  };
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: string;
  total: number;
  currency: string;
  itemsCount: number;
  createdAt: string;
  updatedAt: string;
  estimatedDeliveryDate?: string;
  trackingNumber?: string;
  carrier?: string;
}

interface OrderFilters {
  status: string;
  paymentStatus: string;
  dateRange: string;
  search: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalOrders: number;
  limit: number;
}

const OrdersPage = () => {
  const router = useRouter();
  const { addNotification } = useNotification();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { t } = useTranslation();

  // All useState hooks must be at the top level
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<OrderFilters>({
    status: '',
    paymentStatus: '',
    dateRange: '',
    search: ''
  });
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
    limit: 10
  });

  // Order statistics
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    deliveredOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0
  });

  const [showCreateModal, setShowCreateModal] = useState(false);

  // Authentication check
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/admin/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Fetch orders effect - must be before conditional returns
  useEffect(() => {
    // Only fetch orders if authenticated and not loading
    if (!authLoading && isAuthenticated) {
      fetchOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, authLoading, isAuthenticated]);

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

  // Fetch orders
  const fetchOrders = async (page = 1, limit = pagination.limit) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters.status && { status: filters.status }),
        ...(filters.paymentStatus && { paymentStatus: filters.paymentStatus }),
        ...(filters.dateRange && { dateRange: filters.dateRange }),
        ...(filters.search && { search: filters.search })
      });

      // Get token from localStorage
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await fetch(`/api/admin/orders?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();

      if (data.success) {
        setOrders(data.data.orders);
        setPagination(data.data.pagination);
        setStats(data.data.stats);
      } else {
        addNotification(t('admin.orders.fetchFailed'), 'error');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      addNotification(t('admin.orders.fetchError'), 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof OrderFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      status: '',
      paymentStatus: '',
      dateRange: '',
      search: ''
    });
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
    fetchOrders(page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newLimit: number) => {
    setPagination(prev => ({ ...prev, limit: newLimit, currentPage: 1 }));
    fetchOrders(1, newLimit);
  };

  // Delete order
  const handleDelete = async (orderId: string) => {
    if (!confirm(t('admin.orders.deleteConfirm'))) {
      return;
    }

    try {
      // Get token from localStorage
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        addNotification(t('admin.orders.deleteSuccess'), 'success');
        fetchOrders(pagination.currentPage);
      } else {
        addNotification(data.message || t('admin.orders.deleteError'), 'error');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      addNotification(t('admin.orders.deleteError'), 'error');
    }
  };

  // Status badge colors
  const getStatusBadgeColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      returned: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusBadgeColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  // Translate status labels
  const getStatusText = (status: string) => {
    const statusMap = {
      'pending': t('admin.orders.status.pending'),
      'confirmed': t('admin.orders.status.confirmed'),
      'processing': t('admin.orders.status.processing'),
      'shipped': t('admin.orders.status.shipped'),
      'delivered': t('admin.orders.status.delivered'),
      'cancelled': t('admin.orders.status.cancelled'),
      'returned': t('admin.orders.status.returned')
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getPaymentStatusText = (status: string) => {
    const statusMap = {
      'pending': t('admin.orders.payment.pending'),
      'paid': t('admin.orders.payment.paid'),
      'failed': t('admin.orders.payment.failed'),
      'refunded': t('admin.orders.payment.refunded')
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getPaymentMethodText = (method: string) => {
    const methodMap = {
      'cash_on_delivery': t('admin.orders.paymentMethod.cash_on_delivery'),
      'credit_card': t('admin.orders.paymentMethod.credit_card'),
      'bank_transfer': t('admin.orders.paymentMethod.bank_transfer'),
      'paypal': t('admin.orders.paymentMethod.paypal'),
      'stripe': t('admin.orders.paymentMethod.stripe'),
      'cash': t('admin.orders.paymentMethod.cash')
    };
    return methodMap[method as keyof typeof methodMap] || method;
  };

  // Format currency
  const formatCurrency = (amount: number, currency: string = 'MAD') => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('admin.orders.title')}</h1>
          <p className="text-gray-600 mt-1">{t('admin.orders.subtitle')}</p>
        </div>
        <button
          onClick={() => router.push('/admin/orders/create')}
          className="flex items-center gap-2 bg-logo-lime text-dark-green-7 px-4 py-2 rounded-lg hover:bg-logo-lime/90 font-medium"
        >
          <LucideIcon name="plus" size="sm" />
          {t('admin.orders.createOrder')}
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('admin.orders.stats.total')}</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <LucideIcon name="clipboardtext" size="md" className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('admin.orders.stats.pending')}</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <LucideIcon name="circlenotch" size="md" className="text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('admin.orders.stats.processing')}</p>
              <p className="text-2xl font-bold text-blue-600">{stats.processingOrders}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <LucideIcon name="gear" size="md" className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('admin.orders.stats.delivered')}</p>
              <p className="text-2xl font-bold text-green-600">{stats.deliveredOrders}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <LucideIcon name="checkcircle" size="md" className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('admin.orders.stats.totalRevenue')}</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <LucideIcon name="currencydollar" size="md" className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('admin.orders.stats.avgOrder')}</p>
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(stats.averageOrderValue)}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <LucideIcon name="trendup" size="md" className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.orders.filters.search')}</label>
            <div className="relative">
              <input
                type="text"
                placeholder={t('admin.orders.filters.searchPlaceholder')}
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
              />
              <LucideIcon name="magnifyingglass" size="sm" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.orders.filters.status')}</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
            >
              <option value="">{t('admin.orders.filters.allStatuses')}</option>
              <option value="pending">{t('admin.orders.status.pending')}</option>
              <option value="confirmed">{t('admin.orders.status.confirmed')}</option>
              <option value="processing">{t('admin.orders.status.processing')}</option>
              <option value="shipped">{t('admin.orders.status.shipped')}</option>
              <option value="delivered">{t('admin.orders.status.delivered')}</option>
              <option value="cancelled">{t('admin.orders.status.cancelled')}</option>
              <option value="returned">{t('admin.orders.status.returned')}</option>
            </select>
          </div>

          {/* Payment Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.orders.filters.paymentStatus')}</label>
            <select
              value={filters.paymentStatus}
              onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
            >
              <option value="">{t('admin.orders.filters.allPaymentStatus')}</option>
              <option value="pending">{t('admin.orders.payment.pending')}</option>
              <option value="paid">{t('admin.orders.payment.paid')}</option>
              <option value="failed">{t('admin.orders.payment.failed')}</option>
              <option value="refunded">{t('admin.orders.payment.refunded')}</option>
            </select>
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.orders.filters.dateRange')}</label>
            <select
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
            >
              <option value="">{t('admin.orders.filters.allTime')}</option>
              <option value="today">{t('admin.orders.filters.today')}</option>
              <option value="yesterday">{t('admin.orders.filters.yesterday')}</option>
              <option value="last7days">{t('admin.orders.filters.last7days')}</option>
              <option value="last30days">{t('admin.orders.filters.last30days')}</option>
              <option value="thismonth">{t('admin.orders.filters.thismonth')}</option>
              <option value="lastmonth">{t('admin.orders.filters.lastmonth')}</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {t('admin.orders.filters.clearFilters')}
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.orders.table.order')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.orders.table.customer')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.orders.table.status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.orders.table.payment')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.orders.table.total')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.orders.table.items')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.orders.table.date')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.orders.table.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-logo-lime"></div>
                      <span className="ml-2 text-gray-500">{t('admin.orders.loadingOrders')}</span>
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <LucideIcon name="clipboardtext" size="xl" className="text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{t('admin.orders.noOrdersFound')}</h3>
                      <p className="text-gray-500 mb-4">
                        {Object.values(filters).some(filter => filter !== '') 
                          ? t('admin.orders.adjustFilters')
                          : t('admin.orders.createFirst')
                        }
                      </p>
                      <button
                        onClick={() => router.push('/admin/orders/create')}
                        className="flex items-center gap-2 bg-logo-lime text-dark-green-7 px-4 py-2 rounded-lg hover:bg-logo-lime/90"
                      >
                        <LucideIcon name="plus" size="sm" />
                        {t('admin.orders.createOrder')}
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.orderNumber}
                        </div>
                        {order.trackingNumber && (
                          <div className="text-xs text-gray-500">
                            {t('admin.orders.tracking')}: {order.trackingNumber}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.customer.firstName} {order.customer.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.customer.email}
                        </div>
                        <div className="text-xs text-gray-400 capitalize">
                          {order.customer.customerType.replace('_', ' ')}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusBadgeColor(order.paymentStatus)}`}>
                          {getPaymentStatusText(order.paymentStatus)}
                        </span>
                        {order.paymentMethod && (
                          <div className="text-xs text-gray-500 mt-1">
                            {getPaymentMethodText(order.paymentMethod)}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(order.total, order.currency)}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {order.itemsCount || 0} {(order.itemsCount || 0) === 1 ? t('admin.orders.item') : t('admin.orders.items')}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {formatDate(order.createdAt)}
                      </div>
                      {order.estimatedDeliveryDate && (
                        <div className="text-xs text-gray-500">
                          {t('admin.orders.estDelivery')}: {formatDate(order.estimatedDeliveryDate)}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => router.push(`/admin/orders/${order._id}`)}
                          className="text-logo-lime hover:text-logo-lime/80 p-1"
                          title={t('admin.orders.actions.view')}
                        >
                          <LucideIcon name="eye" size="sm" />
                        </button>
                        <button
                          onClick={() => router.push(`/admin/orders/${order._id}/edit`)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title={t('admin.orders.actions.edit')}
                        >
                          <LucideIcon name="pencil" size="sm" />
                        </button>
                        <button
                          onClick={() => handleDelete(order._id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title={t('admin.orders.actions.delete')}
                        >
                          <LucideIcon name="trash" size="sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalOrders > 0 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <PaginationControls
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalOrders}
              itemsPerPage={pagination.limit}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
              options={[10, 20, 50, 100]}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
