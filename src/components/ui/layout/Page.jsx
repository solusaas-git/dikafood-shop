import React from 'react';
import PageMeta from '@components/ui/seo/PageMeta';

/**
 * Page component for consistent page layout and metadata
 *
 * @param {string} title - Page title for SEO
 * @param {string} description - Page description for SEO
 * @param {string} canonicalUrl - Canonical URL for the page
 * @param {string} imageUrl - Open Graph image URL
 * @param {string} type - Open Graph content type
 * @param {Object} additionalMeta - Additional meta tags
 * @param {string} className - Additional CSS classes for the page container
 * @param {string} backgroundClass - CSS class for the background
 * @param {React.ReactNode} children - Page content
 */
const Page = ({
  title,
  description,
  canonicalUrl,
  imageUrl,
  type,
  additionalMeta,
  className = '',
  backgroundClass = 'bg-white',
  children,
}) => {
  return (
    <>
      <PageMeta
        title={title}
        description={description}
        canonicalUrl={canonicalUrl}
        imageUrl={imageUrl}
        type={type}
        additionalMeta={additionalMeta}
      />
      <main className={`${backgroundClass} ${className} pt-20 min-h-screen`}>
        {children}
      </main>
    </>
  );
};

export default Page;