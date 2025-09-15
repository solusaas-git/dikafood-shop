import React, { useState, useEffect, useCallback, memo, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import MenuTrigger from './MenuTrigger';
import LucideIcon from '../icons/LucideIcon';
import Icon from '../icons/Icon';
import CartFooter from './CartFooter';
import { useTranslation } from '../../../utils/i18n';
import translations from './translations/CartMenu';
import { useCart } from '../../../contexts/CartContext';
import { eventBus, EVENTS } from '@/utils/eventBus';
import { useCurrency } from '../../../contexts/CurrencyContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLoading } from '@/contexts/LoadingContext';
import { getProductImageUrlById, api } from '@/services/api';

// Simple async image component for cart items
function CartItemImage({ imageId, imageUrl, alt, ...props }) {
  const [src, setSrc] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    
    // Priority 1: Use imageUrl if provided (direct URL)
    if (imageUrl) {
      setSrc(imageUrl);
      setLoading(false);
      return;
    }
    
    // Priority 2: Resolve imageId via API
    if (imageId) {
      setLoading(true);
      // Check if imageId is already a URL
      if (imageId.startsWith('/') || imageId.startsWith('http')) {
        setSrc(imageId);
        setLoading(false);
      } else {
        getProductImageUrlById(imageId).then(url => {
          if (mounted) {
            setSrc(url);
            setLoading(false);
          }
        }).catch(() => {
          if (mounted) {
            setSrc(null);
            setLoading(false);
          }
        });
      }
    } else {
      setSrc(null);
      setLoading(false);
    }
    
    return () => { mounted = false; };
  }, [imageId, imageUrl]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-4 h-4 border border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!src) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded">
        <Icon 
          name="shoppingbag" 
          size="md" 
          className="text-gray-400"
        />
      </div>
    );
  }

  return <img src={src} alt={alt} {...props} />;
}

/**
 * Shopping cart menu component
 *
 * @param {Object} props - Component props
 * @param {boolean} props.isMobile - Whether the component is in mobile view
 * @param {boolean} props.isNavbarMobile - Whether the component is in a mobile navbar
 * @param {Function} props.onClose - Function to call when menu closes
 * @param {boolean} props.isGrouped - Whether the menu is part of a grouped container
 * @param {boolean} props.isOpen - Whether the menu is open
 * @param {Function} props.onToggle - Function to toggle the menu
 */
const CartMenu = memo(({
  isMobile = false,
  isNavbarMobile = false,
  onClose,
  isGrouped = false,
  isOpen,
  onToggle
}) => {
  const { t } = useTranslation(translations);
  const router = useRouter();
  const { showLoading } = useLoading();
  const { formatPrice } = useCurrency();
  const { cart, removeItem, updateItem, refreshCart, addItem } = useCart();
  
  // Memoize cart-specific values to prevent unnecessary re-renders
  const cartData = useMemo(() => {
    const data = {
      items: cart?.items || [],
      itemsCount: cart?.itemCount || 0, // Backend uses itemCount, not itemsCount
      totalAmount: cart?.totalAmount || 0,
      loading: cart?.loading || false
    };
    
    
    return data;
  }, [cart?.items, cart?.itemCount, cart?.totalAmount, cart?.loading]);
  
  const { isLoggedIn, isGuest } = useAuth();
  const [itemAdded, setItemAdded] = useState(false);
  const [featuredVariants, setFeaturedVariants] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(false);
  const hasFetchedVariants = useRef(false);

  // Show animation when items are added to cart
  const handleCartUpdate = useCallback(() => {
    setItemAdded(true);
    // Reset animation after a short delay
    setTimeout(() => {
      setItemAdded(false);
    }, 1500);
  }, []);

  // Listen for cart update events using event bus
  useEffect(() => {
    const unsubscribeItemAdded = eventBus.on(EVENTS.CART_ITEM_ADDED, handleCartUpdate);
    
    return () => {
      unsubscribeItemAdded();
    };
  }, [handleCartUpdate]);

  // Fetch featured variants when cart opens
  useEffect(() => {
    if (isOpen && !hasFetchedVariants.current) {
      hasFetchedVariants.current = true;
      setFeaturedLoading(true);
      api.getFeaturedVariants()
        .then(response => {
          if (response.success && response.data) {
            setFeaturedVariants(response.data.slice(0, 4)); // Limit to 4 variants
          }
        })
        .catch(error => {
          console.error('Error fetching featured variants:', error);
        })
        .finally(() => {
          setFeaturedLoading(false);
        });
    } else if (!isOpen) {
      // Reset fetch flag when cart closes
      hasFetchedVariants.current = false;
    }
  }, [isOpen]);

  // Handle remove item
  const handleRemoveItem = useCallback(async (itemId) => {
    await removeItem(itemId);
  }, [removeItem]);

  // Handle increase quantity
  const handleIncreaseQuantity = useCallback(async (itemId) => {
    const item = cart.items.find(i => i._id === itemId || i.id === itemId);
    if (!item) return;
    await updateItem(itemId, { quantity: item.quantity + 1 });
  }, [cart?.items, updateItem]);

  // Handle decrease quantity
  const handleDecreaseQuantity = useCallback(async (itemId) => {
    const item = cart.items.find(i => i._id === itemId || i.id === itemId);
    if (!item || item.quantity <= 1) return;
    await updateItem(itemId, { quantity: item.quantity - 1 });
  }, [cart?.items, updateItem]);

  const handleCheckout = useCallback(() => {
    if (onClose) onClose();
    showLoading('Redirection vers le checkout...');
    router.push('/checkout');
  }, [onClose, router, showLoading]);

  const handleContinueShopping = useCallback(() => {
    if (onClose) onClose();
    router.push('/shop');
  }, [onClose, router]);

  // Handle adding featured variant to cart
  const handleAddFeaturedVariant = useCallback(async (featuredVariant) => {
    try {
      await addItem({
        productId: featuredVariant.productId,
        variantId: featuredVariant.variantId,
        quantity: 1
      });
    } catch (error) {
      console.error('Error adding featured variant to cart:', error);
    }
  }, [addItem]);


  // Render featured variants cards in 2x2 grid
  const renderFeaturedVariantsCards = useCallback(() => {
    if (featuredLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-2 border-logo-lime/30 border-t-logo-lime animate-spin rounded-full mb-4"></div>
            <p className="text-sm text-gray-600">Chargement des variantes...</p>
          </div>
        </div>
      );
    }

    if (featuredVariants.length === 0) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Icon name="package" size="lg" className="text-gray-400 mb-2 mx-auto" />
            <p className="text-sm text-gray-600">Aucune variante vedette disponible</p>
          </div>
        </div>
      );
    }

    // Show up to 4 variants in 2x2 grid
    const displayVariants = featuredVariants.slice(0, 4);

    return (
      <div className="p-6">
        {/* Title */}
        <div className="mb-8 text-center">
          <h3 className="text-2xl font-extrabold text-white mb-2 drop-shadow-lg">
            Nos promotions
          </h3>
          <div className="w-24 h-1 bg-gradient-to-r from-logo-lime to-yellow-300 mx-auto rounded-full shadow-lg"></div>
        </div>
        
        {/* Grid of variants */}
        <div className="grid grid-cols-2 gap-6">
          {displayVariants.map((variant, index) => (
          <div key={variant._id || variant.id} className="w-72 h-80 overflow-hidden transition-all duration-300 will-change-transform flex flex-col bg-gradient-to-br from-light-yellow-1 via-white to-light-yellow-2 border border-dark-green-6/70 rounded-xl group hover:scale-105">
            {/* Product Image */}
            <div className="relative overflow-hidden w-full h-48 flex-shrink-0 group-hover:shadow-inner">
              <CartItemImage
                imageId={variant.image}
                imageUrl={variant.image}
                alt={variant.name}
                className="w-full h-full object-contain p-2 md:p-3 transition-transform duration-300 group-hover:scale-105"
              />
              
              {/* Size Badge */}
              {variant.size && (
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium text-dark-green-7 border border-logo-lime/30">
                  {variant.size}
                </div>
              )}
            </div>

            {/* Product Content */}
            <div className="p-3 pt-2 flex-grow flex flex-col">
              {/* Brand Badge */}
              {variant.brand && (
                <div className="flex mb-1">
                  <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-logo-lime/15 text-dark-green-7 border border-logo-lime/25">
                    <Icon name="leaf" size="xs" className="mr-1 text-dark-green-7" />
                    <span>{variant.brand}</span>
                  </div>
                </div>
              )}

              {/* Product Name */}
              <h3 className="text-dark-green-7 font-normal line-clamp-2 transition-colors duration-300 text-xs leading-tight mb-1">
                {variant.productName}
              </h3>

              {/* Spacer */}
              <div className="flex-grow"></div>
            </div>

            {/* Product Footer with Price and Action */}
            <div className="bg-dark-yellow-1 w-full mt-auto border-t border-dark-green-6/30 transition-all duration-300 p-3 group-hover:pb-4">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <div className="flex items-center justify-center rounded-full bg-logo-lime/15 border border-dark-green-7/30 shadow-sm p-1 w-7 h-7">
                    <Icon name="tag" weight="duotone" size="sm" className="text-dark-green-7" />
                  </div>
                  
                  {/* Separator */}
                  <div className="bg-dark-green-6/20 mx-1.5 w-px h-4"></div>
                  
                  <div className="font-semibold text-dark-green-7 transition-all duration-200 text-sm">
                    {formatPrice(variant.price)}
                    {variant.promotionalPrice && variant.promotionalPrice < variant.originalPrice && (
                      <div className="text-xs text-gray-500 line-through font-normal">
                        {formatPrice(variant.originalPrice)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleAddFeaturedVariant(variant);
                    }}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-dark-green-7 bg-logo-lime rounded-full hover:bg-logo-lime/90 hover:shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95"
                    aria-label="Buy now"
                  >
                    <Icon name="shoppingCart" size="sm" />
                    <span className="text-xs font-medium">Acheter</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          ))}
        </div>
      </div>
    );
  }, [featuredVariants, featuredLoading, formatPrice, handleAddFeaturedVariant]);

  // Render cart content
  const renderContent = useCallback(() => {
    const isEmpty = cartData.items.length === 0;
    const isLoading = cartData.loading;

    // Show loading state only if cart is empty AND loading (initial load)
    // Don't show loading state if we have items (to prevent empty state flicker during operations)
    if (isLoading && isEmpty) {
      return (
        <div className="px-6 py-8 flex flex-col items-center justify-center min-h-[280px]">
          <div className="w-16 h-16 rounded-full bg-logo-lime/10 border-2 border-logo-lime/20 flex items-center justify-center mb-6">
            <div className="w-6 h-6 border-2 border-logo-lime/30 border-t-logo-lime animate-spin rounded-full"></div>
          </div>
          <h4 className="text-lg font-semibold text-dark-green-7 mb-2">
            Chargement...
          </h4>
          <p className="text-sm text-gray-600 text-center">
            Récupération de votre panier
          </p>
        </div>
      );
    }

    if (isEmpty) {
      return (
        <div className="px-6 py-8 flex flex-col items-center justify-center min-h-[280px]">
          <div className="w-20 h-20 rounded-full bg-gray-50 border-2 border-gray-200 flex items-center justify-center mb-6">
            <Icon name="shoppingCart" size="xl" className="text-gray-400" weight="duotone" />
          </div>
          <h4 className="text-lg font-semibold text-dark-green-7 mb-2">
            {t('empty_cart')}
          </h4>
          <p className="text-sm text-gray-600 mb-6 max-w-[240px] text-center leading-relaxed">
            {t('add_products')}
          </p>
          <button
            onClick={handleContinueShopping}
            className="flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-lime-100 to-lime-50 text-dark-green-7 font-medium rounded-full border border-lime-200 hover:from-lime-200 hover:to-lime-100 hover:border-lime-300 transition-all hover:shadow-md active:scale-95"
          >
            <Icon name="shoppingbag" size="sm" className="text-dark-green-7" />
            Commencer mes achats
          </button>
        </div>
      );
    }

    return (
      <div className="h-full flex flex-col p-0 relative" key={`cart-content-${cartData.itemsCount}`}>
        {/* Show loading overlay when operations are in progress */}
        {isLoading && !isEmpty && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-md">
              <div className="w-4 h-4 border-2 border-logo-lime/30 border-t-logo-lime animate-spin rounded-full"></div>
              <span className="text-sm text-dark-green-7">Mise à jour...</span>
            </div>
          </div>
        )}
        <div className="flex-1 overflow-y-auto">
          <div className="px-3 md:px-4 py-2 space-y-2 md:space-y-3">
            {cartData.items.map(item => (
              <div key={item._id || item.id} className="relative bg-white border border-gray-200 rounded-xl p-3 md:p-4 hover:shadow-sm transition-all duration-200">
                <div className="flex gap-3 md:gap-4 items-start">
                  {/* Product Image */}
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200 flex-shrink-0">
                    <CartItemImage
                      imageId={item.variant?.imageUrl || item.image || item.product?.image}
                      imageUrl={item.variant?.imageUrl || item.variant?.imageUrls?.[0] || item.imageUrl || item.imageUrls?.[0] || item.product?.image}
                      alt={item.name || item.product?.name}
                      className="w-full h-full object-contain p-2 rounded-lg"
                    />
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    {/* Product Name */}
                    <h4 className="font-medium text-dark-green-7 text-xs md:text-sm leading-tight mb-1.5 md:mb-2 truncate">
                      {item.name || item.product?.name}
                    </h4>
                    
                    {/* Product Details */}
                    {(item.variant?.size || item.size || item.brand) && (
                      <div className="flex items-center gap-1.5 md:gap-2 text-xs text-gray-600 mb-2 md:mb-3">
                        {(item.variant?.size || item.size) && (
                          <span className="bg-gray-100 px-2 py-0.5 rounded-full">
                            {item.variant?.size || item.size}
                          </span>
                        )}
                        {item.brand && (
                          <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                            {item.brandDisplayName || item.brand}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Price and Quantity Row */}
                    <div className="flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="flex items-center border border-gray-200 rounded-lg">
                          <button
                            onClick={() => handleDecreaseQuantity(item._id || item.id)}
                            className="w-9 h-9 md:w-8 md:h-8 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-l-lg"
                            aria-label={t('decrease_quantity')}
                            disabled={item.quantity <= 1 || isLoading}
                          >
                            <Icon name="minus" size="xs" className={`${item.quantity <= 1 || isLoading ? 'text-gray-400' : 'text-gray-600'}`} />
                          </button>
                          <span className="w-9 md:w-10 text-center text-xs md:text-sm font-medium border-l border-r border-gray-200 py-1.5">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleIncreaseQuantity(item._id || item.id)}
                            className="w-9 h-9 md:w-8 md:h-8 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-r-lg"
                            aria-label={t('increase_quantity')}
                            disabled={isLoading}
                          >
                            <Icon name="plus" size="xs" className={`${isLoading ? 'text-gray-400' : 'text-gray-600'}`} />
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="text-xs md:text-sm font-semibold text-dark-green-7">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                        <div className="text-[10px] md:text-xs text-gray-500">
                          {formatPrice(item.price)} × {item.quantity}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Remove button - positioned to align with the center of the item */}
                  <button
                    onClick={() => handleRemoveItem(item._id || item.id)}
                    className="w-8 h-8 md:w-7 md:h-7 bg-red-50 hover:bg-red-100 rounded-full flex items-center justify-center transition-colors border border-red-200 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 mt-1"
                    aria-label={t('remove_item')}
                    disabled={isLoading}
                    title={t('remove_item')}
                  >
                    <Icon name="x" size="xs" className="text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <CartFooter
          totalAmount={cartData.totalAmount || 0}
          formatPrice={formatPrice}
          onCheckout={handleCheckout}
          checkoutText={t('checkout')}
          isLoading={isLoading}
          totalText={t('total')}
        />
      </div>
    );
  }, [cartData, t, formatPrice, handleContinueShopping, handleDecreaseQuantity, handleIncreaseQuantity, handleRemoveItem, handleCheckout]);

  // Create trigger element
  const triggerElement = (
    <MenuTrigger
      variant={isNavbarMobile ? 'transparent' : isMobile ? 'yellow' : 'glass'}
      size={isMobile ? 'icon' : 'md'}
      rounded={isMobile ? 'full' : 'default'}
      isMobile={isMobile}
      isNavbarMobile={isNavbarMobile}
      isGrouped={isGrouped}
      withCaret={false}
      isOpen={isOpen}
      onClick={onToggle ? () => onToggle(!isOpen) : undefined}
      className={!isMobile && cartData.itemsCount > 0 ? 'icon-text-separator' : ''}
      icon={
        cartData.loading && cartData.items.length === 0 ? (
          <div className="flex items-center justify-center gap-2">
            <LucideIcon name="shoppingCart" weight="duotone" size={isMobile ? "md" : "md"} />
            <div className="w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin"></div>
          </div>
        ) : (
          <div className="flex items-center justify-center relative">
            <LucideIcon name="shoppingCart" weight="duotone" size={isMobile ? "md" : "md"} />
            {cartData.itemsCount > 0 && (
              <span 
                className={`absolute -top-1 -right-1 md:-top-2 md:-right-2 text-[8px] md:text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full ${itemAdded ? 'animate-bounce' : ''}`}
                style={{
                  backgroundColor: '#ebeb48',
                  color: '#07451c',
                  fontSize: isMobile ? '8px' : '10px',
                  lineHeight: '1',
                  border: '1px solid #07451c'
                }}
              >
                {cartData.itemsCount > 9 ? '9+' : cartData.itemsCount}
              </span>
            )}
          </div>
        )
      }
    >
    </MenuTrigger>
  );

  // Create header element
  const headerElement = (
    <div className="flex items-center gap-3 px-4 py-3 md:py-4 bg-gradient-to-br from-amber-50 to-amber-100/70 border-b border-logo-lime/20">
      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-logo-lime/20 border border-logo-lime/40 flex items-center justify-center">
        <LucideIcon name="shoppingCart" weight="duotone" size="md" className="text-dark-green-7" />
      </div>
      <div className="flex flex-col">
        <h3 className="text-base md:text-lg font-semibold text-dark-green-7">{t('cart')}</h3>
        {cartData.itemsCount > 0 && (
          <span className="text-xs text-dark-green-6">
            {cartData.itemsCount} {cartData.itemsCount === 1 ? 'article' : 'articles'}
          </span>
        )}
      </div>
    </div>
  );

  // Create slide panel portal
  const slidePanel = useMemo(() => {
    if (!isOpen) return null;

    return createPortal(
      <div className="fixed inset-0 z-[9999] flex">
        {/* Backdrop */}
        <div 
          className="flex-1 bg-black/50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget && onClose) {
              onClose();
            }
          }}
        />
        
        {/* Cart Panel */}
        <div className={`w-[400px] max-w-[95vw] sm:max-w-[90vw] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 md:top-4 md:right-4 z-10 w-10 h-10 md:w-8 md:h-8 flex items-center justify-center rounded-full transition-all shadow-lg hover:shadow-xl border-2"
            style={{ 
              backgroundColor: '#aacc02',
              borderColor: '#aacc02',
              color: '#ebeb48'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#9bb601';
              e.target.style.borderColor = '#9bb601';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#aacc02';
              e.target.style.borderColor = '#aacc02';
            }}
            aria-label="Fermer le panier"
          >
            <svg 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="#226600" 
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="lucide lucide-x md:w-4 md:h-4"
            >
              <path d="m18 6-12 12"/>
              <path d="m6 6 12 12"/>
            </svg>
          </button>
          
          {/* Cart Header */}
          {headerElement}
          
          {/* Cart Content */}
          <div className="h-[calc(100vh-70px)] md:h-[calc(100vh-80px)] overflow-y-auto">
            {renderContent()}
          </div>
        </div>

        {/* Featured Variants Cards - Centered in available space */}
        <div className="absolute inset-0 hidden md:flex items-center justify-center pointer-events-none">
          <div className="flex items-center justify-center w-full h-full">
            {/* Calculate center position: half of available space minus cart width */}
            <div className="absolute left-0 top-0 w-[calc(100vw-400px)] h-full flex items-center justify-center pointer-events-auto">
              {renderFeaturedVariantsCards()}
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  }, [isOpen, headerElement, renderContent, renderFeaturedVariantsCards, onClose]);

  return (
    <>
      {/* Trigger Button */}
      <div 
        className="relative cursor-pointer" 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggle(!isOpen);
        }}
      >
        {triggerElement}
      </div>

      {/* Slide Panel Portal */}
      {slidePanel}
    </>
  );
});

export default CartMenu;