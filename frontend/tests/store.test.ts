import { describe, it, expect, beforeEach } from "vitest";
import useAuthStore from "../src/store/useAuthStore";

describe("useAuthStore", () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
  });

  it("has initial state", () => {
    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it("sets token", () => {
    const { setToken } = useAuthStore.getState();
    setToken("test-token");
    const state = useAuthStore.getState();
    expect(state.token).toBe("test-token");
    expect(state.isAuthenticated).toBe(true);
  });

  it("sets user", () => {
    const { setUser } = useAuthStore.getState();
    setUser({ username: "testuser" });
    const state = useAuthStore.getState();
    expect(state.user).toEqual({ username: "testuser" });
  });

  it("clears state on logout", () => {
    const { setToken, setUser, logout } = useAuthStore.getState();
    setToken("test-token");
    setUser({ username: "testuser" });
    logout();
    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});
