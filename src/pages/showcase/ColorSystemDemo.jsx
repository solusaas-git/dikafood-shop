import React, { useState } from 'react';
import './ColorSystemDemo.scss';
import {
  House,
  ShoppingCart,
  ShoppingBag,
  User,
  Gear,
  MagnifyingGlass,
  PencilSimple,
  Eye,
  Tag,
  SignOut
} from '@phosphor-icons/react';

const ColorSystemDemo = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [showNotification, setShowNotification] = useState(true);

  return (
    <div className="color-system-demo">
      <div className="demo-container">
        <header className="demo-header">
          <h1>DikaFood Color System Implementation</h1>
          <p>Demonstrating how the color system works in a realistic UI context</p>
        </header>

        <main>
          {/* Example of a dashboard-style layout */}
          <div className="app-container">
            {/* Sidebar with floating design and light yellow gradient */}
            <aside className="sidebar">
              <div className="sidebar-header">
                <div className="logo">
                  <svg width="140" height="47" viewBox="0 0 1169 394" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M1153.4 96.7427C1163.57 110.583 1168.51 128.173 1168.51 150.533C1168.51 174.263 1163.19 200.293 1152.24 230.113C1143.75 253.233 1132.82 277.153 1119.72 301.323C1121.11 309.173 1122.82 316.983 1124.81 324.613C1126.46 330.313 1127.29 336.253 1127.29 342.273C1127.29 358.203 1120.84 372.263 1109.11 381.873C1099.44 389.783 1087.36 393.793 1073.21 393.793C1063.13 393.793 1053.8 391.573 1045.65 387.303C1036.93 390.593 1027.46 392.263 1017.4 392.263C998.465 392.263 981.525 385.843 967.915 373.613C952.145 385.833 933.615 392.263 913.935 392.263C895.675 392.263 879.295 387.473 865.265 378.033L865.115 377.933L864.975 377.843L864.845 377.743C861.705 375.583 858.745 373.243 855.955 370.723C839.445 384.823 819.605 392.263 798.435 392.263C780.565 392.263 764.495 387.673 750.665 378.633L750.505 378.553L749.335 377.743C736.195 368.663 726.095 356.563 719.325 341.783C717.835 338.523 716.525 335.203 715.385 331.823C709.925 344.173 703.035 354.543 694.625 363.103C684.685 373.303 672.775 381.023 659.215 386.053C646.755 390.673 632.865 393.023 617.925 393.023C600.015 393.023 583.155 389.063 567.795 381.263L567.465 381.093L567.405 381.063L567.285 380.993C566.195 380.423 565.125 379.833 564.065 379.233C553.965 388.773 540.275 393.793 524.255 393.793C516.345 393.793 508.995 392.573 502.305 390.143C495.295 392.573 487.815 393.793 479.965 393.793C469.255 393.793 458.995 391.503 449.725 387.113C439.075 391.553 427.485 393.793 415.105 393.793C398.565 393.793 383.445 389.923 370.545 382.493C361.125 389.833 349.075 393.793 335.745 393.793C327.135 393.793 319.035 392.013 311.775 388.583C302.815 392.043 293.685 393.793 284.515 393.793C259.935 393.793 239.485 383.273 226.885 364.153L226.775 364.013L226.555 363.653L226.415 363.443L226.275 363.223C224.875 360.973 223.575 358.653 222.385 356.243C214.705 362.593 206.305 368.223 197.225 373.123C171.785 386.843 141.795 393.793 108.085 393.793C96.4846 393.793 83.4446 392.813 69.3447 390.893C53.1646 388.833 40.3647 382.883 31.3046 373.223C24.2046 365.653 15.9946 352.073 17.2146 330.313L17.2446 329.883V329.793C17.2446 329.763 17.2471 329.735 17.2496 329.708C17.2521 329.68 17.2546 329.653 17.2546 329.623C18.5446 311.413 21.5646 289.003 26.2246 263.053C28.5546 249.963 31.1546 237.023 33.9846 224.393C24.7747 221.143 16.7146 215.113 10.7746 206.813L10.5846 206.543L10.4746 206.383L10.4546 206.353L10.3246 206.163L10.0246 205.723C3.97465 196.623 0.764648 185.773 0.764648 174.343C0.764648 163.823 2.95465 154.293 7.26465 146.013C11.6946 137.343 18.3846 129.913 27.1346 123.923L28.2846 123.133L28.3446 123.103C43.5947 112.933 61.2947 105.183 80.9947 100.073C100.115 94.9527 118.965 92.3527 137.015 92.3527C163.755 92.3527 187.745 97.3727 208.315 107.283C227.395 116.333 242.975 129.263 254.745 145.803C265.035 139.613 276.905 136.383 289.635 136.383C295.475 136.383 301.105 137.043 306.445 138.353C308.885 132.763 311.485 127.413 314.225 122.333L314.275 122.233L314.435 121.943C322.325 107.433 331.775 95.8527 342.515 87.5227C354.825 77.9727 368.595 72.7527 383.515 71.9727C383.085 67.2027 382.955 62.9927 382.985 59.4827C383.075 46.7727 388.155 35.3427 397.275 27.2827C405.315 20.1827 415.815 16.2727 426.835 16.2727C435.165 16.2727 443.205 18.5427 450.075 22.8227C462.805 30.7627 478.175 38.3127 491.185 43.0227C497.925 45.4627 502.835 46.7127 506.175 47.3527C506.644 46.6433 507.123 45.8881 507.62 45.1045L507.685 45.0027L507.915 44.6427L507.945 44.6027L507.965 44.5627L508.055 44.4327C511.095 39.6727 515.275 33.1627 520.475 26.9727C528.435 17.5227 537.085 10.7527 546.935 6.29266C555.475 2.43266 564.525 0.472656 573.845 0.472656C590.965 0.472656 609.085 7.14266 627.705 20.3027C641.635 30.1427 648.635 47.3827 645.535 64.2027C643.045 77.7927 634.575 89.2727 622.525 95.6627C622.145 97.9127 621.855 100.923 621.615 104.383C645.805 97.5027 675.675 94.1427 712.125 94.1427C742.775 94.1427 770.405 95.8127 794.285 99.1127L794.415 99.1327L794.585 99.1527C809.245 101.243 819.005 107.213 825.295 113.123C831.625 103.133 839.655 92.6926 849.845 82.3127C876.035 55.6527 910.405 35.6027 952.005 22.7227C956.805 21.2327 961.785 20.4727 966.805 20.4727C979.775 20.4727 992.075 25.4227 1001.4 34.3927C1014.53 46.9727 1019.79 65.7127 1015.13 83.2827C1011.51 96.9627 1003.84 112.713 992.345 130.103C992.251 130.243 992.159 130.383 992.066 130.524C991.882 130.803 991.698 131.083 991.505 131.363C1002.51 134.733 1013.46 139.313 1024.32 145.083C1025.68 140.863 1027.12 136.753 1028.63 132.743L1028.66 132.623L1028.99 131.783C1035.58 114.693 1044.1 100.903 1054.31 90.7927C1067.83 77.4127 1084.64 70.3427 1102.91 70.3427C1123.14 70.3427 1141.06 79.7227 1153.4 96.7427Z" fill="#AACC00"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M479.695 148.424C433.755 127.284 422.795 84.3035 422.975 59.7735C422.995 56.7535 426.345 55.1535 428.905 56.7535C454.995 73.0235 501.195 94.3135 523.205 86.2735C530.465 83.6235 535.765 75.3335 541.395 66.5235C553.455 47.6635 567.055 26.4135 604.625 52.9635C607.375 54.9035 606.465 59.2235 603.355 60.5135C583.535 68.7335 582.435 88.0535 581.255 108.904C580.275 126.204 579.225 144.564 567.385 158.514C555.905 172.034 541.215 175.844 526.595 179.644C506.685 184.814 486.875 189.954 475.395 219.524C474.515 221.794 471.855 222.913 469.775 221.654C450.405 209.864 440.425 188.434 436.465 174.124C435.595 170.964 438.975 168.414 442.185 169.084C457.145 172.234 472.205 162.764 480.945 154.704C482.975 152.824 482.225 149.574 479.705 148.424H479.695ZM973.725 63.2435C976.345 65.7635 977.395 69.5035 976.465 73.0235C973.785 83.1235 967.265 95.4935 958.985 108.014C950.575 120.734 939.875 134.324 928.195 146.954C919.465 156.394 910.075 165.414 900.565 173.164C914.155 167.884 930.475 163.704 949.295 164.364C973.385 165.204 1000.59 173.913 1030.7 196.514C1033.86 198.883 1035.32 202.883 1034.45 206.734C1033.57 210.584 1030.52 213.554 1026.64 214.324C1025.2 214.614 1023.71 214.904 1022.17 215.224C992.465 221.224 945.015 230.804 898.975 202.144C896.515 212.504 897.725 224.114 904.315 232.944C904.635 233.364 904.905 233.803 905.145 234.264C910.585 232.364 916.325 231.414 922.385 231.414C935.355 231.414 945.765 235.934 953.615 244.984C961.635 253.854 965.895 264.104 967.695 278.004C969.045 288.444 967.695 296.184 965.645 304.884C962.405 319.224 956.005 330.743 946.445 339.444C936.885 347.974 926.045 352.243 913.935 352.243C903.695 352.243 894.905 349.764 887.565 344.824C880.395 339.874 874.935 333.304 871.185 325.114C867.425 316.924 865.555 308.043 865.555 298.493C865.555 285.523 868.025 274.004 872.975 263.934C876.805 256.014 881.755 249.464 887.835 244.304C877.095 229.464 875.915 211.384 879.885 196.144C872.625 196.234 863.205 196.784 852.395 198.124C845.915 198.934 839.005 200.014 831.835 201.434C827.445 207.104 824.405 214.694 822.515 222.724C821.645 226.434 821.055 230.074 820.675 233.414C827.455 235.554 833.265 239.413 838.105 244.984C846.125 253.854 850.385 264.104 852.185 278.004C853.535 288.444 852.105 296.184 850.135 304.884C846.895 319.224 840.495 330.743 830.935 339.444C821.375 347.974 810.535 352.243 798.425 352.243C788.185 352.243 779.395 349.764 772.055 344.824C764.885 339.874 759.425 333.304 755.675 325.114C751.915 316.924 750.045 308.043 750.045 298.493C750.045 285.523 752.515 274.004 757.465 263.934C762.415 253.693 769.245 245.754 777.945 240.124C784.935 235.464 792.535 232.674 800.735 231.754C801.195 227.494 801.925 222.874 803.035 218.154C803.815 214.833 804.805 211.364 806.055 207.874C791.595 212.284 777.045 218.184 763.635 225.974C758.855 228.744 752.735 227.124 749.965 222.354C747.195 217.584 748.815 211.454 753.585 208.684C776.395 195.434 801.635 187.344 824.385 182.544C830.375 181.284 836.215 180.244 841.815 179.394C846.445 145.344 876.185 88.0535 963.815 60.9135C967.285 59.8335 971.075 60.7335 973.695 63.2535L973.725 63.2435Z" fill="#0A5C26"/>
                  </svg>
                </div>
              </div>

              <nav className="sidebar-nav">
                <div
                  className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                  onClick={() => setActiveTab('dashboard')}
                >
                  <House weight="duotone" size={20} />
                  <span>Dashboard</span>
                </div>
                <div
                  className={`nav-item ${activeTab === 'products' ? 'active' : ''}`}
                  onClick={() => setActiveTab('products')}
                >
                  <ShoppingBag weight="duotone" size={20} />
                  <span>Products</span>
                </div>
                <div
                  className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                  onClick={() => setActiveTab('orders')}
                >
                  <ShoppingCart weight="duotone" size={20} />
                  <span>Orders</span>
                </div>
                <div
                  className={`nav-item ${activeTab === 'customers' ? 'active' : ''}`}
                  onClick={() => setActiveTab('customers')}
                >
                  <User weight="duotone" size={20} />
                  <span>Customers</span>
                </div>
                <div
                  className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                  onClick={() => setActiveTab('settings')}
                >
                  <Gear weight="duotone" size={20} />
                  <span>Settings</span>
                </div>
              </nav>

              <div className="sidebar-footer">
                <div className="profile-section">
                  <div className="profile-avatar">
                    <User weight="duotone" size={20} />
                  </div>
                  <div className="profile-info">
                    <span className="profile-name">Ahmed Alami</span>
                    <span className="profile-email">ahmed@dikafoods.ma</span>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main content using white background */}
            <div className="content-area">
              {/* Page title only - search has been moved to filter section */}
              <div className="page-title">Products</div>

              {/* Notification using dark yellow for CTA highlight */}
              {showNotification && (
                <div className="notification">
                  <div className="notification-content">
                    <p><strong>Complete your profile!</strong> Please add your business details to unlock all features.</p>
                  </div>
                  <div className="notification-actions">
                    <button className="primary-cta">Complete Profile</button>
                    <button
                      className="dismiss-btn"
                      onClick={() => setShowNotification(false)}
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}

              {/* Content section using white background */}
              <div className="content-wrapper">
                <div className="content-header-bar">
                  <h2>Product Catalog</h2>
                  <button className="add-product-btn">
                    <ShoppingBag weight="duotone" size={16} /> Add Product
                  </button>
                </div>

                <div className="filter-section">
                  <div className="filter-group">
                    <label>Category:</label>
                    <select>
                      <option>All Categories</option>
                      <option>Olive Oil</option>
                      <option>Olives</option>
                      <option>Spreads</option>
                    </select>
                  </div>

                  <div className="filter-group">
                    <label>Status:</label>
                    <div className="status-filters">
                      <span className="status-filter active">All</span>
                      <span className="status-filter">Active</span>
                      <span className="status-filter">Draft</span>
                      <span className="status-filter">Archived</span>
                    </div>
                  </div>

                  <div className="search-box">
                    <input type="text" placeholder="Search products..." />
                    <button className="search-btn">
                      <MagnifyingGlass weight="bold" size={16} />
                    </button>
                  </div>
                </div>

                <div className="product-grid">
                  {/* Product card 1 */}
                  <div className="product-card">
                    <div className="product-image"></div>
                    <div className="product-info">
                      <div className="product-tags">
                        <span className="product-tag bestseller">Bestseller</span>
                        <span className="product-tag organic">Organic</span>
                      </div>
                      <h3>Extra Virgin Olive Oil</h3>
                      <p className="product-description">Premium cold-pressed olive oil from the Mediterranean region.</p>
                      <div className="product-meta">
                        <span className="product-price">249.99</span>
                        <span className="product-status in-stock">In Stock</span>
                      </div>
                      <div className="product-actions">
                        <button className="product-action-btn edit">Edit</button>
                        <button className="product-action-btn view">View</button>
                      </div>
                    </div>
                  </div>

                  {/* Product card 2 */}
                  <div className="product-card">
                    <div className="product-image special-offer"></div>
                    <div className="product-info">
                      <div className="product-tags">
                        <span className="product-tag new">New</span>
                        <span className="product-tag sale">Sale</span>
                      </div>
                      <h3>Kalamata Olives</h3>
                      <p className="product-description">Premium Greek olives with a rich, fruity flavor profile.</p>
                      <div className="product-meta">
                        <span className="product-price">129.99</span>
                        <span className="product-status low-stock">Low Stock</span>
                      </div>
                      <div className="product-actions">
                        <button className="product-action-btn edit">Edit</button>
                        <button className="product-action-btn view">View</button>
                      </div>
                    </div>
                  </div>

                  {/* Product card 3 */}
                  <div className="product-card">
                    <div className="product-image"></div>
                    <div className="product-info">
                      <div className="product-tags">
                        <span className="product-tag organic">Organic</span>
                      </div>
                      <h3>Olive Tapenade</h3>
                      <p className="product-description">Traditional olive spread made with our finest olives.</p>
                      <div className="product-meta">
                        <span className="product-price">99.99</span>
                        <span className="product-status in-stock">In Stock</span>
                      </div>
                      <div className="product-actions">
                        <button className="product-action-btn edit">Edit</button>
                        <button className="product-action-btn view">View</button>
                      </div>
                    </div>
                  </div>

                  {/* Product card 4 with featured treatment */}
                  <div className="product-card featured">
                    <div className="featured-badge">Featured</div>
                    <div className="product-image premium"></div>
                    <div className="product-info">
                      <div className="product-tags">
                        <span className="product-tag premium">Premium</span>
                        <span className="product-tag limited">Limited</span>
                      </div>
                      <h3>Premium Gift Box</h3>
                      <p className="product-description">Curated selection of our finest products in an elegant gift box.</p>
                      <div className="product-meta">
                        <span className="product-price">499.99</span>
                        <span className="product-status in-stock">In Stock</span>
                      </div>
                      <div className="product-actions">
                        <button className="product-action-btn edit">Edit</button>
                        <button className="product-action-btn view">View</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pagination">
                  <button className="pagination-btn prev" disabled>Previous</button>
                  <span className="pagination-page active">1</span>
                  <span className="pagination-page">2</span>
                  <span className="pagination-page">3</span>
                  <button className="pagination-btn next">Next</button>
                </div>
              </div>
            </div>
          </div>
        </main>

        <section className="color-system-explanation">
          <h2>Color System Implementation Details</h2>

          <div className="color-explanation-item">
            <h3>Navigation & UI Elements</h3>
            <div className="color-sample neutral-background"></div>
            <p>
              <strong>Floating Sidebar with Light Yellow Gradient:</strong> Provides depth and visual separation
              <br />
              <code>linear-gradient(135deg, white 0%, var(--light-yellow-1) 100%)</code> for sidebar background
              <br />
              Clean white content area with subtle borders for a modern, airy interface design.
            </p>
          </div>

          <div className="color-explanation-item">
            <h3>Text & Foreground</h3>
            <div className="color-samples">
              <div className="color-sample dark-text">Aa</div>
              <div className="color-sample white-text">Aa</div>
            </div>
            <p>
              <strong>Dark Text:</strong> <code>#1C1C1C</code> with moderate font weights for better readability
              <br />
              <strong>White Text:</strong> <code>#FFFFFF</code> on dark green buttons for clear call-to-actions
              <br />
              All buttons, form elements, and interactive components feature fully rounded corners for a friendly, modern look.
            </p>
          </div>

          <div className="color-explanation-item">
            <h3>Product Cards & Price Styling</h3>
            <p>
              <strong>Portrait-oriented product cards:</strong> Optimized for product images with height &gt; width
              <br />
              <strong>Price display:</strong> Light background with Moroccan Dirham (MAD) currency indication and coin icon
              <br />
              <strong>Status indicators:</strong> Color-coded with dot indicators for quick visual recognition
              <br />
              <strong>Profile section:</strong> Positioned at the bottom of the sidebar for easy access to account options
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ColorSystemDemo;