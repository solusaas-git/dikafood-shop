import React, { createContext, useState, useContext, useEffect } from 'react';

// Define available languages
export const LANGUAGES = {
  FR: 'fr',
  EN: 'en'
};

// Create the context
const LanguageContext = createContext();

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Provider component
export const LanguageProvider = ({ children }) => {
  // Initialize language from localStorage or default to French
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    return savedLanguage && Object.values(LANGUAGES).includes(savedLanguage)
      ? savedLanguage
      : LANGUAGES.FR;
  });

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('preferredLanguage', language);
    // Update HTML lang attribute for accessibility and SEO
    document.documentElement.lang = language;
  }, [language]);

  // Function to change language
  const changeLanguage = (lang) => {
    if (Object.values(LANGUAGES).includes(lang)) {
      setLanguage(lang);
    } else {
      console.warn(`Unsupported language: ${lang}`);
    }
  };

  // Check if a specific language is currently active
  const isLanguage = (lang) => language === lang;

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, isLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;