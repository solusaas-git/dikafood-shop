'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useNotification } from '@/contexts/NotificationContextNew';
import { useTranslation } from '../../../../utils/i18n';
import LucideIcon from '../../../../components/ui/icons/LucideIcon';
import QRCodeDisplay from '../../../../components/admin/QRCodeDisplay';

interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  customerType: 'final_customer' | 'retail_customer' | 'wholesale_customer';
  isActive: boolean;
  isEmailVerified: boolean;
  lastLogin?: string;
  dateOfBirth?: string;
  gender?: string;
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints: number;
  lastOrderDate?: string;
  averageOrderValue: number;
  businessInfo?: {
    companyName?: string;
    taxId?: string;
    businessType?: string;
    discountTier?: number;
    creditLimit?: number;
    paymentTerms?: number;
    qrCode?: string;
  };
  addresses?: Array<{
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
  }>;
  preferences?: {
    language: string;
    currency: string;
    notifications?: {
      email: boolean;
      sms: boolean;
    };
  };
  createdBy?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  updatedBy?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface ViewCustomerPageProps {
  params: Promise<{ id: string }>;
}

const ViewCustomerPage = ({ params }: ViewCustomerPageProps) => {
  const router = useRouter();
  const { addNotification } = useNotification();
  const { t } = useTranslation();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    pendingOrders: 0,
    completedOrders: 0
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
          throw new Error(data.message || t('admin.customerView.errors.fetchFailed'));
        }

        if (data.success) {
          setCustomer(data.data.customer);
          // Fetch customer orders after getting customer data
          fetchCustomerOrders(id);
        }
      } catch (error: any) {
        console.error('Fetch customer error:', error);
        addNotification({
          type: 'error',
          message: error.message || t('admin.customerView.errors.fetchFailed')
        });
        router.push('/admin/customers');
      } finally {
        setLoading(false);
      }
    };

    const fetchCustomerOrders = async (customerId: string) => {
      try {
        setOrdersLoading(true);
        const response = await fetch(`/api/admin/customers/${customerId}/orders?limit=5&sortBy=createdAt&sortOrder=desc`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        const data = await response.json();

        if (data.success) {
          setOrders(data.data.orders);
          setOrderStats(data.data.stats);
        }
      } catch (error: any) {
        console.error('Fetch orders error:', error);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchCustomer();
  }, [params, addNotification, router]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getCustomerTypeColor = (type: string) => {
    switch (type) {
      case 'final_customer':
        return 'bg-blue-100 text-blue-800';
      case 'retail_customer':
        return 'bg-purple-100 text-purple-800';
      case 'wholesale_customer':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCustomerType = (type: string) => {
    switch (type) {
      case 'final_customer':
        return t('admin.customers.types.final');
      case 'retail_customer':
        return t('admin.customers.types.retail');
      case 'wholesale_customer':
        return t('admin.customers.types.wholesale');
      default:
        return t('admin.customers.types.unknown');
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
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

  if (!customer) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <LucideIcon name="users" size="3xl" className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('admin.customerView.notFound.title')}</h3>
          <p className="text-gray-500">{t('admin.customerView.notFound.message')}</p>
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
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">
            {customer.firstName} {customer.lastName}
          </h1>
          <p className="text-gray-600">{t('admin.customerView.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/admin/customers/${customer._id}/edit`)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <LucideIcon name="pencil" size="sm" />
            {t('admin.customerView.editButton')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('admin.customerView.sections.basicInfo')}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('admin.customers.modal.firstName')}
                </label>
                <p className="text-sm text-gray-900">{customer.firstName}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('admin.customers.modal.lastName')}
                </label>
                <p className="text-sm text-gray-900">{customer.lastName}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('admin.customers.modal.email')}
                </label>
                <p className="text-sm text-gray-900">{customer.email}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('admin.customers.modal.phone')}
                </label>
                <p className="text-sm text-gray-900">{customer.phone || t('admin.customerView.notProvided')}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('admin.customers.modal.customerType')}
                </label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCustomerTypeColor(customer.customerType)}`}>
                  {formatCustomerType(customer.customerType)}
                </span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('admin.customers.table.status')}
                </label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(customer.isActive)}`}>
                  {customer.isActive ? t('admin.customers.status.active') : t('admin.customers.status.inactive')}
                </span>
              </div>

              {customer.dateOfBirth && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.customers.modal.dateOfBirth')}
                  </label>
                  <p className="text-sm text-gray-900">{formatDate(customer.dateOfBirth)}</p>
                </div>
              )}

              {customer.gender && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.customers.modal.gender')}
                  </label>
                  <p className="text-sm text-gray-900 capitalize">{customer.gender.replace('_', ' ')}</p>
                </div>
              )}
            </div>
          </div>

          {/* Business Information */}
          {customer.businessInfo && (customer.customerType === 'retail_customer' || customer.customerType === 'wholesale_customer') && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('admin.customers.modal.businessInfo')}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.customers.modal.companyName')}
                  </label>
                  <p className="text-sm text-gray-900">{customer.businessInfo.companyName || t('admin.customerView.notProvided')}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.customerView.businessInfo.taxId')}
                  </label>
                  <p className="text-sm text-gray-900">{customer.businessInfo.taxId || t('admin.customerView.notProvided')}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.customerView.businessInfo.businessType')}
                  </label>
                  <p className="text-sm text-gray-900">{customer.businessInfo.businessType || t('admin.customerView.notProvided')}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.customerView.businessInfo.discountTier')}
                  </label>
                  <p className="text-sm text-gray-900">{customer.businessInfo.discountTier || 0}%</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.customerView.businessInfo.creditLimit')}
                  </label>
                  <p className="text-sm text-gray-900">{formatCurrency(customer.businessInfo.creditLimit || 0)}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.customerView.businessInfo.paymentTerms')}
                  </label>
                  <p className="text-sm text-gray-900">{customer.businessInfo.paymentTerms || 0} {t('admin.customerView.businessInfo.days')}</p>
                </div>
                
                {customer.businessInfo.qrCode && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      {t('admin.customerView.businessInfo.qrCode')}
                    </label>
                    
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                        {/* QR Code Visual - Centered */}
                        <div className="flex-shrink-0">
                          <div className="flex flex-col items-center">
                            <QRCodeDisplay 
                              value={customer.businessInfo.qrCode} 
                              size={140}
                              className="mb-4"
                            />
                            {/* Customer Type Badge - Below QR Code */}
                            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium shadow-sm ${
                              customer.customerType === 'retail_customer' 
                                ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                                : 'bg-purple-100 text-purple-800 border border-purple-200'
                            }`}>
                              <LucideIcon name="tag" size="sm" className="mr-2" />
                              {customer.customerType === 'retail_customer' ? t('admin.customers.types.retail') : t('admin.customers.types.wholesale')}
                            </span>
                          </div>
                        </div>
                        
                        {/* QR Code Info */}
                        <div className="flex-1 w-full lg:w-auto">
                          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
                            <div className="flex items-center gap-2 mb-3">
                              <LucideIcon name="clipboard" size="sm" className="text-gray-500" />
                              <h4 className="text-lg font-semibold text-gray-900">
                                {t('admin.customerView.businessInfo.salesIdCode')}
                              </h4>
                            </div>
                            
                            {/* Code Display */}
                            <div className="bg-gray-100 rounded-lg p-4 mb-4">
                              <p className="text-xl font-mono text-gray-800 text-center break-all">
                                {customer.businessInfo.qrCode}
                              </p>
                            </div>
                            
                            {/* Instructions */}
                            <div className="space-y-2 mb-4">
                              <div className="flex items-start gap-2 text-sm text-gray-600">
                                <span>{t('admin.customerView.businessInfo.qrInstructions1')}</span>
                              </div>
                              <div className="flex items-start gap-2 text-sm text-gray-600">
                                <LucideIcon name="phone" size="sm" className="text-blue-600 mt-0.5 flex-shrink-0" />
                                <span>{t('admin.customerView.businessInfo.qrInstructions2')}</span>
                              </div>
                              <div className="flex items-start gap-2 text-sm text-gray-600">
                                <LucideIcon name="info" size="sm" className="text-purple-600 mt-0.5 flex-shrink-0" />
                                <span>{t('admin.customerView.businessInfo.qrInstructions3')}</span>
                              </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-3">
                              <button
                                onClick={() => navigator.clipboard.writeText(customer.businessInfo?.qrCode || '')}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                              >
                                <LucideIcon name="clipboard" size="sm" />
                                {t('admin.customerView.businessInfo.copyCode')}
                              </button>
                              
                              <button
                                onClick={() => {
                                  // Create a canvas to generate downloadable QR code
                                  const canvas = document.createElement('canvas');
                                  const qrCode = require('qrcode');
                                  qrCode.toCanvas(canvas, customer.businessInfo?.qrCode || '', (error: any) => {
                                    if (!error) {
                                      const link = document.createElement('a');
                                      link.download = `qr-code-${customer.businessInfo?.qrCode}.png`;
                                      link.href = canvas.toDataURL();
                                      link.click();
                                    }
                                  });
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                              >
                                <LucideIcon name="downloadsimple" size="sm" />
                                {t('admin.customerView.businessInfo.downloadQR')}
                              </button>
                              
                              <button
                                onClick={async () => {
                                  // Create QR code and open in preview window
                                  try {
                                    const QRCode = (await import('qrcode')).default;
                                    const qrDataURL = await QRCode.toDataURL(customer.businessInfo?.qrCode || '', {
                                      width: 300,
                                      margin: 2,
                                      color: {
                                        dark: '#000000',
                                        light: '#FFFFFF'
                                      }
                                    });
                                    
                                    const newWindow = window.open('', '_blank', 'width=500,height=600,scrollbars=yes,resizable=yes');
                                    if (newWindow) {
                                      newWindow.document.write(`
                                        <!DOCTYPE html>
                                        <html>
                                          <head>
                                            <title>QR Code Preview - ${customer.businessInfo?.qrCode}</title>
                                            <meta charset="utf-8">
                                            <style>
                                              body {
                                                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                                                margin: 0;
                                                padding: 20px;
                                                background: #f5f5f5;
                                                display: flex;
                                                justify-content: center;
                                                align-items: center;
                                                min-height: 100vh;
                                              }
                                              .container {
                                                background: white;
                                                padding: 30px;
                                                border-radius: 12px;
                                                box-shadow: 0 8px 25px rgba(0,0,0,0.1);
                                                text-align: center;
                                                max-width: 400px;
                                              }
                                              h1 {
                                                color: #333;
                                                margin: 0 0 20px 0;
                                                font-size: 24px;
                                                font-weight: 600;
                                              }
                                              .qr-image {
                                                border: 2px solid #e5e5e5;
                                                border-radius: 8px;
                                                margin: 20px 0;
                                                background: white;
                                              }
                                              .code-text {
                                                font-family: 'Courier New', monospace;
                                                font-size: 16px;
                                                color: #666;
                                                background: #f8f9fa;
                                                padding: 12px;
                                                border-radius: 6px;
                                                margin: 20px 0;
                                                word-break: break-all;
                                                border: 1px solid #e9ecef;
                                              }
                                              .customer-type {
                                                display: inline-block;
                                                padding: 8px 16px;
                                                border-radius: 20px;
                                                font-size: 14px;
                                                font-weight: 500;
                                                margin: 10px 0;
                                                ${customer.customerType === 'retail_customer' 
                                                  ? 'background: #dbeafe; color: #1e40af; border: 1px solid #bfdbfe;' 
                                                  : 'background: #e9d5ff; color: #7c3aed; border: 1px solid #d8b4fe;'}
                                              }
                                              .instructions {
                                                color: #666;
                                                font-size: 14px;
                                                line-height: 1.5;
                                                margin: 20px 0;
                                              }
                                              .print-btn {
                                                background: #059669;
                                                color: white;
                                                border: none;
                                                padding: 10px 20px;
                                                border-radius: 6px;
                                                font-size: 14px;
                                                cursor: pointer;
                                                margin: 10px 5px;
                                              }
                                              .print-btn:hover {
                                                background: #047857;
                                              }
                                              @media print {
                                                body { background: white; }
                                                .container { box-shadow: none; }
                                                .print-btn { display: none; }
                                              }
                                            </style>
                                          </head>
                                          <body>
                                            <div class="container">
                                              <h1>Customer QR Code</h1>
                                              <img src="${qrDataURL}" alt="QR Code" class="qr-image" />
                                              <div class="code-text">${customer.businessInfo?.qrCode}</div>
                                              <div class="customer-type">
                                                ${customer.customerType === 'retail_customer' ? 'Retail Customer' : 'Wholesale Customer'}
                                              </div>
                                              <div class="instructions">
                                                <strong>Usage Instructions:</strong><br>
                                                • Scan this QR code for quick customer identification<br>
                                                • Use with any QR code reader or sales app<br>
                                                • Contains customer ID and type information
                                              </div>
                                              <button class="print-btn" onclick="window.print()">🖨️ Print QR Code</button>
                                              <button class="print-btn" onclick="
                                                const link = document.createElement('a');
                                                link.download = 'qr-code-${customer.businessInfo?.qrCode}.png';
                                                link.href = '${qrDataURL}';
                                                link.click();
                                              ">💾 Download PNG</button>
                                            </div>
                                          </body>
                                        </html>
                                      `);
                                      newWindow.document.close();
                                    }
                                  } catch (error) {
                                    console.error('Error generating QR code preview:', error);
                                    alert('Failed to generate QR code preview');
                                  }
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                              >
                                <LucideIcon name="eye" size="sm" />
                                {t('admin.customerView.businessInfo.preview')}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Addresses */}
          {customer.addresses && customer.addresses.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('admin.customers.modal.addresses')}</h2>
              
              <div className="space-y-4">
                {customer.addresses.map((address, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
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
                        {address.label && (
                          <span className="text-sm text-gray-600">({address.label})</span>
                        )}
                      </div>
                      {address.isDefault && (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800">
                          {t('admin.customers.modal.default')}
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Contact Person */}
                      {(address.firstName || address.lastName) && (
                        <div>
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                            {t('admin.customerView.addresses.contactPerson')}
                          </label>
                          <div className="text-sm font-medium text-gray-900">
                            {address.firstName} {address.lastName}
                          </div>
                        </div>
                      )}
                      
                      {/* Company */}
                      {address.company && (
                        <div>
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                            {t('admin.customerView.addresses.company')}
                          </label>
                          <div className="text-sm text-gray-900">{address.company}</div>
                        </div>
                      )}
                      
                      {/* Phone */}
                      {address.phone && (
                        <div>
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                            {t('admin.customerView.addresses.phone')}
                          </label>
                          <div className="text-sm text-gray-900">{address.phone}</div>
                        </div>
                      )}
                      
                      {/* Address - Full width on larger screens */}
                      <div className="md:col-span-2 lg:col-span-3">
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                          {t('admin.customerView.addresses.address')}
                        </label>
                        <div className="text-sm text-gray-900">
                          {address.street}{address.street2 && `, ${address.street2}`}
                          {' • '}
                          {address.city}, {address.state && `${address.state} `}
                          {address.postalCode}
                          {' • '}
                          {address.country}
                        </div>
                      </div>
                      
                      {/* Delivery Instructions - Full width if present */}
                      {address.instructions && (
                        <div className="md:col-span-2 lg:col-span-3">
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                            {t('admin.customerView.addresses.deliveryInstructions')}
                          </label>
                          <div className="text-sm text-gray-600 italic bg-gray-50 p-3 rounded-md border-l-4 border-blue-200">
                            <LucideIcon name="info" size="sm" className="inline mr-2 text-blue-500" />
                            {address.instructions}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customer Orders */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">{t('admin.customerView.sections.recentOrders')}</h2>
              <div className="text-sm text-gray-500">
                {t('admin.customerView.orders.showingLast')}
              </div>
            </div>
            
            {ordersLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-logo-lime"></div>
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order: any) => (
                  <div key={order._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {order.orderNumber}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(order.total)}
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>
                        <span className="font-medium">{order.itemsCount || order.items?.length || 0}</span> {t('admin.customerView.orders.items')}
                      </div>
                      <div>
                        {t('admin.customerView.orders.ordered')}: {formatDate(order.createdAt)}
                      </div>
                      {order.estimatedDeliveryDate && (
                        <div>
                          {t('admin.customerView.orders.estDelivery')}: {formatDate(order.estimatedDeliveryDate)}
                        </div>
                      )}
                      {order.trackingNumber && (
                        <div>
                          {t('admin.customerView.orders.tracking')}: <span className="font-mono text-xs">{order.trackingNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {orderStats.totalOrders > 5 && (
                  <div className="text-center pt-4 border-t border-gray-200">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      {t('admin.customerView.orders.viewAll')} {orderStats.totalOrders} {t('admin.customerView.orders.orders')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <LucideIcon name="shoppingcart" size="2xl" className="mx-auto mb-3 text-gray-400" />
                <h3 className="text-sm font-medium text-gray-900 mb-1">{t('admin.customerView.orders.noOrdersTitle')}</h3>
                <p className="text-sm text-gray-500">{t('admin.customerView.orders.noOrdersMessage')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Information */}
        <div className="space-y-6">
          {/* Order Statistics */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('admin.customerView.sections.orderStats')}</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{t('admin.customerView.stats.totalOrders')}</span>
                <span className="text-sm font-medium text-gray-900">
                  {orderStats.totalOrders || customer.totalOrders}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{t('admin.customerView.stats.totalSpent')}</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(orderStats.totalRevenue || customer.totalSpent)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{t('admin.customerView.stats.averageOrder')}</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(orderStats.averageOrderValue || customer.averageOrderValue)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{t('admin.customerView.stats.pendingOrders')}</span>
                <span className="text-sm font-medium text-yellow-600">
                  {orderStats.pendingOrders}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{t('admin.customerView.stats.completedOrders')}</span>
                <span className="text-sm font-medium text-green-600">
                  {orderStats.completedOrders}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{t('admin.customerView.stats.loyaltyPoints')}</span>
                <span className="text-sm font-medium text-yellow-600">{customer.loyaltyPoints} {t('admin.customerView.stats.pts')}</span>
              </div>
              
              {customer.lastOrderDate && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t('admin.customerView.stats.lastOrder')}</span>
                  <span className="text-sm text-gray-900">{formatDate(customer.lastOrderDate)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Account Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('admin.customerView.sections.accountStatus')}</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{t('admin.customerView.account.emailVerified')}</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  customer.isEmailVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {customer.isEmailVerified ? t('admin.customerView.account.verified') : t('admin.customerView.account.unverified')}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{t('admin.customerView.account.accountStatus')}</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(customer.isActive)}`}>
                  {customer.isActive ? t('admin.customers.status.active') : t('admin.customers.status.inactive')}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{t('admin.customerView.account.lastLogin')}</span>
                <span className="text-sm text-gray-900">
                  {customer.lastLogin ? formatDate(customer.lastLogin) : t('admin.customerView.account.never')}
                </span>
              </div>
            </div>
          </div>

          {/* Preferences */}
          {customer.preferences && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('admin.customerView.sections.preferences')}</h2>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t('admin.customerView.preferences.language')}</span>
                  <span className="text-sm text-gray-900 uppercase">{customer.preferences.language}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t('admin.customerView.preferences.currency')}</span>
                  <span className="text-sm text-gray-900">{customer.preferences.currency}</span>
                </div>
                
                {customer.preferences.notifications && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{t('admin.customerView.preferences.emailNotifications')}</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        customer.preferences.notifications.email ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {customer.preferences.notifications.email ? t('admin.customerView.preferences.enabled') : t('admin.customerView.preferences.disabled')}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{t('admin.customerView.preferences.smsNotifications')}</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        customer.preferences.notifications.sms ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {customer.preferences.notifications.sms ? t('admin.customerView.preferences.enabled') : t('admin.customerView.preferences.disabled')}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Admin Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('admin.customerView.sections.adminInfo')}</h2>
            
            <div className="space-y-3">
              {customer.createdBy && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.customerView.admin.createdBy')}
                  </label>
                  <p className="text-sm text-gray-900">
                    {customer.createdBy.firstName} {customer.createdBy.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{customer.createdBy.email}</p>
                </div>
              )}
              
              {customer.updatedBy && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.customerView.admin.lastUpdatedBy')}
                  </label>
                  <p className="text-sm text-gray-900">
                    {customer.updatedBy.firstName} {customer.updatedBy.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{customer.updatedBy.email}</p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('admin.customerView.admin.created')}
                </label>
                <p className="text-sm text-gray-900">{formatDate(customer.createdAt)}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('admin.customerView.admin.lastUpdated')}
                </label>
                <p className="text-sm text-gray-900">{formatDate(customer.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCustomerPage;
