import React, { useState, useEffect } from 'react';
import { MapPin, CreditCard, CheckCircle, CaretRight } from '@phosphor-icons/react';

const CheckoutSteps = ({ currentStep }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 576);

  // Handle window resize for responsive steps
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 576);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const steps = [
    {
      name: 'Contact & Localisation',
      shortName: 'Contact',
      icon: <MapPin size={isMobile ? 16 : 18} weight="duotone" />
    },
    {
      name: 'Paiement & Livraison',
      shortName: 'Paiement',
      icon: <CreditCard size={isMobile ? 16 : 18} weight="duotone" />
    },
    {
      name: 'Récapitulatif',
      shortName: 'Récap',
      icon: <CheckCircle size={isMobile ? 16 : 18} weight="duotone" />
    }
  ];

  return (
    <div className="checkout-steps">
      {steps.map((step, index) => {
        // Determine if step is active, completed or default
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        // Apply the appropriate class
        const stepClassName = `step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`;

        return (
          <React.Fragment key={step.name}>
            <div className={stepClassName}>
              <div className="step-icon">
                {isCompleted ? (
                  <CheckCircle size={isMobile ? 16 : 18} weight="duotone" className="completed-icon" />
                ) : (
                  step.icon
                )}
              </div>
              <span className="step-text">
                {isMobile ? step.shortName : step.name}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div className={`step-divider ${isCompleted ? 'completed' : ''}`}>
                <CaretRight size={isMobile ? 10 : 12} weight="duotone" />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default CheckoutSteps;