import React from 'react';
import { Link } from 'react-router-dom';
import './footer.scss';
import logoUrl from "../../../assets/svg/dikafood-logo-main-3.svg";

export const scrollToContactForm = () => {
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
    const siteMap = {
        "Notre Entreprise": [
            { name: "À propos", link: "/about" },
            { name: "Notre Histoire", link: "/history" },
            { name: "Nos Valeurs", link: "/values" }
        ],
        "Nos Produits": [
            { name: "Huile d'Olive", link: "/products/olive-oil" },
            { name: "Huile de Tournesol", link: "/products/sunflower-oil" },
            { name: "Huile de Table", link: "/products/table-oil" }
        ],
        "Ressources": [
            { name: "Blog", link: "/blog" },
            { name: "FAQ", link: "#faq" },
            { name: "Contact", link: "#contact-form" }
        ]
    };

    return (
        <footer className="footer-section">
            <div className="footer-container">
                {/* Brand Section */}
                <div className="brand-section">
                    <div className="logo-wrapper">
                        <img src={logoUrl} alt="DikaFood Logo" className="footer-logo" />
                    </div>
                    <p>
                        Votre partenaire de confiance pour des huiles d'exception, 
                        alliant tradition marocaine et qualité supérieure.
                    </p>
                </div>

                {/* Sitemap Section */}
                <div className="sitemap-section">
                    {Object.entries(siteMap).map(([category, links]) => (
                        <div key={category} className="sitemap-category">
                            <h3>{category}</h3>
                            <ul>
                                {links.map((link) => (
                                    <li key={link.link}>
                                        <Link to={link.link}>{link.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </footer>
    );
}
