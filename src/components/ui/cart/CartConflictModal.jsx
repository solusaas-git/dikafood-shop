import React, { useState } from 'react';
import Icon from '../icons/Icon';
import { useCart } from '../../../contexts/CartContext';
import { useNotification } from '../../../contexts/NotificationContextNew';

/**
 * Cart Conflict Resolution Modal
 * Handles scenarios A3, BL3 from user flows when guest cart conflicts with existing user cart
 */
const CartConflictModal = ({ 
  isOpen, 
  onClose, 
  guestSessionId,
  conflictInfo = {},
  onResolved 
}) => {
  const { mergeCart } = useCart();
  const { success, error: showError } = useNotification();
  const [loading, setLoading] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState('merge');

  const strategies = [
    {
      id: 'merge',
      title: 'Fusionner les paniers',
      description: 'Combiner les articles des deux paniers. Les articles identiques seront regroupés.',
      icon: 'plus',
      recommended: true
    },
    {
      id: 'replace',
      title: 'Remplacer le panier',
      description: 'Remplacer votre panier actuel par les articles du panier invité.',
      icon: 'arrowsclockwise',
      warning: 'Votre panier actuel sera perdu'
    },
    {
      id: 'keep_existing',
      title: 'Garder le panier actuel',
      description: 'Conserver votre panier actuel et ignorer les articles du panier invité.',
      icon: 'shield',
      warning: 'Les articles du panier invité seront perdus'
    }
  ];

  const handleResolveConflict = async () => {
    try {
      setLoading(true);
      
      console.log('🔄 Resolving cart conflict with strategy:', selectedStrategy);
      
      const result = await mergeCart(selectedStrategy, guestSessionId);
      
      if (result.success) {
        success(`Panier mis à jour avec succès! ${result.mergeInfo?.totalItems || 0} articles au total.`);
        
        // Call the onResolved callback with merge info
        if (onResolved) {
          onResolved({
            strategy: selectedStrategy,
            mergeInfo: result.mergeInfo
          });
        }
        
        onClose();
      } else {
        showError(result.error || 'Erreur lors de la fusion des paniers');
      }
    } catch (error) {
      console.error('Cart conflict resolution error:', error);
      showError('Erreur technique lors de la fusion des paniers');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <Icon name="warning" size="md" className="text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Conflit de panier détecté
              </h3>
              <p className="text-sm text-gray-500">
                Vous avez des articles dans les deux paniers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2"
            disabled={loading}
          >
            <Icon name="x" size="sm" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Conflict Summary */}
          {conflictInfo && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="info" size="sm" className="text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  Résumé du conflit
                </span>
              </div>
              <div className="text-sm text-blue-800 space-y-1">
                <p>• Panier invité: {conflictInfo.guestItems || 0} articles</p>
                <p>• Votre panier: {conflictInfo.userItems || 0} articles</p>
              </div>
            </div>
          )}

          {/* Strategy Selection */}
          <div className="space-y-3 mb-6">
            <h4 className="font-medium text-gray-900 mb-3">
              Comment souhaitez-vous procéder ?
            </h4>
            
            {strategies.map((strategy) => (
              <label
                key={strategy.id}
                className={`
                  block cursor-pointer rounded-lg border-2 p-4 transition-all duration-200
                  ${selectedStrategy === strategy.id
                    ? 'border-logo-lime bg-logo-lime/5'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                  ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <input
                  type="radio"
                  name="strategy"
                  value={strategy.id}
                  checked={selectedStrategy === strategy.id}
                  onChange={(e) => setSelectedStrategy(e.target.value)}
                  className="sr-only"
                  disabled={loading}
                />
                
                <div className="flex items-start gap-3">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
                    ${selectedStrategy === strategy.id
                      ? 'bg-logo-lime text-dark-green-7'
                      : 'bg-gray-100 text-gray-600'
                    }
                  `}>
                    <Icon name={strategy.icon} size="sm" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">
                        {strategy.title}
                      </span>
                      {strategy.recommended && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                          Recommandé
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      {strategy.description}
                    </p>
                    
                    {strategy.warning && (
                      <div className="flex items-center gap-1.5 text-xs text-amber-600">
                        <Icon name="warning" size="xs" />
                        <span>{strategy.warning}</span>
                      </div>
                    )}
                  </div>
                </div>
              </label>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Annuler
            </button>
            
            <button
              onClick={handleResolveConflict}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-logo-lime text-dark-green-7 rounded-lg hover:bg-logo-lime/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-dark-green-7/30 border-t-dark-green-7 rounded-full animate-spin" />
                  <span>Fusion...</span>
                </>
              ) : (
                <>
                  <Icon name="check" size="sm" />
                  <span>Appliquer</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartConflictModal;
