import React from 'react';
import "./hero-section.scss";
import HeroBackground from './components/HeroBackground';
import HeroContent from './components/HeroContent';
import HeroCarousel from './components/HeroCarousel';

export default function HeroSection() {
    const scrollToForm = () => {
        const formElement = document.querySelector('#form');
        if (formElement) {
            formElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="hero-section">
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