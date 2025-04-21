import React from 'react';
import { Link } from 'react-router-dom';
import {
  ChartLine,
  ShoppingCart,
  Users,
  CurrencyDollar,
  CaretUp,
  CaretDown,
  Package,
  ArrowRight,
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  Warning
} from '@phosphor-icons/react';
import './dashboard.scss';

const Dashboard = () => {
  // Mock data
  const statistics = [
    {
      id: 'revenue',
      label: 'Revenu ce mois',
      value: '12,450 DH',
      change: '+8.2%',
      isPositive: true,
      icon: <CurrencyDollar size={24} weight="fill" />,
      color: 'var(--color-success)'
    },
    {
      id: 'orders',
      label: 'Commandes',
      value: '64',
      change: '+12.5%',
      isPositive: true,
      icon: <ShoppingCart size={24} weight="fill" />,
      color: 'var(--color-primary)'
    },
    {
      id: 'customers',
      label: 'Nouveaux clients',
      value: '38',
      change: '+2.4%',
      isPositive: true,
      icon: <Users size={24} weight="fill" />,
      color: 'var(--color-info)'
    },
    {
      id: 'products',
      label: 'Produits',
      value: '156',
      change: '-3.8%',
      isPositive: false,
      icon: <Package size={24} weight="fill" />,
      color: 'var(--color-warning)'
    }
  ];

  const recentOrders = [
    {
      id: 'ORD-001243',
      customer: 'Ahmed Benali',
      date: '08 Jun 2024',
      amount: '458 DH',
      status: 'completed'
    },
    {
      id: 'ORD-001242',
      customer: 'Sofia Lahlou',
      date: '07 Jun 2024',
      amount: '725 DH',
      status: 'processing'
    },
    {
      id: 'ORD-001241',
      customer: 'Mohammed Tazi',
      date: '07 Jun 2024',
      amount: '290 DH',
      status: 'completed'
    },
    {
      id: 'ORD-001240',
      customer: 'Leila Amrani',
      date: '06 Jun 2024',
      amount: '1,205 DH',
      status: 'completed'
    },
    {
      id: 'ORD-001239',
      customer: 'Karim El Fassi',
      date: '05 Jun 2024',
      amount: '345 DH',
      status: 'cancelled'
    }
  ];

  const notifications = [
    {
      id: 1,
      title: 'Nouvelle commande reçue',
      message: 'La commande #1243 a été passée par Ahmed Benali',
      time: 'Il y a 2 heures',
      type: 'order'
    },
    {
      id: 2,
      title: 'Stock faible',
      message: 'Le produit "Huile d\'olive extra vierge 750ml" est presque épuisé',
      time: 'Il y a 5 heures',
      type: 'warning'
    },
    {
      id: 3,
      title: 'Nouveau client inscrit',
      message: 'Sofia Lahlou vient de créer un compte',
      time: 'Il y a 1 jour',
      type: 'customer'
    }
  ];

  const upcomingDeliveries = [
    {
      id: 1,
      order: 'ORD-001238',
      customer: 'Youssef Alami',
      date: '09 Jun 2024',
      status: 'scheduled'
    },
    {
      id: 2,
      order: 'ORD-001236',
      customer: 'Nadia Tahiri',
      date: '10 Jun 2024',
      status: 'scheduled'
    },
    {
      id: 3,
      order: 'ORD-001235',
      customer: 'Omar Ziani',
      date: '11 Jun 2024',
      status: 'scheduled'
    }
  ];

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed':
        return <CheckCircle size={16} weight="fill" className="status-icon completed" />;
      case 'processing':
        return <Clock size={16} weight="fill" className="status-icon processing" />;
      case 'cancelled':
        return <Warning size={16} weight="fill" className="status-icon cancelled" />;
      case 'scheduled':
        return <Calendar size={16} weight="fill" className="status-icon scheduled" />;
      default:
        return null;
    }
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'order':
        return <ShoppingCart size={16} weight="fill" className="notification-icon order" />;
      case 'warning':
        return <Warning size={16} weight="fill" className="notification-icon warning" />;
      case 'customer':
        return <Users size={16} weight="fill" className="notification-icon customer" />;
      default:
        return <Bell size={16} weight="fill" className="notification-icon" />;
    }
  };

  return (
    <div className="dashboard">
      {/* Statistics Cards */}
      <div className="dashboard-stats">
        {statistics.map((stat) => (
          <div className="stat-card" key={stat.id}>
            <div className="stat-icon" style={{ backgroundColor: stat.color + '15', color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <h3>{stat.label}</h3>
              <div className="stat-value">{stat.value}</div>
              <div className={`stat-change ${stat.isPositive ? 'positive' : 'negative'}`}>
                {stat.isPositive ? <CaretUp size={16} /> : <CaretDown size={16} />}
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        {/* Recent Orders */}
        <div className="dashboard-card orders-card">
          <div className="card-header">
            <h2>Commandes récentes</h2>
            <Link to="/management/orders" className="view-all">
              Tout voir <ArrowRight size={16} />
            </Link>
          </div>
          <div className="card-content">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Commande</th>
                  <th>Client</th>
                  <th>Date</th>
                  <th>Montant</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <Link to={`/management/orders/${order.id}`} className="order-link">
                        {order.id}
                      </Link>
                    </td>
                    <td>{order.customer}</td>
                    <td>{order.date}</td>
                    <td>{order.amount}</td>
                    <td>
                      <span className={`status-badge ${order.status}`}>
                        {getStatusIcon(order.status)}
                        {order.status === 'completed' && 'Terminé'}
                        {order.status === 'processing' && 'En cours'}
                        {order.status === 'cancelled' && 'Annulé'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div className="dashboard-sidebar">
          {/* Notifications */}
          <div className="dashboard-card notifications-card">
            <div className="card-header">
              <h2>Notifications</h2>
              <span className="notification-count">{notifications.length}</span>
            </div>
            <div className="card-content">
              <div className="notifications-list">
                {notifications.map((notification) => (
                  <div className="notification-item" key={notification.id}>
                    <div className="notification-icon-wrapper">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="notification-content">
                      <h4>{notification.title}</h4>
                      <p>{notification.message}</p>
                      <span className="notification-time">{notification.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Deliveries */}
          <div className="dashboard-card deliveries-card">
            <div className="card-header">
              <h2>Livraisons à venir</h2>
              <Link to="/management/delivery" className="view-all">
                Tout voir <ArrowRight size={16} />
              </Link>
            </div>
            <div className="card-content">
              <div className="deliveries-list">
                {upcomingDeliveries.map((delivery) => (
                  <div className="delivery-item" key={delivery.id}>
                    <div className="delivery-icon">
                      {getStatusIcon(delivery.status)}
                    </div>
                    <div className="delivery-content">
                      <h4>
                        <Link to={`/management/orders/${delivery.order}`}>
                          {delivery.order}
                        </Link>
                      </h4>
                      <p>{delivery.customer}</p>
                      <div className="delivery-date">
                        <Calendar size={14} />
                        <span>{delivery.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;