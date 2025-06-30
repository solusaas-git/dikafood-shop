/**
 * 🚧 Checkout Disabled Modal
 * Temporary component to inform users that checkout is being implemented
 */

import React from 'react';
import { Button } from '@/components/ui/inputs';
import { Icon } from '@/components/ui/icons';

const CheckoutDisabledModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 m-4 max-w-md w-full shadow-xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-logo-lime/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="wrench" size={32} className="text-dark-green-7" />
          </div>
          
          <h3 className="text-xl font-semibold text-dark-green-7 mb-3">
            Fonctionnalité en cours de développement
          </h3>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            Le système de commande est actuellement en cours d'implémentation. 
            Cette fonctionnalité sera bientôt disponible.
          </p>
          
          <div className="space-y-3">
            <p className="text-sm text-gray-500">
              En attendant, vous pouvez :
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Parcourir nos produits</li>
              <li>• Télécharger notre catalogue</li>
              <li>• Nous contacter directement</li>
            </ul>
          </div>
          
          <Button
            onClick={onClose}
            className="mt-6 w-full bg-logo-lime/30 hover:bg-logo-lime/40 text-dark-green-7 border border-logo-lime/50"
          >
            Compris
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutDisabledModal; 