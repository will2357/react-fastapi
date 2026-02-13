import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../src/App';
import useAuthStore, { type User } from '../src/store/useAuthStore';

vi.mock('../src/store/useAuthStore', () => ({
  default: vi.fn(),
}));

vi.mock('../src/services/api', () => ({
  getHealth: vi.fn().mockResolvedValue({ status: 'healthy' }),
}));

describe('App', () => {
  beforeEach(() => {
    (useAuthStore as ReturnType<typeof vi.fn>).mockReturnValue({
      isAuthenticated: false,
      user: null,
      logout: vi.fn(),
    });
  });

  it('renders without crashing', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      );
    });
    const navbar = document.querySelector('.navbar');
    expect(navbar).toBeInTheDocument();
  });
});
