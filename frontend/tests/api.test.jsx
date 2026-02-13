import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import apiClient, { API_URL } from '../src/api/client';

describe('API Client', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    delete window.location;
    window.location = { href: '' };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should have correct base URL', () => {
    expect(apiClient.defaults.baseURL).toBe(API_URL);
  });

  it('should have correct default headers', () => {
    expect(apiClient.defaults.headers['Content-Type']).toBe('application/json');
  });

  it('should export API_URL', () => {
    expect(API_URL).toBeDefined();
    expect(typeof API_URL).toBe('string');
  });

  describe('Request interceptor', () => {
    it('should add Authorization header when token exists', async () => {
      localStorage.setItem('token', 'test-token');
      
      const config = {
        headers: {},
      };
      
      const interceptor = apiClient.interceptors.request.handlers[0];
      const result = await interceptor.fulfilled(config);
      
      expect(result.headers.Authorization).toBe('Bearer test-token');
    });

    it('should not add Authorization header when no token exists', async () => {
      localStorage.removeItem('token');
      
      const config = {
        headers: {},
      };
      
      const interceptor = apiClient.interceptors.request.handlers[0];
      const result = await interceptor.fulfilled(config);
      
      expect(result.headers.Authorization).toBeUndefined();
    });
  });

  describe('Response interceptor', () => {
    it('should pass through successful responses', async () => {
      const response = { status: 200, data: {} };
      
      const interceptor = apiClient.interceptors.response.handlers[0];
      const result = await interceptor.fulfilled(response);
      
      expect(result).toEqual(response);
    });

    it('should clear auth and redirect on 401', async () => {
      const originalHref = window.location.href;
      Object.defineProperty(window, 'location', {
        value: { href: '' },
        writable: true,
      });
      
      const error = {
        response: { status: 401 },
      };
      
      const interceptor = apiClient.interceptors.response.handlers[0];
      
      await expect(interceptor.rejected(error)).rejects.toEqual(error);
      
      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
      expect(window.location.href).toBe('/login');
      
      Object.defineProperty(window, 'location', {
        value: { href: originalHref },
        writable: true,
      });
    });

    it('should pass through non-401 errors without clearing auth', async () => {
      const error = {
        response: { status: 500 },
      };
      
      localStorage.setItem('token', 'some-token');
      localStorage.setItem('user', 'some-user');
      
      const interceptor = apiClient.interceptors.response.handlers[0];
      
      await expect(interceptor.rejected(error)).rejects.toEqual(error);
      
      expect(localStorage.getItem('token')).toBe('some-token');
      expect(localStorage.getItem('user')).toBe('some-user');
    });

    it('should pass through errors without response without clearing auth', async () => {
      const error = new Error('Network error');
      
      localStorage.setItem('token', 'some-token');
      
      const interceptor = apiClient.interceptors.response.handlers[0];
      
      await expect(interceptor.rejected(error)).rejects.toEqual(error);
      
      expect(localStorage.getItem('token')).toBe('some-token');
    });
  });
});
