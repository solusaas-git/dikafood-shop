import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '@components/ui/layout/MainLayout';
import HomePage from '@components/pages/HomePage';
import ShopPage from '@components/pages/shop/ShopPage';
import CheckoutPage from '@components/pages/checkout/CheckoutPage';
import SimpleCheckoutPage from '@components/pages/checkout/SimpleCheckoutPage';
import ProductDetailPage from '@components/pages/product/ProductDetailPage';
import ProductNotFoundPage from '@components/pages/product/ProductNotFoundPage';
import VerificationSuccessPage from '@components/pages/auth/VerificationSuccessPage';
import PasswordResetPage from '@components/pages/auth/PasswordResetPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="menu" element={<ShopPage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="produits/not-found" element={<ProductNotFoundPage />} />
        <Route path="produits/:productId" element={<ProductDetailPage />} />
        <Route path="checkout" element={<SimpleCheckoutPage />} />
      </Route>
      <Route path="/verify-email" element={<VerificationSuccessPage />} />
      <Route path="/v" element={<VerificationSuccessPage />} />
      <Route path="/reset-password" element={<PasswordResetPage />} />
    </Routes>
  );
};

export default AppRoutes;