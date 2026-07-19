import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function PublicRoute() {
  const { isAuthenticated, user, initializing } = useAuth();

  if (initializing) return null;

  if (isAuthenticated) {
    const target = user?.role === 'kasir' ? '/cashier' : '/dashboard';
    return <Navigate to={target} replace />;
  }

  return <Outlet />;
}
