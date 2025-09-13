'use client';

import React from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { useTranslation } from '../../utils/i18n';
import LucideIcon from '../ui/icons/LucideIcon';

const DashboardStats = () => {
  const { dashboardStats } = useAdmin();
  const { t } = useTranslation();

  const formatGrowth = (growth) => {
    if (!growth && growth !== 0) return '+0%';
    const sign = growth >= 0 ? '+' : '';
    return `${sign}${growth}%`;
  };

  const getChangeType = (growth) => {
    if (!growth && growth !== 0) return 'neutral';
    return growth >= 0 ? 'increase' : 'decrease';
  };

  const stats = [
    {
      name: t('admin.stats.totalOrders'),
      value: dashboardStats.totalOrders,
      icon: 'shoppingbag',
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      change: formatGrowth(dashboardStats.growth?.orders),
      changeType: getChangeType(dashboardStats.growth?.orders)
    },
    {
      name: t('admin.stats.revenue'),
      value: `${dashboardStats.totalRevenue.toLocaleString()} MAD`,
      icon: 'dollarsign',
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      change: formatGrowth(dashboardStats.growth?.revenue),
      changeType: getChangeType(dashboardStats.growth?.revenue)
    },
    {
      name: t('admin.stats.products'),
      value: dashboardStats.totalProducts,
      icon: 'package',
      color: 'purple',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      change: formatGrowth(dashboardStats.growth?.products),
      changeType: getChangeType(dashboardStats.growth?.products)
    },
    {
      name: t('admin.stats.customers'),
      value: dashboardStats.totalUsers,
      icon: 'users',
      color: 'orange',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      change: formatGrowth(dashboardStats.growth?.users),
      changeType: getChangeType(dashboardStats.growth?.users)
    }
  ];

  if (dashboardStats.loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="ml-4 flex-1">
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
              <LucideIcon 
                name={stat.icon} 
                size="md" 
                className={stat.iconColor}
              />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
          
          {/* Change indicator */}
          <div className="mt-4 flex items-center">
            <div className={`flex items-center text-sm ${
              stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              <LucideIcon 
                name={stat.changeType === 'increase' ? 'trendingup' : 'trendingdown'} 
                size="sm" 
                className="mr-1"
              />
              {stat.change}
            </div>
            <span className="text-sm text-gray-500 ml-2">{t('admin.stats.fromLastMonth')}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
