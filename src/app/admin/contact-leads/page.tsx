'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  EnvelopeSimple,
  Phone,
  User,
  Calendar,
  Eye,
  Archive,
  MagnifyingGlass,
  Warning,
  Clock,
  CheckCircle,
  X
} from '@phosphor-icons/react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/utils/i18n';
import { PaginationControls } from '../../../components/ui/navigation/Pagination';

// Status color mapping
const STATUS_COLORS = {
  new: 'bg-blue-100 text-blue-800 border-blue-200',
  in_progress: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  resolved: 'bg-green-100 text-green-800 border-green-200',
  closed: 'bg-gray-100 text-gray-800 border-gray-200'
};

// Priority color mapping
const PRIORITY_COLORS = {
  low: 'bg-gray-100 text-gray-600 border-gray-200',
  medium: 'bg-blue-100 text-blue-600 border-blue-200',
  high: 'bg-orange-100 text-orange-600 border-orange-200',
  urgent: 'bg-red-100 text-red-600 border-red-200'
};

// Source color mapping
const SOURCE_COLORS = {
  landing: 'bg-purple-100 text-purple-600 border-purple-200',
  contact: 'bg-teal-100 text-teal-600 border-teal-200'
};

interface ContactLead {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  source: 'landing' | 'contact';
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  notes?: string;
  responseDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface ContactLeadsStats {
  total: number;
  new: number;
  in_progress: number;
  resolved: number;
  closed: number;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export default function ContactLeadsPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
  
  // State management
  const [contactLeads, setContactLeads] = useState<ContactLead[]>([]);
  const [stats, setStats] = useState<ContactLeadsStats>({
    total: 0,
    new: 0,
    in_progress: 0,
    resolved: 0,
    closed: 0
  });
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPreviousPage: false
  });
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<ContactLead | null>(null);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);
  
  // Filters
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Authentication check
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/admin/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Fetch contact leads effect
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchContactLeads();
    }
  }, [currentPage, itemsPerPage, searchTerm, statusFilter, sourceFilter, priorityFilter, dateFrom, dateTo, authLoading, isAuthenticated]);

  // Don't render anything if not authenticated or still loading
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex items-center gap-2 text-gray-600">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-logo-lime"></div>
          <span>{t('common.loading')}</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Fetch contact leads
  const fetchContactLeads = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        search: searchTerm,
        status: statusFilter,
        source: sourceFilter,
        priority: priorityFilter,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });

      if (dateFrom) params.append('dateFrom', dateFrom);
      if (dateTo) params.append('dateTo', dateTo);

      const response = await fetch(`/api/admin/contact-leads?${params}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch contact leads');
      }

      setContactLeads(data.data.contactLeads);
      setStats(data.data.stats);
      setPagination(data.data.pagination);

    } catch (err: any) {
      console.error('Error fetching contact leads:', err);
      setError(err.message || 'Failed to load contact leads');
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchContactLeads();
  };

  // Update contact lead
  const updateContactLead = async (id: string, updates: Partial<ContactLead>) => {
    try {
      setUpdating(id);
      const response = await fetch(`/api/admin/contact-leads/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to update contact lead');
      }

      // Update the lead in the list
      setContactLeads(prev => 
        prev.map(lead => 
          lead._id === id ? { ...lead, ...data.data } : lead
        )
      );

      // Update selected lead if it's the one being updated
      if (selectedLead && selectedLead._id === id) {
        setSelectedLead({ ...selectedLead, ...data.data });
      }

      // Refresh stats
      fetchContactLeads();

    } catch (err: any) {
      console.error('Error updating contact lead:', err);
      setError(err.message || 'Failed to update contact lead');
    } finally {
      setUpdating(null);
    }
  };

  // Archive contact lead
  const archiveContactLead = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir archiver cette demande de contact ?')) {
      return;
    }

    try {
      setUpdating(id);
      const response = await fetch(`/api/admin/contact-leads/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to archive contact lead');
      }

      // Remove from list
      setContactLeads(prev => prev.filter(lead => lead._id !== id));
      
      // Close modal if the archived lead was selected
      if (selectedLead && selectedLead._id === id) {
        setShowLeadModal(false);
        setSelectedLead(null);
      }

      // Refresh stats
      fetchContactLeads();

    } catch (err: any) {
      console.error('Error archiving contact lead:', err);
      setError(err.message || 'Failed to archive contact lead');
    } finally {
      setUpdating(null);
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

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <Warning size={16} weight="duotone" />;
      case 'in_progress':
        return <Clock size={16} weight="duotone" />;
      case 'resolved':
        return <CheckCircle size={16} weight="duotone" />;
      case 'closed':
        return <X size={16} weight="duotone" />;
      default:
        return <Warning size={16} weight="duotone" />;
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800">
            <Warning size={20} weight="duotone" />
            <span className="font-medium">Erreur</span>
          </div>
          <p className="text-red-700 mt-1">{error}</p>
          <button
            onClick={fetchContactLeads}
            className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Demandes de contact</h1>
          <p className="text-gray-600">Gérez les demandes de contact des clients</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <EnvelopeSimple size={16} />
          <span>{stats.total} demandes</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { key: 'total', label: 'Total', value: stats.total, color: 'bg-gray-100 text-gray-800' },
          { key: 'new', label: 'Nouvelles', value: stats.new, color: 'bg-blue-100 text-blue-800' },
          { key: 'in_progress', label: 'En cours', value: stats.in_progress, color: 'bg-yellow-100 text-yellow-800' },
          { key: 'resolved', label: 'Résolues', value: stats.resolved, color: 'bg-green-100 text-green-800' },
          { key: 'closed', label: 'Fermées', value: stats.closed, color: 'bg-gray-100 text-gray-800' }
        ].map((stat) => (
          <div key={stat.key} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recherche
            </label>
            <div className="relative">
              <MagnifyingGlass size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-logo-lime focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Statut
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-logo-lime focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="new">Nouvelles</option>
              <option value="in_progress">En cours</option>
              <option value="resolved">Résolues</option>
              <option value="closed">Fermées</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Source
            </label>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-logo-lime focus:border-transparent"
            >
              <option value="all">Toutes les sources</option>
              <option value="landing">Page d'accueil</option>
              <option value="contact">Page contact</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priorité
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-logo-lime focus:border-transparent"
            >
              <option value="all">Toutes les priorités</option>
              <option value="low">Faible</option>
              <option value="medium">Moyenne</option>
              <option value="high">Élevée</option>
              <option value="urgent">Urgente</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date début
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-logo-lime focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date fin
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-logo-lime focus:border-transparent"
            />
          </div>
        </form>
      </div>

      {/* Contact Leads Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-logo-lime"></div>
          </div>
        ) : contactLeads.length === 0 ? (
          <div className="text-center py-12">
            <EnvelopeSimple size={48} className="mx-auto text-gray-400 mb-4" weight="duotone" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune demande de contact
            </h3>
            <p className="text-gray-500">
              Les demandes de contact apparaîtront ici une fois soumises.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priorité
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contactLeads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-logo-lime/20 rounded-full flex items-center justify-center">
                          <User size={16} weight="duotone" className="text-logo-lime" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{lead.name}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <EnvelopeSimple size={12} />
                            {lead.email}
                          </div>
                          {lead.phone && (
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Phone size={12} />
                              {lead.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        {lead.subject && (
                          <div className="font-medium text-gray-900 text-sm mb-1 truncate">
                            {lead.subject}
                          </div>
                        )}
                        <div className="text-sm text-gray-600 line-clamp-2">
                          {lead.message}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${SOURCE_COLORS[lead.source]}`}>
                        {lead.source === 'landing' ? 'Accueil' : 'Contact'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={lead.status}
                        onChange={(e) => updateContactLead(lead._id, { status: e.target.value as any })}
                        disabled={updating === lead._id}
                        className={`text-xs font-medium border rounded-full px-2.5 py-0.5 ${STATUS_COLORS[lead.status]} focus:ring-2 focus:ring-logo-lime focus:border-transparent`}
                      >
                        <option value="new">Nouvelle</option>
                        <option value="in_progress">En cours</option>
                        <option value="resolved">Résolue</option>
                        <option value="closed">Fermée</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={lead.priority}
                        onChange={(e) => updateContactLead(lead._id, { priority: e.target.value as any })}
                        disabled={updating === lead._id}
                        className={`text-xs font-medium border rounded-full px-2.5 py-0.5 ${PRIORITY_COLORS[lead.priority]} focus:ring-2 focus:ring-logo-lime focus:border-transparent`}
                      >
                        <option value="low">Faible</option>
                        <option value="medium">Moyenne</option>
                        <option value="high">Élevée</option>
                        <option value="urgent">Urgente</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(lead.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedLead(lead);
                            setShowLeadModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="Voir les détails"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => archiveContactLead(lead._id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Archiver"
                          disabled={updating === lead._id}
                        >
                          <Archive size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <PaginationControls
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(newItemsPerPage) => {
            setItemsPerPage(newItemsPerPage);
            setCurrentPage(1);
          }}
        />
      )}

      {/* Lead Detail Modal */}
      {showLeadModal && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Détails de la demande
                </h3>
                <button
                  onClick={() => setShowLeadModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Contact Info */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Informations de contact</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-gray-400" />
                    <span className="font-medium">{selectedLead.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <EnvelopeSimple size={16} className="text-gray-400" />
                    <span>{selectedLead.email}</span>
                  </div>
                  {selectedLead.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-gray-400" />
                      <span>{selectedLead.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Subject */}
              {selectedLead.subject && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Sujet</h4>
                  <p className="text-gray-700">{selectedLead.subject}</p>
                </div>
              )}

              {/* Message */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Message</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedLead.message}</p>
                </div>
              </div>

              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Source</h4>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${SOURCE_COLORS[selectedLead.source]}`}>
                    {selectedLead.source === 'landing' ? 'Page d\'accueil' : 'Page contact'}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Date de création</h4>
                  <p className="text-gray-700">{formatDate(selectedLead.createdAt)}</p>
                </div>
              </div>

              {/* Notes */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Notes internes</h4>
                <textarea
                  value={selectedLead.notes || ''}
                  onChange={(e) => setSelectedLead({ ...selectedLead, notes: e.target.value })}
                  placeholder="Ajouter des notes internes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                  rows={3}
                />
                <button
                  onClick={() => updateContactLead(selectedLead._id, { notes: selectedLead.notes })}
                  className="mt-2 bg-logo-lime hover:bg-logo-lime/90 text-dark-green-7 px-4 py-2 rounded-lg text-sm font-medium"
                  disabled={updating === selectedLead._id}
                >
                  Sauvegarder les notes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
