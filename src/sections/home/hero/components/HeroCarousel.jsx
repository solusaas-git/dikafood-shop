import React, { useState } from 'react';
import { Carousel, CarouselSlide } from '../../../../components/ui/carousel/Carousel';
import { products } from '../../../../data/products';
import ProductCard from '../../../../components/cards/product/ProductCard';
import './hero-carousel.scss';
import { useBreakpoint } from '../../../../hooks/useBreakpoint';
import { ArrowRight } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

export default function HeroCarousel() {
    const { isMobile, isTablet, isLaptop } = useBreakpoint();
    const [activeVariants, setActiveVariants] = useState(() => {
        // Initialize with first variant of each product
        const variants = {};
        products.forEach(product => {
            if (product.variants?.length > 0) {
                variants[product.id] = product.variants[0];
            }
        });
        return variants;
    });

    const carouselOptions = {
        loop: true,
        align: 'center',
        dragFree: true,
        containScroll: 'trimSnaps',
        slidesToScroll: 1,
        breakpoints: {
            '(min-width: 1200px)': { slidesToShow: 4 },
            '(min-width: 992px)': { slidesToShow: 3 },
            '(min-width: 768px)': { slidesToShow: 2.5 },
            '(min-width: 576px)': { slidesToShow: 2 },
            '(max-width: 575px)': {
                slidesToShow: 1.2,
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

    return (
        <div className={`hero-carousel ${isMobile ? 'mobile' : isTablet ? 'tablet' : ''}`}>
            <Carousel opts={carouselOptions}>
                {products.map((product) => (
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