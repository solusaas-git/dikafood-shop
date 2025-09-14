'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../../contexts/AuthContext';
import { useNotification } from '../../../../contexts/NotificationContextNew';
import LucideIcon from '../../../../components/ui/icons/LucideIcon';

interface OrderItem {
  product: string;
  productName: string;
  variant: {
    size: string;
    unit: string;
    sku: string;
    imageUrl: string;
    imageUrls: string[];
  };
  quantity: number;
  price: number;
  totalPrice: number;
  promotionalPrice?: number;
  discount: number;
}

interface OrderHistory {
  status: string;
  note: string;
  timestamp: string;
  updatedBy?: {
    firstName: string;
    lastName: string;
    role: string;
  };
}

interface OrderDetails {
  _id: string;
  orderNumber: string;
  status: string;
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  items: OrderItem[];
  
  // Payment
  paymentMethod: string;
  paymentStatus: string;
  paymentDate?: string;
  
  // Delivery
  shippingAddress: {
    firstName: string;
    lastName: string;
    company?: string;
    street: string;
    street2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
    phone?: string;
    instructions?: string;
  };
  billingAddress: {
    firstName: string;
    lastName: string;
    company?: string;
    street: string;
    street2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
  
  estimatedDeliveryDate?: string;
  actualDeliveryDate?: string;
  trackingNumber?: string;
  carrier?: string;
  
  // Notes and history
  notes?: string;
  customerNotes?: string;
  history: OrderHistory[];
  
  createdAt: string;
  updatedAt: string;
}

const OrderDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const { isLoggedIn, loading: authLoading } = useAuth();
  const { addNotification } = useNotification();

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = params.orderId as string;

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push('/');
      return;
    }
  }, [authLoading, isLoggedIn, router]);

  // Fetch order details
  useEffect(() => {
    if (isLoggedIn && orderId) {
      fetchOrderDetails();
    }
  }, [isLoggedIn, orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Authentication required');
        return;
      }

      console.log('📦 Fetching order details for:', orderId);
      const response = await fetch(`/api/customers/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          console.log('📦 Order details fetched successfully:', data.data);
          setOrder(data.data);
        } else {
          setError(data.message || 'Failed to load order details');
        }
      } else if (response.status === 404) {
        setError('Order not found');
      } else if (response.status === 403) {
        setError('You do not have permission to view this order');
      } else {
        setError('Failed to load order details');
      }
    } catch (err) {
      console.error('📦 Error fetching order details:', err);
      setError('An error occurred while loading order details');
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    if (isNaN(amount) || amount === null || amount === undefined) {
      return '0,00 MAD';
    }
    
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

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'En attente' },
      confirmed: { color: 'bg-blue-100 text-blue-800', text: 'Confirmée' },
      processing: { color: 'bg-purple-100 text-purple-800', text: 'En préparation' },
      shipped: { color: 'bg-indigo-100 text-indigo-800', text: 'Expédiée' },
      delivered: { color: 'bg-green-100 text-green-800', text: 'Livrée' },
      cancelled: { color: 'bg-red-100 text-red-800', text: 'Annulée' },
      refunded: { color: 'bg-gray-100 text-gray-800', text: 'Remboursée' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  // Get payment method display
  const getPaymentMethodDisplay = (method: string) => {
    const methods = {
      cash_on_delivery: 'Paiement à la livraison',
      bank_transfer: 'Virement bancaire',
      credit_card: 'Carte de crédit',
      store_credit: 'Crédit magasin'
    };
    return methods[method as keyof typeof methods] || method;
  };

  // Get payment status badge
  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'En attente' },
      paid: { color: 'bg-green-100 text-green-800', text: 'Payé' },
      failed: { color: 'bg-red-100 text-red-800', text: 'Échoué' },
      refunded: { color: 'bg-gray-100 text-gray-800', text: 'Remboursé' },
      partially_refunded: { color: 'bg-orange-100 text-orange-800', text: 'Partiellement remboursé' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LucideIcon name="loader" className="animate-spin h-8 w-8 text-logo-lime mx-auto mb-4" />
          <p className="text-gray-600">Chargement des détails de la commande...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LucideIcon name="alert-circle" className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Erreur</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/profile?tab=orders')}
            className="bg-logo-lime text-white px-4 py-2 rounded-lg hover:bg-lime-600 transition-colors"
          >
            Retour aux commandes
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LucideIcon name="package" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Commande non trouvée</h1>
          <p className="text-gray-600 mb-4">La commande demandée n'existe pas ou vous n'avez pas l'autorisation de la voir.</p>
          <button
            onClick={() => router.push('/profile?tab=orders')}
            className="bg-logo-lime text-white px-4 py-2 rounded-lg hover:bg-lime-600 transition-colors"
          >
            Retour aux commandes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/profile?tab=orders')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <LucideIcon name="arrow-left" className="h-4 w-4 mr-2" />
            Retour aux commandes
          </button>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Commande #{order.orderNumber}</h1>
              <p className="text-gray-600">Passée le {formatDate(order.createdAt)}</p>
            </div>
            <div className="text-right">
              {getStatusBadge(order.status)}
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {formatCurrency(order.total)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Articles commandés</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-start space-x-4 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
                    {/* Product Image */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img 
                        src={item.variant?.imageUrl || '/images/placeholder.jpg'} 
                        alt={item.productName}
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.productName}</h3>
                      {item.variant && (
                        <div className="text-sm text-gray-600 mt-1">
                          {item.variant.size && <span>Taille: {item.variant.size}</span>}
                          {item.variant.sku && <span className="ml-3">SKU: {item.variant.sku}</span>}
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-600">Quantité: {item.quantity}</span>
                        <div className="text-right">
                          {item.promotionalPrice && item.promotionalPrice < item.price && (
                            <span className="text-sm text-gray-500 line-through mr-2">
                              {formatCurrency(item.price)}
                            </span>
                          )}
                          <span className="font-medium">
                            {formatCurrency(item.promotionalPrice || item.price)} × {item.quantity}
                          </span>
                        </div>
                      </div>
                      <div className="text-right mt-1">
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(item.totalPrice)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Order Summary */}
              <div className="border-t pt-4 mt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Sous-total</span>
                    <span>{formatCurrency(order.subtotal)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Réduction</span>
                      <span className="text-green-600">-{formatCurrency(order.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Livraison</span>
                    <span>{formatCurrency(order.shipping)}</span>
                  </div>
                  {order.tax > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Taxes</span>
                      <span>{formatCurrency(order.tax)}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order History */}
            {order.history && order.history.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Historique de la commande</h2>
                <div className="space-y-4">
                  {order.history.map((entry, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-logo-lime rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">{entry.status}</span>
                          <span className="text-sm text-gray-500">{formatDate(entry.timestamp)}</span>
                        </div>
                        {entry.note && (
                          <p className="text-sm text-gray-600 mt-1">{entry.note}</p>
                        )}
                        {entry.updatedBy && (
                          <p className="text-xs text-gray-500 mt-1">
                            Par {entry.updatedBy.firstName} {entry.updatedBy.lastName}
                            {entry.updatedBy.role && ` (${entry.updatedBy.role})`}
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
            {/* Payment Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails du paiement</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Méthode de paiement</span>
                  <p className="font-medium">{getPaymentMethodDisplay(order.paymentMethod)}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Statut du paiement</span>
                  <div className="mt-1">
                    {getPaymentStatusBadge(order.paymentStatus)}
                  </div>
                </div>
                {order.paymentDate && (
                  <div>
                    <span className="text-sm text-gray-600">Date de paiement</span>
                    <p className="font-medium">{formatDate(order.paymentDate)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails de livraison</h3>
              <div className="space-y-4">
                {/* Shipping Address */}
                <div>
                  <span className="text-sm text-gray-600">Adresse de livraison</span>
                  <div className="mt-1 text-sm">
                    <p className="font-medium">
                      {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                    </p>
                    {order.shippingAddress.company && (
                      <p>{order.shippingAddress.company}</p>
                    )}
                    <p>{order.shippingAddress.street}</p>
                    {order.shippingAddress.street2 && (
                      <p>{order.shippingAddress.street2}</p>
                    )}
                    <p>
                      {order.shippingAddress.postalCode} {order.shippingAddress.city}
                      {order.shippingAddress.state && `, ${order.shippingAddress.state}`}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                    {order.shippingAddress.phone && (
                      <p className="mt-1">Tél: {order.shippingAddress.phone}</p>
                    )}
                  </div>
                  {order.shippingAddress.instructions && (
                    <div className="mt-2">
                      <span className="text-sm text-gray-600">Instructions de livraison</span>
                      <p className="text-sm mt-1 italic">{order.shippingAddress.instructions}</p>
                    </div>
                  )}
                </div>

                {/* Delivery Info */}
                {(order.trackingNumber || order.carrier || order.estimatedDeliveryDate || order.actualDeliveryDate) && (
                  <div className="border-t pt-4">
                    {order.trackingNumber && (
                      <div className="mb-3">
                        <span className="text-sm text-gray-600">Numéro de suivi</span>
                        <p className="font-medium font-mono">{order.trackingNumber}</p>
                      </div>
                    )}
                    {order.carrier && (
                      <div className="mb-3">
                        <span className="text-sm text-gray-600">Transporteur</span>
                        <p className="font-medium">{order.carrier}</p>
                      </div>
                    )}
                    {order.estimatedDeliveryDate && (
                      <div className="mb-3">
                        <span className="text-sm text-gray-600">Livraison estimée</span>
                        <p className="font-medium">{formatDate(order.estimatedDeliveryDate)}</p>
                      </div>
                    )}
                    {order.actualDeliveryDate && (
                      <div>
                        <span className="text-sm text-gray-600">Livrée le</span>
                        <p className="font-medium text-green-600">{formatDate(order.actualDeliveryDate)}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            {(order.notes || order.customerNotes) && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                {order.customerNotes && (
                  <div className="mb-4">
                    <span className="text-sm text-gray-600">Note du client</span>
                    <p className="text-sm mt-1 italic">{order.customerNotes}</p>
                  </div>
                )}
                {order.notes && (
                  <div>
                    <span className="text-sm text-gray-600">Note interne</span>
                    <p className="text-sm mt-1">{order.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
