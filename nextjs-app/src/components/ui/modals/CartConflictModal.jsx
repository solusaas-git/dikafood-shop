import React from 'react';
import Icon from '../icons/Icon';

const CartConflictModal = ({ 
  isOpen, 
  onClose, 
  cartItemCount, 
  onIgnore, 
  onMerge 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden border border-gray-200/50">
        {/* Header */}
        <div className="bg-gradient-to-r from-logo-lime/30 to-light-yellow-1/40 px-6 py-5 border-b border-logo-lime/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-logo-lime/25 border-2 border-logo-lime/40 flex items-center justify-center">
                <Icon name="shoppingcart" size="lg" className="text-dark-green-7" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-dark-green-7">
                  Panier non vide
                </h3>
                <p className="text-sm text-dark-green-6 mt-0.5">
                  {cartItemCount} article{cartItemCount > 1 ? 's' : ''} dans votre panier
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-logo-lime/20 text-dark-green-6 hover:text-dark-green-7 transition-all duration-200"
            >
              <Icon name="x" size="lg" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <p className="text-dark-green-7 mb-6 leading-relaxed text-base">
            Vous avez déjà des articles dans votre panier. Que souhaitez-vous faire ?
          </p>

          {/* Options */}
          <div className="space-y-4">
            {/* Merge option - Primary action */}
            <button
              onClick={onMerge}
              className="w-full flex items-center gap-4 p-5 rounded-2xl border-2 border-logo-lime/40 bg-gradient-to-r from-logo-lime/15 to-light-yellow-1/20 hover:from-logo-lime/25 hover:to-light-yellow-1/30 hover:border-logo-lime/60 transition-all duration-200 group"
            >
              <div className="w-14 h-14 rounded-full bg-logo-lime/30 border-2 border-logo-lime/50 flex items-center justify-center group-hover:bg-logo-lime/40 group-hover:scale-105 transition-all duration-200">
                <Icon name="plus" size="xl" className="text-dark-green-7" />
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-semibold text-dark-green-7 mb-1 text-lg">
                  Ajouter au panier
                </h4>
                <p className="text-sm text-dark-green-6 leading-relaxed">
                  Ajouter ce produit à votre panier existant et procéder au checkout ensemble
                </p>
              </div>
              <Icon name="arrowright" size="lg" className="text-dark-green-6 group-hover:text-dark-green-7 group-hover:translate-x-1 transition-all duration-200" />
            </button>

            {/* Ignore option - Secondary action */}
            <button
              onClick={onIgnore}
              className="w-full flex items-center gap-4 p-5 rounded-2xl border-2 border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 group"
            >
              <div className="w-14 h-14 rounded-full bg-gray-200 border-2 border-gray-300 flex items-center justify-center group-hover:bg-gray-300 group-hover:scale-105 transition-all duration-200">
                <Icon name="creditcard" size="xl" className="text-gray-600" />
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-semibold text-gray-700 mb-1 text-lg">
                  Achat direct uniquement
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Procéder à l'achat direct de ce produit (garder le panier pour plus tard)
                </p>
              </div>
              <Icon name="arrowright" size="lg" className="text-gray-500 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-200" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartConflictModal; 