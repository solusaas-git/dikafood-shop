import React, { useRef, useState, useEffect } from 'react';
import { Buildings, CaretLeft, CaretRight } from "@phosphor-icons/react";
import { brandsData } from '../../../data/brands';
import SectionHeader from '../../../components/ui/section/SectionHeader';
import BrandTooltip from '../../../components/ui/tooltip/BrandTooltip';
import './brands.scss';

export default function Brands() {
    const carouselRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [isAtStart, setIsAtStart] = useState(true);
    const [isAtEnd, setIsAtEnd] = useState(false);
    const [tooltipData, setTooltipData] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

    const checkScrollPosition = () => {
        if (carouselRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
            setIsAtStart(scrollLeft <= 0);
            setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 10);
        }
    };

    useEffect(() => {
        checkScrollPosition();
        const carousel = carouselRef.current;
        if (carousel) {
            carousel.addEventListener('scroll', checkScrollPosition);
            window.addEventListener('resize', checkScrollPosition);
        }
        return () => {
            if (carousel) {
                carousel.removeEventListener('scroll', checkScrollPosition);
                window.removeEventListener('resize', checkScrollPosition);
            }
        };
    }, []);

    const handlePrevClick = () => {
        if (carouselRef.current) {
            const scrollAmount = -carouselRef.current.offsetWidth;
            carouselRef.current.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const handleNextClick = () => {
        if (carouselRef.current) {
            const scrollAmount = carouselRef.current.offsetWidth;
            carouselRef.current.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - carouselRef.current.offsetLeft);
        setScrollLeft(carouselRef.current.scrollLeft);
        carouselRef.current.style.cursor = 'grabbing';
        // Hide tooltip when starting to drag
        setTooltipData(null);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - carouselRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        carouselRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        if (carouselRef.current) {
            carouselRef.current.style.cursor = 'grab';
        }
    };

    const handleTouchStart = (e) => {
        setIsDragging(true);
        setStartX(e.touches[0].pageX - carouselRef.current.offsetLeft);
        setScrollLeft(carouselRef.current.scrollLeft);
        // Hide tooltip on touch start
        setTooltipData(null);
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;
        const x = e.touches[0].pageX - carouselRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        carouselRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleCardMouseEnter = (e, brand) => {
        if (!isDragging) {
            updateTooltipPosition(e);
            setTooltipData(brand);
        }
    };

    const handleCardMouseMove = (e) => {
        if (tooltipData) {
            updateTooltipPosition(e);
        }
    };

    const updateTooltipPosition = (e) => {
        const offset = 16; // Distance from the cursor
        setTooltipPosition({
            x: e.clientX,
            y: e.clientY - offset
        });
    };

    const handleCardMouseLeave = () => {
        setTooltipData(null);
    };

    const handleKeyDown = (e, brand) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const rect = e.currentTarget.getBoundingClientRect();
            setTooltipPosition({
                x: rect.left + (rect.width / 2),
                y: rect.top - 12
            });
            setTooltipData(brand);
        }
    };

    return (
        <section className="brands-section">
            <div className="container">
                <SectionHeader 
                    icon={Buildings}
                    title="Nos Marques"
                    subtitle="Découvrez notre gamme complète d'huiles de qualité supérieure"
                    variant="light"
                />

                <div 
                    className="carousel-container"
                    role="region"
                    aria-label="Carousel des marques"
                >
                    <button 
                        className="carousel-control prev" 
                        onClick={handlePrevClick}
                        aria-label="Marques précédentes"
                        disabled={isAtStart}
                        style={{ opacity: isAtStart ? 0.5 : 1 }}
                    >
                        <CaretLeft size={24} weight="bold" />
                    </button>

                    <div 
                        className={`brands-carousel ${isDragging ? 'dragging' : ''}`}
                        ref={carouselRef}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={() => {
                            handleMouseUp();
                            handleCardMouseLeave();
                        }}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleMouseUp}
                        role="list"
                        aria-label="Liste des marques"
                    >
                        {brandsData.map((brand, index) => (
                            <div 
                                key={brand.id} 
                                className="brand-card"
                                role="listitem"
                                tabIndex={0}
                                onMouseEnter={(e) => handleCardMouseEnter(e, brand)}
                                onMouseMove={handleCardMouseMove}
                                onMouseLeave={handleCardMouseLeave}
                                onKeyDown={(e) => handleKeyDown(e, brand)}
                                aria-label={`Marque ${brand.title}`}
                            >
                                <div className="brand-image">
                                    <img 
                                        src={brand.image} 
                                        alt={`Logo ${brand.title}`}
                                        draggable="false"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <button 
                        className="carousel-control next" 
                        onClick={handleNextClick}
                        aria-label="Marques suivantes"
                        disabled={isAtEnd}
                        style={{ opacity: isAtEnd ? 0.5 : 1 }}
                    >
                        <CaretRight size={24} weight="bold" />
                    </button>
                </div>
            </div>

            <BrandTooltip 
                brand={tooltipData} 
                position={tooltipPosition}
            />
        </section>
    );
}
