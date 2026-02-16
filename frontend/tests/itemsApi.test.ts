import { vi, describe, it, expect, beforeEach } from "vitest";
import { fetchItems, createItem } from "../src/api/items";
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
});
