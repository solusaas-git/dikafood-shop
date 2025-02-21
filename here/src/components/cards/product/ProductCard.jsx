import React from 'react';
import { ArrowRight, ShoppingBag, Tag, MapPin } from "@phosphor-icons/react";
import './product-card.scss';
import { useBreakpoint } from '../../../hooks/useBreakpoint';

export default function ProductCard({ 
    product, 
    activeVariant,
    onVariantChange,
    className = "" 
}) {
    const { isMobile, isTablet } = useBreakpoint();
    
    return (
        <div className={`product-card ${isMobile ? 'mobile' : isTablet ? 'tablet' : ''} ${className}`}>
            {product.variants?.length > 0 && (
                <div className="variant-selector">
                    {product.variants.map((variant) => (
                        <button
                            key={variant.size}
                            className={`variant-btn ${activeVariant?.size === variant.size ? 'active' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
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
                        width={isMobile ? 160 : isTablet ? 180 : 200}
                        height={isMobile ? 160 : isTablet ? 180 : 200}
                    />
                </div>

                <div className="product-content">
                    <div className="brand-tag">
                        <MapPin weight="duotone" />
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
        </div>
    );
}
