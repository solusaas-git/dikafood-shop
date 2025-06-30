import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Tag, Star, ShoppingCartSimple, CaretRight } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

// Import stylesheet
import './ProductCardsShowcase.scss';

// Import actual product card components
import ProductCard from '../../components/product/card/ProductCard';
import ProductCardSkeleton, { ProductCardSkeletonGrid } from '../../components/product/card/ProductCardSkeleton';
import RecommendedProductCard from '../../components/product/card/RecommendedProductCard';
import RecommendedProductCardSkeleton, { RecommendedProductCardSkeletonGrid } from '../../components/product/card/RecommendedProductCardSkeleton';

// Import mockup product data or create sample data
const SAMPLE_PRODUCTS = [
  {
    id: '1',
    name: 'Huile d\'Olive Extra Vierge',
    brand: 'DikaFood',
    price: 129.99,
    rating: 4.5,
    reviewCount: 42,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    isBestseller: true,
    isNew: false,
    variants: [
      {
        id: 'v1',
        name: '500ml',
        price: 129.99,
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      }
    ]
  },
  {
    id: '2',
    name: 'Huile d\'Argan Pure',
    brand: 'DikaFood',
    price: 189.99,
    rating: 5,
    reviewCount: 28,
    image: 'https://images.unsplash.com/photo-1594639951893-ed1a68b88d81?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    isBestseller: false,
    isNew: true,
    variants: [
      {
        id: 'v2',
        name: '250ml',
        price: 189.99,
        discountPrice: 149.99,
        image: 'https://images.unsplash.com/photo-1594639951893-ed1a68b88d81?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      }
    ]
  },
  {
    id: '3',
    name: 'Miel de Thym Sauvage',
    brand: 'DikaFood',
    price: 99.99,
    rating: 4,
    reviewCount: 16,
    image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    isBestseller: false,
    isNew: false,
    variants: [
      {
        id: 'v3',
        name: '350g',
        price: 99.99,
        image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      }
    ]
  }
];

// Featured product with discount
const FEATURED_PRODUCT = {
  id: '4',
  name: 'Pack Assortiment de Miels',
  brand: 'DikaFood Collection',
  price: 279.99,
  rating: 4.8,
  reviewCount: 37,
  image: 'https://images.unsplash.com/photo-1612200957700-13c3e87d8b4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  isBestseller: true,
  isNew: true,
  variants: [
    {
      id: 'v4',
      name: 'Pack Découverte (3x250g)',
      price: 279.99,
      discountPrice: 249.99,
      image: 'https://images.unsplash.com/photo-1612200957700-13c3e87d8b4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    }
  ]
};

// Limited edition product
const LIMITED_PRODUCT = {
  id: '5',
  name: 'Huile de Nigelle Édition Limitée',
  brand: 'DikaFood Premium',
  price: 219.99,
  rating: 4.9,
  reviewCount: 12,
  image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  isBestseller: false,
  isNew: true,
  isLimited: true,
  variants: [
    {
      id: 'v5',
      name: 'Flacon Artisanal 200ml',
      price: 219.99,
      image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    }
  ]
};

// Shop.jsx style product card component
const ShopProductCard = ({ product }) => {
  const defaultVariant = product.variants[0];
  const hasDiscount = product.variants.some(v => v.discountPrice);

  return (
    <div className="product-card no-shadow">
      <div className="product-image">
        <img src={defaultVariant.image} alt={product.name} />
        <div className="product-badges">
          {product.isBestseller && (
            <span className="product-badge bestseller">
              <Star size={12} weight="fill" />
              Bestseller
            </span>
          )}
          {product.isNew && (
            <span className="product-badge new">
              <Tag size={12} weight="fill" />
              Nouveau
            </span>
          )}
          {product.isLimited && (
            <span className="product-badge limited">
              <Tag size={12} weight="fill" />
              Édition Limitée
            </span>
          )}
          {hasDiscount && (
            <span className="product-badge discount">
              <Tag size={12} weight="fill" />
              Promo
            </span>
          )}
        </div>
      </div>
      <div className="product-info">
        <h3 className="product-title">
          <Link to={`/product/${product.id}`}>{product.brand} {product.name}</Link>
        </h3>
        <div className="product-rating">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              weight="duotone"
              className={i < Math.floor(product.rating) ? "star-filled duotone" : "star-empty duotone"}
              size={14}
            />
          ))}
          <span className="rating-count">({product.reviewCount})</span>
        </div>
        <div className="product-price-tag">
          <Tag size={16} weight="duotone" />
          <span className="current-price">
            {defaultVariant.discountPrice
              ? `${defaultVariant.discountPrice.toFixed(2)} Dh`
              : `${defaultVariant.price.toFixed(2)} Dh`}
          </span>
          {defaultVariant.discountPrice && (
            <span className="old-price">{defaultVariant.price.toFixed(2)} Dh</span>
          )}
        </div>
        <div className="product-actions">
          <button
            className="add-to-cart-btn"
            aria-label={`Ajouter ${product.name} au panier`}
          >
            <ShoppingCartSimple size={16} weight="duotone" />
            Ajouter au panier
          </button>
          <Link
            to={`/product/${product.id}`}
            className="view-product-btn"
            aria-label={`Voir détails de ${product.name}`}
          >
            <CaretRight size={16} weight="duotone" />
          </Link>
        </div>
      </div>
    </div>
  );
};

// Main showcase component
const ProductCardsShowcase = () => {
  const [activeTab, setActiveTab] = useState('homepage');

  return (
    <div className="showcase-container">
      <Helmet>
        <title>Product Cards Showcase - DikaFood</title>
      </Helmet>

      <div className="showcase-header">
        <h1>Product Card Components Showcase</h1>
        <p>Organized by use case throughout the DikaFood website</p>
      </div>

      <div className="showcase-tabs">
        <button
          className={`tab-button ${activeTab === 'homepage' ? 'active' : ''}`}
          onClick={() => setActiveTab('homepage')}
        >
          Homepage
        </button>
        <button
          className={`tab-button ${activeTab === 'category' ? 'active' : ''}`}
          onClick={() => setActiveTab('category')}
        >
          Category Pages
        </button>
        <button
          className={`tab-button ${activeTab === 'product' ? 'active' : ''}`}
          onClick={() => setActiveTab('product')}
        >
          Product Detail
        </button>
        <button
          className={`tab-button ${activeTab === 'loading' ? 'active' : ''}`}
          onClick={() => setActiveTab('loading')}
        >
          Loading States
        </button>
      </div>

      <div className="showcase-content">
        {activeTab === 'homepage' && (
          <div className="card-showcase-section">
            <h2>Homepage Product Displays</h2>
            <p>These cards are used on the homepage for featured products, collections, and promotions.</p>

            <h3>Featured Products Carousel</h3>
            <div className="use-case-description">
              <p>Simple, clean cards used in the featured products carousel section on the homepage.</p>
            </div>
            <div className="product-card-grid">
              {SAMPLE_PRODUCTS.slice(0, 2).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <h3>Hero Section Featured Product</h3>
            <div className="use-case-description">
              <p>Prominent product display with promotional badge for the hero section.</p>
            </div>
            <div className="product-card-grid">
              <ProductCard product={FEATURED_PRODUCT} className="featured" />
            </div>

            <h3>Limited Edition Collection</h3>
            <div className="use-case-description">
              <p>Special formatting for limited edition or exclusive products.</p>
            </div>
            <div className="product-card-grid">
              <ShopProductCard product={LIMITED_PRODUCT} />
            </div>

            <div className="component-code">
              <h3>Component Usage</h3>
              <pre>{`
// Featured Products Section
<section className="featured-products">
  <SectionHeader title="Nos produits vedettes" />
  <div className="products-carousel">
    {featuredProducts.map(product => (
      <ProductCard key={product.id} product={product} />
    ))}
  </div>
</section>

// Limited Edition Section
<section className="limited-editions">
  <SectionHeader title="Éditions limitées" />
  <div className="products-grid">
    {limitedProducts.map(product => (
      <ShopProductCard key={product.id} product={product} />
    ))}
  </div>
</section>
              `}</pre>
            </div>
          </div>
        )}

        {activeTab === 'category' && (
          <div className="card-showcase-section">
            <h2>Category & Shop Page Cards</h2>
            <p>These cards are used on category pages and in the main shop section.</p>

            <h3>Standard Shop Product Cards</h3>
            <div className="use-case-description">
              <p>The main product card design used in the shop grid with quick add-to-cart functionality.</p>
            </div>
            <div className="product-card-grid shop-grid">
              {SAMPLE_PRODUCTS.map(product => (
                <ShopProductCard key={product.id} product={product} />
              ))}
            </div>

            <h3>Promotional Product Card</h3>
            <div className="use-case-description">
              <p>Products with discounts shown in the shop grid.</p>
            </div>
            <div className="product-card-grid shop-grid">
              <ShopProductCard product={FEATURED_PRODUCT} />
            </div>

            <div className="component-code">
              <h3>Component Usage</h3>
              <pre>{`
// Shop Page
<div className="product-grid">
  {paginatedProducts.map((product) => (
    <div className="product-card" key={product.id}>
      {/* Product card implementation */}
      <div className="product-image">
        <img src={image} alt={name} />
        <div className="product-badges">
          {/* Badges implementation */}
        </div>
      </div>
      <div className="product-info">
        {/* Product info implementation */}
        <div className="product-actions">
          <button className="add-to-cart-btn">
            <ShoppingCartSimple size={16} weight="duotone" />
            Ajouter au panier
          </button>
          <Link to={'/product/id'} className="view-product-btn">
            <CaretRight size={16} weight="duotone" />
          </Link>
        </div>
      </div>
    </div>
  ))}
</div>
              `}</pre>
            </div>
          </div>
        )}

        {activeTab === 'product' && (
          <div className="card-showcase-section">
            <h2>Product Detail Page Cards</h2>
            <p>Cards used within product detail pages for displaying related or recommended products.</p>

            <h3>Recommended Products</h3>
            <div className="use-case-description">
              <p>Simplified cards used in the "You might also like" section on product detail pages.</p>
            </div>
            <div className="product-card-grid">
              {SAMPLE_PRODUCTS.map(product => (
                <RecommendedProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="component-code">
              <h3>Component Usage</h3>
              <pre>{`
// Product Detail Page - Recommended Products Section
<section className="recommended-products">
  <h2>Vous aimerez aussi</h2>
  <div className="recommended-products-grid">
    {recommendedProducts.map(product => (
      <RecommendedProductCard
        key={product.id}
        product={product}
      />
    ))}
  </div>
</section>
              `}</pre>
            </div>
          </div>
        )}

        {activeTab === 'loading' && (
          <div className="card-showcase-section">
            <h2>Loading States</h2>
            <p>Loading skeleton states for different product card types.</p>

            <h3>Shop Page Loading State</h3>
            <div className="use-case-description">
              <p>Skeleton loaders displayed while product data is loading in the shop grid.</p>
            </div>
            <ProductCardSkeletonGrid count={3} />

            <h3>Recommended Products Loading State</h3>
            <div className="use-case-description">
              <p>Skeleton loaders for the recommended products section on product detail pages.</p>
            </div>
            <RecommendedProductCardSkeletonGrid count={3} />

            <div className="component-code">
              <h3>Component Usage</h3>
              <pre>{`
// Shop Page Loading State
{isLoading ? (
  <ProductCardSkeletonGrid count={8} />
) : (
  <div className="product-grid">
    {products.map(product => (
      <ShopProductCard key={product.id} product={product} />
    ))}
  </div>
)}

// Product Detail Page - Recommended Products Loading
{isLoadingRecommendations ? (
  <RecommendedProductCardSkeletonGrid count={4} />
) : (
  <div className="recommended-products-grid">
    {recommendedProducts.map(product => (
      <RecommendedProductCard key={product.id} product={product} />
    ))}
  </div>
)}
              `}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCardsShowcase;