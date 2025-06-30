import React from 'react';
import { Truck, Storefront } from '@phosphor-icons/react';
import { Form } from '@/components/ui/forms';

const SimpleDeliveryForm = ({ 
  formData, 
  updateFormData, 
  nextStep, 
  prevStep, 
  errors, 
  isLoading,
  deliveryMethods,
  loadingStates
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
  const isPickupDelivery = currentDeliveryMethod?.data?.type === 'pickup';
  const availableShops = currentDeliveryMethod?.data?.shops || [];

  const headerContent = (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-logo-lime/20 border border-logo-lime/30 flex items-center justify-center">
        <Truck size={18} weight="duotone" className="text-dark-green-1" />
      </div>
      <span className="text-dark-green-1 font-medium">Méthode de livraison</span>
    </div>
  );

  // Create delivery method options
  const deliveryMethodOptions = deliveryMethods.map((method, index) => ({
    value: method._id || `delivery-${index}`,
    label: method.data?.name || method.name || 'Méthode de livraison',
    description: `${method.data?.unitPrice === 0 ? 'Gratuit' : `${method.data?.unitPrice || 0} MAD`} • ${method.data?.type === 'pickup' ? 'Retrait en magasin' : 'Livraison à domicile'}`,
    icon: <Truck size={24} weight="duotone" className="text-logo-brown" />
  }));

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
      <Form.Group label="Méthode de livraison">
        {loadingStates.deliveryMethods ? (
          <div className="text-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-logo-brown mx-auto"></div>
            <span className="ml-2 text-sm text-gray-600">Chargement...</span>
          </div>
        ) : deliveryMethods.length > 0 ? (
          <Form.RadioGroup
            name="deliveryMethodId"
            value={formData.deliveryMethodId}
            onChange={handleChange}
            options={deliveryMethodOptions}
            error={errors.deliveryMethodId}
            className="flex flex-wrap gap-3"
            optionClassName="flex-1 min-w-[200px]"
          />
        ) : (
          <div className="text-center p-4 border border-amber-200 rounded-lg bg-amber-50/30">
            <p className="text-gray-500">Aucune méthode de livraison disponible</p>
          </div>
        )}
      </Form.Group>

      {/* Shop selection for pickup delivery */}
      {isPickupDelivery && availableShops.length > 0 && (
        <Form.Group label={
          <div className="flex items-center gap-1.5">
            <Storefront size={18} weight="duotone" className="text-dark-green-1" />
            <span>Magasin de retrait</span>
          </div>
        }>
          <Form.RadioGroup
            name="selectedShopId"
            value={formData.selectedShopId}
            onChange={handleChange}
            options={availableShops.map((shop, index) => ({
              value: shop._id || `shop-${index}`,
              label: (
                <div>
                  <div className="font-medium text-dark-green-7">{shop.title}</div>
                  <div className="text-xs text-gray-500">
                    {shop.address}, {shop.city}
                  </div>
                </div>
              ),
              icon: <Storefront size={20} weight="duotone" className="text-logo-brown" />
            }))}
            error={errors.selectedShopId}
            className="flex flex-col gap-2"
          />
        </Form.Group>
      )}
    </Form>
  );
};

export default SimpleDeliveryForm; 