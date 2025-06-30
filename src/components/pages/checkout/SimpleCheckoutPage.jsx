import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { useCheckout } from '@/hooks/useCheckout';
import Page from '@/components/ui/layout/Page';
import CheckoutSteps from './components/CheckoutSteps';
import SimpleContactForm from './components/SimpleContactForm';
import SimpleDeliveryForm from './components/SimpleDeliveryForm';
import SimplePaymentForm from './components/SimplePaymentForm';
import RecapForm from './components/RecapForm';
import OrderConfirmation from './components/OrderConfirmation';
import Sidebar from './components/Sidebar';

const SimpleCheckoutPage = () => {
  const { cart, calculateTotals } = useCart();
  const checkout = useCheckout();
  
  // Calculate totals
  const { subtotal, shipping, tax, total } = calculateTotals();

  // Format currency
  const formatMAD = (value) => {
    return `${value.toFixed(2)} DH`;
  };

  // Step content renderer
  const renderStepContent = () => {
    switch (checkout.currentStep) {
      case 0:
        return (
          <SimpleContactForm
            formData={checkout.formData}
            updateFormData={checkout.updateFormData}
            nextStep={checkout.nextStep}
            prevStep={checkout.prevStep}
            errors={checkout.errors}
            isLoading={checkout.isLoading}
          />
        );
      
      case 1:
        return (
          <SimpleDeliveryForm
            formData={checkout.formData}
            updateFormData={checkout.updateFormData}
            nextStep={checkout.nextStep}
            prevStep={checkout.prevStep}
            errors={checkout.errors}
            isLoading={checkout.isLoading}
            deliveryMethods={checkout.deliveryMethods}
            loadingStates={checkout.loadingStates}
          />
        );
      
      case 2:
        return (
          <SimplePaymentForm
            formData={checkout.formData}
            updateFormData={checkout.updateFormData}
            nextStep={checkout.nextStep}
            prevStep={checkout.prevStep}
            errors={checkout.errors}
            isLoading={checkout.isLoading}
            banks={checkout.banks}
            loadingStates={checkout.loadingStates}
          />
        );
      
      case 3:
        return (
          <RecapForm
            formData={checkout.formData}
            cart={cart}
            orderDetails={checkout.orderDetails}
            total={total}
            formatMAD={formatMAD}
            placeOrder={checkout.placeOrder}
            prevStep={checkout.prevStep}
          />
        );
      
      case 4:
        return (
          <OrderConfirmation
            orderId={checkout.orderId}
            formData={checkout.formData}
            cart={cart}
            orderDetails={checkout.orderDetails}
            total={total}
            formatMAD={formatMAD}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <Page
      title="Commande"
      description="Finalisez votre commande en quelques étapes simples"
      canonicalUrl="/checkout"
      backgroundClass="bg-gradient-to-br from-lime-50/50 to-light-yellow-1/30"
    >
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1 max-w-2xl mx-auto lg:mx-0">
            {/* Steps Indicator */}
            <CheckoutSteps 
              currentStep={checkout.currentStep}
              completedSteps={checkout.completedSteps}
            />
            
            {/* Step Content */}
            <div className="mt-6">
              {renderStepContent()}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <Sidebar
              cart={cart}
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              total={total}
              formatMAD={formatMAD}
              isLoading={checkout.isLoading}
            />
          </div>
        </div>
      </div>
    </Page>
  );
};

export default SimpleCheckoutPage; 