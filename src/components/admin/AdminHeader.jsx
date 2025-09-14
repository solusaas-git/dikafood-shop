'use client';

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useAdmin } from '../../contexts/AdminContext';
import LucideIcon from '../ui/icons/LucideIcon';

const AdminHeader = () => {
  const { user, logout } = useAuth();
  const { toggleSidebar, sidebarOpen } = useAdmin();

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/admin/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 h-16 z-50">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left side - Menu toggle */}
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <LucideIcon 
              name={sidebarOpen ? 'x' : 'list'} 
              size="md" 
              color="gray" 
            />
          </button>
          
          <div className="ml-4">
            <h1 className="text-lg font-semibold text-gray-900">
              Admin Dashboard
            </h1>
          </div>
        </div>

        {/* Right side - User menu and notifications */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <LucideIcon name="bell" size="md" color="gray" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User menu */}
          <div className="relative group">
            <button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-8 h-8 bg-logo-lime rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-dark-green-7">
                  {user?.firstName?.charAt(0) || 'A'}
                </span>
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.role || 'Admin'}
                </p>
              </div>
              <LucideIcon name="chevrondown" size="sm" color="gray" />
            </button>

            {/* Dropdown menu */}
            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="py-1">
                <a
                  href="/admin/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LucideIcon name="user" size="sm" color="gray" className="mr-3" />
                  Profile Settings
                </a>
                <a
                  href="/admin/settings"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LucideIcon name="gear" size="sm" color="gray" className="mr-3" />
                  Admin Settings
                </a>
                <div className="border-t border-gray-200 my-1"></div>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LucideIcon name="signout" size="sm" color="gray" className="mr-3" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
