import React, { useState, useEffect } from 'react';
import { ArrowUp, ChatCircleText } from "@phosphor-icons/react";
import { scrollToContactForm } from '../../../sections/shared/footer/Footer';
import './floating-buttons.scss';

export default function FloatingButtons() {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled up to given distance
    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Set the top on click
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <div className={`floating-buttons ${isVisible ? 'visible' : ''}`}>
            <button 
                className="floating-button support"
                onClick={scrollToContactForm}
                aria-label="Contact support"
            >
                <ChatCircleText size={24} weight="duotone" />
                <span className="tooltip">Support client</span>
            </button>
            
            <button 
                className="floating-button top"
                onClick={scrollToTop}
                aria-label="Return to top"
            >
                <ArrowUp size={24} weight="duotone" />
                <span className="tooltip">Retour en haut</span>
            </button>
        </div>
    );
} 