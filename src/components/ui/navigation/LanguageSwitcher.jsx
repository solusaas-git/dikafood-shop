import React, { useState, useEffect, useRef, memo } from 'react';
import { useTranslation, useLocale, LANGUAGES } from '../../../utils/i18n';
// Removed preloadFlags import - functionality simplified
import FlagImage from '../common/FlagImage';
import Menu from './Menu';
import MenuTrigger from './MenuTrigger';
import Icon from '../icons/Icon';

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
      <div className="flex items-center gap-3 py-3 bg-gradient-to-br from-amber-50 to-amber-100/70 border-b border-logo-lime/20">
        <div className="w-10 h-10 rounded-full bg-logo-lime/20 border border-logo-lime/40 flex items-center justify-center ml-3">
          <Icon name="translate" size="lg" className="text-dark-green-7" />
        </div>
        <h3 className="text-lg font-medium text-dark-green-7 truncate max-w-[220px]">Langue / Language</h3>
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
              <Icon name="translate" size="md" className="text-dark-yellow-1" />
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
      containerClassName="w-96"
      position={isNavbarMobile ? "right" : "right"}
      menuId={`lang-menu-${isNavbarMobile ? 'mobile' : 'desktop'}`}
      bodyPadding="md"
    >
      <div className="space-y-2">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleSelectLanguage(lang.code)}
            className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors rounded-lg ${
              locale === lang.code
                ? 'bg-logo-lime/10 text-dark-green-7 font-medium'
                : 'text-dark-green-6 hover:bg-neutral-50'
            }`}
            aria-current={locale === lang.code ? 'true' : 'false'}
          >
            <FlagImage 
              countryCode={lang.flag} 
              alt={`${lang.name} flag`}
              className="w-6 h-4 rounded-sm object-cover shadow-sm"
            />
            <span className="text-sm">{lang.name}</span>
            {locale === lang.code && (
              <span className="ml-auto">
                <Icon name="check" size="sm" className="text-dark-green-7" />
              </span>
            )}
          </button>
        ))}


      </div>
    </Menu>
  );
};

export default memo(LanguageSwitcher);