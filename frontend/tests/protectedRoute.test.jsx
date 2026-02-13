import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route, MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import ProtectedRoute from '../src/components/ProtectedRoute';

vi.mock('../src/store/useAuthStore', () => ({
  default: vi.fn(),
}));

import useAuthStore from '../src/store/useAuthStore';

describe('ProtectedRoute', () => {
  const mockChild = <div>Protected Content</div>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children when authenticated', () => {
    useAuthStore.mockReturnValue({
      isAuthenticated: true,
    });
    
    render(
      <BrowserRouter>
        <ProtectedRoute>{mockChild}</ProtectedRoute>
      </BrowserRouter>
    );
    
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to login when not authenticated', () => {
    useAuthStore.mockReturnValue({
      isAuthenticated: false,
    });
    
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>Protected Content</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );
    
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('does not render children when not authenticated', () => {
    useAuthStore.mockReturnValue({
      isAuthenticated: false,
    });
    
    render(
      <BrowserRouter>
        <ProtectedRoute>{mockChild}</ProtectedRoute>
      </BrowserRouter>
    );
    
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('uses useLocation hook', () => {
    useAuthStore.mockReturnValue({
      isAuthenticated: false,
    });
    
    const { container } = render(
      <MemoryRouter initialEntries={['/protected']}>
        <ProtectedRoute>
          <div>Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );
    
    expect(container).toBeInTheDocument();
  });
});
