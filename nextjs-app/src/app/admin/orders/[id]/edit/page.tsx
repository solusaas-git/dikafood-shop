'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useNotification } from '@/contexts/NotificationContextNew';
import LucideIcon from '../../../../../components/ui/icons/LucideIcon';

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

interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    customerType: string;
  };
  status: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  shippingAddress: OrderAddress;
  billingAddress?: OrderAddress;
  paymentMethod: string;
  paymentStatus: string;
  paymentDate?: string;
  estimatedDeliveryDate?: string;
  actualDeliveryDate?: string;
  trackingNumber?: string;
  carrier?: string;
  notes?: string;
  customerNotes?: string;
  createdAt: string;
  updatedAt: string;
}

interface EditOrderPageProps {
  params: Promise<{ id: string }>;
}

const EditOrderPage = ({ params }: EditOrderPageProps) => {
  const router = useRouter();
  const { addNotification } = useNotification();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [orderId, setOrderId] = useState<string>('');

  // Form state
  const [formData, setFormData] = useState({
    status: '',
    paymentStatus: '',
    paymentMethod: '',
    trackingNumber: '',
    carrier: '',
    estimatedDeliveryDate: '',
    actualDeliveryDate: '',
    notes: '',
    statusNote: ''
  });

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
        setFormData({
          status: data.data.status || '',
          paymentStatus: data.data.paymentStatus || '',
          paymentMethod: data.data.paymentMethod || '',
          trackingNumber: data.data.trackingNumber || '',
          carrier: data.data.carrier || '',
          estimatedDeliveryDate: data.data.estimatedDeliveryDate 
            ? new Date(data.data.estimatedDeliveryDate).toISOString().split('T')[0] 
            : '',
          actualDeliveryDate: data.data.actualDeliveryDate 
            ? new Date(data.data.actualDeliveryDate).toISOString().split('T')[0] 
            : '',
          notes: data.data.notes || '',
          statusNote: ''
        });
      } else {
        addNotification(data.message || 'Failed to fetch order', 'error');
        router.push('/admin/orders');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      addNotification('Error fetching order', 'error');
      router.push('/admin/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!order) return;

    try {
      setSaving(true);

      // Prepare update data
      const updateData: any = {
        status: formData.status,
        paymentStatus: formData.paymentStatus,
        paymentMethod: formData.paymentMethod,
        trackingNumber: formData.trackingNumber || undefined,
        carrier: formData.carrier || undefined,
        notes: formData.notes || undefined
      };

      // Handle dates
      if (formData.estimatedDeliveryDate) {
        updateData.estimatedDeliveryDate = formData.estimatedDeliveryDate;
      }
      if (formData.actualDeliveryDate) {
        updateData.actualDeliveryDate = formData.actualDeliveryDate;
      }

      // Add status note if status is changing
      if (formData.status !== order.status && formData.statusNote) {
        updateData.statusNote = formData.statusNote;
      }

      // Get token from localStorage
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (data.success) {
        addNotification('Order updated successfully', 'success');
        router.push(`/admin/orders/${orderId}`);
      } else {
        addNotification(data.message || 'Failed to update order', 'error');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      addNotification('Error updating order', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD'
    }).format(amount);
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-4">The order you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => router.push('/admin/orders')}
            className="bg-logo-lime text-dark-green-7 px-4 py-2 rounded-lg hover:bg-logo-lime/90"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push(`/admin/orders/${orderId}`)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <LucideIcon name="arrowleft" size="md" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Order</h1>
            <p className="text-gray-600">Order #{order.orderNumber}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order Status *
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Status *
                  </label>
                  <select
                    name="paymentStatus"
                    value={formData.paymentStatus}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                    <option value="partially_refunded">Partially Refunded</option>
                  </select>
                </div>
              </div>

              {/* Status Note */}
              {formData.status !== order.status && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status Change Note
                  </label>
                  <textarea
                    name="statusNote"
                    value={formData.statusNote}
                    onChange={handleChange}
                    placeholder="Add a note about this status change..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                  />
                </div>
              )}
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method *
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                >
                  <option value="cash_on_delivery">Cash on Delivery</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="store_credit">Store Credit</option>
                </select>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    name="trackingNumber"
                    value={formData.trackingNumber}
                    onChange={handleChange}
                    placeholder="Enter tracking number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Carrier
                  </label>
                  <input
                    type="text"
                    name="carrier"
                    value={formData.carrier}
                    onChange={handleChange}
                    placeholder="e.g., DHL, UPS, FedEx"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Delivery Date
                  </label>
                  <input
                    type="date"
                    name="estimatedDeliveryDate"
                    value={formData.estimatedDeliveryDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Actual Delivery Date
                  </label>
                  <input
                    type="date"
                    name="actualDeliveryDate"
                    value={formData.actualDeliveryDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Notes</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Add internal notes about this order..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => router.push(`/admin/orders/${orderId}`)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-logo-lime text-dark-green-7 px-6 py-2 rounded-lg hover:bg-logo-lime/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-dark-green-7"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <LucideIcon name="check" size="sm" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Customer</p>
                  <p className="font-medium">{order.customer.firstName} {order.customer.lastName}</p>
                  <p className="text-sm text-gray-500">{order.customer.email}</p>
                </div>

                <div className="pt-3 border-t">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Items:</span>
                      <span>{order.items.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(order.subtotal)}</span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span>Discount:</span>
                        <span>-{formatCurrency(order.discount)}</span>
                      </div>
                    )}
                    {order.tax > 0 && (
                      <div className="flex justify-between">
                        <span>Tax:</span>
                        <span>{formatCurrency(order.tax)}</span>
                      </div>
                    )}
                    {order.shipping > 0 && (
                      <div className="flex justify-between">
                        <span>Shipping:</span>
                        <span>{formatCurrency(order.shipping)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                      <span>Total:</span>
                      <span>{formatCurrency(order.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="border-b border-gray-200 pb-3 last:border-b-0">
                    <h4 className="font-medium text-gray-900 text-sm">{item.productName}</h4>
                    {item.variant && (
                      <p className="text-xs text-gray-500 mt-1">
                        {item.variant.size && `Size: ${item.variant.size}`}
                        {item.variant.unit && ` • Unit: ${item.variant.unit}`}
                      </p>
                    )}
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                      <span className="text-sm font-medium">{formatCurrency(item.totalPrice)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditOrderPage;
