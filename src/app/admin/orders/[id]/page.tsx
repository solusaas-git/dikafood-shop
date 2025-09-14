'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useNotification } from '@/contexts/NotificationContextNew';
import { useTranslation } from '../../../../utils/i18n';
import LucideIcon from '../../../../components/ui/icons/LucideIcon';

interface OrderItem {
  product: string;
  productName: string;
  variant?: {
    size?: string;
    unit?: string;
    sku?: string;
  };
  quantity: number;
  price: number;
  promotionalPrice?: number;
  totalPrice: number;
  discount: number;
}

interface OrderAddress {
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
  instructions?: string;
}

interface OrderHistory {
  status: string;
  note: string;
  timestamp: string;
  updatedBy?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    customerType: string;
    businessInfo?: {
      companyName?: string;
      taxId?: string;
      qrCode?: string;
    };
  };
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  shippingAddress: OrderAddress;
  billingAddress?: OrderAddress;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';
  paymentDate?: string;
  estimatedDeliveryDate?: string;
  actualDeliveryDate?: string;
  trackingNumber?: string;
  carrier?: string;
  notes?: string;
  customerNotes?: string;
  history: OrderHistory[];
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

interface ViewOrderPageProps {
  params: Promise<{ id: string }>;
}

const ViewOrderPage = ({ params }: ViewOrderPageProps) => {
  const router = useRouter();
  const { addNotification } = useNotification();
  const { t } = useTranslation();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState<string>('');

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setOrderId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      // Get token from localStorage
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await fetch(`/api/admin/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();

      if (data.success) {
        setOrder(data.data);
      } else {
        addNotification(data.message || t('admin.orders.fetchError'), 'error');
        router.push('/admin/orders');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      addNotification(t('admin.orders.fetchError'), 'error');
      router.push('/admin/orders');
    } finally {
      setLoading(false);
    }
  };

  // Status badge colors
  const getStatusBadgeColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      processing: 'bg-purple-100 text-purple-800 border-purple-200',
      shipped: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
      refunded: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPaymentStatusBadgeColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      paid: 'bg-green-100 text-green-800 border-green-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
      refunded: 'bg-gray-100 text-gray-800 border-gray-200',
      partially_refunded: 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Translate status labels
  const getStatusText = (status: string) => {
    const statusMap = {
      'pending': t('admin.orders.status.pending'),
      'confirmed': t('admin.orders.status.confirmed'),
      'processing': t('admin.orders.status.processing'),
      'shipped': t('admin.orders.status.shipped'),
      'delivered': t('admin.orders.status.delivered'),
      'cancelled': t('admin.orders.status.cancelled'),
      'refunded': t('admin.orders.status.returned')
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getPaymentStatusText = (status: string) => {
    const statusMap = {
      'pending': t('admin.orders.payment.pending'),
      'paid': t('admin.orders.payment.paid'),
      'failed': t('admin.orders.payment.failed'),
      'refunded': t('admin.orders.payment.refunded'),
      'partially_refunded': t('admin.orders.payment.refunded')
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getPaymentMethodText = (method: string) => {
    const methodMap = {
      'cash_on_delivery': t('admin.orders.paymentMethod.cash_on_delivery'),
      'credit_card': t('admin.orders.paymentMethod.credit_card'),
      'bank_transfer': t('admin.orders.paymentMethod.bank_transfer'),
      'paypal': t('admin.orders.paymentMethod.paypal'),
      'stripe': t('admin.orders.paymentMethod.stripe'),
      'cash': t('admin.orders.paymentMethod.cash')
    };
    return methodMap[method as keyof typeof methodMap] || method;
  };

  // Translate order history notes
  const getHistoryNoteText = (note: string) => {
    // Check for "Order placed by customer" pattern
    if (note === 'Order placed by customer') {
      return t('admin.orders.history.orderPlacedByCustomer');
    }

    // Check for "Status changed from X to Y" pattern
    const statusChangeMatch = note.match(/^Status changed from (\w+) to (\w+)$/);
    if (statusChangeMatch) {
      const fromStatus = statusChangeMatch[1];
      const toStatus = statusChangeMatch[2];
      const fromStatusTranslated = getStatusText(fromStatus);
      const toStatusTranslated = getStatusText(toStatus);
      return `${t('admin.orders.history.statusChangedFrom')} ${fromStatusTranslated} ${t('admin.orders.history.to')} ${toStatusTranslated}`;
    }

    // Common history note patterns to translate
    const noteMap: { [key: string]: string } = {
      'Order created': t('admin.orders.history.orderCreated'),
      'Order confirmed': t('admin.orders.history.orderConfirmed'),
      'Order processing': t('admin.orders.history.orderProcessing'),
      'Order shipped': t('admin.orders.history.orderShipped'),
      'Order delivered': t('admin.orders.history.orderDelivered'),
      'Order cancelled': t('admin.orders.history.orderCancelled'),
      'Order refunded': t('admin.orders.history.orderRefunded'),
      'Payment received': t('admin.orders.history.paymentReceived'),
      'Payment failed': t('admin.orders.history.paymentFailed'),
      'Tracking number added': t('admin.orders.history.trackingAdded'),
      'Status updated': t('admin.orders.history.statusUpdated'),
      'Note added': t('admin.orders.history.noteAdded'),
    };

    // Check for exact matches first
    if (noteMap[note]) {
      return noteMap[note];
    }

    // Check for partial matches (case insensitive)
    const lowerNote = note.toLowerCase();
    for (const [englishNote, translation] of Object.entries(noteMap)) {
      if (lowerNote.includes(englishNote.toLowerCase())) {
        return translation;
      }
    }

    // Return original note if no translation found
    return note;
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-logo-lime"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6">
        <div className="text-center">
          <LucideIcon name="warning" size="xl" className="mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('admin.orders.view.orderNotFound')}</h2>
          <p className="text-gray-600 mb-4">{t('admin.orders.view.orderNotFoundDesc')}</p>
          <button
            onClick={() => router.push('/admin/orders')}
            className="bg-logo-lime text-dark-green-7 px-4 py-2 rounded-lg hover:bg-logo-lime/90"
          >
            {t('admin.orders.view.backToOrders')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/admin/orders')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <LucideIcon name="arrowleft" size="md" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('admin.orders.view.title')}</h1>
            <p className="text-gray-600">{t('admin.orders.view.orderNumber')}{order.orderNumber}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(`/admin/orders/${order._id}/edit`)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <LucideIcon name="pencil" size="sm" />
            {t('admin.orders.view.editOrder')}
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            <LucideIcon name="filearrowdown" size="sm" />
            {t('admin.orders.view.print')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">{t('admin.orders.view.orderStatus')}</h2>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadgeColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPaymentStatusBadgeColor(order.paymentStatus)}`}>
                  {t('admin.orders.view.payment')}: {getPaymentStatusText(order.paymentStatus)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <label className="block text-gray-500 mb-1">{t('admin.orders.view.orderDate')}</label>
                <p className="font-medium">{formatDate(order.createdAt)}</p>
              </div>
              {order.estimatedDeliveryDate && (
                <div>
                  <label className="block text-gray-500 mb-1">{t('admin.orders.view.estimatedDelivery')}</label>
                  <p className="font-medium">{formatDate(order.estimatedDeliveryDate)}</p>
                </div>
              )}
              {order.actualDeliveryDate && (
                <div>
                  <label className="block text-gray-500 mb-1">{t('admin.orders.view.actualDelivery')}</label>
                  <p className="font-medium text-green-600">{formatDate(order.actualDeliveryDate)}</p>
                </div>
              )}
            </div>

            {order.trackingNumber && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-900">{t('admin.orders.view.trackingNumber')}</p>
                    <p className="text-lg font-bold text-blue-800">{order.trackingNumber}</p>
                    {order.carrier && <p className="text-sm text-blue-700">{t('admin.orders.view.carrier')}: {order.carrier}</p>}
                  </div>
                  <LucideIcon name="storefront" size="lg" className="text-blue-600" />
                </div>
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('admin.orders.view.orderItems')}</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.productName}</h3>
                    {item.variant && (
                      <div className="text-sm text-gray-500 mt-1">
                        {item.variant.size && <span>{t('admin.orders.view.size')}: {item.variant.size}</span>}
                        {item.variant.unit && <span className="ml-2">{t('admin.orders.view.unit')}: {item.variant.unit}</span>}
                        {item.variant.sku && <span className="ml-2">{t('admin.orders.view.sku')}: {item.variant.sku}</span>}
                      </div>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span>{t('admin.orders.view.qty')}: <strong>{item.quantity}</strong></span>
                      <span>{t('admin.orders.view.price')}: <strong>{formatCurrency(item.price)}</strong></span>
                      {item.promotionalPrice && item.promotionalPrice < item.price && (
                        <span className="text-green-600">
                          {t('admin.orders.view.promo')}: <strong>{formatCurrency(item.promotionalPrice)}</strong>
                        </span>
                      )}
                      {item.discount > 0 && (
                        <span className="text-red-600">
                          {t('admin.orders.view.discount')}: <strong>-{formatCurrency(item.discount)}</strong>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(item.totalPrice)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-6 border-t pt-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{t('admin.orders.view.subtotal')}:</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm text-red-600">
                    <span>{t('admin.orders.view.discount')}:</span>
                    <span>-{formatCurrency(order.discount)}</span>
                  </div>
                )}
                {order.tax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>{t('admin.orders.view.tax')}:</span>
                    <span>{formatCurrency(order.tax)}</span>
                  </div>
                )}
                {order.shipping > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>{t('admin.orders.view.shipping')}:</span>
                    <span>{formatCurrency(order.shipping)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>{t('admin.orders.view.total')}:</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Addresses */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('admin.orders.view.addresses')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Shipping Address */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <LucideIcon name="storefront" size="sm" />
                  {t('admin.orders.view.shippingAddress')}
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                  {order.shippingAddress.firstName && (
                    <p><strong>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</strong></p>
                  )}
                  {order.shippingAddress.company && <p>{order.shippingAddress.company}</p>}
                  <p>{order.shippingAddress.street}</p>
                  {order.shippingAddress.street2 && <p>{order.shippingAddress.street2}</p>}
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                  <p>{order.shippingAddress.country}</p>
                  {order.shippingAddress.phone && <p>{t('admin.orders.view.phone')}: {order.shippingAddress.phone}</p>}
                  {order.shippingAddress.instructions && (
                    <p className="mt-2 p-2 bg-blue-50 rounded text-blue-800">
                      <strong>{t('admin.orders.view.instructions')}:</strong> {order.shippingAddress.instructions}
                    </p>
                  )}
                </div>
              </div>

              {/* Billing Address */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <LucideIcon name="creditcard" size="sm" />
                  {t('admin.orders.view.billingAddress')}
                </h3>
                {order.billingAddress && 
                 JSON.stringify(order.billingAddress) !== JSON.stringify(order.shippingAddress) ? (
                  <div className="text-sm text-gray-600 space-y-1">
                    {order.billingAddress.firstName && (
                      <p><strong>{order.billingAddress.firstName} {order.billingAddress.lastName}</strong></p>
                    )}
                    {order.billingAddress.company && <p>{order.billingAddress.company}</p>}
                    <p>{order.billingAddress.street}</p>
                    {order.billingAddress.street2 && <p>{order.billingAddress.street2}</p>}
                    <p>{order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.postalCode}</p>
                    <p>{order.billingAddress.country}</p>
                    {order.billingAddress.phone && <p>{t('admin.orders.view.phone')}: {order.billingAddress.phone}</p>}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">{t('admin.orders.view.sameAsShipping')}</p>
                )}
              </div>
            </div>
          </div>

          {/* Order History */}
          {order.history && order.history.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('admin.orders.view.orderHistory')}</h2>
              <div className="space-y-4">
                {order.history.map((entry, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <LucideIcon name="info" size="sm" className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(entry.status)}`}>
                          {getStatusText(entry.status)}
                        </span>
                        <span className="text-xs text-gray-500">{formatDate(entry.timestamp)}</span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">{getHistoryNoteText(entry.note)}</p>
                      {entry.updatedBy && (
                        <p className="text-xs text-gray-500 mt-1">
                          {t('admin.orders.view.updatedBy')}: {entry.updatedBy.firstName} {entry.updatedBy.lastName}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('admin.orders.view.customerInfo')}</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-500 mb-1">{t('admin.orders.view.customer')}</label>
                <p className="font-medium text-gray-900">
                  {order.customer.firstName} {order.customer.lastName}
                </p>
                <p className="text-sm text-gray-600">{order.customer.email}</p>
                {order.customer.phone && <p className="text-sm text-gray-600">{order.customer.phone}</p>}
              </div>
              
              <div>
                <label className="block text-sm text-gray-500 mb-1">{t('admin.orders.view.customerType')}</label>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 capitalize">
                  {order.customer.customerType.replace('_', ' ')}
                </span>
              </div>

              {order.customer.businessInfo?.companyName && (
                <div>
                  <label className="block text-sm text-gray-500 mb-1">{t('admin.orders.view.company')}</label>
                  <p className="font-medium text-gray-900">{order.customer.businessInfo.companyName}</p>
                  {order.customer.businessInfo.taxId && (
                    <p className="text-sm text-gray-600">{t('admin.orders.view.taxId')}: {order.customer.businessInfo.taxId}</p>
                  )}
                </div>
              )}

              <div className="pt-3 border-t">
                <button
                  onClick={() => router.push(`/admin/customers/${order.customer._id}`)}
                  className="w-full flex items-center justify-center gap-2 text-logo-lime hover:text-logo-lime/80 text-sm font-medium"
                >
                  <LucideIcon name="eye" size="sm" />
                  {t('admin.orders.view.viewCustomerProfile')}
                </button>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('admin.orders.view.paymentInfo')}</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-500 mb-1">{t('admin.orders.view.paymentMethod')}</label>
                <p className="font-medium text-gray-900">
                  {getPaymentMethodText(order.paymentMethod)}
                </p>
              </div>
              
              <div>
                <label className="block text-sm text-gray-500 mb-1">{t('admin.orders.view.paymentStatus')}</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusBadgeColor(order.paymentStatus)}`}>
                  {getPaymentStatusText(order.paymentStatus)}
                </span>
              </div>

              {order.paymentDate && (
                <div>
                  <label className="block text-sm text-gray-500 mb-1">{t('admin.orders.view.paymentDate')}</label>
                  <p className="text-sm text-gray-900">{formatDate(order.paymentDate)}</p>
                </div>
              )}

              <div className="pt-2 border-t">
                <div className="flex justify-between text-lg font-bold">
                  <span>{t('admin.orders.view.totalPaid')}:</span>
                  <span className="text-green-600">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {(order.notes || order.customerNotes) && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('admin.orders.view.notes')}</h2>
              <div className="space-y-3">
                {order.notes && (
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">{t('admin.orders.view.adminNotes')}</label>
                    <p className="text-sm text-gray-700 bg-yellow-50 p-3 rounded-lg">{order.notes}</p>
                  </div>
                )}
                {order.customerNotes && (
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">{t('admin.orders.view.customerNotes')}</label>
                    <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">{order.customerNotes}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* System Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('admin.orders.view.systemInfo')}</h2>
            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-gray-500 mb-1">{t('admin.orders.view.created')}</label>
                <p className="text-gray-900">{formatDate(order.createdAt)}</p>
                {order.createdBy && (
                  <p className="text-gray-600">{t('admin.orders.view.by')} {order.createdBy.firstName} {order.createdBy.lastName}</p>
                )}
              </div>
              
              <div>
                <label className="block text-gray-500 mb-1">{t('admin.orders.view.lastUpdated')}</label>
                <p className="text-gray-900">{formatDate(order.updatedAt)}</p>
                {order.updatedBy && (
                  <p className="text-gray-600">{t('admin.orders.view.by')} {order.updatedBy.firstName} {order.updatedBy.lastName}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOrderPage;
