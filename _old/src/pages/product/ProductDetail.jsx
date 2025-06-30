import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Star,
  ShoppingCart,
  Heart,
  Minus,
  Plus,
  Tag,
  ShieldCheck,
  Clock,
  Info,
  Leaf,
  House,
  CaretRight,
  CreditCard,
  ClipboardText,
  ShoppingBag,
  ChatCircleText,
  ChartBar,
  ArrowRight,
  CheckCircle,
  X,
  Factory,
  Drop,
  Package,
  ChartLineUp,
  ShoppingBagOpen,
  Timer,
  Truck,
  Fire,
  Check,
  ArrowsCounterClockwise
} from "@phosphor-icons/react";
import NavBar from '../../sections/shared/navbar/NavBar';
import ProductBreadcrumb from '../../components/product/breadcrumb/ProductBreadcrumb';
import ProductGallery from '../../components/product/gallery/ProductGallery';
import './product-detail.scss';
import { Carousel, CarouselSlide } from "../../components/ui/carousel/Carousel";
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import ProductCard from '../../components/product/card/ProductCard';
import { ProductCardSkeletonGrid } from '../../components/product/card/ProductCardSkeleton';
import RecommendedProductCard from '../../components/product/card/RecommendedProductCard';
import { RecommendedProductCardSkeletonGrid } from '../../components/product/card/RecommendedProductCardSkeleton';
import ReviewModal from '../../components/product/reviews/ReviewModal';
import CountryFlag from "../../components/ui/CountryFlag";
import { isMobile, isTablet } from 'react-device-detect';
import { formatCurrency } from '../../utils/format';

// Import product data
import { getProductById, getRelatedProducts } from '../../data/products';

// Brand Card Component
const BrandCard = ({ product }) => {
  const [brandLogo, setBrandLogo] = useState(null);

  useEffect(() => {
    const getBrandLogo = async () => {
      if (product.brand) {
        try {
          // Convert brand name to kebab case for file name matching
          const brandId = product.brand.toLowerCase()
            .replace(/[^\w\s]/gi, '')
            .replace(/\s+/g, '-');

          // Try to import the brand logo dynamically
          try {
            // First try with the specific naming pattern
            const logoPath = `/images/brands/${brandId}-logo.svg`;
            setBrandLogo(logoPath);
          } catch (error) {
            try {
              // If that fails, try the general naming pattern
              const logoPath = `/images/brands/${brandId}-logo.svg`;
              setBrandLogo(logoPath);
            } catch (error) {
              console.error('Brand logo not found:', error);
              setBrandLogo(null);
            }
          }
        } catch (error) {
          console.error('Error loading brand logo:', error);
          setBrandLogo(null);
        }
      }
    };

    getBrandLogo();
  }, [product.brand]);

  return (
    <div className="brand-card">
      <div className="brand-logo-container">
        {brandLogo ? (
          <img src={brandLogo} alt={product.brand} className="brand-logo" />
        ) : (
          <Factory weight="duotone" size={32} />
        )}
      </div>
    </div>
  );
};

// Product Header Component
const ProductHeader = ({ product, isMobile = false }) => {
  return (
    <div className={`product-header ${isMobile ? 'mobile-header' : ''}`}>
      <h1 className="product-title">{product.name}</h1>
    </div>
  );
};

// Product Price Component
const ProductPrice = ({ product, selectedVariant }) => (
  <div className="product-price-section">
    <div className="product-price-container">
      <span className="current-price">{selectedVariant ? selectedVariant.price : product.price} MAD</span>
      {product.oldPrice && (
        <span className="old-price">{product.oldPrice} MAD</span>
      )}
      {product.discount && (
        <span className="discount-badge">
          <Tag weight="duotone" size={16} />
          -{product.discount}
        </span>
      )}
    </div>
    <BrandCard product={product} />
  </div>
);

// Product Options Component
const ProductOptions = ({
  product,
  selectedVariant,
  quantity,
  onVariantChange,
  onQuantityChange
}) => {
  return (
    <div className="product-options-container">
      <div className="options-wrapper">
        {product.variants && product.variants.length > 0 && (
          <div className="sub-container variant-container">
            <div className="sub-header">
              <div className="header-title">
                <h4 className="variant-label">Choisir l'option</h4>
              </div>
            </div>
            <div className="sub-content">
              <div className="product-variants">
                <div className="variant-options">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      type="button"
                      className={`variant-button ${
                        selectedVariant && selectedVariant.id === variant.id
                          ? "active"
                          : ""
                      }`}
                      onClick={() => onVariantChange(variant)}
                      aria-label={`Sélectionner ${variant.size}`}
                    >
                      {variant.size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="sub-container quantity-container">
          <div className="sub-header">
            <div className="header-title">
              <h4 className="quantity-label">Quantité</h4>
            </div>
          </div>
          <div className="sub-content">
            <div className="quantity-selector">
              <div className="quantity-row">
                <div className="quantity-controls">
                  <button
                    type="button"
                    className="quantity-button"
                    onClick={() => quantity > 1 && onQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    <Minus weight="bold" size={16} />
                  </button>
                  <span className="quantity-value">{quantity}</span>
                  <button
                    type="button"
                    className="quantity-button"
                    onClick={() => onQuantityChange(quantity + 1)}
                  >
                    <Plus weight="bold" size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Product Actions Component
const ProductActions = ({ addToCart, stockStatus, isMobileLayout = false }) => (
  <div className={`product-actions ${isMobileLayout ? 'mobile-actions' : ''}`}>
    <button
      className="add-to-cart-button"
      onClick={() => addToCart(true)}
      disabled={stockStatus?.status === 'out-of-stock'}
    >
      <CreditCard weight="duotone" size={20} />
      Acheter
    </button>
    <button
      className="secondary-button add-to-cart-secondary"
      onClick={() => addToCart(false)}
      disabled={stockStatus?.status === 'out-of-stock'}
    >
      <ShoppingCart weight="duotone" size={20} />
      Ajouter
    </button>
  </div>
);

// Mobile Purchase Actions Component (Sticky)
const MobilePurchaseActions = ({
  product,
  selectedVariant,
  quantity,
  onVariantChange,
  onQuantityChange,
  onAddToCart,
  expanded,
  onToggleExpand
}) => {
  return (
    <div className="mobile-purchase-actions-container">
      <div className="mobile-purchase-summary">
        <div className="mobile-summary-content">
          <div className="mobile-product-info" onClick={onToggleExpand}>
            <div className="mobile-product-price">
              {formatCurrency(selectedVariant?.price || product?.price || 0)}
            </div>
            <div className="mobile-product-quantity">
              {quantity} article{quantity > 1 ? 's' : ''}
            </div>
          </div>

          <div className="mobile-summary-actions">
            <button
              className="mobile-action-button add"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(false);
              }}
              aria-label="Ajouter au panier"
            >
              <div className="cart-plus-icon">
                <ShoppingCart weight="duotone" size={16} />
                <Plus weight="bold" size={14} className="plus-icon" />
              </div>
            </button>
            <button
              className="mobile-action-button buy"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(true);
              }}
            >
              <CreditCard weight="duotone" size={22} />
              <span>Acheter</span>
            </button>
          </div>
        </div>

        <button
          className="mobile-expand-toggle"
          onClick={onToggleExpand}
        >
          <span>Options</span>
          <CaretRight weight="bold" size={18} className={expanded ? 'rotate' : ''} />
        </button>
      </div>

      {expanded && (
        <div className="mobile-purchase-expanded">
          <div className="mobile-purchase-options">
            <div className="mobile-options-row">
              {product?.variants && product.variants.length > 0 && (
                <div className="mobile-variants">
                  <label>Choisir l'option</label>
                  <div className="mobile-variant-buttons">
                    {product.variants.map((variant, idx) => (
                      <button
                        key={idx}
                        className={`mobile-variant-button ${selectedVariant?.id === variant.id ? 'active' : ''}`}
                        onClick={() => onVariantChange(variant)}
                        aria-label={`Sélectionner ${variant.name || variant.size}`}
                      >
                        {variant.name || variant.size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mobile-quantity">
                <label>Quantité</label>
                <div className="mobile-quantity-controls">
                  <button
                    onClick={() => quantity > 1 && onQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    <Minus size={18} weight="bold" />
                  </button>
                  <span>{quantity}</span>
                  <button onClick={() => onQuantityChange(quantity + 1)}>
                    <Plus size={18} weight="bold" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Product Details Table Component
const ProductDetailsTable = ({ product }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [countryFlag, setCountryFlag] = useState('');
  const isMobileView = isMobile || isTablet;

  useEffect(() => {
    // Fetch country flag when product.origin changes
    if (product.origin) {
      // Converting country name to country code might require a mapping
      // For simplicity, we'll assume product.origin contains the country code (e.g., "ma" for Morocco)
      const countryCode = product.origin.toLowerCase().slice(0, 2);
      fetch(`https://flagcdn.com/32x24/${countryCode}.png`)
        .then(response => {
          if (response.ok) {
            setCountryFlag(`https://flagcdn.com/32x24/${countryCode}.png`);
          } else {
            console.error('Failed to fetch country flag');
          }
        })
        .catch(error => {
          console.error('Error fetching country flag:', error);
        });
    }
  }, [product.origin]);

  const toggleDetails = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="product-details-table">
      <div className="details-header collapsible-header" onClick={toggleDetails}>
        <div className="header-title">
          <ClipboardText weight="duotone" size={18} />
          <h3 className="details-title">Détails</h3>
        </div>
        <CaretRight
          size={18}
          weight="bold"
          className={`toggle-icon ${isExpanded ? 'expanded' : ''}`}
        />
      </div>
      {isExpanded && (
        <div className="details-content">
          {/* Brand Card - Only displayed on mobile */}
          {isMobileView && (
            <div className="detail-row brand-row">
              <span className="detail-label">Marque</span>
              <div className="detail-value brand-detail-value">
                <span className="brand-name-value">{product.brand}</span>
                <BrandCard product={product} />
              </div>
            </div>
          )}

          {/* Brand text - Only displayed on desktop */}
          {!isMobileView && (
            <div className="detail-row">
              <span className="detail-label">Marque</span>
              <span className="detail-value">{product.brand}</span>
            </div>
          )}

          <div className="detail-row">
            <span className="detail-label">Origine</span>
            <span className="detail-value">
              {countryFlag && <img src={countryFlag} alt={product.origin} className="country-flag" />}
              {product.origin}
            </span>
          </div>
          {product.acidity && (
            <div className="detail-row">
              <span className="detail-label">Acidité</span>
              <span className="detail-value">{product.acidity}</span>
            </div>
          )}
          {product.features && product.features.map((feature, index) => (
            <div key={index} className="detail-row">
              <span className="detail-label">{feature.text}</span>
              <span className="detail-value">
                <feature.icon weight="duotone" size={16} style={{ marginRight: "8px" }} />
                Oui
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Product Short Description Component
const ProductShortDescription = ({ product }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="product-short-description">
      <div className="description-header collapsible-header" onClick={toggleDescription}>
        <div className="header-title">
          <Info weight="duotone" size={18} />
          <h3 className="description-title">Description</h3>
        </div>
        <CaretRight
          size={18}
          weight="bold"
          className={`toggle-icon ${isExpanded ? 'expanded' : ''}`}
        />
      </div>
      {isExpanded && (
        <div className="description-content">
          <p>{product.shortDescription || product.description}</p>
        </div>
      )}
    </div>
  );
};

// Product Reviews Section Component with success notification
const ProductReviewsSection = ({ product, reviews, newReviewId }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(true);
  const isMobileView = isMobile || isTablet;

  const toggleReviews = () => {
    setIsExpanded(!isExpanded);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        weight="duotone"
        className={index < rating ? "star-filled duotone" : "star-empty duotone"}
        size={16}
      />
    ));
  };

  // Set up autoplay options with a longer delay for reading reviews
  const autoplayOptions = { delay: 6000, stopOnInteraction: true };

  // Set up responsive options based on screen size
  const emblaOptions = useMemo(() => ({
    loop: false,
    align: 'start',
    containScroll: 'trimSnaps',
    direction: 'ltr',
    dragFree: true
  }), []);

  // Set up Embla Carousel instance
  const [emblaRef, emblaApi] = useEmblaCarousel(
    emblaOptions,
    [Autoplay(autoplayOptions)]
  );

  // Add scroll functions for navigation controls
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Handle selection state changes
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  // Set up event listeners
  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    onSelect();

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="product-reviews-section">
      <div className="reviews-header collapsible-header" onClick={toggleReviews}>
        <div className="header-title">
          <ChatCircleText weight="duotone" size={18} />
          <h3 className="reviews-title">Avis clients ({reviews.length})</h3>
        </div>
        <CaretRight
          size={18}
          weight="bold"
          className={`toggle-icon ${isExpanded ? 'expanded' : ''}`}
        />
      </div>

      {isExpanded && (
        <div className="reviews-content">
          <div className="reviews-carousel">
            <div className="embla custom-carousel reviews-embla-carousel">
              <div className="embla__viewport" ref={emblaRef}>
                <div className="embla__container">
                  {reviews.map((review, index) => (
                    <div key={review.id || index} className="embla__slide review-slide">
                      <div className={`review-item ${newReviewId === review.id ? 'new-review' : ''}`}>
                        <div className="review-header">
                          <div className="reviewer-info">
                            <span className="reviewer-name">{review.name}</span>
                            <span className="review-date">{review.date}</span>
                          </div>
                          <div className="review-rating">
                            {renderStars(review.rating)}
                          </div>
                        </div>

                        <div className="review-content">
                          {review.title && (
                            <h5 className="review-title">{review.title}</h5>
                          )}

                          <p className="review-text">{review.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add carousel navigation controls */}
              {reviews.length > 1 && (
                <>
                  <button
                    className={`carousel-button prev ${!prevBtnEnabled ? 'disabled' : ''}`}
                    onClick={scrollPrev}
                    disabled={!prevBtnEnabled}
                    aria-label="Voir avis précédents"
                  >
                    <ArrowRight size={isMobileView ? 18 : 20} weight="bold" style={{ transform: 'rotate(180deg)' }} />
                  </button>

                  <button
                    className={`carousel-button next ${!nextBtnEnabled ? 'disabled' : ''}`}
                    onClick={scrollNext}
                    disabled={!nextBtnEnabled}
                    aria-label="Voir avis suivants"
                  >
                    <ArrowRight size={isMobileView ? 18 : 20} weight="bold" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Recommended Products Component
const RecommendedProducts = ({ currentProductId, category }) => {
  const [products, setProducts] = useState([]);
  const isMobileView = isMobile || isTablet;
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(true);

  // Set up carousel options
  const emblaOptions = useMemo(() => ({
    loop: false,
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true
  }), []);

  // Set up carousel for mobile view
  const [emblaRef, emblaApi] = useEmblaCarousel(emblaOptions);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    onSelect();

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    // In a real app this would be an API call
    const fetchRecommendedProducts = async () => {
      try {
        const relatedProducts = await getRelatedProducts(currentProductId, category);
        setProducts(relatedProducts.slice(0, 6)); // Increased to 6 products for carousel
      } catch (error) {
        console.error("Error fetching recommended products:", error);
      }
    };

    fetchRecommendedProducts();
  }, [currentProductId, category]);

  // If no products, don't render the section
  if (!products || products.length === 0) return null;

  return isMobileView ? (
    <div className="recommended-products-mobile">
      <div className="section-header">
        <h3 className="section-title">
          <ShoppingBag weight="duotone" size={20} style={{ marginRight: "8px", verticalAlign: "middle" }} />
          Produits Recommandés
        </h3>
      </div>

      <div className="recommended-products-carousel">
        <button
          className={`carousel-button prev ${!prevBtnEnabled ? 'disabled' : ''}`}
          onClick={scrollPrev}
          disabled={!prevBtnEnabled}
          aria-label="Voir produits précédents"
        >
          <ArrowRight size={isMobileView ? 18 : 20} weight="bold" style={{ transform: 'rotate(180deg)' }} />
        </button>

        <div className="embla">
          <div className="embla__viewport" ref={emblaRef}>
            <div className="embla__container">
              {products.map(product => (
                <div key={product.id} className="embla__slide">
                  <RecommendedProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          className={`carousel-button next ${!nextBtnEnabled ? 'disabled' : ''}`}
          onClick={scrollNext}
          disabled={!nextBtnEnabled}
          aria-label="Voir produits suivants"
        >
          <ArrowRight size={isMobileView ? 18 : 20} weight="bold" />
        </button>
      </div>
    </div>
  ) : (
    <div className="recommended-products-section">
      <div className="section-header">
        <h3 className="section-title">
          <ShoppingBag weight="duotone" size={20} style={{ marginRight: "8px", verticalAlign: "middle" }} />
          Produits Recommandés
        </h3>
      </div>

      <div className="products-grid">
        {products.map(product => (
          <RecommendedProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [purchaseExpanded, setPurchaseExpanded] = useState(true);
  const [mobilePurchaseExpanded, setMobilePurchaseExpanded] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [newReviewId, setNewReviewId] = useState(null);
  const isMobileView = isMobile || isTablet;

  useEffect(() => {
    // In a real implementation, this would be an API call
    // For now, we'll simulate loading from mock data
    setLoading(true);
    window.scrollTo(0, 0);

    // Get product data with a reduced loading time for better UX
    const loadProduct = async () => {
      try {
        // Simulate network request
        const foundProduct = await new Promise((resolve) => {
    setTimeout(() => {
            resolve(getProductById(productId));
          }, 300); // Reduced loading time for better UX
        });

      if (foundProduct) {
        setProduct(foundProduct);

        // Set initial variant if available
        if (foundProduct.variants && foundProduct.variants.length > 0) {
          setSelectedVariant(foundProduct.variants[0]);
        }

          // Initialize reviews
          setReviews(foundProduct.reviews || [
            {
              id: "r1",
              name: "François Dupont",
              date: "15 juin 2023",
              rating: 5,
              title: "Excellent produit",
              text: "J'adore ce produit ! La qualité est exceptionnelle et je recommande vivement."
            },
            {
              id: "r2",
              name: "Thomas Dubois",
              date: "3 mai 2023",
              rating: 4,
              title: "Très bon mais...",
              text: "Le goût est excellent, mais l'emballage pourrait être amélioré. Sinon je suis très satisfait de mon achat."
            },
            {
              id: "r3",
              name: "Marie Laurent",
              date: "27 avril 2023",
              rating: 5,
              text: "Livraison rapide et produit conforme à mes attentes. Je rachèterai !"
            },
            {
              id: "r4",
              name: "Jean Dupont",
              date: "18 avril 2023",
              rating: 4,
              title: "Très satisfait",
              text: "Produit de bonne qualité, bon rapport qualité-prix. Je recommande."
            },
            {
              id: "r5",
              name: "Céline Moreau",
              date: "2 mars 2023",
              rating: 5,
              title: "Parfait !",
              text: "Exactement ce que je cherchais ! Excellent service et livraison rapide."
            }
          ]);
        }
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  // Add review handler functions
  const handleOpenReviewModal = () => {
    setIsReviewModalOpen(true);
  };

  const handleCloseReviewModal = () => {
    setIsReviewModalOpen(false);
  };

  const handleSubmitReview = (newReview) => {
    // Add unique ID to identify the new review
    const reviewWithId = { ...newReview, id: Date.now() };
    setReviews(prevReviews => [reviewWithId, ...prevReviews]);
    setNewReviewId(reviewWithId.id);

    // Show success notification
    setShowSuccessNotification(true);

    // Remove success notification after animation completes
    setTimeout(() => {
      setShowSuccessNotification(false);
    }, 5000);

    // Remove new review highlight after a delay
    setTimeout(() => {
      setNewReviewId(null);
    }, 3000);
  };

  const handleQuantityChange = (amount) => {
    const newQuantity = quantity + amount;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const addToCart = (immediate = false) => {
    // This would be implemented with a cart context in a real app
    console.log('Adding to cart:', {
      product,
      variant: selectedVariant,
      quantity,
      immediate
    });

    // Show notification or feedback
    if (immediate) {
      alert(`Purchasing ${quantity} ${product.name} now! Redirecting to checkout...`);
      // Here you would typically redirect to checkout
      // window.location.href = '/checkout';
    } else {
    alert(`Added ${quantity} ${product.name} to cart`);
    }
  };

  // Toggle mobile purchase options expand/collapse
  const toggleMobilePurchase = () => {
    setMobilePurchaseExpanded(!mobilePurchaseExpanded);
  };

  if (loading) {
    return (
      <div className="product-detail-page">
        <Helmet>
          <title>Loading Product | DikaFood</title>
        </Helmet>

        <NavBar />

        <ProductBreadcrumb product={{
          name: "Loading...",
          category: { id: "0", name: "Loading..." }
        }} />

        <div className="container">
          <div className="unified-product-container">
            {/* Gallery Section Loading Skeleton */}
            <div className="product-section gallery-section">
              <div className="gallery-wrapper skeleton-gallery">
                <div className="skeleton-desktop">
                  <div className="main-image skeleton-loader">
                    <div className="skeleton-image"></div>
                  </div>
                  <div className="thumbnails">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="thumbnail skeleton-loader">
                        <div className="skeleton-thumb"></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="skeleton-mobile">
                  <div className="main-image-container">
                    <div className="main-image skeleton-loader">
                      <div className="skeleton-image"></div>
                    </div>
                  </div>
                  <div className="thumbnails-container">
                    <div className="embla">
                      <div className="embla__container thumbnails">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="embla__slide thumbnail skeleton-loader">
                            <div className="thumbnail-inner">
                              <div className="skeleton-thumb"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ratings summary skeleton */}
              <div className="reviews-summary-container">
                <div className="reviews-header collapsible-header skeleton-loader">
                  <div className="header-title skeleton-title"></div>
                </div>
                <div className="skeleton-reviews-summary">
                  <div className="skeleton-rating"></div>
                </div>
              </div>
            </div>

            {/* Info Section Loading Skeleton */}
            <div className="product-section info-section">
              <div className="skeleton-header"></div>
              <div className="skeleton-price"></div>

              {/* Purchase options skeleton */}
              <div className="purchase-options">
                <div className="skeleton-purchase-header skeleton-loader"></div>
                <div className="skeleton-options"></div>
                <div className="skeleton-actions"></div>
              </div>

              {/* Description skeleton */}
              <div className="skeleton-description-header skeleton-loader"></div>
              <div className="skeleton-description"></div>

              {/* Details skeleton */}
              <div className="skeleton-details-header skeleton-loader"></div>
              <div className="skeleton-details"></div>
            </div>
          </div>

          {/* Reviews Section Loading Skeleton */}
          <div className="reviews-container">
            <div className="product-reviews-section">
              <div className="reviews-header collapsible-header skeleton-loader">
                <div className="header-title skeleton-title"></div>
              </div>
              <div className="skeleton-reviews-content">
                <div className="skeleton-carousel">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="skeleton-review-item"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Products Loading Skeleton */}
          <div className="recommended-products-container">
            <div className="recommended-products-section skeleton-loader">
              <div className="skeleton-section-title"></div>
              <RecommendedProductCardSkeletonGrid count={4} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-page not-found">
        <NavBar />
        <div className="container">
          <div className="product-not-found">
            <h1>Product Not Found</h1>
            <p>The product you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate stock status
  const getStockStatus = () => {
    if (!selectedVariant) return null;

    if (selectedVariant.stock <= 0) {
      return { status: 'out-of-stock', text: 'Rupture de stock' };
    } else if (selectedVariant.stock <= 5) {
      return { status: 'low-stock', text: `En stock: ${selectedVariant.stock} restants` };
    } else {
      return { status: 'in-stock', text: 'En stock' };
    }
  };

  const stockStatus = getStockStatus();

  // Generate random rating distribution
  const generateRatingDistribution = (reviewCount) => {
    let distribution = [0, 0, 0, 0, 0];
    let total = 0;

    // Generate weighted distribution favoring higher ratings
    for (let i = 0; i < reviewCount; i++) {
      const randomValue = Math.random();
      if (randomValue > 0.9) {
        distribution[0]++; // 1 star
      } else if (randomValue > 0.8) {
        distribution[1]++; // 2 stars
      } else if (randomValue > 0.6) {
        distribution[2]++; // 3 stars
      } else if (randomValue > 0.3) {
        distribution[3]++; // 4 stars
      } else {
        distribution[4]++; // 5 stars
      }
      total++;
    }

    return distribution.map(count => ({
      count,
      percentage: total > 0 ? (count / total) * 100 : 0
    })).reverse(); // Reverse to start with 5 stars
  };

  const ratingDistribution = generateRatingDistribution(product.reviewCount);

  return (
    <div className={`product-detail-page ${mobilePurchaseExpanded ? 'expanded-purchase' : ''}`}>
      <Helmet>
        <title>{product.name} | DikaFood</title>
        <meta name="description" content={product.shortDescription || `${product.name} - High quality product from DikaFood`} />
      </Helmet>

      <NavBar />

      {/* Breadcrumb */}
      <ProductBreadcrumb product={{
        name: product.name,
        category: { id: product.categoryId, name: product.category }
      }} />

      {/* Full-width wrapper for unified product container */}
      <div className="product-container-wrapper">
        <div className="container">
          {/* Unified Product Container */}
          <div className="unified-product-container">
            {/* Mobile-only header displayed above gallery */}
            {isMobileView && (
              <div className="mobile-product-header">
                <ProductHeader product={product} isMobile={true} />
              </div>
            )}

          <div className="main-sections">
            {/* Gallery Section */}
            <div className="product-section gallery-section">
              <ProductGallery
                product={product}
                initialVariant={selectedVariant}
                key={selectedVariant?.id}
              />

              {/* Ratings Summary moved below the gallery */}
              <div className="reviews-summary-container">
                <div className="reviews-header collapsible-header">
                  <div className="header-title">
                    <ChartBar weight="duotone" size={16} />
                    <h3 className="reviews-title">Notation produit</h3>
                  </div>
                </div>
                <div className="reviews-summary">
                  <div className="rating-overall">
                    <div className="rating-value">{product.rating.toFixed(1)}</div>
                    <div className="stars">
                      {[...Array(5)].map((_, index) => {
                        if (index < Math.floor(product.rating)) {
                          // Full star
                          return <Star key={index} weight="duotone" size={16} className="star-filled duotone" />;
                        } else if (index < Math.ceil(product.rating) && !Number.isInteger(product.rating)) {
                          // Half star
                          return <Star key={index} weight="duotone" size={16} className="star-half duotone" />;
                        } else {
                          // Empty star
                          return <Star key={index} weight="duotone" size={16} className="star-empty duotone" />;
                        }
                      })}
                    </div>
                    <p className="review-count">{product.reviewCount} avis</p>
                  </div>

                  <div className="rating-breakdown">
                    {ratingDistribution.map((data, index) => {
                      const starNumber = 5 - index;

                      return (
                        <div className="rating-bar" key={starNumber}>
                          <div className="star-label">{starNumber} étoiles</div>
                          <div className="progress">
                            <div
                              className="progress-fill"
                              style={{ width: `${data.percentage}%` }}
                            ></div>
                          </div>
                          <div className="count">{data.count}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Info Section */}
            <div className="product-section info-section">
              {/* Desktop-only product header */}
              {!isMobileView && (
                <ProductHeader product={product} />
              )}

              {/* Product Price - only show in desktop view */}
              {!isMobileView && (
                <ProductPrice product={product} selectedVariant={selectedVariant} />
              )}

              {/* Purchase Options - only show in desktop view */}
              {!isMobileView && (
                <div className="purchase-options">
                  <div className="purchase-header collapsible-header" onClick={() => setPurchaseExpanded(!purchaseExpanded)}>
                    <div className="header-title">
                      <ShoppingBag weight="duotone" size={18} />
                      <h3 className="section-title">Options d'achat</h3>
                    </div>
                    <CaretRight
                      size={18}
                      weight="bold"
                      className={`toggle-icon ${purchaseExpanded ? 'expanded' : ''}`}
                    />
                  </div>
                  {purchaseExpanded && (
                    <>
                      <ProductOptions
                        product={product}
                        selectedVariant={selectedVariant}
                        quantity={quantity}
                        onVariantChange={setSelectedVariant}
                        onQuantityChange={setQuantity}
                      />

                      {/* Action buttons */}
                      <ProductActions
                        addToCart={addToCart}
                        stockStatus={stockStatus}
                      />
                    </>
                  )}
                </div>
              )}

              {/* Product Short Description moved to info section */}
              <ProductShortDescription product={product} />

              {/* Product Details Table */}
              <ProductDetailsTable product={product} />
            </div>
          </div>

          </div>

          {/* Reviews Section - Full Width */}
          <div className="reviews-container">
            <ProductReviewsSection
              product={product}
              reviews={reviews}
              newReviewId={newReviewId}
            />
          </div>

          {/* Recommended Products Section - Only show container on desktop */}
          {!isMobileView && (
            <div className="recommended-products-container">
              <RecommendedProducts
                currentProductId={product.id}
                category={product.category}
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile recommended products - outside container for full width */}
      {isMobileView && (
        <RecommendedProducts
          currentProductId={product.id}
          category={product.category}
        />
      )}

      {/* Mobile sticky purchase actions */}
      {isMobileView && (
        <MobilePurchaseActions
          product={product}
          selectedVariant={selectedVariant}
          quantity={quantity}
          onVariantChange={setSelectedVariant}
          onQuantityChange={setQuantity}
          onAddToCart={addToCart}
          expanded={mobilePurchaseExpanded}
          onToggleExpand={toggleMobilePurchase}
        />
      )}

      {/* Add ReviewModal at the root level */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={handleCloseReviewModal}
        productId={product?.id}
        productName={product?.name}
        onSubmitReview={handleSubmitReview}
      />

      {/* Success notification */}
      {showSuccessNotification && (
        <div className="review-success-notification">
          <CheckCircle size={24} weight="duotone" className="notification-icon" />
          <div className="notification-content">
            <h4>Avis envoyé avec succès!</h4>
            <p>Merci pour votre contribution. Votre avis aide d'autres clients.</p>
          </div>
          <button
            className="close-notification"
            onClick={() => setShowSuccessNotification(false)}
          >
            <X size={18} weight="bold" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;