'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useTranslation } from '@/utils/i18n';
import DashboardStats from '../../components/admin/DashboardStats';
import RecentOrders from '../../components/admin/RecentOrders';
import RecentUsers from '../../components/admin/RecentUsers';
import SalesChart from '../../components/admin/SalesChart';
import TopProducts from '../../components/admin/TopProducts';
import PageLoader from '@components/ui/loading/PageLoader';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/admin/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <PageLoader message="Chargement du tableau de bord..." className="" style={{}} />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t('admin.dashboard.welcome', { name: user?.firstName })}
            </h1>
            <p className="text-gray-600 mt-1">
              {t('admin.dashboard.subtitle')}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">
              {new Date().toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Dashboard Stats */}
      <DashboardStats />

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart />
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('admin.dashboard.quickActions')}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => router.push('/admin/products/new')}
              className="p-4 border border-gray-200 rounded-lg hover:border-logo-lime hover:bg-logo-lime/5 transition-colors"
            >
              <div className="text-logo-lime text-2xl mb-2">📦</div>
              <div className="text-sm font-medium text-gray-900">{t('admin.dashboard.addProduct')}</div>
            </button>
            <button 
              onClick={() => router.push('/admin/orders')}
              className="p-4 border border-gray-200 rounded-lg hover:border-logo-lime hover:bg-logo-lime/5 transition-colors"
            >
              <div className="text-logo-lime text-2xl mb-2">📋</div>
              <div className="text-sm font-medium text-gray-900">{t('admin.dashboard.viewOrders')}</div>
            </button>
            <button 
              onClick={() => router.push('/admin/catalog-leads')}
              className="p-4 border border-gray-200 rounded-lg hover:border-logo-lime hover:bg-logo-lime/5 transition-colors"
            >
              <div className="text-logo-lime text-2xl mb-2">📄</div>
              <div className="text-sm font-medium text-gray-900">{t('admin.dashboard.catalogLeads')}</div>
            </button>
            <button 
              onClick={() => router.push('/admin/analytics')}
              className="p-4 border border-gray-200 rounded-lg hover:border-logo-lime hover:bg-logo-lime/5 transition-colors"
            >
              <div className="text-logo-lime text-2xl mb-2">📊</div>
              <div className="text-sm font-medium text-gray-900">{t('admin.dashboard.analytics')}</div>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentOrders />
        <RecentUsers />
      </div>

      {/* Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TopProducts />
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('admin.dashboard.quickInsights')}
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <div className="text-blue-600 text-xl mr-3">📊</div>
                <div>
                  <p className="text-sm font-medium text-blue-900">{t('admin.dashboard.performance')}</p>
                  <p className="text-xs text-blue-700">{t('admin.dashboard.performanceDesc')}</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <div className="text-green-600 text-xl mr-3">🎯</div>
                <div>
                  <p className="text-sm font-medium text-green-900">{t('admin.dashboard.inventory')}</p>
                  <p className="text-xs text-green-700">{t('admin.dashboard.inventoryDesc')}</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center">
                <div className="text-purple-600 text-xl mr-3">💡</div>
                <div>
                  <p className="text-sm font-medium text-purple-900">{t('admin.dashboard.trends')}</p>
                  <p className="text-xs text-purple-700">{t('admin.dashboard.trendsDesc')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
