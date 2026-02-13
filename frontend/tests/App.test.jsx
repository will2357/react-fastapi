import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../src/App';
import useAuthStore from '../src/store/useAuthStore';

vi.mock('../src/store/useAuthStore', () => ({
  default: vi.fn(),
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
});
