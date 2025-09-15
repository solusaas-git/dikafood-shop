import React, { useState, useEffect, useRef, memo } from 'react';
import { useTranslation, useLocale, LANGUAGES } from '../../../utils/i18n';
// Removed preloadFlags import - functionality simplified
import FlagImage from '../common/FlagImage';
import Menu from './Menu';
import MenuTrigger from './MenuTrigger';
import LucideIcon from '../icons/LucideIcon';

/**
 * Language switcher component
 *
 * @param {Object} props - Component props
 * @param {string} props.position - Position of the language switcher (inline, fixed, fixedBottom)
 * @param {boolean} props.isGrouped - Whether the language switcher is part of a button group
 * @param {Function} props.onClose - Function to call when menu closes
 * @param {boolean} props.isOpen - Whether the menu is open
 * @param {Function} props.onToggle - Function to toggle the menu
 */
const LanguageSwitcher = ({
  position = 'inline',
  isGrouped = false,
  onClose,
  isOpen,
  onToggle,
  isNavbarMobile = false,
}) => {
  const { locale, setLocale } = useLocale();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Preload flag images functionality removed for simplicity

  // For positioning fixed language switcher
  const positions = {
    'fixed': 'fixed bottom-6 left-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'top-left': 'fixed top-6 left-6',
    'bottom-right': 'fixed bottom-6 right-6',
    'top-right': 'fixed top-6 right-6',
  };
  const positionClass = positions[position] || positions['bottom-left'];

  // Handle clicks outside dropdown when in fixed position
  useEffect(() => {
    if (position === 'inline' || !isOpen) {
      return;
    }

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (onToggle) {
          onToggle(false);
        } else {
          setIsMenuOpen(false);
        }
        if (onClose) onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onToggle, onClose, position]);

  // Handle controlled state from parent component
  useEffect(() => {
    if (typeof isOpen !== 'undefined') {
      setIsMenuOpen(isOpen);
    }
  }, [isOpen]);

  // Handle language selection
  const handleSelectLanguage = (langCode) => {
    setLocale(langCode);
    if (onToggle) {
      onToggle(false);
    } else {
      setIsMenuOpen(false);
    }
    if (onClose) onClose();
  };



  // Render header for both menu types
  const renderHeader = () => {
    return (
      <div className={`flex items-center gap-3 ${isNavbarMobile ? 'py-3 px-4' : 'py-4 px-5'} bg-gradient-to-r from-logo-lime/5 to-logo-lime/10 border-b border-logo-lime/15`}>
        <div className={`${isNavbarMobile ? 'w-8 h-8' : 'w-10 h-10'} rounded-xl bg-gradient-to-br from-logo-lime/20 to-logo-lime/30 border border-logo-lime/40 flex items-center justify-center shadow-sm`}>
          <LucideIcon name="globe" size={isNavbarMobile ? 'md' : 'lg'} className="text-dark-green-7" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`${isNavbarMobile ? 'text-base' : 'text-lg'} font-semibold text-dark-green-7 truncate`}>
            {isNavbarMobile ? 'Language' : 'Select Language'}
          </h3>
          {!isNavbarMobile && (
            <p className="text-xs text-dark-green-5 mt-0.5">Choose your preferred language</p>
          )}
        </div>
      </div>
    );
  };

  // For fixed position mode
  if (position === 'fixed') {
    const fixedTrigger = (
      <div className="relative flex items-center">
        <MenuTrigger
          variant="glass"
          size="md"
          rounded="full"
          className="bg-dark-green-7/80 backdrop-blur-md border border-white/10 shadow-lg p-3 text-white hover:bg-dark-green-6/80 transition-colors"
          icon={
            <div className="flex items-center justify-center">
              <LucideIcon name="globe" size="md" className="text-dark-yellow-1" />
            </div>
          }
        />
      </div>
    );

    return (
      <div className={`${positionClass} z-50`} ref={dropdownRef}>
        <Menu
          variant="dropdown"
          glass={true}
          rounded="xl"
          isOpen={isOpen}
          onToggle={onToggle}
          onClose={onClose}
          trigger={fixedTrigger}
          position="bottom-left"
          containerClassName="w-96"
          header={renderHeader}
          headerPadding="none"
        >
          <div className="py-2">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelectLanguage(lang.code)}
                className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${
                  locale === lang.code
                    ? 'bg-neutral-100 text-dark-green-7 font-medium'
                    : 'text-neutral-700 hover:bg-neutral-50'
                }`}
                aria-label={`Switch to ${lang.name}`}
                aria-current={locale === lang.code ? 'true' : 'false'}
              >
                <FlagImage 
                  countryCode={lang.flag} 
                  alt={`${lang.name} flag`}
                  className="w-6 h-4 rounded-sm object-cover shadow-sm"
                />
                <span className="text-sm">{lang.name}</span>
              </button>
            ))}
          </div>
        </Menu>
      </div>
    );
  }

  // For inline mode (in navbar, etc)
  const inlineTrigger = (
    <div className="relative flex items-center">
      <MenuTrigger
        variant={isNavbarMobile ? 'transparent' : 'glass'}
        size="md"
        rounded={!isGrouped ? 'full' : 'default'}
        isGrouped={isGrouped}
        withCaret={!isNavbarMobile}
        icon={
          <div className="flex items-center justify-center">
            <FlagImage 
              countryCode={LANGUAGES.find(l => l.code === locale)?.flag || 'FR'}
              alt={`${LANGUAGES.find(l => l.code === locale)?.name || 'Language'} flag`}
              className="w-5 h-3 rounded-sm object-cover"
            />
          </div>
        }
      />
    </div>
  );

  return (
    <Menu
      variant="dropdown"
      isMobile={isNavbarMobile}
      isNavbarMobile={isNavbarMobile}
      glass={true}
      rounded="xl"
      isOpen={isOpen}
      onToggle={onToggle}
      onClose={onClose}
      trigger={inlineTrigger}
      header={renderHeader}
      headerPadding="none"
      containerClassName={isNavbarMobile ? "w-72 max-w-[calc(100vw-2rem)]" : "w-80"}
      position={isNavbarMobile ? "center" : "right"}
      menuId={`lang-menu-${isNavbarMobile ? 'mobile' : 'desktop'}`}
      bodyPadding="none"
    >
      <div className={`${isNavbarMobile ? 'space-y-1.5 p-2' : 'space-y-2 p-3'}`}>
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleSelectLanguage(lang.code)}
            className={`group w-full ${isNavbarMobile ? 'px-3 py-3' : 'px-4 py-3.5'} text-left flex items-center gap-3 transition-all duration-200 rounded-xl border ${
              locale === lang.code
                ? 'bg-gradient-to-r from-logo-lime/15 to-logo-lime/10 border-logo-lime/30 text-dark-green-7 font-semibold shadow-sm'
                : 'text-dark-green-6 hover:bg-gradient-to-r hover:from-neutral-50 hover:to-white border-transparent hover:border-neutral-200/60 hover:shadow-sm hover:text-dark-green-7'
            }`}
            aria-current={locale === lang.code ? 'true' : 'false'}
          >
            <div className={`${isNavbarMobile ? 'w-6 h-6' : 'w-8 h-8'} rounded-lg bg-white border border-neutral-200/60 shadow-sm flex items-center justify-center overflow-hidden group-hover:shadow-md transition-shadow`}>
              <FlagImage 
                countryCode={lang.flag} 
                alt={`${lang.name} flag`}
                className={`${isNavbarMobile ? 'w-5 h-3' : 'w-6 h-4'} rounded-sm object-cover`}
                style={{
                  imageRendering: 'crisp-edges',
                  WebkitImageRendering: 'crisp-edges',
                  MozImageRendering: 'crisp-edges'
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <span className={`${isNavbarMobile ? 'text-sm' : 'text-base'} font-medium block`}>{lang.name}</span>
              {!isNavbarMobile && (
                <span className="text-xs text-dark-green-5 block mt-0.5">
                  {lang.code.toUpperCase()}
                </span>
              )}
            </div>
            {locale === lang.code && (
              <div className={`${isNavbarMobile ? 'w-5 h-5' : 'w-6 h-6'} rounded-full bg-logo-lime/20 border-2 border-logo-lime/60 flex items-center justify-center`}>
                <LucideIcon name="check" size={isNavbarMobile ? 'xs' : 'sm'} className="text-dark-green-7" />
              </div>
            )}
          </button>
        ))}
      </div>
    </Menu>
  );
};

export default memo(LanguageSwitcher);