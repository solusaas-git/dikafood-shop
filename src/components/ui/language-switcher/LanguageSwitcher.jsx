import React, { useState, useEffect } from 'react';
import { Translate } from "@phosphor-icons/react";
import { useBreakpoint } from '../../../hooks/useBreakpoint';
import './language-switcher.scss';

const languages = [
    { code: 'fr', name: 'FR', fullName: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'EN', fullName: 'English', flag: '🇬🇧' }
];

export default function LanguageSwitcher() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentLang, setCurrentLang] = useState('fr');
    const [hideAtBottom, setHideAtBottom] = useState(false);
    const { isMobile, isMobileSm } = useBreakpoint();

    const handleLanguageChange = (langCode) => {
        setCurrentLang(langCode);
        localStorage.setItem('preferredLanguage', langCode);
        setIsOpen(false);
        
        // Here you could add logic to handle language change in your app
        // For now, we'll just keep the UI working
    };

    // Check scroll position for hiding at footer only on mobile
    useEffect(() => {
        const checkFooterVisibility = () => {
            if (!isMobile && !isMobileSm) {
                setHideAtBottom(false);
                return;
            }

            const footerElement = document.querySelector('.footer-section');
            if (footerElement) {
                const footerRect = footerElement.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                setHideAtBottom(footerRect.top <= windowHeight - 100);
            }
        };

        window.addEventListener('scroll', checkFooterVisibility);
        checkFooterVisibility();

        return () => window.removeEventListener('scroll', checkFooterVisibility);
    }, [isMobile]);

    return (
        <div className={`floating-language-switcher ${hideAtBottom ? 'hidden' : ''}`}>
            <button 
                className="lang-toggle"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-label="Toggle language menu"
            >
                <Translate size={20} weight="duotone" />
                <span className="current-lang">
                    {languages.find(lang => lang.code === currentLang)?.name || 'FR'}
                </span>
            </button>
            
            {isOpen && (
                <>
                    <div 
                        className="lang-backdrop" 
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="lang-dropdown">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                className={`lang-option ${currentLang === lang.code ? 'active' : ''}`}
                                onClick={() => handleLanguageChange(lang.code)}
                                aria-label={`Switch to ${lang.fullName}`}
                            >
                                <span className="lang-flag">{lang.flag}</span>
                                <span className="lang-name">{lang.fullName}</span>
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
} 