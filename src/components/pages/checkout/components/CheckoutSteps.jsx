import React from 'react';
import { MapPin, CreditCard, CheckCircle, CaretRight } from '@phosphor-icons/react';

const CheckoutSteps = ({ currentStep, isRecovering = false }) => {
  const steps = [
    {
      name: 'Contact & Localisation',
      shortName: 'Contact',
      icon: <MapPin className="w-4 h-4 md:w-[18px] md:h-[18px]" weight="duotone" />
    },
    {
      name: 'Paiement & Livraison',
      shortName: 'Paiement',
      icon: <CreditCard className="w-4 h-4 md:w-[18px] md:h-[18px]" weight="duotone" />
    }
  ];

  return (
    <div className={`flex items-center justify-center px-2 ${isRecovering ? 'opacity-75' : ''}`}>
      {steps.map((step, index) => {
        // Determine if step is active, completed or default
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <React.Fragment key={step.name}>
            <div
              className={`
                flex items-center py-1 px-2 md:px-3 rounded-full text-xs md:text-sm transition-all duration-300
                ${isActive
                  ? 'bg-logo-lime/20 text-logo-brown'
                  : isCompleted
                    ? 'text-logo-brown'
                    : 'text-gray-500'
                }
                ${isRecovering ? 'animate-pulse' : ''}
              `}
            >
              <div className={`
                w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center mr-1.5 md:mr-2 transition-all duration-300
                ${isActive
                  ? 'bg-logo-lime text-white'
                  : isCompleted
                    ? 'bg-logo-lime text-white'
                    : 'bg-gray-200 text-gray-500'
                }
              `}>
                {isCompleted ? (
                  <CheckCircle className="w-4 h-4 md:w-[18px] md:h-[18px]" weight="fill" />
                ) : (
                  step.icon
                )}
              </div>
              <span className="md:hidden">
                {step.shortName}
              </span>
              <span className="hidden md:inline">
                {step.name}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div className={`
                mx-1 md:mx-2 flex items-center transition-all duration-300
                ${isCompleted ? 'text-logo-lime' : 'text-gray-300'}
              `}>
                <CaretRight className="w-2.5 h-2.5 md:w-3 md:h-3" weight="bold" />
                <CaretRight className="w-2.5 h-2.5 md:w-3 md:h-3 -ml-0.5 md:-ml-1" weight="bold" />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default CheckoutSteps;