import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight, Tag, Waves, Plant, SunHorizon } from "@phosphor-icons/react";
import { brandsData } from '../../../data/brands';
import "./product-card.scss";

const brandIcons = {
    'Oued Fès': Waves,
    'Biladi': Plant,
    'Chourouk': SunHorizon,
    'Nouarati': SunHorizon,
    'Dika': SunHorizon,
    'Dika Extra Vièrge': SunHorizon
};

const ProductCard = memo(({ product, activeVariant, onVariantChange }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/boutique/${product.id}`);
    };

    const handleVariantClick = (e, variant) => {
        e.stopPropagation();
        onVariantChange(product.id, variant);
    };

    const BrandIcon = brandIcons[product.brand] || SunHorizon;

    return (
        <div className="product-card" onClick={handleCardClick}>
            <div className="img-product">
                <img 
                    src={activeVariant?.image} 
                    alt={t('product.imageAlt', { brand: product.brand, size: activeVariant?.size })}
                    draggable="false"
                />
                {product.variants.length > 1 && (
                    <div className="variant-selector">
                        {product.variants.map((variant) => (
                            <button
                                key={variant.size}
                                className={`variant-btn ${activeVariant?.size === variant.size ? 'active' : ''}`}
                                onClick={(e) => handleVariantClick(e, variant)}
                                title={t('product.variantTitle', { size: variant.size })}
                            >
                                {variant.size}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <div className="product-card-content">
                <h3 className="product-name">{product.name}</h3>
                <span className="brand-tag">
                    <BrandIcon size={16} weight="duotone" />
                    {t(`brands.${product.brand.toLowerCase()}`)}
                </span>
            </div>
            <div className="product-link">
                <div className="product-price">
                    <Tag size={20} weight="duotone" />
                    <span className="price-text">{activeVariant?.price}</span>
                </div>
                <ArrowUpRight size={20} weight="duotone" />
            </div>
        </div>
    );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
