import { describe, it, expect, vi, beforeEach } from 'vitest';
import apiClient, { API_URL } from '../src/api/client';

describe('API Client', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
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
});
