import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { isMobile, isTablet } from 'react-device-detect';
import { ArrowLeft, House, CaretRight, ShoppingCart } from '@phosphor-icons/react';
import { useWindowScroll } from 'react-use';
import './ProductBreadcrumb.scss';

const ProductBreadcrumb = ({ product, categories }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { y } = useWindowScroll();

  useEffect(() => {
    // Set scrolled state when scrolled past 20px
    setIsScrolled(y > 20);
  }, [y]);

  // Set CSS variable for breadcrumb height for spacing in product page
  useEffect(() => {
    const breadcrumbHeight = isMobile ? '48px' : '56px';
    document.documentElement.style.setProperty('--breadcrumb-height', breadcrumbHeight);

    // Apply body padding when component mounts to account for fixed header
    document.body.classList.add('has-product-breadcrumb');

    return () => {
      document.documentElement.style.removeProperty('--breadcrumb-height');
      document.body.classList.remove('has-product-breadcrumb');
    };
  }, []);

  // Get formatted product name based on device
  const getFormattedName = (name) => {
    if (!name) return '';

    // More conservative truncation for better readability
    if (isMobile) {
      return name.length > 25 ? `${name.substring(0, 22)}...` : name;
    } else if (isTablet) {
      return name.length > 35 ? `${name.substring(0, 32)}...` : name;
    }

    return name.length > 50 ? `${name.substring(0, 47)}...` : name;
  };

  // Render breadcrumbs based on device
  const renderBreadcrumbs = () => {
    const isSmallScreen = isMobile || isTablet;
    const iconSize = isSmallScreen ? 18 : 20;
    const separatorSize = isSmallScreen ? 14 : 16;

    if (isSmallScreen) {
      return (
        <div className="breadcrumb-content mobile">
          <Link to="/shop" className="breadcrumb-link back-link">
            <ArrowLeft size={iconSize} weight="duotone" />
            <span className="breadcrumb-text">Back to Shop</span>
          </Link>
        </div>
      );
    }

    return (
      <div className="breadcrumb-content desktop">
        <div className="breadcrumb-links">
          <Link to="/" className="breadcrumb-link home-link">
            <House size={iconSize} weight="duotone" />
            <span className="breadcrumb-text">Home</span>
          </Link>

          <span className="breadcrumb-separator">
            <CaretRight size={separatorSize} weight="duotone" />
          </span>

          <Link to="/shop" className="breadcrumb-link shop-link">
            <ShoppingCart size={iconSize - 2} weight="duotone" />
            <span className="breadcrumb-text">Shop</span>
          </Link>

          {categories && categories.length > 0 && (
            <>
              <span className="breadcrumb-separator">
                <CaretRight size={separatorSize} weight="duotone" />
              </span>

              <Link
                to={`/shop?category=${categories[0].id}`}
                className="breadcrumb-link category-link"
              >
                <span className="breadcrumb-text">{categories[0].name}</span>
              </Link>
            </>
          )}

          <span className="breadcrumb-separator">
            <CaretRight size={separatorSize} weight="duotone" />
          </span>
        </div>

        <div className="breadcrumb-product-title">
          <span className="breadcrumb-current">{getFormattedName(product?.name)}</span>
        </div>
      </div>
    );
  };

  return (
    <nav
      className={`product-breadcrumb ${isScrolled ? 'scrolled' : ''}`}
      aria-label="Product Navigation"
    >
      <div className="breadcrumb-container">
        {renderBreadcrumbs()}
      </div>
    </nav>
  );
};

export default ProductBreadcrumb;