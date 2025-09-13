import React, { useState } from 'react';
import { CheckCircle, ShoppingBag, MapPin, CreditCard } from '@phosphor-icons/react';
import { useNotification } from '@/contexts/NotificationContextNew';
import { Form } from '@/components/ui/forms';

const RecapForm = ({ formData, cart, orderDetails, total, formatMAD, placeOrder, prevStep, deliveryMethods = [] }) => {
  const { error, info } = useNotification();
  const [isLoading, setIsLoading] = useState(false);

  // Determine what items to display - prioritize order details for direct purchases
  const getDisplayItems = () => {
    // For direct purchases, use order details
    if (orderDetails?.items?.length > 0) {
      return {
        items: orderDetails.items,
        source: 'order',
        isDirectPurchase: true
      };
    }
    
    // For cart checkouts, use cart items
    if (cart?.items?.length > 0) {
      return {
        items: cart.items,
        source: 'cart',
        isDirectPurchase: false
      };
    }
    
    return { items: [], source: 'none', isDirectPurchase: false };
  };

  const { items, source, isDirectPurchase } = getDisplayItems();

  // Format item properties for display
  const getItemVariant = (item) => {
    if (source === 'order') {
      const size = item.main?.size || item.size;
      const properties = item.main?.properties || {};
      const propertyStrings = Object.entries(properties).map(([key, value]) => `${key}: ${value}`);
      
      if (size) propertyStrings.unshift(`Taille: ${size}`);
      return propertyStrings.join(' • ');
    }
    
    if (source === 'cart') {
      const variantInfo = [];
      
      // Add size if available
      if (item.variant?.size) {
        variantInfo.push(`Taille: ${item.variant.size}`);
      }
      
      // Add SKU if available
      if (item.variant?.sku) {
        variantInfo.push(`SKU: ${item.variant.sku}`);
      }
      
      // Add any other properties
      const properties = item.itemProperties || [];
      const validProperties = properties.filter(Boolean);
      variantInfo.push(...validProperties);
      
      return variantInfo.join(' • ');
    }
    
    return '';
  };

  // Get item price
  const getItemPrice = (item) => {
    if (source === 'order') {
      return item.totalPrice || (item.main?.price * (item.main?.quantity || 1)) || 0;
    }
    
    if (source === 'cart') {
      return item.total || (item.price * item.quantity) || 0;
    }
    
    return 0;
  };

  // Get item quantity
  const getItemQuantity = (item) => {
    if (source === 'order') {
      return item.main?.quantity || item.quantity || 1;
    }
    
    return item.quantity || 1;
  };

  // Get item name
  const getItemName = (item) => {
    if (source === 'order') {
      return item.main?.productTitle || item.productName || 'Product';
    }
    
    if (source === 'cart') {
      return item.product?.name || item.productName || item.name || 'Product';
    }
    
    return 'Product';
  };

  // Get item image
  const getItemImage = (item) => {
    if (source === 'order') {
      return item.main?.imageId ? `/files/product-images/${item.main.imageId}` : item.image;
    }
    
    if (source === 'cart') {
      // Prioritize variant image, then product image
      return item.variant?.imageUrl || item.variant?.imageUrls?.[0] || item.product?.image || item.image;
    }
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    info('Finalisation de votre commande...');

    try {
      await placeOrder(formData); // Pass formData to placeOrder
    } catch (err) {
      console.error('Error placing order:', err);
      error('Une erreur est survenue lors de la finalisation');
    } finally {
      setIsLoading(false);
    }
  };

  const headerContent = (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-logo-lime/20 border border-logo-lime/30 flex items-center justify-center">
        <CheckCircle size={18} weight="duotone" className="text-dark-green-1" />
      </div>
      <span className="text-dark-green-1 font-medium">Récapitulatif de commande</span>
    </div>
  );

  // Get delivery method display
  const getDeliveryMethodDisplay = () => {
    if (!formData.deliveryMethodId) return 'Non spécifié';
    
    const method = deliveryMethods.find(m => m._id === formData.deliveryMethodId);
    return method?.name || method?.data?.name || 'Non spécifié';
  };

  // Get selected shop display (for pickup)
  const getSelectedShopDisplay = () => {
    if (!formData.shopId || !formData.deliveryMethodId) return null;
    
    const method = deliveryMethods.find(m => m._id === formData.deliveryMethodId);
    if (method?.data?.type !== 'pickup') return null;
    
    const shop = method?.data?.shops?.find(s => s._id === formData.shopId);
    return shop ? `${shop.name} - ${shop.address}` : null;
  };

  // Get payment method display
  const getPaymentMethodDisplay = () => {
    switch (formData.paymentMethod) {
      case 'cash-on-delivery':
        return 'Paiement à la livraison';
      case 'bank-transfer':
        return 'Virement bancaire';
      case 'stripe':
        return 'Carte bancaire';
      default:
        return formData.paymentMethod || 'Non spécifié';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-full bg-logo-lime/20 border border-logo-lime/30 flex items-center justify-center">
          <CheckCircle size={18} weight="duotone" className="text-dark-green-1" />
        </div>
        <span className="text-xl font-medium text-dark-green-1">Récapitulatif de commande</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
      {/* Purchase Type Indicator */}
      {isDirectPurchase && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
              <CheckCircle size={14} className="text-blue-600" />
            </div>
            <span className="text-sm font-medium text-blue-700">Achat direct</span>
          </div>
        </div>
      )}

      {/* Order Items */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
        <h3 className="flex items-center gap-2 font-medium text-gray-800 mb-3">
          <ShoppingBag size={18} className="text-gray-600" />
          Articles commandés ({items.length})
        </h3>
        
        <div className="space-y-3">
          {items.map((item, index) => {
            const quantity = getItemQuantity(item);
            const variant = getItemVariant(item);
            
            return (
              <div key={`item-${index}`} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                  {getItemImage(item) ? (
                    <img 
                      src={getItemImage(item)} 
                      alt={getItemName(item)} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <ShoppingBag size={20} className="text-gray-400" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {getItemName(item)}
                  </p>
                  {variant && (
                    <p className="text-sm text-gray-500 truncate">
                      {variant}
                    </p>
                  )}
                  {quantity > 1 && (
                    <p className="text-sm text-gray-500">
                      Quantité: {quantity}
                    </p>
                  )}
                </div>
                
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {formatMAD(getItemPrice(item))}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delivery Information */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
        <h3 className="flex items-center gap-2 font-medium text-gray-800 mb-4">
          <MapPin size={18} className="text-gray-600" />
          Informations de livraison
        </h3>
        
        <div className="space-y-4">
          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Nom complet</label>
              <p className="mt-1 font-medium text-gray-900">
                {formData.firstName} {formData.lastName}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Téléphone</label>
              <p className="mt-1 text-gray-900">{formData.phone}</p>
            </div>
          </div>
          
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</label>
            <p className="mt-1 text-gray-900">{formData.email}</p>
          </div>
          
          {/* Delivery Method */}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Méthode de livraison</label>
            <p className="mt-1 font-medium text-gray-900">{getDeliveryMethodDisplay()}</p>
            {getSelectedShopDisplay() && (
              <p className="mt-1 text-sm text-gray-600">{getSelectedShopDisplay()}</p>
            )}
          </div>
          
          {/* Address (only show if not pickup) */}
          {(!formData.deliveryMethodId || !deliveryMethods.find(m => m._id === formData.deliveryMethodId && m.data?.type === 'pickup')) && (
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Adresse de livraison</label>
              <div className="mt-1 p-3 bg-white rounded-lg border border-gray-200">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Livraison
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Par défaut
                    </span>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">{formData.address}</p>
                    <p className="text-gray-600">{formData.city} {formData.postalCode && `${formData.postalCode}, `}{formData.country}</p>
                    {formData.notes && (
                      <p className="text-gray-500 text-xs mt-1">Instructions: {formData.notes}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment & Total */}
      <div className="bg-lime-50 border border-logo-lime/30 rounded-lg p-4 mb-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-gray-700">
              <CreditCard size={16} className="text-gray-500" />
              Paiement
            </span>
            <span className="font-medium text-gray-900">
              {getPaymentMethodDisplay()}
            </span>
          </div>
          
          <div className="border-t border-logo-lime/30 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-xl font-bold text-amber-700">
                {formatMAD(total)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex gap-3">
          <CheckCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Prêt à finaliser ?</p>
            <p>En confirmant cette commande, vous acceptez nos conditions de vente et notre politique de remboursement.</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <button
          type="button"
          onClick={prevStep}
          disabled={isLoading}
          className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Retour
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-logo-lime to-lime-500 text-dark-green-7 font-semibold rounded-full hover:from-lime-500 hover:to-lime-600 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none active:scale-95"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-dark-green-7/30 border-t-dark-green-7 animate-spin rounded-full mr-2"></div>
              Finalisation en cours...
            </>
          ) : (
            <>
              <CheckCircle size={20} weight="duotone" className="mr-2" />
              Confirmer la commande
            </>
          )}
        </button>
      </div>
      </form>
    </div>
  );
};

export default RecapForm;