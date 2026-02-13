import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter, MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../src/components/ProtectedRoute";

vi.mock("../src/store/useAuthStore", () => ({
  default: vi.fn(),
}));

import useAuthStore from "../src/store/useAuthStore";

describe("ProtectedRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders children when authenticated", async () => {
    vi.mocked(useAuthStore).mockReturnValue({
      isAuthenticated: true,
      isHydrated: true,
    } as ReturnType<typeof useAuthStore>);

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Protected Content")).toBeInTheDocument();
    });
  });

  it("redirects to login when not authenticated", async () => {
    vi.mocked(useAuthStore).mockReturnValue({
      isAuthenticated: false,
      isHydrated: true,
    } as ReturnType<typeof useAuthStore>);

    const { container } = render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>Protected Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(container.innerHTML).toContain("Login Page");
    });
  });

  it("shows loading when hydrating", () => {
    vi.mocked(useAuthStore).mockReturnValue({
      isAuthenticated: false,
      isHydrated: false,
    } as ReturnType<typeof useAuthStore>);

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
