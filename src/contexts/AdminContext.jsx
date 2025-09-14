'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0,
    loading: true
  });

  // Check if user has admin privileges
  const isAdmin = isAuthenticated && (user?.role === 'admin' || user?.role === 'manager');
  const isSuperAdmin = isAuthenticated && user?.role === 'admin';

  // Fetch dashboard stats
  const fetchDashboardStats = async () => {
    if (!isAdmin) return;
    
    try {
      setDashboardStats(prev => ({ ...prev, loading: true }));
      
      // Import the API service
      const { api } = await import('../services/api.js');
      
      // Use the API service which handles authentication headers correctly
      const response = await api.request('/admin/dashboard/stats');
      
      if (response.success) {
        setDashboardStats({
          totalOrders: response.data.totalOrders,
          totalRevenue: response.data.totalRevenue,
          totalProducts: response.data.totalProducts,
          totalUsers: response.data.totalUsers,
          growth: response.data.growth,
          loading: false
        });
      } else {
        throw new Error(response.message || 'Failed to fetch stats');
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      setDashboardStats(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardStats();
    }
  }, [isAdmin]);

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Refresh dashboard data
  const refreshDashboard = () => {
    fetchDashboardStats();
  };

  const value = {
    // User permissions
    isAdmin,
    isSuperAdmin,
    
    // UI state
    sidebarOpen,
    toggleSidebar,
    
    // Dashboard data
    dashboardStats,
    refreshDashboard,
    
    // Helper functions
    hasPermission: (permission) => {
      if (!isAdmin) return false;
      
      // Super admin has all permissions
      if (isSuperAdmin) return true;
      
      // Manager permissions
      const managerPermissions = [
        'view_dashboard',
        'view_orders',
        'manage_orders',
        'view_products',
        'manage_products',
        'view_users',
        'view_analytics'
      ];
      
      return managerPermissions.includes(permission);
    }
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
