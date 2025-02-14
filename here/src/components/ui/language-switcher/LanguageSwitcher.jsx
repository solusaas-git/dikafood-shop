import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Translate } from "@phosphor-icons/react";
import './language-switcher.scss';

const languages = [
    { code: 'fr', name: 'FR', fullName: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'EN', fullName: 'English', flag: '🇬🇧' }
];

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const currentLang = i18n.language;

    const handleLanguageChange = (langCode) => {
        i18n.changeLanguage(langCode);
        localStorage.setItem('i18nextLng', langCode);
        setIsOpen(false);
    };

    return (
        <div className="floating-language-switcher">
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