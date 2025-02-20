import React from 'react';
import './benefit-card.scss';
import { memo } from 'react';

const BenefitCard = memo(({ Icon, title, descp, ariaLabel, isMobile }) => {
    return (
        <div 
            className={`benefit-card ${isMobile ? 'mobile' : ''}`}
            role="article"
            aria-label={ariaLabel}
        >
            <div className="content">
                <div className="icon-wrapper" aria-hidden="true">
                    <Icon size={isMobile ? 24 : 32} weight="duotone" />
                </div>
                <div className="text-content">
                    <h3>{title}</h3>
                    <p>{descp}</p>
                </div>
            </div>
        </div>
    );
});

BenefitCard.displayName = 'BenefitCard';

export default BenefitCard; 