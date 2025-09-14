import React, { useState, useEffect } from 'react';
import { Receipt, ShoppingCartSimple } from '@phosphor-icons/react';
import ContentContainer from '@/components/ui/layout/ContentContainer';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useCart } from '@/contexts/CartContext';
import { usePathname } from 'next/navigation';
import Icon from '@/components/ui/icons/Icon';

const Sidebar = ({ currentStep = 0, formData = null, orderDetails = null, orderId = null, deliveryMethods = [] }) => {
  const { cart, calculateTotals, loading: cartLoading } = useCart();
  const [loading, setLoading] = useState(false);
  const { formatPrice } = useCurrency();
  const pathname = usePathname();

  // Show loading state if cart is still loading and we don't have order details
  const isLoading = cartLoading && !orderDetails && !cart;

  // Determine which data to display
  const isFirstStep = currentStep === 0;
  // For direct purchases, we have order details but empty cart, so use order data even in step 0
  const isDirectPurchase = orderDetails && (!cart?.items || cart.items.length === 0);
  const shouldUseOrderData = (currentStep >= 1 && orderDetails) || isDirectPurchase;
  
  // Get items to display
  const itemsToDisplay = shouldUseOrderData ? (orderDetails?.items || []) : (cart?.items || []);
  const dataSource = shouldUseOrderData ? 'order' : 'cart';

  // Get all totals from the cart context
  const { subtotal, regularSubtotal, shipping, tax, total, regularTotal, hasPromotions, savings } = calculateTotals();
  
  // Calculate delivery fee based on selected city (for step 0)
  const [cityDeliveryFee, setCityDeliveryFee] = useState(0);
  
  useEffect(() => {
    // Calculate city delivery fee when a city is selected (maintain across all steps)
    if (formData?.city) {
      const fetchCityDeliveryFee = async () => {
        try {
          const response = await fetch(`/api/cities?deliveryOnly=true`);
          const data = await response.json();
          if (data.success) {
            const selectedCity = data.data.cities.find(city => city.name === formData.city);
            setCityDeliveryFee(selectedCity?.deliveryFee || 0);
          }
        } catch (error) {
          console.error('Error fetching city delivery fee:', error);
        }
      };
      fetchCityDeliveryFee();
    } else {
      setCityDeliveryFee(0); // Reset when no city selected
    }
  }, [formData?.city]);

  // Calculate total delivery cost (city fee + method additional cost)
  const calculateTotalDeliveryCost = () => {
    let totalCost = cityDeliveryFee; // Always start with city delivery fee as base
    
    // Add delivery method additional cost if selected
    if (currentStep >= 1 && formData?.deliveryMethodId) {
      const selectedMethod = deliveryMethods.find(m => m._id === formData.deliveryMethodId);
      const methodAdditionalCost = selectedMethod?.price || 0;
      totalCost += methodAdditionalCost;
    }
    
    return totalCost;
  };
  
  // Debug cart data in development

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
          {isLoading ? (
            <div className="py-6 text-center">
              <div className="inline-block w-6 h-6 border-2 border-logo-lime/30 border-t-logo-lime animate-spin rounded-full"></div>
              <p className="mt-2 text-gray-500">Chargement du panier...</p>
            </div>
          ) : itemsToDisplay.length > 0 ? (
            itemsToDisplay.map((item, index) => (
              <div
                key={item.id || item._id || `item-${index}`}
                className="flex gap-3 p-3 bg-white/90 border border-logo-lime/20 rounded-lg hover:shadow-sm transition-all"
              >
                <div className="w-16 h-16 bg-white rounded-md flex items-center justify-center border border-logo-lime/10">
                  {/* Cart item image - prioritize variant image */}
                  {(dataSource === 'cart' && (item.variant?.imageUrl || item.variant?.imageUrls?.[0] || item.product?.image)) ? (
                    <img
                      src={
                        item.variant?.imageUrl || 
                        item.variant?.imageUrls?.[0] || 
                        item.product?.image
                      }
                      alt={item.product?.name || 'Product'}
                      className="w-full h-full object-contain p-1"
                      loading="lazy"
                    />
                  ) : (dataSource === 'order' && (item.productImage || item.image || item.main?.imageId)) ? (
                    <img
                      src={
                        item.productImage || 
                        item.image || 
                        (item.main?.storageKey ? `/storage/files/${item.main.storageKey}?variant=thumbnail` : 
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
                    {/* Cart item name */}
                    {dataSource === 'cart' ? item.product?.name : (item.productName || item.main?.productTitle || 'Product')}
                  </div>
                  <div className="text-xs text-dark-green-6 mb-1">
                    {/* Size display */}
                    {(dataSource === 'cart' ? item.variant?.size : (item.main?.size || item.size)) && (
                      <span className="mr-1">
                        Taille: {dataSource === 'cart' ? item.variant?.size : (item.main?.size || item.size)}
                      </span>
                    )}
                    
                    {/* SKU display */}
                    {(dataSource === 'cart' && item.variant?.sku) && (
                      <span className="mr-1">
                        {item.variant?.size ? '• ' : ''}
                        SKU: {item.variant.sku}
                      </span>
                    )}
                    
                    {/* Brand display */}
                    {(item.brand || item.brandDisplayName) && (
                      <span className="mr-1">
                        {(item.variant?.size || item.main?.size || item.size) ? '• ' : ''}
                        {item.brandDisplayName || item.brand}
                      </span>
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
                      Qté: {dataSource === 'cart' ? item.quantity : (item.quantity || item.main?.quantity || 1)}
                    </span>
                    <div className="text-right">
                      {/* Cart item pricing */}
                      {dataSource === 'cart' && item.variant?.promotionalPrice && item.variant?.price && item.variant.promotionalPrice < item.variant.price ? (
                        <div className="flex flex-col items-end">
                          <span className="text-xs text-gray-500 line-through">
                            {formatPrice(item.variant.price * item.quantity)}
                          </span>
                          <span className="text-sm font-medium text-dark-green-7">
                            {formatPrice(item.total)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm font-medium text-dark-green-7">
                          {formatPrice(
                            dataSource === 'cart' ? item.total : (
                              item.totalPrice || 
                              (item.unitPrice * (item.quantity || 1)) || 
                              (item.main?.price * (item.main?.quantity || 1)) || 
                              0
                            )
                          )}
                        </span>
                      )}
                    </div>
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

        <div className="space-y-3">
          {/* Sous-total (regular price) */}
          <div className="flex justify-between text-gray-700">
            <span>Sous-total</span>
            <span>{formatPrice(regularSubtotal)}</span>
          </div>

          {/* Show discount if there are promotions */}
          {hasPromotions && savings > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Réduction</span>
              <span>-{formatPrice(savings)}</span>
            </div>
          )}

          {/* Show delivery fee in step 0 if city is selected, or in later steps */}
          {(currentStep === 0 && formData?.city && cityDeliveryFee >= 0) || currentStep >= 1 ? (
            <div className="flex justify-between text-gray-700">
              <span>Livraison</span>
              <span>
                {(() => {
                  const totalDeliveryCost = calculateTotalDeliveryCost();
                  return totalDeliveryCost > 0 ? formatPrice(totalDeliveryCost) : 'Gratuit';
                })()}
              </span>
            </div>
          ) : null}

          <div className="flex justify-between font-medium text-dark-green-1 pt-3 border-t border-gray-200">
            <span>Montant à payer</span>
            <span>
              {(() => {
                const totalDeliveryCost = calculateTotalDeliveryCost();
                if (currentStep === 0 && formData?.city) {
                  return formatPrice(subtotal + totalDeliveryCost);
                } else if (currentStep >= 1) {
                  return formatPrice(subtotal + totalDeliveryCost);
                } else {
                  return formatPrice(subtotal);
                }
              })()}
            </span>
          </div>

          {currentStep === 0 && !formData?.city && (
            <div className="text-xs text-gray-500 italic">
              * Frais de livraison calculés après sélection de la ville
            </div>
          )}
        </div>
      </div>
    </ContentContainer>
  );
};

export default Sidebar;