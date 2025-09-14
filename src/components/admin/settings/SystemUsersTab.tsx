'use client';

import React, { useState, useEffect } from 'react';
import { useNotification } from '@/contexts/NotificationContextNew';
import LucideIcon from '../../ui/icons/LucideIcon';
import { PaginationControls } from '../../ui/navigation/Pagination';
import { useTranslation } from '@/utils/i18n';

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
  };
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

const SystemUsersTab = () => {
  const { t } = useTranslation();
  const { addNotification } = useNotification();

  const [users, setUsers] = useState<SystemUser[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [creatingUser, setCreatingUser] = useState(false);
  const [updatingUser, setUpdatingUser] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    role: 'sales' as 'admin' | 'manager' | 'sales',
    department: '',
    employeeId: '',
    supervisor: '',
    hireDate: ''
  });
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'sales' as 'admin' | 'manager' | 'sales',
    department: '',
    employeeId: '',
    supervisor: '',
    hireDate: '',
    password: '',
    changePassword: false
  });
  const [supervisors, setSupervisors] = useState<SystemUser[]>([]);

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
    fetchUsers(page);
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    setPagination(prev => ({ ...prev, limit: newLimit, currentPage: 1 }));
    fetchUsers(1, newLimit);
  };

  const fetchUsers = async (page = 1, limit = pagination.limit) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(roleFilter !== 'all' && { role: roleFilter }),
        ...(departmentFilter !== 'all' && { department: departmentFilter }),
        ...(statusFilter !== 'all' && { isActive: statusFilter })
      });

      const response = await fetch(`/api/admin/system-users?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch system users');
      }

      if (data.success) {
        setUsers(data.data.users);
        setPagination(data.data.pagination);
      }
    } catch (error: any) {
      console.error('Fetch system users error:', error);
      addNotification({
        type: 'error',
        message: error.message || t('admin.settings.systemUsers.notifications.fetchFailed')
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, roleFilter, departmentFilter, statusFilter]);

  useEffect(() => {
    // Fetch supervisors when modal opens
    if (showCreateModal) {
      fetchSupervisors();
    }
  }, [showCreateModal]);

  const fetchSupervisors = async () => {
    try {
      const response = await fetch('/api/admin/system-users?role=admin,manager&limit=100', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setSupervisors(data.data.users);
      }
    } catch (error) {
      console.error('Fetch supervisors error:', error);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!createFormData.firstName || !createFormData.lastName || !createFormData.email || !createFormData.password) {
      addNotification({
        type: 'error',
        message: t('admin.settings.systemUsers.notifications.requiredFields')
      });
      return;
    }

    try {
      setCreatingUser(true);

      const response = await fetch('/api/admin/system-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          ...createFormData,
          ...(createFormData.phone && createFormData.phone.trim() ? { phone: createFormData.phone } : {}),
          department: createFormData.department || undefined
        }),
      });

      const data = await response.json();

      if (data.success) {
        addNotification({
          type: 'success',
          message: t('admin.settings.systemUsers.notifications.createSuccess')
        });
        setShowCreateModal(false);
        setCreateFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          phone: '',
          role: 'sales',
          department: '',
          employeeId: '',
          supervisor: '',
          hireDate: ''
        });
        fetchUsers(pagination.currentPage);
      } else {
        throw new Error(data.message || t('admin.settings.systemUsers.notifications.createFailed'));
      }
    } catch (error: any) {
      addNotification({
        type: 'error',
        message: error.message || t('admin.settings.systemUsers.notifications.createFailed')
      });
    } finally {
      setCreatingUser(false);
    }
  };

  const handleEditUser = (user: SystemUser) => {
    setEditingUser(user);
    setEditFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      department: user.systemInfo?.department || '',
      employeeId: user.systemInfo?.employeeId || '',
      supervisor: user.systemInfo?.supervisor?._id || '',
      hireDate: user.systemInfo?.hireDate || '',
      password: '',
      changePassword: false
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingUser || !editFormData.firstName || !editFormData.lastName || !editFormData.email) {
      addNotification({
        type: 'error',
        message: t('admin.settings.systemUsers.notifications.requiredFields')
      });
      return;
    }

    if (editFormData.changePassword && !editFormData.password) {
      addNotification({
        type: 'error',
        message: t('admin.settings.systemUsers.notifications.passwordRequired')
      });
      return;
    }

    try {
      setUpdatingUser(true);

      const response = await fetch(`/api/admin/system-users/${editingUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          ...editFormData,
          ...(editFormData.phone && editFormData.phone.trim() ? { phone: editFormData.phone } : {}),
          department: editFormData.department || undefined
        }),
      });

      const data = await response.json();

      if (data.success) {
        addNotification({
          type: 'success',
          message: t('admin.settings.systemUsers.notifications.updateSuccess')
        });
        setShowEditModal(false);
        setEditingUser(null);
        setEditFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          role: 'sales',
          department: '',
          employeeId: '',
          supervisor: '',
          hireDate: '',
          password: '',
          changePassword: false
        });
        fetchUsers(pagination.currentPage);
      } else {
        throw new Error(data.message || t('admin.settings.systemUsers.notifications.updateFailed'));
      }
    } catch (error: any) {
      addNotification({
        type: 'error',
        message: error.message || t('admin.settings.systemUsers.notifications.updateFailed')
      });
    } finally {
      setUpdatingUser(false);
    }
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/system-users/${userId}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      const data = await response.json();

      if (data.success) {
        addNotification({
          type: 'success',
          message: currentStatus ? t('admin.settings.systemUsers.notifications.disableSuccess') : t('admin.settings.systemUsers.notifications.enableSuccess')
        });
        fetchUsers(pagination.currentPage);
      } else {
        throw new Error(data.message || t('admin.settings.systemUsers.notifications.toggleStatusFailed'));
      }
    } catch (error: any) {
      addNotification({
        type: 'error',
        message: error.message || t('admin.settings.systemUsers.notifications.toggleStatusFailed')
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm(t('admin.settings.systemUsers.confirmDelete'))) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/system-users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        addNotification({
          type: 'success',
          message: t('admin.settings.systemUsers.notifications.deleteSuccess')
        });
        fetchUsers(pagination.currentPage);
      } else {
        throw new Error(data.message || t('admin.settings.systemUsers.notifications.deleteFailed'));
      }
    } catch (error: any) {
      addNotification({
        type: 'error',
        message: error.message || t('admin.settings.systemUsers.notifications.deleteFailed')
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      manager: 'bg-blue-100 text-blue-800',
      sales: 'bg-green-100 text-green-800'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{t('admin.settings.systemUsers.title')}</h2>
          <p className="text-gray-600 mt-1">{t('admin.settings.systemUsers.subtitle')}</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center px-4 py-2 bg-logo-lime text-white rounded-lg hover:bg-logo-lime/90 transition-colors"
        >
          <LucideIcon name="plus" size="sm" className="mr-2" />
          {t('admin.settings.systemUsers.addUser')}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.settings.systemUsers.search')}</label>
            <input
              type="text"
              placeholder={t('admin.settings.systemUsers.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.settings.systemUsers.role')}</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
            >
              <option value="all">{t('admin.settings.systemUsers.allRoles')}</option>
              <option value="admin">{t('admin.settings.systemUsers.admin')}</option>
              <option value="manager">{t('admin.settings.systemUsers.manager')}</option>
              <option value="sales">{t('admin.settings.systemUsers.sales')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.settings.systemUsers.department')}</label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
            >
              <option value="all">{t('admin.settings.systemUsers.allDepartments')}</option>
              <option value="administration">{t('admin.settings.systemUsers.administration')}</option>
              <option value="sales">{t('admin.settings.systemUsers.sales')}</option>
              <option value="marketing">{t('admin.settings.systemUsers.marketing')}</option>
              <option value="operations">{t('admin.settings.systemUsers.operations')}</option>
              <option value="customer_service">{t('admin.settings.systemUsers.customerService')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.settings.systemUsers.status')}</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
            >
              <option value="all">{t('admin.settings.systemUsers.allStatus')}</option>
              <option value="true">{t('admin.settings.systemUsers.active')}</option>
              <option value="false">{t('admin.settings.systemUsers.inactive')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <LucideIcon name="circlenotch" size="xl" className="animate-spin text-logo-lime" />
            <span className="ml-3 text-gray-600">{t('admin.settings.systemUsers.loadingUsers')}</span>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center p-8">
            <LucideIcon name="users" size="3xl" className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('admin.settings.systemUsers.noUsersFound')}</h3>
            <p className="text-gray-600 mb-4">{t('admin.settings.systemUsers.getStarted')}</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 bg-logo-lime text-white rounded-lg hover:bg-logo-lime/90"
            >
              <LucideIcon name="plus" size="md" className="mr-2 text-white" />
              {t('admin.settings.systemUsers.addUser')}
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.settings.systemUsers.user')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.settings.systemUsers.role')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.settings.systemUsers.department')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.settings.systemUsers.status')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.settings.systemUsers.lastLogin')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.settings.systemUsers.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-logo-lime/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-logo-lime">
                              {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                            {user.phone && (
                              <div className="text-sm text-gray-500">{user.phone}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.systemInfo?.department || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className="text-sm text-gray-900">
                            {user.isActive ? t('admin.settings.systemUsers.active') : t('admin.settings.systemUsers.inactive')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.lastLogin ? formatDate(user.lastLogin) : t('admin.settings.systemUsers.never')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="text-gray-600 hover:text-logo-lime"
                            title={t('admin.settings.systemUsers.editUser')}
                          >
                            <LucideIcon name="gear" size="sm" />
                          </button>
                          <button
                            onClick={() => handleToggleUserStatus(user._id, user.isActive)}
                            className={user.isActive ? "text-orange-600 hover:text-orange-800" : "text-green-600 hover:text-green-800"}
                            title={user.isActive ? t('admin.settings.systemUsers.disableUser') : t('admin.settings.systemUsers.enableUser')}
                          >
                            <LucideIcon name={user.isActive ? "xcircle" : "checkcircle"} size="sm" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="text-red-600 hover:text-red-800"
                            title={t('admin.settings.systemUsers.deleteUser')}
                          >
                            <LucideIcon name="trash" size="sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalUsers > 0 && (
              <div className="px-6 py-3 border-t border-gray-200">
                <PaginationControls
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.totalUsers}
                  itemsPerPage={pagination.limit}
                  onPageChange={handlePageChange}
                  onItemsPerPageChange={handleItemsPerPageChange}
                  options={[10, 20, 50, 100]}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{t('admin.settings.systemUsers.addSystemUser')}</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <LucideIcon name="x" size="lg" />
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('admin.settings.systemUsers.firstName')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={createFormData.firstName}
                      onChange={(e) => setCreateFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('admin.settings.systemUsers.lastName')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={createFormData.lastName}
                      onChange={(e) => setCreateFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.settings.systemUsers.email')} *
                  </label>
                  <input
                    type="email"
                    required
                    value={createFormData.email}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.settings.systemUsers.password')} *
                  </label>
                  <input
                    type="password"
                    required
                    value={createFormData.password}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.settings.systemUsers.phone')}
                  </label>
                  <input
                    type="tel"
                    value={createFormData.phone}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.settings.systemUsers.role')} *
                  </label>
                  <select
                    required
                    value={createFormData.role}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, role: e.target.value as 'admin' | 'manager' | 'sales' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                  >
                    <option value="sales">{t('admin.settings.systemUsers.sales')}</option>
                    <option value="manager">{t('admin.settings.systemUsers.manager')}</option>
                    <option value="admin">{t('admin.settings.systemUsers.admin')}</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('admin.settings.systemUsers.department')}
                    </label>
                    <input
                      type="text"
                      value={createFormData.department}
                      onChange={(e) => setCreateFormData(prev => ({ ...prev, department: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('admin.settings.systemUsers.employeeId')}
                    </label>
                    <input
                      type="text"
                      value={createFormData.employeeId}
                      onChange={(e) => setCreateFormData(prev => ({ ...prev, employeeId: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    {t('admin.settings.systemUsers.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={creatingUser}
                    className="flex items-center px-4 py-2 bg-logo-lime text-white rounded-lg hover:bg-logo-lime/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {creatingUser ? (
                      <>
                        <LucideIcon name="circlenotch" size="sm" className="animate-spin mr-2" />
                        {t('admin.settings.systemUsers.creating')}
                      </>
                    ) : (
                      <>
                        <LucideIcon name="plus" size="sm" className="mr-2" />
                        {t('admin.settings.systemUsers.createUser')}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{t('admin.settings.systemUsers.editSystemUser')}</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <LucideIcon name="x" size="lg" />
                </button>
              </div>

              <form onSubmit={handleUpdateUser} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('admin.settings.systemUsers.firstName')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={editFormData.firstName}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('admin.settings.systemUsers.lastName')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={editFormData.lastName}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.settings.systemUsers.email')} *
                  </label>
                  <input
                    type="email"
                    required
                    value={editFormData.email}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.settings.systemUsers.phone')}
                  </label>
                  <input
                    type="tel"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.settings.systemUsers.role')} *
                  </label>
                  <select
                    required
                    value={editFormData.role}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, role: e.target.value as 'admin' | 'manager' | 'sales' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                  >
                    <option value="sales">{t('admin.settings.systemUsers.sales')}</option>
                    <option value="manager">{t('admin.settings.systemUsers.manager')}</option>
                    <option value="admin">{t('admin.settings.systemUsers.admin')}</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('admin.settings.systemUsers.department')}
                    </label>
                    <input
                      type="text"
                      value={editFormData.department}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, department: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('admin.settings.systemUsers.employeeId')}
                    </label>
                    <input
                      type="text"
                      value={editFormData.employeeId}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, employeeId: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Password Change Section */}
                <div className="border-t pt-4">
                  <div className="flex items-center mb-3">
                    <input
                      type="checkbox"
                      id="changePassword"
                      checked={editFormData.changePassword}
                      onChange={(e) => setEditFormData(prev => ({ 
                        ...prev, 
                        changePassword: e.target.checked,
                        password: e.target.checked ? prev.password : ''
                      }))}
                      className="h-4 w-4 text-logo-lime focus:ring-logo-lime border-gray-300 rounded"
                    />
                    <label htmlFor="changePassword" className="ml-2 block text-sm font-medium text-gray-700">
                      {t('admin.settings.systemUsers.changePassword')}
                    </label>
                  </div>
                  
                  {editFormData.changePassword && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('admin.settings.systemUsers.newPassword')} *
                      </label>
                      <input
                        type="password"
                        required={editFormData.changePassword}
                        value={editFormData.password}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, password: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                        placeholder={t('admin.settings.systemUsers.newPasswordPlaceholder')}
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    {t('admin.settings.systemUsers.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={updatingUser}
                    className="flex items-center px-4 py-2 bg-logo-lime text-white rounded-lg hover:bg-logo-lime/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updatingUser ? (
                      <>
                        <LucideIcon name="circlenotch" size="sm" className="animate-spin mr-2" />
                        {t('admin.settings.systemUsers.updating')}
                      </>
                    ) : (
                      <>
                        <LucideIcon name="check" size="sm" className="mr-2" />
                        {t('admin.settings.systemUsers.updateUser')}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemUsersTab;
