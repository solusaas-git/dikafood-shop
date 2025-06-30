import React, { useState, useRef } from 'react';
import { Carousel, CarouselSlide } from '../../../../components/ui/carousel/Carousel';
import { products } from '../../../../data/products';
import ProductCard from '../../../../components/cards/product/ProductCard';
import './hero-carousel.scss';
import { useBreakpoint } from '../../../../hooks/useBreakpoint';

// Desktop carousel options
const DESKTOP_OPTIONS = {
    align: "center",
    loop: true,
    dragFree: false,
    containScroll: false,
    slidesToScroll: 1,
    speed: 15,
    skipSnaps: false
};

// Tablet carousel options
const TABLET_OPTIONS = {
    align: "center",
    loop: true,
    dragFree: false,
    containScroll: true,
    slidesToScroll: 1,
    speed: 12,
    skipSnaps: false
};

// Mobile carousel options (more controlled for better mobile experience)
const MOBILE_OPTIONS = {
    align: "center",
    loop: true,
    dragFree: false,
    containScroll: true,
    slidesToScroll: 1,
    speed: 10,
    skipSnaps: false
};

export default function HeroCarousel() {
    const { isMobile, isTablet } = useBreakpoint();
    const containerRef = useRef(null);

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

    const handleVariantChange = (product, variant) => {
        setActiveVariants(prev => ({
            ...prev,
            [product.id]: variant
        }));
    };

    const renderProduct = (product, viewportType) => (
        <div className={`product-slide ${viewportType}`}>
            <ProductCard
                product={product}
                activeVariant={activeVariants[product.id]}
                onVariantChange={(variant) => handleVariantChange(product, variant)}
                className={viewportType}
            />
        </div>
    );

    // Render a mobile-specific carousel
    if (isMobile) {
        return (
            <div className="hero-carousel mobile">
                <div className="mobile-carousel-wrapper">
                    <Carousel
                        className="mobile-products-carousel"
                        opts={MOBILE_OPTIONS}
                        showControls={true}
                        disableTransform={true}
                    >
                        {products.map((product) => (
                            <CarouselSlide
                                key={product.id}
                                data-type="product"
                                className="mobile"
                            >
                                {renderProduct(product, 'mobile')}
                            </CarouselSlide>
                        ))}
                    </Carousel>
                </div>
            </div>
        );
    }

    // Render tablet-specific carousel
    if (isTablet) {
        return (
            <div className="hero-carousel tablet">
                <div className="tablet-carousel-wrapper">
                    <Carousel
                        className="tablet-products-carousel"
                        opts={TABLET_OPTIONS}
                        showControls={true}
                        disableTransform={true}
                    >
                        {products.map((product) => (
                            <CarouselSlide
                                key={product.id}
                                data-type="product"
                                className="tablet"
                            >
                                {renderProduct(product, 'tablet')}
                            </CarouselSlide>
                        ))}
                    </Carousel>
                </div>
            </div>
        );
    }

    // Render desktop carousel
    return (
        <div
            className="hero-carousel desktop"
            ref={containerRef}
        >
            <Carousel
                className="products-carousel"
                opts={DESKTOP_OPTIONS}
                showControls={true}
                disableTransform={true}
            >
                {products.map((product) => (
                    <CarouselSlide
                        key={product.id}
                        data-type="product"
                        className="desktop"
                    >
                        {renderProduct(product, 'desktop')}
                    </CarouselSlide>
                ))}
            </Carousel>
        </div>
    );
}