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
    { id: 'profile', label: 'My Profile', icon: <User size={18} weight="duotone" /> },
    { id: 'orders', label: 'My Orders', icon: <Package size={18} weight="duotone" /> },
    { id: 'payment', label: 'Payment Methods', icon: <CreditCard size={18} weight="duotone" /> },
    { id: 'settings', label: 'Settings', icon: <Gear size={18} weight="duotone" /> }
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