import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './product-carousel.scss';
import { carouselProducts } from '../../../data/carousel-products';
import { ArrowLeft, ArrowRight, ShoppingBag } from '@phosphor-icons/react';

export default function ProductCarousel() {
    const [activeVariant, setActiveVariant] = useState({});
    const containerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    // Initialize active variants
    React.useEffect(() => {
        const initialVariants = {};
        carouselProducts.forEach(product => {
            initialVariants[product.id] = product.variants[0];
        });
        setActiveVariant(initialVariants);
    }, []);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - containerRef.current.offsetLeft);
        setScrollLeft(containerRef.current.scrollLeft);
        containerRef.current.style.cursor = 'grabbing';
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        containerRef.current.style.cursor = 'grab';
    };

    const handleMouseLeave = () => {
        if (isDragging) {
            handleMouseUp();
        }
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - containerRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        containerRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleTouchStart = (e) => {
        setIsDragging(true);
        setStartX(e.touches[0].pageX - containerRef.current.offsetLeft);
        setScrollLeft(containerRef.current.scrollLeft);
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;
        const x = e.touches[0].pageX - containerRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        containerRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleVariantChange = (e, productId, variant) => {
        e.stopPropagation();
        setActiveVariant(prev => ({
            ...prev,
            [productId]: variant
        }));
    };

    const scrollToNext = () => {
        if (containerRef.current) {
            const cardWidth = 300 + 32; // card width + gap
            containerRef.current.scrollLeft += cardWidth;
        }
    };

    const scrollToPrev = () => {
        if (containerRef.current) {
            const cardWidth = 300 + 32; // card width + gap
            containerRef.current.scrollLeft -= cardWidth;
        }
    };

    const handleQuickBuy = (e, productId) => {
        e.stopPropagation();
        // Add quick buy logic here
        console.log('Quick buy:', productId, activeVariant[productId]);
    };

    return (
        <div className="product-carousel">
            <div 
                ref={containerRef}
                className="product-container"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleMouseUp}
            >
                {carouselProducts.map((product) => (
                    <article 
                        key={product.id}
                        className="product-card"
                        role="link"
                        tabIndex={0}
                    >
                        <div className="product-image">
                            <img 
                                src={activeVariant[product.id]?.image} 
                                alt={`${product.brand} - ${activeVariant[product.id]?.size}`}
                                draggable="false"
                            />
                            <div className="quick-buy">
                                <span className="price">{activeVariant[product.id]?.price}</span>
                                <button 
                                    className="buy-button"
                                    onClick={(e) => handleQuickBuy(e, product.id)}
                                >
                                    <ShoppingBag size={16} weight="duotone" />
                                    Acheter
                                </button>
                            </div>
                        </div>

                        <div className="product-content">
                            <div className="product-header">
                                <span className="brand">{product.brand}</span>
                                <h3>{product.name}</h3>
                            </div>

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
                        </div>
                    </article>
                ))}
            </div>

            <button 
                className="carousel-control prev" 
                onClick={scrollToPrev}
                aria-label="Previous products"
            >
                <ArrowLeft weight="bold" />
            </button>
            <button 
                className="carousel-control next" 
                onClick={scrollToNext}
                aria-label="Next products"
            >
                <ArrowRight weight="bold" />
            </button>
        </div>
    );
}