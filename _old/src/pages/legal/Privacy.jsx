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
                        <p>
                            Les données que nous pouvons collecter incluent :
                        </p>
                        <ul>
                            <li>Informations d'identification (nom, prénom, adresse email, téléphone)</li>
                            <li>Données de connexion et d'utilisation de notre site</li>
                            <li>Informations relatives à vos demandes et commandes</li>
                            <li>Données de correspondance lorsque vous nous contactez</li>
                        </ul>
                    </section>

                    <section>
                        <h2>2. Utilisation des données</h2>
                        <p>
                            Les données collectées sont utilisées pour :
                        </p>
                        <ul>
                            <li>Traiter vos commandes et demandes</li>
                            <li>Améliorer nos services et produits</li>
                            <li>Personnaliser votre expérience sur notre site</li>
                            <li>Communiquer avec vous concernant nos produits et services</li>
                            <li>Assurer la sécurité de notre site et se conformer à nos obligations légales</li>
                        </ul>
                        <p>
                            Nous ne vendons jamais vos données personnelles à des tiers. Nous pouvons
                            partager certaines informations avec des prestataires de services qui nous
                            aident à opérer notre site, mais uniquement dans la mesure nécessaire à la
                            fourniture de ces services.
                        </p>
                    </section>

                    <section>
                        <h2>3. Protection des données</h2>
                        <p>
                            Nous mettons en œuvre toutes les mesures techniques et organisationnelles nécessaires pour protéger
                            vos données personnelles contre tout accès non autorisé, modification,
                            divulgation ou destruction.
                        </p>
                        <p>
                            Ces mesures incluent, sans s'y limiter :
                        </p>
                        <ul>
                            <li>Utilisation de connexions sécurisées (HTTPS)</li>
                            <li>Stockage sécurisé des données sensibles</li>
                            <li>Restriction des accès aux données personnelles</li>
                            <li>Évaluation régulière de nos pratiques de sécurité</li>
                        </ul>
                    </section>

                    <section>
                        <h2>4. Utilisation des cookies</h2>
                        <p>
                            Notre site utilise des cookies pour améliorer votre expérience de navigation,
                            analyser l'utilisation du site et personnaliser le contenu.
                        </p>
                        <p>
                            Types de cookies que nous utilisons :
                        </p>
                        <ul>
                            <li><strong>Cookies essentiels</strong> : nécessaires au fonctionnement du site</li>
                            <li><strong>Cookies analytiques</strong> : pour comprendre comment les visiteurs interagissent avec notre site</li>
                            <li><strong>Cookies de préférence</strong> : pour mémoriser vos préférences</li>
                        </ul>
                        <p>
                            Vous pouvez configurer votre navigateur pour refuser tous les cookies ou vous alerter
                            lorsqu'un cookie est envoyé. Cependant, certaines fonctionnalités du site peuvent ne
                            pas fonctionner correctement si les cookies sont désactivés.
                        </p>
                    </section>

                    <section>
                        <h2>5. Durée de conservation des données</h2>
                        <p>
                            Nous conservons vos données personnelles uniquement pour la durée nécessaire aux
                            finalités pour lesquelles elles ont été collectées, ou pour se conformer à nos
                            obligations légales.
                        </p>
                        <p>
                            Les données relatives aux commandes sont conservées pour une durée de 5 ans à
                            compter de la transaction.
                        </p>
                        <p>
                            Les données de compte sont conservées tant que votre compte est actif ou
                            nécessaire pour vous fournir nos services.
                        </p>
                    </section>

                    <section>
                        <h2>6. Vos droits</h2>
                        <p>
                            Conformément aux réglementations en vigueur, vous disposez des droits suivants
                            concernant vos données personnelles :
                        </p>
                        <ul>
                            <li>Droit d'accès à vos données</li>
                            <li>Droit de rectification des données inexactes</li>
                            <li>Droit à l'effacement de vos données (droit à l'oubli)</li>
                            <li>Droit à la limitation du traitement</li>
                            <li>Droit à la portabilité des données</li>
                            <li>Droit d'opposition au traitement</li>
                        </ul>
                        <p>
                            Pour exercer ces droits, veuillez nous contacter à l'adresse email suivante :
                            <a href="mailto:privacy@dikafood.com">privacy@dikafood.com</a>
                        </p>
                    </section>

                    <section>
                        <h2>7. Modifications de la politique de confidentialité</h2>
                        <p>
                            Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment.
                            Toute modification sera publiée sur cette page avec une date de mise à jour.
                        </p>
                        <p>
                            Nous vous encourageons à consulter régulièrement cette politique pour rester
                            informé de la manière dont nous protégeons vos informations.
                        </p>
                    </section>

                    <section>
                        <h2>8. Contact</h2>
                        <p>
                            Si vous avez des questions concernant cette politique de confidentialité,
                            veuillez nous contacter à :
                        </p>
                        <p>
                            <strong>DikaFood</strong><br />
                            Email : <a href="mailto:privacy@dikafood.com">privacy@dikafood.com</a><br />
                            Adresse : 18 Rue Zenata Quartier Industriel Dokkarat, Fes, Maroc
                        </p>
                    </section>

                    <section className="legal-footer">
                        <p>Dernière mise à jour : 1 avril 2024</p>
                    </section>
                </div>
            </div>
        </>
    );
};

export default Privacy;