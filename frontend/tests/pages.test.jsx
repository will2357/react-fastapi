import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, useNavigate, useLocation } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Home from '../src/pages/Home';
import Login from '../src/pages/Login';
import Dashboard from '../src/pages/Dashboard';
import Items from '../src/pages/Items';

vi.mock('../src/services/api', () => ({
  __esModule: true,
  getHealth: vi.fn(),
  getProtectedItems: vi.fn(),
  createItem: vi.fn(),
}));

vi.mock('../src/store/useAuthStore', () => ({
  __esModule: true,
  default: vi.fn(),
}));

vi.mock('../src/components/ItemList', () => ({
  default: () => <div>ItemList</div>,
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: { from: { pathname: '/dashboard' } } }),
  };
});

import * as api from '../src/services/api';
import useAuthStore from '../src/store/useAuthStore';

describe('Pages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
    useAuthStore.mockReturnValue({
      user: { username: 'admin' },
      isAuthenticated: true,
    });
  });

  describe('Home', () => {
    it('renders welcome heading and description', () => {
      api.getHealth.mockResolvedValue({ status: 'healthy' });

      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      expect(screen.getByRole('heading', { name: /welcome/i })).toBeInTheDocument();
      expect(screen.getByText(/full-stack application/i)).toBeInTheDocument();
    });

    it('shows "Checking backend..." initially', () => {
      api.getHealth.mockImplementation(() => new Promise(() => {}));

      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      expect(screen.getByText(/checking backend/i)).toBeInTheDocument();
    });

    it('shows healthy status when backend is healthy', async () => {
      api.getHealth.mockResolvedValue({ status: 'healthy' });

      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/backend is healthy/i)).toBeInTheDocument();
      });
    });

    it('shows unavailable status when backend is down', async () => {
      api.getHealth.mockRejectedValue(new Error('Network error'));

      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/backend is unavailable/i)).toBeInTheDocument();
      });
    });

    it('renders quick links section', () => {
      api.getHealth.mockResolvedValue({ status: 'healthy' });

      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      expect(screen.getByRole('heading', { name: /quick links/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /items/i })).toBeInTheDocument();
    });
  });

  describe('Login', () => {
    beforeEach(() => {
      useAuthStore.mockReturnValue({
        isAuthenticated: false,
      });
    });

    it('renders login page', () => {
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      expect(document.querySelector('.login-page')).toBeInTheDocument();
    });

    it('renders login form component', () => {
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    });
  });

  describe('Dashboard', () => {
    it('renders dashboard with user welcome message', () => {
      useAuthStore.mockReturnValue({
        user: { username: 'testuser' },
      });

      render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );

      expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
      expect(screen.getByText(/hello testuser/i)).toBeInTheDocument();
      expect(screen.getByText(/successfully authenticated/i)).toBeInTheDocument();
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

      expect(screen.getByText('ItemList')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /your data/i })).toBeInTheDocument();
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

  describe('Items', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      api.createItem.mockResolvedValue({ message: 'Item created successfully' });
    });

    it('renders items page with form', () => {
      render(<Items />);

      expect(screen.getByRole('heading', { name: /items/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /create new item/i })).toBeInTheDocument();
    });

    it('renders name and price inputs', () => {
      render(<Items />);

      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    });

    it('renders submit button', () => {
      render(<Items />);

      expect(screen.getByRole('button', { name: /create item/i })).toBeInTheDocument();
    });

    it('allows typing in name input', async () => {
      render(<Items />);

      await userEvent.type(screen.getByLabelText(/name/i), 'New Item');

      expect(screen.getByLabelText(/name/i)).toHaveValue('New Item');
    });

    it('calls createItem on form submit', async () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

      render(<Items />);

      await userEvent.type(screen.getByLabelText(/name/i), 'New Item');
      await userEvent.type(screen.getByLabelText(/price/i), '25');
      await userEvent.click(screen.getByRole('button', { name: /create item/i }));

      await waitFor(() => {
        expect(api.createItem).toHaveBeenCalledWith({
          name: 'New Item',
          price: 25,
        });
      });

      alertSpy.mockRestore();
    });

    it('shows error message on failure', async () => {
      api.createItem.mockRejectedValue(new Error('Failed to create'));

      render(<Items />);

      await userEvent.type(screen.getByLabelText(/name/i), 'New Item');
      await userEvent.type(screen.getByLabelText(/price/i), '25');
      await userEvent.click(screen.getByRole('button', { name: /create item/i }));

      await waitFor(() => {
        expect(screen.getByText(/failed to create/i)).toBeInTheDocument();
      });
    });

    it('shows loading state during submission', async () => {
      api.createItem.mockImplementation(() => new Promise(() => {}));

      render(<Items />);

      await userEvent.type(screen.getByLabelText(/name/i), 'New Item');
      await userEvent.type(screen.getByLabelText(/price/i), '25');
      await userEvent.click(screen.getByRole('button', { name: /create item/i }));

      expect(screen.getByRole('button', { name: /creating/i })).toBeInTheDocument();
    });
  });
});
