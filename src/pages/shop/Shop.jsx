import React, { useState, useEffect } from 'react';
import './shop.scss';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Components
import Button from '../../components/buttons/Button';
import NavBar from '../../sections/shared/navbar/NavBar';
import Footer from '../../sections/shared/footer/Footer';

// Icons
import {
  ShoppingCart,
  ShoppingBag,
  Tag,
  Heart,
  Funnel,
  CaretDown,
  MagnifyingGlass,
  Star,
  X,
  CreditCard,
  House,
  CaretRight
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
  const productsPerPage = 6;

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
    <div className="shop-page">
      <Helmet>
        <title>Boutique - DikaFood</title>
        <meta name="description" content="Achetez notre sélection d'huiles d'olives et alimentaires de qualité supérieure, produites au Maroc." />
      </Helmet>

      <NavBar />

      {/* Shop Header */}
      <div className="shop-header">
        <div className="container">
          {/* Breadcrumb Navigation */}
          <div className="breadcrumb">
            <Link to="/" className="breadcrumb-item">
              <House size={16} />
              Home
            </Link>
            <CaretRight size={12} className="breadcrumb-separator" />
            <span className="breadcrumb-item active">
              Shop
            </span>
          </div>

          <h1>Our Products</h1>
          <p>Discover our premium selection of organic products</p>

          {/* Mobile Filter Toggle */}
          <button className="filter-toggle mobile-only">
            <Funnel size={20} />
            Filters
          </button>
        </div>
      </div>

      <div className="container">
        <div className="shop-content">
          {/* Sidebar Filters */}
          <aside className="shop-sidebar">
            <div className="shop-filters">
              {/* Categories */}
              <div className="filter-section">
                <h3 className="filter-title">
                  Categories
                </h3>
                <div className="filter-options">
                  {categories.map(category => (
                    <label
                      key={category.name}
                      className={`filter-option ${selectedCategory === category.name ? 'active' : ''}`}
                    >
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === category.name}
                        onChange={() => setSelectedCategory(category.name)}
                      />
                      {category.name}
                      <span className="count">({category.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="filter-section">
                <h3 className="filter-title">
                  Price Range
                </h3>
                <div className="price-slider">
                  <div className="price-range">
                    <div className="range-track">
                      <div
                        className="range-fill"
                        style={{
                          left: `${(priceRange[0] / 25) * 100}%`,
                          right: `${100 - (priceRange[1] / 25) * 100}%`
                        }}
                      ></div>
                      <div
                        className="range-handle left"
                        style={{ left: `${(priceRange[0] / 25) * 100}%` }}
                      ></div>
                      <div
                        className="range-handle right"
                        style={{ left: `${(priceRange[1] / 25) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="price-inputs">
                    <span>$</span>
                    <input
                      type="number"
                      value={priceRange[0]}
                      min={0}
                      max={priceRange[1]}
                      onChange={(e) => setPriceRange([
                        Math.min(Number(e.target.value), priceRange[1]),
                        priceRange[1]
                      ])}
                    />
                    <span>to</span>
                    <span>$</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      min={priceRange[0]}
                      max={25}
                      onChange={(e) => setPriceRange([
                        priceRange[0],
                        Math.max(Number(e.target.value), priceRange[0])
                      ])}
                    />
                  </div>
                </div>
              </div>

              {/* Additional Filters */}
              <div className="filter-section">
                <h3 className="filter-title">
                  Additional Filters
                </h3>
                <div className="filter-options">
                  <label className="filter-option">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={() => setInStockOnly(!inStockOnly)}
                    />
                    In Stock Only
                  </label>
                  <label className="filter-option">
                    <input
                      type="checkbox"
                      checked={onSaleOnly}
                      onChange={() => setOnSaleOnly(!onSaleOnly)}
                    />
                    On Sale Only
                  </label>
                </div>
              </div>

              {/* Reset Filters */}
              <button
                className="clear-filters-button"
                onClick={resetFilters}
              >
                Reset Filters
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="shop-main">
            {/* Shop Controls */}
            <div className="shop-controls">
              <div className="shop-search">
                <MagnifyingGlass size={20} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    className="clear-search"
                    onClick={() => setSearchQuery('')}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="shop-sort">
                <label>
                  Sort by:
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="featured">
                      Featured
                    </option>
                    <option value="price-low">
                      Price: Low to High
                    </option>
                    <option value="price-high">
                      Price: High to Low
                    </option>
                    <option value="rating">
                      Best Rating
                    </option>
                    <option value="newest">
                      Newest
                    </option>
                  </select>
                  <CaretDown size={14} />
                </label>
              </div>

              <div className="shop-results-count">
                {sortedProducts.length} Products Found
              </div>
            </div>

            {/* Products Grid */}
            <div className="products-grid">
              {sortedProducts.length > 0 ? (
                // Calculate products for current page
                sortedProducts
                  .slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)
                  .map(product => (
                    <Link to={`/product/${product.id}`} key={product.id} className="product-card-shop">
                      <div className="product-image-container">
                        <img src={product.image} alt={product.name} />

                        {/* Discount Tag */}
                        {product.discount && (
                          <div className="product-badge discount">
                            {product.discount}
                          </div>
                        )}

                        {/* Status Tag */}
                        {product.isNew && (
                          <div className="product-badge new">
                            New
                          </div>
                        )}
                        {!product.isNew && product.isBestseller && (
                          <div className="product-badge bestseller">
                            Bestseller
                          </div>
                        )}

                        {/* Favorite Button */}
                        <button
                          className={`favorite-button ${favorites.includes(product.id) ? 'active' : ''}`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavorite(product.id);
                          }}
                          aria-label="Add to favorites"
                        >
                          <Heart weight={favorites.includes(product.id) ? 'fill' : 'regular'} size={20} />
                        </button>
                      </div>

                      <div className="product-info">
                        <div className="product-category">{product.category}</div>
                        <h3 className="product-name">{product.name}</h3>

                        <div className="product-rating">
                          <Star weight="fill" size={16} />
                          <span>{product.rating} ({product.reviewCount})</span>
                        </div>

                        <div className="product-price">
                          {product.oldPrice && (
                            <span className="old-price">${product.oldPrice.toFixed(2)}</span>
                          )}
                          <span className="current-price">${product.price.toFixed(2)}</span>
                        </div>

                        <button
                          className="product-button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addToCart(product);
                          }}
                          disabled={!product.isInStock}
                        >
                          {product.isInStock ? (
                            <>
                              <ShoppingCart size={18} />
                              Add to Cart
                            </>
                          ) : (
                            "Out of Stock"
                          )}
                        </button>
                      </div>
                    </Link>
                  ))
              ) : (
                <div className="no-products">
                  <p>No products match your current filters.</p>
                  <Button
                    variant="primary"
                    onClick={resetFilters}
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>

            {/* Pagination */}
            {sortedProducts.length > productsPerPage && (
              <div className="pagination">
                <button
                  className="pagination-button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                >
                  Previous
                </button>

                <div className="pagination-numbers">
                  {Array.from({ length: Math.ceil(sortedProducts.length / productsPerPage) }, (_, i) => (
                    <button
                      key={i}
                      className={`pagination-number ${currentPage === i + 1 ? 'active' : ''}`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  className="pagination-button"
                  disabled={currentPage === Math.ceil(sortedProducts.length / productsPerPage)}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(sortedProducts.length / productsPerPage)))}
                >
                  Next
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Shopping Cart Sidebar */}
      <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>
            <ShoppingBag size={22} />
            Shopping Cart
            <span className="cart-count">{cart.length}</span>
          </h2>
          <button
            className="close-cart"
            onClick={() => setIsCartOpen(false)}
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
                  <div className="item-price">${item.product.price.toFixed(2)}</div>
                </div>

                <div className="item-quantity">
                  <button
                    className="quantity-button"
                    onClick={() => updateCartQuantity(item.product.id, item.variant, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button
                    className="quantity-button"
                    onClick={() => updateCartQuantity(item.product.id, item.variant, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <div className="item-subtotal">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </div>

                <button
                  className="remove-item-button"
                  onClick={() => removeFromCart(item.product.id, item.variant)}
                >
                  <X size={16} />
                </button>
              </div>
            ))
          ) : (
            <div className="empty-cart">
              <ShoppingBag size={48} />
              <p>Your cart is empty</p>
              <Button
                variant="primary"
                onClick={() => setIsCartOpen(false)}
              >
                Continue Shopping
              </Button>
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-summary">
            <h3 className="summary-title">
              Cart Summary
            </h3>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>${cartSubtotal.toFixed(2)}</span>
            </div>

            {cartSavings > 0 && (
              <div className="summary-row savings">
                <span>Savings</span>
                <span>-${cartSavings.toFixed(2)}</span>
              </div>
            )}

            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>

            <div className="summary-total">
              <span>Total</span>
              <span>${cartSubtotal.toFixed(2)}</span>
            </div>

            <Link to="/checkout" className="checkout-button">
              Checkout
              <CreditCard size={18} />
            </Link>
          </div>
        )}
      </div>

      {/* Cart Toggle Button */}
      <button
        className={`cart-toggle ${cart.length > 0 ? 'has-items' : ''}`}
        onClick={() => setIsCartOpen(!isCartOpen)}
      >
        <ShoppingBag size={24} />
        {cart.length > 0 && (
          <span className="cart-toggle-count">{cart.length}</span>
        )}
      </button>

      {/* Cart Overlay */}
      {isCartOpen && (
        <div
          className="cart-overlay"
          onClick={() => setIsCartOpen(false)}
        ></div>
      )}

      <Footer />
    </div>
  );
};

export default Shop;