import { useState, useEffect } from 'react';
import useAuthStore from '../store/useAuthStore';
import ItemList from '../components/ItemList';

function Dashboard() {
  const { user } = useAuthStore();
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user?.username) {
      setMessage(`Hello ${user.username}, welcome to your dashboard!`);
    }
  }, [user]);

  return (
    <div className="dashboard-page">
      <h1>Dashboard</h1>
      <p>{message}</p>
      <p>You have successfully authenticated with the backend using JWT.</p>
      
      <div className="dashboard-content">
        <h2>Your Data</h2>
        <ItemList />
      </div>
    </div>
  );
}

export default Dashboard;
