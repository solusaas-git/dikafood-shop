'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useNotification } from '@/contexts/NotificationContextNew';
import LucideIcon from '../../../../components/ui/icons/LucideIcon';

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
    phone?: string;
  };
  sessionType: 'guest' | 'authenticated';
  isActive: boolean;
  userAgent: string;
  ipAddress: string;
  deviceInfo?: {
    browser?: string;
    os?: string;
    device?: string;
    isMobile?: boolean;
    isTablet?: boolean;
    isDesktop?: boolean;
  };
  lastActivity: string;
  createdAt: string;
  expiresAt: string;
  loginAt?: string;
  logoutAt?: string;
  terminationReason?: string;
  duration: number;
  isExpired: boolean;
  cartId?: string;
  guestSessionId?: string;
  activityHistory?: Array<{
    action: string;
    timestamp: string;
    details?: any;
  }>;
}

const SessionDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const { addNotification } = useNotification();
  const sessionId = params.sessionId as string;

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch session details
  const fetchSession = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await fetch(`/api/admin/sessions/${sessionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();

      if (data.success) {
        setSession(data.data);
      } else {
        addNotification(data.message || 'Failed to fetch session details', 'error');
        router.push('/admin/sessions');
      }
    } catch (error) {
      console.error('Error fetching session:', error);
      addNotification('Error fetching session details', 'error');
      router.push('/admin/sessions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionId) {
      fetchSession();
    }
  }, [sessionId]);

  // Revoke session
  const handleRevokeSession = async () => {
    if (!confirm('Are you sure you want to revoke this session? The user will be logged out immediately.')) {
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
        addNotification('Session revoked successfully', 'success');
        fetchSession(); // Refresh session data
      } else {
        addNotification(data.message || 'Failed to revoke session', 'error');
      }
    } catch (error) {
      console.error('Error revoking session:', error);
      addNotification('Error revoking session', 'error');
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Format duration
  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds} seconds`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours`;
    return `${Math.floor(seconds / 86400)} days`;
  };

  // Get session status badge
  const getSessionBadge = (session: Session) => {
    if (!session.isActive) {
      return <span className="px-3 py-1 text-sm font-medium bg-red-100 text-red-800 rounded-full">Terminated</span>;
    }
    if (session.isExpired) {
      return <span className="px-3 py-1 text-sm font-medium bg-orange-100 text-orange-800 rounded-full">Expired</span>;
    }
    return <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">Active</span>;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-logo-lime"></div>
          <span className="ml-3 text-gray-600">Loading session details...</span>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <LucideIcon name="warning" size="xl" className="text-gray-400 mb-4 mx-auto" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Session not found</h3>
          <p className="text-gray-500 mb-4">The session you're looking for doesn't exist or has been deleted.</p>
          <button
            onClick={() => router.push('/admin/sessions')}
            className="bg-logo-lime text-dark-green-7 px-4 py-2 rounded-lg hover:bg-logo-lime/90 font-medium"
          >
            Back to Sessions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/admin/sessions')}
            className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
          >
            <LucideIcon name="arrowleft" size="md" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Session Details</h1>
            <p className="text-gray-600 mt-1">Session ID: {session.sessionId}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {getSessionBadge(session)}
          {session.isActive && !session.isExpired && (
            <button
              onClick={handleRevokeSession}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium"
            >
              <LucideIcon name="x" size="sm" />
              Revoke Session
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Session Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* User Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <LucideIcon name="user" size="md" className="text-logo-lime" />
              User Information
            </h2>
            {session.userId ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                  <p className="text-gray-900">{session.userId.firstName} {session.userId.lastName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                  <p className="text-gray-900">{session.userId.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Role</label>
                  <p className="text-gray-900 capitalize">{session.userId.role}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">User Type</label>
                  <p className="text-gray-900 capitalize">{session.userId.userType}</p>
                </div>
                {session.userId.phone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                    <p className="text-gray-900">{session.userId.phone}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">User ID</label>
                  <p className="text-gray-900 font-mono text-sm">{session.userId._id}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <LucideIcon name="users" size="xl" className="text-gray-400 mb-2 mx-auto" />
                <p className="text-gray-500">Guest Session</p>
                <p className="text-sm text-gray-400 mt-1">No authenticated user associated with this session</p>
              </div>
            )}
          </div>

          {/* Device & Location Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <LucideIcon name="devicemobile" size="md" className="text-logo-lime" />
              Device & Location
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">IP Address</label>
                <p className="text-gray-900 font-mono">{session.ipAddress}</p>
              </div>
              {session.deviceInfo?.browser && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Browser</label>
                  <p className="text-gray-900">{session.deviceInfo.browser}</p>
                </div>
              )}
              {session.deviceInfo?.os && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Operating System</label>
                  <p className="text-gray-900">{session.deviceInfo.os}</p>
                </div>
              )}
              {session.deviceInfo?.device && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Device Type</label>
                  <p className="text-gray-900">{session.deviceInfo.device}</p>
                </div>
              )}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-500 mb-1">User Agent</label>
                <p className="text-gray-900 text-sm break-all bg-gray-50 p-3 rounded border">{session.userAgent}</p>
              </div>
            </div>
          </div>

          {/* Activity History */}
          {session.activityHistory && session.activityHistory.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <LucideIcon name="clock" size="md" className="text-logo-lime" />
                Activity History
              </h2>
              <div className="space-y-3">
                {session.activityHistory.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 w-2 h-2 bg-logo-lime rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500">{formatDate(activity.timestamp)}</p>
                      </div>
                      {activity.details && (
                        <pre className="text-xs text-gray-600 mt-1 bg-white p-2 rounded border overflow-x-auto">
                          {JSON.stringify(activity.details, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Session Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Type</span>
                <span className="text-sm font-medium text-gray-900 capitalize">{session.sessionType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                {getSessionBadge(session)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Duration</span>
                <span className="text-sm font-medium text-gray-900">{formatDuration(session.duration)}</span>
              </div>
              {session.terminationReason && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Termination Reason</span>
                  <span className="text-sm font-medium text-red-600 capitalize">
                    {session.terminationReason.replace('_', ' ')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Session Timestamps */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Created At</label>
                <p className="text-sm text-gray-900">{formatDate(session.createdAt)}</p>
              </div>
              {session.loginAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Login At</label>
                  <p className="text-sm text-gray-900">{formatDate(session.loginAt)}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Last Activity</label>
                <p className="text-sm text-gray-900">{formatDate(session.lastActivity)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Expires At</label>
                <p className="text-sm text-gray-900">{formatDate(session.expiresAt)}</p>
              </div>
              {session.logoutAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Logout At</label>
                  <p className="text-sm text-gray-900">{formatDate(session.logoutAt)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Info</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Session ID</label>
                <p className="text-sm text-gray-900 font-mono break-all">{session.sessionId}</p>
              </div>
              {session.cartId && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Cart ID</label>
                  <p className="text-sm text-gray-900 font-mono break-all">{session.cartId}</p>
                </div>
              )}
              {session.guestSessionId && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Guest Session ID</label>
                  <p className="text-sm text-gray-900 font-mono break-all">{session.guestSessionId}</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          {session.userId && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => router.push(`/admin/users/${session.userId?._id}`)}
                  className="w-full flex items-center gap-2 text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <LucideIcon name="user" size="sm" />
                  View User Profile
                </button>
                <button
                  onClick={() => router.push(`/admin/users/${session.userId?._id}/sessions`)}
                  className="w-full flex items-center gap-2 text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <LucideIcon name="users" size="sm" />
                  View All User Sessions
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionDetailPage;
