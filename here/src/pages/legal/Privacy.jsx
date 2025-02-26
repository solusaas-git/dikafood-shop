import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Shield } from "@phosphor-icons/react";
import SectionHeader from '../../components/ui/section/SectionHeader';
import BackToHome from '../../components/ui/navigation/BackToHome';
import './legal.scss';

const Privacy = () => {
    return (
        <>
            <Helmet>
                <title>Politique de confidentialité - DikaFood</title>
                <meta name="description" content="Politique de confidentialité de DikaFood" />
            </Helmet>

            <BackToHome />

            <div className="legal-page">
                <SectionHeader
                    icon={Shield}
                    title="Politique de confidentialité"
                    subtitle="Comment nous protégeons vos données"
                    variant="light"
                />

                <div className="legal-content">
                    <section>
                        <h2>1. Collecte des données</h2>
                        <p>
                            Nous collectons uniquement les données nécessaires au bon fonctionnement 
                            de nos services et à l'amélioration de votre expérience utilisateur.
                        </p>
                    </section>

                    <section>
                        <h2>2. Utilisation des données</h2>
                        <p>
                            Les données collectées sont utilisées pour :
                        </p>
                        <ul>
                            <li>Traiter vos commandes et demandes</li>
                            <li>Améliorer nos services</li>
                            <li>Communiquer avec vous</li>
                        </ul>
                    </section>

                    <section>
                        <h2>3. Protection des données</h2>
                        <p>
                            Nous mettons en œuvre toutes les mesures nécessaires pour protéger 
                            vos données personnelles contre tout accès non autorisé.
                        </p>
                    </section>

                    {/* Add more sections as needed */}
                </div>
            </div>
        </>
    );
};

export default Privacy; 