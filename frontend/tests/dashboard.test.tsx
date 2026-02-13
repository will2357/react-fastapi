import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter, useNavigate } from "react-router-dom";
import Dashboard from "../src/pages/Dashboard";

vi.mock("../src/store/useAuthStore", () => ({
  default: vi.fn(),
}));

import useAuthStore from "../src/store/useAuthStore";

const mockLogout = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(() => vi.fn()),
  };
});

describe("Dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuthStore).mockReturnValue({
      user: { username: "admin" },
      logout: mockLogout,
    } as any);
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
    } as any);

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
