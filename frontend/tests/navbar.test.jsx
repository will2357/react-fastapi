import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Navbar from '../src/components/Navbar';

vi.mock('../src/store/useAuthStore', () => ({
  default: vi.fn(),
}));

import useAuthStore from '../src/store/useAuthStore';

describe('Navbar', () => {
  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.mockReturnValue({
      isAuthenticated: false,
      user: null,
      logout: mockLogout,
    });
  });

  it('renders navbar component', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders app brand link', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/FastAPI/i)).toBeInTheDocument();
  });

  it('renders Home link', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
  });

  it('renders Login link when not authenticated', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
  });

  it('renders Dashboard and Items links when authenticated', () => {
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
    
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /items/i })).toBeInTheDocument();
  });

  it('renders username when authenticated', () => {
    useAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { username: 'testuser' },
      logout: mockLogout,
    });
    
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    
    expect(screen.getByText('testuser')).toBeInTheDocument();
  });

  it('renders Logout button when authenticated', () => {
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
    
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  it('calls logout when Logout button is clicked', async () => {
    const user = userEvent.setup();
    
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
    
    await user.click(screen.getByRole('button', { name: /logout/i }));
    
    expect(mockLogout).toHaveBeenCalled();
  });

  it('does not render Dashboard/Items links when not authenticated', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    
    expect(screen.queryByRole('link', { name: /dashboard/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /items/i })).not.toBeInTheDocument();
  });

  it('does not render username when user is null', () => {
    useAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: null,
      logout: mockLogout,
    });
    
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    
    expect(screen.queryByText(/admin/)).not.toBeInTheDocument();
  });
});
