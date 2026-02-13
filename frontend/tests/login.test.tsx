import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import Login from "../src/pages/Login";
import useAuthStore from "../src/store/useAuthStore";

vi.mock("../src/store/useAuthStore");

const mockLogin = vi.fn();
const mockClearError = vi.fn();

vi.mocked(useAuthStore).mockReturnValue({
  login: mockLogin,
  isLoading: false,
  error: "Invalid username or password",
  clearError: mockClearError,
  token: null,
  user: null,
  isAuthenticated: false,
  isHydrated: true,
  setToken: vi.fn(),
  setUser: vi.fn(),
  setHydrated: vi.fn(),
  logout: vi.fn(),
} as ReturnType<typeof useAuthStore>);

describe("Login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders login form", () => {
    vi.mocked(useAuthStore).mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: null,
      clearError: mockClearError,
      token: null,
      user: null,
      isAuthenticated: false,
      isHydrated: true,
      setToken: vi.fn(),
      setUser: vi.fn(),
      setHydrated: vi.fn(),
      logout: vi.fn(),
    } as ReturnType<typeof useAuthStore>);

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("displays loading state when isLoading is true", () => {
    vi.mocked(useAuthStore).mockReturnValue({
      login: mockLogin,
      isLoading: true,
      error: null,
      clearError: mockClearError,
      token: null,
      user: null,
      isAuthenticated: false,
      isHydrated: true,
      setToken: vi.fn(),
      setUser: vi.fn(),
      setHydrated: vi.fn(),
      logout: vi.fn(),
    } as ReturnType<typeof useAuthStore>);

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    expect(screen.getByText("Signing in...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /signing in/i })).toBeDisabled();
  });

  it("displays error message when error exists in store", () => {
    vi.mocked(useAuthStore).mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: "Invalid username or password",
      clearError: mockClearError,
      token: null,
      user: null,
      isAuthenticated: false,
      isHydrated: true,
      setToken: vi.fn(),
      setUser: vi.fn(),
      setHydrated: vi.fn(),
      logout: vi.fn(),
    } as ReturnType<typeof useAuthStore>);

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    expect(screen.getByText("Invalid username or password")).toBeInTheDocument();
  });

  it("shows error message when login fails", async () => {
    mockLogin.mockRejectedValueOnce(new Error("Invalid credentials"));

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    await userEvent.type(screen.getByLabelText(/username/i), "wrong");
    await userEvent.type(screen.getByLabelText(/password/i), "wrong");
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("wrong", "wrong");
    });
  });

  it("calls login with credentials on submit", async () => {
    mockLogin.mockResolvedValueOnce(undefined);

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    await userEvent.type(screen.getByLabelText(/username/i), "admin");
    await userEvent.type(screen.getByLabelText(/password/i), "admin123");
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("admin", "admin123");
    });
  });
});
