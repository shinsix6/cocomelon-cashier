import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { CategoryProvider } from './context/CategoryContext';
import { TransactionProvider } from './context/TransactionContext';

import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';

import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';

import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import Products from './pages/products/Products';
import Categories from './pages/categories/Categories';
import Cashier from './pages/cashier/Cashier';
import TransactionHistory from './pages/cashier/TransactionHistory';
import Reports from './pages/reports/Reports';
import Profile from './pages/profile/Profile';
import Settings from './pages/settings/Settings';

import { ROLES } from './utils/constants';

function RootRedirect() {
  return <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CategoryProvider>
          <TransactionProvider>
            <BrowserRouter>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    borderRadius: '12px',
                    fontSize: '14px',
                  },
                  success: { iconTheme: { primary: '#059669', secondary: '#fff' } },
                }}
              />
              <Routes>
                <Route path="/" element={<RootRedirect />} />

                {/* Public routes */}
                <Route element={<PublicRoute />}>
                  <Route element={<AuthLayout />}>
                    <Route path="/login" element={<Login />} />
                  </Route>
                </Route>

                {/* Admin-only routes */}
                <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
                  <Route element={<MainLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/settings" element={<Settings />} />
                  </Route>
                </Route>

                {/* Admin + Kasir routes */}
                <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.KASIR]} />}>
                  <Route element={<MainLayout />}>
                    <Route path="/cashier" element={<Cashier />} />
                    <Route path="/cashier/riwayat" element={<TransactionHistory />} />
                    <Route path="/profile" element={<Profile />} />
                  </Route>
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </TransactionProvider>
        </CategoryProvider>
      </ProductProvider>
    </AuthProvider>
  );
}
