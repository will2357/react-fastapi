import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Home from '../src/pages/Home';
import Dashboard from '../src/pages/Dashboard';
import Items from '../src/pages/Items';
import type { HealthResponse } from '../src/services/api';
import type { User } from '../src/store/useAuthStore';

vi.mock('../src/services/api', () => ({
  __esModule: true,
  getHealth: vi.fn(),
  createItem: vi.fn(),
}));

vi.mock('../src/store/useAuthStore', () => ({
  __esModule: true,
  default: vi.fn(),
}));

vi.mock('../src/components/ItemList', () => ({
  default: () => <div>ItemList</div>,
}));

import * as api from '../src/services/api';
import useAuthStore from '../src/store/useAuthStore';

describe('Pages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: { username: 'admin' } as User,
      isAuthenticated: true,
    });
  });

  describe('Home', () => {
    it('renders welcome heading and description', async () => {
      (api.getHealth as ReturnType<typeof vi.fn>).mockResolvedValue({ status: 'healthy' } as HealthResponse);

      await act(async () => {
        render(
          <BrowserRouter>
            <Home />
          </BrowserRouter>
        );
      });

      expect(screen.getByRole('heading', { name: /welcome/i })).toBeInTheDocument();
      expect(screen.getByText(/full-stack application/i)).toBeInTheDocument();
    });

    it('shows "Checking backend..." initially', async () => {
      (api.getHealth as ReturnType<typeof vi.fn>).mockImplementation(() => new Promise(() => {}));

      await act(async () => {
        render(
          <BrowserRouter>
            <Home />
          </BrowserRouter>
        );
      });

      expect(screen.getByText(/checking backend/i)).toBeInTheDocument();
    });

    it('shows healthy status when backend is healthy', async () => {
      (api.getHealth as ReturnType<typeof vi.fn>).mockResolvedValue({ status: 'healthy' } as HealthResponse);

      await act(async () => {
        render(
          <BrowserRouter>
            <Home />
          </BrowserRouter>
        );
      });

      expect(await screen.findByText(/backend is healthy/i)).toBeInTheDocument();
    });

    it('shows unavailable status when backend is down', async () => {
      (api.getHealth as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'));

      await act(async () => {
        render(
          <BrowserRouter>
            <Home />
          </BrowserRouter>
        );
      });

      expect(await screen.findByText(/backend is unavailable/i)).toBeInTheDocument();
    });

    it('renders quick links section', async () => {
      (api.getHealth as ReturnType<typeof vi.fn>).mockResolvedValue({ status: 'healthy' } as HealthResponse);

      await act(async () => {
        render(
          <BrowserRouter>
            <Home />
          </BrowserRouter>
        );
      });

      expect(screen.getByRole('heading', { name: /quick links/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /items/i })).toBeInTheDocument();
    });
  });

  describe('Dashboard', () => {
    it('renders dashboard with user welcome message', async () => {
      (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        user: { username: 'testuser' } as User,
      });

      await act(async () => {
        render(
          <BrowserRouter>
            <Dashboard />
          </BrowserRouter>
        );
      });

      expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
      expect(screen.getByText(/hello testuser/i)).toBeInTheDocument();
      expect(screen.getByText(/successfully authenticated/i)).toBeInTheDocument();
    });

    it('renders ItemList component', async () => {
      await act(async () => {
        render(
          <BrowserRouter>
            <Dashboard />
          </BrowserRouter>
        );
      });

      expect(screen.getByText('ItemList')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /your data/i })).toBeInTheDocument();
    });

    it('handles null user gracefully', async () => {
      (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        user: null,
      });

      await act(async () => {
        render(
          <BrowserRouter>
            <Dashboard />
          </BrowserRouter>
        );
      });

      expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
      expect(screen.queryByText(/hello/i)).not.toBeInTheDocument();
    });
  });

  describe('Items', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      (api.createItem as ReturnType<typeof vi.fn>).mockResolvedValue({ message: 'Item created successfully' });
    });

    it('renders items page with form', async () => {
      await act(async () => {
        render(<Items />);
      });

      expect(screen.getByRole('heading', { name: /items/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /create new item/i })).toBeInTheDocument();
    });

    it('renders name and price inputs', async () => {
      await act(async () => {
        render(<Items />);
      });

      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    });

    it('renders submit button', async () => {
      await act(async () => {
        render(<Items />);
      });

      expect(screen.getByRole('button', { name: /create item/i })).toBeInTheDocument();
    });

    it('calls createItem on form submit', async () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

      await act(async () => {
        render(<Items />);
      });

      await userEvent.type(screen.getByLabelText(/name/i), 'New Item');
      await userEvent.type(screen.getByLabelText(/price/i), '25');
      await userEvent.click(screen.getByRole('button', { name: /create item/i }));

      expect(api.createItem).toHaveBeenCalledWith({
        name: 'New Item',
        price: 25,
      });

      alertSpy.mockRestore();
    });

    it('shows error message on failure', async () => {
      (api.createItem as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Failed to create'));

      await act(async () => {
        render(<Items />);
      });

      await userEvent.type(screen.getByLabelText(/name/i), 'New Item');
      await userEvent.type(screen.getByLabelText(/price/i), '25');
      await userEvent.click(screen.getByRole('button', { name: /create item/i }));

      expect(await screen.findByText(/failed to create/i)).toBeInTheDocument();
    });

    it('shows loading state during submission', async () => {
      (api.createItem as ReturnType<typeof vi.fn>).mockImplementation(() => new Promise(() => {}));

      await act(async () => {
        render(<Items />);
      });

      await userEvent.type(screen.getByLabelText(/name/i), 'New Item');
      await userEvent.type(screen.getByLabelText(/price/i), '25');
      await userEvent.click(screen.getByRole('button', { name: /create item/i }));

      expect(screen.getByRole('button', { name: /creating/i })).toBeInTheDocument();
    });
  });
});
