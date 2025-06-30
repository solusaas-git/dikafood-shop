import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '@components/ui/layout/Header';
import Footer from '@components/ui/layout/Footer';

/**
 * MainLayout component
 * Provides the main application layout with header and footer
 * Conditionally hides footer on checkout pages for better UX
 */
const MainLayout = () => {
  const location = useLocation();
  
  // Hide footer on checkout pages to minimize distractions
  const shouldHideFooter = location.pathname.startsWith('/checkout');

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-grow relative z-1">
        <Outlet />
      </main>

      {!shouldHideFooter && <Footer />}
    </div>
  );
};

export default MainLayout;