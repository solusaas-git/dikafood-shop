import React, { useState, useEffect, useRef } from 'react';
import './shop.scss';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Icons
import {
  ShoppingCart,
  ShoppingBag,
  Tag,
  Heart,
  Funnel,
  MagnifyingGlass,
  Star,
  X,
  CreditCard,
  ListBullets,
  Sliders,
  CheckSquare,
  ArrowCounterClockwise,
  Handshake,
  Download,
  CaretDown,
  Check,
  ArrowsDownUp,
  ClockClockwise,
  CurrencyCircleDollar,
  SortAscending,
  SortDescending,
  CurrencyDollar,
  ShoppingCartSimple,
  CaretRight,
  Package,
  SquaresFour,
  Rows
} from '@phosphor-icons/react';

// Import mock data from data file
import { mockProducts, categories } from '../../data/shop-products';

const Shop = () => {
  // State
  const [products, setProducts] = useState(mockProducts);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 25]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const productsPerPage = 12;

  // Ref for product grid section
  const productGridRef = useRef(null);
  const dropdownRef = useRef(null);
  const optionsRef = useRef([]);

  // Sort options - moved up before it's used
  const sortOptions = [
    { id: 'featured', label: 'Plus populaires', icon: <Star size={16} weight="fill" /> },
    { id: 'newest', label: 'Plus récents', icon: <ClockClockwise size={16} /> },
    { id: 'price-low', label: 'Prix: Croissant', icon: <SortAscending size={16} /> },
    { id: 'price-high', label: 'Prix: Décroissant', icon: <SortDescending size={16} /> },
    { id: 'rating', label: 'Avis clients', icon: <Star size={16} /> }
  ];

  // Scroll to products grid
  const scrollToProducts = () => {
    productGridRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Keyboard navigation for dropdown
  useEffect(() => {
    if (!isDropdownOpen) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex(prevIndex =>
            prevIndex < sortOptions.length - 1 ? prevIndex + 1 : prevIndex
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex(prevIndex =>
            prevIndex > 0 ? prevIndex - 1 : 0
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (focusedIndex >= 0) {
            handleSortChange(sortOptions[focusedIndex].id);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsDropdownOpen(false);
          setFocusedIndex(-1);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDropdownOpen, focusedIndex, sortOptions]);

  // Focus the option when focusedIndex changes
  useEffect(() => {
    if (focusedIndex >= 0 && optionsRef.current[focusedIndex]) {
      optionsRef.current[focusedIndex].focus();
    }
  }, [focusedIndex]);

  // Handle sort option selection
  const handleSortChange = (option) => {
    setSortOption(option);
    setIsDropdownOpen(false);
    setFocusedIndex(-1);
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (!isDropdownOpen) {
      // When opening, find the current option index
      const currentIndex = sortOptions.findIndex(opt => opt.id === sortOption);
      setFocusedIndex(currentIndex >= 0 ? currentIndex : 0);
    } else {
      setFocusedIndex(-1);
    }
  };

  // Get label of current sort option
  const getCurrentSortLabel = () => {
    const option = sortOptions.find(opt => opt.id === sortOption);
    return option ? option.label : sortOptions[0].label;
  };

  // Filter products based on current filters
  const filteredProducts = products.filter(product => {
    // Category filter
    if (selectedCategory !== 'All' && product.category !== selectedCategory) {
      return false;
    }

    // Search filter
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Price range filter
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }

    // In stock filter
    if (inStockOnly && !product.isInStock) {
      return false;
    }

    // On sale filter
    if (onSaleOnly && !product.discount) {
      return false;
    }

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return b.isNew ? 1 : -1;
      default: // featured - bestsellers first, then new items
        if (a.isBestseller && !b.isBestseller) return -1;
        if (!a.isBestseller && b.isBestseller) return 1;
        if (a.isNew && !b.isNew) return -1;
        if (!a.isNew && b.isNew) return 1;
        return 0;
    }
  });

  // Cart functions
  const addToCart = (product, quantity = 1, variant = product.variants[0]) => {
    // Check if product is already in cart
    const existingItem = cart.find(item =>
      item.product.id === product.id && item.variant === variant
    );

    if (existingItem) {
      // Update quantity if already in cart
      setCart(cart.map(item =>
        item.product.id === product.id && item.variant === variant
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      // Add new item to cart
      setCart([...cart, { product, quantity, variant }]);
    }

    // Open cart after adding
    setIsCartOpen(true);
  };

  const removeFromCart = (productId, variant) => {
    setCart(cart.filter(item =>
      !(item.product.id === productId && item.variant === variant)
    ));
  };

  const updateCartQuantity = (productId, variant, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId, variant);
      return;
    }

    setCart(cart.map(item =>
      item.product.id === productId && item.variant === variant
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  // Calculate cart totals
  const cartSubtotal = cart.reduce((sum, item) =>
    sum + (item.product.price * item.quantity), 0
  );

  const cartSavings = cart.reduce((sum, item) => {
    if (item.product.oldPrice) {
      return sum + ((item.product.oldPrice - item.product.price) * item.quantity);
    }
    return sum;
  }, 0);

  // Favorites functions
  const toggleFavorite = (productId) => {
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter(id => id !== productId));
    } else {
      setFavorites([...favorites, productId]);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setPriceRange([0, 25]);
    setInStockOnly(false);
    setOnSaleOnly(false);
    setSortOption('featured');
  };

  return (
    <div className="shop-page full-width">
      <Helmet>
        <title>Boutique - DikaFood</title>
        <meta name="description" content="Achetez notre sélection d'huiles d'olives et alimentaires de qualité supérieure, produites au Maroc." />
      </Helmet>

      <div className="shop-container">
        {/* Hero Image Section - Updated with CTAs */}
        <div className="shop-hero">
          <img
            src="https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80"
            alt="Premium olive oil products"
            className="hero-image"
          />
          <div className="hero-overlay">
        <div className="container">
              <div className="hero-content">
                <h2>Huiles d'Olive de Qualité Premium, Livrées Chez Vous</h2>
                <div className="cta-buttons">
                  <button className="hero-cta" onClick={scrollToProducts}>
                    <Handshake size={24} weight="duotone" />
                    Découvrir nos produits
                  </button>
                  <Link to="/#catalog" className="hero-cta-secondary">
                    <Download size={24} weight="duotone" />
                    Télécharger le catalogue
            </Link>
          </div>
              </div>
            </div>
        </div>
      </div>

        <div className="shop-content">
          {/* Filters Sidebar */}
          <div className={`shop-sidebar ${mobileFiltersOpen ? 'mobile-open' : ''}`}>
            <div className="mobile-sidebar-header">
              <h3>Filters</h3>
              <button
                className="close-sidebar"
                onClick={() => setMobileFiltersOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="shop-filters">
              {/* Categories Filter */}
              <div className="filter-section">
                <h3 className="filter-title">
                  <div className="icon-container">
                    <ListBullets size={16} />
                  </div>
                  Catégories
                </h3>
                <div className="filter-options">
                  <div className="filter-option active">
                    <span className="chevron">›</span>
                    Tous les articles
                    <span className="count">24</span>
                    <input type="radio" name="category" defaultChecked />
                  </div>
                  <div className="filter-option">
                    <span className="chevron">›</span>
                    Production
                    <span className="count">8</span>
                    <input type="radio" name="category" />
                  </div>
                  <div className="filter-option">
                    <span className="chevron">›</span>
                    Santé & Bien-être
                    <span className="count">6</span>
                    <input type="radio" name="category" />
                  </div>
                  <div className="filter-option">
                    <span className="chevron">›</span>
                    Conseils & Astuces
                    <span className="count">5</span>
                    <input type="radio" name="category" />
                  </div>
                  <div className="filter-option">
                    <span className="chevron">›</span>
                    Actualités
                    <span className="count">3</span>
                    <input type="radio" name="category" />
                  </div>
                  <div className="filter-option">
                    <span className="chevron">›</span>
                    Recettes
                    <span className="count">2</span>
                    <input type="radio" name="category" />
                  </div>
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="filter-section">
                <h3 className="filter-title">
                  <div className="icon-container">
                    <Sliders size={16} />
                  </div>
                  Gamme de prix
                </h3>
                <div className="price-slider">
                  <div className="price-range">
                    <div className="range-track">
                      <div className="range-fill" style={{ width: '60%', left: '10%' }}></div>
                      <div className="range-handle" style={{ left: '10%' }}></div>
                      <div className="range-handle" style={{ left: '70%' }}></div>
                    </div>
                  </div>
                  <div className="price-inputs">
                    <input type="text" value="15" readOnly />
                    <span>à</span>
                    <input type="text" value="85" readOnly />
                  </div>
                </div>
              </div>

              {/* Availability Filter */}
              <div className="filter-section">
                <h3 className="filter-title">
                  <div className="icon-container">
                    <CheckSquare size={16} />
                  </div>
                  Disponibilité
                </h3>
                <div className="filter-options">
                  <div className="filter-option">
                    <span className="chevron">›</span>
                    En stock
                    <span className="count">218</span>
                    <input type="checkbox" defaultChecked />
                  </div>
                  <div className="filter-option">
                    <span className="chevron">›</span>
                    En promotion
                    <span className="count">36</span>
                    <input type="checkbox" />
                  </div>
                  <div className="filter-option">
                    <span className="chevron">›</span>
                    Nouveautés
                    <span className="count">24</span>
                    <input type="checkbox" />
                  </div>
                </div>
              </div>

              {/* Clear Filters Button */}
              <button className="clear-filters-button">
                <ArrowCounterClockwise size={16} />
                Effacer les filtres
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="shop-main">
            {/* Mobile Filter Toggle */}
              <button
              className="filter-toggle"
              onClick={() => setMobileFiltersOpen(true)}
              >
              <ListBullets size={18} />
              Afficher les filtres
              </button>

            {/* Shop Controls - Now separated component */}
            <div className="shop-controls">
              <div className="shop-search">
                <div className="search-icon-container">
                  <MagnifyingGlass size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher des produits..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button className="clear-search" onClick={() => setSearchQuery('')}>
                    <X size={16} />
                  </button>
                )}
              </div>
              <div className="shop-sort" ref={dropdownRef}>
                <div
                  className={`sort-selected ${isDropdownOpen ? 'active' : ''}`}
                  onClick={toggleDropdown}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleDropdown();
                    }
                  }}
                  aria-expanded={isDropdownOpen}
                  role="button"
                  aria-haspopup="listbox"
                  tabIndex={0}
                >
                  <div className="sort-header">
                    <span className="sort-icon"><ArrowsDownUp size={16} /></span>
                    <span>{getCurrentSortLabel()}</span>
              </div>
                  <CaretDown size={16} weight="bold" className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`} />
                </div>
                {isDropdownOpen && (
                  <>
                    <div className="dropdown-backdrop" onClick={() => { setIsDropdownOpen(false); setFocusedIndex(-1); }} />
                    <div className="sort-dropdown" role="listbox">
                      {sortOptions.map((option, index) => (
                        <div
                          key={option.id}
                          ref={el => optionsRef.current[index] = el}
                          className={`sort-option ${option.id === sortOption ? 'active' : ''} ${focusedIndex === index ? 'focused' : ''}`}
                          onClick={() => handleSortChange(option.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleSortChange(option.id);
                            }
                          }}
                          role="option"
                          aria-selected={option.id === sortOption}
                          tabIndex={0}
                        >
                          <div className="sort-option-content">
                            <span className="sort-icon">{option.icon}</span>
                            <span>{option.label}</span>
                          </div>
                          {option.id === sortOption && <Check size={16} weight="bold" className="check-icon" />}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Shop Results - Now separated component */}
            <div className="shop-results" ref={productGridRef}>
              <div className="results-header">
                <div className="results-count">
                  <Package size={20} weight="duotone" />
                  Affichage de <span>240</span> produits
                </div>
                <div className="view-options">
                  <button className="view-option active" title="Vue grille">
                    <SquaresFour size={20} weight="duotone" />
                  </button>
                  <button className="view-option" title="Vue liste">
                    <Rows size={20} weight="duotone" />
                  </button>
                </div>
              </div>

              {/* Product Grid - Now nested within shop-results */}
              <div className="product-grid">
                {/* Product cards using the actual product images */}
                <div className="product-card">
                  <div className="product-image">
                    <img src="/images/products/nouarti-1L.png" alt="Huile d'Olive Extra Vierge" />
                    <div className="product-badges">
                      <span className="product-badge bestseller">Populaire</span>
                          </div>
                  </div>
                  <div className="product-info">
                    <h3 className="product-title">
                      <a href="/product/1">Huile d'Olive Extra Vierge</a>
                    </h3>
                    <div className="product-rating">
                      {Array(5).fill().map((_, i) => (
                        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={i < 5 ? 'filled' : ''}>
                          <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" fill="currentColor" />
                        </svg>
                      ))}
                      <span className="rating-count">(42)</span>
                    </div>
                    <div className="product-price-tag">
                      <Tag size={16} weight="bold" />
                      <span className="current-price">249,99 MAD</span>
                    </div>
                    <div className="product-actions">
                      <button
                        className="add-to-cart-btn"
                        onClick={() => addToCart(products[0])}
                      >
                        <ShoppingCartSimple size={18} weight="duotone" />
                        Ajouter au panier
                      </button>
                      <button
                        className="view-product-btn"
                        onClick={() => navigateToProductDetail(products[0].id)}
                      >
                        Voir le produit
                        <CaretRight size={14} weight="duotone" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="product-card">
                  <div className="product-image sale">
                    <img src="/images/products/nouarti-2L.png" alt="Huile d'Olive Bio" />
                    <div className="product-badges">
                      <span className="product-badge discount">-15%</span>
                          </div>
                          </div>
                  <div className="product-info">
                    <h3 className="product-title">
                      <a href="/product/2">Huile d'Olive Bio - Pressée à Froid</a>
                    </h3>
                    <div className="product-rating">
                      {Array(5).fill().map((_, i) => (
                        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={i < 4 ? 'filled' : ''}>
                          <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" fill="currentColor" />
                        </svg>
                      ))}
                      <span className="rating-count">(36)</span>
                    </div>
                    <div className="product-price-tag">
                      <Tag size={16} weight="bold" />
                      <span className="current-price">219,99 MAD</span>
                      <span className="old-price">259,99 MAD</span>
                    </div>
                    <div className="product-actions">
                      <button
                        className="add-to-cart-btn"
                        onClick={() => addToCart(products[1])}
                      >
                        <ShoppingCartSimple size={18} weight="duotone" />
                        Ajouter au panier
                      </button>
                      <button
                        className="view-product-btn"
                        onClick={() => navigateToProductDetail(products[1].id)}
                      >
                        Voir le produit
                        <CaretRight size={14} weight="duotone" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="product-card">
                  <div className="product-image">
                    <img src="/images/products/dika-500ML.png" alt="Huile d'Argan Cosmétique" />
                    <div className="product-badges">
                      <span className="product-badge new">Nouveau</span>
                    </div>
                  </div>
                  <div className="product-info">
                    <h3 className="product-title">
                      <a href="/product/3">Huile d'Argan Cosmétique Pure</a>
                    </h3>
                    <div className="product-rating">
                      {Array(5).fill().map((_, i) => (
                        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={i < 5 ? 'filled' : ''}>
                          <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" fill="currentColor" />
                        </svg>
                      ))}
                      <span className="rating-count">(18)</span>
                    </div>
                    <div className="product-price-tag">
                      <Tag size={16} weight="bold" />
                      <span className="current-price">329,99 MAD</span>
                    </div>
                    <div className="product-actions">
                        <button
                        className="add-to-cart-btn"
                        onClick={() => addToCart(products[2])}
                      >
                        <ShoppingCartSimple size={18} weight="duotone" />
                        Ajouter au panier
                      </button>
                      <button
                        className="view-product-btn"
                        onClick={() => navigateToProductDetail(products[2].id)}
                      >
                        Voir le produit
                        <CaretRight size={14} weight="duotone" />
                        </button>
                    </div>
                  </div>
                      </div>

                <div className="product-card">
                  <div className="product-image">
                    <img src="/images/products/nouarti-1L-fill.png" alt="Huile d'Olive Infusée" />
                  </div>
                      <div className="product-info">
                    <h3 className="product-title">
                      <a href="/product/4">Huile d'Olive Infusée aux Herbes</a>
                    </h3>
                    <div className="product-rating">
                      {Array(5).fill().map((_, i) => (
                        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={i < 4 ? 'filled' : ''}>
                          <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" fill="currentColor" />
                        </svg>
                      ))}
                      <span className="rating-count">(29)</span>
                    </div>
                    <div className="product-price-tag">
                      <Tag size={16} weight="bold" />
                      <span className="current-price">199,99 MAD</span>
                    </div>
                    <div className="product-actions">
                      <button
                        className="add-to-cart-btn"
                        onClick={() => addToCart(products[3])}
                      >
                        <ShoppingCartSimple size={18} weight="duotone" />
                        Ajouter au panier
                      </button>
                      <button
                        className="view-product-btn"
                        onClick={() => navigateToProductDetail(products[3].id)}
                      >
                        Voir le produit
                        <CaretRight size={14} weight="duotone" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="product-card">
                  <div className="product-image">
                    <img src="/images/products/ouedfes-1L.png" alt="Huile d'Olive Oued Fès" />
                  </div>
                  <div className="product-info">
                    <h3 className="product-title">
                      <a href="/product/5">Huile d'Olive Oued Fès</a>
                    </h3>
                        <div className="product-rating">
                      {Array(5).fill().map((_, i) => (
                        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={i < 4 ? 'filled' : ''}>
                          <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" fill="currentColor" />
                        </svg>
                      ))}
                      <span className="rating-count">(23)</span>
                    </div>
                    <div className="product-price-tag">
                      <Tag size={16} weight="bold" />
                      <span className="current-price">129,99 MAD</span>
                    </div>
                    <div className="product-actions">
                      <button
                        className="add-to-cart-btn"
                        onClick={() => addToCart(products[4])}
                      >
                        <ShoppingCartSimple size={18} weight="duotone" />
                        Ajouter au panier
                      </button>
                      <button
                        className="view-product-btn"
                        onClick={() => navigateToProductDetail(products[4].id)}
                      >
                        Voir le produit
                        <CaretRight size={14} weight="duotone" />
                      </button>
                    </div>
                  </div>
                        </div>

                <div className="product-card">
                  <div className="product-image sale">
                    <img src="/images/products/nouarti-2L-fill.png" alt="Coffret Huile d'Olive Premium" />
                    <div className="product-badges">
                      <span className="product-badge discount">-10%</span>
                    </div>
                  </div>
                  <div className="product-info">
                    <h3 className="product-title">
                      <a href="/product/6">Coffret Cadeau Huile d'Olive Premium</a>
                    </h3>
                    <div className="product-rating">
                      {Array(5).fill().map((_, i) => (
                        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={i < 5 ? 'filled' : ''}>
                          <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" fill="currentColor" />
                        </svg>
                      ))}
                      <span className="rating-count">(47)</span>
                    </div>
                    <div className="product-price-tag">
                      <Tag size={16} weight="bold" />
                      <span className="current-price">449,99 MAD</span>
                      <span className="old-price">499,99 MAD</span>
                    </div>
                    <div className="product-actions">
                      <button
                        className="add-to-cart-btn"
                        onClick={() => addToCart(products[5])}
                      >
                        <ShoppingCartSimple size={18} weight="duotone" />
                        Ajouter au panier
                      </button>
                      <button
                        className="view-product-btn"
                        onClick={() => navigateToProductDetail(products[5].id)}
                      >
                        Voir le produit
                        <CaretRight size={14} weight="duotone" />
                      </button>
                    </div>
                  </div>
                        </div>

                <div className="product-card">
                  <div className="product-image">
                    <img src="/images/products/dika-5L.png" alt="Huile d'Argan Culinaire" />
                  </div>
                  <div className="product-info">
                    <h3 className="product-title">
                      <a href="/product/7">Huile d'Argan Culinaire</a>
                    </h3>
                    <div className="product-rating">
                      {Array(5).fill().map((_, i) => (
                        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={i < 4 ? 'filled' : ''}>
                          <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" fill="currentColor" />
                        </svg>
                      ))}
                      <span className="rating-count">(31)</span>
                    </div>
                    <div className="product-price-tag">
                      <Tag size={16} weight="bold" />
                      <span className="current-price">289,99 MAD</span>
                    </div>
                    <div className="product-actions">
                        <button
                        className="add-to-cart-btn"
                        onClick={() => addToCart(products[6])}
                      >
                        <ShoppingCartSimple size={18} weight="duotone" />
                        Ajouter au panier
                      </button>
                      <button
                        className="view-product-btn"
                        onClick={() => navigateToProductDetail(products[6].id)}
                      >
                        Voir le produit
                        <CaretRight size={14} weight="duotone" />
                        </button>
                      </div>
                    </div>
                </div>

                <div className="product-card">
                  <div className="product-image">
                    <img src="/images/products/chourouk-1L.png" alt="Huile de Table Chourouk" />
                    <div className="product-badges">
                      <span className="product-badge bestseller">Populaire</span>
                    </div>
                  </div>
                  <div className="product-info">
                    <h3 className="product-title">
                      <a href="/product/8">Huile de Table Chourouk</a>
                    </h3>
                    <div className="product-rating">
                      {Array(5).fill().map((_, i) => (
                        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={i < 5 ? 'filled' : ''}>
                          <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" fill="currentColor" />
                        </svg>
                      ))}
                      <span className="rating-count">(56)</span>
                    </div>
                    <div className="product-price-tag">
                      <Tag size={16} weight="bold" />
                      <span className="current-price">89,99 MAD</span>
                    </div>
                    <div className="product-actions">
                      <button
                        className="add-to-cart-btn"
                        onClick={() => addToCart(products[7])}
                      >
                        <ShoppingCartSimple size={18} weight="duotone" />
                        Ajouter au panier
                      </button>
                      <button
                        className="view-product-btn"
                        onClick={() => navigateToProductDetail(products[7].id)}
                      >
                        Voir le produit
                        <CaretRight size={14} weight="duotone" />
                      </button>
                </div>
                  </div>
            </div>

                <div className="product-card">
                  <div className="product-image">
                    <img src="/images/products/chourouk-10L.png" alt="Huile de Table Chourouk - Format Familial" />
                    <div className="product-badges">
                      <span className="product-badge new">Nouveau</span>
                    </div>
                  </div>
                  <div className="product-info">
                    <h3 className="product-title">
                      <a href="/product/9">Huile de Table Chourouk - Format Familial</a>
                    </h3>
                    <div className="product-rating">
                      {Array(5).fill().map((_, i) => (
                        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={i < 4 ? 'filled' : ''}>
                          <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" fill="currentColor" />
                        </svg>
                      ))}
                      <span className="rating-count">(14)</span>
                    </div>
                    <div className="product-price-tag">
                      <Tag size={16} weight="bold" />
                      <span className="current-price">349,99 MAD</span>
                    </div>
                    <div className="product-actions">
                <button
                        className="add-to-cart-btn"
                        onClick={() => addToCart(products[8])}
                >
                        <ShoppingCartSimple size={18} weight="duotone" />
                        Ajouter au panier
                </button>
                      <button
                        className="view-product-btn"
                        onClick={() => navigateToProductDetail(products[8].id)}
                      >
                        Voir le produit
                        <CaretRight size={14} weight="duotone" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="product-card">
                  <div className="product-image">
                    <img src="/images/products/nouarti-5L.png" alt="Huile d'Olive Extra Vierge - Grand Format" />
                  </div>
                  <div className="product-info">
                    <h3 className="product-title">
                      <a href="/product/10">Huile d'Olive Extra Vierge - Grand Format</a>
                    </h3>
                    <div className="product-rating">
                      {Array(5).fill().map((_, i) => (
                        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={i < 4 ? 'filled' : ''}>
                          <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" fill="currentColor" />
                        </svg>
                      ))}
                      <span className="rating-count">(27)</span>
                    </div>
                    <div className="product-price-tag">
                      <Tag size={16} weight="bold" />
                      <span className="current-price">499,99 MAD</span>
                    </div>
                    <div className="product-actions">
                    <button
                        className="add-to-cart-btn"
                        onClick={() => addToCart(products[9])}
                    >
                        <ShoppingCartSimple size={18} weight="duotone" />
                        Ajouter au panier
                    </button>
                      <button
                        className="view-product-btn"
                        onClick={() => navigateToProductDetail(products[9].id)}
                      >
                        Voir le produit
                        <CaretRight size={14} weight="duotone" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="product-card">
                  <div className="product-image sale">
                    <img src="/images/products/chourouk-25L.png" alt="Huile de Table Chourouk - Format Professionnel" />
                    <div className="product-badges">
                      <span className="product-badge discount">-15%</span>
                    </div>
                  </div>
                  <div className="product-info">
                    <h3 className="product-title">
                      <a href="/product/11">Huile de Table Chourouk - Format Professionnel</a>
                    </h3>
                    <div className="product-rating">
                      {Array(5).fill().map((_, i) => (
                        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={i < 5 ? 'filled' : ''}>
                          <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" fill="currentColor" />
                        </svg>
                      ))}
                      <span className="rating-count">(38)</span>
                    </div>
                    <div className="product-price-tag">
                      <Tag size={16} weight="bold" />
                      <span className="current-price">629,99 MAD</span>
                      <span className="old-price">749,99 MAD</span>
                    </div>
                    <div className="product-actions">
                      <button
                        className="add-to-cart-btn"
                        onClick={() => addToCart(products[10])}
                      >
                        <ShoppingCartSimple size={18} weight="duotone" />
                        Ajouter au panier
                      </button>
                      <button
                        className="view-product-btn"
                        onClick={() => navigateToProductDetail(products[10].id)}
                      >
                        Voir le produit
                        <CaretRight size={14} weight="duotone" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="product-card">
                  <div className="product-image">
                    <img src="/images/products/nouarti-5L-fill.png" alt="Huile d'Olive Infusée - Grand Format" />
                  </div>
                  <div className="product-info">
                    <h3 className="product-title">
                      <a href="/product/12">Huile d'Olive Infusée - Grand Format</a>
                    </h3>
                    <div className="product-rating">
                      {Array(5).fill().map((_, i) => (
                        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={i < 4 ? 'filled' : ''}>
                          <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" fill="currentColor" />
                        </svg>
                      ))}
                      <span className="rating-count">(19)</span>
                    </div>
                    <div className="product-price-tag">
                      <Tag size={16} weight="bold" />
                      <span className="current-price">549,99 MAD</span>
                    </div>
                    <div className="product-actions">
                <button
                        className="add-to-cart-btn"
                        onClick={() => addToCart(products[11])}
                      >
                        <ShoppingCartSimple size={18} weight="duotone" />
                        Ajouter au panier
                      </button>
                      <button
                        className="view-product-btn"
                        onClick={() => navigateToProductDetail(products[11].id)}
                      >
                        Voir le produit
                        <CaretRight size={14} weight="duotone" />
                </button>
              </div>
                  </div>
                </div>
              </div>

              {/* Load More Button */}
              <button className="load-more-btn">
                <span>Voir plus de produits</span>
                <CaretDown size={16} weight="bold" className="load-more-icon" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Shopping Cart Sidebar */}
      <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>
            <ShoppingBag size={22} weight="fill" />
            Panier
            <span className="cart-count">{cart.length}</span>
          </h2>
          <button
            className="close-cart"
            onClick={() => setIsCartOpen(false)}
            title="Fermer le panier"
            aria-label="Fermer le panier"
          >
            <X size={22} />
          </button>
        </div>

        <div className="cart-items">
          {cart.length > 0 ? (
            cart.map((item, index) => (
              <div key={`${item.product.id}-${item.variant}-${index}`} className="cart-item">
                <div className="item-image">
                  <img src={item.product.image} alt={item.product.name} />
                </div>

                <div className="item-details">
                  <h4 className="item-name">{item.product.name}</h4>
                  <div className="item-variant">{item.variant}</div>
                  <div className="item-price">{item.product.price.toFixed(2)}€</div>
                </div>

                <div className="item-quantity">
                  <button
                    className="quantity-button"
                    onClick={() => updateCartQuantity(item.product.id, item.variant, item.quantity - 1)}
                    title="Diminuer la quantité"
                    aria-label="Diminuer la quantité"
                  >
                    -
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button
                    className="quantity-button"
                    onClick={() => updateCartQuantity(item.product.id, item.variant, item.quantity + 1)}
                    title="Augmenter la quantité"
                    aria-label="Augmenter la quantité"
                  >
                    +
                  </button>
                </div>

                <div className="item-subtotal">
                  {(item.product.price * item.quantity).toFixed(2)}€
                </div>

                <button
                  className="remove-item-button"
                  onClick={() => removeFromCart(item.product.id, item.variant)}
                  title="Supprimer du panier"
                  aria-label="Supprimer du panier"
                >
                  <X size={16} />
                </button>
              </div>
            ))
          ) : (
            <div className="empty-cart">
              <ShoppingBag size={48} weight="fill" />
              <p>Votre panier est vide</p>
              <button
                className="continue-shopping-btn"
                onClick={() => setIsCartOpen(false)}
              >
                Continuer vos achats
              </button>
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-summary">
            <h3 className="summary-title">
              Résumé du panier
            </h3>

            <div className="summary-row">
              <span>Sous-total</span>
              <span>{cartSubtotal.toFixed(2)}€</span>
            </div>

            {cartSavings > 0 && (
              <div className="summary-row savings">
                <span>Économies</span>
                <span>-{cartSavings.toFixed(2)}€</span>
              </div>
            )}

            <div className="summary-row">
              <span>Livraison</span>
              <span>Gratuite</span>
            </div>

            <div className="summary-total">
              <span>Total</span>
              <span>{cartSubtotal.toFixed(2)}€</span>
            </div>

            <a href="/checkout" className="checkout-button">
              <ShoppingBag size={20} weight="fill" />
              Passer à la caisse
            </a>
          </div>
        )}
      </div>

      {/* Cart Toggle Button */}
      <button
        className={`cart-toggle ${cart.length > 0 ? 'has-items' : ''}`}
        onClick={() => setIsCartOpen(!isCartOpen)}
        title="Voir le panier"
        aria-label="Voir le panier"
      >
        <ShoppingBag size={24} weight="fill" />
        <div className="cart-toggle-count">
          {cart.length}
        </div>
      </button>

      {/* Cart Overlay */}
      {isCartOpen && (
        <div
          className="cart-overlay"
          onClick={() => setIsCartOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Shop;