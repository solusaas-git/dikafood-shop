import React from 'react';
import Button from '../../../components/buttons/Button';
import "./copyright.scss";

export default function Copyright() {
    const legalLinks = [
        { name: "Politique des cookies", link: "/cookies" },
        { name: "Mentions légales", link: "/legal" },
        { name: "Vie Privée", link: "/privacy" }
    ];

    return (
        <section className="copyright-section">
            <div className="copyright-container">
                <div className="copyright-text">
                    DikaFood © {new Date().getFullYear()} - tous droits réservés
                </div>
                <nav className="legal-menu">
                    {legalLinks.map((item) => (
                        <Button 
                            key={item.link}
                            buttonName={item.name} 
                            link={item.link}
                            size="small" 
                            theme="button-comp-link green" 
                        />
                    ))}
                </nav>
            </div>
        </section>
    );
} 