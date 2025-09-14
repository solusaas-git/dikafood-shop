import React from 'react';
import Head from 'next/head';
import { usePathname } from 'next/navigation';
import config from '@/config';

/**
 * PageMeta component for managing document head tags consistently across the application
 *
 * @param {string} title - Page title (will be appended with site name)
 * @param {string} description - Meta description for SEO
 * @param {string} canonicalUrl - Canonical URL for the page
 * @param {string} imageUrl - Open Graph image URL
 * @param {string} type - Open Graph content type (default: 'website')
 * @param {Object} additionalMeta - Additional meta tags as key-value pairs
 */
const PageMeta = ({
  title,
  description,
  canonicalUrl,
  imageUrl = '/images/dikafood-social.jpg',
  type = 'website',
  additionalMeta = {},
}) => {
  const pathname = usePathname();
  const isHomePage = pathname === '/' || pathname === '/home';

  // Format the title with site name
  const formattedTitle = title ? `${title} | DikaFood` : 'DikaFood - Épicerie africaine en ligne';

  // Default description if not provided
  const metaDescription = description ||
    'DikaFood, votre épicerie africaine en ligne. Découvrez nos produits authentiques livrés directement chez vous.';

  // Base URL for canonical and OG URLs
  const baseUrl = config.FRONTEND.baseUrl;
  const fullCanonicalUrl = canonicalUrl ? `${baseUrl}${canonicalUrl}` : baseUrl;
  const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{formattedTitle}</title>
      <meta name="description" content={metaDescription} />
      {canonicalUrl && <link rel="canonical" href={fullCanonicalUrl} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={formattedTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:site_name" content="DikaFood" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={formattedTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={fullImageUrl} />

      {/* Additional meta tags */}
      {Object.entries(additionalMeta).map(([name, content]) => (
        <meta key={name} name={name} content={content} />
      ))}

      {/* Conditional preloading based on page */}
      {isHomePage && (
        <>
          <link rel="preload" href="/images/backgrounds/hero-banner.webp" as="image" type="image/webp" fetchPriority="high" />
        </>
      )}
    </Head>
  );
};

export default PageMeta;