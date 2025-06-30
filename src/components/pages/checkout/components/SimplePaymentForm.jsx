import React from 'react';
import { CreditCard, Bank, Money } from '@phosphor-icons/react';
import { Form } from '@/components/ui/forms';

const SimplePaymentForm = ({ 
  formData, 
  updateFormData, 
  nextStep, 
  prevStep, 
  errors, 
  isLoading,
  banks,
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

  const headerContent = (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-logo-lime/20 border border-logo-lime/30 flex items-center justify-center">
        <CreditCard size={18} weight="duotone" className="text-dark-green-1" />
      </div>
      <span className="text-dark-green-1 font-medium">Méthode de paiement</span>
    </div>
  );

  const paymentMethodOptions = [
    {
      value: 'cash-on-delivery',
      label: 'Paiement à la livraison',
      description: 'Payez en espèces à la réception',
      icon: <Money size={20} weight="duotone" className="text-logo-brown" />
    },
    {
      value: 'bank-transfer',
      label: 'Virement bancaire',
      description: 'Virement sur notre compte bancaire',
      icon: <Bank size={20} weight="duotone" className="text-logo-brown" />
    },
    {
      value: 'stripe',
      label: 'Carte bancaire',
      description: 'Paiement sécurisé par carte',
      icon: <CreditCard size={20} weight="duotone" className="text-logo-brown" />
    }
  ];

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
      <Form.Group label="Méthode de paiement">
        <Form.RadioGroup
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
          options={paymentMethodOptions}
          error={errors.paymentMethod}
          className="flex flex-wrap gap-3"
          optionClassName="flex-1 min-w-[200px]"
        />
      </Form.Group>

      {/* Bank selection for bank transfer */}
      {formData.paymentMethod === 'bank-transfer' && (
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
      {formData.paymentMethod === 'stripe' && (
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