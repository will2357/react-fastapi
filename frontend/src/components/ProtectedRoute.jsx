import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

function ProtectedRoute({ children }) {
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
