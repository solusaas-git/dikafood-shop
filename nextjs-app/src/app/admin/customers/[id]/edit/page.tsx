'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useNotification } from '@/contexts/NotificationContextNew';
import { useTranslation } from '@/utils/i18n';
import LucideIcon from '../../../../../components/ui/icons/LucideIcon';
import QRCodeDisplay from '../../../../../components/admin/QRCodeDisplay';

interface Address {
  type: 'shipping' | 'billing' | 'both';
  label?: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  street: string;
  street2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
  instructions?: string;
}

interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  customerType: 'final_customer' | 'retail_customer' | 'wholesale_customer';
  isActive: boolean;
  isEmailVerified: boolean;
  dateOfBirth?: string;
  gender?: string;
  addresses?: Address[];
  businessInfo?: {
    companyName?: string;
    taxId?: string;
    businessType?: string;
    discountTier?: number;
    creditLimit?: number;
    paymentTerms?: number;
    qrCode?: string;
  };
  preferences?: {
    language: string;
    currency: string;
    notifications?: {
      email: boolean;
      sms: boolean;
    };
  };
}

interface EditCustomerPageProps {
  params: Promise<{ id: string }>;
}

const EditCustomerPage = ({ params }: EditCustomerPageProps) => {
  const router = useRouter();
  const { addNotification } = useNotification();
  const { t } = useTranslation();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    customerType: 'final_customer' as 'final_customer' | 'retail_customer' | 'wholesale_customer',
    isActive: true,
    isEmailVerified: false,
    dateOfBirth: '',
    gender: '',
    // Business info
    companyName: '',
    taxId: '',
    businessType: '',
    discountTier: 0,
    creditLimit: 0,
    paymentTerms: 0,
    // Preferences
    language: 'fr',
    currency: 'MAD',
    emailNotifications: true,
    smsNotifications: false
  });

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const { id } = await params;
        
        const response = await fetch(`/api/admin/customers/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || t('admin.customers.errors.fetchDataFailed'));
        }

        if (data.success) {
          const customerData = data.data.customer;
          setCustomer(customerData);
          setFormData({
            firstName: customerData.firstName || '',
            lastName: customerData.lastName || '',
            email: customerData.email || '',
            phone: customerData.phone || '',
            customerType: customerData.customerType || 'final_customer',
            isActive: customerData.isActive ?? true,
            isEmailVerified: customerData.isEmailVerified ?? false,
            dateOfBirth: customerData.dateOfBirth ? customerData.dateOfBirth.split('T')[0] : '',
            gender: customerData.gender || '',
            // Business info
            companyName: customerData.businessInfo?.companyName || '',
            taxId: customerData.businessInfo?.taxId || '',
            businessType: customerData.businessInfo?.businessType || '',
            discountTier: customerData.businessInfo?.discountTier || 0,
            creditLimit: customerData.businessInfo?.creditLimit || 0,
            paymentTerms: customerData.businessInfo?.paymentTerms || 0,
            // Preferences
            language: customerData.preferences?.language || 'fr',
            currency: customerData.preferences?.currency || 'MAD',
            emailNotifications: customerData.preferences?.notifications?.email ?? true,
            smsNotifications: customerData.preferences?.notifications?.sms ?? false
          });
          
          // Set addresses
          setAddresses(customerData.addresses || []);
        }

      } catch (error: any) {
        console.error('Fetch customer error:', error);
        addNotification({
          type: 'error',
          message: error.message || t('admin.customers.errors.fetchDataFailed')
        });
        router.push('/admin/customers');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [params, addNotification, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Address management functions
  const addAddress = () => {
    const newAddress: Address = {
      type: 'shipping',
      label: '',
      firstName: '',
      lastName: '',
      company: '',
      street: '',
      street2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'Morocco',
      phone: '',
      isDefault: addresses.length === 0,
      instructions: ''
    };
    setAddresses([...addresses, newAddress]);
  };

  const updateAddress = (index: number, field: keyof Address, value: any) => {
    const updatedAddresses = [...addresses];
    updatedAddresses[index] = {
      ...updatedAddresses[index],
      [field]: value
    };
    
    // If setting as default, unset other defaults
    if (field === 'isDefault' && value) {
      updatedAddresses.forEach((addr, i) => {
        if (i !== index) addr.isDefault = false;
      });
    }
    
    setAddresses(updatedAddresses);
  };

  const removeAddress = (index: number) => {
    const updatedAddresses = addresses.filter((_, i) => i !== index);
    // If we removed the default address, make the first one default
    if (addresses[index].isDefault && updatedAddresses.length > 0) {
      updatedAddresses[0].isDefault = true;
    }
    setAddresses(updatedAddresses);
  };

  const copyShippingToBilling = () => {
    const shippingAddress = addresses.find(addr => addr.type === 'shipping' || addr.type === 'both');
    if (shippingAddress) {
      const billingAddress: Address = {
        ...shippingAddress,
        type: 'billing',
        label: shippingAddress.label ? `${shippingAddress.label} (Billing)` : 'Billing',
        isDefault: false,
        instructions: ''
      };
      setAddresses([...addresses, billingAddress]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      addNotification({
        type: 'error',
        message: t('admin.customers.modal.requiredFieldsError')
      });
      return;
    }

    setSaving(true);
    try {
      const { id } = await params;
      
      const updateData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        customerType: formData.customerType,
        isActive: formData.isActive,
        isEmailVerified: formData.isEmailVerified,
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : null,
        gender: formData.gender || null,
        addresses: addresses,
        preferences: {
          language: formData.language,
          currency: formData.currency,
          notifications: {
            email: formData.emailNotifications,
            sms: formData.smsNotifications
          }
        }
      };

      // Add business info for retail/wholesale customers
      if (formData.customerType === 'retail_customer' || formData.customerType === 'wholesale_customer') {
        (updateData as any).businessInfo = {
          companyName: formData.companyName.trim(),
          taxId: formData.taxId.trim(),
          businessType: formData.businessType.trim(),
          discountTier: formData.discountTier,
          creditLimit: formData.creditLimit,
          paymentTerms: formData.paymentTerms
        };
      }

      const response = await fetch(`/api/admin/customers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t('admin.customers.errors.updateFailed'));
      }

      if (data.success) {
        addNotification({
          type: 'success',
          message: t('admin.customers.notifications.updateSuccess')
        });
        router.push(`/admin/customers/${id}`);
      }
    } catch (error: any) {
      console.error('Update customer error:', error);
      addNotification({
        type: 'error',
        message: error.message || t('admin.customers.errors.updateFailed')
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-logo-lime"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-900"
        >
          <LucideIcon name="arrowleft" size="lg" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('admin.customers.editCustomer.title')}</h1>
          <p className="text-gray-600">{t('admin.customers.editCustomer.subtitle')}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('admin.customers.modal.basicInfo')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.customers.modal.firstName')} *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                placeholder={t('admin.customers.modal.firstNamePlaceholder')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.customers.modal.lastName')} *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                placeholder={t('admin.customers.modal.lastNamePlaceholder')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.customers.modal.email')} *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                placeholder={t('admin.customers.modal.emailPlaceholder')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.customers.modal.phone')}
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                placeholder={t('admin.customers.modal.phonePlaceholder')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.customers.modal.customerType')} *
              </label>
              <select
                name="customerType"
                value={formData.customerType}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
              >
                <option value="final_customer">{t('admin.customers.types.final')}</option>
                <option value="retail_customer">{t('admin.customers.types.retail')}</option>
                <option value="wholesale_customer">{t('admin.customers.types.wholesale')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.customers.modal.dateOfBirth')}
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.customers.modal.gender')}
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
              >
                <option value="">{t('admin.customers.modal.selectGender')}</option>
                <option value="male">{t('admin.customers.modal.male')}</option>
                <option value="female">{t('admin.customers.modal.female')}</option>
                <option value="other">{t('admin.customers.modal.other')}</option>
                <option value="prefer_not_to_say">{t('admin.customers.modal.preferNotToSay')}</option>
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 text-logo-lime focus:ring-logo-lime border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  {t('admin.customers.modal.activeAccount')}
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isEmailVerified"
                  checked={formData.isEmailVerified}
                  onChange={handleChange}
                  className="h-4 w-4 text-logo-lime focus:ring-logo-lime border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  {t('admin.customers.modal.emailVerified')}
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Business Information - Only show for retail/wholesale customers */}
        {(formData.customerType === 'retail_customer' || formData.customerType === 'wholesale_customer') && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('admin.customers.modal.businessInfo')}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('admin.customers.modal.companyName')}
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                  placeholder={t('admin.customers.modal.companyNamePlaceholder')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('admin.customers.modal.taxId')}
                </label>
                <input
                  type="text"
                  name="taxId"
                  value={formData.taxId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                  placeholder={t('admin.customers.modal.taxIdPlaceholder')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('admin.customers.modal.businessType')}
                </label>
                <input
                  type="text"
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                  placeholder={t('admin.customers.modal.businessTypePlaceholder')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('admin.customers.modal.discountTier')}
                </label>
                <input
                  type="number"
                  name="discountTier"
                  value={formData.discountTier}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('admin.customers.modal.creditLimit')}
                </label>
                <input
                  type="number"
                  name="creditLimit"
                  value={formData.creditLimit}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('admin.customers.modal.paymentTerms')}
                </label>
                <input
                  type="number"
                  name="paymentTerms"
                  value={formData.paymentTerms}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                  placeholder="30"
                />
              </div>

              {/* QR Code Preview for Business Customers */}
              {customer?.businessInfo?.qrCode && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {t('admin.customers.modal.customerQRCode')}
                  </label>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-4">
                      <QRCodeDisplay 
                        value={customer.businessInfo.qrCode} 
                        size={80}
                        className="flex-shrink-0"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {customer.businessInfo.qrCode}
                        </p>
                        <p className="text-xs text-gray-500">
                          {t('admin.customers.modal.qrCodeDescription')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Address Management */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{t('admin.customers.modal.addresses')}</h2>
            <div className="flex gap-2">
              {addresses.some(addr => addr.type === 'shipping' || addr.type === 'both') && (
                <button
                  type="button"
                  onClick={copyShippingToBilling}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <LucideIcon name="clipboard" size="sm" />
                  {t('admin.customers.modal.copyShippingToBilling')}
                </button>
              )}
              <button
                type="button"
                onClick={addAddress}
                className="text-sm bg-logo-lime text-dark-green-7 px-3 py-1 rounded-lg hover:bg-logo-lime/90 flex items-center gap-1"
              >
                <LucideIcon name="plus" size="sm" />
                {t('admin.customers.modal.addAddress')}
              </button>
            </div>
          </div>

          {addresses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <LucideIcon name="buildings" size="2xl" color="gray" className="mx-auto mb-3" />
              <p>{t('admin.customers.modal.noAddresses')}</p>
              <p className="text-sm">{t('admin.customers.modal.noAddressesHelp')}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {addresses.map((address, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        address.type === 'shipping' ? 'bg-green-100 text-green-800' :
                        address.type === 'billing' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {address.type === 'both' ? t('admin.customers.modal.shippingAndBilling') : 
                         address.type === 'shipping' ? t('admin.customers.modal.shipping') :
                         address.type === 'billing' ? t('admin.customers.modal.billing') : address.type}
                      </span>
                      {address.isDefault && (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800">
                          {t('admin.customers.modal.default')}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAddress(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <LucideIcon name="trash" size="sm" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('admin.customers.modal.addressType')} *
                      </label>
                      <select
                        value={address.type}
                        onChange={(e) => updateAddress(index, 'type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                      >
                        <option value="shipping">{t('admin.customers.modal.shipping')}</option>
                        <option value="billing">{t('admin.customers.modal.billing')}</option>
                        <option value="both">{t('admin.customers.modal.both')}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('admin.customers.modal.label')}
                      </label>
                      <input
                        type="text"
                        value={address.label || ''}
                        onChange={(e) => updateAddress(index, 'label', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                        placeholder={t('admin.customers.modal.labelPlaceholder')}
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={address.isDefault}
                        onChange={(e) => updateAddress(index, 'isDefault', e.target.checked)}
                        className="h-4 w-4 text-logo-lime focus:ring-logo-lime border-gray-300 rounded"
                      />
                      <label className="ml-2 text-sm text-gray-700">
                        {t('admin.customers.modal.setAsDefault')}
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('admin.customers.modal.firstName')}
                      </label>
                      <input
                        type="text"
                        value={address.firstName || ''}
                        onChange={(e) => updateAddress(index, 'firstName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('admin.customers.modal.lastName')}
                      </label>
                      <input
                        type="text"
                        value={address.lastName || ''}
                        onChange={(e) => updateAddress(index, 'lastName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('admin.customers.modal.company')}
                      </label>
                      <input
                        type="text"
                        value={address.company || ''}
                        onChange={(e) => updateAddress(index, 'company', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('admin.customers.modal.streetAddress')} *
                      </label>
                      <input
                        type="text"
                        value={address.street}
                        onChange={(e) => updateAddress(index, 'street', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('admin.customers.modal.apartmentSuite')}
                      </label>
                      <input
                        type="text"
                        value={address.street2 || ''}
                        onChange={(e) => updateAddress(index, 'street2', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('admin.customers.modal.city')} *
                      </label>
                      <input
                        type="text"
                        value={address.city}
                        onChange={(e) => updateAddress(index, 'city', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('admin.customers.modal.stateProvince')}
                      </label>
                      <input
                        type="text"
                        value={address.state || ''}
                        onChange={(e) => updateAddress(index, 'state', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('admin.customers.modal.postalCode')} *
                      </label>
                      <input
                        type="text"
                        value={address.postalCode}
                        onChange={(e) => updateAddress(index, 'postalCode', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('admin.customers.modal.country')} *
                      </label>
                      <select
                        value={address.country}
                        onChange={(e) => updateAddress(index, 'country', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                        required
                      >
                        <option value="Morocco">Morocco</option>
                        <option value="France">France</option>
                        <option value="Spain">Spain</option>
                        <option value="Germany">Germany</option>
                        <option value="Italy">Italy</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('admin.customers.modal.phone')}
                      </label>
                      <input
                        type="tel"
                        value={address.phone || ''}
                        onChange={(e) => updateAddress(index, 'phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                      />
                    </div>

                    {address.type === 'shipping' && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('admin.customers.modal.deliveryInstructions')}
                        </label>
                        <input
                          type="text"
                          value={address.instructions || ''}
                          onChange={(e) => updateAddress(index, 'instructions', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                          placeholder={t('admin.customers.modal.deliveryInstructionsPlaceholder')}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('admin.customers.modal.preferences')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.customers.modal.language')}
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
              >
                <option value="fr">{t('admin.customers.modal.french')}</option>
                <option value="ar">{t('admin.customers.modal.arabic')}</option>
                <option value="en">{t('admin.customers.modal.english')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.customers.modal.currency')}
              </label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
              >
                <option value="MAD">{t('admin.customers.modal.mad')}</option>
                <option value="EUR">{t('admin.customers.modal.eur')}</option>
                <option value="USD">{t('admin.customers.modal.usd')}</option>
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={formData.emailNotifications}
                  onChange={handleChange}
                  className="h-4 w-4 text-logo-lime focus:ring-logo-lime border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  {t('admin.customers.modal.emailNotifications')}
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="smsNotifications"
                  checked={formData.smsNotifications}
                  onChange={handleChange}
                  className="h-4 w-4 text-logo-lime focus:ring-logo-lime border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  {t('admin.customers.modal.smsNotifications')}
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            {t('admin.customers.modal.cancel')}
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-logo-lime text-dark-green-7 rounded-lg hover:bg-logo-lime/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-dark-green-7"></div>
                {t('admin.customers.modal.saving')}
              </>
            ) : (
              <>
                <LucideIcon name="check" size="sm" />
                {t('admin.customers.editCustomer.saveChanges')}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCustomerPage;
