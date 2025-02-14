import React, { useState } from 'react';
import { Buildings } from "@phosphor-icons/react";
import { brandsData } from '../../../data/brands';
import SectionHeader from '../../../components/ui/section/SectionHeader';
import './brands.scss';

export default function Brands() {
    const [activeBrand, setActiveBrand] = useState(brandsData[0]);

    return (
        <section className="brands-section">
            <div className="container">
                <SectionHeader 
                    icon={Buildings}
                    title="Nos Marques"
                    subtitle="Découvrez notre gamme complète d'huiles de qualité supérieure"
                    variant="light"
                />

                <div className="brands-tabs">
                    <div className="tabs-header">
                        {brandsData.map((brand) => {
                            const BrandIcon = brand.icon;
                            return (
                                <button
                                    key={brand.id}
                                    className={`tab-button ${activeBrand.id === brand.id ? 'active' : ''}`}
                                    onClick={() => setActiveBrand(brand)}
                                    aria-selected={activeBrand.id === brand.id}
                                    role="tab"
                                >
                                    <div className="brand-info">
                                        <div className="brand-icon">
                                            <BrandIcon weight="duotone" />
                                        </div>
                                        <span className="brand-name">{brand.title}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <div className="brand-content" role="tabpanel">
                        <div className="brand-details">
                            <div className="brand-header">
                                <div className="brand-title">
                                    <h3>{activeBrand.title}</h3>
                                    <span className="brand-type">{activeBrand.type}</span>
                                </div>
                                <div className="brand-image">
                                    <img 
                                        src={activeBrand.image} 
                                        alt={`Logo ${activeBrand.title}`}
                                        draggable="false"
                                    />
                                </div>
                            </div>
                            
                            <div className="brand-description">
                                <p>{activeBrand.description}</p>
                                
                                <div className="brand-specs">
                                    <div className="spec-item">
                                        <h4>Caractéristiques</h4>
                                        <p>{activeBrand.characteristics}</p>
                                    </div>
                                    <div className="spec-item">
                                        <h4>Utilisation</h4>
                                        <p>{activeBrand.usage}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
