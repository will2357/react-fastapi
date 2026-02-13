import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../src/pages/Home';

vi.mock('../src/services/api', () => ({
  getHealth: vi.fn(),
}));

import * as api from '../src/services/api';

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders welcome heading', () => {
    api.getHealth.mockResolvedValue({ status: 'healthy' });
    
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    
    expect(screen.getByRole('heading', { name: /welcome/i })).toBeInTheDocument();
  });

  it('renders full stack description', () => {
    api.getHealth.mockResolvedValue({ status: 'healthy' });
    
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/full-stack application/i)).toBeInTheDocument();
  });

  it('renders Backend Status heading', () => {
    api.getHealth.mockResolvedValue({ status: 'healthy' });
    
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    
    expect(screen.getByRole('heading', { name: /backend status/i })).toBeInTheDocument();
  });

  it('shows "Checking backend..." initially', () => {
    api.getHealth.mockImplementation(
      () => new Promise(() => {})
    );
    
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

  it('renders Quick Links heading', () => {
    api.getHealth.mockResolvedValue({ status: 'healthy' });
    
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    
    expect(screen.getByRole('heading', { name: /quick links/i })).toBeInTheDocument();
  });

  it('renders Login link', () => {
    api.getHealth.mockResolvedValue({ status: 'healthy' });
    
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
  });

  it('renders Dashboard link', () => {
    api.getHealth.mockResolvedValue({ status: 'healthy' });
    
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
  });

  it('renders Items link', () => {
    api.getHealth.mockResolvedValue({ status: 'healthy' });
    
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    
    expect(screen.getByRole('link', { name: /items/i })).toBeInTheDocument();
  });

  it('calls getHealth on mount', () => {
    api.getHealth.mockResolvedValue({ status: 'healthy' });
    
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    
    expect(api.getHealth).toHaveBeenCalledTimes(1);
  });
});
