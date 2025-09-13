'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useNotification } from '@/contexts/NotificationContextNew';
import LucideIcon from '../../../../../components/ui/icons/LucideIcon';

interface SystemUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'admin' | 'manager' | 'sales';
  isActive: boolean;
  isEmailVerified: boolean;
  systemInfo?: {
    department?: string;
    employeeId?: string;
    hireDate?: string;
    supervisor?: string;
    permissions?: Array<{
      resource: string;
      actions: string[];
    }>;
  };
}

interface EditSystemUserPageProps {
  params: Promise<{ id: string }>;
}

const EditSystemUserPage = ({ params }: EditSystemUserPageProps) => {
  const router = useRouter();
  const { addNotification } = useNotification();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'sales' as 'admin' | 'manager' | 'sales',
    isActive: true,
    isEmailVerified: false,
    systemInfo: {
      department: '',
      employeeId: '',
      hireDate: '',
      supervisor: ''
    }
  });

  const [supervisors, setSupervisors] = useState<Array<{_id: string, firstName: string, lastName: string}>>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { id } = await params;
        
        // Fetch user data and supervisors in parallel
        const [userResponse, supervisorsResponse] = await Promise.all([
          fetch(`/api/admin/system-users/${id}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
          }),
          fetch('/api/admin/system-users?limit=100', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
          })
        ]);

        const userData = await userResponse.json();
        const supervisorsData = await supervisorsResponse.json();

        if (!userResponse.ok) {
          throw new Error(userData.message || 'Failed to fetch user');
        }

        if (userData.success) {
          const user = userData.data.user;
          setFormData({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            phone: user.phone || '',
            role: user.role || 'sales',
            isActive: user.isActive ?? true,
            isEmailVerified: user.isEmailVerified ?? false,
            systemInfo: {
              department: user.systemInfo?.department || '',
              employeeId: user.systemInfo?.employeeId || '',
              hireDate: user.systemInfo?.hireDate ? user.systemInfo.hireDate.split('T')[0] : '',
              supervisor: user.systemInfo?.supervisor?._id || ''
            }
          });
        }

        if (supervisorsData.success) {
          // Filter out current user from supervisors list
          const availableSupervisors = supervisorsData.data.users.filter(
            (u: any) => u._id !== id && (u.role === 'admin' || u.role === 'manager')
          );
          setSupervisors(availableSupervisors);
        }

      } catch (error: any) {
        console.error('Fetch user error:', error);
        addNotification({
          type: 'error',
          message: error.message || 'Failed to fetch user data'
        });
        router.push('/admin/system-users');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params, addNotification, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name.startsWith('systemInfo.')) {
      const field = name.replace('systemInfo.', '');
      setFormData(prev => ({
        ...prev,
        systemInfo: {
          ...prev.systemInfo,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      addNotification({
        type: 'error',
        message: 'Please fill in all required fields'
      });
      return;
    }

    setSaving(true);
    try {
      const { id } = await params;
      
      const updateData = {
        ...formData,
        systemInfo: {
          ...formData.systemInfo,
          hireDate: formData.systemInfo.hireDate ? new Date(formData.systemInfo.hireDate).toISOString() : null,
          supervisor: formData.systemInfo.supervisor || null
        }
      };

      const response = await fetch(`/api/admin/system-users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update user');
      }

      if (data.success) {
        addNotification({
          type: 'success',
          message: 'System user updated successfully'
        });
        router.push(`/admin/system-users/${id}`);
      }
    } catch (error: any) {
      console.error('Update user error:', error);
      addNotification({
        type: 'error',
        message: error.message || 'Failed to update user'
      });
    } finally {
      setSaving(false);
    }
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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit System User</h1>
          <p className="text-gray-600">Update system user information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                placeholder="Enter first name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                placeholder="Enter last name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                placeholder="Enter email address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role *
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
              >
                <option value="sales">Sales</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 text-logo-lime focus:ring-logo-lime border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Active Account
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isEmailVerified"
                  checked={formData.isEmailVerified}
                  onChange={handleChange}
                  className="h-4 w-4 text-logo-lime focus:ring-logo-lime border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Email Verified
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">System Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employee ID
              </label>
              <input
                type="text"
                name="systemInfo.employeeId"
                value={formData.systemInfo.employeeId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                placeholder="Enter employee ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                name="systemInfo.department"
                value={formData.systemInfo.department}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
              >
                <option value="">Select Department</option>
                <option value="administration">Administration</option>
                <option value="sales">Sales</option>
                <option value="marketing">Marketing</option>
                <option value="operations">Operations</option>
                <option value="customer_service">Customer Service</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hire Date
              </label>
              <input
                type="date"
                name="systemInfo.hireDate"
                value={formData.systemInfo.hireDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supervisor
              </label>
              <select
                name="systemInfo.supervisor"
                value={formData.systemInfo.supervisor}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
              >
                <option value="">No Supervisor</option>
                {supervisors.map((supervisor) => (
                  <option key={supervisor._id} value={supervisor._id}>
                    {supervisor.firstName} {supervisor.lastName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-logo-lime text-dark-green-7 rounded-lg hover:bg-logo-lime/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-dark-green-7"></div>
                Saving...
              </>
            ) : (
              <>
                <LucideIcon name="check" size="sm" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditSystemUserPage;
