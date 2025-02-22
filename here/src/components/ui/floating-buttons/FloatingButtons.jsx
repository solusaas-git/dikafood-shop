import React, { useState, useEffect } from 'react';
import { ArrowUp, ChatCircleText } from "@phosphor-icons/react";
import { scrollToContactForm } from '../../../sections/shared/footer/Footer';
import { useBreakpoint } from '../../../hooks/useBreakpoint';
import './floating-buttons.scss';

export default function FloatingButtons() {
    const [isVisible, setIsVisible] = useState(false);
    const [hideAtBottom, setHideAtBottom] = useState(false);
    const { isMobile } = useBreakpoint();

    // Show button when page is scrolled up to given distance
    const toggleVisibility = () => {
        // Check scroll position for showing/hiding buttons
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }

        // Check if footer is in view - only on mobile
        if (isMobile) {
            const footerElement = document.querySelector('.footer-section');
            if (footerElement) {
                const footerRect = footerElement.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                setHideAtBottom(footerRect.top <= windowHeight - 100);
            }
        } else {
            setHideAtBottom(false);
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
        // Initial check
        toggleVisibility();
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, [isMobile]); // Add isMobile to dependencies

    return (
        <div className={`floating-buttons ${isVisible ? 'visible' : ''} ${hideAtBottom ? 'hidden' : ''}`}>
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