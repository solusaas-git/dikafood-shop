import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { carouselProducts } from '../../data/carousel-products';
import ProductCard from '../../components/cards/product/ProductCard';
import { MagnifyingGlass, Funnel } from '@phosphor-icons/react';
import LanguageSwitcher from '../../components/ui/language-switcher/LanguageSwitcher';
import './shop.scss';

export default function Shop() {
    const { t } = useTranslation();
    const [products, setProducts] = useState(carouselProducts);
    const [activeFilters, setActiveFilters] = useState({
        category: 'all',
        sort: 'featured'
    });

    return (
        <main className="shop-page">
            {/* Header */}
            <header className="shop-header">
                <div className="header-content">
                    <div className="header-top">
                        <h1>{t('shop.title')}</h1>
                        <LanguageSwitcher />
                    </div>
                    <p>{t('shop.subtitle')}</p>
                </div>
            </header>

            {/* Shop controls */}
            <div className="shop-controls">
                <div className="search-bar">
                    <MagnifyingGlass size={20} weight="duotone" />
                    <input 
                        type="text" 
                        placeholder={t('shop.searchPlaceholder')}
                        aria-label={t('common.search')}
                    />
                </div>
                <button className="filter-button">
                    <Funnel size={20} weight="duotone" />
                    <span>{t('common.filter')}</span>
                </button>
            </div>

            {/* Products grid */}
            <div className="products-grid">
                {products.map((product) => (
                    <div key={product.id} className="product-item">
                        <ProductCard
                            product={product}
                            activeVariant={product.variants[0]}
                        />
                    </div>
                ))}
            </div>
        </main>
    );
} 