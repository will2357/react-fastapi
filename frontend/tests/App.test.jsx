import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route, MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import App from '../src/App';
import useAuthStore from '../src/store/useAuthStore';

vi.mock('../src/store/useAuthStore', () => ({
  default: vi.fn(),
}));

vi.mock('../src/services/api', () => ({
  login: vi.fn(),
  getProtectedItems: vi.fn().mockResolvedValue({ items: [] }),
  getItem: vi.fn(),
  createItem: vi.fn(),
  getHealth: vi.fn().mockResolvedValue({ status: 'healthy' }),
}));

describe('App', () => {
  beforeEach(() => {
    useAuthStore.mockReturnValue({
      isAuthenticated: false,
      user: null,
      logout: vi.fn(),
    });
  });

  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    const navbar = document.querySelector('.navbar');
    expect(navbar).toBeInTheDocument();
  });

  it('renders navbar with app title', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/FastAPI/i)).toBeInTheDocument();
  });

  it('renders home route at /', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    
    expect(screen.getByText(/Welcome to FastAPI/i)).toBeInTheDocument();
  });

  it('renders login route at /login', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    );
    
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
  });

  it('redirects unauthenticated user from dashboard to login', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <App />
      </MemoryRouter>
    );
    
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
  });

  it('redirects unauthenticated user from items to login', () => {
    render(
      <MemoryRouter initialEntries={['/items']}>
        <App />
      </MemoryRouter>
    );
    
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
  });

  it('renders dashboard when authenticated', () => {
    useAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { username: 'admin' },
      logout: vi.fn(),
    });
    
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <App />
      </MemoryRouter>
    );
    
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  });

  it('renders items page when authenticated', () => {
    useAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { username: 'admin' },
      logout: vi.fn(),
    });
    
    render(
      <MemoryRouter initialEntries={['/items']}>
        <App />
      </MemoryRouter>
    );
    
    expect(screen.getByRole('heading', { name: /items/i })).toBeInTheDocument();
  });

  it('has links to navigate between pages', async () => {
    const user = userEvent.setup();
    
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).toBeInTheDocument();
    
    const loginLink = screen.getByRole('link', { name: /login/i });
    expect(loginLink).toBeInTheDocument();
  });
});
