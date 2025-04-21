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
import { scrollToContactForm } from '../footer/Footer';
import AuthDropdown from './AuthDropdown';
import CartDropdown from './CartDropdown';

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

    // Use auth context
    const { isLoggedIn, logout } = useAuth();

    // Keep local and parent state in sync
    useEffect(() => {
        setLocalIsOpen(isOpen);
    }, [isOpen]);

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

    const scrollToForm = () => {
        const formElement = document.querySelector('#form');
        if (formElement) {
            formElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
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
            if (e.key === 'Escape') {
                if (localIsOpen) {
                    handleClose();
                }
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
        <div className="nav-bar-container">
            {localIsOpen && (
                <div
                    className={`nav-overlay ${localIsOpen ? 'active' : ''}`}
                    onClick={handleClose}
                    role="presentation"
                />
            )}

            <div className="nav-bar">
                <div className="logo">
                    <a href="/">
                        <img src={logoUrl} alt="Logo" />
                    </a>
                </div>

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

                <div className="menu-phone" ref={menuRef}>
                    <span
                        onClick={handleToggle}
                        role="button"
                        aria-expanded={localIsOpen}
                        aria-controls="mobile-menu"
                        aria-label={localIsOpen ? "Close menu" : "Open menu"}
                        tabIndex="0"
                    >
                        {localIsOpen ? (
                            <X size={24} weight="bold" />
                        ) : (
                            <List size={24} weight="bold" />
                        )}
                    </span>
                </div>
            </div>

            <div
                id="mobile-menu"
                className={`mobile-menu ${localIsOpen ? 'active' : ''} d-mobile-only`}
            >
                <div className="mobile-menu-content">
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

                    <div className="mobile-user-actions">
                        <div className="user-button">
                            <AuthDropdown onClose={handleClose} />
                        </div>
                        <div className="cart-button">
                            <CartDropdown onClose={handleClose} />
                        </div>
                    </div>

                    <div className="mobile-cta">
                        <Button
                            icon={<ShoppingBag size={24} weight="duotone" />}
                            to="/shop"
                            onClick={handleClose}
                            name="Nos produits"
                            theme="primary"
                            size="medium"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Error Boundary
class NavbarErrorBoundary extends React.Component {
    state = { hasError: false };

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return <div className="navbar-fallback">Menu temporarily unavailable</div>;
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
}

export default NavBarWithErrorBoundary;
