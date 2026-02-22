import { vi, describe, it, expect, beforeEach } from "vitest";

// TODO: Replace with your own feature tests
// This is a placeholder test file - remove or replace with your feature tests

import { fetchItems, createItem, updateItem, deleteItem } from "../src/api/items";
import apiClient from "../src/api/client";

vi.mock("../src/api/client");

describe("items API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchItems", () => {
    it("fetches items from correct endpoint without trailing slash", async () => {
      const mockItems = [
        { item_id: 1, name: "Item 1", price: 10.0 },
        { item_id: 2, name: "Item 2", price: 20.0 },
      ];
      const mockGet = vi.mocked(apiClient.get);
      mockGet.mockResolvedValue({ data: mockItems });

      const result = await fetchItems();

      expect(result).toEqual(mockItems);
      expect(mockGet).toHaveBeenCalledTimes(1);
      expect(mockGet).toHaveBeenCalledWith("/api/v1/items");
    });

    it("throws error on failure", async () => {
      const mockGet = vi.mocked(apiClient.get);
      mockGet.mockRejectedValue(new Error("Network error"));

      await expect(fetchItems()).rejects.toThrow("Network error");
    });
  });

  describe("createItem", () => {
    it("creates item at correct endpoint without trailing slash", async () => {
      const newItem = { name: "New Item", price: 15.99 };
      const createdItem = { item_id: 1, name: "New Item", price: 15.99 };
      const mockPost = vi.mocked(apiClient.post);
      mockPost.mockResolvedValue({ data: createdItem });

      const result = await createItem(newItem);

      expect(result).toEqual(createdItem);
      expect(mockPost).toHaveBeenCalledTimes(1);
      expect(mockPost).toHaveBeenCalledWith("/api/v1/items", newItem);
    });

    it("throws error on failure", async () => {
      const mockPost = vi.mocked(apiClient.post);
      mockPost.mockRejectedValue(new Error("Unauthorized"));

      await expect(createItem({ name: "Test", price: 10 })).rejects.toThrow("Unauthorized");
    });
  });

  describe("updateItem", () => {
    it("updates item at correct endpoint", async () => {
      const updateData = { name: "Updated Item", price: 25.0 };
      const updatedItem = { item_id: 1, name: "Updated Item", price: 25.0 };
      const mockPut = vi.mocked(apiClient.put);
      mockPut.mockResolvedValue({ data: updatedItem });

      const result = await updateItem(1, updateData);

      expect(result).toEqual(updatedItem);
      expect(mockPut).toHaveBeenCalledTimes(1);
      expect(mockPut).toHaveBeenCalledWith("/api/v1/items/1", updateData);
    });

    it("throws error on failure", async () => {
      const mockPut = vi.mocked(apiClient.put);
      mockPut.mockRejectedValue(new Error("Not found"));

      await expect(updateItem(1, { name: "Test", price: 10 })).rejects.toThrow("Not found");
    });
  });

  describe("deleteItem", () => {
    it("deletes item at correct endpoint", async () => {
      const mockDelete = vi.mocked(apiClient.delete);
      mockDelete.mockResolvedValue({});

      await deleteItem(1);

      expect(mockDelete).toHaveBeenCalledTimes(1);
      expect(mockDelete).toHaveBeenCalledWith("/api/v1/items/1");
    });

    it("throws error on failure", async () => {
      const mockDelete = vi.mocked(apiClient.delete);
      mockDelete.mockRejectedValue(new Error("Not found"));

      await expect(deleteItem(999)).rejects.toThrow("Not found");
    });
  });
});
