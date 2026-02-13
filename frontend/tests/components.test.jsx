import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Navbar from '../src/components/Navbar';
import LoginForm from '../src/components/LoginForm';
import ItemList from '../src/components/ItemList';
import ProtectedRoute from '../src/components/ProtectedRoute';

vi.mock('../src/store/useAuthStore', () => ({
  default: vi.fn(),
}));

vi.mock('../src/services/api', () => ({
  getProtectedItems: vi.fn().mockResolvedValue({ items: ['item1'] }),
}));

describe('Components Integration', () => {
  describe('Navbar', () => {
    it('renders navigation with links', () => {
      const { default: useAuthStore } = require('../src/store/useAuthStore');
      useAuthStore.mockReturnValue({
        isAuthenticated: false,
        user: null,
        logout: vi.fn(),
      });
      
      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );
      
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
  });

  describe('LoginForm', () => {
    it('renders form with inputs', () => {
      const { default: useAuthStore } = require('../src/store/useAuthStore');
      useAuthStore.mockReturnValue({
        login: vi.fn().mockResolvedValue({}),
        isLoading: false,
        error: null,
        clearError: vi.fn(),
      });
      
      render(<LoginForm />);
      
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });
  });

  describe('ItemList', () => {
    it('renders item list', async () => {
      const { getProtectedItems } = require('../src/services/api');
      getProtectedItems.mockResolvedValue({ items: ['test1', 'test2'] });
      
      render(<ItemList />);
      
      await Promise.resolve();
      await Promise.resolve();
      
      expect(screen.getByRole('list')).toBeInTheDocument();
    });
  });

  describe('ProtectedRoute', () => {
    it('renders children when authenticated', () => {
      const { default: useAuthStore } = require('../src/store/useAuthStore');
      useAuthStore.mockReturnValue({
        isAuthenticated: true,
      });
      
      render(
        <BrowserRouter>
          <ProtectedRoute>
            <div>Protected</div>
          </ProtectedRoute>
        </BrowserRouter>
      );
      
      expect(screen.getByText('Protected')).toBeInTheDocument();
    });
  });
});
