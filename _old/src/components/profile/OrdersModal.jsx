import React, { useEffect } from 'react';
import Modal from '../ui/modal/Modal';
import ModalNavSidebar from './ModalNavSidebar';
import { Package, Calendar, ShoppingBag, Receipt, ArrowRight } from '@phosphor-icons/react';
import './profile-modals.scss';

// Sample order data for demonstration
const SAMPLE_ORDERS = [
  {
    id: 'ORD102938',
    date: '2023-09-15',
    status: 'Livré',
    total: 126.50,
    items: 3
  },
  {
    id: 'ORD102457',
    date: '2023-08-22',
    status: 'Livré',
    total: 94.75,
    items: 2
  },
  {
    id: 'ORD101890',
    date: '2023-07-10',
    status: 'Livré',
    total: 212.30,
    items: 5
  }
];

const OrdersModal = ({ isOpen, onClose, initialSection = 'orders' }) => {
  // In a real application, you would fetch orders from an API
  const orders = SAMPLE_ORDERS;

  // Reset sidebar active section when modal opens
  useEffect(() => {
    // This is just to ensure the sidebar highlights the correct tab
    // No state to update in this component
  }, [isOpen]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MAD'
    }).format(amount);
  };

  const handleSectionChange = (section) => {
    // If navigating to a different section modal
    if (section !== 'orders') {
      // Call the parent's onClose with the next section to navigate to
      onClose(section);
    }
  };

  const renderOrdersContent = () => {
    return (
      <div className="orders-modal">
        {orders.length === 0 ? (
          <div className="no-orders">
            <ShoppingBag size={48} weight="duotone" />
            <p>Vous n'avez pas encore passé de commande.</p>
            <button className="btn-primary">Commencer vos achats</button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-title">
                    <Package size={20} weight="duotone" />
                    <span>Commande #{order.id}</span>
                  </div>
                  <div className={`order-status ${order.status.toLowerCase()}`}>
                    {order.status}
                  </div>
                </div>

                <div className="order-details">
                  <div className="order-detail-item">
                    <Calendar size={16} weight="duotone" />
                    <span>Commandé le {formatDate(order.date)}</span>
                  </div>
                  <div className="order-detail-item">
                    <ShoppingBag size={16} weight="duotone" />
                    <span>{order.items} {order.items === 1 ? 'article' : 'articles'}</span>
                  </div>
                  <div className="order-detail-item">
                    <Receipt size={16} weight="duotone" />
                    <span>Total: {formatCurrency(order.total)}</span>
                  </div>
                </div>

                <button className="view-order-btn">
                  Voir les détails
                  <ArrowRight size={16} weight="bold" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => onClose()}
      title="Mon Compte"
      sidebar={<ModalNavSidebar activeSection="orders" onSectionChange={handleSectionChange} />}
    >
      {renderOrdersContent()}
    </Modal>
  );
};

export default OrdersModal;