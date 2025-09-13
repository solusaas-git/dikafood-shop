import React from 'react';
import { Truck, Storefront, Clock } from '@phosphor-icons/react';
import { Form } from '@/components/ui/forms';
import Image from 'next/image';

const SimpleDeliveryForm = ({ 
  formData, 
  updateFormData, 
  nextStep, 
  prevStep, 
  errors, 
  isLoading,
  deliveryMethods,
  loadingStates,
  cityDeliveryFee = 0
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    nextStep();
  };

  // Get current delivery method details
  const currentDeliveryMethod = deliveryMethods.find(m => m._id === formData.deliveryMethodId);
  const isPickupDelivery = currentDeliveryMethod?.type === 'pickup';
  const availableShops = currentDeliveryMethod?.shops || [];

  const headerContent = (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-logo-lime/20 border border-logo-lime/30 flex items-center justify-center">
        <Truck size={18} weight="duotone" className="text-dark-green-1" />
      </div>
      <span className="text-dark-green-1 font-medium">Méthode de livraison</span>
    </div>
  );

  // Format time display
  const formatTimeDisplay = (estimatedTime) => {
    if (!estimatedTime) return '';
    
    const unitText = {
      minutes: 'min',
      hours: 'h',
      days: 'j'
    };
    
    if (estimatedTime.min === estimatedTime.max) {
      return `${estimatedTime.min}${unitText[estimatedTime.unit]}`;
    }
    
    return `${estimatedTime.min}${unitText[estimatedTime.unit]}-${estimatedTime.max}${unitText[estimatedTime.unit]}`;
  };

  // Format price display
  const formatPrice = (price, isAdditional = false) => {
    if (price === 0) return isAdditional ? 'Inclus' : 'Gratuit';
    return `+${price} MAD${isAdditional ? ' (supplément)' : ''}`;
  };

  return (
    <Form
      onSubmit={handleSubmit}
      withContainer
      headerContent={headerContent}
      headerVariant="default"
      submitText="Continuer"
      cancelText="Retour"
      onCancel={prevStep}
      loading={isLoading}
    >
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Méthode de livraison
        </label>
        
        {loadingStates.deliveryMethods ? (
          <div className="text-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-logo-brown mx-auto"></div>
            <span className="mt-2 text-sm text-gray-600">Chargement des méthodes de livraison...</span>
          </div>
        ) : deliveryMethods.length > 0 ? (
          <div className="grid gap-4">
            {deliveryMethods.map((method) => {
              const isSelected = formData.deliveryMethodId === method._id;
              const timeDisplay = formatTimeDisplay(method.estimatedTime);
              
              return (
                <div
                  key={method._id}
                  onClick={() => updateFormData({ deliveryMethodId: method._id })}
                  className={`
                    relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                    ${isSelected 
                      ? 'border-logo-brown bg-logo-brown/5 shadow-md' 
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }
                  `}
                >
                  {/* Selection indicator */}
                  <div className={`
                    absolute top-4 right-4 w-5 h-5 rounded-full border-2 transition-all
                    ${isSelected 
                      ? 'border-logo-brown bg-logo-brown' 
                      : 'border-gray-300'
                    }
                  `}>
                    {isSelected && (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-start gap-4 pr-8">
                    {/* Logo or Icon */}
                    <div className="flex-shrink-0">
                      {method.logo ? (
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 bg-white">
                          <Image
                            src={method.logo}
                            alt={method.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                          {method.type === 'pickup' ? (
                            <Storefront size={24} weight="duotone" className="text-gray-600" />
                          ) : (
                            <Truck size={24} weight="duotone" className="text-gray-600" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {method.name}
                        </h3>
                      </div>

                      {method.description && (
                        <p className="text-sm text-gray-600 mb-3">
                          {method.description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        {/* Type */}
                        <div className="flex items-center gap-1.5">
                          {method.type === 'pickup' ? (
                            <Storefront size={16} weight="duotone" className="text-gray-500" />
                          ) : (
                            <Truck size={16} weight="duotone" className="text-gray-500" />
                          )}
                          <span className="text-gray-600">
                            {method.type === 'pickup' ? 'Retrait en magasin' : 'Livraison à domicile'}
                          </span>
                        </div>

                        {/* Time */}
                        {timeDisplay && (
                          <div className="flex items-center gap-1.5">
                            <Clock size={16} weight="duotone" className="text-gray-500" />
                            <span className="text-gray-600">{timeDisplay}</span>
                          </div>
                        )}

                        {/* Price */}
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-gray-900">
                            {formatPrice(method.price, method.price > 0)}
                          </span>
                        </div>
                      </div>

                      {/* Base delivery fee note */}
                      {cityDeliveryFee > 0 && method.type === 'delivery' && (
                        <div className="mt-2 text-xs text-gray-500 bg-gray-50 rounded-md px-2 py-1">
                          Frais de base: {cityDeliveryFee} MAD • Total: {cityDeliveryFee + method.price} MAD
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center p-8 border-2 border-dashed border-gray-200 rounded-xl">
            <Truck size={48} weight="duotone" className="text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Aucune méthode de livraison disponible</p>
            <p className="text-sm text-gray-400 mt-1">Veuillez contacter le support</p>
          </div>
        )}

        {errors.deliveryMethodId && (
          <p className="text-sm text-red-600 mt-2">{errors.deliveryMethodId}</p>
        )}
      </div>

      {/* Shop selection for pickup delivery */}
      {isPickupDelivery && availableShops.length > 0 && (
        <div className="space-y-4 mt-6">
          <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
            <Storefront size={18} weight="duotone" className="text-gray-600" />
            <span>Magasin de retrait</span>
          </label>
          
          <div className="grid gap-3">
            {availableShops.map((shop, index) => {
              const shopId = shop._id || `shop-${index}`;
              const isSelected = formData.selectedShopId === shopId;
              
              return (
                <div
                  key={shopId}
                  onClick={() => updateFormData({ selectedShopId: shopId })}
                  className={`
                    relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                    ${isSelected 
                      ? 'border-logo-brown bg-logo-brown/5 shadow-sm' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  {/* Selection indicator */}
                  <div className={`
                    absolute top-3 right-3 w-4 h-4 rounded-full border-2 transition-all
                    ${isSelected 
                      ? 'border-logo-brown bg-logo-brown' 
                      : 'border-gray-300'
                    }
                  `}>
                    {isSelected && (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-start gap-3 pr-6">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                      <Storefront size={16} weight="duotone" className="text-gray-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900">{shop.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {shop.address}, {shop.city}
                      </p>
                      {shop.phone && (
                        <p className="text-xs text-gray-500 mt-1">
                          {shop.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {errors.selectedShopId && (
            <p className="text-sm text-red-600">{errors.selectedShopId}</p>
          )}
        </div>
      )}
    </Form>
  );
};

export default SimpleDeliveryForm; 