import React, { useEffect, useState, useRef } from "react";
import "./nav-bar.scss";
import Button from '../../../components/buttons/Button'
import { useLocation, useNavigate } from "react-router-dom";
import { List, House, ShoppingBag, PaperPlaneTilt, DownloadSimple, EnvelopeSimple, Article } from "@phosphor-icons/react";
import logoUrl from "../../../assets/svg/dikafood-logo-light-3.svg"
import { scrollToContactForm } from '../footer/Footer';
import { Link } from 'react-router-dom';
import Btn from '../../../components/buttons/Btn';

// Navigation config
const NAV_ITEMS = [
    {
        icon: <House size={20} weight="duotone" />,
        name: "Accueil",
        path: "/"
    },
    {
        icon: <ShoppingBag size={20} weight="duotone" />,
        name: "Boutique",
        path: "/boutique"
    },
    {
        icon: <Article size={20} weight="duotone" />,
        name: "Blog",
        path: "/blog"
    }
];

function NavBar({ onClick, isOpen, onClose }) {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const pathname = location.pathname;

    const handleContactClick = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        if (pathname !== '/') {
            // Navigate to home with state
            await navigate('/', { 
                state: { scrollToContact: true }
            });
        } else {
            // Already on home page, just scroll
            scrollToContactForm();
        }
        
        setIsLoading(false);
        onClose(); // Close mobile menu if open
    };

    // Only keep escape key handler
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
                            buttonIcon={link.icon}
                            link={link.path}
                            buttonName={link.name}
                            theme="button-comp-link"
                            size="small"
                            className={pathname === link.path ? 'active' : ''}
                        />
                    ))}
                </div>

                <div className="cta">
                    <Button
                        buttonIcon={<EnvelopeSimple size="24px" weight="duotone" />}
                        onClick={handleContactClick}
                        buttonName="Contactez nous"
                        theme="button-comp-secondary-white-bg"
                        size="button-comp-small"
                        isLoading={isLoading}
                    />
                    <Button
                        buttonIcon={<DownloadSimple size="24px" weight="duotone" />}
                        onClick={async () => {
                            setIsLoading(true);
                            await onClose();
                            setIsLoading(false);
                        }}
                        isLoading={isLoading}
                        link="#form"
                        buttonName="Télécharger le catalogue"
                        theme="button-comp-primary"
                        size="button-comp-small"
                    />
                </div>

                <div 
                    className="menu-phone"
                    role="navigation"
                    aria-label="Mobile navigation"
                >
                    <span 
                        onClick={onClick}
                        role="button"
                        aria-expanded={isOpen}
                        aria-controls="mobile-menu"
                        tabIndex={0}
                    >
                        <List aria-hidden="true" />
                        <span className="visually-hidden">Toggle menu</span>
                    </span>
                    <div 
                        id="mobile-menu"
                        className={isOpen ? "active" : ""}
                        aria-hidden={!isOpen}
                    >
                        <div className='menu'>
                            {NAV_ITEMS.map((link) => (
                                <Button
                                    key={link.path}
                                    buttonIcon={link.icon}
                                    link={link.path}
                                    buttonName={link.name}
                                    theme="button-comp-link"
                                    size="small"
                                    className={pathname === link.path ? 'active' : ''}
                                />
                            ))}
                        </div>
                        <div className="cta">
                            <Button
                                buttonIcon={<EnvelopeSimple size="24px" weight="duotone" />}
                                onClick={handleContactClick}
                                buttonName="Contactez nous"
                                theme="button-comp-secondary-white-bg"
                                size="button-comp-small"
                                isLoading={isLoading}
                            />
                            <Button
                                buttonIcon={<DownloadSimple size="24px" weight="duotone" />}
                                onClick={async () => {
                                    setIsLoading(true);
                                    await onClose();
                                    setIsLoading(false);
                                }}
                                isLoading={isLoading}
                                link="#form"
                                buttonName="Télécharger le catalogue"
                                theme="button-comp-primary"
                                size="button-comp-small"
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
