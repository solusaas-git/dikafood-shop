import React, { useEffect, useCallback } from 'react';
import "./hero-section.scss";
import ProductCarousel from '../Components/ProductCarousel';
import Button from '../Components/Button';
import { ShoppingBag } from "@phosphor-icons/react";

export default function HeroSection() {
    const handleMouseMove = useCallback((e) => {
        const clarityEffect = document.querySelector('.clarity-effect');
        if (!clarityEffect) return;

        const rect = clarityEffect.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        clarityEffect.style.setProperty('--mouse-x', `${x}%`);
        clarityEffect.style.setProperty('--mouse-y', `${y}%`);
        clarityEffect.style.opacity = '1';
    }, []);

    const handleMouseLeave = useCallback(() => {
        const clarityEffect = document.querySelector('.clarity-effect');
        if (clarityEffect) {
            clarityEffect.style.opacity = '0';
        }
    }, []);

    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [handleMouseMove, handleMouseLeave]);

    return (
        <section className="hero-section">
            <div className="background-overlay" />
            <div className="clarity-effect" />
            <div className="hero-content">
                <h1>
                    L'excellence alimentaire
                    <span> marocaine </span>
                    à votre porte
                </h1>
                <p className="subtitle">
                    Découvrez notre sélection de produits authentiques, 
                    directement des terroirs marocains à votre table.
                </p>
                <div className="cta-wrapper">
                    <Button
                        buttonIcon={<ShoppingBag size={24} weight="bold" />}
                        buttonName="Découvrir nos produits"
                        theme="button-comp-primary"
                        size="button-comp-large"
                        link="/boutique"
                    />
                </div>
            </div>
            <ProductCarousel />

        </section>
    );
}