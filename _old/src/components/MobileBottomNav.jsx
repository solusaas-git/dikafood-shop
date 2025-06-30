import React from 'react';
import { MapPin, CreditCard, CheckCircle, ArrowLeft, ArrowRight, ShoppingBagOpen } from '@phosphor-icons/react';

const MobileBottomNav = ({ currentStep, totalSteps, prevStep, nextStep, placeOrder }) => {
  const steps = [
    { name: 'Contact', icon: <MapPin size={20} weight="duotone" /> },
    { name: 'Paiement', icon: <CreditCard size={20} weight="duotone" /> },
    { name: 'Récap', icon: <CheckCircle size={20} weight="duotone" /> }
  ];

  const isRecapStep = currentStep === 2;

  return (
    <div className="mobile-bottom-nav">
      <div className="mobile-steps-container">
        <div className="mobile-nav-actions">
          <button
            className="nav-btn btn-back"
            onClick={prevStep}
            disabled={currentStep === 0}
            aria-label="Étape précédente"
          >
            <ArrowLeft size={20} weight="bold" />
          </button>
        </div>

        <div className="mobile-steps">
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            const stepClassName = `mobile-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`;

            return (
              <div className={stepClassName} key={index}>
                <div className="step-icon">
                  {isCompleted ? <CheckCircle size={20} weight="duotone" /> : step.icon}
                </div>
                <span className="step-label">{step.name}</span>
              </div>
            );
          })}
        </div>

        <div className="mobile-nav-actions">
          {isRecapStep ? (
            <button
              className="nav-btn btn-order"
              onClick={placeOrder}
              aria-label="Passer commande"
            >
              <ShoppingBagOpen size={20} weight="bold" />
            </button>
          ) : (
            <button
              className="nav-btn btn-next"
              onClick={nextStep}
              disabled={currentStep === totalSteps - 1}
              aria-label="Étape suivante"
            >
              <ArrowRight size={20} weight="bold" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileBottomNav;