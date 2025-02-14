import React, { useState, useRef, useEffect } from 'react';
import { ArrowDownRight, CaretLeft, CaretRight } from "@phosphor-icons/react";
import { useTranslation } from 'react-i18next';
import "./hero-section.scss";
import Button from '../../../components/buttons/Button';
import ProductCard from '../../../components/cards/product/ProductCard';
import { carouselProducts } from '../../../data/carousel-products';

export default function HeroSection() {
    const { t } = useTranslation();
    const [activeVariant, setActiveVariant] = useState({});
    const [isAtStart, setIsAtStart] = useState(true);
    const [isAtEnd, setIsAtEnd] = useState(false);
    const trackRef = useRef(null);

    // Initialize active variants
    useEffect(() => {
        const initialVariants = {};
        carouselProducts.forEach(product => {
            initialVariants[product.id] = product.variants[0];
        });
        setActiveVariant(initialVariants);
    }, []);

    const checkScrollPosition = () => {
        if (trackRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
            setIsAtStart(scrollLeft <= 0);
            setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 10);
        }
    };

    useEffect(() => {
        checkScrollPosition();
        const track = trackRef.current;
        if (track) {
            track.addEventListener('scroll', checkScrollPosition);
            window.addEventListener('resize', checkScrollPosition);
        }
        return () => {
            if (track) {
                track.removeEventListener('scroll', checkScrollPosition);
                window.removeEventListener('resize', checkScrollPosition);
            }
        };
    }, []);

    const scrollToPrev = () => {
        if (trackRef.current) {
            const cardWidth = trackRef.current.offsetWidth;
            trackRef.current.scrollBy({
                left: -cardWidth,
                behavior: 'smooth'
            });
        }
    };

    const scrollToNext = () => {
        if (trackRef.current) {
            const cardWidth = trackRef.current.offsetWidth;
            trackRef.current.scrollBy({
                left: cardWidth,
                behavior: 'smooth'
            });
        }
    };

    const scrollToForm = () => {
        const formElement = document.querySelector('#form');
        if (formElement) {
            formElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleVariantChange = (productId, variant) => {
        setActiveVariant(prev => ({
            ...prev,
            [productId]: variant
        }));
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
                            {t('hero.title.part1')}
                            <span className="highlight">{t('hero.title.highlight')}</span>
                            {t('hero.title.part2')}
                        </h1>
                        <div className="cta-wrapper">
                            <Button
                                icon={<ArrowDownRight size={24} weight="duotone" />}
                                name={t('hero.cta')}
                                theme="primary"
                                onClick={scrollToForm}
                            />
                        </div>
                    </div>

                    {/* Product showcase */}
                    <div className="product-showcase">
                        <div 
                            ref={trackRef}
                            className="product-track"
                        >
                            {carouselProducts.map((product) => (
                                <div 
                                    key={product.id}
                                    className="product-slide"
                                >
                                    <ProductCard
                                        product={product}
                                        activeVariant={activeVariant[product.id]}
                                        onVariantChange={handleVariantChange}
                                    />
                                </div>
                            ))}
                        </div>

                        <button 
                            className={`carousel-control prev ${isAtStart ? 'hidden' : ''}`}
                            onClick={scrollToPrev}
                            aria-label={t('common.previous')}
                        >
                            <CaretLeft weight="bold" />
                        </button>
                        <button 
                            className={`carousel-control next ${isAtEnd ? 'hidden' : ''}`}
                            onClick={scrollToNext}
                            aria-label={t('common.next')}
                        >
                            <CaretRight weight="bold" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}