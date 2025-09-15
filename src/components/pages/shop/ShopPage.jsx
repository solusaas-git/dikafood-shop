import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Page from '@components/ui/layout/Page';
import ContentContainer from '@components/ui/layout/ContentContainer';

// Services
import { api } from '@/services/api';

// Hooks
// import useApi from '@/hooks/useApi';
import useCart from '@/hooks/useCart';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContextNew';
import { usePendingAction } from '@/contexts/PendingActionContext';
import { useLoading } from '@/contexts/LoadingContext';

// Components
import ProductCard from '@/components/ui/product/ProductCard';
import LoadingSpinner from '@/components/ui/loading/LoadingSpinner';
import PageLoader from '@components/ui/loading/PageLoader';
import Icon from '@/components/ui/icons/Icon';
// Checkout-related imports removed - functionality disabled until backend implementation
import CheckoutDisabledModal from '@/components/ui/modals/CheckoutDisabledModal';
import HeroProductCard from '@/components/ui/product/HeroProductCard';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

// Utils
import { scrollToCatalog } from '@/utils/scrollUtils';
import { eventBus, EVENTS, cartEvents } from '@/utils/eventBus';
import { getProductImageUrlById } from '@/services/api';

const PRODUCTS_PER_PAGE = 12;

function AsyncImage({ imageId, imageUrl, alt, ...props }) {
  const [src, setSrc] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  
  React.useEffect(() => {
    let mounted = true;
    setLoading(true);
    
    // If we have a direct imageUrl, use it
    if (imageUrl) {
      if (mounted) {
        setSrc(imageUrl);
        setLoading(false);
      }
      return;
    }
    
    // Otherwise, try to get the URL by ID (legacy support)
    if (imageId) {
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
  }, [imageId, imageUrl]);
  
  if (loading) {
    return <div className="bg-gray-100 w-full h-full flex items-center justify-center text-gray-400">Loading...</div>;
  }
  
  if (!src) {
    return <div className="bg-gray-100 w-full h-full flex items-center justify-center text-gray-400">No Image</div>;
  }
  
  return <img src={src} alt={alt} {...props} className={`w-full h-full object-contain ${props.className || ''}`} />;
}


// Custom ShopProductCard component with lime green overlay
const ShopProductCard = ({
  product,
  activeVariant,
  onVariantChange,
  displayVariantSelector = true,
  onShowCheckoutDisabled,
  ...props
}) => {
  // const { addToCart, isInCart, cart } = useCart();
  const { addItem, getItemInCart, cart, loading: cartLoading } = useCart();
  const { formatPrice } = useCurrency();
  const { isLoggedIn, isGuest } = useAuth();
  const { success } = useNotification(); // Temporarily disable error to debug
  const { setPendingDirectPurchase, executePendingAction } = usePendingAction();

  // Helper function to get brand icon
  const getBrandIcon = (brandName) => {
    const brand = typeof brandName === 'object' ? brandName.name : brandName;
    const brandLower = brand?.toLowerCase();

    switch (brandLower) {
      case 'dika':
        return 'star'; // Premium/quality symbol
      case 'biladi':
        return 'house'; // Local/traditional symbol
      case 'chourouk':
        return 'sunhorizon'; // Sunrise/dawn symbol (chourouk means sunrise)
      case 'nouarti':
        return 'plant'; // Natural/floral symbol
      case 'ouedfes':
      case 'oued fes':
        return 'drop'; // Water/river symbol (oued means river)
      default:
        return 'tree'; // Default natural symbol (tree is available)
    }
  };

  // Helper function to format price with smaller decimal part
  const formatPriceWithSmallDecimals = (price) => {
    const formatted = formatPrice(price);
    // Try different decimal separators (. or ,)
    let parts = formatted.split('.');
    if (parts.length === 1) {
      parts = formatted.split(',');
    }

    if (parts.length === 2) {
      return (
        <span>
          {parts[0]}<span className="text-xs">.{parts[1]}</span>
        </span>
      );
    }

    // If no decimal part, add .00 in smaller font
    if (formatted.includes('DH') || formatted.includes('€') || formatted.includes('$')) {
      const currencyMatch = formatted.match(/^(\d+)\s*(.+)$/);
      if (currencyMatch) {
        return (
          <span>
            {currencyMatch[1]}<span className="text-xs">.00</span> {currencyMatch[2]}
          </span>
        );
      }
    }

    return formatted;
  };
  // Add local state to track if this specific card's product has been added to cart
  const [addedToCart, setAddedToCart] = useState(false);
  // Add local loading state for this card
  const [isCardLoading, setIsCardLoading] = useState(false);
  // Add state to control the success display duration
  const [showSuccess, setShowSuccess] = useState(false);
  // Add state for direct purchase loading
  const [isDirectPurchaseLoading, setIsDirectPurchaseLoading] = useState(false);

  // Get product prices (promotional and regular)
  const regularPrice = activeVariant?.price || product.unitPrice || product.price || 0;
  const promotionalPrice = activeVariant?.promotionalPrice;
  const hasPromotion = promotionalPrice && promotionalPrice > 0 && promotionalPrice < regularPrice;
  const displayPrice = hasPromotion ? promotionalPrice : regularPrice;

  console.log(product)

  // Check if this product variant is in cart
  // const productInCart = isInCart(product._id || product.id, activeVariant?.id);
  const productInCart = !!getItemInCart(activeVariant._id);
  // Update local state when cart changes
  useEffect(() => {
    if (productInCart) {
      setAddedToCart(true);
      setIsCardLoading(false); // Make sure loading is reset
      setShowSuccess(false); // Reset success state when product is in cart
    }
  }, [productInCart]);

  // Reset loading state when cart loading state changes to false
  useEffect(() => {
    if (!cartLoading && isCardLoading) {
      setIsCardLoading(false);
    }
  }, [cartLoading, isCardLoading]);

  // Prevent event propagation for the add to cart button
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Set local loading state for this card only
    setIsCardLoading(true);

    // Add to cart via context
    addItem({
      product: {
        ...product,
        id: product._id || product.id
      },
      variant: activeVariant,
      quantity: 1
    })
      .then((result) => {
        // Only set as added if the operation was successful
        if (result && result.success) {
          setIsCardLoading(false);
          setShowSuccess(true);
          setAddedToCart(true);

          // Event is now automatically emitted by CartContext

          // Reset to default state after 2 seconds
          setTimeout(() => {
            setShowSuccess(false);
          }, 2000);
        } else {
          // Reset states on error
          setAddedToCart(false);
          setIsCardLoading(false);
          setShowSuccess(false);
        }
      })
      .catch(() => {
        // Reset states on error
        setAddedToCart(false);
        setIsCardLoading(false);
        setShowSuccess(false);
      });
  };

  console.log("===> active product variant:", activeVariant)
  console.log("===> product for cart:", {
    productId: product._id || product.id,
    variantId: activeVariant?._id,
    productName: product.title || product.name,
    fullProduct: product
  })
  
  // Handle direct purchase
  const handleDirectPurchase = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if user is authenticated
    if (isGuest || !isLoggedIn) {
      // Store the pending purchase data
      setPendingDirectPurchase({
        productId: product._id || product.id,
        size: activeVariant?.size || '500ML',
        quantity: 1,
        productName: product.title || product.name,
        productImage: activeVariant?.image || product.image
      });

      // Show auth modal using the global handler
      onShowAuthModal();
      return;
    }

    // Use the global direct purchase handler
    setIsDirectPurchaseLoading(true);
    try {
      await onDirectPurchase({
        productId: product._id || product.id,
        size: activeVariant?.size || '500ML',
        quantity: 1
      });
    } finally {
      setIsDirectPurchaseLoading(false);
    }
  };

  return (
    <div className="relative h-full min-w-[160px] md:min-w-[200px] flex flex-col">
      {/* Card container with ContentContainer-like styling */}
      <div className="h-full flex flex-col rounded-lg md:rounded-xl overflow-hidden border border-logo-lime/30 bg-white transition-all duration-300 hover:border-logo-lime/50">
        {/* Product image container with soft overlay - vertical rectangle */}
        <div className="relative overflow-hidden h-44 sm:h-52 md:h-64 lg:h-72">
          {/* Permanent soft lime green overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-logo-lime/5 to-light-yellow-1/10 z-10"></div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-logo-lime/10 opacity-0 hover:opacity-100 transition-opacity duration-300 z-10"></div>

          {/* Image with padding - show variant-specific image */}
          <div className="absolute inset-0 p-2.5 md:p-4 z-20">
            <AsyncImage
              key={`${product.id}-${activeVariant?._id || activeVariant?.id || activeVariant?.size || 'default'}`}
              imageUrl={
                // Priority: variant imageUrl (from API transformation) -> product image -> product images array
                activeVariant?.imageUrl ||
                product.image ||
                (product.images && product.images[0])
              }
              imageId={activeVariant?.image || (product.images && product.images[0])} // Fallback for legacy
              alt={`${product.title || product.name} - ${activeVariant?.size || ''}`}
            />
          </div>

          {/* Absolutely positioned brand tag */}
          {(product.brand || product.brandName) && (
            <div className="absolute top-1.5 left-1.5 md:top-2 md:left-2 z-30">
              <span className="inline-flex items-center px-1.5 md:px-2 py-0.5 md:py-1 rounded-full text-xs font-medium bg-white/90 text-dark-green-7 border border-logo-lime/25 shadow-sm backdrop-blur-sm">
                <Icon name={getBrandIcon(product.brand || product.brandName)} size="xs" weight="duotone" className="mr-0.5 md:mr-1 text-dark-green-7" />
                <span className="hidden sm:inline">{typeof product.brand === 'object' ? product.brand.name : (product.brand || product.brandName)}</span>
              </span>
            </div>
          )}

          {/* Size variants - only show if displayVariantSelector is true */}
          {displayVariantSelector && product.variants && product.variants.length > 0 && (
            <div className="absolute top-1.5 right-1.5 md:top-2 md:right-2 z-30 flex flex-col gap-1 md:gap-1.5 bg-white/50 p-0.5 md:p-1 rounded-lg backdrop-blur-sm">
              {product.variants.map((variant) => {
                const isActive = activeVariant?.size === variant.size;
                return (
                  <button
                    key={`${product.id}-${variant.id || variant.size}`}
                    className={`
                      min-w-[1.5rem] h-5 md:min-w-[1.75rem] md:h-6 lg:min-w-[2rem] lg:h-7 px-1 md:px-1.5 text-xs rounded-full flex items-center justify-center font-medium transition-all duration-200
                      ${isActive
                        ? 'bg-logo-lime/30 border-logo-lime border text-dark-green-7 shadow-sm'
                        : 'bg-white border-logo-lime/50 border text-dark-green-6 hover:bg-logo-lime/10'}
                    `}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      
                      // Only change the variant in the current card, don't navigate
                      onVariantChange(variant);
                    }}
                  >
                    <span className="whitespace-nowrap">{variant.size}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* If we're in separate variant mode, show a variant badge */}
          {!displayVariantSelector && activeVariant && activeVariant.size && (
            <div className="absolute top-1.5 right-1.5 md:top-2 md:right-2 z-30 bg-white/80 px-1.5 md:px-2 py-0.5 md:py-1 rounded-lg shadow-sm backdrop-blur-sm border border-logo-lime/30">
              <span className="text-xs font-medium text-dark-green-7">{activeVariant.size}</span>
            </div>
          )}
        </div>

        {/* Product content */}
        <div className="flex-grow p-1.5 md:p-2 lg:p-3 min-h-[3.5rem] md:min-h-[4.5rem] lg:min-h-[5rem]">
          {/* Category badge */}
          {product.category && (
            <div className="mb-1.5 md:mb-2">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                <Icon name="tag" size="xs" className="mr-0.5 md:mr-1 text-gray-600" />
                <span className="hidden sm:inline">
                  {product.category === 'olive oil' ? 'Huile d\'olive' :
                    product.category === 'sunflower oil' ? 'Huile de tournesol' :
                      product.category}
                </span>
                <span className="sm:hidden">
                  {product.category === 'olive oil' ? 'Olive' :
                    product.category === 'sunflower oil' ? 'Tournesol' :
                      product.category}
                </span>
              </span>
            </div>
          )}

          {/* Product name */}
          <h3 className="text-dark-green-7 font-normal text-xs md:text-sm leading-tight line-clamp-2">
            {product.title || product.name}
            {!displayVariantSelector && activeVariant && activeVariant.size && (
              <span className="inline-block ml-1 font-medium text-dark-green-7"> - {activeVariant.size}</span>
            )}
          </h3>
        </div>

        {/* Footer with always visible CTA buttons */}
        <div className="border-t bg-gradient-to-br from-light-yellow-1 to-light-yellow-3/70 border-logo-lime/30">
          {/* Price row */}
          <div className="px-2 md:px-3 py-1.5 md:py-2 border-b border-logo-lime/20">
            {hasPromotion ? (
              <div className="flex items-center justify-center gap-1.5 md:gap-2 flex-wrap">
                <span className="font-medium text-xs md:text-sm text-red-600">
                  {formatPriceWithSmallDecimals(displayPrice)}
                </span>
                <span className="text-xs text-gray-500 line-through">
                  {formatPriceWithSmallDecimals(regularPrice)}
                </span>
                <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full font-medium">
                  -{Math.round(((regularPrice - promotionalPrice) / regularPrice) * 100)}%
                </span>
              </div>
            ) : (
              <div className="text-center">
                <span className="font-medium text-xs md:text-sm text-dark-green-7">
                  {formatPriceWithSmallDecimals(displayPrice)}
                </span>
              </div>
            )}
          </div>

          {/* Action buttons - always visible */}
          <div className="px-2 md:px-3 py-2 md:py-3">
            <div className="grid grid-cols-2 gap-1.5 md:gap-2 w-full">
              {/* Direct purchase button */}
              <button
                onClick={handleDirectPurchase}
                disabled={isDirectPurchaseLoading}
                className="inline-flex items-center justify-center px-1.5 md:px-2 py-1.5 md:py-2 rounded-lg text-xs font-medium gap-0.5 md:gap-1
                  bg-dark-green-6 text-white border border-dark-green-6 hover:bg-dark-green-7 transition-all duration-200 relative z-40"
                title="Acheter maintenant"
              >
                <Icon name="creditcard" size="xs" className="text-white" />
                {isDirectPurchaseLoading ? (
                  <Icon name="circlenotch" size="xs" className="text-white animate-spin" />
                ) : (
                  <span className="hidden md:inline ml-0.5">Acheter</span>
                )}
              </button>

              {/* Add to cart button */}
              <button
                onClick={handleAddToCart}
                disabled={isCardLoading || showSuccess}
                className={`inline-flex items-center justify-center px-1.5 md:px-2 py-1.5 md:py-2 rounded-lg text-xs font-medium gap-0.5 md:gap-1
              ${showSuccess
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-logo-lime/20 text-dark-green-7 border border-logo-lime/30 hover:bg-logo-lime/30'
                  } transition-all duration-200 relative z-40`}
                title="Ajouter au panier"
              >
                <Icon name="shoppingcart" size="xs" className={`${showSuccess ? 'text-green-700' : 'text-dark-green-7'}`} />
                {isCardLoading ? (
                  <Icon name="circlenotch" size="xs" className={`${showSuccess ? 'text-green-700' : 'text-dark-green-7'} animate-spin`} />
                ) : showSuccess ? (
                  <>
                    <Icon name="check" size="xs" className="text-green-700 ml-0.5" />
                    <span className="hidden md:inline ml-0.5">Ajouté</span>
                  </>
                ) : (
                  <span className="hidden md:inline ml-0.5">Panier</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Clickable overlay for the card excluding footer - removed Link to avoid conflict with onClick */}
      <div
        className="absolute inset-0 bottom-20 z-20 cursor-pointer"
        aria-label={`Voir ${product.title || product.name}`}
        {...props}
      />


    </div>
  );
};

// Shop Hero Section Component
const ShopHero = () => {
  const router = useRouter();

  const handleCatalogClick = () => {
    // Scroll to the products section on the current page
    const productsSection = document.querySelector('[data-section="products"]');
    if (productsSection) {
      productsSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="relative w-full h-80 md:h-96 lg:h-[450px] xl:h-[550px] overflow-hidden pt-16 md:pt-20 lg:pt-28">
      <div className="absolute inset-0">
        {/* Responsive image with srcset */}
        <picture>
          <source
            media="(max-width: 640px)"
            srcSet="/images/shop/shop-hero-mobile.webp"
          />
          <source
            media="(max-width: 1024px)"
            srcSet="/images/shop/shop-hero-tablet.webp"
          />
          <img
            src="/images/shop/shop-hero.webp"
            alt="Huile d'olive artisanale - DikaFood"
            className="w-full h-full object-cover object-[center_30%] md:object-[center_35%]"
            fetchPriority="high"
          />
        </picture>
        {/* Overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-transparent lg:bg-gradient-to-r lg:from-black/75 lg:via-black/40 lg:to-black/20"></div>
      </div>
      <div className="container mx-auto px-4 md:px-6 relative z-20 h-full">
        <div className="flex items-center justify-center h-full">
          {/* Content Section */}
          <div className="max-w-lg pt-2 md:pt-4 lg:pt-0 text-center">
            <span className="inline-flex items-center px-2.5 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium bg-logo-lime/30 text-white border border-logo-lime/40 shadow-sm mb-3 md:mb-4">
              <Icon name="leaf" size="xs" className="md:w-4 md:h-4 mr-1 md:mr-1.5 text-white" />
              Produits locaux
            </span>
            <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-normal mb-4 md:mb-6 text-white drop-shadow-sm">Notre Gamme d'Huiles d'Olive</h1>
            <div className="flex justify-center">
              <button
                onClick={handleCatalogClick}
                className="inline-flex items-center px-5 md:px-6 py-2.5 md:py-3 bg-logo-lime/80 hover:bg-logo-lime text-dark-green-7 rounded-full text-sm md:text-base font-medium transition-colors border border-logo-lime shadow-sm"
              >
                <Icon name="eye" size="xs" className="md:w-5 md:h-5 mr-2" />
                <div className="w-px h-3 md:h-4 bg-dark-green-7/20 mr-2"></div>
                <span className="hidden sm:inline">Voir notre catalogue</span>
                <span className="sm:hidden">Catalogue</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mobile Filter Bar Component
const MobileFilterBar = ({ activeFiltersCount, onToggleMobileFilters, searchQuery, setSearchQuery }) => (
  <div className="flex items-center justify-between w-full p-2.5 md:p-3 bg-white shadow-sm border-b border-logo-lime/20">
    <div className="relative flex-1 mr-2">
      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
        <Icon name="magnifying-glass" size="xs" className="text-dark-green-6" />
      </div>
      <input
        type="text"
        placeholder="Rechercher..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-8 pr-8 py-1.5 w-full border border-logo-lime/30 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-logo-lime/50 bg-white"
      />
      {searchQuery && (
        <button
          className="absolute inset-y-0 right-0 pr-2.5 flex items-center"
          onClick={() => setSearchQuery('')}
        >
          <Icon name="x" size="xs" className="text-dark-green-6" />
        </button>
      )}
    </div>
    <button
      className="flex items-center px-2.5 py-1.5 bg-logo-lime/15 rounded-full text-xs font-medium text-dark-green-7 border border-logo-lime/30"
      onClick={onToggleMobileFilters}
    >
      <Icon name="funnel" size="xs" className="mr-1" />
      <span>Filtres</span>
      {activeFiltersCount > 0 && (
        <span className="ml-1 flex items-center justify-center h-4 w-4 bg-logo-lime/30 text-dark-green-7 text-xs rounded-full border border-logo-lime/30">
          {activeFiltersCount}
        </span>
      )}
    </button>
  </div>
);

// Mobile Filter Header Component
const MobileFilterHeader = ({ activeFiltersCount, onCloseMobileFilters }) => (
  <div className="flex items-center justify-between p-4 border-b border-logo-lime/30 bg-gradient-to-r from-logo-lime/20 to-logo-lime/5 shadow-sm">
    <h3 className="text-lg font-medium text-dark-green-7 flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-logo-lime/15 border border-logo-lime/30 flex items-center justify-center">
        <Icon name="list" size="md" className="text-dark-green-7" />
      </div>
      <span>Filtres</span>
      {activeFiltersCount > 0 && (
        <span className="ml-1 flex items-center justify-center h-6 w-6 bg-logo-lime/30 text-dark-green-7 text-xs rounded-full border border-logo-lime/30">
          {activeFiltersCount}
        </span>
      )}
    </h3>
    <button
      className="p-1.5 rounded-full hover:bg-logo-lime/20 text-dark-green-7 border border-logo-lime/30"
      onClick={onCloseMobileFilters}
      aria-label="Fermer les filtres"
    >
      <Icon name="x" size="md" />
    </button>
  </div>
);

// Price Range Slider Component
const PriceRangeSlider = ({ priceRange, setPriceRange, minPrice, maxPrice }) => {
  const { formatPrice } = useCurrency();
  // Local UI state for slider position
  const [localPriceRange, setLocalPriceRange] = useState(priceRange);

  // Update local state when parent state changes
  useEffect(() => {
    setLocalPriceRange(priceRange);
  }, [priceRange]);

  // Handle slider changes without immediately updating parent state
  const handleRangeChange = (index, value) => {
    const newRange = [...localPriceRange];
    newRange[index] = value;
    setLocalPriceRange(newRange);
  };

  // Apply the filter when user stops dragging
  const handleRangeChangeComplete = () => {
    setPriceRange(localPriceRange);
  };

  return (
    <div className="mt-4 px-4">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-dark-green-7">{formatPrice(localPriceRange[0])}</span>
        <span className="text-sm font-medium text-dark-green-7">{formatPrice(localPriceRange[1])}</span>
      </div>
      <div className="relative h-2 bg-gray-100 rounded-full border border-gray-200">
        {/* Track */}
        <div
          className="absolute h-full bg-gradient-to-r from-logo-lime/30 to-logo-lime/20 rounded-full border border-logo-lime/30"
          style={{
            left: `${((localPriceRange[0] - minPrice) / (maxPrice - minPrice)) * 100}%`,
            right: `${100 - ((localPriceRange[1] - minPrice) / (maxPrice - minPrice)) * 100}%`
          }}
        ></div>

        {/* Min handle */}
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          value={localPriceRange[0]}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (value < localPriceRange[1]) {
              handleRangeChange(0, value);
            }
          }}
          onMouseUp={handleRangeChangeComplete}
          onTouchEnd={handleRangeChangeComplete}
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-auto cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-logo-lime [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:mt-[-7px] [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-logo-lime [&::-moz-range-thumb]:shadow-sm [&::-moz-range-thumb]:cursor-pointer focus:[&::-webkit-slider-thumb]:shadow-[0_0_0_3px_rgba(140,198,63,0.3)] focus:[&::-moz-range-thumb]:shadow-[0_0_0_3px_rgba(140,198,63,0.3)]"
          style={{
            WebkitAppearance: 'none',
          }}
        />

        {/* Max handle */}
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          value={localPriceRange[1]}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (value > localPriceRange[0]) {
              handleRangeChange(1, value);
            }
          }}
          onMouseUp={handleRangeChangeComplete}
          onTouchEnd={handleRangeChangeComplete}
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-auto cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-logo-lime [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:mt-[-7px] [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-logo-lime [&::-moz-range-thumb]:shadow-sm [&::-moz-range-thumb]:cursor-pointer focus:[&::-webkit-slider-thumb]:shadow-[0_0_0_3px_rgba(140,198,63,0.3)] focus:[&::-moz-range-thumb]:shadow-[0_0_0_3px_rgba(140,198,63,0.3)]"
          style={{
            WebkitAppearance: 'none',
          }}
        />
      </div>
    </div>
  );
};

// Volume conversion helper functions
const formatVolumeDisplay = (volumeInMl) => {
  if (volumeInMl >= 1000) {
    const liters = volumeInMl / 1000;
    return liters % 1 === 0 ? `${liters}L` : `${liters.toFixed(1)}L`;
  }
  return `${volumeInMl}ml`;
};

const getVolumeSteps = (minVolume, maxVolume) => {
  // Create meaningful steps for the volume slider
  const steps = [];

  // Add ml steps from 100ml to 1000ml
  for (let i = 100; i <= 1000; i += 100) {
    if (i >= minVolume && i <= maxVolume) {
      steps.push(i);
    }
  }

  // Add L steps from 1L to 30L
  for (let i = 1; i <= 30; i++) {
    const mlValue = i * 1000;
    if (mlValue >= minVolume && mlValue <= maxVolume) {
      steps.push(mlValue);
    }
  }

  return steps.sort((a, b) => a - b);
};

// Volume Range Slider Component
const VolumeRangeSlider = ({ volumeRange, setVolumeRange, minVolume, maxVolume }) => {
  // Local UI state for slider position
  const [localVolumeRange, setLocalVolumeRange] = useState(volumeRange);

  // Update local state when parent state changes
  useEffect(() => {
    setLocalVolumeRange(volumeRange);
  }, [volumeRange]);

  // Handle slider changes without immediately updating parent state
  const handleRangeChange = (index, value) => {
    const newRange = [...localVolumeRange];
    newRange[index] = value;
    setLocalVolumeRange(newRange);
  };

  // Apply the filter when user stops dragging
  const handleRangeChangeComplete = () => {
    setVolumeRange(localVolumeRange);
  };



  return (
    <div className="mt-4 px-4">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-dark-green-7">{formatVolumeDisplay(localVolumeRange[0])}</span>
        <span className="text-sm font-medium text-dark-green-7">{formatVolumeDisplay(localVolumeRange[1])}</span>
      </div>

      <div className="relative h-2 bg-gray-100 rounded-full border border-gray-200">
        {/* Track */}
        <div
          className="absolute h-full bg-gradient-to-r from-logo-lime/30 to-logo-lime/20 rounded-full border border-logo-lime/30"
          style={{
            left: `${((localVolumeRange[0] - minVolume) / (maxVolume - minVolume)) * 100}%`,
            right: `${100 - ((localVolumeRange[1] - minVolume) / (maxVolume - minVolume)) * 100}%`
          }}
        ></div>

        {/* Min handle */}
        <input
          type="range"
          min={minVolume}
          max={maxVolume}
          step={100} // 100ml steps for better precision
          value={localVolumeRange[0]}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (value < localVolumeRange[1]) {
              handleRangeChange(0, value);
            }
          }}
          onMouseUp={handleRangeChangeComplete}
          onTouchEnd={handleRangeChangeComplete}
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-auto cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-logo-lime [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:mt-[-7px] [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-logo-lime [&::-moz-range-thumb]:shadow-sm [&::-moz-range-thumb]:cursor-pointer focus:[&::-webkit-slider-thumb]:shadow-[0_0_0_3px_rgba(140,198,63,0.3)] focus:[&::-moz-range-thumb]:shadow-[0_0_0_3px_rgba(140,198,63,0.3)]"
          style={{
            WebkitAppearance: 'none',
          }}
        />

        {/* Max handle */}
        <input
          type="range"
          min={minVolume}
          max={maxVolume}
          step={100} // 100ml steps for better precision
          value={localVolumeRange[1]}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (value > localVolumeRange[0]) {
              handleRangeChange(1, value);
            }
          }}
          onMouseUp={handleRangeChangeComplete}
          onTouchEnd={handleRangeChangeComplete}
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-auto cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-logo-lime [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:mt-[-7px] [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-logo-lime [&::-moz-range-thumb]:shadow-sm [&::-moz-range-thumb]:cursor-pointer focus:[&::-webkit-slider-thumb]:shadow-[0_0_0_3px_rgba(140,198,63,0.3)] focus:[&::-moz-range-thumb]:shadow-[0_0_0_3px_rgba(140,198,63,0.3)]"
          style={{
            WebkitAppearance: 'none',
          }}
        />
      </div>

      {/* Quick preset buttons */}
      <div className="mt-3 flex flex-wrap gap-1">
        <button
          onClick={() => {
            setLocalVolumeRange([100, 1000]);
            setVolumeRange([100, 1000]);
          }}
          className="px-2 py-1 text-xs bg-gray-100 hover:bg-logo-lime/20 text-gray-700 rounded-full border border-gray-200 hover:border-logo-lime/30 transition-colors"
        >
          Petits (≤1L)
        </button>
        <button
          onClick={() => {
            setLocalVolumeRange([1000, 5000]);
            setVolumeRange([1000, 5000]);
          }}
          className="px-2 py-1 text-xs bg-gray-100 hover:bg-logo-lime/20 text-gray-700 rounded-full border border-gray-200 hover:border-logo-lime/30 transition-colors"
        >
          Moyens (1-5L)
        </button>
        <button
          onClick={() => {
            setLocalVolumeRange([5000, 25000]);
            setVolumeRange([5000, 25000]);
          }}
          className="px-2 py-1 text-xs bg-gray-100 hover:bg-logo-lime/20 text-gray-700 rounded-full border border-gray-200 hover:border-logo-lime/30 transition-colors"
        >
          Grands (5L+)
        </button>
        <button
          onClick={() => {
            setLocalVolumeRange([100, 25000]);
            setVolumeRange([100, 25000]);
          }}
          className="px-2 py-1 text-xs bg-gray-100 hover:bg-logo-lime/20 text-gray-700 rounded-full border border-gray-200 hover:border-logo-lime/30 transition-colors"
        >
          Tous
        </button>
      </div>
    </div>
  );
};

// Category Filter Component
const CategoryFilter = ({ categories, selectedCategory, onCategoryChange, categoryCounts }) => (
  <div className="mt-4">
    <h4 className="font-medium mb-2 px-4">Catégories</h4>
    <div className="space-y-2">
      <button
        className={`w-full text-left px-4 py-2 ${!selectedCategory ? 'bg-primary-50 text-primary-700 font-medium' : ''}`}
        onClick={() => onCategoryChange(null)}
      >
        Tous les produits
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          className={`py-2 px-3 text-sm rounded-full border transition-all duration-200 flex items-center justify-center gap-1 whitespace-nowrap ${selectedCategory === category.id ? 'bg-logo-lime/30 border-logo-lime text-dark-green-7 font-medium shadow-sm' : 'bg-white border-logo-lime/30 text-dark-green-6 hover:bg-logo-lime/10'
            }`}
          onClick={() => onCategoryChange(category.id)}
        >
          {selectedCategory === category.id && (
            <Icon name="check" size="xs" className="text-dark-green-7" />
          )}
          <span className="truncate">{category.name}</span>
          {categoryCounts[category.id] > 0 && (
            <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded-full ml-1 flex-shrink-0">
              {categoryCounts[category.id]}
            </span>
          )}
        </button>
      ))}
    </div>
  </div>
);

// Sort Options Component
const SortOptions = ({ currentSort, onSortChange, sortOptions }) => (
  <div className="relative">
    <select
      value={currentSort}
      onChange={(e) => onSortChange(e.target.value)}
      className="appearance-none w-full bg-white border border-gray-200 rounded-full py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-logo-lime focus:border-logo-lime"
    >
      {sortOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
      <Icon name="caretup" size="xs" />
    </div>
  </div>
);

// Main Shop Component
const ShopPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { showLoading } = useLoading();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { success, error: showError, info } = useNotification();

  // State for filters and sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [volumeRange, setVolumeRange] = useState([100, 25000]); // 100ml to 25L - more reasonable range
  const [currentSort, setCurrentSort] = useState('featured');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Product data state
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [activeVariants, setActiveVariants] = useState({});
  const [allProducts, setAllProducts] = useState([]); // Store all fetched products for frontend filtering

  // Dynamic categories and brands from API
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // Modal states
  const [showCheckoutDisabledModal, setShowCheckoutDisabledModal] = useState(false);

  // Load categories, brands, and initial products in parallel on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        
        // Load categories, brands, and products in parallel for better performance
        const [categoriesResponse, brandsResponse, productsResponse] = await Promise.all([
          api.getCategories(),
          api.getBrands(),
          api.getProducts({ sortBy: 'featured', sortDirection: 'desc' }) // Load featured products first
        ]);

        // Set categories with proper mapping
        if (categoriesResponse && categoriesResponse.success && categoriesResponse.data) {
          const mappedCategories = categoriesResponse.data.map(cat => ({
            id: cat.name,
            name: cat.name === 'olive oil' ? 'Huile d\'olive' :
              cat.name === 'sunflower oil' ? 'Huile de tournesol' :
                cat.name,
            productCount: cat.productCount || 0
          }));

          setCategories(mappedCategories);
        }

        // Set brands with proper mapping and filtering
        if (brandsResponse && brandsResponse.success && brandsResponse.data && Array.isArray(brandsResponse.data)) {
          
          const validBrands = brandsResponse.data
            .filter(brand =>
              brand.name &&
              brand.name !== 'olive oil' &&
              brand.name !== 'sunflower oil' &&
              brand.name.trim() !== ''
            )
            .map(brand => ({
              id: brand.id || brand.name,
              name: brand.displayName || brand.name,
              logo: brand.logo, // Keep the logo object from API
              productCount: brand.productCount || 0
            }));


          // If no valid brands found, use default brands
          if (validBrands.length === 0) {
            const fallbackBrands = [
              { id: 'dika', name: 'Dika', productCount: 0 },
              { id: 'biladi', name: 'Biladi', productCount: 0 },
              { id: 'chourouk', name: 'Chourouk', productCount: 0 },
              { id: 'ouedfes', name: 'Oued Fès', productCount: 0 },
              { id: 'nouarti', name: 'Nouarti', productCount: 0 }
            ];
            setBrands(fallbackBrands);
          } else {
            setBrands(validBrands);
          }
        } else {
          setBrands([]);
        }

        // Set initial products
        if (productsResponse && productsResponse.success && Array.isArray(productsResponse.data.products)) {
          setAllProducts(productsResponse.data.products);
        } else {
          setAllProducts([]);
        }

      } catch (error) {
        console.error('Failed to load initial data:', error);
        
        // Fallback to hardcoded values
        const fallbackCategories = [
          { id: 'olive oil', name: 'Huile d\'olive', productCount: 0 },
          { id: 'sunflower oil', name: 'Huile de tournesol', productCount: 0 }
        ];
        const fallbackBrands = [
          { id: 'dika', name: 'Dika', productCount: 0 },
          { id: 'biladi', name: 'Biladi', productCount: 0 },
          { id: 'chourouk', name: 'Chourouk', productCount: 0 },
          { id: 'ouedfes', name: 'Oued Fès', productCount: 0 },
          { id: 'nouarti', name: 'Nouarti', productCount: 0 }
        ];

        setCategories(fallbackCategories);
        setBrands(fallbackBrands);
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialData();
  }, []);

  // Sort options
  const sortOptions = [
    { label: 'Recommandés', value: 'featured' },
    { label: 'Prix croissant', value: 'price_asc' },
    { label: 'Prix décroissant', value: 'price_desc' },
    { label: 'Volume croissant', value: 'volume_asc' },
    { label: 'Volume décroissant', value: 'volume_desc' }
  ];

  // Apply frontend filters whenever allProducts, selectedCategories, or selectedBrands change
  useEffect(() => {
    if (allProducts.length === 0) {
      setProducts([]);
      return;
    }

    let filtered = [...allProducts];

    // Apply category filter (client-side filtering for multiple categories)
    if (selectedCategories.length > 1) {
      filtered = filtered.filter(product => {
        // Check if product.category matches any selected category
        const productCategory = typeof product.category === 'object'
          ? product.category.id
          : product.category;

        return selectedCategories.includes(productCategory);
      });
    }

    // Apply brand filter (client-side filtering for multiple brands)
    if (selectedBrands.length > 1) {
      filtered = filtered.filter(product => {
        // Check if product.brand matches any selected brand
        const productBrand = typeof product.brand === 'object'
          ? product.brand.id
          : product.brand;

        return selectedBrands.includes(productBrand);
      });
    }

    // Expand products to include variants as separate cards (but with variant selectors)
    const expandedProducts = [];
    filtered.forEach((product, productIndex) => {
      if (product.variants && product.variants.length > 0) {
        // Filter variants that match price and volume criteria
        const validVariants = product.variants.filter(variant => {
          if (!variant.size) return false;

          // Extract price and volume information
          const variantPrice = variant.price || product.price || 0;

          // Parse volume from size (assuming format like "250ml" or "1L")
          let variantVolume = 0;
          if (variant.size) {
            const sizeMatch = variant.size.match(/(\d+)/);
            if (sizeMatch && sizeMatch[1]) {
              variantVolume = parseInt(sizeMatch[1]);
              // If it's in liters (e.g., "1L"), convert to ml
              if (variant.size.toLowerCase().includes('l') && !variant.size.toLowerCase().includes('ml') && variantVolume < 100) {
                variantVolume *= 1000;
              }
            }
          }

          // Check if variant passes filters
          const passesVolumeFilter = variantVolume === 0 ||
            (variantVolume >= volumeRange[0] && variantVolume <= volumeRange[1]);
          const passesPriceFilter = variantPrice >= priceRange[0] && variantPrice <= priceRange[1];

          return passesPriceFilter && passesVolumeFilter;
        });

        // Create a separate card for each valid variant
        validVariants.forEach((variant, variantIndex) => {
          // Extract price and volume information for this specific variant
          const variantPrice = variant.price || product.price || 0;

          // Parse volume from size for sorting
          let variantVolume = 0;
          if (variant.size) {
            const sizeMatch = variant.size.match(/(\d+)/);
            if (sizeMatch && sizeMatch[1]) {
              variantVolume = parseInt(sizeMatch[1]);
              // If it's in liters (e.g., "1L"), convert to ml
              if (variant.size.toLowerCase().includes('l') && !variant.size.toLowerCase().includes('ml') && variantVolume < 100) {
                variantVolume *= 1000;
              }
            }
          }

          const expandedProduct = {
            ...product,
            variants: product.variants, // Keep ALL variants for the selector
            activeVariant: variant, // This specific variant is active for this card
            displayVariantSelector: true, // Enable variant selector on each card
            _id: product._id || product.id, // Use the actual product MongoDB ID
            id: `${product._id || product.id}-${variant._id || variant.size}`, // Create a unique display ID per card
            sortablePrice: variantPrice,
            sortableVolume: variantVolume
          };

          expandedProducts.push(expandedProduct);
        });
      } else {
        // Products without variants - apply price filter
        const productPrice = product.price || 0;

        if (productPrice >= priceRange[0] && productPrice <= priceRange[1]) {
          expandedProducts.push({
            ...product,
            activeVariant: null,
            displayVariantSelector: false,
            _id: product._id || product.id, // Use the actual product MongoDB ID
            id: product._id || product.id,
            sortablePrice: productPrice,
            sortableVolume: 0
          });
        }
      }
    });

    // Apply frontend sorting
    if (currentSort) {
      expandedProducts.sort((a, b) => {
        switch (currentSort) {
          case 'price_asc':
            return a.sortablePrice - b.sortablePrice;
          case 'price_desc':
            return b.sortablePrice - a.sortablePrice;
          case 'volume_asc':
            return a.sortableVolume - b.sortableVolume;
          case 'volume_desc':
            return b.sortableVolume - a.sortableVolume;
          default:
            return 0; // Default sorting (featured)
        }
      });
    }

    setProducts(expandedProducts);

    setTotalProducts(expandedProducts.length);
  }, [allProducts, selectedCategories, selectedBrands, currentSort, priceRange, volumeRange]);

  // Handle variant change
  const handleVariantChange = (productId, variant) => {
    setActiveVariants(prev => ({
      ...prev,
      [productId]: variant
    }));
  };

  // Helper functions for sorting
  const getSortField = (sortValue) => {
    switch (sortValue) {
      case 'price_asc':
      case 'price_desc':
        return 'price';
      case 'volume_asc':
      case 'volume_desc':
        return 'volume';
      default:
        // Don't send a sortBy parameter for featured, newest, or popular
        return null;
    }
  };

  const getSortDirection = (sortValue) => {
    return sortValue.includes('_asc') ? 'asc' : 'desc';
  };

  useEffect(() => {
    // Skip loading on initial mount since loadInitialData handles it
    if (!searchQuery && selectedCategories.length === 0 && selectedBrands.length === 0 && currentSort === 'featured') {
      return;
    }
    
    // Build params for API call
    const params = {};
    if (searchQuery) params.q = searchQuery;
    if (selectedCategories.length === 1) params.category = selectedCategories[0];
    if (selectedBrands.length === 1) params.brand = selectedBrands[0];
    if (currentSort && getSortField(currentSort)) {
      params.sortBy = getSortField(currentSort);
      params.sortDirection = getSortDirection(currentSort);
    }

    let isMounted = true;
    setLoading(true);

    api.getProducts(params)
      .then(response => {
        if (isMounted && response && response.success && Array.isArray(response.data.products)) {
          setAllProducts(response.data.products);
        } else if (isMounted) {
          setAllProducts([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load products:', error);
        if (isMounted) setAllProducts([]);
        setLoading(false);
      });

    return () => { isMounted = false; };
  }, [searchQuery, currentSort, selectedCategories, selectedBrands]);

  // Handle category toggle
  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  // Handle brand toggle
  const handleBrandToggle = (brandId) => {
    setSelectedBrands(prev => {
      if (prev.includes(brandId)) {
        return prev.filter(id => id !== brandId);
      } else {
        return [...prev, brandId];
      }
    });
  };

  // Handle sort change
  const handleSortChange = (value) => {
    setCurrentSort(value);
  };

  // Calculate variant counts for categories and brands based on current products
  const calculateVariantCounts = () => {
    const categoryCounts = {};
    const brandCounts = {};

    allProducts.forEach(product => {
      const variantCount = product.variants ? product.variants.length : 1;

      // Count variants by category
      const categoryId = product.category;
      if (categoryId) {
        categoryCounts[categoryId] = (categoryCounts[categoryId] || 0) + variantCount;
      }

      // Count variants by brand
      const brandId = product.brand;
      if (brandId) {
        brandCounts[brandId] = (brandCounts[brandId] || 0) + variantCount;
      }
    });

    return { categoryCounts, brandCounts };
  };

  const { categoryCounts, brandCounts } = calculateVariantCounts();

  // Count active filters
  const activeFiltersCount = () => {
    let count = 0;
    if (searchQuery) count++;
    if (selectedCategories.length > 0) count++;
    if (selectedBrands.length > 0) count++;
    if (priceRange[0] > 0 || priceRange[1] < 1000) count++;
    if (volumeRange[0] > 100 || volumeRange[1] < 25000) count++;
    return count;
  };

  // Reset filters
  const resetFilters = () => {
    // Reset all filter states
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSearchQuery('');
    setPriceRange([0, 1000]);
    setVolumeRange([100, 25000]);
    setCurrentSort('featured');

    // Removed fetchProducts call because it is not defined
    // setTimeout(() => fetchProducts(), 0);
  };

  // Removed modal handlers - checkout functionality disabled

  // Show checkout disabled modal
  const handleShowCheckoutDisabled = () => {
    setShowCheckoutDisabledModal(true);
  };

  return (
    <Page
      title="Boutique"
      description="Découvrez notre sélection de produits frais et locaux"
      canonicalUrl="/shop"
      backgroundClass="bg-gradient-to-br from-lime-50/50 to-light-yellow-1/30"
    >
      {/* Shop Hero Section */}
      <ShopHero />

      {/* Mobile Filter Bar (visible on mobile only) */}
      <div className="lg:hidden">
        <MobileFilterBar
          activeFiltersCount={activeFiltersCount()}
          onToggleMobileFilters={() => setMobileFiltersOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6 justify-center">
          {/* Sidebar Filters (desktop) */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <ContentContainer
              title={
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-logo-lime/15 border border-logo-lime/30 flex items-center justify-center">
                    <Icon name="funnel" size="md" className="text-dark-green-7" />
                  </div>
                  <span>Filtres</span>
                </div>
              }
              headerVariant="lime"
              headerClassName="bg-gradient-to-r from-logo-lime/20 to-logo-lime/5 border-b border-logo-lime/30 shadow-sm"
              bodyClassName="p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-dark-green-7 font-medium">
                  {totalProducts} variantes trouvées
                </p>
                {activeFiltersCount() > 0 && (
                  <button
                    onClick={resetFilters}
                    className="text-sm text-dark-green-7 hover:text-dark-green-6 flex items-center bg-logo-lime/15 hover:bg-logo-lime/25 px-2 py-1 rounded-full transition-colors border border-logo-lime/25"
                  >
                    <Icon name="arrowclockwise" size="xs" className="mr-1" />
                    Réinitialiser
                  </button>
                )}
              </div>

              {/* Search Input */}
              <div className="mb-6">
                <label htmlFor="desktop-search" className="block text-sm font-medium mb-2 text-dark-green-7">Rechercher</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon name="magnifying-glass" size="xs" className="text-dark-green-6" />
                  </div>
                  <input
                    id="desktop-search"
                    type="text"
                    placeholder="Rechercher un produit..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-10 py-2 w-full border border-logo-lime/30 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-logo-lime/50 bg-white"
                  />
                  {searchQuery && (
                    <button
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setSearchQuery('')}
                    >
                      <Icon name="x" size="xs" className="text-dark-green-6" />
                    </button>
                  )}
                </div>
              </div>

              {/* Price Range with Sort */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-dark-green-7">Prix</h4>
                  <div className="flex items-center bg-logo-lime/10 rounded-lg border border-logo-lime/20 overflow-hidden">
                    <button
                      onClick={() => handleSortChange('price_asc')}
                      className={`p-1.5 transition-all ${currentSort === 'price_asc' ? 'bg-logo-lime/30 text-dark-green-7' : 'hover:bg-logo-lime/20 text-dark-green-6'}`}
                      title="Prix croissant"
                    >
                      <Icon name="caretup" size="xs" className={currentSort === 'price_asc' ? 'text-dark-green-7' : 'text-dark-green-6'} />
                    </button>
                    <div className="w-px h-4 bg-logo-lime/20"></div>
                    <button
                      onClick={() => handleSortChange('price_desc')}
                      className={`p-1.5 transition-all ${currentSort === 'price_desc' ? 'bg-logo-lime/30 text-dark-green-7' : 'hover:bg-logo-lime/20 text-dark-green-6'}`}
                      title="Prix décroissant"
                    >
                      <Icon name="caretdown" size="xs" className={currentSort === 'price_desc' ? 'text-dark-green-7' : 'text-dark-green-6'} />
                    </button>
                  </div>
                </div>
                <PriceRangeSlider
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  minPrice={0}
                  maxPrice={1000}
                />
              </div>

              {/* Volume Range with Sort */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-dark-green-7">
                    Volume
                    {(volumeRange[0] > 100 || volumeRange[1] < 25000) && (
                      <span className="text-xs text-gray-500 font-normal ml-1">
                        ({formatVolumeDisplay(volumeRange[0])} - {formatVolumeDisplay(volumeRange[1])})
                      </span>
                    )}
                  </h4>
                  <div className="flex items-center bg-logo-lime/10 rounded-lg border border-logo-lime/20 overflow-hidden">
                    <button
                      onClick={() => handleSortChange('volume_asc')}
                      className={`p-1.5 transition-all ${currentSort === 'volume_asc' ? 'bg-logo-lime/30 text-dark-green-7' : 'hover:bg-logo-lime/20 text-dark-green-6'}`}
                      title="Volume croissant"
                    >
                      <Icon name="caretup" size="xs" className={currentSort === 'volume_asc' ? 'text-dark-green-7' : 'text-dark-green-6'} />
                    </button>
                    <div className="w-px h-4 bg-logo-lime/20"></div>
                    <button
                      onClick={() => handleSortChange('volume_desc')}
                      className={`p-1.5 transition-all ${currentSort === 'volume_desc' ? 'bg-logo-lime/30 text-dark-green-7' : 'hover:bg-logo-lime/20 text-dark-green-6'}`}
                      title="Volume décroissant"
                    >
                      <Icon name="caretdown" size="xs" className={currentSort === 'volume_desc' ? 'text-dark-green-7' : 'text-dark-green-6'} />
                    </button>
                  </div>
                </div>
                <VolumeRangeSlider
                  volumeRange={volumeRange}
                  setVolumeRange={setVolumeRange}
                  minVolume={100}
                  maxVolume={25000}
                />
              </div>

              {/* Categories */}
              <div className="border-b border-gray-200">
                <div className="p-4">
                  <h4 className="font-medium mb-3 text-dark-green-7 flex items-center gap-2">
                    <Icon name="tag" size="sm" className="text-dark-green-7" />
                    Catégories
                  </h4>
                  {categories.length === 0 ? (
                    <div className="text-sm text-gray-500 py-2">
                      Chargement des catégories...
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          className={`w-full py-2 px-3 text-sm rounded-lg border transition-all duration-200 flex items-center gap-2 text-left ${selectedCategories.includes(category.id)
                            ? 'bg-logo-lime/30 border-logo-lime text-dark-green-7 font-medium shadow-sm'
                            : 'bg-white border-logo-lime/30 text-dark-green-6 hover:bg-logo-lime/10'
                            }`}
                          onClick={() => handleCategoryToggle(category.id)}
                        >
                          {selectedCategories.includes(category.id) && (
                            <Icon name="check" size="xs" className="text-dark-green-7 flex-shrink-0" />
                          )}
                          <span className="flex-1 text-left">{category.name}</span>
                          {categoryCounts[category.id] > 0 && (
                            <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded-full flex-shrink-0">
                              {categoryCounts[category.id]}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Brands */}
              <div className="p-4">
                <h4 className="font-medium mb-3 text-dark-green-7 flex items-center gap-2">
                  <Icon name="star" size="sm" className="text-dark-green-7" />
                  Marques
                </h4>
                {brands.length === 0 ? (
                  <div className="text-sm text-gray-500 py-2">
                    Chargement des marques...
                  </div>
                ) : (
                  <div className="space-y-2">
                    {brands.map((brand) => (
                      <button
                        key={brand.id}
                        className={`w-full py-3 px-3 text-sm rounded-lg border transition-all duration-200 flex items-center gap-3 text-left ${selectedBrands.includes(brand.id)
                          ? 'bg-logo-lime/30 border-logo-lime text-dark-green-7 font-medium shadow-sm'
                          : 'bg-white border-logo-lime/30 text-dark-green-6 hover:bg-logo-lime/10'
                          }`}
                        onClick={() => handleBrandToggle(brand.id)}
                      >
                        {selectedBrands.includes(brand.id) && (
                          <Icon name="check" size="xs" className="text-dark-green-7 flex-shrink-0" />
                        )}
                        <div className="flex-shrink-0 w-12 h-8 flex items-center justify-center bg-white rounded border border-gray-200">
                          <img 
                            src={brand.logo?.url || '/images/brands/placeholder-logo.svg'} 
                            alt={brand.logo?.alt || `${brand.name} logo`}
                            className="max-w-full max-h-full object-contain"
                            onLoad={() => {
                              console.log(`Brand logo loaded successfully: ${brand.name} - ${brand.logo?.url}`);
                            }}
                            onError={(e) => {
                              console.log(`Brand logo failed to load: ${brand.name} - ${brand.logo?.url}, falling back to placeholder`);
                              e.target.src = '/images/brands/placeholder-logo.svg';
                            }}
                          />
                        </div>
                        <span className="flex-1 text-left text-xs text-gray-600">{brand.name}</span>
                        {brandCounts[brand.id] > 0 && (
                          <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded-full flex-shrink-0">
                            {brandCounts[brand.id]}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </ContentContainer>
          </div>

          {/* Products Container */}
          <div className="flex-1 max-w-4xl" data-section="products">
            <ContentContainer
              title={
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-logo-lime/15 border border-logo-lime/30 flex items-center justify-center">
                    <Icon name="shopping-bag" size="xs" className="md:w-5 md:h-5 text-dark-green-7" />
                  </div>
                  <span className="text-sm md:text-base">Nos produits par variante</span>
                </div>
              }
              headerVariant="lime"
              headerClassName="bg-gradient-to-r from-logo-lime/20 to-logo-lime/5 border-b border-logo-lime/30 shadow-sm"
              bodyClassName="p-3 md:p-6"
            >
              {/* Products Grid */}
              {loading ? (
                <div className="flex justify-center items-center h-48 md:h-64">
                  <LoadingSpinner />
                </div>
              ) : error ? (
                <div className="bg-red-50 p-3 md:p-4 rounded-lg text-red-700 text-sm md:text-base">
                  Une erreur est survenue lors du chargement des produits.
                </div>
              ) : products.length === 0 ? (
                <div className="bg-gray-50 p-6 md:p-8 rounded-lg text-center">
                  <p className="text-base md:text-lg font-medium text-gray-700">Aucun produit trouvé</p>
                  <p className="mt-2 text-gray-500 text-sm md:text-base">Essayez de modifier vos filtres ou votre recherche.</p>
                  <button
                    onClick={resetFilters}
                    className="mt-4 px-3 md:px-4 py-2 bg-logo-lime/20 text-dark-green-7 rounded-lg hover:bg-logo-lime/30 border border-logo-lime/30 text-sm md:text-base"
                  >
                    <Icon name="arrowclockwise" size="xs" className="mr-1" />
                    Réinitialiser
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-x-2 md:gap-x-4 gap-y-4 md:gap-y-6 auto-rows-fr justify-items-center">
                  {products.map((product) => (
                    <ShopProductCard
                      key={product.id}
                      product={product}
                      activeVariant={product.activeVariant}
                      onVariantChange={(variant) => {
                        // Update the active variant for this specific product
                        setProducts(prevProducts => 
                          prevProducts.map(p => 
                            p.id === product.id 
                              ? { ...p, activeVariant: variant }
                              : p
                          )
                        );
                      }}
                      displayVariantSelector={product.displayVariantSelector}
                      onShowCheckoutDisabled={handleShowCheckoutDisabled}
                      onClick={() => {
                        // Navigate to product page with the currently active variant
                        const variantParam = product.activeVariant?._id || product.activeVariant?.id || product.activeVariant?.size || product.activeVariant?.name;
                        const productSlugOrId = product.slug || product._id || product.id;
                        const productUrl = variantParam 
                          ? `/produits/${productSlugOrId}?variant=${encodeURIComponent(variantParam)}`
                          : `/produits/${productSlugOrId}`;
                        
                        console.log('🔄 ShopPage: Navigating to product:', {
                          product: { _id: product._id, name: product.name },
                          activeVariant: product.activeVariant,
                          variantParam: variantParam,
                          productUrl: productUrl
                        });
                        
                        // Show loading before navigation
                        showLoading('Chargement du produit...');
                        router.push(productUrl);
                      }}
                    />
                  ))}
                </div>
              )}
            </ContentContainer>
          </div>
        </div>
      </div>

      {/* Mobile Filters Sidebar */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setMobileFiltersOpen(false)}></div>
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="relative w-screen max-w-sm">
              <div className="h-full flex flex-col bg-white shadow-xl overflow-y-auto mt-16 md:mt-20">
                <div className="flex items-center justify-between p-3 md:p-4 border-b border-logo-lime/30 bg-gradient-to-br from-light-yellow-1 to-light-yellow-3/70">
                  <h3 className="text-base md:text-lg font-medium text-dark-green-7 flex items-center gap-2">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-logo-lime/15 border border-logo-lime/30 flex items-center justify-center">
                      <Icon name="funnel" size="xs" className="md:w-5 md:h-5 text-dark-green-7" />
                    </div>
                    Filtres
                    {activeFiltersCount() > 0 && (
                      <span className="ml-1 md:ml-2 flex items-center justify-center h-5 w-5 md:h-6 md:w-6 bg-logo-lime/30 text-dark-green-7 text-xs rounded-full border border-logo-lime/30">
                        {activeFiltersCount()}
                      </span>
                    )}
                  </h3>
                  <button
                    className="p-1 md:p-1.5 rounded-full hover:bg-logo-lime/20 text-dark-green-7 border border-logo-lime/30"
                    onClick={() => setMobileFiltersOpen(false)}
                    aria-label="Fermer les filtres"
                  >
                    <Icon name="x" size="xs" className="md:w-5 md:h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {/* Results count */}
                  <div className="px-3 md:px-4 py-2 bg-logo-lime/10 border-b border-logo-lime/20">
                    <p className="text-xs md:text-sm text-dark-green-7 font-medium">
                      {totalProducts} variantes trouvées
                    </p>
                  </div>

                  {/* Search Input */}
                  <div className="p-3 md:p-4 border-b border-gray-200">
                    <label htmlFor="mobile-search" className="block text-xs md:text-sm font-medium mb-2 text-dark-green-7">Rechercher</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2.5 md:pl-3 flex items-center pointer-events-none">
                        <Icon name="magnifying-glass" size="xs" className="text-dark-green-6" />
                      </div>
                      <input
                        id="mobile-search"
                        type="text"
                        placeholder="Rechercher un produit..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8 md:pl-10 pr-8 md:pr-10 py-2 md:py-3 w-full border border-logo-lime/30 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-logo-lime/50 bg-white"
                      />
                      {searchQuery && (
                        <button
                          className="absolute inset-y-0 right-0 pr-2.5 md:pr-3 flex items-center"
                          onClick={() => setSearchQuery('')}
                        >
                          <Icon name="x" size="xs" className="text-dark-green-6" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Price Range with Sort */}
                  <div className="border-b border-gray-200">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-dark-green-7">Prix</h4>
                        <div className="flex items-center bg-logo-lime/10 rounded-lg border border-logo-lime/20 overflow-hidden">
                          <button
                            onClick={() => handleSortChange('price_asc')}
                            className={`p-1.5 transition-all ${currentSort === 'price_asc' ? 'bg-logo-lime/30 text-dark-green-7' : 'hover:bg-logo-lime/20 text-dark-green-6'}`}
                            title="Prix croissant"
                          >
                            <Icon name="caretup" size="xs" className={currentSort === 'price_asc' ? 'text-dark-green-7' : 'text-dark-green-6'} />
                          </button>
                          <div className="w-px h-4 bg-logo-lime/20"></div>
                          <button
                            onClick={() => handleSortChange('price_desc')}
                            className={`p-1.5 transition-all ${currentSort === 'price_desc' ? 'bg-logo-lime/30 text-dark-green-7' : 'hover:bg-logo-lime/20 text-dark-green-6'}`}
                            title="Prix décroissant"
                          >
                            <Icon name="caretdown" size="xs" className={currentSort === 'price_desc' ? 'text-dark-green-7' : 'text-dark-green-6'} />
                          </button>
                        </div>
                      </div>
                      <PriceRangeSlider
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                        minPrice={0}
                        maxPrice={1000}
                      />
                    </div>
                  </div>

                  {/* Volume Range with Sort */}
                  <div className="border-b border-gray-200">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-dark-green-7">
                          Volume
                          {(volumeRange[0] > 100 || volumeRange[1] < 25000) && (
                            <span className="text-xs text-gray-500 font-normal ml-1">
                              ({formatVolumeDisplay(volumeRange[0])} - {formatVolumeDisplay(volumeRange[1])})
                            </span>
                          )}
                        </h4>
                        <div className="flex items-center bg-logo-lime/10 rounded-lg border border-logo-lime/20 overflow-hidden">
                          <button
                            onClick={() => handleSortChange('volume_asc')}
                            className={`p-1.5 transition-all ${currentSort === 'volume_asc' ? 'bg-logo-lime/30 text-dark-green-7' : 'hover:bg-logo-lime/20 text-dark-green-6'}`}
                            title="Volume croissant"
                          >
                            <Icon name="caretup" size="xs" className={currentSort === 'volume_asc' ? 'text-dark-green-7' : 'text-dark-green-6'} />
                          </button>
                          <div className="w-px h-4 bg-logo-lime/20"></div>
                          <button
                            onClick={() => handleSortChange('volume_desc')}
                            className={`p-1.5 transition-all ${currentSort === 'volume_desc' ? 'bg-logo-lime/30 text-dark-green-7' : 'hover:bg-logo-lime/20 text-dark-green-6'}`}
                            title="Volume décroissant"
                          >
                            <Icon name="caretdown" size="xs" className={currentSort === 'volume_desc' ? 'text-dark-green-7' : 'text-dark-green-6'} />
                          </button>
                        </div>
                      </div>
                      <VolumeRangeSlider
                        volumeRange={volumeRange}
                        setVolumeRange={setVolumeRange}
                        minVolume={100}
                        maxVolume={25000}
                      />
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="border-b border-gray-200">
                    <div className="p-4">
                      <h4 className="font-medium mb-3 text-dark-green-7 flex items-center gap-2">
                        <Icon name="tag" size="sm" className="text-dark-green-7" />
                        Catégories
                      </h4>
                      {categories.length === 0 ? (
                        <div className="text-sm text-gray-500 py-2">
                          Chargement des catégories...
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {categories.map((category) => (
                            <button
                              key={category.id}
                              className={`w-full py-2 px-3 text-sm rounded-lg border transition-all duration-200 flex items-center gap-2 text-left ${selectedCategories.includes(category.id)
                                ? 'bg-logo-lime/30 border-logo-lime text-dark-green-7 font-medium shadow-sm'
                                : 'bg-white border-logo-lime/30 text-dark-green-6 hover:bg-logo-lime/10'
                                }`}
                              onClick={() => handleCategoryToggle(category.id)}
                            >
                              {selectedCategories.includes(category.id) && (
                                <Icon name="check" size="xs" className="text-dark-green-7 flex-shrink-0" />
                              )}
                              <span className="flex-1 text-left">{category.name}</span>
                              {categoryCounts[category.id] > 0 && (
                                <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded-full flex-shrink-0">
                                  {categoryCounts[category.id]}
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Brands */}
                  <div className="p-4">
                    <h4 className="font-medium mb-3 text-dark-green-7 flex items-center gap-2">
                      <Icon name="star" size="sm" className="text-dark-green-7" />
                      Marques
                    </h4>
                    {brands.length === 0 ? (
                      <div className="text-sm text-gray-500 py-2">
                        Chargement des marques...
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {brands.map((brand) => (
                          <button
                            key={brand.id}
                            className={`w-full py-3 px-3 text-sm rounded-lg border transition-all duration-200 flex items-center gap-3 text-left ${selectedBrands.includes(brand.id)
                              ? 'bg-logo-lime/30 border-logo-lime text-dark-green-7 font-medium shadow-sm'
                              : 'bg-white border-logo-lime/30 text-dark-green-6 hover:bg-logo-lime/10'
                              }`}
                            onClick={() => handleBrandToggle(brand.id)}
                          >
                            {selectedBrands.includes(brand.id) && (
                              <Icon name="check" size="xs" className="text-dark-green-7 flex-shrink-0" />
                            )}
                            <div className="flex-shrink-0 w-12 h-8 flex items-center justify-center bg-white rounded border border-gray-200">
                              <img 
                                src={brand.logo?.url || '/images/brands/placeholder-logo.svg'} 
                                alt={brand.logo?.alt || `${brand.name} logo`}
                                className="max-w-full max-h-full object-contain"
                                onLoad={() => {
                                  console.log(`Brand logo loaded successfully: ${brand.name} - ${brand.logo?.url}`);
                                }}
                                onError={(e) => {
                                  console.log(`Brand logo failed to load: ${brand.name} - ${brand.logo?.url}, falling back to placeholder`);
                                  e.target.src = '/images/brands/placeholder-logo.svg';
                                }}
                              />
                            </div>
                            <span className="flex-1 text-left text-xs text-gray-600">{brand.name}</span>
                            {brandCounts[brand.id] > 0 && (
                              <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded-full flex-shrink-0">
                                {brandCounts[brand.id]}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="border-t border-logo-lime/30 p-3 md:p-4 space-y-2 md:space-y-3 bg-gradient-to-br from-light-yellow-1 to-light-yellow-3/70">
                  <button
                    onClick={resetFilters}
                    className="w-full py-2.5 md:py-3 flex justify-center items-center text-dark-green-7 bg-logo-lime/15 rounded-lg border border-logo-lime/30 hover:bg-logo-lime/25 text-sm md:text-base"
                  >
                    <Icon name="arrowclockwise" size="xs" className="mr-1" />
                    Réinitialiser
                  </button>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="w-full py-2.5 md:py-3 flex justify-center items-center bg-dark-green-7 text-white rounded-lg text-sm md:text-base"
                  >
                    Voir les résultats ({totalProducts})
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Disabled Modal */}
      <CheckoutDisabledModal
        isOpen={showCheckoutDisabledModal}
        onClose={() => setShowCheckoutDisabledModal(false)}
      />
    </Page>
  );
};

export default ShopPage;