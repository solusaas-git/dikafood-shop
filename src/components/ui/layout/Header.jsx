import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../icons/Icon';
import Button from '../inputs/Button';
import { AuthMenu, LanguageSwitcher } from '../navigation';
import CartMenu from '../navigation/CartMenu';
import { useTranslation } from '../../../utils/i18n';
import translations from './translations/Header';

// Navigation items with translation keys
const menuItems = [
  {
    labelKey: 'menu_home',
    path: '/',
    icon: 'house'
  },
  {
    labelKey: 'menu_shop',
    path: '/shop',
    icon: 'shoppingBag'
  },
  {
    labelKey: 'menu_about',
    path: '/about',
    icon: 'info'
  }
];

export default function Header() {
  const { t } = useTranslation(translations);
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const mobileNavbarRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Define CSS variables for menu heights
  useEffect(() => {
    document.documentElement.style.setProperty('--navbar-height', '80px');
    document.documentElement.style.setProperty('--navbar-height-mobile', '46px');
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target) &&
          mobileNavbarRef.current && !mobileNavbarRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
    setActiveMenu(null);
  }, [pathname]);

  // Handle menu toggle
  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setActiveMenu(null); // Close any active menu when toggling the main menu
  };

  // Close menu
  const closeMenu = () => {
    setIsOpen(false);
  };

  // Handle menu toggle for auth and cart menus
  const handleMenuToggle = (menuName) => (isMenuOpen) => {
    if (isMenuOpen) {
      setActiveMenu(menuName);
    } else if (activeMenu === menuName) {
      setActiveMenu(null);
    }

    // Close the main mobile menu when opening a dropdown
    if (isOpen && isMenuOpen) {
      setIsOpen(false);
    }
  };

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 py-4"
    >
      <div className="container mx-auto px-4">
        {/* Desktop Header */}
        <div className="hidden md:flex max-w-6xl mx-auto items-center justify-between rounded-full backdrop-blur-lg bg-dark-green-7/80 shadow-lg border border-white/10 px-4 md:px-6 py-2.5">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="block">
              <img
                src="/images/logo-light.svg"
                alt="DikaFood Logo"
                className="h-9 md:h-10"
                loading="eager"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="flex items-center bg-white/10 backdrop-blur-md rounded-full px-2 z-60">
            {menuItems.map((item, index) => (
              <React.Fragment key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-1.5 text-white text-sm font-normal py-2.5 px-4 transition-colors hover:text-dark-yellow-1 icon-text-separator ${
                    pathname === item.path ? 'text-dark-yellow-1' : ''
                  }`}
                >
                  <Icon name={item.icon} size="sm" className="shrink-0" />
                  <span>{t(item.labelKey)}</span>
                </Link>
                {index < menuItems.length - 1 && (
                  <div className="h-5 w-px bg-white/10"></div>
                )}
              </React.Fragment>
            ))}
          </nav>

          {/* Desktop CTA & Actions */}
          <div className="flex items-center gap-3 z-90">
            <Button
              to="/shop"
              variant="primary"
              size="sm"
              className="bg-logo-lime hover:bg-logo-lime/90 text-dark-green-7 rounded-full py-2 px-4 h-[38px] icon-text-separator"
            >
              <Icon name="shoppingBag" size="sm" className="shrink-0" />
              <span className="text-sm">{t('cta_products')}</span>
            </Button>

            {/* Auth & Cart Container */}
            <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full relative z-90">
              {/* Auth Menu */}
              <AuthMenu
                onClose={() => setActiveMenu(null)}
                isNavbarMobile={false}
                isGrouped={true}
                isOpen={activeMenu === 'auth-desktop'}
                onToggle={handleMenuToggle('auth-desktop')}
              />

              <div className="h-6 w-px bg-white/10"></div>

              {/* Cart Menu */}
              <CartMenu
                onClose={() => setActiveMenu(null)}
                isNavbarMobile={false}
                isGrouped={true}
                isOpen={activeMenu === 'cart-desktop'}
                onToggle={handleMenuToggle('cart-desktop')}
              />

              <div className="h-6 w-px bg-white/10"></div>

              {/* Language Switcher */}
              <div className="relative">
                <LanguageSwitcher
                  position="inline"
                  isGrouped={true}
                  onClose={() => setActiveMenu(null)}
                  isOpen={activeMenu === 'lang-desktop'}
                  onToggle={handleMenuToggle('lang-desktop')}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden flex items-center w-full justify-center py-1.5 h-[var(--navbar-height-mobile)]">
          <div
            ref={mobileNavbarRef}
            className="flex items-center justify-between w-full max-w-[280px] bg-dark-green-7/90 backdrop-blur-lg rounded-full border border-white/10 px-3 py-1.5 shadow-lg relative z-[150]"
          >
            {/* Left section - Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center justify-center h-8 w-8">
                <img
                  src="/favicon.svg"
                  alt="DikaFood"
                  className="h-6 w-6"
                  loading="eager"
                />
              </Link>
            </div>

            {/* Right section - Actions */}
            <div className="flex items-center gap-1.5">
              {/* Auth and Cart container with glassmorphic background */}
              <div className="flex items-center gap-0.5 bg-white/10 backdrop-blur-sm rounded-full overflow-hidden px-1.5 py-1 h-8 z-[160]">
                {/* Auth menu */}
                <div className="relative z-[170]">
                  <AuthMenu
                    onClose={() => setActiveMenu(null)}
                    isMobile={true}
                    isNavbarMobile={true}
                    isGrouped={false}
                    isOpen={activeMenu === 'auth-mobile'}
                    onToggle={handleMenuToggle('auth-mobile')}
                  />
                </div>

                <div className="h-4 w-px bg-white/10"></div>

                {/* Cart menu */}
                <div className="relative z-[170]">
                  <CartMenu
                    onClose={() => setActiveMenu(null)}
                    isMobile={true}
                    isNavbarMobile={true}
                    isGrouped={false}
                    isOpen={activeMenu === 'cart-mobile'}
                    onToggle={handleMenuToggle('cart-mobile')}
                  />
                </div>

                <div className="h-4 w-px bg-white/10"></div>

                {/* Language Switcher */}
                <div className="relative z-[170]">
                  <LanguageSwitcher
                    position="inline"
                    isNavbarMobile={true}
                    isGrouped={false}
                    onClose={() => setActiveMenu(null)}
                    isOpen={activeMenu === 'lang-mobile'}
                    onToggle={handleMenuToggle('lang-mobile')}
                  />
                </div>
              </div>

              {/* Menu toggle button */}
              <button
                onClick={toggleMenu}
                className="relative flex items-center justify-center p-1.5 text-white hover:text-dark-yellow-1 active:text-dark-yellow-1/80 rounded-full transition-all duration-200 bg-white/10 backdrop-blur-sm h-8 w-8 focus:outline-none"
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
                aria-label={isOpen ? t('close_menu') : t('open_menu')}
              >
                <Icon name={isOpen ? "x" : "list"} size="sm" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden" ref={mobileMenuRef}>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-80"
            onClick={closeMenu}
          ></div>
          <div
            id="mobile-menu"
            className="fixed top-[calc(var(--navbar-height-mobile)+12px)] right-4 left-4 max-h-[80vh] bg-dark-green-7/90 backdrop-blur-md rounded-2xl z-85 overflow-y-auto border border-white/10 shadow-lg"
          >
            {/* Close button */}
            <div className="absolute top-4 right-4">
              <button
                onClick={closeMenu}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label={t('close_menu')}
              >
                <Icon name="x" size="sm" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4">
              {/* Menu navigation items */}
              <nav className="flex flex-col gap-1 mt-4">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 text-white hover:text-dark-yellow-1 py-3.5 px-5 rounded-full transition-colors icon-text-separator mobile-nav-item ${
                      pathname === item.path ? 'bg-dark-yellow-1/20 text-dark-yellow-1' : ''
                    }`}
                    onClick={closeMenu}
                  >
                    <div className="flex items-center justify-center w-9 h-9 bg-white/10 rounded-full">
                      <Icon name={item.icon} size="md" className="shrink-0 text-dark-yellow-1" />
                    </div>
                    <span className="text-base font-medium">{t(item.labelKey)}</span>
                  </Link>
                ))}
              </nav>

              {/* Separator */}
              <div className="h-px w-full bg-white/10 my-2"></div>

              {/* CTA Button */}
              <div className="mt-2 mb-4">
                <Button
                  to="/shop"
                  variant="primary"
                  className="bg-dark-yellow-1 hover:bg-dark-yellow-2 text-dark-green-7 rounded-full w-full py-3.5 justify-center icon-text-separator"
                  onClick={closeMenu}
                >
                  <Icon name="shoppingBag" className="shrink-0" />
                  <span className="font-semibold">{t('cta_products')}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop for dropdown menus */}
      {activeMenu && (
        <div
          className="fixed inset-0 z-[175] bg-black/30 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none pointer-events-none"
          aria-hidden="true"
        ></div>
      )}
    </header>
  );
}