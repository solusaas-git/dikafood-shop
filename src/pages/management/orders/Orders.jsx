import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MagnifyingGlass,
  Funnel,
  CaretLeft,
  CaretRight,
  CheckCircle,
  Clock,
  Warning,
  Truck,
  XCircle,
  CalendarBlank,
  CurrencyDollar,
  Eye,
  PencilSimple,
  Printer,
  ArrowSquareOut,
  SortAscending,
  SortDescending
} from '@phosphor-icons/react';
import './orders.scss';

// Mock data for orders
const MOCK_ORDERS = [
  {
    id: 'ORD-001243',
    customer: {
      name: 'Ahmed Benali',
      email: 'a.benali@email.com',
      city: 'Casablanca'
    },
    date: '2024-06-08',
    items: 3,
    total: 458,
    status: 'completed',
    paymentStatus: 'paid',
    paymentMethod: 'card'
  },
  {
    id: 'ORD-001242',
    customer: {
      name: 'Sofia Lahlou',
      email: 's.lahlou@email.com',
      city: 'Rabat'
    },
    date: '2024-06-07',
    items: 5,
    total: 725,
    status: 'processing',
    paymentStatus: 'paid',
    paymentMethod: 'transfer'
  },
  {
    id: 'ORD-001241',
    customer: {
      name: 'Mohammed Tazi',
      email: 'm.tazi@email.com',
      city: 'Marrakech'
    },
    date: '2024-06-07',
    items: 2,
    total: 290,
    status: 'completed',
    paymentStatus: 'paid',
    paymentMethod: 'card'
  },
  {
    id: 'ORD-001240',
    customer: {
      name: 'Leila Amrani',
      email: 'l.amrani@email.com',
      city: 'Tanger'
    },
    date: '2024-06-06',
    items: 7,
    total: 1205,
    status: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'card'
  },
  {
    id: 'ORD-001239',
    customer: {
      name: 'Karim El Fassi',
      email: 'k.elfassi@email.com',
      city: 'Agadir'
    },
    date: '2024-06-05',
    items: 2,
    total: 345,
    status: 'cancelled',
    paymentStatus: 'refunded',
    paymentMethod: 'card'
  },
  {
    id: 'ORD-001238',
    customer: {
      name: 'Youssef Alami',
      email: 'y.alami@email.com',
      city: 'Casablanca'
    },
    date: '2024-06-05',
    items: 4,
    total: 520,
    status: 'shipped',
    paymentStatus: 'paid',
    paymentMethod: 'paypal'
  },
  {
    id: 'ORD-001237',
    customer: {
      name: 'Samira Bakkali',
      email: 's.bakkali@email.com',
      city: 'Fès'
    },
    date: '2024-06-04',
    items: 1,
    total: 195,
    status: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'card'
  },
  {
    id: 'ORD-001236',
    customer: {
      name: 'Nadia Tahiri',
      email: 'n.tahiri@email.com',
      city: 'Rabat'
    },
    date: '2024-06-03',
    items: 3,
    total: 410,
    status: 'pending',
    paymentStatus: 'pending',
    paymentMethod: 'transfer'
  }
];

const Orders = () => {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const ordersPerPage = 5;

  // Get all available statuses from orders
  const statuses = [...new Set(orders.map(order => order.status))];
  const paymentStatuses = [...new Set(orders.map(order => order.paymentStatus))];

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Filter and sort orders
  const filteredOrders = orders.filter(order => {
    // Search filter - check if query matches order ID or customer name
    if (searchQuery &&
        !order.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !order.customer.email.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Status filter
    if (selectedStatus && order.status !== selectedStatus) {
      return false;
    }

    // Payment status filter
    if (selectedPayment && order.paymentStatus !== selectedPayment) {
      return false;
    }

    // Date range filter
    if (startDate && new Date(order.date) < new Date(startDate)) {
      return false;
    }

    if (endDate && new Date(order.date) > new Date(endDate)) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'date') {
      return sortOrder === 'asc'
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    } else if (sortBy === 'total') {
      return sortOrder === 'asc' ? a.total - b.total : b.total - a.total;
    } else if (sortBy === 'id') {
      return sortOrder === 'asc'
        ? a.id.localeCompare(b.id)
        : b.id.localeCompare(a.id);
    }
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Toggle sort
  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // Get status icon based on status
  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed':
      case 'delivered':
        return <CheckCircle size={16} weight="fill" className="status-icon" />;
      case 'processing':
      case 'pending':
        return <Clock size={16} weight="fill" className="status-icon" />;
      case 'shipped':
        return <Truck size={16} weight="fill" className="status-icon" />;
      case 'cancelled':
        return <XCircle size={16} weight="fill" className="status-icon" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'completed': return 'Terminé';
      case 'processing': return 'En traitement';
      case 'pending': return 'En attente';
      case 'shipped': return 'Expédié';
      case 'delivered': return 'Livré';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  const getPaymentStatusLabel = (status) => {
    switch(status) {
      case 'paid': return 'Payé';
      case 'pending': return 'En attente';
      case 'refunded': return 'Remboursé';
      default: return status;
    }
  };

  const resetFilters = () => {
    setSelectedStatus('');
    setSelectedPayment('');
    setStartDate('');
    setEndDate('');
    setSearchQuery('');
    setSortBy('date');
    setSortOrder('desc');
  };

  return (
    <div className="orders-management">
      {/* Toolbar */}
      <div className="management-toolbar">
        <div className="toolbar-left">
          <div className="search-bar">
            <MagnifyingGlass size={20} />
            <input
              type="text"
              placeholder="Rechercher une commande..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            className="management-button secondary"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Funnel size={20} />
            Filtres
          </button>
        </div>
        <div className="toolbar-right">
          <div className="view-options">
            <button className="view-button active">
              Toutes ({orders.length})
            </button>
            <button className="view-button">
              En cours ({orders.filter(o => ['processing', 'pending', 'shipped'].includes(o.status)).length})
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="orders-filters">
          <div className="filter-group">
            <label>Statut de commande</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">Tous les statuts</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {getStatusLabel(status)}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Statut de paiement</label>
            <select
              value={selectedPayment}
              onChange={(e) => setSelectedPayment(e.target.value)}
            >
              <option value="">Tous les paiements</option>
              {paymentStatuses.map((status) => (
                <option key={status} value={status}>
                  {getPaymentStatusLabel(status)}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Date de commande</label>
            <div className="date-inputs">
              <div className="date-input">
                <span>Du</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="date-input">
                <span>Au</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>
          <button
            className="reset-filters"
            onClick={resetFilters}
          >
            Réinitialiser
          </button>
        </div>
      )}

      {/* Orders Table */}
      <div className="orders-table-container">
        <table className="management-table orders-table">
          <thead>
            <tr>
              <th className="sortable" onClick={() => toggleSort('id')}>
                Commande
                {sortBy === 'id' && (
                  sortOrder === 'asc' ? <SortAscending size={14} /> : <SortDescending size={14} />
                )}
              </th>
              <th>Client</th>
              <th className="sortable" onClick={() => toggleSort('date')}>
                Date
                {sortBy === 'date' && (
                  sortOrder === 'asc' ? <SortAscending size={14} /> : <SortDescending size={14} />
                )}
              </th>
              <th className="sortable" onClick={() => toggleSort('total')}>
                Total
                {sortBy === 'total' && (
                  sortOrder === 'asc' ? <SortAscending size={14} /> : <SortDescending size={14} />
                )}
              </th>
              <th>Statut</th>
              <th>Paiement</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.length > 0 ? (
              currentOrders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <Link to={`/management/orders/${order.id}`} className="order-id">
                      {order.id}
                    </Link>
                  </td>
                  <td className="customer-info">
                    <div className="customer-name">{order.customer.name}</div>
                    <div className="customer-email">{order.customer.email}</div>
                  </td>
                  <td className="date-col">
                    <div className="date-info">
                      <CalendarBlank size={14} />
                      <span>{formatDate(order.date)}</span>
                    </div>
                  </td>
                  <td className="total-col">
                    <div className="total-info">
                      <CurrencyDollar size={14} />
                      <span>{order.total} DH</span>
                    </div>
                    <div className="items-count">{order.items} articles</div>
                  </td>
                  <td>
                    <span className={`status-badge ${order.status}`}>
                      {getStatusIcon(order.status)}
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td>
                    <span className={`payment-status ${order.paymentStatus}`}>
                      {getPaymentStatusLabel(order.paymentStatus)}
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      <button className="view" title="Voir la commande">
                        <Eye size={16} />
                      </button>
                      <button className="edit" title="Modifier la commande">
                        <PencilSimple size={16} />
                      </button>
                      <button className="print" title="Imprimer la facture">
                        <Printer size={16} />
                      </button>
                      <button className="external" title="Ouvrir dans un nouvel onglet">
                        <ArrowSquareOut size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-results">
                  Aucune commande ne correspond à votre recherche
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredOrders.length > 0 && (
        <div className="pagination">
          <div className="pagination-info">
            Affichage de {indexOfFirstOrder + 1} à {Math.min(indexOfLastOrder, filteredOrders.length)} sur {filteredOrders.length} commandes
          </div>
          <div className="pagination-controls">
            <button
              onClick={() => paginate(1)}
              disabled={currentPage === 1}
            >
              <CaretLeft size={16} />
              <CaretLeft size={16} />
            </button>
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <CaretLeft size={16} />
            </button>

            {/* Page numbers */}
            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              // Logic to display pages around current page
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              if (pageNum <= totalPages) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => paginate(pageNum)}
                    className={currentPage === pageNum ? 'active' : ''}
                  >
                    {pageNum}
                  </button>
                );
              }
              return null;
            })}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <CaretRight size={16} />
            </button>
            <button
              onClick={() => paginate(totalPages)}
              disabled={currentPage === totalPages}
            >
              <CaretRight size={16} />
              <CaretRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;