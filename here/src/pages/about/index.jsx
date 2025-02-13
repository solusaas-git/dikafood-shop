import React from 'react';
import { Buildings } from "@phosphor-icons/react";
import SectionHeader from '../../components/ui/section/SectionHeader';
import Footer from '../../sections/shared/footer/Footer';
import Copyright from '../../sections/shared/copyright/Copyright';
import './about.scss';

export default function AboutPage() {
    return (
        <main className="about-page">
            <section className="about-hero section-spacing-top">
                <div className="container">
                    <SectionHeader 
                        icon={Buildings}
                        title="À Propos de DikaFood"
                        subtitle="Découvrez notre histoire, notre mission et nos valeurs"
                        variant="light"
                    />
                    
                    <div className="about-content">
                        <div className="text-section">
                            <h2>Notre Mission</h2>
                            <p>
                                Chez DikaFood, notre mission est de fournir des huiles d'olive et végétales 
                                de la plus haute qualité, en respectant les traditions marocaines tout en 
                                adoptant des pratiques modernes et durables.
                            </p>
                        </div>

                        <div className="text-section">
                            <h2>Notre Expertise</h2>
                            <p>
                                Avec des années d'expérience dans la production d'huile, nous combinons 
                                savoir-faire traditionnel et technologies modernes pour créer des produits 
                                d'exception qui répondent aux plus hauts standards de qualité.
                            </p>
                        </div>

                        <div className="text-section">
                            <h2>Notre Engagement</h2>
                            <p>
                                Nous nous engageons à maintenir les plus hauts standards de qualité, 
                                de la sélection des olives à la mise en bouteille, en passant par 
                                des contrôles rigoureux à chaque étape de la production.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
            <Copyright />
        </main>
    );
} 