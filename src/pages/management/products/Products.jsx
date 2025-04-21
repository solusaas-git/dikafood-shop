import React, { useState } from 'react';
import {
  MagnifyingGlass,
  Plus,
  Funnel,
  ArrowsDownUp,
  PencilSimple,
  Trash,
  Eye,
  CaretLeft,
  CaretRight,
  CheckCircle,
  XCircle,
  Tag,
  ListBullets,
  SortAscending
} from '@phosphor-icons/react';
import './products.scss';

// Mock data for products
const MOCK_PRODUCTS = [
  {
    id: 'PRD001',
    name: 'Huile d\'olive extra vierge',
    category: 'Huiles',
    price: 120,
    stock: 48,
    image: 'https://picsum.photos/id/315/600/600',
    isActive: true
  },
  {
    id: 'PRD002',
    name: 'Olives vertes marinées',
    category: 'Olives',
    price: 45,
    stock: 32,
    image: 'https://picsum.photos/id/209/600/600',
    isActive: true
  },
  {
    id: 'PRD003',
    name: 'Huile d\'argan cosmétique',
    category: 'Huiles',
    price: 180,
    stock: 15,
    image: 'https://picsum.photos/id/271/600/600',
    isActive: true
  },
  {
    id: 'PRD004',
    name: 'Miel de fleurs sauvages',
    category: 'Miels',
    price: 95,
    stock: 23,
    image: 'https://picsum.photos/id/312/600/600',
    isActive: true
  },
  {
    id: 'PRD005',
    name: 'Épices pour tajine',
    category: 'Épices',
    price: 65,
    stock: 41,
    image: 'https://picsum.photos/id/175/600/600',
    isActive: true
  },
  {
    id: 'PRD006',
    name: 'Huile d\'olive infusée au citron',
    category: 'Huiles',
    price: 140,
    stock: 19,
    image: 'https://picsum.photos/id/287/600/600',
    isActive: true
  },
  {
    id: 'PRD007',
    name: 'Olives noires confites',
    category: 'Olives',
    price: 55,
    stock: 28,
    image: 'https://picsum.photos/id/302/600/600',
    isActive: false
  },
  {
    id: 'PRD008',
    name: 'Huile d\'argan culinaire',
    category: 'Huiles',
    price: 195,
    stock: 9,
    image: 'https://picsum.photos/id/264/600/600',
    isActive: true
  },
  {
    id: 'PRD009',
    name: 'Couscous traditionnel',
    category: 'Céréales',
    price: 75,
    stock: 0,
    image: 'https://picsum.photos/id/162/600/600',
    isActive: false
  },
  {
    id: 'PRD010',
    name: 'Confiture de figues',
    category: 'Confitures',
    price: 85,
    stock: 17,
    image: 'https://picsum.photos/id/292/600/600',
    isActive: true
  }
];

const Products = () => {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [showActive, setShowActive] = useState(true);
  const [showInactive, setShowInactive] = useState(true);
  const [showOutOfStock, setShowOutOfStock] = useState(true);

  const productsPerPage = 5;

  // Categories derived from products
  const categories = [...new Set(MOCK_PRODUCTS.map(product => product.category))];

  // Filter and sort products
  const filteredProducts = products.filter(product => {
    // Search query filter
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Category filter
    if (selectedCategory && product.category !== selectedCategory) {
      return false;
    }

    // Status filters
    if (!showActive && product.isActive) {
      return false;
    }

    if (!showInactive && !product.isActive) {
      return false;
    }

    if (!showOutOfStock && product.stock === 0) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    // Sort logic
    if (sortBy === 'name') {
      return sortOrder === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortBy === 'price') {
      return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
    } else if (sortBy === 'stock') {
      return sortOrder === 'asc' ? a.stock - b.stock : b.stock - a.stock;
    }
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Toggle sort order
  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Toggle product status
  const toggleProductStatus = (id) => {
    setProducts(products.map(product =>
      product.id === id ? { ...product, isActive: !product.isActive } : product
    ));
  };

  return (
    <div className="products-management">
      {/* Toolbar */}
      <div className="management-toolbar">
        <div className="toolbar-left">
          <div className="search-bar">
            <MagnifyingGlass size={20} />
            <input
              type="text"
              placeholder="Rechercher un produit..."
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
          <button className="management-button">
            <Plus size={20} />
            Ajouter un produit
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="products-filters">
          <div className="filter-group">
            <label>Catégorie</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Toutes les catégories</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Afficher</label>
            <div className="checkbox-filters">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={showActive}
                  onChange={() => setShowActive(!showActive)}
                />
                Produits actifs
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={showInactive}
                  onChange={() => setShowInactive(!showInactive)}
                />
                Produits inactifs
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={showOutOfStock}
                  onChange={() => setShowOutOfStock(!showOutOfStock)}
                />
                Produits en rupture
              </label>
            </div>
          </div>
          <div className="filter-group">
            <label>Tri</label>
            <div className="sort-buttons">
              <button
                className={`sort-button ${sortBy === 'name' ? 'active' : ''}`}
                onClick={() => toggleSort('name')}
              >
                <ListBullets size={16} />
                Nom {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
              <button
                className={`sort-button ${sortBy === 'price' ? 'active' : ''}`}
                onClick={() => toggleSort('price')}
              >
                <Tag size={16} />
                Prix {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
              <button
                className={`sort-button ${sortBy === 'stock' ? 'active' : ''}`}
                onClick={() => toggleSort('stock')}
              >
                <SortAscending size={16} />
                Stock {sortBy === 'stock' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
            </div>
          </div>
          <button
            className="reset-filters"
            onClick={() => {
              setSelectedCategory('');
              setShowActive(true);
              setShowInactive(true);
              setShowOutOfStock(true);
              setSortBy('name');
              setSortOrder('asc');
            }}
          >
            Réinitialiser
          </button>
        </div>
      )}

      {/* Products Table */}
      <div className="products-table-container">
        <table className="management-table products-table">
          <thead>
            <tr>
              <th>Produit</th>
              <th>Catégorie</th>
              <th>Prix</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <tr key={product.id}>
                  <td className="product-info">
                    <div className="product-image">
                      <img src={product.image} alt={product.name} />
                    </div>
                    <div className="product-details">
                      <span className="product-name">{product.name}</span>
                      <span className="product-id">{product.id}</span>
                    </div>
                  </td>
                  <td>{product.category}</td>
                  <td className="price-column">{product.price} DH</td>
                  <td className={`stock-column ${product.stock === 0 ? 'out-of-stock' : ''}`}>
                    {product.stock === 0 ? 'Rupture' : product.stock}
                  </td>
                  <td>
                    <div className="status-toggle">
                      <button
                        className={`toggle-button ${product.isActive ? 'active' : 'inactive'}`}
                        onClick={() => toggleProductStatus(product.id)}
                      >
                        {product.isActive ? (
                          <>
                            <CheckCircle size={16} />
                            <span>Actif</span>
                          </>
                        ) : (
                          <>
                            <XCircle size={16} />
                            <span>Inactif</span>
                          </>
                        )}
                      </button>
                    </div>
                  </td>
                  <td>
                    <div className="actions">
                      <button className="view">
                        <Eye size={16} />
                      </button>
                      <button className="edit">
                        <PencilSimple size={16} />
                      </button>
                      <button className="delete">
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-results">
                  Aucun produit ne correspond à votre recherche
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredProducts.length > 0 && (
        <div className="pagination">
          <div className="pagination-info">
            Affichage de {indexOfFirstProduct + 1} à {Math.min(indexOfLastProduct, filteredProducts.length)} sur {filteredProducts.length} produits
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

export default Products;