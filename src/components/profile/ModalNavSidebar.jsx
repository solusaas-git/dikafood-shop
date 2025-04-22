import React from 'react';
import {
  User,
  Package,
  CreditCard,
  Gear
} from '@phosphor-icons/react';
import './profile-modals.scss';

const ModalNavSidebar = ({ activeSection, onSectionChange }) => {
  const navItems = [
    { id: 'profile', label: 'Mon Profil', icon: <User size={18} weight="duotone" /> },
    { id: 'orders', label: 'Mes Commandes', icon: <Package size={18} weight="duotone" /> },
    { id: 'payment', label: 'Moyens de Paiement', icon: <CreditCard size={18} weight="duotone" /> },
    { id: 'settings', label: 'Paramètres', icon: <Gear size={18} weight="duotone" /> }
  ];

  return (
    <div className="modal-nav-sidebar">
      <ul className="nav-items">
        {navItems.map(item => (
          <li
            key={item.id}
            className={activeSection === item.id ? 'active' : ''}
            onClick={() => onSectionChange(item.id)}
          >
            {item.icon}
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ModalNavSidebar;