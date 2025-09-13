import React from 'react';
import ToastContainer from './Toast';
import { useNotification } from '@/contexts/NotificationContextNew';

/**
 * NotificationManager component
 * Displays notifications using the Toast component
 * This component should be placed at the root of the application
 */
const NotificationManager = ({ position = 'topRight' }) => {
  const { notifications, removeNotification } = useNotification();

  // Map notification types to toast types
  const mapNotificationType = (type) => {
    switch (type) {
      case 'success':
      case 'error':
      case 'warning':
      case 'info':
        return type;
      default:
        return 'info';
    }
  };

  // Format notifications for the toast component
  const formattedNotifications = notifications.map(notification => ({
    ...notification,
    type: mapNotificationType(notification.type),
  }));

  return (
    <ToastContainer
      toasts={formattedNotifications}
      position={position}
      onClose={removeNotification}
    />
  );
};

export default NotificationManager;