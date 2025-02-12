import React, { useRef, useState } from 'react';
import { Buildings, CaretLeft, CaretRight } from "@phosphor-icons/react";
import { brandsData } from '../../../data/brands';
import SectionHeader from '../../../components/ui/section/SectionHeader';
import './brands.scss';

export default function Marque() {
    const carouselRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handlePrevClick = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };

    const handleNextClick = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - carouselRef.current.offsetLeft);
        setScrollLeft(carouselRef.current.scrollLeft);
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
    };

    const handleTouchStart = (e) => {
        setIsDragging(true);
        setStartX(e.touches[0].pageX - carouselRef.current.offsetLeft);
        setScrollLeft(carouselRef.current.scrollLeft);
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;
        const x = e.touches[0].pageX - carouselRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        carouselRef.current.scrollLeft = scrollLeft - walk;
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

                <div className="carousel-container">
                    <button 
                        className="carousel-control prev" 
                        onClick={handlePrevClick}
                        aria-label="Previous brands"
                    >
                        <CaretLeft size={24} weight="bold" />
                    </button>

                    <div 
                        className="brands-carousel"
                        ref={carouselRef}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleMouseUp}
                    >
                        {brandsData.map((brand) => (
                            <div 
                                key={brand.id} 
                                className="brand-card"
                            >
                                <div className="brand-image">
                                    <img 
                                        src={brand.image} 
                                        alt={brand.title}
                                        draggable="false"
                                    />
                                </div>
                                <div className="brand-content">
                                    <h3>{brand.title}</h3>
                                    <div className="expandable-content">
                                        <p>{brand.description}</p>
                                        <div className="brand-specs">
                                            <div className="spec-item">
                                                <span className="spec-label">Caractéristiques</span>
                                                <span className="spec-value">{brand.characteristics}</span>
                                            </div>
                                            <div className="spec-item">
                                                <span className="spec-label">Utilisation</span>
                                                <span className="spec-value">{brand.usage}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button 
                        className="carousel-control next" 
                        onClick={handleNextClick}
                        aria-label="Next brands"
                    >
                        <CaretRight size={24} weight="bold" />
                    </button>
                </div>
            </div>
        </section>
    );
}
