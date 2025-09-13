import React from 'react';
import Page from '@components/ui/layout/Page';

/**
 * ProductPage component for product detail pages
 *
 * @param {string} title - Page title for SEO
 * @param {string} description - Page description for SEO
 * @param {string} canonicalUrl - Canonical URL for the page
 * @param {React.ReactNode} breadcrumb - Breadcrumb navigation component
 * @param {React.ReactNode} children - Page content
 */
const ProductPage = ({
  title,
  description,
  canonicalUrl,
  breadcrumb,
  children,
  ...pageProps
}) => {
  return (
    <Page
      title={title}
      description={description}
      canonicalUrl={canonicalUrl}
      backgroundClass="bg-gradient-to-b from-lime-50 to-white"
      className="max-w-7xl mx-auto p-4 min-h-screen"
      {...pageProps}
    >
      {breadcrumb && breadcrumb}
      <div className="bg-white rounded-xl shadow-md border border-lime-100 overflow-hidden mt-6">
        {children}
      </div>
    </Page>
  );
};

export default ProductPage;