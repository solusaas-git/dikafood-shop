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
                            Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser ce site.
                        </p>
                        <p>
                            DikaFood se réserve le droit de modifier ces conditions à tout moment.
                            Vous êtes donc invité à consulter régulièrement cette page pour prendre
                            connaissance des mises à jour.
                        </p>
                    </section>

                    <section>
                        <h2>2. Propriété intellectuelle</h2>
                        <p>
                            Tout le contenu de ce site (textes, images, logos, vidéos, design, structure, etc.) est la propriété
                            exclusive de DikaFood ou de ses partenaires. Ce contenu est protégé par les lois marocaines et
                            internationales relatives à la propriété intellectuelle.
                        </p>
                        <p>
                            Toute reproduction, distribution, modification, adaptation, retransmission ou publication,
                            même partielle, de ces différents éléments est strictement interdite sans l'accord exprès
                            par écrit de DikaFood. Cette représentation ou reproduction, par quelque procédé que ce soit,
                            constitue une contrefaçon sanctionnée par les articles L.335-2 et suivants du Code de la propriété intellectuelle.
                        </p>
                    </section>

                    <section>
                        <h2>3. Responsabilité</h2>
                        <p>
                            DikaFood s'efforce d'assurer l'exactitude des informations présentes sur
                            le site mais ne peut garantir leur exhaustivité ou leur actualité. Le contenu
                            du site est fourni "tel quel" sans aucune garantie d'aucune sorte, explicite ou implicite.
                        </p>
                        <p>
                            DikaFood ne pourra être tenu responsable des dommages directs ou indirects résultant
                            de l'utilisation de ce site web ou de l'impossibilité d'y accéder.
                        </p>
                    </section>

                    <section>
                        <h2>4. Liens vers d'autres sites</h2>
                        <p>
                            Ce site peut contenir des liens vers d'autres sites. DikaFood n'a aucun contrôle
                            sur le contenu de ces sites tiers et ne peut assumer aucune responsabilité quant
                            à leur contenu, produits, services ou tout autre élément disponible sur ou à partir de ces sites.
                        </p>
                    </section>

                    <section>
                        <h2>5. Protection des données personnelles</h2>
                        <p>
                            Les informations collectées sur ce site sont utilisées uniquement dans le cadre
                            légal prévu en France et au Maroc concernant la protection de la vie privée. Conformément
                            à la législation en vigueur, vous disposez d'un droit d'accès, de rectification et de suppression
                            des données vous concernant.
                        </p>
                        <p>
                            Pour plus d'informations sur la façon dont nous traitons vos données,
                            veuillez consulter notre <a href="/privacy">Politique de confidentialité</a>.
                        </p>
                    </section>

                    <section>
                        <h2>6. Utilisation des cookies</h2>
                        <p>
                            Ce site utilise des cookies pour améliorer l'expérience utilisateur et collecter
                            des statistiques de visite. En naviguant sur ce site, vous acceptez l'utilisation de ces cookies.
                        </p>
                        <p>
                            Pour plus d'informations sur notre utilisation des cookies, veuillez consulter
                            notre <a href="/privacy">Politique de confidentialité</a>.
                        </p>
                    </section>

                    <section>
                        <h2>7. Droit applicable et juridiction compétente</h2>
                        <p>
                            Les présentes conditions sont régies par le droit marocain. En cas de litige,
                            les tribunaux marocains seront seuls compétents.
                        </p>
                    </section>

                    <section>
                        <h2>8. Contact</h2>
                        <p>
                            Pour toute question concernant ces conditions d'utilisation, vous pouvez nous contacter à l'adresse suivante :
                            <a href="mailto:legal@dikafood.com">legal@dikafood.com</a>
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

export default Terms;