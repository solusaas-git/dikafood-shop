import React, { useState, useEffect } from 'react';
import { memo } from 'react';
import { Medal } from "@phosphor-icons/react";
import "./benefits.scss";
import { benefitsData } from '../../../data/benefits';
import BenefitCard from '../../../components/cards/benefit/BenefitCard';
import SectionHeader from '../../../components/ui/section/SectionHeader';

const NewBenefits = memo(() => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <section 
            className={`new-benefits ${isMobile ? 'mobile' : ''}`}
            aria-labelledby="benefits-title"
        >
            <div className="container">
                <SectionHeader 
                    icon={Medal}
                    title="Notre Engagement Qualité"
                    subtitle="Découvrez ce qui rend notre huile d'olive exceptionnelle"
                    variant="dark"
                    isMobile={isMobile}
                />
                <div 
                    className="benefits-grid"
                    role="region"
                    aria-label="Notre Engagement Qualité"
                >
                    {benefitsData.map((benefit) => (
                        <BenefitCard
                            key={benefit.id}
                            Icon={benefit.Icon}
                            title={benefit.title}
                            descp={benefit.description}
                            ariaLabel={benefit.ariaLabel}
                            isMobile={isMobile}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
});

NewBenefits.displayName = 'NewBenefits';

export default NewBenefits;
