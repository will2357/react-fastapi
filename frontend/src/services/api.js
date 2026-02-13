import apiClient from '../api/client';

export const login = async (username, password) => {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  const response = await apiClient.post('/api/v1/auth/login', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return response.data;
};

export const getProtectedItems = async () => {
  const response = await apiClient.get('/api/v1/items/protected-items');
  return response.data;
};

export const getItem = async (itemId) => {
  const response = await apiClient.get(`/api/v1/items/items/${itemId}`);
  return response.data;
};

export const createItem = async (itemData) => {
  const response = await apiClient.post('/api/v1/items/items', itemData);
  return response.data;
};

export const getHealth = async () => {
  const response = await apiClient.get('/api/v1/health/');
  return response.data;
};

export default {
  login,
  getProtectedItems,
  getItem,
  createItem,
  getHealth,
};
