import apiClient from "./client";

// TODO: Replace with your own feature
// This is a placeholder API client - remove or replace with your feature

export interface Item {
  item_id: number;
  name: string;
  price: number;
}

export interface CreateItemData {
  name: string;
  price: number;
}

const ITEMS_BASE = "/api/v1/items";

export async function fetchItems(): Promise<Item[]> {
  const response = await apiClient.get<Item[]>(ITEMS_BASE);
  return response.data;
}

export async function createItem(data: CreateItemData): Promise<Item> {
  const response = await apiClient.post<Item>(ITEMS_BASE, data);
  return response.data;
}

export async function updateItem(itemId: number, data: CreateItemData): Promise<Item> {
  const response = await apiClient.put<Item>(`${ITEMS_BASE}/${itemId}`, data);
  return response.data;
}

export async function deleteItem(itemId: number): Promise<void> {
  await apiClient.delete(`${ITEMS_BASE}/${itemId}`);
}
