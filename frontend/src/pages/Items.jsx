import { useState } from 'react';
import * as api from '../services/api';

function Items() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', price: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await api.createItem({
        name: newItem.name,
        price: parseFloat(newItem.price),
      });
      alert(result.message);
      setNewItem({ name: '', price: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="items-page">
      <h1>Items</h1>
      
      <div className="create-item">
        <h2>Create New Item</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="item-name">Name</label>
            <input
              id="item-name"
              type="text"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="item-price">Price</label>
            <input
              id="item-price"
              type="number"
              step="0.01"
              value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Item'}
          </button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default Items;
