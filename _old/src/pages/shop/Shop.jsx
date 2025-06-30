import React, { useState, useEffect, useRef } from 'react';
import './shop.scss';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { isMobile, isTablet } from 'react-device-detect';

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

// Import product data utilities
import {
  products as allProducts,
  productCategories,
  sortOptions as sortOptionsData,
  getFilteredProducts,
  formatPrice,
  getDefaultVariant,
  hasDiscount,
  getProductImage
} from '../../data/products';

// Import components
import ShopProductCard from '../../components/product/ShopProductCard';

// Updated Mobile Components
const MobileFilterBar = ({ activeFiltersCount, onToggleMobileFilters, searchQuery, setSearchQuery }) => (
  <div className="mobile-filter-bar">
    <div className="mobile-search">
      <div className="search-icon-container">
        <MagnifyingGlass size={18} weight="duotone" />
      </div>
      <input
        type="text"
        placeholder="Rechercher..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {searchQuery && (
        <button className="clear-search" onClick={() => setSearchQuery('')}>
          <X size={16} weight="duotone" />
        </button>
      )}
    </div>
    <button
      className="mobile-filter-toggle"
      onClick={onToggleMobileFilters}
    >
      <Funnel size={18} weight="duotone" />
      Filtrer
      {activeFiltersCount > 0 && (
        <span className="filter-badge">{activeFiltersCount}</span>
      )}
    </button>
  </div>
);

const MobileFilterHeader = ({ activeFiltersCount, onCloseMobileFilters }) => (
  <div className="mobile-filter-header">
    <h3>
      Filtres
      {activeFiltersCount > 0 && (
        <span className="filter-count">{activeFiltersCount}</span>
      )}
    </h3>
    <button
      className="close-filters"
      onClick={onCloseMobileFilters}
      aria-label="Fermer les filtres"
    >
      <X size={20} />
    </button>
  </div>
);

// New Mobile Bottom Action Bar Component
const MobileBottomActionBar = ({ activeFiltersCount, onToggleMobileFilters, onToggleSortModal }) => (
  <div className="mobile-bottom-action-bar">
    <button
      className="bottom-bar-button"
      onClick={onToggleMobileFilters}
    >
      <div className="icon-container">
        <Funnel size={20} weight="duotone" />
      </div>
      Filtrer
      {activeFiltersCount > 0 && (
        <span className="filter-badge">{activeFiltersCount}</span>
      )}
    </button>
    <button
      className="bottom-bar-button"
      onClick={onToggleSortModal}
    >
      <div className="icon-container">
        <ArrowsDownUp size={20} weight="duotone" />
      </div>
      Trier
    </button>
  </div>
);

const MobileSortOptions = ({ currentSort, onSortChange, sortOptions }) => {
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);

  const getCurrentSortLabel = () => {
    const option = sortOptions.find(opt => opt.id === currentSort);
    return option ? option.label : sortOptions[0].label;
  };

  return (
    <>
      <button
        className="mobile-sort-button"
        onClick={() => setIsSortModalOpen(true)}
      >
        <ArrowsDownUp size={18} weight="duotone" />
        <span>{getCurrentSortLabel()}</span>
      </button>

      {isSortModalOpen && (
        <div className="mobile-sort-modal">
          <div className="mobile-sort-overlay" onClick={() => setIsSortModalOpen(false)}></div>
          <div className="mobile-sort-content">
            <div className="mobile-sort-header">
              <h3>Trier par</h3>
              <button className="close-sort-modal" onClick={() => setIsSortModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="mobile-sort-options">
              {sortOptions.map((option) => (
                <button
                  key={option.id}
                  className={`mobile-sort-option ${option.id === currentSort ? 'active' : ''}`}
                  onClick={() => {
                    onSortChange(option.id);
                    setIsSortModalOpen(false);
                  }}
                >
                  <span className="sort-icon">{option.icon}</span>
                  <span>{option.label}</span>
                  {option.id === currentSort && (
                    <Check size={18} weight="duotone" className="check-icon" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const MobileProductGrid = ({ products, onAddToCart }) => (
  <div className="mobile-product-grid">
    {products.map((product) => (
      <ShopProductCard
        key={product.id}
        product={product}
        onAddToCart={onAddToCart}
        className="mobile-card"
      />
    ))}
  </div>
);

const Shop = () => {
  // State
  const [products, setProducts] = useState(allProducts);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 100]); // Changed to use percentage
  const [actualPriceRange, setActualPriceRange] = useState([0, 1000]); // Actual price values
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const productsPerPage = 100; // Show all products by default
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [sortModalOpen, setSortModalOpen] = useState(false);

  // Ref for product grid section
  const productGridRef = useRef(null);
  const dropdownRef = useRef(null);
  const optionsRef = useRef([]);
  const sliderTrackRef = useRef(null);

  // State for price range slider drag functionality
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState(null); // 'min' or 'max'

  // Map sort options data to include icon components
  const sortOptions = sortOptionsData.map(option => {
    let icon;

    switch(option.icon) {
      case 'Star':
        icon = <Star size={16} weight={option.id === 'featured' ? 'duotone' : 'duotone'} />;
        break;
      case 'ClockClockwise':
        icon = <ClockClockwise size={16} weight="duotone" />;
        break;
      case 'SortAscending':
        icon = <SortAscending size={16} weight="duotone" />;
        break;
      case 'SortDescending':
        icon = <SortDescending size={16} weight="duotone" />;
        break;
      default:
        icon = <Star size={16} weight="duotone" />;
    }

    return { ...option, icon };
  });

  // Detect mobile device
  useEffect(() => {
    setIsMobileDevice(isMobile || isTablet);
  }, []);

  // Effect to update filtered products when filters change
  useEffect(() => {
    // Use actual price values for filtering products
    const [minPrice, maxPrice] = actualPriceRange;

    const filteredProducts = getFilteredProducts({
      category: selectedCategory,
      searchQuery,
      sortOption,
      minPrice,
      maxPrice
    });

    // Apply additional filters (in stock, on sale) which aren't in the utility
    const finalFilteredProducts = filteredProducts.filter(product => {
      // In stock filter
      if (inStockOnly && !product.isInStock) {
        return false;
      }

      // On sale filter
      if (onSaleOnly && !hasDiscount(product)) {
        return false;
      }

      return true;
    });

    setProducts(finalFilteredProducts);
    setCurrentPage(1); // Reset to first page whenever filters change

  }, [selectedCategory, searchQuery, sortOption, actualPriceRange, inStockOnly, onSaleOnly]);

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

  // Get paginated products
  const paginatedProducts = products.slice(0, currentPage * productsPerPage);

  // Check if more products are available
  const hasMoreProducts = paginatedProducts.length < products.length;

  // Handle loading more products
  const handleLoadMore = () => {
    setCurrentPage(currentPage + 1);
  };

  // Cart functions
  const addToCart = (product, quantity = 1, variant = getDefaultVariant(product)) => {
    if (!variant) return; // Skip if no variant available

    // Check if product is already in cart
    const existingItem = cart.find(item =>
      item.product.id === product.id && item.variant.id === variant.id
    );

    if (existingItem) {
      // Update quantity if already in cart
      setCart(cart.map(item =>
        item.product.id === product.id && item.variant.id === variant.id
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

  const removeFromCart = (productId, variantId) => {
    setCart(cart.filter(item =>
      !(item.product.id === productId && item.variant.id === variantId)
    ));
  };

  const updateCartQuantity = (productId, variantId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId, variantId);
      return;
    }

    setCart(cart.map(item =>
      item.product.id === productId && item.variant.id === variantId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  // Calculate cart totals
  const cartSubtotalValue = cart.reduce((sum, item) => {
    const price = item.variant.discountPrice || item.variant.price;
    return sum + (price * item.quantity);
  }, 0);

  const cartSavingsValue = cart.reduce((sum, item) => {
    if (item.variant.discountPrice) {
      return sum + ((item.variant.price - item.variant.discountPrice) * item.quantity);
    }
    return sum;
  }, 0);

  // Format cart totals for display
  const cartSubtotal = formatPrice(cartSubtotalValue);
  const cartSavings = formatPrice(cartSavingsValue);

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
    setSelectedCategory('all');
    setSearchQuery('');
    setPriceRange([0, 100]); // Reset percentage values
    setActualPriceRange([0, 1000]); // Reset actual price values
    setInStockOnly(false);
    setOnSaleOnly(false);
    setSortOption('featured');

    // Provide visual feedback
    const resetButton = document.querySelector('.clear-filters-button');
    if (resetButton) {
      resetButton.classList.add('filter-reset-animation');
      setTimeout(() => {
        resetButton.classList.remove('filter-reset-animation');
      }, 500);
    }
  };

  // Check if any filters are active
  const isAnyFilterActive = () => {
    return (
      selectedCategory !== 'all' ||
      searchQuery !== '' ||
      priceRange[0] > 0 ||
      priceRange[1] < 100 ||
      inStockOnly ||
      onSaleOnly ||
      sortOption !== 'featured'
    );
  };

  // Count active filters
  const activeFiltersCount = () => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (searchQuery !== '') count++;
    if (priceRange[0] > 0 || priceRange[1] < 100) count++;
    if (inStockOnly) count++;
    if (onSaleOnly) count++;
    if (sortOption !== 'featured') count++;
    return count;
  };

  // Convert percentage to actual price
  const percentToPrice = (percent) => {
    return Math.round((percent / 100) * 1000);
  };

  // Convert price to percentage
  const priceToPercent = (price) => {
    return Math.round((price / 1000) * 100);
  };

  // Handle drag start for price range slider
  const handleDragStart = (e, type) => {
    e.preventDefault();
    setIsDragging(true);
    setDragType(type);

    // Add event listeners for mousemove and mouseup
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
  };

  // Handle drag move for price range slider
  const handleDragMove = (e) => {
    if (!isDragging || !sliderTrackRef.current) return;

    const trackRect = sliderTrackRef.current.getBoundingClientRect();
    const trackWidth = trackRect.width;
    const trackLeft = trackRect.left;

    // Calculate position as percentage of track width
    let position = ((e.clientX - trackLeft) / trackWidth) * 100;

    // Clamp position between 0 and 100
    position = Math.max(0, Math.min(100, position));

    updateRangeBasedOnPosition(position);
  };

  // Common function to update range based on position
  const updateRangeBasedOnPosition = (position) => {
    if (dragType === 'min') {
      // Ensure min handle doesn't go beyond max handle
      const maxPosition = priceRange[1];
      if (position < maxPosition - 1) { // Add 1% buffer to prevent handles from overlapping
        const newPriceRange = [Math.round(position), priceRange[1]];
        setPriceRange(newPriceRange);
        setActualPriceRange([percentToPrice(newPriceRange[0]), percentToPrice(newPriceRange[1])]);
      }
    } else if (dragType === 'max') {
      // Ensure max handle doesn't go below min handle
      const minPosition = priceRange[0];
      if (position > minPosition + 1) { // Add 1% buffer to prevent handles from overlapping
        const newPriceRange = [priceRange[0], Math.round(position)];
        setPriceRange(newPriceRange);
        setActualPriceRange([percentToPrice(newPriceRange[0]), percentToPrice(newPriceRange[1])]);
      }
    }
  };

  // Handle drag end for price range slider
  const handleDragEnd = () => {
    setIsDragging(false);
    setDragType(null);

    // Remove event listeners
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
  };

  // Handle touch start for price range slider
  const handleTouchStart = (e, type) => {
    e.preventDefault();
    setIsDragging(true);
    setDragType(type);

    // Add event listeners for touchmove and touchend
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  };

  // Handle touch move for price range slider
  const handleTouchMove = (e) => {
    if (!isDragging || !sliderTrackRef.current) return;

    e.preventDefault();
    const touch = e.touches[0];
    const trackRect = sliderTrackRef.current.getBoundingClientRect();
    const trackWidth = trackRect.width;
    const trackLeft = trackRect.left;

    // Calculate position as percentage of track width
    let position = ((touch.clientX - trackLeft) / trackWidth) * 100;

    // Clamp position between 0 and 100
    position = Math.max(0, Math.min(100, position));

    updateRangeBasedOnPosition(position);
  };

  // Handle touch end for price range slider
  const handleTouchEnd = () => {
    setIsDragging(false);
    setDragType(null);

    // Remove event listeners
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  };

  // Add cleanup for drag event listeners on component unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // Handle keyboard navigation for price range slider
  const handleSliderKeyDown = (e, type) => {
    const step = 5; // 5% step for keyboard navigation
    let newValue = 0;
    let newPriceRange = [...priceRange];

    if (type === 'min') {
      if (e.key === 'ArrowRight') {
        newValue = Math.min(priceRange[0] + step, priceRange[1] - 1);
        newPriceRange = [newValue, priceRange[1]];
        setPriceRange(newPriceRange);
        setActualPriceRange([percentToPrice(newPriceRange[0]), percentToPrice(newPriceRange[1])]);
        e.preventDefault();
      } else if (e.key === 'ArrowLeft') {
        newValue = Math.max(priceRange[0] - step, 0);
        newPriceRange = [newValue, priceRange[1]];
        setPriceRange(newPriceRange);
        setActualPriceRange([percentToPrice(newPriceRange[0]), percentToPrice(newPriceRange[1])]);
        e.preventDefault();
      }
    } else if (type === 'max') {
      if (e.key === 'ArrowRight') {
        newValue = Math.min(priceRange[1] + step, 100);
        newPriceRange = [priceRange[0], newValue];
        setPriceRange(newPriceRange);
        setActualPriceRange([percentToPrice(newPriceRange[0]), percentToPrice(newPriceRange[1])]);
        e.preventDefault();
      } else if (e.key === 'ArrowLeft') {
        newValue = Math.max(priceRange[1] - step, priceRange[0] + 1);
        newPriceRange = [priceRange[0], newValue];
        setPriceRange(newPriceRange);
        setActualPriceRange([percentToPrice(newPriceRange[0]), percentToPrice(newPriceRange[1])]);
        e.preventDefault();
      }
    }
  };

  return (
    <div className={`shop-page full-width ${isMobileDevice ? 'mobile-view' : ''}`}>
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
          {/* Mobile filter bar - only show on mobile */}
          {isMobileDevice && (
            <MobileFilterBar
              activeFiltersCount={activeFiltersCount()}
              onToggleMobileFilters={() => setMobileFiltersOpen(true)}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          )}

          {/* Filters Sidebar */}
          <div className={`shop-sidebar ${mobileFiltersOpen ? 'mobile-open' : ''}`}>
            {/* Mobile filter header */}
            {isMobileDevice && (
              <MobileFilterHeader
                activeFiltersCount={activeFiltersCount()}
                onCloseMobileFilters={() => setMobileFiltersOpen(false)}
              />
            )}

            <div className="shop-filters">
              {/* Categories Filter */}
              <div className="filter-section">
                <h3 className="filter-title">
                  <div className="icon-container">
                    <ListBullets size={16} weight="duotone" />
                  </div>
                  Catégories
                </h3>
                <div className="filter-options">
                  {productCategories.map((category) => {
                    // Calculate the number of products that match this category
                    const categoryCount = products.filter(p => {
                      // For "all" category, count products that match other filters
                      if (category.id === 'all') {
                        let matchesFilters = true;

                        // Apply other filters
                        if (inStockOnly && !p.isInStock) {
                          matchesFilters = false;
                        }

                        if (onSaleOnly && !hasDiscount(p)) {
                          matchesFilters = false;
                        }

                        return matchesFilters;
                      }

                      // For other categories, only count products in this category that match other filters
                      let matchesFilters = p.category === category.id;

                      if (!matchesFilters) return false;

                      if (inStockOnly && !p.isInStock) {
                        return false;
                      }

                      if (onSaleOnly && !hasDiscount(p)) {
                        return false;
                      }

                      return true;
                    }).length;

                    return (
                      <div
                        key={category.id}
                        className={`filter-option category-option ${selectedCategory === category.id ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedCategory(category.id);
                          if (isMobileDevice) setMobileFiltersOpen(false);
                        }}
                      >
                        <span className="chevron">›</span>
                        {category.name}
                        <span className="count">
                          {categoryCount}
                        </span>
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === category.id}
                          onChange={() => setSelectedCategory(category.id)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="filter-section price-range-section">
                <h3 className="filter-title">
                  <div className="icon-container">
                    <CurrencyDollar size={16} weight="duotone" />
                  </div>
                  Gamme de prix
                </h3>
                <div className="price-slider">
                  <div className="price-range">
                    <div className="range-track" ref={sliderTrackRef}>
                      <div
                        className="range-fill"
                        style={{
                          width: `${((priceRange[1] - priceRange[0]) / 100) * 100}%`,
                          left: `${(priceRange[0] / 100) * 100}%`
                        }}
                      ></div>
                      <div
                        className="range-handle"
                        style={{ left: `${(priceRange[0] / 100) * 100}%` }}
                        onMouseDown={(e) => handleDragStart(e, 'min')}
                        onTouchStart={(e) => handleTouchStart(e, 'min')}
                        onKeyDown={(e) => handleSliderKeyDown(e, 'min')}
                        role="slider"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        aria-valuenow={priceRange[0]}
                        aria-valuetext={`$${actualPriceRange[0]}`}
                        tabIndex={0}
                      ></div>
                      <div
                        className="range-handle"
                        style={{ left: `${(priceRange[1] / 100) * 100}%` }}
                        onMouseDown={(e) => handleDragStart(e, 'max')}
                        onTouchStart={(e) => handleTouchStart(e, 'max')}
                        onKeyDown={(e) => handleSliderKeyDown(e, 'max')}
                        role="slider"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        aria-valuenow={priceRange[1]}
                        aria-valuetext={`$${actualPriceRange[1]}`}
                        tabIndex={0}
                      ></div>
                    </div>
                  </div>
                  <div className="price-inputs">
                    <input
                      type="text"
                      value={`$${actualPriceRange[0]}`}
                      onChange={(e) => {
                        const value = parseInt(e.target.value.replace(/\D/g, ''), 10);
                        if (!isNaN(value) && value >= 0 && value <= actualPriceRange[1]) {
                          const percent = priceToPercent(value);
                          setPriceRange([percent, priceRange[1]]);
                          setActualPriceRange([value, actualPriceRange[1]]);
                        }
                      }}
                      aria-label="Prix minimum"
                    />
                    <span>à</span>
                    <input
                      type="text"
                      value={`$${actualPriceRange[1]}`}
                      onChange={(e) => {
                        const value = parseInt(e.target.value.replace(/\D/g, ''), 10);
                        if (!isNaN(value) && value >= actualPriceRange[0] && value <= 1000) {
                          const percent = priceToPercent(value);
                          setPriceRange([priceRange[0], percent]);
                          setActualPriceRange([actualPriceRange[0], value]);
                        }
                      }}
                      aria-label="Prix maximum"
                    />
                  </div>
                </div>
              </div>

              {/* Availability Filter */}
              <div className="filter-section">
                <h3 className="filter-title">
                  <div className="icon-container">
                    <CheckSquare size={16} weight="duotone" />
                  </div>
                  Disponibilité
                </h3>
                <div className="filter-options">
                  <div
                    className={`filter-option checkbox-option ${inStockOnly ? 'active' : ''}`}
                    onClick={() => setInStockOnly(!inStockOnly)}
                  >
                    En stock
                    <span className="count">
                      {products.filter(p => p.isInStock && (selectedCategory === 'all' || p.category === selectedCategory)).length}
                    </span>
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={() => setInStockOnly(!inStockOnly)}
                    />
                  </div>
                  <div
                    className={`filter-option checkbox-option ${onSaleOnly ? 'active' : ''}`}
                    onClick={() => setOnSaleOnly(!onSaleOnly)}
                  >
                    En promotion
                    <span className="count">
                      {products.filter(p => hasDiscount(p) && (selectedCategory === 'all' || p.category === selectedCategory)).length}
                    </span>
                    <input
                      type="checkbox"
                      checked={onSaleOnly}
                      onChange={() => setOnSaleOnly(!onSaleOnly)}
                    />
                  </div>
                </div>
              </div>

              {/* Clear Filters Button - Update with active filter count */}
              <button
                className={`clear-filters-button ${isAnyFilterActive() ? 'active' : ''}`}
                onClick={() => {
                  resetFilters();
                  if (isMobileDevice) setMobileFiltersOpen(false);
                }}
                aria-label="Effacer tous les filtres"
                disabled={!isAnyFilterActive()}
              >
                <ArrowCounterClockwise size={16} weight="duotone" />
                Effacer les filtres
                {isAnyFilterActive() && (
                  <span className="active-filter-count">{activeFiltersCount()}</span>
                )}
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="shop-main">
            {/* Mobile Filter Toggle - Only show on non-mobile devices */}
            {!isMobileDevice && (
              <button
                className="filter-toggle"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <ListBullets size={18} weight="duotone" />
                Afficher les filtres
                {activeFiltersCount() > 0 && (
                  <span className="filter-badge">{activeFiltersCount()}</span>
                )}
              </button>
            )}

            {/* Shop Results */}
            <div className="shop-results" ref={productGridRef}>
              <div className="results-header">
                <div className="results-count">
                  <Package size={20} weight="duotone" />
                  Affichage de <span>{paginatedProducts.length}</span> sur {products.length} produits
                </div>
              </div>

              {/* Use either mobile grid or responsive grid depending on device */}
              {isMobileDevice ? (
                <MobileProductGrid
                  products={paginatedProducts}
                  onAddToCart={addToCart}
                />
              ) : (
                <div className="product-grid">
                  {paginatedProducts.map((product) => (
                    <ShopProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={addToCart}
                    />
                  ))}
                </div>
              )}

              {hasMoreProducts && (
                <button className="load-more-btn" onClick={handleLoadMore}>
                  <ArrowCounterClockwise size={18} weight="duotone" className="load-more-icon" />
                  Charger plus de produits
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Bottom Action Bar */}
        {isMobileDevice && (
          <MobileBottomActionBar
            activeFiltersCount={activeFiltersCount()}
            onToggleMobileFilters={() => setMobileFiltersOpen(true)}
            onToggleSortModal={() => setSortModalOpen(true)}
          />
        )}

        {/* Mobile Sort Modal */}
        {isMobileDevice && sortModalOpen && (
          <div className="mobile-sort-modal">
            <div className="mobile-sort-overlay" onClick={() => setSortModalOpen(false)}></div>
            <div className="mobile-sort-content">
              <div className="mobile-sort-header">
                <h3>Trier par</h3>
                <button className="close-sort-modal" onClick={() => setSortModalOpen(false)}>
                  <X size={20} />
                </button>
              </div>
              <div className="mobile-sort-options">
                {sortOptions.map((option) => (
                  <button
                    key={option.id}
                    className={`mobile-sort-option ${option.id === sortOption ? 'active' : ''}`}
                    onClick={() => {
                      handleSortChange(option.id);
                      setSortModalOpen(false);
                    }}
                  >
                    <span className="sort-icon">{option.icon}</span>
                    <span>{option.label}</span>
                    {option.id === sortOption && (
                      <Check size={18} weight="duotone" className="check-icon" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;