import React from 'react';
import { Link } from 'react-router-dom';
import { House, CaretRight } from '@phosphor-icons/react';
import './ProductBreadcrumb.scss';

const ProductBreadcrumb = ({ product }) => {
  if (!product) return null;

  const { category, name } = product;

  return (
    <div className="product-breadcrumbs">
      <div className="breadcrumb-content">
        <Link to="/" className="breadcrumb-link">
          <House size={16} weight="duotone" style={{ marginRight: "5px" }} />
          Home
        </Link>
        <span className="breadcrumb-separator"><CaretRight size={12} /></span>
        <Link to="/shop" className="breadcrumb-link">
          Shop
        </Link>
        {category && (
          <>
            <span className="breadcrumb-separator"><CaretRight size={12} /></span>
            <Link
              to={`/shop?category=${category.id}`}
              className="breadcrumb-link"
            >
              {category.name}
            </Link>
          </>
        )}
        <span className="breadcrumb-separator"><CaretRight size={12} /></span>
        <span className="breadcrumb-current">{name}</span>
      </div>
    </div>
  );
};

export default ProductBreadcrumb;