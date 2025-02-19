import React, { useState, useEffect } from 'react';
import { Carousel, CarouselSlide } from '../../../../components/ui/carousel/Carousel';
import { carouselProducts } from '../../../../data/carousel-products';
import ProductCard from '../../../../components/cards/product/ProductCard';
import './hero-carousel.scss';

const EMBLA_OPTIONS = {
    align: "center",
    loop: true,
    dragFree: false,
    containScroll: false,
    slidesToScroll: 1
};

// Calculate minimum width needed for grid layout
// Card width (220px) + gap (24px) * number of cards
const MIN_GRID_WIDTH = (220 + 24) * carouselProducts.length - 24; // Subtract last gap

export default function HeroCarousel({ isMobile }) {
    const [shouldUseCarousel, setShouldUseCarousel] = useState(false);
    const [activeVariants, setActiveVariants] = useState({});

    useEffect(() => {
        // Initialize with first variant of each product
        const initialVariants = {};
        carouselProducts.forEach(product => {
            if (product.variants && product.variants.length > 0) {
                initialVariants[product.id] = product.variants[0];
            }
        });
        setActiveVariants(initialVariants);

        const checkWidth = () => {
            const viewportWidth = window.innerWidth;
            const containerWidth = document.querySelector('.hero-container')?.clientWidth || viewportWidth;
            setShouldUseCarousel(containerWidth < MIN_GRID_WIDTH);
        };

        checkWidth();
        window.addEventListener('resize', checkWidth);
        return () => window.removeEventListener('resize', checkWidth);
    }, []);

    const handleVariantChange = (productId, variant) => {
        setActiveVariants(prev => ({
            ...prev,
            [productId]: variant
        }));
    };

    const renderProduct = (product) => (
        <ProductCard
            key={product.id}
            product={product}
            activeVariant={activeVariants[product.id]}
            onVariantChange={(variant) => handleVariantChange(product.id, variant)}
            className={isMobile ? 'mobile' : ''}
        />
    );

    if (!shouldUseCarousel) {
        return (
            <div className="hero-carousel">
                <div className="products-grid">
                    {carouselProducts.map(renderProduct)}
                </div>
            </div>
        );
    }

    return (
        <div className={`hero-carousel ${isMobile ? 'mobile' : ''}`}>
            <Carousel 
                className="products-carousel"
                opts={EMBLA_OPTIONS}
                showControls={true}
            >
                {carouselProducts.map((product) => (
                    <CarouselSlide key={product.id}>
                        {renderProduct(product)}
                    </CarouselSlide>
                ))}
            </Carousel>
        </div>
    );
} 