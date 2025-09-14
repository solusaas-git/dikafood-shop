'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

/**
 * Notification Context
 * Provides a system for displaying non-blocking notifications
 */

// Create context
const NotificationContext = createContext();

// Types of notifications
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Default timeout for notifications
const DEFAULT_TIMEOUT = 5000; // 5 seconds

/**
 * NotificationProvider component
 * Manages the state of notifications
 */
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Add a new notification
  const addNotification = useCallback((message, options = {}) => {
    const id = options.id || uuidv4();
    const type = options.type || NOTIFICATION_TYPES.INFO;
    const timeout = options.timeout !== undefined ? options.timeout : DEFAULT_TIMEOUT;
    const title = options.title || '';
    const action = options.action;

    const newNotification = {
      id,
      message,
      type,
      title,
      action,
      timestamp: new Date(),
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-dismiss after timeout (if timeout is not 0)
    if (timeout > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, timeout);
    }

    return id;
  }, []);

  // Remove a notification by ID
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // Clear all notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Convenience methods for different notification types
  const success = useCallback((message, options = {}) => {
    return addNotification(message, {
      ...options,
      type: NOTIFICATION_TYPES.SUCCESS,
      title: options.title || 'Succès'
    });
  }, [addNotification]);

  const error = useCallback((message, options = {}) => {
    return addNotification(message, {
      ...options,
      type: NOTIFICATION_TYPES.ERROR,
      title: options.title || 'Erreur'
    });
  }, [addNotification]);

  const warning = useCallback((message, options = {}) => {
    return addNotification(message, {
      ...options,
      type: NOTIFICATION_TYPES.WARNING,
      title: options.title || 'Attention'
    });
  }, [addNotification]);

  const info = useCallback((message, options = {}) => {
    return addNotification(message, {
      ...options,
      type: NOTIFICATION_TYPES.INFO,
      title: options.title || 'Information'
    });
  }, [addNotification]);

  // Create API error notification
  const apiError = useCallback((error, options = {}) => {
    const message = error?.response?.data?.message ||
                   error?.message ||
                   'Une erreur est survenue lors de la communication avec le serveur.';

    return addNotification(message, {
      ...options,
      type: NOTIFICATION_TYPES.ERROR,
      title: options.title || 'Erreur API'
    });
  }, [addNotification]);

  // Context value
  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    success,
    error,
    warning,
    info,
    apiError,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

/**
 * useNotification hook
 * Custom hook to use the notification context
 */
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;