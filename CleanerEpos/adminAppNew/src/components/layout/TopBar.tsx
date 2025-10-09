/**
 * Top Bar Component
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/utils/constants';

interface TopBarProps {
  onMenuClick: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate(ROUTES.LOGIN);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 lg:px-6">
      <div className="flex items-center justify-between">
        {/* Left side - Menu button and welcome message */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-gray-700 hover:text-gray-900"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="hidden sm:block">
            <h2 className="text-lg font-semibold text-gray-900">
              Welcome, {user?.fullName || user?.userName || 'User'}
            </h2>
          </div>
        </div>

        {/* Right side - User info and logout */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-medium text-gray-900">
              {user?.fullName}
            </span>
            <span className="text-xs text-gray-500">
              {user?.roles.join(', ') || 'User'}
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
