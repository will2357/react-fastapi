import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getHealth } from '../services/api';

function Home() {
  const [backendStatus, setBackendStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHealth()
      .then((data) => setBackendStatus(data.status))
      .catch(() => setBackendStatus('unavailable'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home-page">
      <h1>Welcome to FastAPI + React</h1>
      <p>
        This is a full-stack application with a FastAPI backend and React frontend.
      </p>
      
      <div className="backend-status">
        <h2>Backend Status</h2>
        {loading ? (
          <p>Checking backend...</p>
        ) : backendStatus === 'healthy' ? (
          <p className="status-healthy">Backend is healthy</p>
        ) : (
          <p className="status-unavailable">Backend is unavailable</p>
        )}
      </div>

      <div className="quick-links">
        <h2>Quick Links</h2>
        <Link to="/login">Login</Link>
        <Link to="/dashboard">Dashboard (Protected)</Link>
        <Link to="/items">Items (Protected)</Link>
      </div>
    </div>
  );
}

export default Home;
