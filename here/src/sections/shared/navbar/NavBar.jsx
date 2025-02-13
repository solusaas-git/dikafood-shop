import React, { useEffect } from "react";
import "./nav-bar.scss";
import Button from '../../../components/buttons/Button';
import { useLocation, useNavigate } from "react-router-dom";
import { List, House, ShoppingBag, PaperPlaneTilt, DownloadSimple, EnvelopeSimple, Article, Info, X } from "@phosphor-icons/react";
import logoUrl from "../../../assets/svg/dikafood-logo-light-3.svg";
import { scrollToContactForm } from '../footer/Footer';

// Navigation config
const NAV_ITEMS = [
    {
        icon: <House size={20} weight="duotone" />,
        name: "Accueil",
        path: "/"
    },
    {
        icon: <Info size={20} weight="duotone" />,
        name: "À propos",
        path: "/about"
    },
    {
        icon: <Article size={20} weight="duotone" />,
        name: "Blog",
        path: "/blog"
    },
    {
        icon: <ShoppingBag size={20} weight="duotone" />,
        name: "Boutique",
        path: "/boutique"
    }
];

function NavBar({ onClick, isOpen, onClose }) {
    const navigate = useNavigate();
    const location = useLocation();
    const pathname = location.pathname;

    const handleContactClick = async (e) => {
        e.preventDefault();
        
        if (pathname !== '/') {
            await navigate('/', { state: { scrollToContact: true } });
        } else {
            scrollToContactForm();
        }
        
        onClose();
    };

    // Handle escape key
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [isOpen, onClose]);

    return (
        <div className="nav-bar-container">
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
                            name={link.name}
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
                        name="Contactez nous"
                        theme="secondary-white-bg"
                        size="small"
                    />
                    <Button
                        icon={<DownloadSimple size={24} weight="duotone" />}
                        to="#form"
                        name="Télécharger le catalogue"
                        theme="primary"
                        size="small"
                    />
                </div>

                <div className="menu-phone">
                    <span 
                        onClick={onClick}
                        role="button"
                        aria-expanded={isOpen}
                        aria-controls="mobile-menu"
                        aria-label={isOpen ? "Close menu" : "Open menu"}
                    >
                        {isOpen ? (
                            <X weight="duotone" />
                        ) : (
                            <List weight="duotone" />
                        )}
                    </span>

                    <div 
                        id="mobile-menu"
                        className={isOpen ? 'active' : ''}
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
                                    name={link.name}
                                    theme="link"
                                    size="small"
                                    isActive={pathname === link.path}
                                    onClick={onClose}
                                    aria-current={pathname === link.path ? "page" : undefined}
                                />
                            ))}
                        </div>

                        <div className="cta">
                            <Button
                                icon={<EnvelopeSimple size={24} weight="duotone" />}
                                onClick={(e) => {
                                    handleContactClick(e);
                                    onClose();
                                }}
                                name="Contactez nous"
                                theme="secondary-white-bg"
                                size="small"
                            />
                            <Button
                                icon={<DownloadSimple size={24} weight="duotone" />}
                                to="#form"
                                name="Télécharger le catalogue"
                                theme="primary"
                                size="small"
                                onClick={onClose}
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
