import React, { useState, useEffect } from 'react';
import { X, Warning, ShoppingCart, Minus, Plus, Trash } from '@phosphor-icons/react';
import { useCart } from '@/contexts/CartContext';
import { useNotification } from '@/contexts/NotificationContextNew';

const StockConflictModal = ({ isOpen, onClose, conflictData, onResolve }) => {
  const { updateCartItem, removeFromCart } = useCart();
  const { success } = useNotification();
  const [adjustments, setAdjustments] = useState({});
  const [isResolving, setIsResolving] = useState(false);

  // Initialize adjustments when modal opens
  useEffect(() => {
    if (isOpen && conflictData?.unavailableItems) {
      const initialAdjustments = {};
      conflictData.unavailableItems.forEach(item => {
        initialAdjustments[`${item.productId}_${item.size}`] = {
          action: item.availableStock > 0 ? 'adjust' : 'remove',
          newQuantity: item.availableStock
        };
      });
      setAdjustments(initialAdjustments);
    }
  }, [isOpen, conflictData]);

  if (!isOpen) return null;

  const handleQuantityChange = (productId, size, change) => {
    const key = `${productId}_${size}`;
    const item = conflictData.unavailableItems.find(i => i.productId === productId && i.size === size);
    
    setAdjustments(prev => {
      const current = prev[key] || { action: 'adjust', newQuantity: item.availableStock };
      const newQuantity = Math.max(0, Math.min(item.availableStock, current.newQuantity + change));
      
      return {
        ...prev,
        [key]: {
          ...current,
          newQuantity,
          action: newQuantity === 0 ? 'remove' : 'adjust'
        }
      };
    });
  };

  const handleActionChange = (productId, size, action) => {
    const key = `${productId}_${size}`;
    const item = conflictData.unavailableItems.find(i => i.productId === productId && i.size === size);
    
    setAdjustments(prev => ({
      ...prev,
      [key]: {
        action,
        newQuantity: action === 'remove' ? 0 : item.availableStock
      }
    }));
  };

  const handleResolveConflicts = async () => {
    setIsResolving(true);
    
    try {
      const promises = Object.entries(adjustments).map(async ([key, adjustment]) => {
        const [productId, size] = key.split('_');
        const item = conflictData.unavailableItems.find(i => i.productId === productId && i.size === size);
        
        if (adjustment.action === 'remove') {
          await removeFromCart(item.cartItemId);
        } else if (adjustment.action === 'adjust' && adjustment.newQuantity !== item.requestedQuantity) {
          await updateCartItem(item.cartItemId, { quantity: adjustment.newQuantity });
        }
      });
      
      await Promise.all(promises);
      
      success('Panier mis à jour avec succès!');
      onResolve?.();
      onClose();
    } catch (error) {
      console.error('Error resolving stock conflicts:', error);
    } finally {
      setIsResolving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Warning size={24} className="text-amber-600" weight="duotone" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Problème de Stock
              </h2>
              <p className="text-sm text-gray-600">
                Certains articles ne sont plus disponibles dans les quantités demandées
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            {conflictData?.unavailableItems?.map((item) => {
              const key = `${item.productId}_${item.size}`;
              const adjustment = adjustments[key] || { action: 'adjust', newQuantity: item.availableStock };
              
              return (
                <div key={key} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    {/* Product Image */}
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                      ) : (
                        <ShoppingCart size={24} className="text-gray-400" />
                      )}
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {item.productName || `Produit ${item.productId}`}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Taille: {item.size} • Demandé: {item.requestedQuantity}
                      </p>
                      <p className="text-sm text-amber-600">
                        Stock disponible: {item.availableStock}
                      </p>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      {item.availableStock > 0 ? (
                        <>
                          {/* Adjust Quantity Option */}
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              id={`adjust_${key}`}
                              name={`action_${key}`}
                              checked={adjustment.action === 'adjust'}
                              onChange={() => handleActionChange(item.productId, item.size, 'adjust')}
                              className="text-dark-green-1"
                            />
                            <label htmlFor={`adjust_${key}`} className="text-sm">
                              Ajuster
                            </label>
                          </div>
                          
                          {/* Quantity Controls */}
                          {adjustment.action === 'adjust' && (
                            <div className="flex items-center gap-2 ml-6">
                              <button
                                type="button"
                                onClick={() => handleQuantityChange(item.productId, item.size, -1)}
                                disabled={adjustment.newQuantity <= 1}
                                className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="w-8 text-center text-sm font-medium">
                                {adjustment.newQuantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleQuantityChange(item.productId, item.size, 1)}
                                disabled={adjustment.newQuantity >= item.availableStock}
                                className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                          )}
                        </>
                      ) : null}
                      
                      {/* Remove Option */}
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id={`remove_${key}`}
                          name={`action_${key}`}
                          checked={adjustment.action === 'remove'}
                          onChange={() => handleActionChange(item.productId, item.size, 'remove')}
                          className="text-red-500"
                        />
                        <label htmlFor={`remove_${key}`} className="text-sm text-red-600 flex items-center gap-1">
                          <Trash size={14} />
                          Retirer
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Annuler
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={() => window.location.href = '/cart'}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Voir le Panier
            </button>
            
            <button
              onClick={handleResolveConflicts}
              disabled={isResolving}
              className="px-6 py-2 bg-dark-green-1 text-white rounded-lg hover:bg-dark-green-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isResolving ? 'Application...' : 'Appliquer les Modifications'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockConflictModal; 