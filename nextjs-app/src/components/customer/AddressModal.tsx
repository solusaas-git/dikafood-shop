'use client';

import React, { useState, useEffect } from 'react';
import LucideIcon from '../ui/icons/LucideIcon';

interface Address {
  _id?: string;
  type: string;
  company?: string;
  street: string;
  street2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
  instructions?: string;
  isDefault: boolean;
}

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: Address) => void;
  address?: Address | null;
  loading?: boolean;
}

const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  onClose,
  onSave,
  address,
  loading = false
}) => {
  const [formData, setFormData] = useState<Address>({
    type: 'home',
    company: '',
    street: '',
    street2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Maroc',
    phone: '',
    instructions: '',
    isDefault: false
  });

  const [customCity, setCustomCity] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens/closes or address changes
  useEffect(() => {
    if (isOpen) {
      if (address) {
        setFormData({ ...address });
        // Check if it's a custom city (not in the predefined list)
        const moroccanCities = [
          'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir', 'Meknès', 
          'Oujda', 'Kenitra', 'Tétouan', 'Safi', 'Mohammedia', 'El Jadida', 'Beni Mellal',
          'Errachidia', 'Taza', 'Essaouira', 'Khouribga', 'Guelmim', 'Jorf El Melha',
          'Laâyoune', 'Ksar El Kebir', 'Sale', 'Bir Lehlou', 'Arfoud', 'Temara',
          'Ouarzazate', 'Tiznit', 'Taroudant', 'Settat', 'Larache', 'Ksar es Seghir',
          'Jerada', 'Kasba Tadla', 'Guercif', 'Dakhla', 'Chefchaouen'
        ];
        if (address.city && !moroccanCities.includes(address.city)) {
          setCustomCity(address.city);
        } else {
          setCustomCity('');
        }
      } else {
        setFormData({
          type: 'home',
          company: '',
          street: '',
          street2: '',
          city: '',
          state: '',
          postalCode: '',
          country: 'Maroc',
          phone: '',
          instructions: '',
          isDefault: false
        });
        setCustomCity('');
      }
      setErrors({});
    }
  }, [isOpen, address]);

  const handleInputChange = (field: keyof Address, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.street.trim()) {
      newErrors.street = 'L\'adresse est requise';
    }
    
    // City validation - check if city is selected or custom city is provided
    if (!formData.city.trim() && !customCity.trim()) {
      newErrors.city = 'La ville est requise';
    }
    if (formData.city === 'autre' && !customCity.trim()) {
      newErrors.customCity = 'Le nom de la ville est requis';
    }
    
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Le code postal est requis';
    }
    if (!formData.country.trim()) {
      newErrors.country = 'Le pays est requis';
    }

    // Phone validation (optional but if provided, should be valid)
    if (formData.phone && !/^(\+212|0)[0-9]{9}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Format de téléphone invalide (ex: +212600000000)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Use custom city if "autre" is selected
      const finalFormData = {
        ...formData,
        city: formData.city === 'autre' ? customCity : formData.city
      };
      onSave(finalFormData);
    }
  };

  if (!isOpen) return null;

  const addressTypes = [
    { value: 'home', label: 'Domicile' },
    { value: 'work', label: 'Bureau' },
    { value: 'other', label: 'Autre' }
  ];

  const moroccanCities = [
    'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir', 'Meknès', 
    'Oujda', 'Kenitra', 'Tétouan', 'Safi', 'Mohammedia', 'El Jadida', 'Beni Mellal',
    'Errachidia', 'Taza', 'Essaouira', 'Khouribga', 'Guelmim', 'Jorf El Melha',
    'Laâyoune', 'Ksar El Kebir', 'Sale', 'Bir Lehlou', 'Arfoud', 'Temara',
    'Ouarzazate', 'Tiznit', 'Taroudant', 'Settat', 'Larache', 'Ksar es Seghir',
    'Jerada', 'Kasba Tadla', 'Guercif', 'Dakhla', 'Chefchaouen'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {address ? 'Modifier l\'adresse' : 'Ajouter une adresse'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            disabled={loading}
          >
            <LucideIcon name="x" size="md" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Address Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type d'adresse *
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
              disabled={loading}
            >
              {addressTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>


          {/* Company */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Entreprise (optionnel)
            </label>
            <input
              type="text"
              value={formData.company || ''}
              onChange={(e) => handleInputChange('company', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
              disabled={loading}
            />
          </div>

          {/* Address Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adresse *
            </label>
            <input
              type="text"
              value={formData.street}
              onChange={(e) => handleInputChange('street', e.target.value)}
              placeholder="123 Rue de la Paix"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent ${
                errors.street ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={loading}
            />
            {errors.street && (
              <p className="mt-1 text-sm text-red-600">{errors.street}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Complément d'adresse (optionnel)
            </label>
            <input
              type="text"
              value={formData.street2 || ''}
              onChange={(e) => handleInputChange('street2', e.target.value)}
              placeholder="Appartement, étage, bâtiment..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
              disabled={loading}
            />
          </div>

          {/* City, State, Postal Code */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ville *
              </label>
              <select
                value={formData.city}
                onChange={(e) => {
                  handleInputChange('city', e.target.value);
                  // Clear custom city when switching away from "autre"
                  if (e.target.value !== 'autre') {
                    setCustomCity('');
                  }
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent ${
                  errors.city ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={loading}
              >
                <option value="">Sélectionner une ville</option>
                {moroccanCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
                <option value="autre">Autre</option>
              </select>
              {errors.city && (
                <p className="mt-1 text-sm text-red-600">{errors.city}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Région (optionnel)
              </label>
              <input
                type="text"
                value={formData.state || ''}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code postal *
              </label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                placeholder="20000"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent ${
                  errors.postalCode ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {errors.postalCode && (
                <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>
              )}
            </div>
          </div>

          {/* Custom City Field - Show when "Autre" is selected */}
          {formData.city === 'autre' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de la ville *
              </label>
              <input
                type="text"
                value={customCity}
                onChange={(e) => setCustomCity(e.target.value)}
                placeholder="Entrez le nom de votre ville"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent ${
                  errors.customCity ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {errors.customCity && (
                <p className="mt-1 text-sm text-red-600">{errors.customCity}</p>
              )}
            </div>
          )}

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pays *
            </label>
            <select
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
              disabled={loading}
            >
              <option value="Maroc">Maroc</option>
              <option value="France">France</option>
              <option value="Espagne">Espagne</option>
              <option value="Belgique">Belgique</option>
              <option value="Allemagne">Allemagne</option>
            </select>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Téléphone (optionnel)
            </label>
            <input
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+212 6 00 00 00 00"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={loading}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instructions de livraison (optionnel)
            </label>
            <textarea
              value={formData.instructions || ''}
              onChange={(e) => handleInputChange('instructions', e.target.value)}
              placeholder="Sonnez à l'interphone, code d'accès, etc..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
              disabled={loading}
            />
          </div>

          {/* Default Address */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isDefault"
              checked={formData.isDefault}
              onChange={(e) => handleInputChange('isDefault', e.target.checked)}
              className="rounded border-gray-300 text-logo-lime focus:ring-logo-lime"
              disabled={loading}
            />
            <label htmlFor="isDefault" className="text-sm text-gray-700">
              Définir comme adresse par défaut
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-logo-lime text-dark-green-7 rounded-lg hover:bg-logo-lime/90 transition-colors font-medium disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-dark-green-7"></div>
                  Enregistrement...
                </div>
              ) : (
                address ? 'Modifier' : 'Ajouter'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressModal;
