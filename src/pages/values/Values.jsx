import React from 'react';
import { Heart, Leaf, HandHeart, ShieldStar } from '@phosphor-icons/react';
import './values.scss';

const Values = () => {
    return (
        <div className="values-page">
            <section className="values-hero section-spacing-top">
                <div className="container">
                    <div className="values-content">
                        <div className="text-section">
                            <h2>
                                <Heart size={24} weight="duotone" />
                                Authenticité
                            </h2>
                            <p>
                                L'authenticité est au cœur de notre démarche. Nous nous engageons à maintenir 
                                la pureté et l'intégrité de nos produits, en préservant les méthodes traditionnelles 
                                tout en intégrant des innovations responsables pour garantir une qualité optimale.
                            </p>
                        </div>

                        <div className="text-section">
                            <h2>
                                <Leaf size={24} weight="duotone" />
                                Durabilité
                            </h2>
                            <p>
                                Notre engagement envers l'environnement se reflète dans chaque aspect de notre activité. 
                                De la culture des olives à l'emballage de nos produits, nous privilégions des pratiques 
                                durables et respectueuses de notre planète.
                            </p>
                        </div>

                        <div className="text-section">
                            <h2>
                                <HandHeart size={24} weight="duotone" />
                                Responsabilité Sociale
                            </h2>
                            <p>
                                Nous croyons en un commerce équitable qui bénéficie à tous. Notre collaboration étroite 
                                avec les producteurs locaux et notre engagement envers les communautés rurales témoignent 
                                de notre volonté de créer un impact social positif.
                            </p>
                        </div>

                        <div className="text-section">
                            <h2>
                                <ShieldStar size={24} weight="duotone" />
                                Excellence
                            </h2>
                            <p>
                                La recherche de l'excellence guide chacune de nos actions. Des contrôles qualité rigoureux 
                                à la satisfaction client, nous maintenons les plus hauts standards dans tous les aspects de 
                                notre activité.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Values; 