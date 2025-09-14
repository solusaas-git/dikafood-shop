import React, { useState, useEffect } from 'react';
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
  const { cart, calculateTotals, loading: cartLoading } = useCart();
  const checkout = useCheckout();
  
  // Calculate totals
  const { subtotal, shipping, tax, total } = calculateTotals();

  // Calculate delivery fee based on selected city
  const [cityDeliveryFee, setCityDeliveryFee] = useState(0);
  
  useEffect(() => {
    // Calculate city delivery fee when a city is selected
    if (checkout.formData?.city) {
      const fetchCityDeliveryFee = async () => {
        try {
          const response = await fetch(`/api/cities?deliveryOnly=true`);
          if (response.ok) {
            const data = await response.json();
            const cityData = data.data?.cities?.find(c => c.name === checkout.formData.city);
            setCityDeliveryFee(cityData?.deliveryFee || 0);
          }
        } catch (error) {
          console.error('Error fetching city delivery fee:', error);
          setCityDeliveryFee(0);
        }
      };
      
      fetchCityDeliveryFee();
    } else {
      setCityDeliveryFee(0);
    }
  }, [checkout.formData?.city]);

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
            cityDeliveryFee={cityDeliveryFee}
          />
        );
      
      case 2:
        return (
          <SimplePaymentForm
            formData={checkout.formData}
            updateFormData={checkout.updateFormData}
            placeOrder={checkout.placeOrder}
            prevStep={checkout.prevStep}
            errors={checkout.errors}
            isLoading={checkout.isLoading}
            loadingStates={checkout.loadingStates}
            paymentMethods={checkout.paymentMethods}
          />
        );
      
      case 3:
        // Only show confirmation if order was actually placed
        if (checkout.orderPlaced) {
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
        } else {
          // If step 3 is reached without placing order, redirect to step 0
          checkout.setCurrentStep(0);
          return null;
        }
      
      default:
        return null;
    }
  };

  // Show loading state if cart is still loading
  if (cartLoading && !cart) {
    return (
      <Page
        title="Commande"
        description="Finalisez votre commande en quelques étapes simples"
        canonicalUrl="/checkout"
        backgroundClass="bg-gradient-to-br from-lime-50/50 to-light-yellow-1/30"
      >
        <div className="container mx-auto px-4 py-8 mt-20">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center min-h-[500px]">
              <div className="text-center">
                <div className="inline-block w-8 h-8 border-2 border-logo-lime/30 border-t-logo-lime animate-spin rounded-full mb-4"></div>
                <h2 className="text-lg font-medium text-dark-green-7 mb-2">Chargement de votre commande...</h2>
                <p className="text-gray-600">Récupération des informations de votre panier</p>
              </div>
            </div>
          </div>
        </div>
      </Page>
    );
  }

  return (
    <Page
      title="Commande"
      description="Finalisez votre commande en quelques étapes simples"
      canonicalUrl="/checkout"
      backgroundClass="bg-gradient-to-br from-lime-50/50 to-light-yellow-1/30"
    >
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col xl:flex-row gap-8 items-start justify-center">
            {/* Main Content */}
            <div className={checkout.currentStep === 4 ? "w-full max-w-4xl mx-auto" : "w-full xl:w-2/3 max-w-2xl"}>
              {/* Steps Indicator - Hide on confirmation page */}
              {checkout.currentStep !== 4 && (
                <div className="mb-8">
                  <CheckoutSteps 
                    currentStep={checkout.currentStep}
                    completedSteps={checkout.completedSteps}
                  />
                </div>
              )}
              
              {/* Step Content */}
              <div>
                {renderStepContent()}
              </div>
            </div>

            {/* Sidebar - Hide on confirmation page */}
            {checkout.currentStep !== 3 && (
              <div className="w-full xl:w-1/3 max-w-md xl:sticky xl:top-24">
                <Sidebar
                  currentStep={checkout.currentStep}
                  formData={checkout.formData}
                  cart={cart}
                  subtotal={subtotal}
                  shipping={shipping}
                  tax={tax}
                  total={total}
                  formatMAD={formatMAD}
                  isLoading={checkout.isLoading}
                  deliveryMethods={checkout.deliveryMethods}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Page>
  );
};

export default SimpleCheckoutPage; 