import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in from localStorage on mount
  useEffect(() => {
    const checkLoggedIn = () => {
      const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
      if (storedIsLoggedIn === 'true') {
        try {
          const userData = JSON.parse(localStorage.getItem('user'));
          setUser(userData);
          setIsLoggedIn(true);
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('user');
          localStorage.removeItem('isLoggedIn');
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    try {
      // Mock API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock successful login
      const userData = {
        email,
        firstName: 'User',
        lastName: 'Name'
      };

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      setIsLoggedIn(true);
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        error: error.message || 'Login failed'
      };
    }
  };

  // Register function
  const register = async (userData) => {
    setLoading(true);
    try {
      // Mock API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock successful registration
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      setIsLoggedIn(true);
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        error: error.message || 'Registration failed'
      };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    setUser(null);
    setIsLoggedIn(false);
  };

  // Update user profile
  const updateProfile = async (updatedData) => {
    setLoading(true);
    try {
      // Mock API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedUser = { ...user, ...updatedData };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setUser(updatedUser);
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        error: error.message || 'Profile update failed'
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        loading,
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;