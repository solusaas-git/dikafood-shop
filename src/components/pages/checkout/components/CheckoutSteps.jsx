import React, { useState, useEffect } from 'react';
import { MapPin, CreditCard, CheckCircle, CaretRight } from '@phosphor-icons/react';

const CheckoutSteps = ({ currentStep, isRecovering = false }) => {
  const [isMobile, setIsMobile] = useState(false);

  // Initialize mobile state after component mounts (SSR safe)
  useEffect(() => {
    setIsMobile(window.innerWidth <= 576);
  }, []);

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
    }
  ];

  return (
    <div className={`flex items-center justify-center ${isRecovering ? 'opacity-75' : ''}`}>
      {steps.map((step, index) => {
        // Determine if step is active, completed or default
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <React.Fragment key={step.name}>
            <div
              className={`
                flex items-center py-1 px-3 rounded-full text-sm transition-all duration-300
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
                w-6 h-6 rounded-full flex items-center justify-center mr-2 transition-all duration-300
                ${isActive
                  ? 'bg-logo-lime text-white'
                  : isCompleted
                    ? 'bg-logo-lime text-white'
                    : 'bg-gray-200 text-gray-500'
                }
              `}>
                {isCompleted ? (
                  <CheckCircle size={isMobile ? 16 : 18} weight="fill" />
                ) : (
                  step.icon
                )}
              </div>
              <span>
                {isMobile ? step.shortName : step.name}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div className={`
                mx-2 flex items-center transition-all duration-300
                ${isCompleted ? 'text-logo-lime' : 'text-gray-300'}
              `}>
                <CaretRight size={isMobile ? 10 : 12} weight="bold" />
                <CaretRight size={isMobile ? 10 : 12} weight="bold" className="-ml-1" />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default CheckoutSteps;