import { describe, it, expect, beforeEach, vi } from "vitest";

const mockSetItem = vi.fn();
const mockGetItem = vi.fn();
const mockRemoveItem = vi.fn();

vi.stubGlobal("localStorage", {
  setItem: mockSetItem,
  getItem: mockGetItem,
  removeItem: mockRemoveItem,
});

vi.stubGlobal("fetch", vi.fn());

describe("useAuthStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetItem.mockReturnValue(null);
  });

  it("sets hydration state when rehydrating", async () => {
    const { default: useAuthStore } = await import("../src/store/useAuthStore");
    const { setHydrated } = useAuthStore.getState();

    setHydrated();
    const state = useAuthStore.getState();

    expect(state.isHydrated).toBe(true);
  });

  it("sets token and updates authentication state", async () => {
    const { default: useAuthStore } = await import("../src/store/useAuthStore");
    const { setToken } = useAuthStore.getState();

    setToken("test-token");
    const state = useAuthStore.getState();

    expect(state.token).toBe("test-token");
    expect(state.isAuthenticated).toBe(true);
  });

  it("clears state on logout", async () => {
    const { default: useAuthStore } = await import("../src/store/useAuthStore");
    const { setToken, setUser, logout } = useAuthStore.getState();

    setToken("test-token");
    setUser({ username: "testuser" });
    logout();

    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(mockRemoveItem).toHaveBeenCalledWith("token");
    expect(mockRemoveItem).toHaveBeenCalledWith("user");
  });

  it("stores token in localStorage on login", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: "mock-token" }),
    } as Response);

    const { default: useAuthStore } = await import("../src/store/useAuthStore");
    const { login } = useAuthStore.getState();

    await login("admin", "admin123");

    expect(mockSetItem).toHaveBeenCalledWith("token", "mock-token");
    expect(mockSetItem).toHaveBeenCalledWith(
      "user",
      JSON.stringify({ username: "admin" })
    );
  });

  it("sets user correctly", async () => {
    const { default: useAuthStore } = await import("../src/store/useAuthStore");
    const { setUser } = useAuthStore.getState();

    setUser({ username: "testuser" });
    const state = useAuthStore.getState();

    expect(state.user).toEqual({ username: "testuser" });
  });

  it("clears error", async () => {
    const { default: useAuthStore } = await import("../src/store/useAuthStore");
    const { clearError } = useAuthStore.getState();

    clearError();
    const state = useAuthStore.getState();

    expect(state.error).toBeNull();
  });

  it("throws error and sets error message on failed login (non-ok response)", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 401,
    } as Response);

    const { default: useAuthStore } = await import("../src/store/useAuthStore");
    const { login } = useAuthStore.getState();

    await expect(login("admin", "wrongpassword")).rejects.toThrow("Invalid username or password");

    const state = useAuthStore.getState();
    expect(state.error).toBe("Invalid username or password");
    expect(state.isLoading).toBe(false);
  });

  it("throws error and sets error message on network failure", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("Network error"));

    const { default: useAuthStore } = await import("../src/store/useAuthStore");
    const { login } = useAuthStore.getState();

    await expect(login("admin", "admin123")).rejects.toThrow("Network error");

    const state = useAuthStore.getState();
    expect(state.error).toBe("Network error");
    expect(state.isLoading).toBe(false);
  });

  it("sets generic error message on non-Error exception", async () => {
    vi.mocked(fetch).mockRejectedValueOnce("string error");

    const { default: useAuthStore } = await import("../src/store/useAuthStore");
    const { login } = useAuthStore.getState();

    await expect(login("admin", "admin123")).rejects.toEqual("string error");

    const state = useAuthStore.getState();
    expect(state.error).toBe("Login failed");
    expect(state.isLoading).toBe(false);
  });
});
