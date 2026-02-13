import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import Dashboard from "../src/pages/Dashboard";
import useAuthStore from "../src/store/useAuthStore";

const mockLogout = vi.fn();

vi.mock("../src/store/useAuthStore", () => ({
  default: vi.fn(),
}));

type MockAuthStore = ReturnType<typeof useAuthStore>;

describe("Dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuthStore).mockReturnValue({
      user: { username: "admin" },
      logout: mockLogout,
    } as MockAuthStore);
  });

  it("renders welcome message with username", () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(screen.getByText(/welcome, admin/i)).toBeInTheDocument();
  });

  it("renders dashboard title", () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("renders user username in navbar", () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: { username: "testuser" },
      logout: mockLogout,
    } as MockAuthStore);

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(screen.getByText("testuser")).toBeInTheDocument();
  });

  it("calls logout when logout button clicked", async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    await userEvent.click(screen.getByRole("button", { name: /logout/i }));

    expect(mockLogout).toHaveBeenCalled();
  });

  it("renders protected content message", () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(screen.getByText(/protected content/i)).toBeInTheDocument();
  });
});
