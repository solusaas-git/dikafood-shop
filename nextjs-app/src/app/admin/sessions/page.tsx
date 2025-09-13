'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useNotification } from '@/contexts/NotificationContextNew';
import { useTranslation } from '@/utils/i18n';
import LucideIcon from '../../../components/ui/icons/LucideIcon';
import { PaginationControls } from '../../../components/ui/navigation/Pagination';

interface Session {
  _id: string;
  sessionId: string;
  userId?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    userType: string;
  };
  sessionType: 'guest' | 'authenticated';
  isActive: boolean;
  userAgent: string;
  ipAddress: string;
  deviceInfo?: {
    browser?: string;
    os?: string;
    device?: string;
  };
  lastActivity: string;
  createdAt: string;
  expiresAt: string;
  loginAt?: string;
  logoutAt?: string;
  terminationReason?: string;
  duration: number;
  isExpired: boolean;
}

interface SessionFilters {
  sessionType: string;
  isActive: string;
  userId: string;
  ipAddress: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalSessions: number;
  limit: number;
}

interface SessionStats {
  totalSessions: number;
  activeSessions: number;
  authenticatedSessions: number;
  guestSessions: number;
  uniqueUserCount: number;
  uniqueIPCount: number;
}

const SessionsPage = () => {
  const router = useRouter();
  const { addNotification } = useNotification();
  const { t } = useTranslation();

  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SessionFilters>({
    sessionType: '',
    isActive: '',
    userId: '',
    ipAddress: ''
  });
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalSessions: 0,
    limit: 20
  });
  const [stats, setStats] = useState<SessionStats>({
    totalSessions: 0,
    activeSessions: 0,
    authenticatedSessions: 0,
    guestSessions: 0,
    uniqueUserCount: 0,
    uniqueIPCount: 0
  });

  // Handle items per page change
  const handleItemsPerPageChange = (newLimit: number) => {
    setPagination(prev => ({ ...prev, limit: newLimit, currentPage: 1 }));
    fetchSessions(1, newLimit);
  };

  // Fetch sessions
  const fetchSessions = async (page = 1, limit = pagination.limit) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters.sessionType && { sessionType: filters.sessionType }),
        ...(filters.isActive && { isActive: filters.isActive }),
        ...(filters.userId && { userId: filters.userId }),
        ...(filters.ipAddress && { ipAddress: filters.ipAddress })
      });

      // Get token from localStorage
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await fetch(`/api/admin/sessions?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();

      if (data.success) {
        setSessions(data.data.sessions);
        setPagination(data.data.pagination);
        setStats(data.data.stats);
      } else {
        addNotification(t('admin.sessions.errors.fetchFailed'), 'error');
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      addNotification(t('admin.sessions.errors.fetchError'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (key: keyof SessionFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      sessionType: '',
      isActive: '',
      userId: '',
      ipAddress: ''
    });
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
    fetchSessions(page);
  };

  // Revoke session
  const handleRevokeSession = async (sessionId: string) => {
    if (!confirm(t('admin.sessions.confirmRevoke'))) {
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await fetch(`/api/admin/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason: 'admin_revoked' })
      });

      const data = await response.json();
      if (data.success) {
        addNotification(t('admin.sessions.notifications.revokeSuccess'), 'success');
        fetchSessions(pagination.currentPage);
      } else {
        addNotification(data.message || t('admin.sessions.errors.revokeFailed'), 'error');
      }
    } catch (error) {
      console.error('Error revoking session:', error);
      addNotification(t('admin.sessions.errors.revokeError'), 'error');
    }
  };

  // Cleanup expired sessions
  const handleCleanupSessions = async () => {
    if (!confirm(t('admin.sessions.confirmCleanup'))) {
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await fetch('/api/admin/sessions', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        addNotification(`${t('admin.sessions.notifications.cleanupSuccess')} ${data.data.deletedCount}`, 'success');
        fetchSessions(pagination.currentPage);
      } else {
        addNotification(data.message || t('admin.sessions.errors.cleanupFailed'), 'error');
      }
    } catch (error) {
      console.error('Error cleaning up sessions:', error);
      addNotification(t('admin.sessions.errors.cleanupError'), 'error');
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format duration
  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return `${Math.floor(seconds / 86400)}d`;
  };

  // Get session status badge
  const getSessionBadge = (session: Session) => {
    if (!session.isActive) {
      return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">{t('admin.sessions.status.terminated')}</span>;
    }
    if (session.isExpired) {
      return <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">{t('admin.sessions.status.expired')}</span>;
    }
    return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">{t('admin.sessions.status.active')}</span>;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('admin.sessions.title')}</h1>
          <p className="text-gray-600 mt-1">{t('admin.sessions.subtitle')}</p>
        </div>
        <button
          onClick={handleCleanupSessions}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium"
        >
          <LucideIcon name="trash" size="sm" />
          {t('admin.sessions.cleanupExpired')}
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('admin.sessions.stats.totalSessions')}</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSessions}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <LucideIcon name="users" size="md" className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('admin.sessions.stats.active')}</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeSessions}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <LucideIcon name="checkcircle" size="md" className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('admin.sessions.stats.authenticated')}</p>
              <p className="text-2xl font-bold text-blue-600">{stats.authenticatedSessions}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <LucideIcon name="user" size="md" className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('admin.sessions.stats.guest')}</p>
              <p className="text-2xl font-bold text-purple-600">{stats.guestSessions}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <LucideIcon name="users" size="md" className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('admin.sessions.stats.uniqueUsers')}</p>
              <p className="text-2xl font-bold text-indigo-600">{stats.uniqueUserCount}</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-full">
              <LucideIcon name="user" size="md" className="text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('admin.sessions.stats.uniqueIPs')}</p>
              <p className="text-2xl font-bold text-gray-600">{stats.uniqueIPCount}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-full">
              <LucideIcon name="globe" size="md" className="text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Session Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.sessions.filters.sessionType')}</label>
            <select
              value={filters.sessionType}
              onChange={(e) => handleFilterChange('sessionType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
            >
              <option value="">{t('admin.sessions.filters.allTypes')}</option>
              <option value="authenticated">{t('admin.sessions.filters.authenticated')}</option>
              <option value="guest">{t('admin.sessions.filters.guest')}</option>
            </select>
          </div>

          {/* Active Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.sessions.filters.status')}</label>
            <select
              value={filters.isActive}
              onChange={(e) => handleFilterChange('isActive', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
            >
              <option value="">{t('admin.sessions.filters.allStatus')}</option>
              <option value="true">{t('admin.sessions.filters.active')}</option>
              <option value="false">{t('admin.sessions.filters.inactive')}</option>
            </select>
          </div>

          {/* User ID Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.sessions.filters.userId')}</label>
            <input
              type="text"
              placeholder={t('admin.sessions.filters.userIdPlaceholder')}
              value={filters.userId}
              onChange={(e) => handleFilterChange('userId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
            />
          </div>

          {/* IP Address Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.sessions.filters.ipAddress')}</label>
            <input
              type="text"
              placeholder={t('admin.sessions.filters.ipPlaceholder')}
              value={filters.ipAddress}
              onChange={(e) => handleFilterChange('ipAddress', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
            />
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {t('admin.sessions.filters.clearFilters')}
            </button>
          </div>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.sessions.table.session')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.sessions.table.user')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.sessions.table.status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.sessions.table.deviceInfo')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.sessions.table.location')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.sessions.table.activity')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.sessions.table.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-logo-lime"></div>
                      <span className="ml-2 text-gray-500">{t('admin.sessions.loadingSessions')}</span>
                    </div>
                  </td>
                </tr>
              ) : sessions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <LucideIcon name="users" size="xl" className="text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{t('admin.sessions.noSessionsFound')}</h3>
                      <p className="text-gray-500">
                        {Object.values(filters).some(filter => filter !== '') 
                          ? t('admin.sessions.tryAdjustingFilters')
                          : t('admin.sessions.noActiveSessions')
                        }
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                sessions.map((session) => (
                  <tr key={session._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {session.sessionId.substring(0, 8)}...
                        </div>
                        <div className="text-xs text-gray-500">
                          {session.sessionType.charAt(0).toUpperCase() + session.sessionType.slice(1)}
                        </div>
                        <div className="text-xs text-gray-400">
                          {t('admin.sessions.created')}: {formatDate(session.createdAt)}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {session.userId ? (
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {session.userId.firstName} {session.userId.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {session.userId.email}
                          </div>
                          <div className="text-xs text-gray-400 capitalize">
                            {session.userId.role} • {session.userId.userType}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500 italic">{t('admin.sessions.guestUser')}</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {getSessionBadge(session)}
                        {session.terminationReason && (
                          <div className="text-xs text-red-600">
                            {session.terminationReason.replace('_', ' ')}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {session.deviceInfo?.browser || t('admin.sessions.unknown')} • {session.deviceInfo?.os || t('admin.sessions.unknown')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {session.deviceInfo?.device || t('admin.sessions.unknownDevice')}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {session.ipAddress}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {formatDate(session.lastActivity)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {t('admin.sessions.duration')}: {formatDuration(session.duration)}
                      </div>
                      {session.loginAt && (
                        <div className="text-xs text-gray-400">
                          {t('admin.sessions.login')}: {formatDate(session.loginAt)}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => router.push(`/admin/sessions/${session.sessionId}`)}
                          className="text-logo-lime hover:text-logo-lime/80 p-1"
                          title={t('admin.sessions.viewDetails')}
                        >
                          <LucideIcon name="eye" size="sm" />
                        </button>
                        {session.isActive && !session.isExpired && (
                          <button
                            onClick={() => handleRevokeSession(session.sessionId)}
                            className="text-red-600 hover:text-red-800 p-1"
                            title={t('admin.sessions.revokeSession')}
                          >
                            <LucideIcon name="x" size="sm" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalSessions > 0 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <PaginationControls
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalSessions}
              itemsPerPage={pagination.limit}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
              options={[10, 20, 50, 100]}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionsPage;
