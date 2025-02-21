import React, { useState } from 'react';
import { Carousel, CarouselSlide } from '../../../../components/ui/carousel/Carousel';
import { carouselProducts } from '../../../../data/carousel-products';
import ProductCard from '../../../../components/cards/product/ProductCard';
import './hero-carousel.scss';
import { useBreakpoint } from '../../../../hooks/useBreakpoint';

export default function HeroCarousel() {
    const { isMobile, isTablet, isLaptop } = useBreakpoint();
    const [activeVariants, setActiveVariants] = useState(() => {
        // Initialize with first variant of each product
        const variants = {};
        carouselProducts.forEach(product => {
            if (product.variants?.length > 0) {
                variants[product.id] = product.variants[0];
            }
        });
        return variants;
    });

    const shouldUseCarousel = isMobile || isTablet || isLaptop;

    const carouselOptions = {
        loop: true,
        align: 'center',
        dragFree: true,
        containScroll: 'trimSnaps',
        slidesToScroll: 1,
        breakpoints: {
            '(min-width: 1440px)': { slidesToShow: 4 },
            '(min-width: 1024px)': { slidesToShow: 3 },
            '(min-width: 768px)': { slidesToShow: 2 },
            '(max-width: 767px)': { 
                slidesToShow: 1,
                containScroll: true
            }
        }
    };

    const renderProduct = (product) => (
        <ProductCard
            key={product.id}
            product={product}
            activeVariant={activeVariants[product.id]}
            onVariantChange={(variant) => setActiveVariants(prev => ({
                ...prev,
                [product.id]: variant
            }))}
            className={isMobile ? 'mobile' : isTablet ? 'tablet' : ''}
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
        <div className={`hero-carousel ${isMobile ? 'mobile' : isTablet ? 'tablet' : ''}`}>
            <Carousel opts={carouselOptions}>
                {carouselProducts.map((product) => (
                    <CarouselSlide 
                        key={product.id} 
                        data-type="product"
                        className={isMobile ? 'mobile' : isTablet ? 'tablet' : ''}
                    >
                        {renderProduct(product)}
                    </CarouselSlide>
                ))}
            </Carousel>
        </div>
    );
} 