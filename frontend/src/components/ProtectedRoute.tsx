import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isHydrated } = useAuthStore();
  const location = useLocation();

  if (!isHydrated) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
