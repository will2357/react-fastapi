import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '../src/components/LoginForm';

vi.mock('../src/store/useAuthStore', () => ({
  default: vi.fn(),
}));

vi.mock('../src/services/api', () => ({
  login: vi.fn(),
}));

import useAuthStore from '../src/store/useAuthStore';
import * as api from '../src/services/api';

describe('LoginForm', () => {
  const mockOnSuccess = vi.fn();
  const mockLogin = vi.fn();
  const mockClearError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: null,
      clearError: mockClearError,
    });
  });

  it('renders login form', () => {
    render(<LoginForm />);
    
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
  });

  it('renders username input', () => {
    render(<LoginForm />);
    
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
  });

  it('renders password input', () => {
    render(<LoginForm />);
    
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('renders submit button', () => {
    render(<LoginForm />);
    
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('updates username on input change', async () => {
    const user = userEvent.setup();
    
    render(<LoginForm />);
    
    await user.type(screen.getByLabelText(/username/i), 'testuser');
    
    expect(screen.getByLabelText(/username/i)).toHaveValue('testuser');
  });

  it('updates password on input change', async () => {
    const user = userEvent.setup();
    
    render(<LoginForm />);
    
    await user.type(screen.getByLabelText(/password/i), 'password123');
    
    expect(screen.getByLabelText(/password/i)).toHaveValue('password123');
  });

  it('calls clearError on submit', async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue({ access_token: 'token' });
    
    render(<LoginForm onSuccess={mockOnSuccess} />);
    
    await user.click(screen.getByRole('button', { name: /login/i }));
    
    expect(mockClearError).toHaveBeenCalled();
  });

  it('calls login with credentials on submit', async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue({ access_token: 'token' });
    
    render(<LoginForm />);
    
    await user.type(screen.getByLabelText(/username/i), 'admin');
    await user.type(screen.getByLabelText(/password/i), 'admin123');
    await user.click(screen.getByRole('button', { name: /login/i }));
    
    expect(mockLogin).toHaveBeenCalled();
  });

  it('calls onSuccess after successful login', async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue({ access_token: 'token' });
    
    render(<LoginForm onSuccess={mockOnSuccess} />);
    
    await user.type(screen.getByLabelText(/username/i), 'admin');
    await user.type(screen.getByLabelText(/password/i), 'admin123');
    await user.click(screen.getByRole('button', { name: /login/i }));
    
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it('shows loading state when isLoading is true', () => {
    useAuthStore.mockReturnValue({
      login: mockLogin,
      isLoading: true,
      error: null,
      clearError: mockClearError,
    });
    
    render(<LoginForm />);
    
    expect(screen.getByRole('button', { name: /logging in/i })).toBeInTheDocument();
  });

  it('disables submit button when loading', () => {
    useAuthStore.mockReturnValue({
      login: mockLogin,
      isLoading: true,
      error: null,
      clearError: mockClearError,
    });
    
    render(<LoginForm />);
    
    expect(screen.getByRole('button', { name: /logging in/i })).toBeDisabled();
  });

  it('displays error message when error exists', () => {
    useAuthStore.mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: 'Invalid credentials',
      clearError: mockClearError,
    });
    
    render(<LoginForm />);
    
    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
  });

  it('does not display error when error is null', () => {
    render(<LoginForm />);
    
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('renders without onSuccess callback', () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue({ access_token: 'token' });
    
    render(<LoginForm />);
    
    expect(() => {
      user.type(screen.getByLabelText(/username/i), 'admin');
      user.type(screen.getByLabelText(/password/i), 'admin123');
      user.click(screen.getByRole('button', { name: /login/i }));
    }).not.toThrow();
  });
});
