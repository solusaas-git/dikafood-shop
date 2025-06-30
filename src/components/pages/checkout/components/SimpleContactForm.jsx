import React from 'react';
import { User, Phone, MapPin } from '@phosphor-icons/react';
import { EnvelopeSimple as Mail } from '@phosphor-icons/react';
import { Form } from '@/components/ui/forms';

const SimpleContactForm = ({ 
  formData, 
  updateFormData, 
  nextStep, 
  prevStep, 
  errors, 
  isLoading 
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
        <User size={18} weight="duotone" className="text-dark-green-1" />
      </div>
      <span className="text-dark-green-1 font-medium">Informations de contact</span>
    </div>
  );

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
      <Form.Group layout="inline">
        <Form.InputWithIcon
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="Prénom"
          icon={<User size={18} weight="duotone" className="text-dark-green-1" />}
          error={errors.firstName}
          required
        />
        <Form.InputWithIcon
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Nom"
          icon={<User size={18} weight="duotone" className="text-dark-green-1" />}
          error={errors.lastName}
          required
        />
      </Form.Group>

      <Form.InputWithIcon
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        icon={<Mail size={18} weight="duotone" className="text-dark-green-1" />}
        error={errors.email}
        required
      />

      <Form.InputWithIcon
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Téléphone"
        icon={<Phone size={18} weight="duotone" className="text-dark-green-1" />}
        error={errors.phone}
        required
      />

      <Form.Group layout="inline">
        <Form.Select
          name="country"
          value={formData.country}
          onChange={handleChange}
          options={[
            { value: 'MA', label: 'Maroc' },
            { value: 'FR', label: 'France' },
            { value: 'ES', label: 'Espagne' }
          ]}
          placeholder="Pays"
          error={errors.country}
          required
        />
        <Form.InputWithIcon
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="Ville"
          icon={<MapPin size={18} weight="duotone" className="text-dark-green-1" />}
          error={errors.city}
          required
        />
      </Form.Group>

      <Form.InputWithIcon
        type="text"
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="Adresse complète"
        icon={<MapPin size={18} weight="duotone" className="text-dark-green-1" />}
        error={errors.address}
        required
      />
    </Form>
  );
};

export default SimpleContactForm;