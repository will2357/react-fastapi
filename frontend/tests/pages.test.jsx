import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Home from '../src/pages/Home';
import Login from '../src/pages/Login';
import Dashboard from '../src/pages/Dashboard';
import Items from '../src/pages/Items';

vi.mock('../src/services/api', () => ({
  getHealth: vi.fn().mockResolvedValue({ status: 'healthy' }),
  createItem: vi.fn().mockResolvedValue({ message: 'Item created' }),
}));

vi.mock('../src/store/useAuthStore', () => ({
  default: vi.fn().mockReturnValue({
    user: { username: 'admin' },
    isAuthenticated: true,
    logout: vi.fn(),
  }),
}));

vi.mock('../src/components/ItemList', () => ({
  default: () => <div>ItemList</div>,
}));

describe('Pages Integration', () => {
  describe('Home', () => {
    it('renders home page with backend status', async () => {
      const { getHealth } = await import('../src/services/api');
      getHealth.mockResolvedValue({ status: 'healthy' });
      
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );
      
      expect(screen.getByText(/welcome/i)).toBeInTheDocument();
    });

    it('shows quick links section', () => {
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );
      
      expect(screen.getByText(/quick links/i)).toBeInTheDocument();
    });
  });

  describe('Login', () => {
    it('renders login page with form', () => {
      const { useNavigate, useLocation } = require('react-router-dom');
      vi.mocked(useNavigate).mockReturnValue(vi.fn());
      vi.mocked(useLocation).mockReturnValue({ state: {} });
      
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );
      
      expect(document.querySelector('.login-page')).toBeInTheDocument();
    });
  });

  describe('Dashboard', () => {
    it('renders dashboard with user data', () => {
      render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );
      
      expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    });
  });

  describe('Items', () => {
    it('renders items page with form', async () => {
      const user = userEvent.setup();
      
      render(<Items />);
      
      expect(screen.getByText(/items/i)).toBeInTheDocument();
      expect(screen.getByText(/create new item/i)).toBeInTheDocument();
    });
  });
});
