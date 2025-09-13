'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useNotification } from '@/contexts/NotificationContextNew';
import LucideIcon from '../../../../components/ui/icons/LucideIcon';

interface SystemUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'admin' | 'manager' | 'sales';
  isActive: boolean;
  isEmailVerified: boolean;
  lastLogin?: string;
  systemInfo?: {
    department?: string;
    employeeId?: string;
    hireDate?: string;
    supervisor?: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
    failedLoginAttempts: number;
    permissions?: Array<{
      resource: string;
      actions: string[];
    }>;
  };
  profile?: {
    avatar?: string;
    bio?: string;
    preferences?: {
      language: string;
      currency: string;
      notifications?: {
        email: boolean;
        sms: boolean;
      };
    };
  };
  addresses?: Array<{
    type: string;
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country: string;
    isDefault: boolean;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface ViewSystemUserPageProps {
  params: Promise<{ id: string }>;
}

const ViewSystemUserPage = ({ params }: ViewSystemUserPageProps) => {
  const router = useRouter();
  const { addNotification } = useNotification();
  const [user, setUser] = useState<SystemUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { id } = await params;
        const response = await fetch(`/api/admin/system-users/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch user');
        }

        if (data.success) {
          setUser(data.data.user);
        }
      } catch (error: any) {
        console.error('Fetch user error:', error);
        addNotification({
          type: 'error',
          message: error.message || 'Failed to fetch user'
        });
        router.push('/admin/system-users');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [params, addNotification, router]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      case 'sales':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-logo-lime"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <LucideIcon name="users" size="3xl" color="gray" className="mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">User not found</h3>
          <p className="text-gray-500">The system user you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-900"
        >
          <LucideIcon name="arrowleft" size="lg" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-gray-600">System User Details</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/admin/system-users/${user._id}/edit`)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <LucideIcon name="pencil" size="sm" />
            Edit User
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <p className="text-sm text-gray-900">{user.firstName}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <p className="text-sm text-gray-900">{user.lastName}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <p className="text-sm text-gray-900">{user.email}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <p className="text-sm text-gray-900">{user.phone || 'Not provided'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                  {user.role}
                </span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.isActive)}`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>

          {/* System Information */}
          {user.systemInfo && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">System Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employee ID
                  </label>
                  <p className="text-sm text-gray-900">{user.systemInfo.employeeId || 'Not assigned'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <p className="text-sm text-gray-900 capitalize">
                    {user.systemInfo.department?.replace('_', ' ') || 'Not assigned'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hire Date
                  </label>
                  <p className="text-sm text-gray-900">
                    {user.systemInfo.hireDate ? formatDate(user.systemInfo.hireDate) : 'Not set'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Failed Login Attempts
                  </label>
                  <p className="text-sm text-gray-900">{user.systemInfo.failedLoginAttempts || 0}</p>
                </div>
                
                {user.systemInfo.supervisor && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Supervisor
                    </label>
                    <p className="text-sm text-gray-900">
                      {user.systemInfo.supervisor.firstName} {user.systemInfo.supervisor.lastName}
                      <span className="text-gray-500 ml-2">({user.systemInfo.supervisor.email})</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Permissions */}
          {user.systemInfo?.permissions && user.systemInfo.permissions.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Permissions</h2>
              
              <div className="space-y-3">
                {user.systemInfo.permissions.map((permission, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900 capitalize">{permission.resource}</p>
                    </div>
                    <div className="flex gap-1">
                      {permission.actions.map((action) => (
                        <span
                          key={action}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {action}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Information */}
        <div className="space-y-6">
          {/* Account Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Email Verified</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.isEmailVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {user.isEmailVerified ? 'Verified' : 'Unverified'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Account Status</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.isActive)}`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Login</span>
                <span className="text-sm text-gray-900">
                  {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                </span>
              </div>
            </div>
          </div>

          {/* Preferences */}
          {user.profile?.preferences && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h2>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Language</span>
                  <span className="text-sm text-gray-900 uppercase">{user.profile.preferences.language}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Currency</span>
                  <span className="text-sm text-gray-900">{user.profile.preferences.currency}</span>
                </div>
                
                {user.profile.preferences.notifications && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Email Notifications</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.profile.preferences.notifications.email ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.profile.preferences.notifications.email ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">SMS Notifications</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.profile.preferences.notifications.sms ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.profile.preferences.notifications.sms ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h2>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Created
                </label>
                <p className="text-sm text-gray-900">{formatDate(user.createdAt)}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Updated
                </label>
                <p className="text-sm text-gray-900">{formatDate(user.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSystemUserPage;
