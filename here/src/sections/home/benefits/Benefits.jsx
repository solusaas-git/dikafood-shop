import React from 'react';
import { memo } from 'react';
import { Medal } from "@phosphor-icons/react";
import "./benefits.scss";
import { benefitsData } from '../../../data/benefits';
import BenefitCard from '../../../components/cards/benefit/BenefitCard';
import SectionHeader from '../../../components/ui/section/SectionHeader';

const NewBenefits = memo(() => {
    return (
        <section 
            className="new-benefits"
            aria-labelledby="benefits-title"
        >
            <div className="container">
                <SectionHeader 
                    icon={Medal}
                    title="Notre Engagement Qualité"
                    subtitle="Découvrez ce qui rend notre huile d'olive exceptionnelle"
                    variant="dark"
                />
                <div 
                    className="benefits-grid"
                    role="region"
                    aria-label="Nos avantages"
                >
                    {benefitsData.map((benefit) => (
                        <BenefitCard
                            key={benefit.id}
                            {...benefit}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
});

NewBenefits.displayName = 'NewBenefits';

export default NewBenefits;
