import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">FastAPI + React</Link>
      </div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        {isAuthenticated ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/items">Items</Link>
            <span className="nav-user">{user?.username}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="login-link">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
