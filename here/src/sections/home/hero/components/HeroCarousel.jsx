import React, { useState, useEffect } from 'react';
import ProductCard from '../../../../components/cards/product/ProductCard';
import { carouselProducts } from '../../../../data/carousel-products';
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import './hero-carousel.scss';

export default function HeroCarousel() {
    const [activeVariants, setActiveVariants] = useState({});
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);

    // Initialize with first variant of each product
    useEffect(() => {
        const initialVariants = {};
        carouselProducts.forEach(product => {
            if (product.variants && product.variants.length > 0) {
                initialVariants[product.id] = product.variants[0];
            }
        });
        setActiveVariants(initialVariants);

        // Add window resize listener
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 480);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleVariantChange = (productId, variant) => {
        setActiveVariants(prev => ({
            ...prev,
            [productId]: variant
        }));
    };

    const renderProduct = (product) => (
        <ProductCard
            product={product}
            activeVariant={activeVariants[product.id]}
            onVariantChange={(variant) => handleVariantChange(product.id, variant)}
            className={isMobile ? 'product-card-mobile' : ''}
        />
    );

    return (
        <div className={`hero-carousel ${isMobile ? 'mobile-carousel' : ''}`}>
            <div className="carousel-track">
                {carouselProducts.map((product) => (
                    <div key={product.id} className="carousel-item">
                        {renderProduct(product)}
                    </div>
                ))}
            </div>

            <div className="carousel-controls">
                <button className="carousel-control prev" aria-label="Previous">
                    <CaretLeft weight="bold" />
                </button>
                <button className="carousel-control next" aria-label="Next">
                    <CaretRight weight="bold" />
                </button>
            </div>
        </div>
    );
} 