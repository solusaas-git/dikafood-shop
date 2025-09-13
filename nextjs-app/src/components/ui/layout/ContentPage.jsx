import React from 'react';
import Page from '@components/ui/layout/Page';
import ContentContainer from '@components/ui/layout/ContentContainer';

/**
 * ContentPage component for pages with a centered content container
 *
 * @param {string} title - Page title for SEO
 * @param {string} description - Page description for SEO
 * @param {string} canonicalUrl - Canonical URL for the page
 * @param {string} containerTitle - Title for the content container
 * @param {string} headerVariant - Header variant for the content container
 * @param {string} bodyAlign - Body alignment for the content container
 * @param {string} maxWidth - Max width for the container wrapper
 * @param {string} paddingY - Vertical padding class
 * @param {React.ReactNode} children - Page content
 */
const ContentPage = ({
  title,
  description,
  canonicalUrl,
  containerTitle,
  headerVariant = 'default',
  bodyAlign = 'left',
  maxWidth = 'max-w-[520px]',
  paddingY = 'py-8',
  children,
  ...pageProps
}) => {
  return (
    <Page
      title={title}
      description={description}
      canonicalUrl={canonicalUrl}
      backgroundClass="pt-32 pb-4 bg-gradient-to-b from-lime-50 to-white"
      {...pageProps}
    >
      <div className={`flex flex-col items-center justify-center ${paddingY} px-4`}>
        <div className={`w-full ${maxWidth}`}>
          <ContentContainer
            title={containerTitle}
            headerVariant={headerVariant}
            bodyAlign={bodyAlign}
          >
            {children}
          </ContentContainer>
        </div>
      </div>
    </Page>
  );
};

export default ContentPage;