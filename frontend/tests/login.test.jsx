import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, useLocation } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Login from '../src/pages/Login';

vi.mock('../src/store/useAuthStore', () => ({
  default: vi.fn(),
}));

vi.mock('../src/components/LoginForm', () => ({
  default: ({ onSuccess }) => (
    <div>
      <button onClick={onSuccess}>Mock LoginForm</button>
    </div>
  ),
}));

import useAuthStore from '../src/store/useAuthStore';

describe('Login', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mock('react-router-dom', () => ({
      ...vi.importActual('react-router-dom'),
      useNavigate: () => mockNavigate,
      useLocation: () => ({ state: {} }),
    }));
    
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
    
    expect(screen.getByText('Mock LoginForm')).toBeInTheDocument();
  });

  it('renders LoginPage class', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    
    expect(document.querySelector('.login-page')).toBeInTheDocument();
  });

  it('renders LoginForm component', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    
    expect(screen.getByRole('button', { name: /mock loginform/i })).toBeInTheDocument();
  });

  it('does not redirect when not authenticated', () => {
    useAuthStore.mockReturnValue({
      isAuthenticated: false,
    });
    
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
