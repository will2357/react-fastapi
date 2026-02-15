import { describe, it, expect, vi, beforeEach } from "vitest";
import { InternalAxiosRequestConfig } from "axios";
import apiClient, { API_URL } from "../src/api/client";

const mockSetItem = vi.fn();
const mockGetItem = vi.fn();
const mockRemoveItem = vi.fn();

vi.stubGlobal("localStorage", {
  setItem: mockSetItem,
  getItem: mockGetItem,
  removeItem: mockRemoveItem,
});

vi.stubGlobal("location", {
  href: "",
});

Object.defineProperty(window, "location", {
  value: { href: "" },
  writable: true,
});

describe("apiClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetItem.mockReturnValue(null);
    window.location.href = "";
  });

  it("has correct base URL from environment", () => {
    expect(API_URL).toMatch(/^http:\/\/localhost:800\d+$/);
    expect(apiClient.defaults.baseURL).toMatch(/^http:\/\/localhost:800\d+$/);
  });

  it("has correct default headers", () => {
    expect(apiClient.defaults.headers["Content-Type"]).toBe("application/json");
  });

  it("adds Authorization header when token exists in localStorage", async () => {
    mockGetItem.mockReturnValue("mock-token");

    const mockRequestInterceptor = apiClient.interceptors.request.handlers[0];
    const config: InternalAxiosRequestConfig = { headers: {} };

    await mockRequestInterceptor.fulfilled(config);

    expect(config.headers).toHaveProperty("Authorization", "Bearer mock-token");
  });

  it("does not add Authorization header when no token in localStorage", async () => {
    mockGetItem.mockReturnValue(null);

    const mockRequestInterceptor = apiClient.interceptors.request.handlers[0];
    const config: InternalAxiosRequestConfig = { headers: {} };

    await mockRequestInterceptor.fulfilled(config);

    expect(config.headers).not.toHaveProperty("Authorization");
  });

  it("passes through successful responses", async () => {
    const mockResponseInterceptor = apiClient.interceptors.response.handlers[0];
    const response = { data: "test" };

    const result = await mockResponseInterceptor.fulfilled(response);
    expect(result).toEqual(response);
  });
});
