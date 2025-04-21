import React, { useState } from 'react';
import {
  MagnifyingGlass,
  Plus,
  Funnel,
  Eye,
  PencilSimple,
  Trash,
  EnvelopeSimple,
  MapPin,
  Phone,
  CalendarBlank,
  ShoppingBag,
  CaretLeft,
  CaretRight,
  SortAscending,
  SortDescending,
  Export
} from '@phosphor-icons/react';
import './customers.scss';

// Mock data for customers
const MOCK_CUSTOMERS = [
  {
    id: 1,
    name: 'Ahmed Benali',
    email: 'a.benali@email.com',
    phone: '+212 6 12 34 56 78',
    location: 'Casablanca',
    joinedDate: '2023-09-15',
    totalOrders: 8,
    totalSpent: 1250,
    lastOrder: '2024-06-08'
  },
  {
    id: 2,
    name: 'Sofia Lahlou',
    email: 's.lahlou@email.com',
    phone: '+212 6 23 45 67 89',
    location: 'Rabat',
    joinedDate: '2023-11-22',
    totalOrders: 5,
    totalSpent: 850,
    lastOrder: '2024-06-07'
  },
  {
    id: 3,
    name: 'Mohammed Tazi',
    email: 'm.tazi@email.com',
    phone: '+212 6 34 56 78 90',
    location: 'Marrakech',
    joinedDate: '2024-01-10',
    totalOrders: 3,
    totalSpent: 520,
    lastOrder: '2024-06-07'
  },
  {
    id: 4,
    name: 'Leila Amrani',
    email: 'l.amrani@email.com',
    phone: '+212 6 45 67 89 01',
    location: 'Tanger',
    joinedDate: '2024-02-05',
    totalOrders: 7,
    totalSpent: 1750,
    lastOrder: '2024-06-06'
  },
  {
    id: 5,
    name: 'Karim El Fassi',
    email: 'k.elfassi@email.com',
    phone: '+212 6 56 78 90 12',
    location: 'Agadir',
    joinedDate: '2024-03-18',
    totalOrders: 2,
    totalSpent: 345,
    lastOrder: '2024-06-05'
  },
  {
    id: 6,
    name: 'Nadia Tahiri',
    email: 'n.tahiri@email.com',
    phone: '+212 6 67 89 01 23',
    location: 'Rabat',
    joinedDate: '2023-08-30',
    totalOrders: 10,
    totalSpent: 1850,
    lastOrder: '2024-06-03'
  },
  {
    id: 7,
    name: 'Youssef Alami',
    email: 'y.alami@email.com',
    phone: '+212 6 78 90 12 34',
    location: 'Casablanca',
    joinedDate: '2024-04-12',
    totalOrders: 4,
    totalSpent: 780,
    lastOrder: '2024-06-05'
  },
  {
    id: 8,
    name: 'Samira Bakkali',
    email: 's.bakkali@email.com',
    phone: '+212 6 89 01 23 45',
    location: 'Fès',
    joinedDate: '2024-05-20',
    totalOrders: 1,
    totalSpent: 195,
    lastOrder: '2024-06-04'
  }
];

// List of cities for filtering
const CITIES = ['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Agadir', 'Fès'];

const Customers = () => {
  const [customers, setCustomers] = useState(MOCK_CUSTOMERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [minOrders, setMinOrders] = useState('');
  const [maxOrders, setMaxOrders] = useState('');

  const customersPerPage = 5;

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Filter and sort customers
  const filteredCustomers = customers.filter(customer => {
    // Search filter - check if query matches customer name or email
    if (searchQuery &&
        !customer.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !customer.email.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // City filter
    if (selectedCity && customer.location !== selectedCity) {
      return false;
    }

    // Orders range filter
    if (minOrders && customer.totalOrders < parseInt(minOrders)) {
      return false;
    }

    if (maxOrders && customer.totalOrders > parseInt(maxOrders)) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'name') {
      return sortOrder === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortBy === 'totalOrders') {
      return sortOrder === 'asc' ? a.totalOrders - b.totalOrders : b.totalOrders - a.totalOrders;
    } else if (sortBy === 'totalSpent') {
      return sortOrder === 'asc' ? a.totalSpent - b.totalSpent : b.totalSpent - a.totalSpent;
    } else if (sortBy === 'joinedDate') {
      return sortOrder === 'asc'
        ? new Date(a.joinedDate) - new Date(b.joinedDate)
        : new Date(b.joinedDate) - new Date(a.joinedDate);
    }
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Toggle sort
  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedCity('');
    setMinOrders('');
    setMaxOrders('');
    setSearchQuery('');
    setSortBy('name');
    setSortOrder('asc');
  };

  return (
    <div className="customers-management">
      {/* Toolbar */}
      <div className="management-toolbar">
        <div className="toolbar-left">
          <div className="search-bar">
            <MagnifyingGlass size={20} />
            <input
              type="text"
              placeholder="Rechercher un client..."
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
          <button className="management-button secondary">
            <Export size={20} />
            Exporter
          </button>
          <button className="management-button">
            <Plus size={20} />
            Ajouter un client
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="customers-filters">
          <div className="filter-group">
            <label>Ville</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="">Toutes les villes</option>
              {CITIES.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Nombre de commandes</label>
            <div className="range-inputs">
              <div className="range-input">
                <span>Min</span>
                <input
                  type="number"
                  min="0"
                  value={minOrders}
                  onChange={(e) => setMinOrders(e.target.value)}
                />
              </div>
              <div className="range-input">
                <span>Max</span>
                <input
                  type="number"
                  min="0"
                  value={maxOrders}
                  onChange={(e) => setMaxOrders(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="filter-group">
            <label>Tri</label>
            <div className="sort-options">
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order);
                }}
              >
                <option value="name-asc">Nom (A-Z)</option>
                <option value="name-desc">Nom (Z-A)</option>
                <option value="joinedDate-desc">Date d'inscription (récent)</option>
                <option value="joinedDate-asc">Date d'inscription (ancien)</option>
                <option value="totalOrders-desc">Commandes (élevé-bas)</option>
                <option value="totalOrders-asc">Commandes (bas-élevé)</option>
                <option value="totalSpent-desc">Montant dépensé (élevé-bas)</option>
                <option value="totalSpent-asc">Montant dépensé (bas-élevé)</option>
              </select>
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

      {/* Customers Table */}
      <div className="customers-table-container">
        <table className="management-table customers-table">
          <thead>
            <tr>
              <th className="sortable" onClick={() => toggleSort('name')}>
                Client
                {sortBy === 'name' && (
                  sortOrder === 'asc' ? <SortAscending size={14} /> : <SortDescending size={14} />
                )}
              </th>
              <th>Contact</th>
              <th className="sortable" onClick={() => toggleSort('joinedDate')}>
                Inscrit le
                {sortBy === 'joinedDate' && (
                  sortOrder === 'asc' ? <SortAscending size={14} /> : <SortDescending size={14} />
                )}
              </th>
              <th className="sortable" onClick={() => toggleSort('totalOrders')}>
                Commandes
                {sortBy === 'totalOrders' && (
                  sortOrder === 'asc' ? <SortAscending size={14} /> : <SortDescending size={14} />
                )}
              </th>
              <th className="sortable" onClick={() => toggleSort('totalSpent')}>
                Total dépensé
                {sortBy === 'totalSpent' && (
                  sortOrder === 'asc' ? <SortAscending size={14} /> : <SortDescending size={14} />
                )}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCustomers.length > 0 ? (
              currentCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td className="customer-info">
                    <div className="customer-name">{customer.name}</div>
                    <div className="customer-location">
                      <MapPin size={14} />
                      <span>{customer.location}</span>
                    </div>
                  </td>
                  <td className="contact-info">
                    <div className="customer-email">
                      <EnvelopeSimple size={14} />
                      <span>{customer.email}</span>
                    </div>
                    <div className="customer-phone">
                      <Phone size={14} />
                      <span>{customer.phone}</span>
                    </div>
                  </td>
                  <td className="joined-date">
                    <CalendarBlank size={14} />
                    <span>{formatDate(customer.joinedDate)}</span>
                  </td>
                  <td className="order-count">
                    <div className="order-info">
                      <ShoppingBag size={14} />
                      <span>{customer.totalOrders}</span>
                    </div>
                    <div className="last-order">Dernier: {formatDate(customer.lastOrder)}</div>
                  </td>
                  <td className="total-spent">
                    <span className="amount">{customer.totalSpent.toLocaleString()} DH</span>
                  </td>
                  <td>
                    <div className="actions">
                      <button className="view" title="Voir le client">
                        <Eye size={16} />
                      </button>
                      <button className="edit" title="Modifier le client">
                        <PencilSimple size={16} />
                      </button>
                      <button className="delete" title="Supprimer le client">
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-results">
                  Aucun client ne correspond à votre recherche
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredCustomers.length > 0 && (
        <div className="pagination">
          <div className="pagination-info">
            Affichage de {indexOfFirstCustomer + 1} à {Math.min(indexOfLastCustomer, filteredCustomers.length)} sur {filteredCustomers.length} clients
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

export default Customers;