import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Printer, CalendarBlank, CheckCircle, Receipt, CurrencyCircleDollar, Hash, User, Eye, Lock } from '@phosphor-icons/react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContextNew';
import { api } from '@/services/api';
import ContentContainer from '../../../ui/layout/ContentContainer';

const OrderConfirmation = ({
  orderId,
  formData,
  cart,
  orderDetails,
  total,
  formatMAD
}) => {
  const router = useRouter();
  const { isAuthenticated, user, checkAuthStatus } = useAuth();
  const { success, error } = useNotification();
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Use orderDetails if available, otherwise fallback to cart
  const items = orderDetails?.items || cart?.items || [];
  const order = orderDetails || {};
  
  // Get order details
  const orderNumber = order.orderNumber || 'N/A';
  const orderDate = order.createdAt ? new Date(order.createdAt) : new Date();
  const customerEmail = order.customer?.email || formData?.email || '';
  
  // Calculate totals with new structure
  const calculateOrderTotals = () => {
    let regularSubtotal = 0;
    let currentSubtotal = 0;
    
    // Calculate both regular and current subtotals from items
    items.forEach(item => {
      const quantity = item.quantity || 1;
      
      // In the Order model: price = regular price, promotionalPrice = discounted price
      const regularPrice = item.price || item.unitPrice || 0; // Regular price from Order model
      const promotionalPrice = item.promotionalPrice; // Promotional price if available
      
      // Current price is promotional price if available, otherwise regular price
      const currentPrice = promotionalPrice || regularPrice;
      const currentItemTotal = item.totalPrice || item.total || (currentPrice * quantity);
      currentSubtotal += currentItemTotal;
      
      regularSubtotal += (regularPrice * quantity);
    });
    
    // Calculate savings (difference between regular and current)
    const savings = regularSubtotal - currentSubtotal;
    const hasPromotions = savings > 0.01; // Use small threshold to avoid floating point issues
    
    // Get shipping and tax from order
    const shipping = order.shipping || order.deliveryFee || 50;
    const tax = order.tax || 0;
    
    // Calculate final total
    const orderTotal = order.total || total || (currentSubtotal + shipping + tax);
    
    return {
      subtotal: currentSubtotal,
      regularSubtotal,
      savings,
      hasPromotions,
      shipping,
      tax,
      total: orderTotal
    };
  };
  
  const totals = calculateOrderTotals();
  
  // Debug logging (development only)
  if (process.env.NODE_ENV === 'development') {
    console.log('🧾 OrderConfirmation Debug:', {
      order,
      items,
      totals,
      orderTotal: order.total,
      passedTotal: total
    });
  }

  // Use the formatMAD prop or create a fallback
  const formatCurrency = formatMAD || ((value) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
    }).format(value);
  });

  // Format date display
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleContinueShopping = () => {
    router.push('/shop');
  };

  const handleViewOrderDetails = () => {
    router.push(`/profile/orders/${orderId}`);
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      error('Les mots de passe ne correspondent pas');
      return;
    }
    
    // Enhanced password validation to match API requirements
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/;
    if (password.length < 8 || password.length > 30) {
      error('Le mot de passe doit contenir entre 8 et 30 caractères');
      return;
    }
    
    if (!passwordRegex.test(password)) {
      error('Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial');
      return;
    }
    
    setIsCreatingAccount(true);
    
    try {
      // Format phone number to international format if provided
      let formattedPhone = formData?.phone || '';
      if (formattedPhone && !formattedPhone.startsWith('+')) {
        // Convert Moroccan phone numbers to international format
        if (formattedPhone.startsWith('0')) {
          formattedPhone = '+212' + formattedPhone.substring(1);
        } else if (formattedPhone.startsWith('212')) {
          formattedPhone = '+' + formattedPhone;
        } else {
          formattedPhone = '+212' + formattedPhone;
        }
      }
      
      // Ensure we have valid firstName and lastName
      const firstName = formData?.firstName || order.customer?.firstName || 'Client';
      const lastName = formData?.lastName || order.customer?.lastName || 'DIKAFOOD';
      
      // Validate required fields before sending
      if (!firstName || firstName.trim().length < 2) {
        error('Le prénom est requis (minimum 2 caractères)');
        return;
      }
      
      if (!lastName || lastName.trim().length < 2) {
        error('Le nom est requis (minimum 2 caractères)');
        return;
      }
      
      if (!customerEmail) {
        error('L\'adresse email est requise');
        return;
      }
      
      const registrationData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: customerEmail.trim().toLowerCase(),
        password: password,
        phone: formattedPhone
      };
      
      console.log('🔐 Registration data:', {
        ...registrationData,
        password: '[HIDDEN]'
      });
      
      const response = await api.register(registrationData);
      
      if (response.success) {
        success('Compte créé avec succès ! Redirection vers vos commandes...');
        setPassword('');
        setConfirmPassword('');
        
        // Refresh auth status to pick up the new authentication
        await checkAuthStatus(true);
        
        // Wait for auth context to fully update, then redirect
        setTimeout(async () => {
          // Force another auth check right before redirect to ensure we're authenticated
          await checkAuthStatus(true);
          router.push('/profile?tab=orders');
        }, 1500); // Allow auth context to process the new tokens
      } else {
        // Handle API validation errors
        if (response.errors && Array.isArray(response.errors)) {
          const errorMessages = response.errors.map(err => err.message).join(', ');
          error(`Erreur de validation: ${errorMessages}`);
        } else {
          error(response.message || 'Erreur lors de la création du compte');
        }
      }
    } catch (err) {
      console.error('Account creation error:', err);
      if (err.response?.data?.message) {
        error(err.response.data.message);
      } else {
        error('Erreur lors de la création du compte');
      }
    } finally {
      setIsCreatingAccount(false);
    }
  };

  // Define order summary header content with icon
  const orderHeaderContent = (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-logo-lime/20 border border-logo-lime/30 flex items-center justify-center">
        <CheckCircle size={18} weight="duotone" className="text-logo-lime" />
      </div>
      <span>Résumé de la Commande</span>
    </div>
  );

  // Define totals header content with icon
  const totalsHeaderContent = (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-logo-lime/20 border border-logo-lime/30 flex items-center justify-center">
        <CurrencyCircleDollar size={18} weight="duotone" className="text-logo-lime" />
      </div>
      <span>Totaux</span>
    </div>
  );

  return (
    <div className="bg-white rounded-xl overflow-hidden">
      {/* Confirmation Header */}
      <div className="flex flex-col items-center py-10 px-4 bg-gradient-to-br from-amber-50/50 to-amber-100/30 border-b border-amber-100">
        <div className="w-16 h-16 flex items-center justify-center bg-logo-lime/10 text-logo-lime rounded-full mb-4">
          <CheckCircle size={40} weight="duotone" />
        </div>
        <h2 className="text-2xl font-medium text-logo-brown mb-2">Commande Confirmée</h2>
        <p className="text-center text-gray-600 max-w-lg">
          Merci pour votre commande ! Un e-mail de confirmation a été envoyé à <strong className="text-gray-800">{customerEmail}</strong>.
        </p>
      </div>

      <div className="p-6 md:p-8">
        {/* Order Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 border-b border-amber-100 pb-6">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-1.5 text-gray-500 mb-2">
              <Hash size={16} weight="duotone" className="text-logo-lime" />
              <span className="text-sm">Numéro de Commande</span>
            </div>
            <p className="font-medium text-lg text-logo-brown">#{orderNumber}</p>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-1.5 text-gray-500 mb-2">
              <CalendarBlank size={16} weight="duotone" className="text-logo-lime" />
              <span className="text-sm">Date de Commande</span>
            </div>
            <p className="font-medium text-lg text-logo-brown">{formatDate(orderDate)}</p>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-1.5 text-gray-500 mb-2">
              <Receipt size={16} weight="duotone" className="text-logo-lime" />
              <span className="text-sm">Total</span>
            </div>
            <p className="font-medium text-lg text-logo-brown">{formatCurrency(totals.total)}</p>
          </div>
        </div>

        {/* Order Items */}
        <ContentContainer
          title={orderHeaderContent}
          headerVariant="default"
          className="mb-8"
          bodyClassName="p-4"
        >
          <div className="divide-y divide-amber-100">
            {items.map((item, index) => {
              // Handle different item structures
              const itemName = item.name || item.productName || item.product?.name || 'Product';
              
              // Prioritize variant images first, then fallback to product images
              const itemImage = item.variant?.imageUrl || // From variant object in order
                               item.variant?.imageUrls?.[0] || // First variant image
                               item.imageUrl || // Direct imageUrl field
                               item.imageUrls?.[0] || // First direct image
                               item.product?.image || // Product main image
                               item.product?.images?.[0]?.url || // First product image URL
                               (item.product?.images?.find(img => img.isPrimary)?.url) || // Primary product image
                               '/images/products/dika-500ML.png'; // Fallback placeholder
              
              // Debug logging (development only)
              if (process.env.NODE_ENV === 'development') {
                console.log('🖼️ Order item debug:', {
                  itemName,
                  variant: item.variant,
                  regularPrice: item.price,
                  promotionalPrice: item.promotionalPrice,
                  totalPrice: item.totalPrice,
                  quantity: item.quantity,
                  imageOptions: {
                    'variant.imageUrl': item.variant?.imageUrl,
                    'variant.imageUrls[0]': item.variant?.imageUrls?.[0],
                    'item.imageUrl': item.imageUrl,
                    'item.imageUrls[0]': item.imageUrls?.[0],
                    'product.image': item.product?.image,
                    'product.images[0].url': item.product?.images?.[0]?.url,
                    'finalImage': itemImage
                  }
                });
              }
              
              const itemQuantity = item.quantity || 1;
              
              // In Order model: price = regular price, promotionalPrice = discounted price
              const regularPrice = item.price || 0; // Regular price from Order model
              const promotionalPrice = item.promotionalPrice; // Promotional price if available
              const currentPrice = promotionalPrice || regularPrice; // Use promo if available, otherwise regular
              
              const itemTotal = item.totalPrice || (currentPrice * itemQuantity);
              
              // Handle variant display - convert object to string if needed
              const getVariantDisplay = (variant) => {
                if (!variant) return '';
                if (typeof variant === 'string') return variant;
                if (typeof variant === 'object') {
                  const parts = [];
                  if (variant.size) parts.push(`Taille: ${variant.size}`);
                  if (variant.sku) parts.push(`SKU: ${variant.sku}`);
                  return parts.join(' • ');
                }
                return '';
              };
              
              return (
                <div key={item.id || item._id || index} className="flex py-4 first:pt-0">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-amber-50 flex-shrink-0">
                    <img src={itemImage} alt={itemName} className="w-full h-full object-contain p-1" />
                  </div>

                  <div className="flex-1 ml-4">
                    <h4 className="font-medium text-gray-800">{itemName}</h4>
                    <div className="flex justify-between mt-2">
                      <div className="text-gray-500 text-sm">
                        <span className="block text-xs">{getVariantDisplay(item.variant)}</span>
                        <span>Qté: {itemQuantity}</span>
                      </div>
                      <div className="text-right">
                        {/* Show pricing with promotions if applicable */}
                        <div className="text-sm">
                          {promotionalPrice ? (
                            // Show both regular (crossed) and promotional price
                            <div className="flex flex-col items-end">
                              <span className="text-gray-400 line-through text-xs">
                                {formatCurrency(regularPrice)} × {itemQuantity}
                              </span>
                              <span className="text-green-600 font-medium">
                                {formatCurrency(promotionalPrice)} × {itemQuantity}
                              </span>
                            </div>
                          ) : (
                            // Show only regular price
                            <span className="text-gray-500">
                              {formatCurrency(regularPrice)} × {itemQuantity}
                            </span>
                          )}
                        </div>
                        <div className="font-medium text-logo-brown mt-1">
                          {formatCurrency(itemTotal)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ContentContainer>

        {/* Order Totals */}
        <ContentContainer
          title={totalsHeaderContent}
          headerVariant="default"
          className="mb-8"
          bodyClassName="p-4 bg-amber-50/30"
        >
          <div className="space-y-2">
            {/* Sous-total (regular price) */}
            <div className="flex justify-between">
              <span className="text-gray-600">Sous-total</span>
              <span className="font-medium">{formatCurrency(totals.regularSubtotal)}</span>
            </div>
            
            {/* Show discount if there are promotions */}
            {totals.hasPromotions && totals.savings > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Réduction</span>
                <span>-{formatCurrency(totals.savings)}</span>
              </div>
            )}
            
            {/* Debug info - temporary */}
            {process.env.NODE_ENV === 'development' && (
              <div className="text-xs text-gray-400 border-t pt-2 mt-2">
                Debug: Regular={totals.regularSubtotal.toFixed(2)}, Current={totals.subtotal.toFixed(2)}, 
                Savings={totals.savings.toFixed(2)}, HasPromo={totals.hasPromotions.toString()}
              </div>
            )}
            
            {/* Delivery fee */}
            <div className="flex justify-between">
              <span className="text-gray-600">Livraison</span>
              <span className="font-medium">
                {totals.shipping > 0 ? formatCurrency(totals.shipping) : 'Gratuit'}
              </span>
            </div>
            
            {/* Taxes (only show if > 0) */}
            {totals.tax > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Taxes</span>
                <span className="font-medium">{formatCurrency(totals.tax)}</span>
              </div>
            )}
            
            <div className="flex justify-between pt-2 border-t border-amber-100">
              <span className="font-semibold text-logo-brown">Montant payé</span>
              <span className="font-bold text-logo-brown">{formatCurrency(totals.total)}</span>
            </div>
          </div>
        </ContentContainer>

        {/* Delivery and Payment Method Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Delivery Method */}
          {order.deliveryMethod && (
            <ContentContainer
              title={
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-logo-lime/20 border border-logo-lime/30 flex items-center justify-center">
                    <ShoppingBag size={18} weight="duotone" className="text-logo-lime" />
                  </div>
                  <span>Méthode de livraison</span>
                </div>
              }
              headerVariant="default"
              className="h-full"
              bodyClassName="p-4"
            >
              <div className="flex items-start gap-4">
                {/* Logo or Icon */}
                <div className="flex-shrink-0">
                  {order.deliveryMethod.logo ? (
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 bg-white">
                      <img
                        src={order.deliveryMethod.logo}
                        alt={order.deliveryMethod.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                      <ShoppingBag size={24} weight="duotone" className="text-gray-500" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">
                    {order.deliveryMethod.name}
                  </h3>
                  
                  {order.deliveryMethod.description && (
                    <p className="text-sm text-gray-600 mb-2">
                      {order.deliveryMethod.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {order.deliveryMethod.type && (
                      <span className="capitalize">
                        {order.deliveryMethod.type === 'delivery' ? 'Livraison' : 'Retrait'}
                      </span>
                    )}
                    
                    {order.deliveryMethod.estimatedTime && (
                      <span>
                        {(() => {
                          const time = order.deliveryMethod.estimatedTime;
                          const unitText = {
                            minutes: 'min',
                            hours: 'h',
                            days: 'j'
                          };
                          
                          if (time.min === time.max) {
                            return `${time.min}${unitText[time.unit]}`;
                          }
                          
                          return `${time.min}${unitText[time.unit]}-${time.max}${unitText[time.unit]}`;
                        })()}
                      </span>
                    )}
                    
                    {order.deliveryMethod.price > 0 && (
                      <span className="font-medium text-logo-brown">
                        +{formatCurrency(order.deliveryMethod.price)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </ContentContainer>
          )}

          {/* Payment Method */}
          <ContentContainer
            title={
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-logo-lime/20 border border-logo-lime/30 flex items-center justify-center">
                  <CurrencyCircleDollar size={18} weight="duotone" className="text-logo-lime" />
                </div>
                <span>Méthode de paiement</span>
              </div>
            }
            headerVariant="default"
            className="h-full"
            bodyClassName="p-4"
          >
            <div className="flex items-start gap-4">
              {/* Payment Method Icon */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                  {(() => {
                    switch (order.paymentMethod) {
                      case 'cash_on_delivery':
                        return <CurrencyCircleDollar size={24} weight="duotone" className="text-green-600" />;
                      case 'bank_transfer':
                        return <Receipt size={24} weight="duotone" className="text-blue-600" />;
                      case 'credit_card':
                        return <CurrencyCircleDollar size={24} weight="duotone" className="text-purple-600" />;
                      default:
                        return <CurrencyCircleDollar size={24} weight="duotone" className="text-gray-500" />;
                    }
                  })()}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-lg mb-1">
                  {(() => {
                    switch (order.paymentMethod) {
                      case 'cash_on_delivery':
                        return 'Paiement à la livraison';
                      case 'bank_transfer':
                        return 'Virement bancaire';
                      case 'credit_card':
                        return 'Carte de crédit';
                      case 'store_credit':
                        return 'Crédit magasin';
                      default:
                        return 'Méthode de paiement';
                    }
                  })()}
                </h3>
                
                <p className="text-sm text-gray-600">
                  {(() => {
                    switch (order.paymentMethod) {
                      case 'cash_on_delivery':
                        return 'Payez en espèces lors de la réception de votre commande';
                      case 'bank_transfer':
                        return 'Paiement par virement bancaire';
                      case 'credit_card':
                        return 'Paiement sécurisé par carte de crédit';
                      case 'store_credit':
                        return 'Paiement avec crédit magasin';
                      default:
                        return 'Méthode de paiement sélectionnée';
                    }
                  })()}
                </p>
                
                <div className="mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    order.paymentStatus === 'paid' 
                      ? 'bg-green-100 text-green-800'
                      : order.paymentStatus === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : order.paymentStatus === 'failed'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {(() => {
                      switch (order.paymentStatus) {
                        case 'paid':
                          return 'Payé';
                        case 'pending':
                          return 'En attente';
                        case 'failed':
                          return 'Échec';
                        case 'refunded':
                          return 'Remboursé';
                        case 'partially_refunded':
                          return 'Partiellement remboursé';
                        default:
                          return 'Statut inconnu';
                      }
                    })()}
                  </span>
                </div>
              </div>
            </div>
          </ContentContainer>
        </div>

        {/* Account Creation or Customer Portal */}
        {!isAuthenticated ? (
          <ContentContainer
            title={
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-logo-lime/20 border border-logo-lime/30 flex items-center justify-center">
                  <User size={18} weight="duotone" className="text-logo-lime" />
                </div>
                <span>Créer un Compte</span>
              </div>
            }
            headerVariant="default"
            className="mb-8"
            bodyClassName="p-4"
          >
            <p className="text-gray-600 mb-4">
              Créez un compte pour suivre vos commandes et accéder à votre historique d'achats.
            </p>
            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                      placeholder="Votre mot de passe"
                      required
                      minLength="8"
                      maxLength="30"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    8-30 caractères avec majuscule, minuscule, chiffre et caractère spécial
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                      placeholder="Confirmer le mot de passe"
                      required
                      minLength="8"
                      maxLength="30"
                    />
                  </div>
                </div>
              </div>
              <button
                type="submit"
                disabled={isCreatingAccount}
                className="w-full bg-logo-lime text-white py-2 px-4 rounded-lg hover:bg-logo-lime/90 transition font-medium disabled:opacity-50"
              >
                {isCreatingAccount ? 'Création en cours...' : 'Créer mon compte'}
              </button>
            </form>
          </ContentContainer>
        ) : (
          <ContentContainer
            title={
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-logo-lime/20 border border-logo-lime/30 flex items-center justify-center">
                  <User size={18} weight="duotone" className="text-logo-lime" />
                </div>
                <span>Espace Client</span>
              </div>
            }
            headerVariant="default"
            className="mb-8"
            bodyClassName="p-4"
          >
            <p className="text-gray-600 mb-4">
              Accédez à votre espace client pour suivre cette commande et consulter votre historique.
            </p>
            <button
              onClick={handleViewOrderDetails}
              className="inline-flex items-center justify-center px-6 py-2.5 bg-logo-lime text-white rounded-full hover:bg-logo-lime/90 transition font-medium"
            >
              <Eye weight="duotone" className="mr-2" /> Voir les détails de la commande
            </button>
          </ContentContainer>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            className="inline-flex items-center justify-center px-6 py-2.5 border border-logo-brown/50 text-logo-brown rounded-full hover:bg-logo-brown/10 transition font-medium"
            onClick={handlePrintReceipt}
          >
            <Printer weight="duotone" className="mr-2" /> Imprimer le Reçu
          </button>

          <button
            className="inline-flex items-center justify-center px-6 py-2.5 bg-logo-brown text-white rounded-full hover:bg-logo-brown/90 transition font-medium"
            onClick={handleContinueShopping}
          >
            Continuer les Achats <ShoppingBag weight="duotone" className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;