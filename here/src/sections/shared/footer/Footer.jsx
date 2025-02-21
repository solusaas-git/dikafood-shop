import React from 'react';
import { Link } from 'react-router-dom';
import './footer.scss';
import logoUrl from "../../../assets/svg/dikafood-logo-light-3.svg";

export const scrollToContactForm = () => {
    const formElement = document.querySelector('#contact-form');
    if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
    }
};

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer-section">
            <div className="footer-container">
                {/* Brand Section */}
                <div className="brand-section">
                    <div className="logo-wrapper">
                        <img 
                            src={logoUrl} 
                            alt="Logo Dikafood" 
                            className="footer-logo"
                        />
                    </div>
                    <p>Dikafood est une entreprise marocaine spécialisée dans la production et la distribution d'huiles alimentaires de haute qualité, avec un engagement fort pour l'excellence et la tradition.</p>
                </div>

                {/* Sitemap Section */}
                <div className="sitemap-section">
                    <div className="sitemap-category">
                        <h3>Navigation</h3>
                        <ul>
                            <li><Link to="/">Accueil</Link></li>
                            <li><Link to="/about">À propos</Link></li>
                            <li><Link to="/blog">Blog</Link></li>
                        </ul>
                    </div>

                    <div className="sitemap-category">
                        <h3>Produits</h3>
                        <ul>
                            <li><a href="#products">Huile d'olive</a></li>
                            <li><a href="#products">Huile de table</a></li>
                            <li><a href="#products">Huile de friture</a></li>
                            <li><a href="#products">Voir tout</a></li>
                        </ul>
                    </div>

                    <div className="sitemap-category">
                        <h3>Contact</h3>
                        <ul>
                            <li><a href="tel:+212661373204">+212 (661) 37 32 04</a></li>
                            <li><a href="tel:+212535942682">+212 (535) 94 26 82</a></li>
                            <li><a href="mailto:contact@dikafood.com">contact@dikafood.com</a></li>
                            <li>
                                <a 
                                    href="https://maps.app.goo.gl/mJRgbWpwp2ZVFtnx8" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                >
                                    18 Rue Zenata Quartier Industriel Dokkarat, Fes
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Copyright Section */}
            <div className="copyright">
                <div className="copyright-content">
                    <p>© {currentYear} Dikafood. Tous droits réservés</p>
                    <div className="legal-links">
                        <Link to="/terms">Conditions générales</Link>
                        <span className="separator">•</span>
                        <Link to="/privacy">Politique de confidentialité</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
