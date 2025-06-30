import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Clock, Handshake, Leaf, Users } from '@phosphor-icons/react';
import './about.scss';

const About = () => {
    return (
        <div className="about-page">
            <Helmet>
                <title>À propos - DikaFood</title>
                <meta name="description" content="Découvrez qui nous sommes, notre mission et nos engagements chez DikaFood" />
            </Helmet>

            <section className="about-hero">
                <div className="container">
                    <div className="about-content">
                        <div className="text-section">
                            <h2>
                                <Clock size={24} weight="duotone" />
                                Notre Histoire
                            </h2>
                            <p>
                                Depuis notre création, DikaFood s'est engagé à fournir des produits alimentaires de qualité supérieure
                                tout en maintenant des relations durables avec nos producteurs locaux. Notre voyage a commencé avec
                                une vision simple : rendre accessible une alimentation saine et durable à tous.
                            </p>
                        </div>

                        <div className="text-section">
                            <h2>
                                <Handshake size={24} weight="duotone" />
                                Notre Mission
                            </h2>
                            <p>
                                Notre mission est de créer un pont entre les producteurs locaux et les consommateurs, en garantissant
                                la qualité et la traçabilité de chaque produit. Nous nous efforçons de promouvoir une alimentation
                                responsable tout en soutenant l'économie locale.
                            </p>
                        </div>

                        <div className="text-section">
                            <h2>
                                <Leaf size={24} weight="duotone" />
                                Notre Engagement
                            </h2>
                            <p>
                                La durabilité est au cœur de nos opérations. Nous nous engageons à minimiser notre impact
                                environnemental, à soutenir les pratiques agricoles durables et à promouvoir une consommation
                                responsable. Chaque produit dans notre catalogue est sélectionné avec soin pour répondre à nos
                                standards élevés de qualité et d'éthique.
                            </p>
                        </div>

                        <div className="text-section">
                            <h2>
                                <Users size={24} weight="duotone" />
                                Notre Équipe
                            </h2>
                            <p>
                                Notre équipe passionnée travaille sans relâche pour vous offrir le meilleur service possible.
                                De la sélection des produits à la livraison, chaque membre de notre équipe partage notre
                                engagement envers l'excellence et la satisfaction client.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;