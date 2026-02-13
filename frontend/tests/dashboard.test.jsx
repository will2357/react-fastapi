import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../src/pages/Dashboard';

vi.mock('../src/store/useAuthStore', () => ({
  default: vi.fn(),
}));

vi.mock('../src/components/ItemList', () => ({
  default: () => <div>Mock ItemList</div>,
}));

import useAuthStore from '../src/store/useAuthStore';

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders dashboard heading', () => {
    useAuthStore.mockReturnValue({
      user: { username: 'admin' },
    });
    
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    
    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
  });

  it('renders welcome message with username', () => {
    useAuthStore.mockReturnValue({
      user: { username: 'testuser' },
    });
    
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/hello testuser/i)).toBeInTheDocument();
  });

  it('renders authentication message', () => {
    useAuthStore.mockReturnValue({
      user: { username: 'admin' },
    });
    
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/successfully authenticated/i)).toBeInTheDocument();
  });

  it('renders Your Data heading', () => {
    useAuthStore.mockReturnValue({
      user: { username: 'admin' },
    });
    
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    
    expect(screen.getByRole('heading', { name: /your data/i })).toBeInTheDocument();
  });

  it('renders ItemList component', () => {
    useAuthStore.mockReturnValue({
      user: { username: 'admin' },
    });
    
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Mock ItemList')).toBeInTheDocument();
  });

  it('renders dashboard-page class', () => {
    useAuthStore.mockReturnValue({
      user: { username: 'admin' },
    });
    
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    
    expect(document.querySelector('.dashboard-page')).toBeInTheDocument();
  });

  it('renders dashboard-content class', () => {
    useAuthStore.mockReturnValue({
      user: { username: 'admin' },
    });
    
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    
    expect(document.querySelector('.dashboard-content')).toBeInTheDocument();
  });

  it('handles null user gracefully', () => {
    useAuthStore.mockReturnValue({
      user: null,
    });
    
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    
    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.queryByText(/hello/i)).not.toBeInTheDocument();
  });

  it('handles undefined username gracefully', () => {
    useAuthStore.mockReturnValue({
      user: {},
    });
    
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    
    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
  });
});
