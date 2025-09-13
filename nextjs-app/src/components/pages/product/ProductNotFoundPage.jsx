import React from 'react';
import { useSearchParams } from 'next/navigation';
import Icon from '@components/ui/icons/Icon';
import Button from '@components/ui/inputs/Button';
import ContentPage from '@components/ui/layout/ContentPage';
import useAppNavigation from '@/hooks/useAppNavigation';

/**
 * ProductNotFoundPage component
 * Displayed when a product cannot be found or there's an error loading it
 */
const ProductNotFoundPage = () => {
  // Get error message from URL parameters
  const [searchParams] = useSearchParams();
  const error = searchParams.get('error');
  const navigation = useAppNavigation();

  return (
    <ContentPage
      title="Produit introuvable"
      description="Le produit que vous recherchez n'a pas été trouvé."
      canonicalUrl="/produits/not-found"
      containerTitle="Produit introuvable"
      bodyAlign="center"
    >
      {/* Icon in a container */}
      <div className="w-20 h-20 rounded-full bg-logo-lime/15 border border-logo-lime/30 flex items-center justify-center mb-6">
        <Icon
          name="shoppingbag"
          size="3xl"
          color="dark-green"
          weight="duotone"
        />
      </div>

      <p className="text-dark-green-6 text-center mb-8">
        {error || "Nous n'avons pas pu trouver le produit que vous recherchez."}
      </p>

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 w-full mb-6">
        <Button
          to="/produits"
          label="Voir tous les produits"
          variant="lime"
          size="md"
          iconName="shoppingbag"
          iconPosition="left"
          isFullWidth
          className="whitespace-nowrap"
        />

        <Button
          onClick={navigation.goHome}
          label="Retour à l'accueil"
          variant="limeOutline"
          size="md"
          iconName="house"
          iconPosition="left"
          isFullWidth
          className="whitespace-nowrap"
        />
      </div>

      {/* Back navigation */}
      <div className="mt-8 text-center">
        <Button
          onClick={navigation.goBack}
          label="Retour à la page précédente"
          variant="link"
          size="sm"
          iconName="arrowleft"
          iconPosition="left"
          className="text-dark-green-6 hover:text-logo-lime hover:translate-x-2"
        />
      </div>
    </ContentPage>
  );
};

export default ProductNotFoundPage;