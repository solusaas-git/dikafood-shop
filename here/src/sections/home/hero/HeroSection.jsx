import React, { useState, useRef } from 'react';
import { ArrowDownRight } from "@phosphor-icons/react";
import { useNavigate } from 'react-router-dom';
import "./hero-section.scss";
import Button from '../../../components/buttons/Button';
import { carouselProducts } from '../../../data/carousel-products';

export default function HeroSection() {
    const [activeVariant, setActiveVariant] = useState({});
    const navigate = useNavigate();

    // Initialize active variants
    React.useEffect(() => {
        const initialVariants = {};
        carouselProducts.forEach(product => {
            initialVariants[product.id] = product.variants[0];
        });
        setActiveVariant(initialVariants);
    }, []);

    const scrollToForm = () => {
        const formElement = document.querySelector('#form');
        if (formElement) {
            formElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleVariantChange = (e, productId, variant) => {
        e.stopPropagation(); // Prevent card navigation when clicking variant buttons
        setActiveVariant(prev => ({
            ...prev,
            [productId]: variant
        }));
    };

    const handleCardClick = (productId) => {
        navigate(`/boutique/${productId}`);
    };

    return (
        <section className="hero-section">
            {/* Background with overlay */}
            <div className="background-overlay">
                <div className="overlay-gradient" />
                <div className="overlay-vignette" />
            </div>

            {/* Main content container */}
            <div className="hero-container">
                <div className="content-wrapper">
                    {/* Hero text content */}
                    <div className="hero-content">
                        <h1>
                            L'excellence alimentaire
                            <span className="highlight"> marocaine </span>
                            à votre porte
                        </h1>
                        <div className="cta-wrapper">
                            <Button
                                icon={<ArrowDownRight size={24} weight="duotone" />}
                                name="Télécharger le catalogue"
                                theme="primary"
                                onClick={scrollToForm}
                            />
                        </div>
                    </div>

                    {/* Product showcase */}
                    <div className="product-showcase">
                        <div className="product-grid">
                            {/* Original cards */}
                            {carouselProducts.map((product) => (
                                <article 
                                    key={product.id}
                                    className="product-card"
                                    onClick={() => handleCardClick(product.id)}
                                    role="link"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            handleCardClick(product.id);
                                        }
                                    }}
                                >
                                    <div className="product-image">
                                        <img 
                                            src={activeVariant[product.id]?.image} 
                                            alt={`${product.brand} - ${activeVariant[product.id]?.size}`}
                                            draggable="false"
                                        />
                                        {product.variants.length > 1 && (
                                            <div className="variant-selector" role="group" aria-label="Product variants">
                                                {product.variants.map((variant) => (
                                                    <button
                                                        key={variant.size}
                                                        className={activeVariant[product.id]?.size === variant.size ? 'active' : ''}
                                                        onClick={(e) => handleVariantChange(e, product.id, variant)}
                                                        aria-pressed={activeVariant[product.id]?.size === variant.size}
                                                    >
                                                        {variant.size}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                        <div className="quick-buy">
                                            <span className="price">{activeVariant[product.id]?.price}</span>
                                            <span className="buy-hint">Cliquez pour voir le produit</span>
                                        </div>
                                    </div>

                                    <div className="product-content">
                                        <div className="product-header">
                                            <span className="brand">{product.brand}</span>
                                            <h3>{product.name}</h3>
                                        </div>
                                    </div>
                                </article>
                            ))}
                            
                            {/* Duplicated cards for seamless loop */}
                            {carouselProducts.map((product) => (
                                <article 
                                    key={`${product.id}-duplicate`}
                                    className="product-card"
                                    onClick={() => handleCardClick(product.id)}
                                    role="link"
                                    tabIndex={-1} // Duplicates shouldn't be focusable
                                >
                                    <div className="product-image">
                                        <img 
                                            src={activeVariant[product.id]?.image} 
                                            alt={`${product.brand} - ${activeVariant[product.id]?.size}`}
                                            draggable="false"
                                        />
                                        {product.variants.length > 1 && (
                                            <div className="variant-selector" role="group" aria-label="Product variants">
                                                {product.variants.map((variant) => (
                                                    <button
                                                        key={variant.size}
                                                        className={activeVariant[product.id]?.size === variant.size ? 'active' : ''}
                                                        onClick={(e) => handleVariantChange(e, product.id, variant)}
                                                        aria-pressed={activeVariant[product.id]?.size === variant.size}
                                                    >
                                                        {variant.size}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                        <div className="quick-buy">
                                            <span className="price">{activeVariant[product.id]?.price}</span>
                                            <span className="buy-hint">Cliquez pour voir le produit</span>
                                        </div>
                                    </div>

                                    <div className="product-content">
                                        <div className="product-header">
                                            <span className="brand">{product.brand}</span>
                                            <h3>{product.name}</h3>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}