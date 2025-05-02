import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Waves, Tag, MapPin, Drop, Sun, Leaf, SunHorizon } from "@phosphor-icons/react";
import './product-card.scss';
import { useBreakpoint } from '../../../hooks/useBreakpoint';

export default function ProductCard({
    product,
    activeVariant,
    onVariantChange,
    className = ""
}) {
    const { isMobile, isTablet } = useBreakpoint();

    // Function to get the appropriate icon based on brand
    const getBrandIcon = (brand) => {
        switch(brand.toLowerCase()) {
            case 'dika':
                return <Drop weight="duotone" />;
            case 'oued fès':
            case 'oued fes':
                return <Waves weight="duotone" />; // Using MapPin for river (no River icon in Phosphor)
            case 'nouarati':
                return <Sun weight="duotone" />;
            case 'chourouk':
                return <SunHorizon weight="duotone" />; // Using Sun for sunset (no Sunset icon in Phosphor)
            case 'biladi':
                return <Leaf weight="duotone" />;
            default:
                return <MapPin weight="duotone" />;
        }
    };

    return (
        <Link to={`/product/${product.id}`} className={`product-card ${isMobile ? 'mobile' : isTablet ? 'tablet' : ''} ${className}`}>
            {product.variants?.length > 0 && (
                <div className="variant-selector">
                    {product.variants.map((variant) => (
                        <button
                            key={variant.size}
                            className={`variant-btn ${activeVariant?.size === variant.size ? 'active' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                onVariantChange(variant);
                            }}
                        >
                            {variant.size}
                        </button>
                    ))}
                </div>
            )}

            <div className="card-body">
                <div className="product-image">
                    <img
                        src={activeVariant?.image || product.image}
                        alt={`${product.brand} - ${activeVariant?.size || 'Product'}`}
                    />
                </div>

                <div className="product-content">
                    <div className="brand-tag">
                        {getBrandIcon(product.brand)}
                        {product.brand}
                    </div>
                    <h3 className="product-name">{product.name}</h3>
                </div>
            </div>

            <div className="product-footer">
                <div className="price-tag">
                    <Tag weight="duotone" />
                    <span className="amount">{activeVariant?.price || product.price}</span>
                    <span className="currency">MAD</span>
                </div>
                <ArrowRight className="arrow-icon" weight="bold" />
            </div>
        </Link>
    );
}
