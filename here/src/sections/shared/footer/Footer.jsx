import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './footer.scss';

// Components
import Button from "../../../components/buttons/Button"

// Icons
import { 
    House, 
    ShoppingBag, 
    Article, 
    EnvelopeSimple, 
    Phone, 
    MapPin
} from "@phosphor-icons/react"

// Logo
import { ReactComponent as Logo } from "../../../assets/svg/dikafood-logo-main-3.svg"

const LogoComponent = () => (
    <div className='logo'>
        <Logo aria-label="DikaFood Logo" />
        <span className="logo-fallback">
            <span className="logo-text">DikaFood</span>
            <span className="logo-underline"></span>
        </span>
    </div>
)

export const scrollToContactForm = () => {
    // Small delay to ensure the DOM is ready, especially when navigating from another page
    setTimeout(() => {
        const formElement = document.getElementById('contact-form');
        if (formElement) {
            formElement.scrollIntoView({ 
                behavior: 'smooth',
                block: 'center'
            });
        }
    }, 100);
};

export default function Footer() {
    // Navigation state management
    const location = useLocation()
    const homeRef = useRef(null)
    const shopRef = useRef(null)
    const blogRef = useRef(null)

    // Handle active navigation state
    useEffect(() => {
        const refs = [homeRef, shopRef, blogRef]
        refs.forEach(ref => ref.current?.classList.remove('active'))

        switch (location.pathname) {
            case '/':
                homeRef.current?.classList.add('active')
                break
            case '/boutique':
                shopRef.current?.classList.add('active')
                break
            case '/blog':
                blogRef.current?.classList.add('active')
                break
            default:
                break
        }
    }, [location.pathname])

    // Navigation links configuration
    const navLinks = [
        { ref: homeRef, path: "/", icon: <House weight="duotone" />, label: "Accueil" },
        { ref: shopRef, path: "/boutique", icon: <ShoppingBag weight="duotone" />, label: "Boutique" },
        { ref: blogRef, path: "/blog", icon: <Article weight="duotone" />, label: "Blog" }
    ]

    // Contact information configuration
    const contactInfo = [
        { icon: <EnvelopeSimple weight="duotone" />, href: "mailto:contact@dikafood.com", text: "Contact@dikafood.com" },
        { icon: <Phone weight="duotone" />, href: "tel:+212661373204", text: "+212 (661) 37 32 04" },
        { icon: <Phone weight="duotone" />, href: "tel:+212535942682", text: "+212 (535) 94 26 82" },
        { 
            icon: <MapPin weight="duotone" />, 
            href: "https://maps.app.goo.gl/mJRgbWpwp2ZVFtnx8", 
            text: "18 Rue Zenata Quartier Industriel Dokkarat, Fes, Maroc" 
        }
    ]

    return (
        <footer className="footer-container">
            <div className="footer">
                {/* Left Section: Logo, Description, Navigation */}
                <div className="footer-left">
                    <div className="brand-info">
                        <LogoComponent />
                        <p>
                            Nous vous proposons une sélection d'huiles d'exception issues des meilleures 
                            plantations du Maroc. Que vous soyez amateur d'huile d'olive ou à la recherche 
                            d'une huile de tournesol pure, DikaFood est votre partenaire de confiance pour 
                            des produits de qualité supérieure.
                        </p>
                    </div>
                    
                    {/* Navigation Menu */}
                    <nav className="menu">
                        {navLinks.map(({ ref, path, icon, label }) => (
                            <Button
                                key={path}
                                link={path}
                                buttonIcon={icon}
                                buttonName={label}
                                theme="button-comp-link"
                                size="small"
                                btnRef={ref}
                            />
                        ))}
                    </nav>
                </div>

                {/* Contact Information */}
                <div className="footer-right">
                    <h3>Nos Coordonnées</h3>
                    <ul className="contact-info">
                        {contactInfo.map(({ icon, href, text }) => (
                            <li key={href}>
                                <span>{icon}</span>
                                <a href={href}>{text}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </footer>
    )
}
