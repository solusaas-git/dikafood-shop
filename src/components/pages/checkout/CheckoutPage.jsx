/**
 * 🚧 Checkout Page - Disabled
 * Checkout functionality is being implemented
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/icons';
import { Button } from '@/components/ui/inputs';
import Page from '@/components/ui/layout/Page';

const CheckoutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Optionally redirect after a few seconds
    const timer = setTimeout(() => {
      navigate('/shop');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

    return (
    <Page
      title="Commande - En développement"
      description="Le système de commande est actuellement en cours d'implémentation"
      canonicalUrl="/checkout"
    >
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-lime-50 to-light-yellow-1">
        <div className="bg-white rounded-2xl shadow-xl p-8 m-4 max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-logo-lime/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="wrench" size={40} className="text-dark-green-7" />
          </div>
          
          <h1 className="text-2xl font-bold text-dark-green-7 mb-4">
            Système de commande en développement
          </h1>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            Nous travaillons actuellement sur l'implémentation du système de commande. 
            Cette fonctionnalité sera bientôt disponible.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">En attendant, vous pouvez :</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Parcourir nos produits</li>
              <li>• Télécharger notre catalogue</li>
              <li>• Nous contacter directement</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <Button
              onClick={() => navigate('/shop')}
              className="w-full bg-logo-lime/30 hover:bg-logo-lime/40 text-dark-green-7 border border-logo-lime/50"
            >
              Retour à la boutique
            </Button>
            
            <Button
              onClick={() => navigate('/contact')}
              variant="outline"
              className="w-full"
            >
              Nous contacter
            </Button>
            </div>

          <p className="text-xs text-gray-500 mt-4">
            Redirection automatique dans 5 secondes...
          </p>
            </div>
          </div>
    </Page>
  );
};

export default CheckoutPage;