import { useState, useEffect } from 'react';
import * as api from '../services/api';

function ItemList() {
  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await api.getProtectedItems();
        setItems(data.items || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) return <div className="loading">Loading items...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="item-list">
      <h2>Protected Items</h2>
      {items.length === 0 ? (
        <p>No items found</p>
      ) : (
        <ul>
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ItemList;
