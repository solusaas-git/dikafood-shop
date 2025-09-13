'use client';

import React, { useState } from 'react';
import { api } from '../../services/api.js';

interface Order {
  _id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
    totalPrice: number;
    variant?: {
      size?: string;
      unit?: string;
    };
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  shippingAddress: {
    firstName?: string;
    lastName?: string;
    street: string;
    city: string;
    country: string;
    postalCode?: string;
  };
  estimatedDeliveryDate?: string;
  actualDeliveryDate?: string;
  trackingNumber?: string;
  carrier?: string;
  createdAt: string;
  history: Array<{
    status: string;
    note: string;
    timestamp: string;
  }>;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

const TrackOrderPage = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderNumber.trim()) {
      setError('Order number is required');
      return;
    }

    if (!email.trim() && !phone.trim()) {
      setError('Email or phone number is required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setOrder(null);

      const response = await api.trackOrder(orderNumber.trim(), email.trim(), phone.trim());
      
      if (response.success) {
        setOrder(response.data);
      } else {
        setError(response.message || 'Order not found');
      }
    } catch (err) {
      console.error('Error tracking order:', err);
      setError('Failed to track order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
          <p className="text-gray-600">Enter your order details to track your delivery</p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order Number *
                </label>
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="ORD-20240101-0001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+212 6XX XXX XXX"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-logo-lime text-dark-green-7 rounded-lg hover:bg-logo-lime/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? 'Searching...' : 'Track Order'}
              </button>
            </div>
          </form>
        </div>

        {/* Order Details */}
        {order && (
          <div className="space-y-6">
            {/* Order Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Order #{order.orderNumber}</h2>
                  <p className="text-gray-600">Placed on {formatDate(order.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3 mt-4 md:mt-0">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadgeColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadgeColor(order.paymentStatus)}`}>
                    Payment: {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                  </span>
                </div>
              </div>

              {order.trackingNumber && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-900">Tracking Number</p>
                      <p className="text-lg font-bold text-blue-800">{order.trackingNumber}</p>
                      {order.carrier && <p className="text-sm text-blue-700">Carrier: {order.carrier}</p>}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Delivery Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Delivery Address</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    {order.shippingAddress.firstName && (
                      <p><strong>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</strong></p>
                    )}
                    <p>{order.shippingAddress.street}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Delivery Status</h4>
                  <div className="space-y-2 text-sm">
                    {order.estimatedDeliveryDate && (
                      <p><strong>Estimated Delivery:</strong> {formatDate(order.estimatedDeliveryDate)}</p>
                    )}
                    {order.actualDeliveryDate && (
                      <p className="text-green-600"><strong>Delivered:</strong> {formatDate(order.actualDeliveryDate)}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{item.productName}</h4>
                      {item.variant && (
                        <p className="text-sm text-gray-500">
                          {item.variant.size && `Size: ${item.variant.size}`}
                          {item.variant.unit && ` • Unit: ${item.variant.unit}`}
                        </p>
                      )}
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatCurrency(item.totalPrice)}</p>
                      <p className="text-sm text-gray-500">{formatCurrency(item.price)} each</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-6 border-t pt-4">
                <div className="space-y-2 text-sm">
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

            {/* Order History */}
            {order.history && order.history.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order History</h3>
                <div className="space-y-4">
                  {order.history.map((entry, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(entry.status)}`}>
                            {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                          </span>
                          <span className="text-xs text-gray-500">{formatDate(entry.timestamp)}</span>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">{entry.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrderPage;
