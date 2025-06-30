import React, { useEffect, useRef, useState } from "react";
import "./nav-bar.scss";
import Button from '../../../components/buttons/Button';
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from '../../../context/AuthContext';
import {
    List,
    House,
    ShoppingBag,
    PaperPlaneTilt,
    DownloadSimple,
    EnvelopeSimple,
    Article,
    Info,
    X,
    ShoppingCart,
    Question,
    Palette,
    User,
    SignIn,
    CaretDown,
    SignOut,
    Gear,
    CreditCard,
    Package
} from "@phosphor-icons/react";
import logoUrl from "../../../assets/svg/dikafood-logo-light-3.svg";
import faviconUrl from "../../../../favicon.svg";
import { scrollToContactForm } from '../footer/Footer';
import AuthDropdown from './AuthDropdown';
import CartDropdown from './CartDropdown';
import { isMobile, isTablet } from 'react-device-detect';

// Navigation config (with direct text labels)
const NAV_ITEMS = [
    {
        icon: <House size={20} weight="duotone" />,
        label: "Accueil",
        path: "/"
    },
    {
        icon: <ShoppingBag size={20} weight="duotone" />,
        label: "Boutique",
        path: "/shop"
    },
    {
        icon: <Article size={20} weight="duotone" />,
        label: "Blog",
        path: "/blog"
    },
];

function NavBar({ onClick, isOpen, onClose }) {
    const navigate = useNavigate();
    const location = useLocation();
    const pathname = location.pathname;
    const menuRef = useRef(null);
    const [localIsOpen, setLocalIsOpen] = useState(isOpen);
    const [cartItemCount, setCartItemCount] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);
    const isMobileDevice = isMobile || isTablet;

    // Use auth context
    const { isLoggedIn, logout } = useAuth();

    // Keep local and parent state in sync
    useEffect(() => {
        setLocalIsOpen(isOpen);
    }, [isOpen]);

    // Handle scroll events for navbar appearance
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setIsScrolled(scrollPosition > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Mock cart data - in a real app this would come from a cart context or redux store
    useEffect(() => {
        // This would be replaced with actual cart state
        const mockCart = localStorage.getItem('cart') ?
            JSON.parse(localStorage.getItem('cart')) :
            [];
        setCartItemCount(mockCart.length);
    }, [pathname]);

    const handleContactClick = async (e) => {
        e.preventDefault();

        if (pathname !== '/') {
            await navigate('/', { state: { scrollToContact: true } });
        } else {
            scrollToContactForm();
        }

        handleClose();
    };

    const handleToggle = () => {
        const newState = !localIsOpen;
        setLocalIsOpen(newState);
        if (onClick) onClick();
    };

    const handleClose = () => {
        setLocalIsOpen(false);
        if (onClose) onClose();
        // Force close any open dropdowns by adding a click event
        document.body.click();
    };

    // Handle escape key
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'Escape' && localIsOpen) {
                handleClose();
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [localIsOpen]);

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target) && localIsOpen) {
                handleClose();
            }
        };

        if (localIsOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            // Prevent body scroll when menu is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            // Restore body scroll when menu is closed
            document.body.style.overflow = '';
        };
    }, [localIsOpen]);

    return (
        <div className={`nav-bar-container ${isScrolled ? 'scrolled' : ''}`}>
            {localIsOpen && (
                <div
                    className={`nav-overlay ${localIsOpen ? 'active' : ''}`}
                    onClick={handleClose}
                    role="presentation"
                />
            )}

            <div className="nav-bar">
                {/* Mobile Layout - Split into two containers */}
                <div className="mobile-container">
                    {/* Left container - Favicon and Menu Toggle */}
                    <div className="mobile-left-container">
                        <div className="favicon">
                            <a href="/">
                                <img src={faviconUrl} alt="DikaFood Icon" />
                            </a>
                        </div>

                        {/* Mobile Menu Toggle Button */}
                        <div className="menu-phone">
                            <span
                                onClick={handleToggle}
                                role="button"
                                aria-expanded={localIsOpen}
                                aria-controls="mobile-menu"
                                aria-label={localIsOpen ? "Fermer le menu" : "Ouvrir le menu"}
                                tabIndex="0"
                            >
                                {localIsOpen ? (
                                    <X size={24} weight="bold" />
                                ) : (
                                    <List size={24} weight="bold" />
                                )}
                                <CaretDown
                                    weight="bold"
                                    className={`menu-arrow ${localIsOpen ? 'open' : ''}`}
                                    size={14}
                                />
                            </span>
                        </div>
                    </div>

                    {/* Right container - Auth and Cart dropdowns */}
                    <div className="mobile-right-container">
                        <div className="mobile-actions">
                            <div className="user-button">
                                <AuthDropdown onClose={handleClose} isMobile={true} isNavbarMobile={true} />
                            </div>
                            <div className="cart-button">
                                <CartDropdown onClose={handleClose} isMobile={true} isNavbarMobile={true} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Desktop Layout - No changes */}
                <div className="desktop-container">
                    <div className="logo">
                        <a href="/">
                            <img src={logoUrl} alt="DikaFood Logo" />
                        </a>
                    </div>

                    {/* Desktop Menu */}
                    <div className="menu">
                        {NAV_ITEMS.map((link) => (
                            <Button
                                key={link.path}
                                icon={link.icon}
                                to={link.path}
                                name={link.label}
                                theme="link"
                                size="small"
                                isActive={pathname === link.path}
                                aria-current={pathname === link.path ? "page" : undefined}
                            />
                        ))}
                    </div>

                    {/* Desktop CTA & Actions */}
                    <div className="cta">
                        <Button
                            icon={<ShoppingBag size={24} weight="duotone" />}
                            to="/shop"
                            name="Nos produits"
                            theme="primary"
                            size="small"
                        />
                        <div className="action-buttons">
                            <div className="user-button">
                                <AuthDropdown onClose={handleClose} />
                            </div>

                            <div className="cart-button">
                                <CartDropdown onClose={handleClose} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <div
                className={`mobile-menu ${localIsOpen ? 'active' : ''}`}
                ref={menuRef}
            >
                <div className="mobile-menu-content">
                    {/* Mobile Navigation Links */}
                    <div className="mobile-links">
                        {NAV_ITEMS.map((link) => (
                            <Button
                                key={link.path}
                                icon={link.icon}
                                to={link.path}
                                name={link.label}
                                theme="link-mobile"
                                size="large"
                                isActive={pathname === link.path}
                                onClick={handleClose}
                                aria-current={pathname === link.path ? "page" : undefined}
                            />
                        ))}
                    </div>

                    {/* Mobile CTA Button */}
                    <div className="mobile-cta">
                        <Button
                            icon={<ShoppingBag size={22} weight="duotone" />}
                            to="/shop"
                            onClick={handleClose}
                            name="Voir tous nos produits"
                            theme="primary"
                            size="large"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Error boundary for the NavBar component
class NavbarErrorBoundary extends React.Component {
    state = { hasError: false };

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return <div className="nav-bar-error">Une erreur est survenue. Veuillez rafraîchir la page.</div>;
        }

        return this.props.children;
    }
}

const NavBarWithErrorBoundary = (props) => {
    return (
        <NavbarErrorBoundary>
            <NavBar {...props} />
        </NavbarErrorBoundary>
    );
};

export default NavBarWithErrorBoundary;
