import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { Users } from './pages/Users';
import { Products } from './pages/Products';
import { Categories } from './pages/Categories';
import { Transactions } from './pages/Transactions';
import { Orders } from './pages/Orders';
import { Analytics } from './pages/Analytics';
import { Menu } from './pages/Menu';
import { QRCodes } from './pages/QRCodes';
import { ROUTES } from './utils/constants';

const App: React.FC = () => {
  const { initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.MENU} element={<Menu />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to={ROUTES.HOME} replace />} />
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path={ROUTES.USERS} element={<Users />} />
            <Route path={ROUTES.PRODUCTS} element={<Products />} />
            <Route path={ROUTES.CATEGORIES} element={<Categories />} />
            <Route path={ROUTES.ORDERS} element={<Orders />} />
            <Route path={ROUTES.TRANSACTIONS} element={<Transactions />} />
            <Route path={ROUTES.ANALYTICS} element={<Analytics />} />
            <Route path="/qr-codes" element={<QRCodes />} />
          </Route>

          {}
          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
      </BrowserRouter>

      {}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#363636',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  );
};

export default App;
