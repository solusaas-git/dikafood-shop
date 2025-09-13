'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdmin } from '../../contexts/AdminContext';
import { useAuth } from '../../contexts/AuthContext';
import LucideIcon from '../ui/icons/LucideIcon';
import { useTranslation } from '../../utils/i18n';

const AdminSidebar = () => {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar, hasPermission } = useAdmin();
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [authFailed, setAuthFailed] = useState(false);

  // Fetch pending orders count
  useEffect(() => {
    const fetchPendingOrdersCount = async () => {
      try {
        // Check if user is authenticated and has proper role
        if (!user || !['admin', 'manager', 'sales'].includes(user.role)) {
          setPendingOrdersCount(0);
          setAuthFailed(false);
          return;
        }

        // Skip if auth has failed previously
        if (authFailed) {
          return;
        }

        // Import the API service which handles authentication properly
        const { api } = await import('../../services/api.js');
        
        const response = await api.request('/admin/orders?status=pending&limit=1');
        
        if (response.success && response.data.stats) {
          setPendingOrdersCount(response.data.stats.pendingOrders || 0);
          setAuthFailed(false); // Reset auth failed state on success
        } else {
          setPendingOrdersCount(0);
        }
      } catch (error) {
        console.error('Error fetching pending orders count:', error);
        setPendingOrdersCount(0);
        
        // If it's an auth error, stop polling
        if (error.message?.includes('Invalid access token') || 
            error.message?.includes('Authentication failed') ||
            error.message?.includes('Session expired') ||
            error.status === 401) {
          setAuthFailed(true);
          return;
        }
      }
    };

    // Reset auth failed state when user changes
    setAuthFailed(false);

    // Only fetch if user is authenticated and has permission to view orders
    if (user && hasPermission('view_orders')) {
      fetchPendingOrdersCount();
      
      // Refresh count every 30 seconds, but only if still authenticated and auth hasn't failed
      const interval = setInterval(() => {
        if (user && hasPermission('view_orders') && !authFailed) {
          fetchPendingOrdersCount();
        }
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [hasPermission, user, authFailed]);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/admin/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const menuItems = [
    {
      name: t('admin.sidebar.dashboard'),
      href: '/admin',
      icon: 'storefront',
      permission: 'view_dashboard'
    },
    {
      name: t('admin.sidebar.orders'),
      href: '/admin/orders',
      icon: 'shoppingbag',
      permission: 'view_orders',
      badge: pendingOrdersCount > 0 ? pendingOrdersCount.toString() : null
    },
    {
      name: t('admin.sidebar.products'),
      href: '/admin/products',
      icon: 'package',
      permission: 'view_products'
    },
    {
      name: t('admin.sidebar.customers'),
      href: '/admin/customers',
      icon: 'user',
      permission: 'view_customers'
    },
    {
      name: t('admin.sidebar.catalogLeads'),
      href: '/admin/catalog-leads',
      icon: 'clipboard',
      permission: 'view_customers'
    },
    {
      name: t('admin.sidebar.contactLeads'),
      href: '/admin/contact-leads',
      icon: 'mail',
      permission: 'view_customers'
    },
    {
      name: t('admin.sidebar.analytics'),
      href: '/admin/analytics',
      icon: 'analytics',
      permission: 'view_analytics'
    },
    {
      name: t('admin.sidebar.sessions'),
      href: '/admin/sessions',
      icon: 'users',
      permission: 'manage_sessions'
    },
    {
      name: t('admin.sidebar.settings'),
      href: '/admin/settings',
      icon: 'gear',
      permission: 'manage_settings'
    }
  ];

  const filteredMenuItems = menuItems.filter(item => hasPermission(item.permission));

  return (
    <>
      {/* Sidebar */}
      <aside 
        className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-40 ${
          sidebarOpen ? 'w-64' : 'w-16'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-logo-lime rounded-lg flex items-center justify-center">
                <LucideIcon name="storefront" size="lg" color="dark-green" />
              </div>
              {sidebarOpen && (
                <div className="ml-3">
                  <h2 className="text-lg font-semibold text-gray-900">{t('admin.sidebar.title')}</h2>
                  <p className="text-xs text-gray-500">{t('admin.sidebar.subtitle')}</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {filteredMenuItems.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== '/admin' && pathname.startsWith(item.href));
                
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-logo-lime/10 text-logo-lime border border-logo-lime/20'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <LucideIcon 
                        name={item.icon} 
                        size="lg" 
                        className={isActive ? 'text-logo-lime' : 'text-gray-500'} 
                      />
                      {sidebarOpen && (
                        <>
                          <span className="ml-3">{item.name}</span>
                          {item.badge && (
                            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer Actions */}
          <div className="p-4 border-t border-gray-200 space-y-2">
            {sidebarOpen ? (
              <>
                <Link
                  href="/admin/profile"
                  className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <LucideIcon name="user" size="lg" color="gray" />
                  <span className="ml-3">{t('admin.sidebar.profileSettings')}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <LucideIcon name="signout" size="lg" color="gray" />
                  <span className="ml-3">{t('admin.sidebar.signOut')}</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/admin/profile"
                  className="flex items-center justify-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title={t('admin.sidebar.profileSettings')}
                >
                  <LucideIcon name="user" size="lg" color="gray" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center w-full p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title={t('admin.sidebar.signOut')}
                >
                  <LucideIcon name="signout" size="lg" color="gray" />
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default AdminSidebar;
