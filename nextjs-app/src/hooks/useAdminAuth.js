import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

/**
 * Custom hook for admin authentication and error handling
 * Automatically handles token errors and redirects
 */
export function useAdminAuth(requiredRoles = ['admin', 'manager', 'sales']) {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();
  const [authError, setAuthError] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated || !user) {
      setAuthError('Authentication required');
      router.push('/admin/login');
      return;
    }

    if (!requiredRoles.includes(user.role)) {
      setAuthError(`Access denied. Required roles: ${requiredRoles.join(', ')}`);
      setTimeout(() => router.push('/admin/login'), 2000);
      return;
    }

    setIsAuthorized(true);
    setAuthError(null);
  }, [user, isAuthenticated, loading, requiredRoles, router]);

  /**
   * Handle API errors - automatically logout and redirect on auth errors
   */
  const handleApiError = async (error, response = null) => {
    if (response?.status === 401 || response?.status === 403) {
      console.log('🚨 Authentication error detected, logging out...');
      await logout();
      router.push('/admin/login');
      return true; // Indicates error was handled
    }
    return false; // Error not handled
  };

  /**
   * Make authenticated API request with automatic error handling
   */
  const authenticatedFetch = async (url, options = {}) => {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      await logout();
      router.push('/admin/login');
      throw new Error('No access token');
    }

    const defaultOptions = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    try {
      const response = await fetch(url, { ...options, ...defaultOptions });
      
      // Handle auth errors automatically
      if (response.status === 401 || response.status === 403) {
        console.log('🚨 API authentication error, logging out...');
        await logout();
        router.push('/admin/login');
        throw new Error('Authentication failed');
      }

      return response;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  };

  return {
    user,
    isAuthenticated,
    loading,
    authError,
    isAuthorized,
    handleApiError,
    authenticatedFetch,
    logout: async () => {
      await logout();
      router.push('/admin/login');
    }
  };
}
