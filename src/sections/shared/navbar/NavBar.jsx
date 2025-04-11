import React, { useEffect, useRef, useState } from "react";
import "./nav-bar.scss";
import Button from '../../../components/buttons/Button';
import { useLocation, useNavigate } from "react-router-dom";
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
    Question
} from "@phosphor-icons/react";
import logoUrl from "../../../assets/svg/dikafood-logo-light-3.svg";
import { scrollToContactForm } from '../footer/Footer';
import { useLanguage } from '../../../context/LanguageContext';
import { getTranslation } from '../../../utils/translation';

// Navigation config (updated to use translation paths)
const NAV_ITEMS = [
    {
        icon: <House size={20} weight="duotone" />,
        translationPath: "nav.home",
        path: "/"
    },
    {
        icon: <ShoppingBag size={20} weight="duotone" />,
        translationPath: "nav.shop",
        path: "/shop"
    },
    {
        icon: <Article size={20} weight="duotone" />,
        translationPath: "nav.blog",
        path: "/blog"
    },
    {
        icon: <Question size={20} weight="duotone" />,
        translationPath: "nav.faq",
        path: "/faq"
    },
];

function NavBar({ onClick, isOpen, onClose }) {
    const navigate = useNavigate();
    const location = useLocation();
    const pathname = location.pathname;
    const menuRef = useRef(null);
    const { language } = useLanguage();
    const [localIsOpen, setLocalIsOpen] = useState(isOpen);
    const [cartItemCount, setCartItemCount] = useState(0);

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
                            name={getTranslation(link.translationPath, language) || (link.translationPath === "nav.faq" ? "FAQ" : "")}
                            theme="link"
                            size="small"
                            isActive={pathname === link.path}
                            aria-current={pathname === link.path ? "page" : undefined}
                        />
                    ))}
                </div>

                <div className="cta">
                    <Button
                        icon={<EnvelopeSimple size={24} weight="duotone" />}
                        onClick={handleContactClick}
                        name={getTranslation("common.buttons.contactUs", language)}
                        theme="secondary-white-bg"
                        size="small"
                    />
                    <Button
                        icon={<DownloadSimple size={24} weight="duotone" />}
                        onClick={scrollToForm}
                        name={getTranslation("common.buttons.download", language) + " " + getTranslation("home.catalog.title", language).toLowerCase()}
                        theme="primary"
                        size="small"
                    />
                    <div className="cart-button">
                        <Button
                            icon={<ShoppingCart size={24} weight="duotone" />}
                            to="/checkout"
                            theme="cart"
                            size="small"
                            aria-label="Cart"
                        />
                        {cartItemCount > 0 && (
                            <span className="cart-count">{cartItemCount}</span>
                        )}
                    </div>
                </div>

                <div className="menu-phone" ref={menuRef}>
                    <span
                        onClick={handleToggle}
                        role="button"
                        aria-expanded={localIsOpen}
                        aria-controls="mobile-menu"
                        aria-label={localIsOpen ? "Close menu" : "Open menu"}
                    >
                        {localIsOpen ? (
                            <X weight="duotone" />
                        ) : (
                            <List weight="duotone" />
                        )}
                    </span>

                    <div
                        id="mobile-menu"
                        className={localIsOpen ? 'active' : ''}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Mobile navigation menu"
                    >
                        <div className="menu">
                            {NAV_ITEMS.map((link) => (
                                <Button
                                    key={link.path}
                                    icon={link.icon}
                                    to={link.path}
                                    name={getTranslation(link.translationPath, language) || (link.translationPath === "nav.faq" ? "FAQ" : "")}
                                    theme="link"
                                    size="small"
                                    isActive={pathname === link.path}
                                    onClick={handleClose}
                                    aria-current={pathname === link.path ? "page" : undefined}
                                />
                            ))}
                        </div>

                        <div className="cta">
                            <Button
                                icon={<EnvelopeSimple size={24} weight="duotone" />}
                                onClick={handleContactClick}
                                name={getTranslation("common.buttons.contactUs", language)}
                                theme="secondary-white-bg"
                                size="small"
                            />
                            <Button
                                icon={<DownloadSimple size={24} weight="duotone" />}
                                onClick={scrollToForm}
                                name={getTranslation("common.buttons.download", language) + " " + getTranslation("home.catalog.title", language).toLowerCase()}
                                theme="primary"
                                size="small"
                            />
                            <Button
                                icon={<ShoppingCart size={24} weight="duotone" />}
                                to="/checkout"
                                name="Panier"
                                theme="secondary"
                                size="small"
                                onClick={handleClose}
                            />
                        </div>
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
