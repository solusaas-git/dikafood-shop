import React from 'react';
import { CreditCard, Bank, Money } from '@phosphor-icons/react';
import { Form } from '@/components/ui/forms';
import Image from 'next/image';

const SimplePaymentForm = ({ 
  formData, 
  updateFormData, 
  placeOrder, 
  prevStep, 
  errors, 
  isLoading,
  banks,
  loadingStates,
  paymentMethods = []
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await placeOrder();
    } catch (error) {
      console.error('Order placement failed:', error);
    }
  };

  const headerContent = (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-logo-lime/20 border border-logo-lime/30 flex items-center justify-center">
        <CreditCard size={18} weight="duotone" className="text-dark-green-1" />
      </div>
      <span className="text-dark-green-1 font-medium">Méthode de paiement</span>
    </div>
  );

  // Get icon based on payment method type
  const getPaymentIcon = (type) => {
    switch (type) {
      case 'cash':
      case 'cash-on-delivery':
        return <Money size={24} weight="duotone" className="text-gray-600" />;
      case 'bank-transfer':
      case 'bank':
        return <Bank size={24} weight="duotone" className="text-gray-600" />;
      case 'card':
      case 'stripe':
        return <CreditCard size={24} weight="duotone" className="text-gray-600" />;
      default:
        return <Money size={24} weight="duotone" className="text-gray-600" />;
    }
  };

  return (
    <Form
      onSubmit={handleSubmit}
      withContainer
      headerContent={headerContent}
      headerVariant="default"
      submitText="Confirmer la commande"
      cancelText="Retour"
      onCancel={prevStep}
      loading={isLoading}
    >
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Méthode de paiement
        </label>
        
        {loadingStates.paymentMethods ? (
          <div className="text-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-logo-brown mx-auto"></div>
            <span className="mt-2 text-sm text-gray-600">Chargement des méthodes de paiement...</span>
          </div>
        ) : paymentMethods.length > 0 ? (
          <div className="grid gap-4">
            {paymentMethods.map((method) => {
              const isSelected = formData.paymentMethod === method._id;
              
              return (
                <div
                  key={method._id}
                  onClick={() => updateFormData({ paymentMethod: method._id })}
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
                          {getPaymentIcon(method.type)}
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
                        <p className="text-sm text-gray-600">
                          {method.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center p-8 border-2 border-dashed border-gray-200 rounded-xl">
            <CreditCard size={48} weight="duotone" className="text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Aucune méthode de paiement disponible</p>
            <p className="text-sm text-gray-400 mt-1">Veuillez contacter le support</p>
          </div>
        )}

        {errors.paymentMethod && (
          <p className="text-sm text-red-600 mt-2">{errors.paymentMethod}</p>
        )}
      </div>

      {/* Bank selection for bank transfer */}
      {(() => {
        const selectedMethod = paymentMethods.find(m => m._id === formData.paymentMethod);
        return selectedMethod && (selectedMethod.type === 'bank-transfer' || selectedMethod.type === 'bank');
      })() && (
        <Form.Group label="Sélectionnez votre banque">
          {loadingStates.banks ? (
            <div className="text-center p-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-logo-brown mx-auto"></div>
              <span className="ml-2 text-sm text-gray-600">Chargement des banques...</span>
            </div>
          ) : banks.length > 0 ? (
            <Form.RadioGroup
              name="selectedBankId"
              value={formData.selectedBankId}
              onChange={handleChange}
              options={banks.map(bank => ({
                value: bank.id || bank.bankAccountId,
                label: (
                  <div className="flex items-center gap-3">
                    {bank.hasLogo ? (
                      <div className="w-8 h-8 rounded bg-white border border-gray-200 flex items-center justify-center">
                        <Bank size={16} className="text-gray-400" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded bg-gray-100 border border-gray-200 flex items-center justify-center">
                        <Bank size={16} className="text-gray-400" />
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-dark-green-7">{bank.name || bank.bankName}</div>
                      <div className="text-xs text-gray-500">
                        {bank.accountHolder} • {bank.hasQRCode ? 'QR Code disponible' : 'Virement traditionnel'}
                      </div>
                    </div>
                  </div>
                ),
                icon: null
              }))}
              error={errors.selectedBankId}
              className="flex flex-col gap-2"
            />
          ) : (
            <div className="text-center p-4 border border-amber-200 rounded-lg bg-amber-50/30">
              <p className="text-gray-500">Aucune banque disponible</p>
            </div>
          )}
        </Form.Group>
      )}

      {/* Note for Stripe */}
      {(() => {
        const selectedMethod = paymentMethods.find(m => m._id === formData.paymentMethod);
        return selectedMethod && (selectedMethod.type === 'card' || selectedMethod.type === 'stripe');
      })() && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-700">
            <CreditCard size={16} />
            <span className="text-sm font-medium">Paiement sécurisé</span>
          </div>
          <p className="text-sm text-blue-600 mt-1">
            Votre paiement sera traité de manière sécurisée via Stripe à l'étape suivante.
          </p>
        </div>
      )}
    </Form>
  );
};

export default SimplePaymentForm; 