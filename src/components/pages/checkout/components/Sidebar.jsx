import React, { useState, useEffect } from 'react';
import { Receipt, ShoppingCartSimple } from '@phosphor-icons/react';
import ContentContainer from '@/components/ui/layout/ContentContainer';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useCart } from '@/contexts/CartContext';
import { useLocation } from 'react-router-dom';
import Icon from '@/components/ui/icons/Icon';

const Sidebar = ({ currentStep = 0, orderDetails = null, orderId = null }) => {
  const { cart, calculateTotals } = useCart();
  const [loading, setLoading] = useState(false);
  const { formatPrice } = useCurrency();
  const location = useLocation();

  // Determine which data to display
  const isFirstStep = currentStep === 0;
  // For direct purchases, we have order details but empty cart, so use order data even in step 0
  const isDirectPurchase = orderDetails && (!cart.items || cart.items.length === 0);
  const shouldUseOrderData = (currentStep >= 1 && orderDetails) || isDirectPurchase;
  
  // Get items to display
  const itemsToDisplay = shouldUseOrderData ? (orderDetails.items || []) : (cart.items || []);
  const dataSource = shouldUseOrderData ? 'order' : 'cart';

  // Get all totals from the cart context
  const { subtotal, shipping, tax, total } = calculateTotals();

  // Define header content with icon
  const headerContent = (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-logo-lime/20 border border-logo-lime/30 flex items-center justify-center">
        <ShoppingCartSimple size={18} weight="duotone" className="text-dark-green-1" />
      </div>
      <span className="text-dark-green-1 font-medium">Récapitulatif</span>
      {/* Debug indicator */}
      {process.env.NODE_ENV === 'development' && (
        <span className="text-xs bg-gray-200 px-1 rounded">
          {dataSource}
        </span>
      )}
    </div>
  );

  return (
    <ContentContainer
      title={headerContent}
      headerVariant="default"
      bodyClassName="p-0"
    >
      {/* Cart Items */}
      <div className="p-6 border-b border-gray-100">
        <h3 className="flex items-center gap-1.5 text-dark-green-1 font-medium mb-4">
          <ShoppingCartSimple size={18} weight="duotone" className="text-dark-green-1" />
          {isDirectPurchase ? 'Achat direct' : 'Articles'} ({itemsToDisplay.length})
          {isDirectPurchase && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full ml-2">
              Direct
            </span>
          )}
        </h3>

        <div className="max-h-[300px] overflow-y-auto space-y-4 bg-gradient-to-br from-amber-50/80 to-amber-100/40 p-4 rounded-lg">
          {loading ? (
            <div className="py-6 text-center">
              <div className="inline-block w-6 h-6 border-2 border-logo-lime/30 border-t-logo-lime animate-spin rounded-full"></div>
              <p className="mt-2 text-gray-500">Chargement du panier...</p>
            </div>
          ) : itemsToDisplay.length > 0 ? (
            itemsToDisplay.map((item, index) => (
              <div
                key={
                  // Better key generation for the new format
                  item.itemId || 
                  item.id || 
                  item._id || 
                  (item.main?.productId ? `${item.main.productId}-${index}` : `item-${index}`)
                }
                className="flex gap-3 p-3 bg-white/90 border border-logo-lime/20 rounded-lg hover:shadow-sm transition-all"
              >
                <div className="w-16 h-16 bg-white rounded-md flex items-center justify-center border border-logo-lime/10">
                  {(item.productImage || item.image || item.main?.imageId) ? (
                    <img
                      src={
                        // Priority 1: Use existing productImage or image if already processed
                        item.productImage || 
                        item.image || 
                        // Priority 2: Check for storageKey in main object
                        (item.main?.storageKey ? `/storage/files/${item.main.storageKey}?variant=thumbnail` : 
                        // Priority 3: Legacy imageId support
                        (item.main?.imageId ? `/files/product-images/${item.main.imageId}` : ''))
                      }
                      alt={item.productName || item.main?.productTitle || 'Product'}
                      className="w-full h-full object-contain p-1"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-dark-green-6/70">
                      <ShoppingCartSimple size={24} />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-dark-green-7">
                    {item.productName || item.main?.productTitle || 'Product'}
                  </div>
                  <div className="text-xs text-dark-green-6 mb-1">
                    {/* Size display - prioritize main.size over top-level size */}
                    {(item.main?.size || item.size) && (
                      <span className="mr-1">Taille: {item.main?.size || item.size}</span>
                    )}
                    
                    {/* Brand display */}
                    {(item.brand || item.brandDisplayName) && (
                      <span className="mr-1">
                        {(item.main?.size || item.size) ? '• ' : ''}
                        {item.brandDisplayName || item.brand}
                      </span>
                    )}
                    
                    {/* Cart item properties */}
                    {dataSource === 'cart' && item.itemProperties && Array.isArray(item.itemProperties) && item.itemProperties.length > 0 && (
                      item.itemProperties.map((prop, propIndex) => {
                        // Handle different property formats
                        let displayText = '';
                        if (typeof prop === 'object') {
                          // If it's an object with key-value pairs
                          const values = Object.values(prop).filter(v => v);
                          if (values.length) {
                            displayText = values.join(': ');
                          }
                        } else if (typeof prop === 'string') {
                          // If it's a simple string
                          displayText = prop;
                        }

                        return displayText ? (
                          <span key={propIndex} className="mr-1">
                            • {displayText}
                            {propIndex < item.itemProperties.filter(p => !!p).length - 1 && ', '}
                          </span>
                        ) : null;
                      })
                    )}
                    
                    {/* Order item properties */}
                    {dataSource === 'order' && item.main?.properties && Object.keys(item.main.properties).length > 0 && (
                      Object.entries(item.main.properties).map(([key, value], propIndex) => (
                        <span key={propIndex} className="mr-1">
                          • {key}: {value}
                          {propIndex < Object.entries(item.main.properties).length - 1 && ', '}
                        </span>
                      ))
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-dark-green-6">
                      Qté: {item.quantity || item.main?.quantity || 1}
                    </span>
                    <span className="text-sm font-medium text-dark-green-7">
                      {formatPrice(
                        item.totalPrice || 
                        (item.unitPrice * (item.quantity || 1)) || 
                        (item.main?.price * (item.main?.quantity || 1)) || 
                        0
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">Votre panier est vide</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Summary */}
      <div className="p-6">
        <h3 className="flex items-center gap-1.5 text-dark-green-1 font-medium mb-4">
          <Receipt size={18} weight="duotone" className="text-dark-green-1" />
          Résumé de la commande
        </h3>

        <div className="space-y-2">
          <div className="flex justify-between text-gray-700">
            <span>Sous-total</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          <div className="flex justify-between text-gray-700">
            <span>Livraison</span>
            {isFirstStep ? (
              <span className="text-sm text-dark-green-6 italic">À calculer</span>
            ) : (
              <span>{shipping > 0 ? formatPrice(shipping) : 'Gratuit'}</span>
            )}
          </div>

          <div className="flex justify-between text-gray-700">
            <span>TVA (10%)</span>
            <span>{formatPrice(tax)}</span>
          </div>

          {isFirstStep && (
            <div className="mt-2 p-2 bg-amber-50 rounded-lg border border-amber-100 flex items-start gap-2">
              <Icon name="info" size="sm" color="dark-green" className="mt-0.5 flex-shrink-0" />
              <span className="text-xs text-dark-green-6">
                Les frais de livraison seront calculés après avoir choisi votre méthode de livraison.
              </span>
            </div>
          )}

          <div className="flex justify-between font-medium text-dark-green-1 pt-2 border-t border-amber-100 mt-2">
            <span>Total</span>
            <span>{isFirstStep ? `${formatPrice(total)} *` : formatPrice(total)}</span>
          </div>

          {isFirstStep && (
            <div className="text-xs text-right text-dark-green-6 italic">
              * Hors frais de livraison
            </div>
          )}
        </div>
      </div>
    </ContentContainer>
  );
};

export default Sidebar;