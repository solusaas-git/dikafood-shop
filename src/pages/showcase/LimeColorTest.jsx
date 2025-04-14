import React from 'react';
import './LimeColorTest.scss';

const LimeColorTest = () => {
  return (
    <div className="lime-color-test">
      <div className="container">
        <header className="page-header">
          <h1>Lime Green Color Test</h1>
          <p>Testing the new logo lime green (#AACC00) in various UI contexts</p>
        </header>

        <section className="color-combinations">
          <h2>Color Combinations</h2>

          <div className="combination-set">
            <h3>Lime Green with Dark Green</h3>
            <div className="color-row">
              <div className="color-combo">
                <div className="color-block" style={{ backgroundColor: '#AACC00', color: '#0A5C26' }}>
                  <span>Logo Lime (#AACC00)</span>
                  <span>with Dark Green Text</span>
                </div>
                <div className="caption">Button / Accent</div>
              </div>

              <div className="color-combo">
                <div className="color-block" style={{ backgroundColor: '#0A5C26', color: '#AACC00' }}>
                  <span>Dark Green (#0A5C26)</span>
                  <span>with Lime Text</span>
                </div>
                <div className="caption">Button / Card</div>
              </div>

              <div className="color-combo">
                <div className="color-block" style={{
                  background: 'linear-gradient(135deg, #AACC00 0%, #0A5C26 100%)',
                  color: 'white'
                }}>
                  <span>Lime to Dark Green</span>
                  <span>Gradient</span>
                </div>
                <div className="caption">Section Background</div>
              </div>
            </div>
          </div>

          <div className="combination-set">
            <h3>Lime Green with Neutral Colors</h3>
            <div className="color-row">
              <div className="color-combo">
                <div className="color-block" style={{ backgroundColor: '#AACC00', color: '#1C1C1C' }}>
                  <span>Logo Lime (#AACC00)</span>
                  <span>with Black Text</span>
                </div>
                <div className="caption">Button / Highlight</div>
              </div>

              <div className="color-combo">
                <div className="color-block" style={{ backgroundColor: '#FFFFFF', color: '#AACC00', border: '1px solid #E0E0E0' }}>
                  <span>White (#FFFFFF)</span>
                  <span>with Lime Text</span>
                </div>
                <div className="caption">Text / Highlight</div>
              </div>

              <div className="color-combo">
                <div className="color-block" style={{
                  background: 'linear-gradient(135deg, white 0%, #AACC00 100%)',
                  color: '#1C1C1C'
                }}>
                  <span>White to Lime</span>
                  <span>Gradient</span>
                </div>
                <div className="caption">Section Background</div>
              </div>
            </div>
          </div>

          <div className="combination-set">
            <h3>Lime Green with Yellow/Orange</h3>
            <div className="color-row">
              <div className="color-combo">
                <div className="color-block" style={{ backgroundColor: '#AACC00', color: '#E5801A' }}>
                  <span>Logo Lime (#AACC00)</span>
                  <span>with Orange Text</span>
                </div>
                <div className="caption">Secondary Accent</div>
              </div>

              <div className="color-combo">
                <div className="color-block" style={{ backgroundColor: '#EBEB47', color: '#AACC00', border: '1px solid #AACC00' }}>
                  <span>Yellow (#EBEB47)</span>
                  <span>with Lime Border</span>
                </div>
                <div className="caption">Card / Tag</div>
              </div>

              <div className="color-combo">
                <div className="color-block" style={{
                  background: 'linear-gradient(135deg, #AACC00 0%, #E5801A 100%)',
                  color: 'white'
                }}>
                  <span>Lime to Orange</span>
                  <span>Gradient</span>
                </div>
                <div className="caption">Section Background</div>
              </div>
            </div>
          </div>
        </section>

        <section className="ui-components">
          <h2>UI Components with Lime Green</h2>

          <div className="component-set">
            <h3>Buttons</h3>
            <div className="component-row">
              <div className="component-item">
                <button className="lime-primary-btn">Primary Button</button>
                <div className="caption">Primary Lime Button</div>
              </div>

              <div className="component-item">
                <button className="lime-outline-btn">Outline Button</button>
                <div className="caption">Lime Outline Button</div>
              </div>

              <div className="component-item">
                <button className="lime-text-btn">Text Button</button>
                <div className="caption">Lime Text Button</div>
              </div>
            </div>
          </div>

          <div className="component-set">
            <h3>Cards</h3>
            <div className="component-row cards-row">
              <div className="component-item">
                <div className="lime-card">
                  <div className="card-header">Lime Header</div>
                  <div className="card-body">
                    <p>This card uses lime green as the header background.</p>
                    <button className="lime-primary-btn small">Learn More</button>
                  </div>
                </div>
                <div className="caption">Card with Lime Header</div>
              </div>

              <div className="component-item">
                <div className="lime-border-card">
                  <div className="card-header">Featured</div>
                  <div className="card-body">
                    <p>This card uses lime green as a border accent.</p>
                    <button className="lime-outline-btn small">View Details</button>
                  </div>
                </div>
                <div className="caption">Card with Lime Border</div>
              </div>

              <div className="component-item">
                <div className="lime-gradient-card">
                  <div className="card-content">
                    <h4>Premium Olive Oil</h4>
                    <p>Our signature product with exceptional quality.</p>
                    <button className="white-btn small">Shop Now</button>
                  </div>
                </div>
                <div className="caption">Card with Lime Gradient</div>
              </div>
            </div>
          </div>

          <div className="component-set">
            <h3>Navigation & Tags</h3>
            <div className="component-row">
              <div className="component-item">
                <nav className="lime-nav">
                  <div className="nav-item active">Home</div>
                  <div className="nav-item">Products</div>
                  <div className="nav-item">About</div>
                  <div className="nav-item">Contact</div>
                  <div className="nav-item">Support</div>
                </nav>
                <div className="caption">Compact Navigation with Lime Accent</div>
              </div>

              <div className="component-item tag-container">
                <span className="lime-tag">Organic</span>
                <span className="lime-tag">Extra Virgin</span>
                <span className="lime-tag">Cold Pressed</span>
                <span className="lime-tag">New</span>
                <span className="lime-tag">Premium</span>
                <div className="caption">Compact Tags</div>
              </div>

              <div className="component-item">
                <div className="badge-container">
                  <span className="lime-badge">New</span>
                  <span className="lime-outline-badge">Sale</span>
                  <span className="lime-icon-badge">★</span>
                  <span className="lime-badge">20% off</span>
                  <span className="lime-outline-badge">Hot</span>
                </div>
                <div className="caption">Compact Badges</div>
              </div>
            </div>
          </div>
        </section>

        <section className="practical-examples">
          <h2>Practical Examples</h2>

          <div className="example-set">
            <h3>Product Showcase</h3>
            <div className="example-container">
              <div className="product-showcase">
                <div className="product-header">
                  <h2>Our Premium Products</h2>
                  <p>Taste the difference of authentic DikaFood olive oil</p>
                </div>

                <div className="products-grid">
                  <div className="product-card">
                    <div className="product-image"></div>
                    <div className="product-info">
                      <span className="lime-tag">Bestseller</span>
                      <h4>Extra Virgin Olive Oil</h4>
                      <p>500ml cold-pressed, early harvest</p>
                      <div className="price-row">
                        <span className="price">$24.99</span>
                        <button className="lime-primary-btn small">Add to Cart</button>
                      </div>
                    </div>
                  </div>

                  <div className="product-card">
                    <div className="product-image"></div>
                    <div className="product-info">
                      <span className="lime-outline-badge">New</span>
                      <h4>Organic Olive Spread</h4>
                      <p>250g perfect for breakfast</p>
                      <div className="price-row">
                        <span className="price">$12.99</span>
                        <button className="lime-primary-btn small">Add to Cart</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="example-set">
            <h3>Hero Section</h3>
            <div className="example-container">
              <div className="hero-section">
                <div className="hero-content">
                  <h1>Taste the Mediterranean</h1>
                  <p>Experience the authentic flavor of premium olive oil, delivered straight from our family groves.</p>
                  <div className="hero-cta">
                    <button className="lime-primary-btn">Shop Collection</button>
                    <button className="lime-outline-btn">Learn More</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="example-set">
            <h3>Feature Section</h3>
            <div className="example-container">
              <div className="feature-section">
                <div className="section-header">
                  <h2>Why Choose DikaFood</h2>
                  <div className="lime-divider"></div>
                </div>

                <div className="features-grid">
                  <div className="feature-item">
                    <div className="feature-icon lime-icon">★</div>
                    <h4>Premium Quality</h4>
                    <p>Only the finest olives selected for our products</p>
                  </div>

                  <div className="feature-item">
                    <div className="feature-icon lime-icon">♥</div>
                    <h4>Family Tradition</h4>
                    <p>Three generations of expert olive oil production</p>
                  </div>

                  <div className="feature-item">
                    <div className="feature-icon lime-icon">✓</div>
                    <h4>100% Organic</h4>
                    <p>No pesticides or artificial ingredients</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="color-recommendations">
          <h2>Color Usage Recommendations</h2>

          <div className="recommendation-item">
            <h3>Best Practices</h3>
            <ul>
              <li>Use lime green (#AACC00) as an accent color for highlighting important elements</li>
              <li>Pair lime green with the dark green from the logo (#0A5C26) for strong brand identity</li>
              <li>Lime green works well as a background for dark text or as text on dark backgrounds</li>
              <li>Consider using lime green for CTAs and interactive elements to draw attention</li>
              <li>Lime green gradients can create energetic section backgrounds when paired with white or dark green</li>
            </ul>
          </div>

          <div className="recommendation-item">
            <h3>Color Proportions</h3>
            <ul>
              <li>Use lime green as part of the 10% accent color in the 60-30-10 rule</li>
              <li>For increased brand emphasis, lime green can be used for up to 20% of accent elements</li>
              <li>Keep primary surfaces in neutral colors and use lime green for interactive elements</li>
              <li>Avoid using lime green for large text blocks or extensive backgrounds</li>
            </ul>
          </div>

          <div className="recommendation-item">
            <h3>Accessibility Considerations</h3>
            <ul>
              <li>Ensure sufficient contrast when using lime green with text (at least 4.5:1 ratio)</li>
              <li>Dark text (#1C1C1C) on lime green background provides good readability</li>
              <li>White or very light text on lime green does not provide enough contrast - use dark green instead</li>
              <li>Consider color blindness: lime green should be paired with other visual cues</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LimeColorTest;