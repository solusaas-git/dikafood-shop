import React from 'react';
import Icon from '@/components/ui/icons/Icon';

/**
 * CheckoutFooter Component
 * Fixed footer with navigation buttons and step indicator for checkout process
 * 
 * @param {Object} props - Component props
 * @param {number} props.currentStep - Current step index (0-based)
 * @param {number} props.totalSteps - Total number of steps
 * @param {Function} props.onPrevious - Previous step handler
 * @param {Function} props.onNext - Next step handler
 * @param {Function} props.onPlaceOrder - Place order handler (for final step)
 * @param {Function} props.onCancel - Cancel order handler
 * @param {boolean} props.isLoading - Loading state
 * @param {boolean} props.canGoNext - Whether next step is available
 * @param {boolean} props.canGoPrevious - Whether previous step is available
 * @param {string} props.nextButtonText - Text for next button
 * @param {string} props.previousButtonText - Text for previous button
 */
const CheckoutFooter = ({
  currentStep = 0,
  totalSteps = 3,
  onPrevious,
  onNext,
  onPlaceOrder,
  onCancel,
  isLoading = false,
  canGoNext = true,
  canGoPrevious = true,
  nextButtonText = 'Continuer',
  previousButtonText = 'Retour'
}) => {
  const stepNames = ['Contact', 'Livraison', 'Récapitulatif'];
  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;
  const showCancelButton = currentStep > 0; // Show cancel button after first step

  const handleNext = () => {
    if (isLastStep && onPlaceOrder) {
      onPlaceOrder();
    } else if (onNext) {
      onNext();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-logo-lime/20 shadow-lg">
      <div className="bg-gradient-to-r from-light-yellow-1/30 to-light-yellow-2/20">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Step Indicator */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3">
                {stepNames.map((stepName, index) => (
                  <div key={index} className="flex items-center">
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                        index <= currentStep 
                          ? 'bg-logo-lime/20 text-dark-green-7 border border-logo-lime/30' 
                          : 'bg-gray-100 text-gray-500 border border-gray-200'
                      }`}>
                        {index < currentStep ? (
                          <Icon name="check" size="sm" className="text-dark-green-7" />
                        ) : (
                          <span>{index + 1}</span>
                        )}
                      </div>
                      <span className={`text-sm font-medium transition-colors ${
                        index <= currentStep 
                          ? 'text-dark-green-7' 
                          : 'text-gray-500'
                      }`}>
                        {stepName}
                      </span>
                    </div>
                    {index < stepNames.length - 1 && (
                      <div className={`w-8 h-0.5 mx-3 transition-colors ${
                        index < currentStep ? 'bg-logo-lime/30' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              
              {/* Mobile step indicator */}
              <div className="flex sm:hidden items-center gap-2">
                <span className="text-sm text-dark-green-6">
                  Étape {currentStep + 1} sur {totalSteps}
                </span>
                <div className="flex gap-1">
                  {Array.from({ length: totalSteps }).map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index <= currentStep ? 'bg-logo-lime' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-3">
              {/* Cancel Button - Only show after first step */}
              {showCancelButton && onCancel && (
                <button
                  onClick={onCancel}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white text-red-600 font-medium rounded-full border border-red-300 hover:bg-red-50 transition-all hover:-translate-y-0.5 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  <Icon name="x" size="sm" className="text-red-600" />
                  Annuler
                </button>
              )}

              {!isFirstStep && canGoPrevious && (
                <button
                  onClick={onPrevious}
                  className="flex items-center justify-center gap-2 py-2.5 px-5 bg-white text-dark-green-7 font-medium rounded-full border border-gray-300 hover:bg-gray-50 transition-all hover:-translate-y-0.5 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  <Icon name="arrowLeft" size="sm" className="text-dark-green-7" />
                  {previousButtonText}
                </button>
              )}
              
              <button
                onClick={handleNext}
                className="flex items-center justify-center gap-2 py-2.5 px-6 bg-logo-lime/20 text-dark-green-7 font-medium rounded-full border border-logo-lime/30 hover:bg-logo-lime/30 transition-all hover:-translate-y-0.5 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
                disabled={isLoading || !canGoNext}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent animate-spin rounded-full" />
                    Traitement...
                  </>
                ) : (
                  <>
                    {isLastStep ? 'Finaliser' : nextButtonText}
                    <Icon name="arrowRight" size="sm" className="text-dark-green-7" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutFooter; 