import { describe, it, expect, vi } from "vitest";
import { signup } from "../src/api/auth";
import apiClient from "../src/api/client";

vi.mock("../src/api/client");

describe("auth API", () => {
  it("signup sends correct data to API", async () => {
    const mockPost = vi.mocked(apiClient.post);
    mockPost.mockResolvedValue({
      data: { message: "Signup successful" },
    });

    const result = await signup({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    });

    expect(mockPost).toHaveBeenCalledWith("/api/v1/auth/signup", {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    });
    expect(result).toEqual({ message: "Signup successful" });
  });

  it("signup throws error on API failure", async () => {
    const mockPost = vi.mocked(apiClient.post);
    mockPost.mockRejectedValue(new Error("Network error"));

    await expect(
      signup({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      })
    ).rejects.toThrow("Network error");
  });
});
