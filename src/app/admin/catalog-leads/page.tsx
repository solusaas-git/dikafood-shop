'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Check, Clock, X, AlertTriangle, Users, Search, Inbox } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/utils/i18n';
import { PaginationControls } from '../../../components/ui/navigation/Pagination';

interface CatalogLead {
  _id: string;
  name: string;
  surname: string;
  email: string;
  telephone: string;
  requestedLanguages: string[];
  status: 'pending' | 'sent' | 'failed';
  emailSentSuccessfully: boolean;
  catalogSentAt: string | null;
  emailError: string | null;
  createdAt: string;
  updatedAt: string;
  fullName: string;
  formattedPhone: string;
  ipAddress?: string;
  userAgent?: string;
  source?: string;
  adminNotes?: string;
  viewedAt?: string | null;
  viewedBy?: {
    _id: string;
    name: string;
    email: string;
  } | null;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface CatalogLeadsResponse {
  success: boolean;
  data: {
    leads: CatalogLead[];
    pagination: PaginationInfo;
  };
}

export default function CatalogLeadsPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();

  // All useState hooks must be at the top level
  const [leads, setLeads] = useState<CatalogLead[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Authentication check
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/admin/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Fetch leads effect - must be before conditional returns
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchLeads();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, itemsPerPage, statusFilter, searchQuery, dateFrom, dateTo, authLoading, isAuthenticated]);

  // Don't render anything if not authenticated or still loading
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>{t('common.loading')}</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Fetch leads
  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString()
      });
      
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      if (dateFrom) params.set('dateFrom', dateFrom);
      if (dateTo) params.set('dateTo', dateTo);
      
      // Get token for authenticated request
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/catalog-leads?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const result: CatalogLeadsResponse = await response.json();
      
      if (result.success) {
        setLeads(result.data.leads);
        setPagination(result.data.pagination);
      } else {
        setError(t('admin.catalogLeads.errors.fetchFailed'));
      }
    } catch (err) {
      setError(t('admin.catalogLeads.errors.fetchError'));
      console.error('Fetch leads error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handlers
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchLeads();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setDateFrom('');
    setDateTo('');
    setCurrentPage(1);
  };

  const getStatusBadge = (lead: CatalogLead) => {
    const statusConfig = {
      sent: { bg: 'bg-green-100', text: 'text-green-800', icon: Check, label: t('admin.catalogLeads.status.sent') },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock, label: t('admin.catalogLeads.status.pending') },
      failed: { bg: 'bg-red-100', text: 'text-red-800', icon: X, label: t('admin.catalogLeads.status.failed') }
    };
    
    const config = statusConfig[lead.status] || statusConfig.pending;
    const hasError = lead.emailError;
    const IconComponent = config.icon;
    
    return (
      <span 
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} ${
          hasError ? 'cursor-help hover:opacity-80 transition-opacity' : ''
        }`}
        title={hasError ? `${t('admin.catalogLeads.error')}: ${lead.emailError}` : undefined}
      >
        <IconComponent className="h-3 w-3" />
        {config.label}
        {hasError && <AlertTriangle className="h-3 w-3 ml-0.5" />}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatLanguages = (languages: string[]) => {
    return languages.map(lang => lang === 'fr' ? 'FR' : 'AR').join(', ');
  };

  // Authentication is handled by AdminAuthWrapper - no need for additional checks here

  if (loading && leads.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>{t('admin.catalogLeads.loadingLeads')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('admin.catalogLeads.title')}</h1>
          <p className="text-gray-600">{t('admin.catalogLeads.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="h-4 w-4" />
          <span>{pagination.totalCount} {t('admin.catalogLeads.totalRequests')}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('admin.catalogLeads.search')}
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('admin.catalogLeads.searchPlaceholder')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('admin.catalogLeads.status')}
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">{t('admin.catalogLeads.allStatuses')}</option>
              <option value="sent">{t('admin.catalogLeads.status.sent')}</option>
              <option value="pending">{t('admin.catalogLeads.status.pending')}</option>
              <option value="failed">{t('admin.catalogLeads.status.failed')}</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('admin.catalogLeads.dateFrom')}
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('admin.catalogLeads.dateTo')}
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </form>
        
        <div className="flex justify-between items-center mt-4">
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
          >
            <X className="h-3 w-3" />
            {t('admin.catalogLeads.clearFilters')}
          </button>
          
          <button
            type="submit"
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            {t('admin.catalogLeads.searchButton')}
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          {error}
        </div>
      )}

      {/* Results */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {leads.length === 0 && !loading ? (
          <div className="p-8 text-center text-gray-500">
            <Inbox className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>{t('admin.catalogLeads.noRequests')}</p>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.catalogLeads.firstName')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.catalogLeads.lastName')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.catalogLeads.email')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.catalogLeads.phone')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.catalogLeads.status')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.catalogLeads.languages')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.catalogLeads.requestDate')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.catalogLeads.sentDate')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leads.map((lead) => (
                    <tr key={lead._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {lead.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {lead.surname}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {lead.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {lead.telephone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(lead)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatLanguages(lead.requestedLanguages)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(lead.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {lead.catalogSentAt ? formatDate(lead.catalogSentAt) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalCount > 0 && (
              <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.totalCount}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                  onItemsPerPageChange={handleItemsPerPageChange}
                  options={[10, 20, 50, 100]}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
