import React, { useState, useEffect } from 'react';
import { User, Phone, MapPin } from '@phosphor-icons/react';
import { EnvelopeSimple as Mail } from '@phosphor-icons/react';
import { Form } from '@/components/ui/forms';
import dynamic from 'next/dynamic';

// Create a client-only wrapper for form inputs to avoid hydration issues with browser extensions
const ClientOnlyFormInputs = dynamic(() => Promise.resolve(({ children }) => <>{children}</>), {
  ssr: false,
  loading: () => (
    <div className="space-y-4">
      <div className="animate-pulse">
        <div className="h-12 bg-gray-200 rounded-lg"></div>
      </div>
      <div className="animate-pulse">
        <div className="h-12 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  )
});

const SimpleContactForm = ({ 
  formData, 
  updateFormData, 
  nextStep, 
  prevStep, 
  errors, 
  isLoading 
}) => {
  const [cities, setCities] = useState([]);
  const [citiesLoading, setCitiesLoading] = useState(true);
  const [countries] = useState([
    { value: 'MA', label: 'Maroc' },
    { value: 'FR', label: 'France' },
    { value: 'ES', label: 'Espagne' }
  ]);

  // Fetch cities from API based on selected country
  useEffect(() => {
    const fetchCities = async () => {
      const countryToFetch = formData.country || 'MA'; // Default to Morocco
      
      try {
        setCitiesLoading(true);
        const response = await fetch(`/api/cities?deliveryOnly=true&country=${countryToFetch}&sort=asc`);
        const data = await response.json();
        
        if (data.success) {
          // Convert cities to options format with postal code and sort A-Z
          const cityOptions = data.data.cities
            .map(city => ({
              value: city.name,
              label: city.displayName || city.name,
              deliveryFee: city.deliveryFee,
              postalCode: city.postalCode
            }))
            .sort((a, b) => a.label.localeCompare(b.label));
          setCities(cityOptions);
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
      } finally {
        setCitiesLoading(false);
      }
    };

    fetchCities();
  }, [formData.country]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // When country changes, reset city and postal code
    if (name === 'country') {
      updateFormData({ 
        [name]: value,
        city: '',
        postalCode: ''
      });
    }
    // When city changes, auto-fill postal code
    else if (name === 'city') {
      const selectedCity = cities.find(city => city.value === value);
      updateFormData({ 
        [name]: value,
        postalCode: selectedCity?.postalCode || ''
      });
    }
    else {
      updateFormData({ [name]: value });
    }
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
      <ClientOnlyFormInputs>
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
      </ClientOnlyFormInputs>

      <ClientOnlyFormInputs>
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
          placeholder="Téléphone (ex: 0612345678)"
          icon={<Phone size={18} weight="duotone" className="text-dark-green-1" />}
          error={errors.phone}
          required
        />
      </ClientOnlyFormInputs>

      <Form.InputWithIcon
        type="text"
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="Rue / Adresse"
        icon={<MapPin size={18} weight="duotone" className="text-dark-green-1" />}
        error={errors.address}
        required
      />

      <Form.Select
        name="country"
        value={formData.country || 'MA'}
        onChange={handleChange}
        options={countries}
        placeholder="Sélectionnez un pays"
        icon={<MapPin size={18} weight="duotone" className="text-dark-green-1" />}
        error={errors.country}
        required
      />

      <Form.Group layout="inline">
        <Form.Select
          name="city"
          value={formData.city}
          onChange={handleChange}
          options={cities}
          placeholder={
            !formData.country 
              ? "Sélectionnez d'abord un pays" 
              : citiesLoading 
                ? "Chargement des villes..." 
                : "Sélectionnez une ville"
          }
          icon={<MapPin size={18} weight="duotone" className="text-dark-green-1" />}
          error={errors.city}
          disabled={!formData.country || citiesLoading}
          required
        />

        <Form.InputWithIcon
          type="text"
          name="postalCode"
          value={formData.postalCode}
          onChange={handleChange}
          placeholder="Code postal"
          icon={<MapPin size={18} weight="duotone" className="text-dark-green-1" />}
          error={errors.postalCode}
          disabled={!formData.city}
          readOnly
          required
        />
      </Form.Group>
    </Form>
  );
};

export default SimpleContactForm;