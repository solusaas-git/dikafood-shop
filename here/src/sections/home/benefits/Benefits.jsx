import React, { useState, useEffect } from 'react';
import { memo } from 'react';
import { Medal } from "@phosphor-icons/react";
import { useTranslation } from 'react-i18next';
import "./benefits.scss";
import { benefitsData } from '../../../data/benefits';
import BenefitCard from '../../../components/cards/benefit/BenefitCard';
import SectionHeader from '../../../components/ui/section/SectionHeader';

const NewBenefits = memo(() => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const { t } = useTranslation();

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
                    title={t('benefits.title')}
                    subtitle={t('benefits.subtitle')}
                    variant="dark"
                    isMobile={isMobile}
                />
                <div 
                    className="benefits-grid"
                    role="region"
                    aria-label={t('benefits.title')}
                >
                    {benefitsData.map((benefit) => (
                        <BenefitCard
                            key={benefit.id}
                            Icon={benefit.Icon}
                            title={t(`benefits.items.${benefit.id}.title`)}
                            descp={t(`benefits.items.${benefit.id}.description`)}
                            ariaLabel={t(`benefits.items.${benefit.id}.ariaLabel`)}
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
