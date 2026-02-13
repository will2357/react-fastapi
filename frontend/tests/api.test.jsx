import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import apiClient, { API_URL } from '../src/api/client';

describe('API Client', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
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

  describe('Request Interceptor', () => {
    it('should add Authorization header when token exists', async () => {
      localStorage.setItem('token', 'test-token');
      
      const config = {};
      const result = await apiClient.interceptors.request.handlers[0].fulfilled(config);
      
      expect(result.headers.Authorization).toBe('Bearer test-token');
    });

    it('should not add Authorization header when no token exists', async () => {
      localStorage.removeItem('token');
      
      const config = {};
      const result = await apiClient.interceptors.request.handlers[0].fulfilled(config);
      
      expect(result.headers.Authorization).toBeUndefined();
    });

    it('should pass through request errors', async () => {
      const error = new Error('Request error');
      const result = await apiClient.interceptors.request.handlers[0].rejected(error);
      
      expect(result).toBe(error);
    });
  });

  describe('Response Interceptor', () => {
    it('should pass through successful responses', async () => {
      const response = { status: 200, data: {} };
      const result = await apiClient.interceptors.response.handlers[0].fulfilled(response);
      
      expect(result).toEqual(response);
    });

    it('should clear auth on 401 response', async () => {
      delete window.location;
      window.location = { href: '' };
      vi.spyOn(window.location, 'href', 'set');

      const error = {
        response: { status: 401 },
      };
      
      await expect(
        apiClient.interceptors.response.handlers[0].rejected(error)
      ).rejects.toEqual(error);
      
      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
      expect(window.location.href).toBe('/login');
    });

    it('should reject non-401 errors without clearing auth', async () => {
      const error = {
        response: { status: 500 },
      };
      
      await expect(
        apiClient.interceptors.response.handlers[0].rejected(error)
      ).rejects.toEqual(error);
      
      expect(localStorage.getItem('token')).toBeNull();
    });

    it('should reject errors without response without clearing auth', async () => {
      const error = new Error('Network error');
      
      await expect(
        apiClient.interceptors.response.handlers[0].rejected(error)
      ).rejects.toEqual(error);
      
      expect(localStorage.getItem('token')).toBeNull();
    });
  });
});
