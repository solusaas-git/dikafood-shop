'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '../../utils/i18n';
import LucideIcon from '../ui/icons/LucideIcon';

const RecentUsers = () => {
  const { t } = useTranslation();
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentUsers = async () => {
      try {
        setLoading(true);
        
        // Import the API service
        const { api } = await import('../../services/api.js');
        
        // Use the API service which handles authentication headers correctly
        const response = await api.request('/admin/dashboard/recent-users');
        
        if (response.success) {
          setRecentUsers(response.data);
        } else {
          setError(response.message || t('admin.error.loadingUsers'));
        }
      } catch (err) {
        setError(t('admin.error.loadingUsers'));
        console.error('Recent users error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentUsers();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      'active': t('admin.users.status.active'),
      'inactive': t('admin.users.status.inactive')
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

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">{t('admin.users.recent')}</h3>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex items-center space-x-4 p-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-40"></div>
                </div>
                <div className="text-right">
                  <div className="h-4 bg-gray-200 rounded w-8 mb-2"></div>
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
          <h3 className="text-lg font-semibold text-gray-900">{t('admin.users.recent')}</h3>
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
        <h3 className="text-lg font-semibold text-gray-900">{t('admin.users.recent')}</h3>
        <Link 
          href="/admin/customers"
          className="text-sm text-logo-lime hover:text-logo-lime/80 font-medium"
        >
          {t('admin.users.viewAll')}
        </Link>
      </div>

      <div className="space-y-4">
        {recentUsers.map((user) => (
          <div 
            key={user.id} 
            className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-logo-lime rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-dark-green-7">
                  {getInitials(user.name)}
                </span>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">{user.name}</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                    {getStatusText(user.status)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{user.phone}</p>
                <p className="text-xs text-gray-500">{user.city} • {t('admin.users.joined')} {formatDate(user.joinDate)}</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="font-semibold text-gray-900">{user.orders}</p>
              <p className="text-sm text-gray-600">{t('admin.users.orders')}</p>
            </div>
          </div>
        ))}
      </div>

      {recentUsers.length === 0 && !loading && (
        <div className="text-center py-8">
          <LucideIcon name="users" size="lg" color="gray" className="mx-auto mb-3" />
          <p className="text-gray-500">{t('admin.users.noRecent')}</p>
        </div>
      )}
    </div>
  );
};

export default RecentUsers;
