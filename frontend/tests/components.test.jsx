import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Navbar from '../src/components/Navbar';
import LoginForm from '../src/components/LoginForm';
import ItemList from '../src/components/ItemList';
import ProtectedRoute from '../src/components/ProtectedRoute';

vi.mock('../src/store/useAuthStore', () => ({
  __esModule: true,
  default: vi.fn(),
}));

vi.mock('../src/services/api', () => ({
  getProtectedItems: vi.fn(),
}));

import useAuthStore from '../src/store/useAuthStore';
import * as api from '../src/services/api';

describe('Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.mockReturnValue({
      isAuthenticated: false,
      user: null,
      logout: vi.fn(),
    });
  });

  describe('Navbar', () => {
    it('renders navbar with navigation links when not authenticated', () => {
      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByText(/fastapi/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
    });

    it('renders Dashboard and Items links when authenticated', () => {
      useAuthStore.mockReturnValue({
        isAuthenticated: true,
        user: { username: 'admin' },
        logout: vi.fn(),
      });

      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /items/i })).toBeInTheDocument();
      expect(screen.getByText('admin')).toBeInTheDocument();
    });

    it('calls logout when logout button is clicked', async () => {
      const mockLogout = vi.fn();
      useAuthStore.mockReturnValue({
        isAuthenticated: true,
        user: { username: 'admin' },
        logout: mockLogout,
      });

      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      await userEvent.click(screen.getByRole('button', { name: /logout/i }));
      expect(mockLogout).toHaveBeenCalled();
    });

    it('does not render authenticated links when not authenticated', () => {
      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      expect(screen.queryByRole('link', { name: /dashboard/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /items/i })).not.toBeInTheDocument();
    });

    it('handles null user when authenticated', () => {
      useAuthStore.mockReturnValue({
        isAuthenticated: true,
        user: null,
        logout: vi.fn(),
      });

      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      expect(screen.queryByText(/admin/)).not.toBeInTheDocument();
    });
  });

  describe('LoginForm', () => {
    it('renders login form with inputs', () => {
      render(<LoginForm />);

      expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    it('allows typing in inputs', async () => {
      render(<LoginForm />);

      await userEvent.type(screen.getByLabelText(/username/i), 'testuser');
      await userEvent.type(screen.getByLabelText(/password/i), 'password123');

      expect(screen.getByLabelText(/username/i)).toHaveValue('testuser');
      expect(screen.getByLabelText(/password/i)).toHaveValue('password123');
    });

    it('shows loading state when isLoading is true', () => {
      useAuthStore.mockReturnValue({
        login: vi.fn(),
        isLoading: true,
        error: null,
        clearError: vi.fn(),
      });

      render(<LoginForm />);

      expect(screen.getByRole('button', { name: /logging in/i })).toBeInTheDocument();
    });

    it('displays error message when error exists', () => {
      useAuthStore.mockReturnValue({
        login: vi.fn(),
        isLoading: false,
        error: 'Invalid credentials',
        clearError: vi.fn(),
      });

      render(<LoginForm />);

      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });

    it('disables button when loading', () => {
      useAuthStore.mockReturnValue({
        login: vi.fn(),
        isLoading: true,
        error: null,
        clearError: vi.fn(),
      });

      render(<LoginForm />);

      expect(screen.getByRole('button', { name: /logging in/i })).toBeDisabled();
    });

    it('renders without onSuccess callback', () => {
      const mockLogin = vi.fn().mockResolvedValue({ access_token: 'token' });
      useAuthStore.mockReturnValue({
        login: mockLogin,
        isLoading: false,
        error: null,
        clearError: vi.fn(),
      });

      render(<LoginForm />);

      expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    });
  });

  describe('ItemList', () => {
    it('renders loading state initially', () => {
      api.getProtectedItems.mockImplementation(() => new Promise(() => {}));

      render(<ItemList />);

      expect(screen.getByText(/loading items/i)).toBeInTheDocument();
    });

    it('renders items when loaded successfully', async () => {
      api.getProtectedItems.mockResolvedValue({ items: ['item1', 'item2'] });

      render(<ItemList />);

      await waitFor(() => {
        expect(screen.getByText('item1')).toBeInTheDocument();
        expect(screen.getByText('item2')).toBeInTheDocument();
      });
    });

    it('renders "No items found" when empty', async () => {
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

    it('displays error message on failure', async () => {
      api.getProtectedItems.mockRejectedValue(new Error('Network error'));

      render(<ItemList />);

      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
      });
    });
  });

  describe('ProtectedRoute', () => {
    it('renders children when authenticated', () => {
      useAuthStore.mockReturnValue({
        isAuthenticated: true,
      });

      render(
        <BrowserRouter>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </BrowserRouter>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('redirects to login when not authenticated', () => {
      useAuthStore.mockReturnValue({
        isAuthenticated: false,
      });

      render(
        <MemoryRouter initialEntries={['/protected']}>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      );

      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });
  });
});
