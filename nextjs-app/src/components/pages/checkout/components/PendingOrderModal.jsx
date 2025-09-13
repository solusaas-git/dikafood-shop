/**
 * 🚧 Pending Order Modal - Disabled
 * Checkout functionality is being implemented
 */

import React from 'react';
import { Icon } from '@/components/ui/icons';
import { Button } from '@/components/ui/inputs';

const PendingOrderModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 m-4 max-w-md w-full shadow-xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="wrench" size={32} className="text-orange-600" />
          </div>
          
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Gestion des commandes en développement
                    </h3>
          
          <p className="text-gray-600 mb-6">
            La gestion des commandes en attente est actuellement en cours d'implémentation.
          </p>
          
          <Button
            onClick={onClose}
            className="w-full bg-orange-100 hover:bg-orange-200 text-orange-800"
          >
            Fermer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PendingOrderModal; 