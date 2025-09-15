import React from 'react';
import Link from 'next/link';
import { Icon } from '@components/ui';

const ProductBreadcrumb = ({ product, className }) => {
  if (!product) return null;

  // Determine category path
  const categoryPath = product.category ?
    (typeof product.category === 'object' && product.category.id)
      ? `/categories/${product.category.id}`
      : `/shop?category=${encodeURIComponent((typeof product.category === 'object' ? product.category.name : product.category).toLowerCase())}`
    : '/shop';

  const categoryName = typeof product.category === 'object' ? product.category.name : product.category;

  return (
    <div className={`fixed top-16 md:top-20 left-0 right-0 z-30 py-1.5 md:py-2 ${className || ''}`}>
      <div className="container max-w-6xl mx-auto px-3 md:px-8 lg:px-12 flex justify-center">
        {/* Mobile view - back to shop only */}
        <div className="md:hidden">
          <div className="inline-flex bg-white rounded-full py-0.5 px-0.5 shadow-md">
            <Link href="/shop" className="flex items-center bg-logo-lime/20 hover:bg-logo-lime/30 transition-colors rounded-full px-2.5 py-1 border border-logo-lime/20">
              <Icon name="caretleft" size="xs" className="text-dark-green-7 mr-1" />
              <span className="text-dark-green-7 font-medium text-sm">Retour</span>
            </Link>
          </div>
        </div>
        
        {/* Desktop view - full breadcrumb */}
        <div className="hidden md:block">
          <div className="inline-flex bg-white border border-logo-lime/30 rounded-full px-4 py-2 items-center gap-3 shadow-sm relative overflow-hidden">
            {/* Transparent lime green overlay */}
            <div className="absolute inset-0 bg-logo-lime/10"></div>

            {/* Breadcrumb content */}
            <div className="relative z-10 flex items-center gap-3">
              <Link href="/" className="flex items-center bg-logo-lime/20 hover:bg-logo-lime/30 transition-colors rounded-full px-4 py-1.5 border border-logo-lime/20">
                <Icon name="house" size="md" className="text-dark-green-7 mr-2" />
                <span className="text-dark-green-7 font-medium">Accueil</span>
              </Link>

              <Icon name="caretright" size="sm" className="text-dark-green-6 opacity-70" />

              <Link href="/shop" className="flex items-center bg-logo-lime/20 hover:bg-logo-lime/30 transition-colors rounded-full px-4 py-1.5 border border-logo-lime/20">
                <Icon name="shoppingcart" size="md" className="text-dark-green-7 mr-2" />
                <span className="text-dark-green-7 font-medium">Boutique</span>
              </Link>

              {categoryName && (
                <>
                  <Icon name="caretright" size="sm" className="text-dark-green-6 opacity-70" />
                  <Link
                    href={categoryPath}
                    className="flex items-center bg-logo-lime/20 hover:bg-logo-lime/30 transition-colors rounded-full px-4 py-1.5 border border-logo-lime/20"
                  >
                    <Icon name="storefront" size="md" className="text-dark-green-7 mr-2" />
                    <span className="text-dark-green-7 font-medium">{categoryName}</span>
                  </Link>
                </>
              )}

              <Icon name="caretright" size="sm" className="text-dark-green-6 opacity-70" />

              <span className="text-dark-green-7 font-medium px-4 py-1.5 border border-logo-lime/10 rounded-full bg-white">
                {product.name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductBreadcrumb;