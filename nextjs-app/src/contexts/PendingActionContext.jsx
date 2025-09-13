import React, { createContext, useState, useContext, useCallback } from 'react';

// Create the context
const PendingActionContext = createContext();

// Custom hook to use the pending action context
export const usePendingAction = () => {
  const context = useContext(PendingActionContext);
  if (!context) {
    throw new Error('usePendingAction must be used within a PendingActionProvider');
  }
  return context;
};

// Provider component
export const PendingActionProvider = ({ children }) => {
  const [pendingAction, setPendingAction] = useState(null);

  // Set a pending action to be executed after authentication
  const setPendingDirectPurchase = useCallback((productData) => {
    setPendingAction({
      type: 'direct_purchase',
      data: productData,
      timestamp: Date.now()
    });
  }, []);

  // Execute the pending action and clear it
  const executePendingAction = useCallback(async (executeFunction) => {
    if (!pendingAction) return null;

    try {
      const result = await executeFunction(pendingAction);
      setPendingAction(null); // Clear after successful execution
      return result;
    } catch (error) {
      console.error('Failed to execute pending action:', error);
      setPendingAction(null); // Clear even on error to prevent infinite loops
      throw error;
    }
  }, [pendingAction]);

  // Clear pending action without executing
  const clearPendingAction = useCallback(() => {
    setPendingAction(null);
  }, []);

  // Check if there's a pending action of a specific type
  const hasPendingAction = useCallback((type) => {
    return pendingAction && pendingAction.type === type;
  }, [pendingAction]);

  const value = {
    pendingAction,
    setPendingDirectPurchase,
    executePendingAction,
    clearPendingAction,
    hasPendingAction
  };

  return (
    <PendingActionContext.Provider value={value}>
      {children}
    </PendingActionContext.Provider>
  );
};

export default PendingActionContext; 