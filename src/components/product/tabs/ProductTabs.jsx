import React, { useState } from 'react';
import { Star } from '@phosphor-icons/react';
import './ProductTabs.scss';

const ProductTabs = ({ product }) => {
  const [activeTab, setActiveTab] = useState('description');

  if (!product) return null;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return (
          <div className="tab-description">
            <div
              className="product-description"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
            {product.features && product.features.length > 0 && (
              <div className="product-features">
                <h4>Caractéristiques</h4>
                <ul>
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      case 'nutrition':
        return (
          <div className="tab-nutrition">
            {product.nutrition ? (
              <>
                <div className="nutrition-info">
                  <h4>Information nutritionnelle</h4>
                  <p>{product.nutrition.servingSize || 'Portion de 100g'}</p>

                  <table className="nutrition-table">
                    <thead>
                      <tr>
                        <th>Nutriment</th>
                        <th>Valeur</th>
                        <th>% AJR*</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(product.nutrition.values || {}).map(([key, value]) => (
                        <tr key={key}>
                          <td>{key}</td>
                          <td>{value.amount}</td>
                          <td>{value.percentage || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="nutrition-note">* AJR: Apport Journalier Recommandé</p>
                </div>
                {product.nutrition.ingredients && (
                  <div className="ingredients">
                    <h4>Ingrédients</h4>
                    <p>{product.nutrition.ingredients}</p>
                  </div>
                )}
                {product.nutrition.allergens && (
                  <div className="allergens">
                    <h4>Allergènes</h4>
                    <ul>
                      {product.nutrition.allergens.map((allergen, index) => (
                        <li key={index}>{allergen}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div className="empty-tab-info">
                <p>Les informations nutritionnelles ne sont pas disponibles pour ce produit.</p>
              </div>
            )}
          </div>
        );
      case 'reviews':
        return (
          <div className="tab-reviews">
            {product.reviews && product.reviews.length > 0 ? (
              <>
                <div className="reviews-summary">
                  <div className="rating-summary">
                    <div className="rating-overall">
                      <span className="rating-value">{product.rating}</span>
                      <div className="stars">
                        {[...Array(5)].map((_, index) => (
                          <Star
                            key={index}
                            weight={index < Math.floor(product.rating) ? "fill" : "regular"}
                            size={20}
                          />
                        ))}
                      </div>
                      <p>Basé sur {product.reviewCount} avis</p>
                    </div>

                    <div className="rating-breakdown">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = product.ratingBreakdown?.[star] || 0;
                        const percentage = product.reviewCount ? (count / product.reviewCount) * 100 : 0;

                        return (
                          <div key={star} className="rating-bar">
                            <span className="star-label">{star} étoile{star > 1 ? 's' : ''}</span>
                            <div className="progress">
                              <div
                                className="progress-fill"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="count">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="reviews-list">
                  <h4>Avis clients</h4>
                  {product.reviews.map((review, index) => (
                    <div key={index} className="review-item">
                      <div className="review-header">
                        <div className="reviewer-info">
                          <span className="reviewer-name">{review.name}</span>
                          <span className="review-date">{review.date}</span>
                        </div>
                        <div className="review-rating">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              weight={i < review.rating ? "fill" : "regular"}
                              size={16}
                            />
                          ))}
                        </div>
                      </div>
                      <h5 className="review-title">{review.title}</h5>
                      <p className="review-text">{review.text}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="empty-tab-info">
                <p>Il n'y a pas encore d'avis pour ce produit.</p>
                <button className="write-review-button">Écrire un avis</button>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
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
          Information nutritionnelle
        </button>
        <button
          className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          Avis clients ({product.reviewCount || 0})
        </button>
      </div>
      <div className="tabs-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ProductTabs;