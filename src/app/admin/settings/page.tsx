'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { useTranslation } from '@/utils/i18n';
import LucideIcon from '../../../components/ui/icons/LucideIcon';

// Lazy import the tab components
const CitiesTab = React.lazy(() => import('../../../components/admin/settings/CitiesTab'));
const BrandsTab = React.lazy(() => import('../../../components/admin/settings/BrandsTab'));
const CategoriesTab = React.lazy(() => import('../../../components/admin/settings/CategoriesTab'));
const DeliveryMethodsTab = React.lazy(() => import('../../../components/admin/settings/DeliveryMethodsTab'));
const PaymentMethodsTab = React.lazy(() => import('../../../components/admin/settings/PaymentMethodsTab'));
const EmailTab = React.lazy(() => import('../../../components/admin/settings/EmailTab'));
const SystemUsersTab = React.lazy(() => import('../../../components/admin/settings/SystemUsersTab'));

const SettingsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { t } = useTranslation();
  
  // Get active tab from URL params, default to 'cities'
  const activeTab = searchParams.get('tab') || 'cities';

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/admin/login');
        return;
      }
      
      // Check if user is admin
      if (user?.role !== 'admin' && user?.role !== 'manager') {
        router.push('/');
        return;
      }
    }
  }, [user, isAuthenticated, authLoading, router]);

  const tabs = [
    {
      id: 'cities',
      name: t('admin.settings.tabs.cities.name'),
      icon: 'map-pin',
      description: t('admin.settings.tabs.cities.description')
    },
    {
      id: 'brands',
      name: t('admin.settings.tabs.brands.name'),
      icon: 'certificate',
      description: t('admin.settings.tabs.brands.description')
    },
    {
      id: 'categories',
      name: t('admin.settings.tabs.categories.name'),
      icon: 'tag',
      description: t('admin.settings.tabs.categories.description')
    },
    {
      id: 'delivery-methods',
      name: t('admin.settings.tabs.deliveryMethods.name'),
      icon: 'truck',
      description: t('admin.settings.tabs.deliveryMethods.description')
    },
    {
      id: 'payment-methods',
      name: t('admin.settings.tabs.paymentMethods.name'),
      icon: 'credit-card',
      description: t('admin.settings.tabs.paymentMethods.description')
    },
    {
      id: 'email',
      name: t('admin.settings.tabs.email.name'),
      icon: 'mail',
      description: t('admin.settings.tabs.email.description')
    },
    {
      id: 'system-users',
      name: t('admin.settings.tabs.systemUsers.name'),
      icon: 'users',
      description: t('admin.settings.tabs.systemUsers.description')
    },
  ];

  const handleTabChange = (tabId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tabId);
    router.push(`/admin/settings?${params.toString()}`);
  };

  const renderTabContent = () => {
    return (
      <React.Suspense 
        fallback={
          <div className="flex items-center justify-center p-8">
            <LucideIcon name="circlenotch" size="xl" color="logo-lime" className="animate-spin" />
            <span className="ml-3 text-gray-600">{t('common.loading')}</span>
          </div>
        }
      >
        {activeTab === 'cities' && <CitiesTab />}
        {activeTab === 'brands' && <BrandsTab />}
        {activeTab === 'categories' && <CategoriesTab />}
        {activeTab === 'delivery-methods' && <DeliveryMethodsTab />}
        {activeTab === 'payment-methods' && <PaymentMethodsTab />}
        {activeTab === 'email' && <EmailTab />}
        {activeTab === 'system-users' && <SystemUsersTab />}
      </React.Suspense>
    );
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <LucideIcon name="gear" size="xl" color="gray" />
          <h1 className="text-2xl font-bold text-gray-900">{t('admin.settings.title')}</h1>
        </div>
        <p className="text-gray-600">{t('admin.settings.subtitle')}</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center gap-2 transition-colors ${
                    isActive
                      ? 'border-logo-lime text-logo-lime'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  style={{ 
                    outline: 'none', 
                    boxShadow: 'none',
                    border: 'none',
                    borderBottom: isActive ? '2px solid #8FBC8F' : '2px solid transparent'
                  }}
                >
                  <LucideIcon 
                    name={tab.icon as any} 
                    size="md" 
                    className={isActive ? 'text-logo-lime' : 'text-gray-500'} 
                  />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Description */}
        <div className="px-6 py-3 bg-gray-50">
          <p className="text-sm text-gray-600">
            {tabs.find(tab => tab.id === activeTab)?.description}
          </p>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default SettingsPage;
