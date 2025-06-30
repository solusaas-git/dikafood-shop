import React from 'react';
import "./hero-section.scss";
import HeroBackground from './components/HeroBackground';
import HeroContent from './components/HeroContent';
import HeroCarousel from './components/HeroCarousel';
import { useBreakpoint } from '../../../hooks/useBreakpoint';

export default function HeroSection() {
    const { isMobile, isTablet } = useBreakpoint();

    const scrollToForm = () => {
        document.querySelector('#form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className={`hero-section ${isMobile ? 'mobile' : isTablet ? 'tablet' : ''}`}>
            <HeroBackground />

            <div className="hero-container">
                <div className="content-wrapper">
                    <HeroContent onScrollToForm={scrollToForm} />
                    <HeroCarousel />
                </div>
            </div>
        </section>
    );
}