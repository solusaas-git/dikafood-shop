import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FileText } from "@phosphor-icons/react";
import SectionHeader from '../../components/ui/section/SectionHeader';
import BackToHome from '../../components/ui/navigation/BackToHome';
import './legal.scss';

const Terms = () => {
    return (
        <>
            <Helmet>
                <title>Conditions générales - DikaFood</title>
                <meta name="description" content="Conditions générales d'utilisation de DikaFood" />
            </Helmet>

            <BackToHome />

            <div className="legal-page">
                <SectionHeader
                    icon={FileText}
                    title="Conditions générales"
                    subtitle="Conditions générales d'utilisation de DikaFood"
                    variant="light"
                />

                <div className="legal-content">
                    <section>
                        <h2>1. Introduction</h2>
                        <p>
                            Les présentes conditions générales régissent l'utilisation de ce site web. 
                            En utilisant ce site, vous acceptez ces conditions dans leur intégralité.
                        </p>
                    </section>

                    <section>
                        <h2>2. Propriété intellectuelle</h2>
                        <p>
                            Tout le contenu de ce site (textes, images, logos, etc.) est la propriété 
                            exclusive de DikaFood. Toute reproduction est strictement interdite sans 
                            autorisation préalable.
                        </p>
                    </section>

                    <section>
                        <h2>3. Responsabilité</h2>
                        <p>
                            DikaFood s'efforce d'assurer l'exactitude des informations présentes sur 
                            le site mais ne peut garantir leur exhaustivité ou leur actualité.
                        </p>
                    </section>

                    {/* Add more sections as needed */}
                </div>
            </div>
        </>
    );
};

export default Terms; 