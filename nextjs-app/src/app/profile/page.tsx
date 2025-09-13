'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContextNew';
import LucideIcon from '../../components/ui/icons/LucideIcon';
import AddressModal from '../../components/customer/AddressModal';

interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  customerType: string;
  isEmailVerified: boolean;
  isVerified?: boolean;
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints: number;
  addresses: Array<any>;
  preferences: {
    notifications: {
      email: boolean;
      sms: boolean;
    };
    language: string;
    currency: string;
  };
  createdAt: string;
  lastLogin?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  status: string;
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  items: Array<{
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
  }>;
  createdAt: string;
}

const CustomerPortal = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoggedIn, logout, loading: authLoading } = useAuth();
  const { addNotification } = useNotification();

  // Get initial tab from URL parameter, default to 'profile'
  const initialTab = searchParams.get('tab') || 'profile';
  const [activeTab, setActiveTab] = useState(initialTab);

  // Function to handle tab changes with URL updates
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    
    // Update URL with new tab parameter
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('tab', tabId);
    
    // Use replace to avoid adding to browser history for each tab click
    router.replace(`/profile?${newSearchParams.toString()}`, { scroll: false });
  };
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any | null>(null);
  const [addressLoading, setAddressLoading] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [orderDetailsLoading, setOrderDetailsLoading] = useState(false);
  const [orderDetailsCache, setOrderDetailsCache] = useState<{[key: string]: any}>({});
  const [ordersCache, setOrdersCache] = useState<{[key: string]: Order[]}>({});
  const [lastOrdersFetch, setLastOrdersFetch] = useState<number>(0);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    preferences: {
      notifications: {
        email: true,
        sms: false
      },
      language: 'fr',
      currency: 'MAD'
    }
  });

  // Update active tab when URL parameter changes
  // Sync activeTab with URL parameters when URL changes (e.g., browser back/forward)
  useEffect(() => {
    const tabParam = searchParams.get('tab') || 'profile';
    if (['profile', 'orders', 'addresses', 'preferences'].includes(tabParam) && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [searchParams, activeTab]);

  // Redirect if not logged in (but wait for auth to load first)
  useEffect(() => {
    // Don't redirect while auth is still loading
    if (authLoading) return;
    
    // Add extra delay for auth context to fully process after registration
    const checkAuthAndRedirect = setTimeout(() => {
      if (!isLoggedIn) {
        console.log('🚫 User not logged in, redirecting to home');
        router.push('/');
        return;
      }
    }, 500); // Give auth context time to process new authentication
    
    return () => clearTimeout(checkAuthAndRedirect);
  }, [authLoading, isLoggedIn, router]);

  // Set user data when available
  useEffect(() => {
    if (user && isLoggedIn) {
      setCustomer(user as Customer);
      setEditForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        preferences: user.preferences || {
          notifications: { email: true, sms: false },
          language: 'fr',
          currency: 'MAD'
        }
      });
      setLoading(false);
    }
  }, [user, isLoggedIn]);

  // Fetch customer orders with caching and performance optimization
  const fetchOrders = async (forceRefresh = false) => {
    try {
      const cacheKey = 'customer_orders';
      const now = Date.now();
      const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes cache

      // Check cache first (unless force refresh)
      if (!forceRefresh && ordersCache[cacheKey] && (now - lastOrdersFetch) < CACHE_DURATION) {
        console.log('📦 Using cached orders data');
        setOrders(ordersCache[cacheKey]);
        return;
      }

      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.log('📦 No access token available for fetching orders');
        return;
      }

      console.log('📦 Fetching customer orders...');
      const startTime = performance.now();
      
      const response = await fetch('/api/customers/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const endTime = performance.now();
      console.log(`📦 Orders API call took ${(endTime - startTime).toFixed(2)}ms`);

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          console.log('📦 Orders fetched successfully:', data.data?.length || 0, 'orders');
          const ordersData = data.data || [];
          setOrders(ordersData);
          
          // Cache the results
          setOrdersCache(prev => ({
            ...prev,
            [cacheKey]: ordersData
          }));
          setLastOrdersFetch(now);
        } else {
          console.error('📦 Orders fetch failed:', data.message);
          addNotification({
            type: 'error',
            message: 'Erreur lors du chargement des commandes'
          });
        }
      } else {
        console.error('📦 Orders API response not ok:', response.status);
        addNotification({
          type: 'error',
          message: 'Erreur lors du chargement des commandes'
        });
      }
    } catch (error) {
      console.error('📦 Error fetching orders:', error);
      addNotification({
        type: 'error',
        message: 'Erreur lors du chargement des commandes'
      });
    }
  };

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    } else if (activeTab === 'addresses') {
      fetchAddresses();
    }
  }, [activeTab]);

  // Also fetch orders when user becomes authenticated (after registration)
  useEffect(() => {
    if (isLoggedIn && user && activeTab === 'orders') {
      console.log('📦 User authenticated, fetching orders for orders tab');
      fetchOrders();
    }
  }, [isLoggedIn, user, activeTab]);

  // Fetch order details for modal with caching
  const fetchOrderDetails = async (orderId: string) => {
    try {
      // Check cache first
      if (orderDetailsCache[orderId]) {
        console.log('📦 Using cached order details for:', orderId);
        setOrderDetails(orderDetailsCache[orderId]);
        return;
      }

      setOrderDetailsLoading(true);
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.log('📦 No access token available for fetching order details');
        return;
      }

      console.log('📦 Fetching order details for:', orderId);
      const startTime = performance.now();
      
      const response = await fetch(`/api/customers/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const endTime = performance.now();
      console.log(`📦 API call took ${(endTime - startTime).toFixed(2)}ms`);

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          console.log('📦 Order details fetched successfully:', data.data);
          setOrderDetails(data.data);
          
          // Cache the result
          setOrderDetailsCache(prev => ({
            ...prev,
            [orderId]: data.data
          }));
        } else {
          console.error('📦 Order details fetch failed:', data.message);
          addNotification({
            type: 'error',
            message: 'Erreur lors du chargement des détails de la commande'
          });
        }
      } else {
        console.error('📦 Order details API response not ok:', response.status);
        addNotification({
          type: 'error',
          message: 'Erreur lors du chargement des détails de la commande'
        });
      }
    } catch (error) {
      console.error('📦 Error fetching order details:', error);
      addNotification({
        type: 'error',
        message: 'Erreur lors du chargement des détails de la commande'
      });
    } finally {
      setOrderDetailsLoading(false);
    }
  };

  // Handle opening order details modal
  useEffect(() => {
    if (selectedOrderId) {
      fetchOrderDetails(selectedOrderId);
    } else {
      setOrderDetails(null);
    }
  }, [selectedOrderId]);

  // Fetch customer addresses
  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const response = await fetch('/api/customers/addresses', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAddresses(data.data || []);
        }
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  // Handle add/edit address
  const handleSaveAddress = async (addressData: any) => {
    setAddressLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }

      const isEditing = !!editingAddress;
      const url = isEditing 
        ? `/api/customers/addresses/${editingAddress._id}`
        : '/api/customers/addresses';
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(addressData)
      });

      const data = await response.json();
      if (data.success) {
        addNotification(
          isEditing ? 'Adresse modifiée avec succès' : 'Adresse ajoutée avec succès',
          'success'
        );
        setIsAddressModalOpen(false);
        setEditingAddress(null);
        fetchAddresses(); // Refresh addresses
      } else {
        addNotification(data.message || 'Erreur lors de l\'enregistrement', 'error');
      }
    } catch (error) {
      console.error('Error saving address:', error);
      addNotification('Erreur lors de l\'enregistrement de l\'adresse', 'error');
    } finally {
      setAddressLoading(false);
    }
  };

  // Handle delete address
  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette adresse ?')) {
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await fetch(`/api/customers/addresses/${addressId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        addNotification('Adresse supprimée avec succès', 'success');
        fetchAddresses(); // Refresh addresses
      } else {
        addNotification(data.message || 'Erreur lors de la suppression', 'error');
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      addNotification('Erreur lors de la suppression de l\'adresse', 'error');
    }
  };

  // Handle profile update
  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });

      const data = await response.json();
      if (data.success) {
        setCustomer(prev => ({ ...prev, ...editForm } as Customer));
        setIsEditing(false);
        addNotification('Profil mis à jour avec succès', 'success');
      } else {
        addNotification(data.message || 'Erreur lors de la mise à jour', 'error');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      addNotification('Erreur lors de la mise à jour du profil', 'error');
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format currency
  const formatCurrency = (amount: number, currency: string = 'MAD') => {
    // Handle NaN or invalid amounts
    if (isNaN(amount) || amount === null || amount === undefined) {
      return '0,00 MAD';
    }
    
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'En attente' },
      confirmed: { color: 'bg-blue-100 text-blue-800', text: 'Confirmée' },
      processing: { color: 'bg-purple-100 text-purple-800', text: 'En cours' },
      shipped: { color: 'bg-indigo-100 text-indigo-800', text: 'Expédiée' },
      delivered: { color: 'bg-green-100 text-green-800', text: 'Livrée' },
      cancelled: { color: 'bg-red-100 text-red-800', text: 'Annulée' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-logo-lime"></div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Accès non autorisé</h2>
          <p className="text-gray-600 mb-4">Vous devez être connecté pour accéder à cette page.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-logo-lime text-dark-green-7 px-4 py-2 rounded-lg hover:bg-logo-lime/90"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', name: 'Mon Profil', icon: 'user' },
    { id: 'orders', name: 'Mes Commandes', icon: 'shoppingbag' },
    { id: 'addresses', name: 'Mes Adresses', icon: 'house' },
    { id: 'preferences', name: 'Préférences', icon: 'gear' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/')}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
              >
                <LucideIcon name="arrowleft" size="md" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mon Espace Client</h1>
                <p className="text-gray-600">Gérez votre profil et vos commandes</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-600 hover:text-red-800 px-4 py-2 rounded-lg hover:bg-red-50"
            >
              <LucideIcon name="signout" size="sm" />
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border">
              {/* User Info */}
              <div className="p-6 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-logo-lime flex items-center justify-center">
                    <span className="text-dark-green-7 font-semibold text-lg">
                      {customer.firstName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {customer.firstName} {customer.lastName}
                    </h3>
                    <div className="flex items-center gap-1 mt-1">
                      {(customer.isVerified || customer.isEmailVerified) ? (
                        <>
                          <LucideIcon name="checkcircle" size="xs" className="text-green-500" />
                          <span className="text-xs text-green-600">Vérifié</span>
                        </>
                      ) : (
                        <>
                          <LucideIcon name="clock" size="xs" className="text-amber-500" />
                          <span className="text-xs text-amber-600">En attente</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="p-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-logo-lime text-dark-green-7'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <LucideIcon name={tab.icon as any} size="sm" />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            {/* Stats */}
            <div className="mt-6 bg-white rounded-lg shadow-sm border p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Statistiques</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Commandes</span>
                  <span className="font-medium">{customer.totalOrders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total dépensé</span>
                  <span className="font-medium">{formatCurrency(customer.totalSpent)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Points fidélité</span>
                  <span className="font-medium text-logo-lime">{customer.loyaltyPoints}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Mon Profil</h2>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center gap-2 bg-logo-lime text-dark-green-7 px-4 py-2 rounded-lg hover:bg-logo-lime/90"
                    >
                      <LucideIcon name={isEditing ? 'x' : 'pencil'} size="sm" />
                      {isEditing ? 'Annuler' : 'Modifier'}
                    </button>
                  </div>

                  {isEditing ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Prénom
                          </label>
                          <input
                            type="text"
                            value={editForm.firstName}
                            onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nom
                          </label>
                          <input
                            type="text"
                            value={editForm.lastName}
                            onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          value={editForm.phone}
                          onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+212XXXXXXXXX"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                        />
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={handleUpdateProfile}
                          className="bg-logo-lime text-dark-green-7 px-6 py-2 rounded-lg hover:bg-logo-lime/90 font-medium"
                        >
                          Sauvegarder
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">
                            Nom complet
                          </label>
                          <p className="text-gray-900">{customer.firstName} {customer.lastName}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">
                            Email
                          </label>
                          <p className="text-gray-900">{customer.email}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">
                            Téléphone
                          </label>
                          <p className="text-gray-900">{customer.phone || 'Non renseigné'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">
                            Type de compte
                          </label>
                          <p className="text-gray-900 capitalize">
                            {customer.customerType.replace('_', ' ')}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">
                            Membre depuis
                          </label>
                          <p className="text-gray-900">{formatDate(customer.createdAt)}</p>
                        </div>
                        {customer.lastLogin && (
                          <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                              Dernière connexion
                            </label>
                            <p className="text-gray-900">{formatDate(customer.lastLogin)}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Mes Commandes</h2>
                    <button
                      onClick={() => fetchOrders(true)}
                      className="text-sm text-logo-lime hover:text-lime-600 flex items-center"
                    >
                      <LucideIcon name="refresh-cw" className="h-4 w-4 mr-1" />
                      Actualiser
                    </button>
                  </div>
                  
                  {loading && orders.length === 0 ? (
                    <div className="space-y-4">
                      {/* Loading skeleton for orders */}
                      {[...Array(3)].map((_, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 animate-pulse">
                          <div className="flex justify-between items-start mb-3">
                            <div className="space-y-2">
                              <div className="h-5 bg-gray-200 rounded w-48"></div>
                              <div className="h-4 bg-gray-200 rounded w-32"></div>
                            </div>
                            <div className="text-right space-y-2">
                              <div className="h-6 bg-gray-200 rounded w-20"></div>
                              <div className="h-5 bg-gray-200 rounded w-24"></div>
                            </div>
                          </div>
                          <div className="border-t pt-3">
                            <div className="flex justify-between items-start">
                              <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-24"></div>
                                <div className="flex space-x-2">
                                  <div className="h-6 bg-gray-200 rounded w-32"></div>
                                  <div className="h-6 bg-gray-200 rounded w-28"></div>
                                </div>
                              </div>
                              <div className="h-8 bg-gray-200 rounded w-24"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                      <LucideIcon name="shoppingbag" size="xl" className="text-gray-400 mb-4 mx-auto" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune commande</h3>
                      <p className="text-gray-500 mb-4">
                        Vous n'avez pas encore passé de commande.
                      </p>
                      <button
                        onClick={() => router.push('/shop')}
                        className="bg-logo-lime text-dark-green-7 px-6 py-2 rounded-lg hover:bg-logo-lime/90 font-medium"
                      >
                        Découvrir nos produits
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order._id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                Commande #{order.orderNumber}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {formatDate(order.createdAt)}
                              </p>
                            </div>
                            <div className="text-right">
                              {getStatusBadge(order.status)}
                              <p className="text-lg font-semibold text-gray-900 mt-1">
                                {formatCurrency(order.total)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="border-t pt-3">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <p className="text-sm text-gray-600 mb-2">
                                  {order.items.length} article{order.items.length > 1 ? 's' : ''}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {order.items.slice(0, 3).map((item, index) => (
                                    <span
                                      key={index}
                                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                                    >
                                      {item.productName} {item.variant?.size && `(${item.variant.size})`} (x{item.quantity})
                                    </span>
                                  ))}
                                  {order.items.length > 3 && (
                                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                      +{order.items.length - 3} autres
                                    </span>
                                  )}
                                </div>
                              </div>
                              <button
                                onClick={() => setSelectedOrderId(order._id)}
                                className="flex items-center px-3 py-2 text-sm bg-logo-lime text-white hover:bg-lime-600 font-medium rounded-lg transition-colors shadow-sm"
                              >
                                <LucideIcon name="eye" className="h-4 w-4 mr-1" />
                                Voir détails
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Mes Adresses</h2>
                    <button 
                      onClick={() => {
                        setEditingAddress(null);
                        setIsAddressModalOpen(true);
                      }}
                      className="bg-logo-lime text-dark-green-7 px-4 py-2 rounded-lg hover:bg-logo-lime/90 font-medium"
                    >
                      <LucideIcon name="plus" size="sm" className="inline mr-2" />
                      Ajouter une adresse
                    </button>
                  </div>
                  
                  {addresses.length === 0 ? (
                    <div className="text-center py-12">
                      <LucideIcon name="house" size="xl" className="text-gray-400 mb-4 mx-auto" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune adresse</h3>
                      <p className="text-gray-500 mb-4">
                        Ajoutez une adresse de livraison pour faciliter vos commandes.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.map((address) => (
                        <div key={address._id} className="border border-gray-200 rounded-lg p-4 relative">
                          {address.isDefault && (
                            <div className="absolute -top-2 -right-2 bg-logo-lime text-dark-green-7 text-xs px-2 py-1 rounded-full font-medium">
                              Par défaut
                            </div>
                          )}
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold text-gray-900 capitalize">
                                {address.type === 'home' ? 'Domicile' : 
                                 address.type === 'work' ? 'Bureau' : 'Autre'}
                              </h4>
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => {
                                  setEditingAddress(address);
                                  setIsAddressModalOpen(true);
                                }}
                                className="text-gray-400 hover:text-gray-600 p-1"
                                title="Modifier"
                              >
                                <LucideIcon name="pencil" size="sm" />
                              </button>
                              <button 
                                onClick={() => handleDeleteAddress(address._id)}
                                className="text-red-400 hover:text-red-600 p-1"
                                title="Supprimer"
                              >
                                <LucideIcon name="trash" size="sm" />
                              </button>
                            </div>
                          </div>
                          
                          {address.company && (
                            <p className="text-sm text-gray-600 mb-1">{address.company}</p>
                          )}
                          
                          <div className="text-gray-600 text-sm">
                            <p>{address.street}</p>
                            {address.street2 && <p>{address.street2}</p>}
                            <p>{address.city}, {address.postalCode}</p>
                            <p>{address.country}</p>
                          </div>
                          
                          {address.phone && (
                            <p className="text-sm text-gray-500 mt-2">
                              <LucideIcon name="phone" size="xs" className="inline mr-1" />
                              {address.phone}
                            </p>
                          )}
                          
                          {address.instructions && (
                            <div className="mt-3 p-2 bg-gray-50 rounded text-sm text-gray-600">
                              <LucideIcon name="info" size="xs" className="inline mr-1" />
                              {address.instructions}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Préférences</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Notifications</h3>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={customer.preferences.notifications.email}
                            className="rounded border-gray-300 text-logo-lime focus:ring-logo-lime"
                            readOnly
                          />
                          <span className="text-gray-700">Notifications par email</span>
                        </label>
                        <label className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={customer.preferences.notifications.sms}
                            className="rounded border-gray-300 text-logo-lime focus:ring-logo-lime"
                            readOnly
                          />
                          <span className="text-gray-700">Notifications par SMS</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Langue et Devise</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Langue
                          </label>
                          <select
                            value={customer.preferences.language}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                            disabled
                          >
                            <option value="fr">Français</option>
                            <option value="ar">العربية</option>
                            <option value="en">English</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Devise
                          </label>
                          <select
                            value={customer.preferences.currency}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                            disabled
                          >
                            <option value="MAD">Dirham (MAD)</option>
                            <option value="EUR">Euro (EUR)</option>
                            <option value="USD">Dollar (USD)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrderId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-5xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="relative bg-gradient-to-r from-logo-lime to-lime-500 px-6 py-5">
              <div className="flex justify-between items-center">
                <div className="text-white">
                  <h2 className="text-2xl font-bold">
                    {orderDetails ? `Commande #${orderDetails.orderNumber}` : 'Détails de la commande'}
                  </h2>
                  {orderDetails && (
                    <p className="text-lime-100 text-sm mt-1">
                      Passée le {formatDate(orderDetails.createdAt)}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  {orderDetails && (
                    <div className="text-right">
                      {getStatusBadge(orderDetails.status)}
                      <p className="text-2xl font-bold text-white mt-1">
                        {formatCurrency(orderDetails.total)}
                      </p>
                    </div>
                  )}
                  <button
                    onClick={() => setSelectedOrderId(null)}
                    className="text-white hover:text-lime-200 transition-colors p-2 hover:bg-white hover:bg-opacity-20 rounded-lg"
                  >
                    <LucideIcon name="x" className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[calc(95vh-140px)] bg-gray-50">
              {orderDetailsLoading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-gray-200 rounded-full animate-pulse"></div>
                    <div className="absolute top-0 left-0 w-16 h-16 border-4 border-logo-lime border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <div className="mt-6 text-center">
                    <p className="text-lg font-medium text-gray-900">Chargement des détails</p>
                    <p className="text-sm text-gray-500 mt-1">Récupération des informations de commande...</p>
                  </div>
                  
                  {/* Loading skeleton */}
                  <div className="w-full max-w-2xl mt-8 space-y-4">
                    <div className="animate-pulse">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                    <div className="animate-pulse">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : orderDetails ? (
                <div className="space-y-6">
                  {/* Quick Summary Section */}
                  <div className="bg-white mx-6 mt-6 rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                      <div className="flex flex-col items-center">
                        <LucideIcon name="package" className="h-8 w-8 text-logo-lime mb-2" />
                        <span className="text-sm text-gray-600">Articles</span>
                        <span className="font-semibold text-gray-900">{orderDetails.items?.length || 0}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <LucideIcon name="credit-card" className="h-8 w-8 text-blue-500 mb-2" />
                        <span className="text-sm text-gray-600">Paiement</span>
                        <span className="font-semibold text-gray-900">{getPaymentMethodDisplay(orderDetails.paymentMethod)}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <LucideIcon name="truck" className="h-8 w-8 text-green-500 mb-2" />
                        <span className="text-sm text-gray-600">Livraison</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(orderDetails.shipping)}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <LucideIcon name="dollar-sign" className="h-8 w-8 text-purple-500 mb-2" />
                        <span className="text-sm text-gray-600">Total</span>
                        <span className="font-bold text-lg text-gray-900">{formatCurrency(orderDetails.total)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 px-6">
                    {/* Main Content */}
                    <div className="xl:col-span-2 space-y-6">
                      {/* Order Items Section */}
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                          <div className="flex items-center">
                            <LucideIcon name="shopping-bag" className="h-5 w-5 text-logo-lime mr-2" />
                            <h3 className="text-lg font-semibold text-gray-900">Articles commandés</h3>
                            <span className="ml-2 px-2 py-1 text-xs bg-logo-lime text-white rounded-full">
                              {orderDetails.items?.length || 0}
                            </span>
                          </div>
                        </div>
                        <div className="p-6 space-y-4">
                          {orderDetails.items.map((item: any, index: number) => {
                            // Comprehensive image fallback logic (same as OrderConfirmation)
                            const itemImage = item.variant?.imageUrl || 
                                             item.variant?.imageUrls?.[0] || 
                                             item.imageUrl || 
                                             item.imageUrls?.[0] || 
                                             item.image || 
                                             item.productImage || 
                                             item.product?.image || 
                                             item.product?.images?.[0]?.url || 
                                             (item.product?.images?.find((img: any) => img.isPrimary)?.url) ||
                                             '/images/products/dika-500ML.png'; // Use actual product placeholder

                            console.log('🖼️ Modal order item image debug:', {
                              itemName: item.productName,
                              variant: item.variant,
                              variantImageUrl: item.variant?.imageUrl,
                              variantImageUrls: item.variant?.imageUrls,
                              itemImage: item.image,
                              product: item.product,
                              productImage: item.product?.image,
                              productImages: item.product?.images,
                              finalImage: itemImage
                            });

                            return (
                            <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
                              {/* Product Image */}
                              <div className="w-20 h-20 rounded-lg overflow-hidden bg-white border border-gray-200 flex-shrink-0 shadow-sm">
                                <img 
                                  src={itemImage} 
                                  alt={item.productName}
                                  className="w-full h-full object-contain p-2"
                                />
                              </div>
                              
                              {/* Product Details */}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-lg mb-1">{item.productName}</h4>
                                {item.variant && (
                                  <div className="flex flex-wrap gap-2 mb-3">
                                    {item.variant.size && (
                                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                        {item.variant.size}
                                      </span>
                                    )}
                                    {item.variant.sku && (
                                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                        SKU: {item.variant.sku}
                                      </span>
                                    )}
                                  </div>
                                )}
                                
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-600">Quantité:</span>
                                    <span className="px-2 py-1 bg-logo-lime text-white text-sm rounded-full font-medium">
                                      {item.quantity}
                                    </span>
                                  </div>
                                  
                                  <div className="text-right">
                                    <div className="flex items-center space-x-2">
                                      {item.promotionalPrice && item.promotionalPrice < item.price && (
                                        <span className="text-sm text-gray-500 line-through">
                                          {formatCurrency(item.price)}
                                        </span>
                                      )}
                                      <span className="font-medium text-gray-700">
                                        {formatCurrency(item.promotionalPrice || item.price)}
                                      </span>
                                      <span className="text-gray-400">×</span>
                                      <span className="text-gray-600">{item.quantity}</span>
                                    </div>
                                    <div className="text-xl font-bold text-logo-lime mt-1">
                                      {formatCurrency(item.totalPrice)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            );
                          })}
                        </div>
                        
                        {/* Order Summary */}
                        <div className="border-t border-gray-200 mt-6 pt-6">
                          <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                            <LucideIcon name="calculator" className="h-4 w-4 mr-2 text-logo-lime" />
                            Résumé de la commande
                          </h4>
                          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Sous-total</span>
                              <span className="font-medium">{formatCurrency(orderDetails.subtotal)}</span>
                            </div>
                            {orderDetails.discount > 0 && (
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600 flex items-center">
                                  <LucideIcon name="tag" className="h-4 w-4 mr-1 text-green-500" />
                                  Réduction
                                </span>
                                <span className="font-medium text-green-600">-{formatCurrency(orderDetails.discount)}</span>
                              </div>
                            )}
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600 flex items-center">
                                <LucideIcon name="truck" className="h-4 w-4 mr-1 text-blue-500" />
                                Livraison
                              </span>
                              <span className="font-medium">{formatCurrency(orderDetails.shipping)}</span>
                            </div>
                            {orderDetails.tax > 0 && (
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">Taxes</span>
                                <span className="font-medium">{formatCurrency(orderDetails.tax)}</span>
                              </div>
                            )}
                            <div className="border-t border-gray-300 pt-3 flex justify-between items-center">
                              <span className="text-lg font-bold text-gray-900">Total</span>
                              <span className="text-2xl font-bold text-logo-lime">{formatCurrency(orderDetails.total)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      </div>

                      {/* Order History */}
                      {orderDetails.history && orderDetails.history.length > 0 && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                              <LucideIcon name="clock" className="h-5 w-5 text-logo-lime mr-2" />
                              Historique de la commande
                            </h3>
                          </div>
                          <div className="p-6 space-y-4">
                            {orderDetails.history.map((entry: any, index: number) => (
                              <div key={index} className="relative flex items-start space-x-4 p-4 bg-gray-50 rounded-lg border-l-4 border-logo-lime">
                                <div className="flex-shrink-0">
                                  <div className="w-8 h-8 bg-logo-lime rounded-full flex items-center justify-center">
                                    <LucideIcon name="check" className="h-4 w-4 text-white" />
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold text-gray-900 text-lg">{entry.status}</span>
                                    <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-full">
                                      {formatDate(entry.timestamp)}
                                    </span>
                                  </div>
                                  {entry.note && (
                                    <p className="text-sm text-gray-700 mb-2 bg-white p-2 rounded italic">
                                      "{entry.note}"
                                    </p>
                                  )}
                                  {entry.updatedBy && (
                                    <div className="flex items-center text-xs text-gray-500">
                                      <LucideIcon name="user" className="h-3 w-3 mr-1" />
                                      <span>
                                        Par {entry.updatedBy.firstName} {entry.updatedBy.lastName}
                                        {entry.updatedBy.role && (
                                          <span className="ml-1 px-1 py-0.5 bg-gray-200 rounded text-xs">
                                            {entry.updatedBy.role}
                                          </span>
                                        )}
                                      </span>
                                    </div>
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
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="px-6 py-4 border-b border-gray-200 bg-blue-50 rounded-t-lg">
                          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <LucideIcon name="credit-card" className="h-5 w-5 text-blue-500 mr-2" />
                            Détails du paiement
                          </h3>
                        </div>
                        <div className="p-6 space-y-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center mb-2">
                              <LucideIcon name="wallet" className="h-4 w-4 text-blue-500 mr-2" />
                              <span className="text-sm font-medium text-gray-700">Méthode de paiement</span>
                            </div>
                            <p className="font-semibold text-gray-900 text-lg">{getPaymentMethodDisplay(orderDetails.paymentMethod)}</p>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center mb-2">
                              <LucideIcon name="check-circle" className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-sm font-medium text-gray-700">Statut du paiement</span>
                            </div>
                            <div className="mt-2">
                              {getPaymentStatusBadge(orderDetails.paymentStatus)}
                            </div>
                          </div>
                          
                          {orderDetails.paymentDate && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex items-center mb-2">
                                <LucideIcon name="calendar" className="h-4 w-4 text-purple-500 mr-2" />
                                <span className="text-sm font-medium text-gray-700">Date de paiement</span>
                              </div>
                              <p className="font-semibold text-gray-900">{formatDate(orderDetails.paymentDate)}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Delivery Details */}
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="px-6 py-4 border-b border-gray-200 bg-green-50 rounded-t-lg">
                          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <LucideIcon name="truck" className="h-5 w-5 text-green-500 mr-2" />
                            Détails de livraison
                          </h3>
                        </div>
                        <div className="p-6 space-y-4">
                          {/* Shipping Address */}
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center mb-3">
                              <LucideIcon name="map-pin" className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-sm font-medium text-gray-700">Adresse de livraison</span>
                            </div>
                            <div className="bg-white p-3 rounded border text-sm">
                              <p className="font-semibold text-gray-900 mb-1">
                                {orderDetails.shippingAddress.firstName} {orderDetails.shippingAddress.lastName}
                              </p>
                              {orderDetails.shippingAddress.company && (
                                <p className="text-gray-600 mb-1">{orderDetails.shippingAddress.company}</p>
                              )}
                              <p className="text-gray-700">{orderDetails.shippingAddress.street}</p>
                              {orderDetails.shippingAddress.street2 && (
                                <p className="text-gray-700">{orderDetails.shippingAddress.street2}</p>
                              )}
                              <p className="text-gray-700">
                                {orderDetails.shippingAddress.postalCode} {orderDetails.shippingAddress.city}
                                {orderDetails.shippingAddress.state && `, ${orderDetails.shippingAddress.state}`}
                              </p>
                              <p className="text-gray-700 font-medium">{orderDetails.shippingAddress.country}</p>
                              {orderDetails.shippingAddress.phone && (
                                <p className="mt-2 flex items-center text-gray-600">
                                  <LucideIcon name="phone" className="h-3 w-3 mr-1" />
                                  {orderDetails.shippingAddress.phone}
                                </p>
                              )}
                            </div>
                            {orderDetails.shippingAddress.instructions && (
                              <div className="mt-3 bg-yellow-50 p-3 rounded border border-yellow-200">
                                <div className="flex items-center mb-1">
                                  <LucideIcon name="message-circle" className="h-3 w-3 text-yellow-600 mr-1" />
                                  <span className="text-xs font-medium text-yellow-700">Instructions</span>
                                </div>
                                <p className="text-sm text-yellow-800 italic">"{orderDetails.shippingAddress.instructions}"</p>
                              </div>
                            )}
                          </div>

                          {/* Delivery Info */}
                          {(orderDetails.trackingNumber || orderDetails.carrier || orderDetails.estimatedDeliveryDate || orderDetails.actualDeliveryDate) && (
                            <div className="border-t pt-4">
                              {orderDetails.trackingNumber && (
                                <div className="mb-3">
                                  <span className="text-sm text-gray-600">Numéro de suivi</span>
                                  <p className="font-medium font-mono">{orderDetails.trackingNumber}</p>
                                </div>
                              )}
                              {orderDetails.carrier && (
                                <div className="mb-3">
                                  <span className="text-sm text-gray-600">Transporteur</span>
                                  <p className="font-medium">{orderDetails.carrier}</p>
                                </div>
                              )}
                              {orderDetails.estimatedDeliveryDate && (
                                <div className="mb-3">
                                  <span className="text-sm text-gray-600">Livraison estimée</span>
                                  <p className="font-medium">{formatDate(orderDetails.estimatedDeliveryDate)}</p>
                                </div>
                              )}
                              {orderDetails.actualDeliveryDate && (
                                <div>
                                  <span className="text-sm text-gray-600">Livrée le</span>
                                  <p className="font-medium text-green-600">{formatDate(orderDetails.actualDeliveryDate)}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Notes */}
                      {(orderDetails.notes || orderDetails.customerNotes) && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                          <div className="px-6 py-4 border-b border-gray-200 bg-yellow-50 rounded-t-lg">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                              <LucideIcon name="file-text" className="h-5 w-5 text-yellow-500 mr-2" />
                              Notes
                            </h3>
                          </div>
                          <div className="p-6 space-y-4">
                            {orderDetails.customerNotes && (
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center mb-2">
                                  <LucideIcon name="user" className="h-4 w-4 text-blue-500 mr-2" />
                                  <span className="text-sm font-medium text-gray-700">Note du client</span>
                                </div>
                                <p className="text-sm text-gray-700 italic bg-white p-3 rounded border">"{orderDetails.customerNotes}"</p>
                              </div>
                            )}
                            {orderDetails.notes && (
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center mb-2">
                                  <LucideIcon name="edit" className="h-4 w-4 text-orange-500 mr-2" />
                                  <span className="text-sm font-medium text-gray-700">Note interne</span>
                                </div>
                                <p className="text-sm text-gray-700 bg-white p-3 rounded border">{orderDetails.notes}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
              ) : (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <LucideIcon name="alert-circle" className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <p className="text-gray-600">Erreur lors du chargement des détails</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Address Modal */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => {
          setIsAddressModalOpen(false);
          setEditingAddress(null);
        }}
        onSave={handleSaveAddress}
        address={editingAddress}
        loading={addressLoading}
      />
    </div>
  );
};

export default CustomerPortal;
