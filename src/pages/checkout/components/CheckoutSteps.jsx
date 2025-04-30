import React from 'react';
import { MapPin, CreditCard, CheckCircle, CaretRight } from '@phosphor-icons/react';

const CheckoutSteps = ({ currentStep }) => {
  const steps = [
    { name: 'Contact & Localisation', icon: <MapPin size={18} weight="duotone" /> },
    { name: 'Paiement & Livraison', icon: <CreditCard size={18} weight="duotone" /> },
    { name: 'Récapitulatif', icon: <CheckCircle size={18} weight="duotone" /> }
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
                  <CheckCircle size={18} weight="duotone" className="completed-icon" />
                ) : (
                  step.icon
                )}
              </div>
              <span className="step-text">{step.name}</span>
            </div>

            {index < steps.length - 1 && (
              <div className={`step-divider ${isCompleted ? 'completed' : ''}`}>
                <CaretRight size={12} weight="duotone" />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default CheckoutSteps;