import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Spinner from '../components/loading/Spinner';

/**
 * Guards a route tree behind authentication, and optionally restricts by role.
 * Usage: <Route element={<ProtectedRoute allowedRoles={['admin']} />}>...</Route>
 */
export default function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, user, initializing } = useAuth();
  const location = useLocation();

  if (initializing) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Role tidak diizinkan mengakses halaman ini — arahkan ke halaman default sesuai role
    const fallback = user?.role === 'kasir' ? '/cashier' : '/dashboard';
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
}
