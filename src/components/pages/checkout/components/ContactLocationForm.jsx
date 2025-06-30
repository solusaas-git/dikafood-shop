/**
 * 🚧 Contact Location Form - Disabled
 * Checkout functionality is being implemented
 */

import React from 'react';
import { Icon } from '@/components/ui/icons';

const ContactLocationForm = () => {
  return (
    <div className="p-6 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon name="wrench" size={32} className="text-green-600" />
      </div>
          
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Formulaire de contact en développement
      </h3>
      
      <p className="text-gray-600 text-sm">
        Les informations de livraison seront bientôt configurables.
      </p>
    </div>
  );
};

export default ContactLocationForm;