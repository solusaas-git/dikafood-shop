import React from 'react';
import { Clock, Trophy, MapPin } from '@phosphor-icons/react';
import { Helmet } from 'react-helmet-async';
import './history.scss';

const History = () => {
    return (
        <div className="history-page">
            <Helmet>
                <title>Notre Histoire - DikaFood</title>
                <meta name="description" content="Découvrez l'histoire et le parcours de DikaFood depuis sa création" />
            </Helmet>
            <section className="history-hero section-spacing-top">
                <div className="container">
                    <div className="history-content">
                        <div className="text-section">
                            <h2>
                                <Clock size={24} weight="duotone" />
                                Nos Débuts
                            </h2>
                            <p>
                                L'histoire de DikaFood commence dans la région de Fès-Meknès, berceau de l'olivier au Maroc.
                                Fondée par des passionnés de l'huile d'olive, notre entreprise s'est construite sur une vision :
                                celle de partager l'excellence de l'huile d'olive marocaine avec le monde entier.
                            </p>
                        </div>

                        <div className="text-section">
                            <h2>
                                <Trophy size={24} weight="duotone" />
                                Notre Évolution
                            </h2>
                            <p>
                                Au fil des années, nous avons développé notre expertise et élargi notre gamme de produits.
                                De l'huile d'olive extra vierge à l'huile de tournesol, chaque produit témoigne de notre
                                engagement envers la qualité et l'innovation, tout en respectant les traditions ancestrales.
                            </p>
                        </div>

                        <div className="text-section">
                            <h2>
                                <MapPin size={24} weight="duotone" />
                                Notre Héritage
                            </h2>
                            <p>
                                Aujourd'hui, DikaFood est devenu un acteur majeur dans le secteur des huiles alimentaires au Maroc.
                                Notre succès repose sur des valeurs fortes : l'authenticité de nos produits, le respect de
                                l'environnement et le soutien aux communautés locales qui font partie intégrante de notre histoire.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default History;