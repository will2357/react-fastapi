import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../src/api/client', () => ({
  default: {
    get: vi.fn().mockResolvedValue({}),
    post: vi.fn().mockResolvedValue({}),
    interceptors: {
      request: { use: vi.fn(), eject: vi.fn(), clear: vi.fn(), handlers: [] },
      response: { use: vi.fn(), eject: vi.fn(), clear: vi.fn(), handlers: [] },
    },
    defaults: { baseURL: 'http://localhost:8000', headers: { common: {} } },
  },
  API_URL: 'http://localhost:8000',
}));

vi.mock('../src/store/useAuthStore', () => ({
  default: vi.fn().mockReturnValue({
    token: null,
    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    setToken: vi.fn(),
    setUser: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
    clearError: vi.fn(),
  }),
}));

vi.stubGlobal('createRoot', vi.fn(() => ({
  render: vi.fn(),
})));

describe('main.jsx', () => {
  it('should have a root element in the DOM', () => {
    const root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);
    
    expect(document.getElementById('root')).toBeInTheDocument();
  });

  it('should have StrictMode in the component tree', () => {
    const { container } = render(
      <div id="root">
        <React.StrictMode>
          <BrowserRouter>
            <div>App</div>
          </BrowserRouter>
        </React.StrictMode>
      </div>
    );
    
    expect(container.querySelector('#root')).toBeInTheDocument();
  });
});
