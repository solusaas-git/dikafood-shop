import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Star,
  ShoppingCart,
  Heart,
  ArrowLeft,
  Minus,
  Plus,
  Share,
  Tag,
  Truck,
  Medal,
  CaretRight
} from "@phosphor-icons/react";
import NavBar from '../../sections/shared/navbar/NavBar';
import Footer from '../../sections/shared/footer/Footer';
import TranslatedText from '../../components/ui/text/TranslatedText';
import ProductCard from '../../components/cards/product/ProductCard';
import './product-detail.scss';

// Import mock data
import { mockProducts } from '../../data/shop-products';

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    // In a real implementation, this would be an API call
    // For now, we'll simulate loading from mock data
    setLoading(true);
    setTimeout(() => {
      const foundProduct = mockProducts.find(p => p.id.toString() === productId);

      if (foundProduct) {
        setProduct(foundProduct);

        // Set initial variant if available
        if (foundProduct.variants && foundProduct.variants.length > 0) {
          setSelectedVariant(foundProduct.variants[0]);
        }

        // Set related products (products in the same category)
        const related = mockProducts
          .filter(p => p.id.toString() !== productId && p.category === foundProduct.category)
          .slice(0, 4);
        setRelatedProducts(related);
      }

      setLoading(false);
    }, 500);
  }, [productId]);

  const handleQuantityChange = (amount) => {
    const newQuantity = quantity + amount;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const addToCart = () => {
    // This would be implemented with a cart context in a real app
    console.log('Adding to cart:', {
      product,
      variant: selectedVariant,
      quantity
    });

    // Show notification or feedback
    alert(`Added ${quantity} ${product.name} to cart`);
  };

  if (loading) {
    return (
      <div className="product-detail-page loading">
        <NavBar />
        <div className="loading-spinner">Loading...</div>
        <Footer />
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
            <Link to="/shop" className="back-to-shop">
              <ArrowLeft weight="bold" />
              Back to Shop
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <Helmet>
        <title>{product.name} | DikaFood</title>
        <meta name="description" content={`${product.name} - High quality product from DikaFood`} />
      </Helmet>

      <NavBar />

      <div className="container">
        {/* Breadcrumb Navigation */}
        <div className="breadcrumbs">
          <div className="breadcrumb-content">
            <Link to="/" className="breadcrumb-link">Accueil</Link>
            <span className="breadcrumb-separator">/</span>
            <Link to="/shop" className="breadcrumb-link">Boutique</Link>
            <span className="breadcrumb-separator">/</span>
            <Link to={`/shop?category=${product.category}`} className="breadcrumb-link">{product.category}</Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">{product.name}</span>
          </div>
        </div>

        {/* Product Detail Main Section */}
        <div className="product-detail-container">
          {/* Product Gallery */}
          <div className="product-gallery">
            <div className="main-image">
              <img
                src={product.image}
                alt={product.name}
              />
            </div>
            <div className="thumbnails">
              <div
                className={`thumbnail ${selectedImage === 0 ? 'active' : ''}`}
                onClick={() => setSelectedImage(0)}
              >
                <img src={product.image} alt={`${product.name} - thumbnail 1`} />
              </div>
              {/* In a real app, these would be actual images from the product */}
              <div
                className={`thumbnail ${selectedImage === 1 ? 'active' : ''}`}
                onClick={() => setSelectedImage(1)}
              >
                <img src="https://images.unsplash.com/photo-1589927986089-35812388d1f4?q=80&w=100&auto=format&fit=crop" alt={`${product.name} - thumbnail 2`} />
              </div>
              <div
                className={`thumbnail ${selectedImage === 2 ? 'active' : ''}`}
                onClick={() => setSelectedImage(2)}
              >
                <img src="https://images.unsplash.com/photo-1611764613685-c483cbceca1e?q=80&w=100&auto=format&fit=crop" alt={`${product.name} - thumbnail 3`} />
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="product-info">
            <div className="product-category">{product.category}</div>
            <h1 className="product-title">{product.name}</h1>

            {/* Product Rating */}
            <div className="product-rating">
              <div className="stars">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    weight={index < Math.floor(product.rating) ? "fill" : "light"}
                    size={18}
                  />
                ))}
              </div>
              <span className="rating-value">{product.rating}</span>
              <span className="review-count">({product.reviewCount} avis)</span>
            </div>

            {/* Product Price */}
            <div className="product-price">
              <span className="current-price">{product.price} Dh</span>
              {product.oldPrice && (
                <span className="old-price">{product.oldPrice} Dh</span>
              )}
              {product.discount && (
                <span className="discount-badge">-{product.discount}</span>
              )}
            </div>

            {/* Product Description */}
            <div className="product-short-description">
              <p>Notre huile d'olive extra vierge, obtenue par première pression à froid, est produite à partir d'olives soigneusement sélectionnées. Son goût riche et fruité en fait un ingrédient idéal pour vos salades, plats cuisinés ou simplement à déguster avec du pain.</p>
            </div>

            {/* Variant Selection */}
            {product.variants && product.variants.length > 0 && (
              <div className="product-variants">
                <span className="variant-label">Taille:</span>
                <div className="variant-options">
                  {product.variants.map((variant) => (
                    <button
                      key={variant}
                      className={`variant-button ${selectedVariant === variant ? 'active' : ''}`}
                      onClick={() => setSelectedVariant(variant)}
                    >
                      {variant}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="quantity-selector">
              <span className="quantity-label">Quantité:</span>
              <div className="quantity-controls">
                <button
                  className="quantity-button"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus weight="bold" />
                </button>
                <span className="quantity-value">{quantity}</span>
                <button
                  className="quantity-button"
                  onClick={() => handleQuantityChange(1)}
                >
                  <Plus weight="bold" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="product-actions">
              <button
                className="add-to-cart-button"
                onClick={addToCart}
              >
                <ShoppingCart weight="bold" />
                Ajouter au panier
              </button>
              <button className="wishlist-button">
                <Heart weight="light" />
              </button>
              <button className="share-button">
                <Share weight="light" />
              </button>
            </div>

            {/* Product Benefits */}
            <div className="product-benefits">
              <div className="benefit-item">
                <Tag weight="duotone" />
                <span>Livraison gratuite à partir de 200 Dh</span>
              </div>
              <div className="benefit-item">
                <Truck weight="duotone" />
                <span>Expédition sous 24h</span>
              </div>
              <div className="benefit-item">
                <Medal weight="duotone" />
                <span>Produit 100% naturel</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs Section */}
        <div className="product-tabs">
          <div className="tabs-header">
            <button
              className={`tab-button ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button
              className={`tab-button ${activeTab === 'nutrition' ? 'active' : ''}`}
              onClick={() => setActiveTab('nutrition')}
            >
              Informations nutritionnelles
            </button>
            <button
              className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Avis ({product.reviewCount})
            </button>
          </div>
          <div className="tab-content">
            {activeTab === 'description' && (
              <div className="description-tab">
                <h3>À propos de ce produit</h3>
                <p>Notre huile d'olive extra vierge est extraite à partir d'olives cultivées dans les régions montagneuses du Maroc. Le processus de première pression à froid permet de préserver toutes les qualités nutritionnelles et organoleptiques de l'olive.</p>

                <h4>Caractéristiques:</h4>
                <ul>
                  <li>Acidité: ≤ 0.8%</li>
                  <li>Goût: Fruité, légèrement épicé</li>
                  <li>Couleur: Vert doré</li>
                  <li>Process: Première pression à froid</li>
                  <li>Origine: Maroc</li>
                </ul>

                <h4>Conservation:</h4>
                <p>À conserver dans un endroit frais et sec, à l'abri de la lumière. Une fois ouvert, consommer de préférence dans les 2 mois.</p>
              </div>
            )}

            {activeTab === 'nutrition' && (
              <div className="nutrition-tab">
                <h3>Informations nutritionnelles</h3>
                <p>Valeurs nutritionnelles moyennes pour 100ml:</p>

                <div className="nutrition-table">
                  <div className="nutrition-row">
                    <span className="nutrient">Valeur énergétique</span>
                    <span className="value">3389 kJ / 824 kcal</span>
                  </div>
                  <div className="nutrition-row">
                    <span className="nutrient">Matières grasses</span>
                    <span className="value">91.6 g</span>
                  </div>
                  <div className="nutrition-row">
                    <span className="nutrient">- dont acides gras saturés</span>
                    <span className="value">14 g</span>
                  </div>
                  <div className="nutrition-row">
                    <span className="nutrient">- dont acides gras mono-insaturés</span>
                    <span className="value">69.7 g</span>
                  </div>
                  <div className="nutrition-row">
                    <span className="nutrient">- dont acides gras poly-insaturés</span>
                    <span className="value">7.9 g</span>
                  </div>
                  <div className="nutrition-row">
                    <span className="nutrient">Glucides</span>
                    <span className="value">0 g</span>
                  </div>
                  <div className="nutrition-row">
                    <span className="nutrient">Protéines</span>
                    <span className="value">0 g</span>
                  </div>
                  <div className="nutrition-row">
                    <span className="nutrient">Sel</span>
                    <span className="value">0 g</span>
                  </div>
                  <div className="nutrition-row">
                    <span className="nutrient">Vitamine E</span>
                    <span className="value">14.4 mg (120%*)</span>
                  </div>
                </div>

                <p className="nutrition-note">* % des apports de référence pour un adulte-type (8400 kJ / 2000 kcal)</p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="reviews-tab">
                <h3>Avis clients</h3>
                <div className="reviews-summary">
                  <div className="average-rating">
                    <div className="rating-number">{product.rating}</div>
                    <div className="stars">
                      {[...Array(5)].map((_, index) => (
                        <Star
                          key={index}
                          weight={index < Math.floor(product.rating) ? "fill" : "light"}
                          size={22}
                        />
                      ))}
                    </div>
                    <span className="review-count">{product.reviewCount} avis</span>
                  </div>

                  <div className="rating-distribution">
                    {[5, 4, 3, 2, 1].map(rating => (
                      <div key={rating} className="rating-bar">
                        <span className="rating-label">{rating} étoiles</span>
                        <div className="progress-bar">
                          <div
                            className="progress"
                            style={{
                              width: `${rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 8 : 2}%`
                            }}
                          ></div>
                        </div>
                        <span className="percentage">
                          {rating === 5 ? '70%' : rating === 4 ? '20%' : rating === 3 ? '8%' : '2%'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="review-list">
                  {/* Mock reviews */}
                  {[1, 2, 3].map(index => (
                    <div key={index} className="review-item">
                      <div className="review-header">
                        <div className="reviewer-info">
                          <span className="reviewer-name">Client{index}</span>
                          <span className="review-date">01/0{index}/2023</span>
                        </div>
                        <div className="review-rating">
                          {[...Array(5)].map((_, starIndex) => (
                            <Star
                              key={starIndex}
                              weight={starIndex < 5 - (index - 1) ? "fill" : "light"}
                              size={16}
                            />
                          ))}
                        </div>
                      </div>
                      <h4 className="review-title">Excellent produit !</h4>
                      <p className="review-content">
                        Très bonne huile d'olive, goût authentique et service impeccable. Je recommande vivement !
                      </p>
                    </div>
                  ))}
                </div>

                <div className="write-review-button-container">
                  <button className="write-review-button">
                    Écrire un avis
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="related-products">
            <h2 className="section-title">Produits similaires</h2>
            <div className="products-grid">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;