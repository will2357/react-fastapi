import apiClient from '../api/client';

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface Item {
  id?: number;
  name: string;
  price: number;
}

export interface ItemsResponse {
  items: string[];
}

export interface HealthResponse {
  status: string;
}

export const login = async (username: string, password: string): Promise<TokenResponse> => {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  const response = await apiClient.post<TokenResponse>('/api/v1/auth/login', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return response.data;
};

export const getProtectedItems = async (): Promise<ItemsResponse> => {
  const response = await apiClient.get<ItemsResponse>('/api/v1/items/protected-items');
  return response.data;
};

export const getItem = async (itemId: number): Promise<{ item_id: number; name: string }> => {
  const response = await apiClient.get<{ item_id: number; name: string }>(`/api/v1/items/items/${itemId}`);
  return response.data;
};

export const createItem = async (itemData: Item): Promise<{ message: string }> => {
  const response = await apiClient.post<{ message: string }>('/api/v1/items/items', itemData);
  return response.data;
};

export const getHealth = async (): Promise<HealthResponse> => {
  const response = await apiClient.get<HealthResponse>('/api/v1/health/');
  return response.data;
};

export default {
  login,
  getProtectedItems,
  getItem,
  createItem,
  getHealth,
};
