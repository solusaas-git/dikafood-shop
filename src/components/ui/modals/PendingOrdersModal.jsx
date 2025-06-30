/**
 * 🚧 Pending Orders Modal - Disabled
 * Checkout functionality is being implemented
 */

import React from 'react';
import { Icon } from '@/components/ui/icons';
import { Button } from '@/components/ui/inputs';

const PendingOrdersModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 m-4 max-w-md w-full shadow-xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="wrench" size={32} className="text-purple-600" />
          </div>
          
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Commandes en attente
          </h3>
          
          <p className="text-gray-600 mb-6">
            La fonctionnalité de gestion des commandes en attente est en cours de développement.
          </p>
          
          <Button
            onClick={onClose}
            className="w-full bg-purple-100 hover:bg-purple-200 text-purple-800"
          >
            Fermer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PendingOrdersModal; 