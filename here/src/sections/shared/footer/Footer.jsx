import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './footer.scss';
import logoUrl from "../../../assets/svg/dikafood-logo-light-3.svg";

export const scrollToContactForm = () => {
    const formElement = document.querySelector('#contact-form');
    if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
    }
};

export default function Footer() {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer-section">
            <div className="footer-container">
                {/* Brand Section */}
                <div className="brand-section">
                    <div className="logo-wrapper">
                        <img 
                            src={logoUrl} 
                            alt={t('common.logoAlt')} 
                            className="footer-logo"
                        />
                    </div>
                    <p>{t('footer.description')}</p>
                </div>

                {/* Sitemap Section */}
                <div className="sitemap-section">
                    <div className="sitemap-category">
                        <h3>{t('footer.navigation.title')}</h3>
                        <ul>
                            <li><Link to="/">{t('nav.home')}</Link></li>
                            <li><Link to="/about">{t('nav.about')}</Link></li>
                            <li><Link to="/boutique">{t('nav.shop')}</Link></li>
                            <li><Link to="/blog">{t('nav.blog')}</Link></li>
                        </ul>
                    </div>

                    <div className="sitemap-category">
                        <h3>{t('footer.products.title')}</h3>
                        <ul>
                            <li><Link to="/boutique">{t('footer.products.oliveOil')}</Link></li>
                            <li><Link to="/boutique">{t('footer.products.tableOil')}</Link></li>
                            <li><Link to="/boutique">{t('footer.products.fryingOil')}</Link></li>
                            <li><Link to="/boutique">{t('footer.products.viewAll')}</Link></li>
                        </ul>
                    </div>

                    <div className="sitemap-category">
                        <h3>{t('footer.contact.title')}</h3>
                        <ul>
                            <li><a href="tel:+212661373204">{t('footer.contact.phone1')}</a></li>
                            <li><a href="tel:+212535942682">{t('footer.contact.phone2')}</a></li>
                            <li><a href="mailto:contact@dikafood.com">{t('footer.contact.email')}</a></li>
                            <li>
                                <a 
                                    href="https://maps.app.goo.gl/mJRgbWpwp2ZVFtnx8" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                >
                                    {t('footer.contact.address')}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Copyright Section */}
            <div className="copyright">
                <div className="copyright-content">
                    <p>© {currentYear} Dikafood. {t('footer.rights')}</p>
                    <div className="legal-links">
                        <Link to="/terms">{t('footer.terms')}</Link>
                        <span className="separator">•</span>
                        <Link to="/privacy">{t('footer.privacy')}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
