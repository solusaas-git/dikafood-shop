import React, { useState, useEffect } from 'react';
import { Translate } from "@phosphor-icons/react";
import { useBreakpoint } from '../../../hooks/useBreakpoint';
import { useLanguage, LANGUAGES } from '../../../context/LanguageContext';
import getTranslation from '../../../utils/translation';
import './language-switcher.scss';

const languages = [
    { code: LANGUAGES.FR, name: 'FR', fullName: 'Français', flag: '🇫🇷' },
    { code: LANGUAGES.EN, name: 'EN', fullName: 'English', flag: '🇬🇧' }
];

export default function LanguageSwitcher() {
    const [isOpen, setIsOpen] = useState(false);
    const [hideAtBottom, setHideAtBottom] = useState(false);
    const { isMobile, isMobileSm } = useBreakpoint();

    // Use the language context instead of local state
    const { language, changeLanguage } = useLanguage();

    const handleLanguageChange = (langCode) => {
        changeLanguage(langCode);
        setIsOpen(false);
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
    }, [isMobile, isMobileSm]);

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
                    {languages.find(lang => lang.code === language)?.name || 'FR'}
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
                                className={`lang-option ${language === lang.code ? 'active' : ''}`}
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