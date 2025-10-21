import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  CreditCard,
  FileText,
  Users,
  Package,
  BarChart3,
  QrCode,
  X,
} from 'lucide-react';
import clsx from 'clsx';
import { ROUTES } from '@/utils/constants';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { to: ROUTES.HOME, icon: Home, label: 'Home' },
  { to: ROUTES.TRANSACTIONS, icon: CreditCard, label: 'Transactions' },
  { to: ROUTES.CATEGORIES, icon: FileText, label: 'Categories' },
  { to: ROUTES.USERS, icon: Users, label: 'Users' },
  { to: ROUTES.PRODUCTS, icon: Package, label: 'Products' },
  { to: '/qr-codes', icon: QrCode, label: 'QR Codes' },
  { to: ROUTES.ANALYTICS, icon: BarChart3, label: 'Analytics' },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed top-0 left-0 z-30 h-screen bg-white border-r border-gray-200 transition-transform duration-300',
          'w-64',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">EPOS Admin</h1>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => {
                if (window.innerWidth < 1024) {
                  onClose();
                }
              }}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                )
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};
