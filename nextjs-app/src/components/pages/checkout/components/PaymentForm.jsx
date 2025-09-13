/**
 * 🚧 Payment Form - Disabled
 * Checkout functionality is being implemented
 */

import React from 'react';
import { Icon } from '@/components/ui/icons';

const PaymentForm = () => {
  return (
    <div className="p-6 text-center">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon name="wrench" size={32} className="text-blue-600" />
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Formulaire de paiement en développement
      </h3>
      
      <p className="text-gray-600 text-sm">
        Cette fonctionnalité sera bientôt disponible.
      </p>
    </div>
  );
};

export default PaymentForm;