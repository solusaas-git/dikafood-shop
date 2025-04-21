import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './management.scss';
import {
  Package,
  ShoppingCart,
  Users,
  Bank,
  Truck,
  Clock,
  User,
  ChartPie,
  Gear,
  SignOut,
  ArrowRight,
  List,
  X
} from '@phosphor-icons/react';

const Management = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { path: '/management', label: 'Dashboard', icon: <ChartPie size={20} weight="fill" /> },
    { path: '/management/products', label: 'Produits', icon: <Package size={20} weight="fill" /> },
    { path: '/management/orders', label: 'Commandes', icon: <ShoppingCart size={20} weight="fill" /> },
    { path: '/management/customers', label: 'Clients', icon: <Users size={20} weight="fill" /> },
    { path: '/management/banks', label: 'Banques', icon: <Bank size={20} weight="fill" /> },
    { path: '/management/delivery', label: 'Méthodes de livraison', icon: <Truck size={20} weight="fill" /> },
    { path: '/management/sessions', label: 'Sessions', icon: <Clock size={20} weight="fill" /> },
    { path: '/management/users', label: 'Utilisateurs', icon: <User size={20} weight="fill" /> },
    { path: '/management/settings', label: 'Paramètres', icon: <Gear size={20} weight="fill" /> },
  ];

  const getPageTitle = () => {
    const currentItem = menuItems.find(item => location.pathname === item.path);
    return currentItem ? currentItem.label : 'Gestion de contenu';
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <Helmet>
        <title>{getPageTitle()} | DikaFood Management</title>
      </Helmet>

      <div className="management-container">
        {/* Mobile menu toggle */}
        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <X size={24} /> : <List size={24} />}
          <span>{getPageTitle()}</span>
        </button>

        {/* Sidebar */}
        <aside className={`management-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <div className="sidebar-header">
            <h2>DikaFood</h2>
            <p>Panneau d'administration</p>
          </div>

          <nav className="sidebar-nav">
            <ul>
              {menuItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.path === '/management'}
                    className={({ isActive }) => isActive ? 'active' : ''}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    <ArrowRight size={16} className="nav-arrow" />
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="sidebar-footer">
            <NavLink to="/" className="back-to-site">
              <span>Retour au site</span>
            </NavLink>
            <button className="logout-button">
              <SignOut size={20} />
              <span>Déconnexion</span>
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="management-content">
          <div className="management-header">
            <h1>{getPageTitle()}</h1>
          </div>

          <div className="management-body">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
};

export default Management;