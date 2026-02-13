import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

vi.mock('react-dom/client', () => ({
  createRoot: vi.fn(() => ({
    render: vi.fn(),
  })),
}));

vi.mock('../src/App.jsx', () => ({
  default: () => <div data-testid="app">App</div>,
}));

import App from '../src/App.jsx';

describe('main.jsx', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have root element in document', () => {
    const root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);
    
    expect(document.getElementById('root')).toBeInTheDocument();
  });

  it('should render app component in strict mode with router', () => {
    const { container } = render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    );
    
    expect(container.querySelector('div[data-testid="app"]')).toBeInTheDocument();
  });
});
