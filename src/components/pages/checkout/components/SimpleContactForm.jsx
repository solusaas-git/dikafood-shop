import React, { useState, useEffect } from 'react';
import { User, Phone, MapPin } from '@phosphor-icons/react';
import { EnvelopeSimple as Mail } from '@phosphor-icons/react';
import { Form } from '@/components/ui/forms';
import dynamic from 'next/dynamic';

// Create a client-only wrapper for form inputs to avoid hydration issues with browser extensions
const ClientOnlyFormInputs = dynamic(() => Promise.resolve(({ children }) => <>{children}</>), {
  ssr: false,
  loading: () => (
    <div className="space-y-3 md:space-y-4">
      <div className="animate-pulse">
        <div className="h-10 md:h-12 bg-gray-200 rounded-lg"></div>
      </div>
      <div className="animate-pulse">
        <div className="h-10 md:h-12 bg-gray-200 rounded-lg"></div>
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
      <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-logo-lime/20 border border-logo-lime/30 flex items-center justify-center">
        <User size={14} className="md:w-[18px] md:h-[18px] text-dark-green-1" weight="duotone" />
      </div>
      <span className="text-dark-green-1 font-medium text-sm md:text-base">Informations de contact</span>
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
      variant="condensed"
    >
      {/* Personal Information */}
      <Form.Group layout="inline">
        <Form.InputWithIcon
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="Prénom"
          icon={<User size={16} className="md:w-[18px] md:h-[18px] text-dark-green-1" weight="duotone" />}
          error={errors.firstName}
          required
        />
        <Form.InputWithIcon
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Nom"
          icon={<User size={16} className="md:w-[18px] md:h-[18px] text-dark-green-1" weight="duotone" />}
          error={errors.lastName}
          required
        />
      </Form.Group>

      <Form.Group layout="inline">
        <Form.InputWithIcon
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          icon={<Mail size={16} className="md:w-[18px] md:h-[18px] text-dark-green-1" weight="duotone" />}
          error={errors.email}
          required
        />
        <Form.InputWithIcon
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Téléphone"
          icon={<Phone size={16} className="md:w-[18px] md:h-[18px] text-dark-green-1" weight="duotone" />}
          error={errors.phone}
          required
        />
      </Form.Group>

      {/* Address Information */}
      <Form.InputWithIcon
        type="text"
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="Rue / Adresse"
        icon={<MapPin size={16} className="md:w-[18px] md:h-[18px] text-dark-green-1" weight="duotone" />}
        error={errors.address}
        required
      />

      <Form.Group layout="inline">
        <Form.Select
          name="country"
          value={formData.country || 'MA'}
          onChange={handleChange}
          options={countries}
          placeholder="Pays"
          icon={<MapPin size={16} className="md:w-[18px] md:h-[18px] text-dark-green-1" weight="duotone" />}
          error={errors.country}
          required
        />
        <Form.Select
          name="city"
          value={formData.city}
          onChange={handleChange}
          options={cities}
          placeholder={
            !formData.country 
              ? "Pays d'abord" 
              : citiesLoading 
                ? "Chargement..." 
                : "Ville"
          }
          icon={<MapPin size={16} className="md:w-[18px] md:h-[18px] text-dark-green-1" weight="duotone" />}
          error={errors.city}
          disabled={!formData.country || citiesLoading}
          required
        />
      </Form.Group>

      <Form.InputWithIcon
        type="text"
        name="postalCode"
        value={formData.postalCode}
        onChange={handleChange}
        placeholder="Code postal"
        icon={<MapPin size={16} className="md:w-[18px] md:h-[18px] text-dark-green-1" weight="duotone" />}
        error={errors.postalCode}
        disabled={!formData.city}
        readOnly
        required
      />
    </Form>
  );
};

export default SimpleContactForm;