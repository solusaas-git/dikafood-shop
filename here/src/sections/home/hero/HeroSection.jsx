import React, { useState, useEffect } from 'react';
import "./hero-section.scss";
import HeroBackground from './components/HeroBackground';
import HeroContent from './components/HeroContent';
import HeroCarousel from './components/HeroCarousel';

export default function HeroSection() {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const scrollToForm = () => {
        const formElement = document.querySelector('#form');
        if (formElement) {
            formElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className={`hero-section ${isMobile ? 'mobile' : ''}`}>
            <HeroBackground isMobile={isMobile} />
            
            <div className="hero-container">
                <div className={`content-wrapper ${isMobile ? 'mobile' : ''}`}>
                    <HeroContent onScrollToForm={scrollToForm} isMobile={isMobile} />
                    <HeroCarousel isMobile={isMobile} />
                </div>
            </div>
        </section>
    );
}