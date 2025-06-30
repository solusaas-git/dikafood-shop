import React, { useState, useEffect, useCallback, memo, useRef, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Menu from './Menu';
import MenuTrigger from './MenuTrigger';
import Icon from '../icons/Icon';
import CartFooter from './CartFooter';
import { useTranslation } from '../../../utils/i18n';
import translations from './translations/CartMenu';
import { useCart } from '../../../contexts/CartContext';
import { eventBus, EVENTS } from '@/utils/eventBus';
import { useCurrency } from '../../../contexts/CurrencyContext';
import { useAuth } from '@/contexts/AuthContext';
import { getProductImageUrlById } from '@/services/api';

// Simple async image component for cart items
function CartItemImage({ imageId, alt, ...props }) {
  const [src, setSrc] = React.useState(null);
  const [loading, setLoading] = React.useState(!!imageId);

  React.useEffect(() => {
    let mounted = true;
    if (imageId) {
      setLoading(true);
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
    } else {
      setSrc(null);
      setLoading(false);
    }
    return () => { mounted = false; };
  }, [imageId]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-4 h-4 border border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!src) {
    return (
      <Icon 
        name="shoppingbag" 
        size="md" 
        color="dark-green"
      />
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
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const { cart, removeItem, updateItem, refreshCart } = useCart();
  
  // Memoize cart-specific values to prevent unnecessary re-renders
  const cartData = useMemo(() => {
    const data = {
      items: cart?.items || [],
      itemsCount: cart?.itemCount || 0, // Backend uses itemCount, not itemsCount
      totalAmount: cart?.totalAmount || 0,
      loading: cart?.loading || false
    };
    
    console.log('🛒 CartMenu - Cart data:', {
      cart,
      processedData: data,
      itemsDetail: cart?.items?.map(item => ({
        _id: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      }))
    });
    
    return data;
  }, [cart?.items, cart?.itemCount, cart?.totalAmount, cart?.loading]);
  
  const { isLoggedIn, isGuest } = useAuth();
  const [itemAdded, setItemAdded] = useState(false);

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
    navigate('/checkout');
  }, [onClose, navigate]);

  const handleContinueShopping = useCallback(() => {
    if (onClose) onClose();
    navigate('/shop');
  }, [onClose, navigate]);

  // Render cart content
  const renderContent = useCallback(() => {
    const isEmpty = cartData.items.length === 0;
    const isLoading = cartData.loading;

    // Show loading state only if cart is empty AND loading (initial load)
    // Don't show loading state if we have items (to prevent empty state flicker during operations)
    if (isLoading && isEmpty) {
      return (
        <div className="p-6 flex flex-col items-center justify-center min-h-[200px]">
          <div className="w-16 h-16 rounded-full bg-logo-lime/15 border border-logo-lime/30 flex items-center justify-center mb-4">
            <div className="w-6 h-6 border-2 border-logo-lime/30 border-t-logo-lime animate-spin rounded-full"></div>
          </div>
          <h4 className="text-lg font-medium text-dark-green-7 mb-2">
            Chargement...
          </h4>
          <p className="text-sm text-dark-green-6 text-center">
            Récupération de votre panier
          </p>
        </div>
      );
    }

    if (isEmpty) {
      return (
        <div className="p-6 flex flex-col items-center justify-center min-h-[200px]">
          <div className="w-16 h-16 rounded-full bg-logo-lime/15 border border-logo-lime/30 flex items-center justify-center mb-4">
            <Icon name="shoppingCart" size="xl" color="dark-green" weight="duotone" />
          </div>
          <h4 className="text-lg font-medium text-dark-green-7 mb-2">
            {t('empty_cart')}
          </h4>
          <p className="text-sm text-dark-green-6 mb-6 max-w-[240px] text-center">
            {t('add_products')}
          </p>
          <button
            onClick={handleContinueShopping}
            className="flex items-center justify-center gap-2 py-3 px-8 bg-logo-lime/15 text-dark-green-7 font-medium rounded-full border border-logo-lime/30 hover:bg-logo-lime/25 transition-all hover:-translate-y-0.5 hover:shadow-sm icon-text-separator"
          >
            <Icon name="storefront" size="sm" className="text-dark-green-7" />
            {t('start_shopping')}
          </button>
        </div>
      );
    }

    return (
      <div className="p-0 relative" key={`cart-content-${cartData.itemsCount}`}>
        {/* Show loading overlay when operations are in progress */}
        {isLoading && !isEmpty && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-md">
              <div className="w-4 h-4 border-2 border-logo-lime/30 border-t-logo-lime animate-spin rounded-full"></div>
              <span className="text-sm text-dark-green-7">Mise à jour...</span>
            </div>
          </div>
        )}
        <div className="max-h-[300px] overflow-y-auto space-y-4 bg-gradient-to-br from-amber-50/80 to-amber-100/40">
          {cartData.items.map(item => (
            <div key={item._id || item.id} className="relative flex gap-3 p-3 mx-4 mt-4 bg-white/90 border border-logo-lime/20 rounded-lg hover:shadow-sm transition-all">
              {/* Remove button - positioned absolutely in top-right corner */}
              <button
                onClick={() => handleRemoveItem(item._id || item.id)}
                className="absolute top-2 right-2 w-6 h-6 bg-red-50 hover:bg-red-100 rounded-full flex items-center justify-center transition-colors border border-red-200 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed z-10"
                aria-label={t('remove_item')}
                disabled={isLoading}
                title={t('remove_item')}
              >
                <Icon name="x" size="xs" className="text-red-600" />
              </button>

              <div className="w-16 h-16 bg-white rounded-md flex items-center justify-center border border-logo-lime/10">
                <CartItemImage
                  imageId={item.image}
                  alt={item.name}
                  className="w-full h-full object-contain p-1"
                />
              </div>
              
              <div className="flex-1 pr-6"> {/* Add right padding to avoid overlap with remove button */}
                <div className="text-sm font-medium text-dark-green-7 mb-1">{item.name}</div>
                
                {/* Product details */}
                <div className="text-xs text-dark-green-6 mb-2">
                  {item.size && (
                    <span className="mr-1">Taille: {item.size}</span>
                  )}
                  {item.brand && (
                    <span className="mr-1">• {item.brandDisplayName || item.brand}</span>
                  )}
                </div>

                {/* Price tags */}
                <div className="flex flex-wrap gap-1 mb-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                    <Icon name="tag" size="xs" className="mr-1 text-blue-600" />
                    {formatPrice(item.price)} / unité
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                    <Icon name="checkcircle" size="xs" className="mr-1 text-green-600" />
                    Total: {formatPrice(item.price * item.quantity)}
                  </span>
                </div>

                {/* Quantity controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDecreaseQuantity(item._id || item.id)}
                      className="w-6 h-6 bg-logo-lime/10 rounded-full flex items-center justify-center hover:bg-logo-lime/20 transition-colors border border-logo-lime/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label={t('decrease_quantity')}
                      disabled={item.quantity <= 1 || isLoading}
                    >
                      <Icon name="minus" size="xs" className={`${item.quantity <= 1 || isLoading ? 'text-dark-green-7/40' : 'text-dark-green-7'}`} />
                    </button>
                    <span className="text-xs font-medium min-w-[20px] text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleIncreaseQuantity(item._id || item.id)}
                      className="w-6 h-6 bg-logo-lime/10 rounded-full flex items-center justify-center hover:bg-logo-lime/20 transition-colors border border-logo-lime/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label={t('increase_quantity')}
                      disabled={isLoading}
                    >
                      <Icon name="plus" size="xs" className={`${isLoading ? 'text-dark-green-7/40' : 'text-dark-green-7'}`} />
                    </button>
                  </div>
                  <span className="text-xs text-dark-green-6">Qté: {item.quantity}</span>
                </div>
              </div>
            </div>
          ))}
          <div className="h-4"></div>
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
      withCaret={!isMobile}
      isOpen={isOpen}
      onClick={onToggle ? () => onToggle(!isOpen) : undefined}
      className={!isMobile && cartData.itemsCount > 0 ? 'icon-text-separator' : ''}
      icon={
        cartData.loading && cartData.items.length === 0 ? (
          <div className="flex items-center justify-center gap-2">
            <Icon name="shoppingCart" weight="duotone" size={isMobile ? "md" : "md"} />
            <div className="w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin"></div>
          </div>
        ) : (
          <div className="flex items-center justify-center relative">
            <Icon name="shoppingCart" weight="duotone" size={isMobile ? "md" : "md"} />
            {isMobile && cartData.itemsCount > 0 && (
              <span className={`absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full ${itemAdded ? 'animate-bounce' : ''}`}>
                {cartData.itemsCount > 9 ? '9+' : cartData.itemsCount}
              </span>
            )}
          </div>
        )
      }
    >
      {!isMobile && cartData.itemsCount > 0 && (
        `${cartData.itemsCount > 9 ? '9+' : cartData.itemsCount} ${cartData.itemsCount === 1 ? t('item') : t('items')}`
      )}
    </MenuTrigger>
  );

  // Create header element
  const headerElement = (
    <div className="flex items-center gap-3 py-3 bg-gradient-to-br from-amber-50 to-amber-100/70 border-b border-logo-lime/20">
      <div className="w-10 h-10 rounded-full bg-logo-lime/20 border border-logo-lime/40 flex items-center justify-center ml-3">
        <Icon name="shoppingCart" weight="duotone" size="lg" className="text-dark-green-7" />
      </div>
      <h3 className="text-lg font-medium text-dark-green-7 truncate max-w-[220px]">{t('cart')}</h3>
    </div>
  );

  return (
    <Menu
      variant="dropdown"
      isMobile={isMobile}
      isNavbarMobile={isNavbarMobile}
      glass={true}
      rounded="xl"
      onClose={onClose}
      onToggle={onToggle}
      trigger={triggerElement}
      header={headerElement}
      headerPadding="none"
      containerClassName="w-96"
      position={isNavbarMobile ? "right" : "right"}
      menuId={`cart-menu-${isNavbarMobile ? 'mobile' : 'desktop'}`}
      isOpen={isOpen}
      bodyPadding="none"
    >
      {renderContent()}
    </Menu>
  );
});

export default CartMenu;