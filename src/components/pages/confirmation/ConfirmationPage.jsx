'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContextNew';
import { api } from '@/services/api';
import Page from '@/components/ui/layout/Page';
import MainLayout from '@/components/ui/layout/MainLayout';
import OrderConfirmation from '@/components/pages/checkout/components/OrderConfirmation';

const ConfirmationPage = ({ token }) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { error } = useNotification();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderError, setOrderError] = useState(null);

  // Format currency
  const formatMAD = (value) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
    }).format(value);
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!token) {
        setOrderError('Token de confirmation manquant');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch order details using the confirmation token
        const response = await fetch(`/api/orders/confirmation/${token}`);
        const result = await response.json();
        
        if (result.success && result.data) {
          setOrderData(result.data);
          setOrderError(null);
        } else {
          setOrderError(result.message || 'Commande non trouvée');
        }
      } catch (err) {
        console.error('Error fetching order details:', err);
        setOrderError('Erreur lors du chargement de la commande');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [token]);

  // Loading state
  if (loading) {
    return (
      <MainLayout>
        <Page 
          title="Chargement..."
          backgroundClass="bg-gradient-to-br from-lime-50/50 to-light-yellow-1/30"
        >
          <div className="container mx-auto px-4 py-6 md:py-8 mt-16 md:mt-20">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl p-6 md:p-8 text-center">
                <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-logo-lime mx-auto mb-3 md:mb-4"></div>
                <p className="text-gray-600 text-sm md:text-base">Chargement de votre commande...</p>
              </div>
            </div>
          </div>
        </Page>
      </MainLayout>
    );
  }

  // Error state
  if (orderError || !orderData) {
    return (
      <MainLayout>
        <Page 
          title="Erreur"
          backgroundClass="bg-gradient-to-br from-red-50/50 to-red-100/30"
        >
          <div className="container mx-auto px-4 py-6 md:py-8 mt-16 md:mt-20">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl p-6 md:p-8 text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-red-100 text-red-600 rounded-full mx-auto mb-3 md:mb-4">
                  <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl md:text-2xl font-medium text-gray-800 mb-2">Commande non trouvée</h2>
                <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">
                  {orderError || 'Cette commande n\'existe pas ou le lien de confirmation n\'est pas valide.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                  <button
                    onClick={() => router.push('/shop')}
                    className="inline-flex items-center justify-center px-5 md:px-6 py-2 md:py-2.5 bg-logo-lime text-white rounded-full hover:bg-logo-lime/90 transition font-medium text-sm md:text-base"
                  >
                    Retour à la boutique
                  </button>
                  {isAuthenticated && (
                    <button
                      onClick={() => router.push('/profile/orders')}
                      className="inline-flex items-center justify-center px-5 md:px-6 py-2 md:py-2.5 border border-logo-brown/50 text-logo-brown rounded-full hover:bg-logo-brown/10 transition font-medium text-sm md:text-base"
                    >
                      Mes commandes
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Page>
      </MainLayout>
    );
  }

  // Success state - render the order confirmation
  return (
    <MainLayout>
      <Page 
        title={`Commande ${orderData.orderNumber} - Confirmée`}
        backgroundClass="bg-gradient-to-br from-lime-50/50 to-light-yellow-1/30"
      >
        <div className="container mx-auto px-4 py-6 md:py-8 mt-16 md:mt-20">
          <div className="max-w-4xl mx-auto">
            <OrderConfirmation
              orderId={orderData.order._id}
              formData={{
                firstName: orderData.customer.firstName,
                lastName: orderData.customer.lastName,
                email: orderData.customer.email,
                phone: orderData.customer.phone
              }}
              cart={null} // Cart is cleared, use order data
              orderDetails={orderData.order}
              total={orderData.order.total}
              formatMAD={formatMAD}
            />
          </div>
        </div>
      </Page>
    </MainLayout>
  );
};

export default ConfirmationPage;
