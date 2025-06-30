import React from 'react';
import './ColorsShowcase.scss';

const ColorSwatch = ({ colorName, colorValue, textColor = '#fff' }) => (
  <div className="color-swatch">
    <div className="color-sample" style={{ backgroundColor: colorValue }}>
      <span style={{ color: textColor }}>{colorName}</span>
    </div>
    <div className="color-details">
      <span className="color-value">{colorValue}</span>
    </div>
  </div>
);

const GradientSwatch = ({ name, gradient, textColor = '#fff' }) => (
  <div className="gradient-swatch">
    <div className="gradient-sample" style={{ background: gradient }}>
      <span style={{ color: textColor }}>{name}</span>
    </div>
    <div className="gradient-details">
      <span className="gradient-value">{gradient}</span>
    </div>
  </div>
);

const ColorGroup = ({ title, colors }) => (
  <div className="color-group">
    <h3>{title}</h3>
    <div className="swatches-container">
      {colors.map((color) => (
        <ColorSwatch
          key={color.name}
          colorName={color.name}
          colorValue={color.value}
          textColor={color.textColor || '#fff'}
        />
      ))}
    </div>
  </div>
);

const GradientGroup = ({ title, gradients }) => (
  <div className="gradient-group">
    <h3>{title}</h3>
    <div className="gradients-container">
      {gradients.map((gradient) => (
        <GradientSwatch
          key={gradient.name}
          name={gradient.name}
          gradient={gradient.value}
          textColor={gradient.textColor || '#fff'}
        />
      ))}
    </div>
  </div>
);

const ColorUsageExample = () => {
  return (
    <div className="color-usage-example">
      <h3>60-30-10 Rule Example</h3>

      <div className="example-container">
        {/* Primary color (60%) - Background */}
        <div className="example-layout" style={{ backgroundColor: '#F9F7F0' }}>
          {/* Header area */}
          <div className="example-header">
            <div className="example-logo" style={{ color: '#08451C' }}>DikaFood</div>
            <div className="example-nav">
              <div className="nav-item active" style={{ color: '#08451C', fontWeight: 600 }}>Home</div>
              <div className="nav-item" style={{ color: 'rgba(8, 69, 28, 0.7)' }}>Products</div>
              <div className="nav-item" style={{ color: 'rgba(8, 69, 28, 0.7)' }}>About</div>
            </div>
          </div>

          {/* Content area */}
          <div className="example-content">
            <div className="content-left">
              <h4 style={{ color: '#08451C' }}>Organic Olive Oil</h4>
              <p style={{ color: '#08451C' }}>Our premium olive oil is made from handpicked olives and cold-pressed to preserve its rich flavor and nutrients.</p>
              {/* Secondary color (30%) - Button */}
              <button style={{ backgroundColor: '#08451C', color: 'white' }}>
                Shop Now
              </button>
            </div>

            {/* Secondary color (30%) - Cards */}
            <div className="content-right">
              <div className="example-card" style={{ backgroundColor: '#08451C' }}>
                <div className="card-header" style={{ color: 'white' }}>Premium Quality</div>
                <div className="card-body" style={{ color: 'white' }}>Made from the finest olives</div>
              </div>

              <div className="example-card" style={{ backgroundColor: '#08451C' }}>
                <div className="card-header" style={{ color: 'white' }}>100% Organic</div>
                <div className="card-body" style={{ color: 'white' }}>No pesticides or additives</div>
              </div>
            </div>
          </div>

          {/* Footer area with accent elements */}
          <div className="example-footer">
            <div className="footer-text" style={{ color: '#08451C' }}>© 2023 DikaFood</div>
            {/* Accent color (10%) - Icons and highlights */}
            <div className="accent-elements">
              <div className="accent-badge" style={{ backgroundColor: '#EBEB47', color: '#08451C' }}>New</div>
              <div className="accent-icon" style={{ backgroundColor: '#EBEB47', color: '#08451C' }}>★</div>
            </div>
          </div>
        </div>
      </div>

      <div className="example-explanation">
        <div className="color-distribution">
          <div className="color-percentage" style={{ backgroundColor: '#F9F7F0', color: '#08451C' }}>
            <strong>60%</strong> - Primary (off-white)
          </div>
          <div className="color-percentage" style={{ backgroundColor: '#08451C', color: 'white' }}>
            <strong>30%</strong> - Secondary (dark-green-7)
          </div>
          <div className="color-percentage" style={{ backgroundColor: '#EBEB47', color: '#08451C' }}>
            <strong>10%</strong> - Accent (dark-yellow-1)
          </div>
        </div>
        <p>This example shows how using an off-white as the primary color creates a clean, bright foundation that's easy on the eyes. The dark green provides strong contrast for important UI elements, while the yellow accent adds energy to key elements.</p>
      </div>
    </div>
  );
};

const ColorsShowcase = () => {
  const greenColors = [
    { name: 'dark-green-7', value: '#08451C' },
    { name: 'dark-green-5', value: '#006622' },
    { name: 'dark-green-6', value: '#226600' },
    { name: 'dark-green-1', value: '#0A5C25' },
    { name: 'logo-green', value: '#0A5C26' },
    { name: 'dark-green-2', value: '#0D732F' },
    { name: 'dark-green-3', value: '#0F8A38' },
    { name: 'dark-green-8', value: '#339900' },
    { name: 'dark-green-4', value: '#12A141' },
  ];

  const yellowColors = [
    { name: 'dark-yellow-1', value: '#EBEB47', textColor: '#1C1C1C' },
    { name: 'logo-lime', value: '#AACC00', textColor: '#1C1C1C' },
    { name: 'light-yellow-4', value: '#F5F5A3', textColor: '#1C1C1C' },
    { name: 'light-yellow-3', value: '#F9F9D2', textColor: '#1C1C1C' },
    { name: 'light-yellow-2', value: '#FAFAD1', textColor: '#1C1C1C' },
    { name: 'light-yellow-1', value: '#FCFCE8', textColor: '#1C1C1C' },
  ];

  const errorColors = [
    { name: 'error', value: '#DC2626' },
    { name: 'error-light', value: '#FEE2E2', textColor: '#1C1C1C' },
    { name: 'error-dark', value: '#B91C1C' },
  ];

  const successColors = [
    { name: 'success', value: '#4caf50' },
    { name: 'success-light', value: '#c8e6c9', textColor: '#1C1C1C' },
    { name: 'success-lighter', value: '#e6f4ea', textColor: '#1C1C1C' },
    { name: 'success-dark', value: '#388e3c' },
  ];

  const accentColors = [
    { name: 'accent-lime', value: '#AACC00', textColor: '#1C1C1C' },
    { name: 'accent-orange', value: '#E5801A' },
    { name: 'accent-yellow', value: '#EBEB47', textColor: '#1C1C1C' },
  ];

  const textColors = [
    { name: 'text-primary', value: '#1C1C1C' },
    { name: 'text-muted', value: '#6e6e6e' },
    { name: 'border-color', value: '#e0e0e0', textColor: '#1C1C1C' },
    { name: 'background-color', value: '#ffffff', textColor: '#1C1C1C' },
  ];

  const backgroundGradients = [
    {
      name: 'Benefits Section Background',
      value: 'linear-gradient(135deg, var(--dark-green-7) 0%, var(--dark-green-6) 100%)',
    },
    {
      name: 'FAQ Section Background',
      value: 'linear-gradient(180deg, var(--dark-green-6) 0%, var(--dark-green-7) 100%)',
    },
    {
      name: 'Catalog Form Background',
      value: 'linear-gradient(135deg, white 0%, var(--light-yellow-1) 100%)',
      textColor: '#1C1C1C',
    },
    {
      name: 'Hero Overlay',
      value: 'linear-gradient(135deg, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0.4) 100%)',
    },
  ];

  const cardGradients = [
    {
      name: 'Contact Info Header',
      value: 'linear-gradient(135deg, var(--light-yellow-2) 0%, var(--light-yellow-1) 100%)',
      textColor: '#1C1C1C',
    },
    {
      name: 'Benefit Card Overlay',
      value: 'linear-gradient(135deg, rgba(8, 69, 28, 0.97) 0%, rgba(34, 102, 0, 0.95) 100%)',
    },
    {
      name: 'Benefit Card Hover Overlay',
      value: 'linear-gradient(135deg, rgba(8, 69, 28, 0.92) 0%, rgba(34, 102, 0, 0.9) 100%)',
    },
    {
      name: 'Form Side Background',
      value: 'linear-gradient(135deg, var(--light-yellow-2) 0%, var(--light-yellow-1) 100%)',
      textColor: '#1C1C1C',
    },
  ];

  const overlayGradients = [
    {
      name: 'Top Divider',
      value: 'linear-gradient(to right, transparent, rgba(232, 252, 239, 0.15), transparent)',
      textColor: '#1C1C1C',
    },
    {
      name: 'Bottom Divider',
      value: 'linear-gradient(to right, transparent, rgba(232, 252, 239, 0.15), transparent)',
      textColor: '#1C1C1C',
    },
    {
      name: 'Vignette Overlay',
      value: 'radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.08) 100%)',
    },
    {
      name: 'Accent Radial',
      value: 'radial-gradient(circle at center, rgba(235, 235, 71, 0.08) 0%, transparent 70%)',
      textColor: '#1C1C1C',
    },
  ];

  return (
    <div className="colors-showcase">
      <div className="container">
        <header className="page-header">
          <h1>DikaFood Colors</h1>
          <p>Color system used throughout the DikaFood application</p>
        </header>

        <section className="colors-container">
          <ColorGroup title="Text Colors" colors={textColors} />
          <ColorGroup title="Green Palette" colors={greenColors} />
          <ColorGroup title="Yellow Palette" colors={yellowColors} />
          <ColorGroup title="Error Colors" colors={errorColors} />
          <ColorGroup title="Success Colors" colors={successColors} />
          <ColorGroup title="Accent Colors" colors={accentColors} />
        </section>

        <section className="color-usage-examples">
          <h2>Color Usage Examples</h2>
          <p>Visual examples showing how to apply our color system following the 60-30-10 rule</p>

          <ColorUsageExample />
        </section>

        <section className="gradients-section">
          <h2>Gradients</h2>
          <p>Gradients used to create depth, highlight areas, and provide visual interest throughout the app</p>

          <div className="gradients-container">
            <GradientGroup title="Background Gradients" gradients={backgroundGradients} />
            <GradientGroup title="Card Gradients" gradients={cardGradients} />
            <GradientGroup title="Overlay & Divider Gradients" gradients={overlayGradients} />
          </div>
        </section>

        <section className="usage-section">
          <h2>Color Usage Guidelines</h2>

          <div className="usage-item">
            <h3>The 60-30-10 Color Rule</h3>
            <p>Our color system follows the 60-30-10 rule for balanced and harmonious designs:</p>
            <ul>
              <li><strong>60% - Primary (off-white #F9F7F0)</strong>: Main color used for backgrounds, large surfaces, and page containers</li>
              <li><strong>30% - Secondary (dark-green-7 #08451C)</strong>: Supporting color used for interactive elements, buttons, and key UI components</li>
              <li><strong>10% - Accent (dark-yellow-1 #EBEB47)</strong>: Vibrant color for emphasis, highlighting, and calls-to-action</li>
            </ul>
          </div>

          <div className="usage-item">
            <h3>Color Roles</h3>
            <p>Each color in our palette serves a specific purpose:</p>
            <ul>
              <li><strong>Primary: off-white (#F9F7F0)</strong> - Base color for page backgrounds, sections, and containers</li>
              <li><strong>Secondary: dark-green-7 (#08451C)</strong> - Brand color used for interactive elements, headers, and important content</li>
              <li><strong>Accent: dark-yellow-1 (#EBEB47)</strong> - Used for highlights, badges, important notifications, and to draw attention</li>
              <li><strong>Neutral: text-primary/text-muted</strong> - Used for secondary text and subtle UI elements</li>
            </ul>
          </div>

          <div className="usage-item">
            <h3>Practical Applications</h3>
            <p>How to effectively use our color palette:</p>
            <ul>
              <li><strong>Backgrounds:</strong> Use off-white for main page backgrounds and large surfaces (60%)</li>
              <li><strong>UI Elements:</strong> Use dark green for buttons, navigation, headers, and important content (30%)</li>
              <li><strong>Highlights:</strong> Use dark-yellow-1 sparingly for badges, notifications, and accent details (10%)</li>
              <li><strong>Text:</strong> Use dark-green-7 on light backgrounds and white/light-yellow-1 on dark green elements</li>
            </ul>
          </div>

          <div className="usage-item">
            <h3>Color Balancing</h3>
            <p>Creating balance between our key colors:</p>
            <ul>
              <li><strong>Off-White Primary (#F9F7F0)</strong>: Creates a clean, bright foundation that's easy on the eyes</li>
              <li><strong>Natural Harmony:</strong> The subtle warm undertone connects with olive oil's natural color, reinforcing our organic positioning</li>
              <li><strong>Improved Readability:</strong> Dark green text on off-white background offers excellent contrast and reduces eye strain</li>
              <li><strong>Visual Hierarchy:</strong> The high contrast between off-white and dark green helps users quickly identify interactive elements</li>
            </ul>
          </div>

          <div className="usage-item">
            <h3>Accessibility Considerations</h3>
            <p>Ensure sufficient contrast when using our colors:</p>
            <ul>
              <li>Use light text (white or light-yellow-1) on dark green backgrounds</li>
              <li>Use dark text (text-primary) on light backgrounds and yellow accents</li>
              <li>Avoid using yellow text on white backgrounds or white text on yellow backgrounds</li>
              <li>Primary buttons should use dark-green-3 with white text for best visibility</li>
            </ul>
          </div>

          <div className="usage-item">
            <h3>Feedback Colors</h3>
            <p>In addition to our main color scheme, use semantic colors for user feedback:</p>
            <ul>
              <li><strong>Success:</strong> Use success colors for positive feedback and confirmations</li>
              <li><strong>Error:</strong> Use error colors for error messages and destructive actions</li>
            </ul>
          </div>

          <div className="usage-item">
            <h3>Gradient Usage</h3>
            <p>Gradients add depth and visual interest to the UI:</p>
            <ul>
              <li><strong>Primary Gradients:</strong> dark-green-7 to dark-green-6 for section backgrounds</li>
              <li><strong>Secondary Gradients:</strong> light-yellow combinations for cards and highlights</li>
              <li><strong>Overlays:</strong> Use gradient overlays to improve text readability on images</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ColorsShowcase;