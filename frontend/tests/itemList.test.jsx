import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ItemList from '../src/components/ItemList';

vi.mock('../src/services/api', () => ({
  getProtectedItems: vi.fn(),
}));

import * as api from '../src/services/api';

describe('ItemList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    api.getProtectedItems.mockImplementation(
      () => new Promise(() => {})
    );
    
    render(<ItemList />);
    
    expect(screen.getByText(/loading items/i)).toBeInTheDocument();
  });

  it('renders items after loading', async () => {
    api.getProtectedItems.mockResolvedValue({ items: ['item1', 'item2'] });
    
    render(<ItemList />);
    
    await waitFor(() => {
      expect(screen.getByText('item1')).toBeInTheDocument();
      expect(screen.getByText('item2')).toBeInTheDocument();
    });
  });

  it('renders Protected Items heading', () => {
    api.getProtectedItems.mockResolvedValue({ items: [] });
    
    render(<ItemList />);
    
    expect(screen.getByRole('heading', { name: /protected items/i })).toBeInTheDocument();
  });

  it('renders "No items found" when items array is empty', async () => {
    api.getProtectedItems.mockResolvedValue({ items: [] });
    
    render(<ItemList />);
    
    await waitFor(() => {
      expect(screen.getByText(/no items found/i)).toBeInTheDocument();
    });
  });

  it('renders "No items found" when items is undefined', async () => {
    api.getProtectedItems.mockResolvedValue({});
    
    render(<ItemList />);
    
    await waitFor(() => {
      expect(screen.getByText(/no items found/i)).toBeInTheDocument();
    });
  });

  it('displays error message on API failure', async () => {
    api.getProtectedItems.mockRejectedValue(new Error('Network error'));
    
    render(<ItemList />);
    
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });

  it('calls getProtectedItems on mount', () => {
    api.getProtectedItems.mockResolvedValue({ items: [] });
    
    render(<ItemList />);
    
    expect(api.getProtectedItems).toHaveBeenCalledTimes(1);
  });

  it('renders list items with correct keys', async () => {
    api.getProtectedItems.mockResolvedValue({ items: ['a', 'b', 'c'] });
    
    render(<ItemList />);
    
    await waitFor(() => {
      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(3);
    });
  });

  it('renders unordered list for items', async () => {
    api.getProtectedItems.mockResolvedValue({ items: ['test'] });
    
    render(<ItemList />);
    
    await waitFor(() => {
      expect(screen.getByRole('list')).toBeInTheDocument();
    });
  });
});
