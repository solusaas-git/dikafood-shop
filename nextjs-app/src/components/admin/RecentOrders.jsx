'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '../../utils/i18n';
import LucideIcon from '../ui/icons/LucideIcon';

const RecentOrders = () => {
  const { t } = useTranslation();
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        setLoading(true);
        
        // Import the API service
        const { api } = await import('../../services/api.js');
        
        // Use the API service which handles authentication headers correctly
        const response = await api.request('/admin/dashboard/recent-orders');
        
        if (response.success) {
          setRecentOrders(response.data);
        } else {
          setError(response.message || t('admin.error.loadingOrders'));
        }
      } catch (err) {
        setError(t('admin.error.loadingOrders'));
        console.error('Recent orders error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      'pending': t('admin.orders.status.pending'),
      'confirmed': t('admin.orders.status.confirmed'),
      'shipped': t('admin.orders.status.shipped'),
      'delivered': t('admin.orders.status.delivered'),
      'cancelled': t('admin.orders.status.cancelled')
    };
    return statusMap[status] || status;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">{t('admin.orders.recent')}</h3>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex items-center space-x-4 p-4">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="text-right">
                  <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-12"></div>
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
          <h3 className="text-lg font-semibold text-gray-900">{t('admin.orders.recent')}</h3>
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
        <h3 className="text-lg font-semibold text-gray-900">{t('admin.orders.recent')}</h3>
        <Link 
          href="/admin/orders"
          className="text-sm text-logo-lime hover:text-logo-lime/80 font-medium"
        >
          {t('admin.orders.viewAll')}
        </Link>
      </div>

      <div className="space-y-4">
        {recentOrders.map((order) => (
          <div 
            key={order.id} 
            className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-logo-lime/10 rounded-lg flex items-center justify-center">
                <LucideIcon name="shoppingbag" size="sm" color="logo-lime" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">{order.id}</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{order.customer}</p>
                <p className="text-xs text-gray-500">{formatDate(order.date)}</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="font-semibold text-gray-900">{order.total} MAD</p>
              <p className="text-sm text-gray-600">{order.items} {t('admin.orders.items')}</p>
            </div>
          </div>
        ))}
      </div>

      {recentOrders.length === 0 && !loading && (
        <div className="text-center py-8">
          <LucideIcon name="shoppingbag" size="lg" color="gray" className="mx-auto mb-3" />
          <p className="text-gray-500">{t('admin.orders.noRecent')}</p>
        </div>
      )}
    </div>
  );
};

export default RecentOrders;
