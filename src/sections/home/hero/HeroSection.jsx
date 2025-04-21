import React from 'react';
import { Link } from 'react-router-dom';
import "./hero-section.scss";
import HeroBackground from './components/HeroBackground';
import HeroCarousel from './components/HeroCarousel';
import { useBreakpoint } from '../../../hooks/useBreakpoint';
import { ShoppingBag, Download } from "@phosphor-icons/react";

export default function HeroSection() {
    const { isMobile, isTablet } = useBreakpoint();

    return (
        <section className={`hero-section ${isMobile ? 'mobile' : isTablet ? 'tablet' : ''}`}>
            <div className="hero-image-container">
                <HeroBackground />
                <div className="hero-content-container">
                    <div className="hero-content">
                        <h1>L'excellence alimentaire <span className="highlight">marocaine</span> à votre porte</h1>
                        <div className="cta-buttons">
                            <Link to="/shop" className="hero-cta">
                                <ShoppingBag size={28} weight="duotone" />
                                Découvrir nos produits
                            </Link>
                            <Link to="/catalog.pdf" target="_blank" className="hero-cta-secondary">
                                <Download size={28} weight="duotone" />
                                Télécharger le catalogue
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="hero-carousel-container">
                <HeroCarousel />
            </div>
        </section>
    );
}