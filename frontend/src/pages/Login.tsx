import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import useAuthStore from '../store/useAuthStore';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isHydrated } = useAuthStore();

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isHydrated, isAuthenticated, navigate, from]);

  if (!isHydrated) {
    return null;
  }

  return (
    <div className="login-page">
      <LoginForm onSuccess={() => navigate('/dashboard')} />
    </div>
  );
}

export default Login;
