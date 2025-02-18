import React from 'react';
import { ArrowRight, ShoppingBag } from "@phosphor-icons/react";
import './product-card.scss';

export default function ProductCard({ product, activeVariant, onVariantChange }) {
    return (
        <div className="product-card">
            <div className="product-image">
                <img 
                    src={activeVariant?.image || product.image} 
                    alt={`${product.brand} - ${activeVariant?.size || 'Product'}`}
                />
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
            </div>

            <div className="product-content">
                <div className="brand-tag">
                    <ShoppingBag weight="duotone" />
                    {product.brand}
                </div>
                <h3 className="product-name">{product.name}</h3>
            </div>

            <div className="product-footer">
                <div className="product-price">
                    <span>{activeVariant?.price || product.price}</span>
                </div>
                <ArrowRight className="arrow-icon" weight="bold" />
            </div>
        </div>
    );
}
