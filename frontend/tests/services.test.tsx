import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { AxiosInstance } from 'axios';
import apiClient from '../src/api/client';
import * as api from '../src/services/api';
import type { TokenResponse, ItemsResponse, HealthResponse, Item } from '../src/services/api';

vi.mock('../src/api/client', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  } as unknown as AxiosInstance,
}));

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should call login endpoint with form data', async () => {
      const mockResponse = { data: { access_token: 'test-token', token_type: 'bearer' } as TokenResponse };
      (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

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
      (apiClient.post as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Login failed'));

      await expect(api.login('admin', 'wrong')).rejects.toThrow('Login failed');
    });
  });

  describe('getProtectedItems', () => {
    it('should call protected endpoint', async () => {
      const mockResponse = { data: { items: ['item1', 'item2'] } as ItemsResponse };
      (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const result = await api.getProtectedItems();

      expect(apiClient.get).toHaveBeenCalledWith('/api/v1/items/protected-items');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getItem', () => {
    it('should call item endpoint with itemId', async () => {
      const mockResponse = { data: { item_id: 42, name: 'Test' } };
      (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const result = await api.getItem(42);

      expect(apiClient.get).toHaveBeenCalledWith('/api/v1/items/items/42');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('createItem', () => {
    it('should call create item endpoint', async () => {
      const mockResponse = { data: { message: 'Item created' } };
      const itemData: Item = { name: 'Test', price: 10 };
      (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const result = await api.createItem(itemData);

      expect(apiClient.post).toHaveBeenCalledWith('/api/v1/items/items', itemData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getHealth', () => {
    it('should call health endpoint', async () => {
      const mockResponse = { data: { status: 'healthy' } as HealthResponse };
      (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const result = await api.getHealth();

      expect(apiClient.get).toHaveBeenCalledWith('/api/v1/health/');
      expect(result).toEqual(mockResponse.data);
    });
  });
});
