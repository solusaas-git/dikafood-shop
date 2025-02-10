import { memo } from 'react';
import { Medal } from "@phosphor-icons/react";
import "./new-benefits.scss";
import { benefitsData } from '../data/benefits';
import BenefitCard from '../Components/BenefitCard';

const NewBenefits = memo(() => {
    return (
        <section 
            className="new-benefits"
            aria-labelledby="benefits-title"
        >
            <div className="container">
                <div className="section-header">
                    <div className="title-container">
                        <div className="title-content">
                            <div className="title-wrapper">
                                <Medal 
                                    size={48} 
                                    weight="duotone" 
                                    className="title-icon"
                                />
                                <h2 id="benefits-title">Notre Engagement Qualité</h2>
                            </div>
                            <p>Découvrez ce qui rend notre huile d'olive exceptionnelle</p>
                        </div>
                    </div>
                </div>
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
