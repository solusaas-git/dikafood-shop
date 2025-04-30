import React, { useRef, useEffect } from 'react';
import { CaretLeft, CaretRight, MapPin, User, Envelope, Phone, Globe, House } from '@phosphor-icons/react';
import countryList from '../../../data/countries';

const ContactLocationForm = ({ formData, handleChange, nextStep, prevStep }) => {
  const countrySelectRef = useRef(null);

  // Handle country selection to display the flag
  const handleCountryChange = (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const flag = selectedOption.getAttribute('data-flag');

    if (countrySelectRef.current) {
      countrySelectRef.current.setAttribute('data-selected-flag', flag || '');
    }

    handleChange(e);
  };

  // Set initial flag if country is already selected
  useEffect(() => {
    if (formData.country && countrySelectRef.current) {
      const country = countryList.find(c => c.name === formData.country);
      if (country) {
        countrySelectRef.current.setAttribute('data-selected-flag', country.flag);
      }
    }
  }, [formData.country]);

  // Get cities based on selected country
  const getCitiesByCountry = (country) => {
    switch(country) {
      case 'Morocco':
        return [
          'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tangier',
          'Agadir', 'Meknès', 'Oujda', 'Kenitra', 'Tétouan'
        ];
      case 'France':
        return [
          'Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice',
          'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille'
        ];
      case 'United States':
        return [
          'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix',
          'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'
        ];
      case 'United Kingdom':
        return [
          'London', 'Birmingham', 'Manchester', 'Glasgow', 'Liverpool',
          'Bristol', 'Sheffield', 'Leeds', 'Edinburgh', 'Leicester'
        ];
      case 'Spain':
        return [
          'Madrid', 'Barcelona', 'Valencia', 'Seville', 'Zaragoza',
          'Málaga', 'Murcia', 'Palma', 'Las Palmas', 'Bilbao'
        ];
      default:
        return ['Select a country first'];
    }
  };

  const cities = formData.country ? getCitiesByCountry(formData.country) : ['Select a country first'];

  const handleSubmit = (e) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <div className="contact-form">
      <div className="checkout-section-header">
        <MapPin size={22} weight="duotone" />
        <h2>Contact & Location</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">
              <User size={16} weight="duotone" />
              First name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">
              <User size={16} weight="duotone" />
              Last name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">
              <Envelope size={16} weight="duotone" />
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">
              <Phone size={16} weight="duotone" />
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="country">
              <Globe size={16} weight="duotone" />
              Country
            </label>
            <select
              ref={countrySelectRef}
              id="country"
              name="country"
              value={formData.country}
              onChange={handleCountryChange}
              required
              className="country-select"
            >
              <option value="">Select country</option>
              {countryList.map(country => (
                <option key={country.code} value={country.name} data-flag={country.flag}>
                  {country.flag} {country.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="city">
              <MapPin size={16} weight="duotone" />
              City
            </label>
            <select
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              disabled={!formData.country}
            >
              <option value="">Select city</option>
              {cities.map(city => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="address">
            <House size={16} weight="duotone" />
            Billing Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group shipping-checkbox">
          <input
            type="checkbox"
            id="differentShipping"
            name="differentShipping"
            checked={formData.differentShipping}
            onChange={handleChange}
          />
          <label htmlFor="differentShipping">
            Different Shipping Address
          </label>
        </div>

        {formData.differentShipping && (
          <div className="shipping-address-section">
            <div className="form-group">
              <label htmlFor="shippingAddress">
                <House size={16} weight="duotone" />
                Shipping Address
              </label>
              <input
                type="text"
                id="shippingAddress"
                name="shippingAddress"
                value={formData.shippingAddress}
                onChange={handleChange}
                required={formData.differentShipping}
              />
            </div>
          </div>
        )}

        <div className="checkout-actions">
          <button type="button" className="btn-secondary" onClick={prevStep}>
            <CaretLeft weight="duotone" /> back
          </button>
          <button type="submit" className="btn-primary">
            next <CaretRight weight="duotone" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactLocationForm;