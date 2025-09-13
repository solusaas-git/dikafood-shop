'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import PageLoader from '../ui/loading/PageLoader';

interface AdminAuthWrapperProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  redirectTo?: string;
}

/**
 * AdminAuthWrapper - Protects admin routes with authentication and role-based access
 */
export default function AdminAuthWrapper({ 
  children, 
  requiredRoles = ['admin', 'manager', 'sales'],
  redirectTo = '/admin/login'
}: AdminAuthWrapperProps) {
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === '/admin/login') {
      setIsAuthorized(true);
      setAuthError(null);
      return;
    }

    // Wait for auth context to finish loading
    if (authLoading) {
      setIsAuthorized(false);
      return;
    }

    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      setAuthError(null);
      setIsAuthorized(false);
      router.replace(redirectTo);
      return;
    }

    // Check if user has required role
    if (!requiredRoles.includes(user.role)) {
      setAuthError(`Access denied. Required roles: ${requiredRoles.join(', ')}`);
      setIsAuthorized(false);
      
      // Redirect to login after showing error briefly
      setTimeout(() => {
        router.replace(redirectTo);
      }, 2000);
      return;
    }

    // All checks passed - user is authenticated and has proper role
    setIsAuthorized(true);
    setAuthError(null);
    
  }, [user, isAuthenticated, authLoading, router, pathname, requiredRoles, redirectTo]);

  // Show loading spinner while checking authentication
  if (authLoading || (!isAuthorized && !authError && pathname !== '/admin/login')) {
    return <PageLoader message="Vérification de l'authentification..." />;
  }

  // Show error message if there's an auth error
  if (authError && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-white p-8 rounded-lg shadow-lg">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Accès refusé</h2>
          <p className="text-gray-600 mb-4">{authError}</p>
          <p className="text-gray-500 text-sm">Redirection vers la page de connexion...</p>
        </div>
      </div>
    );
  }

  // Render children if authorized or on login page
  if (isAuthorized || pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Fallback - should not reach here
  return null;
}
