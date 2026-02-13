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
});
