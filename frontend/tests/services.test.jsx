import { describe, it, expect, vi, beforeEach } from 'vitest';
import apiClient from '../src/api/client';
import * as api from '../src/services/api';

vi.mock('../src/api/client', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should call login endpoint with form data', async () => {
      const mockResponse = { data: { access_token: 'test-token', token_type: 'bearer' } };
      apiClient.post.mockResolvedValue(mockResponse);

      const result = await api.login('admin', 'admin123');

      expect(apiClient.post).toHaveBeenCalledWith(
        '/api/v1/auth/login',
        expect.any(URLSearchParams),
        expect.objectContaining({
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw error on failure', async () => {
      apiClient.post.mockRejectedValue(new Error('Login failed'));

      await expect(api.login('admin', 'wrong')).rejects.toThrow('Login failed');
    });
  });

  describe('getProtectedItems', () => {
    it('should call protected endpoint', async () => {
      const mockResponse = { data: { items: ['item1', 'item2'] } };
      apiClient.get.mockResolvedValue(mockResponse);

      const result = await api.getProtectedItems();

      expect(apiClient.get).toHaveBeenCalledWith('/api/v1/items/protected-items');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getItem', () => {
    it('should call item endpoint with itemId', async () => {
      const mockResponse = { data: { item_id: 42, name: 'Test' } };
      apiClient.get.mockResolvedValue(mockResponse);

      const result = await api.getItem(42);

      expect(apiClient.get).toHaveBeenCalledWith('/api/v1/items/items/42');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('createItem', () => {
    it('should call create item endpoint', async () => {
      const mockResponse = { data: { message: 'Item created' } };
      const itemData = { name: 'Test', price: 10 };
      apiClient.post.mockResolvedValue(mockResponse);

      const result = await api.createItem(itemData);

      expect(apiClient.post).toHaveBeenCalledWith('/api/v1/items/items', itemData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getHealth', () => {
    it('should call health endpoint', async () => {
      const mockResponse = { data: { status: 'healthy' } };
      apiClient.get.mockResolvedValue(mockResponse);

      const result = await api.getHealth();

      expect(apiClient.get).toHaveBeenCalledWith('/api/v1/health/');
      expect(result).toEqual(mockResponse.data);
    });
  });
});
