import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import ConfirmSignup from "../src/pages/ConfirmSignup";
import apiClient from "../src/api/client";

vi.mock("../src/api/client");

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("ConfirmSignup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
  });

  it("shows loading state initially", async () => {
    const mockGet = vi.mocked(apiClient.get);
    mockGet.mockImplementation(
      () => new Promise(() => {}) // Never resolves to keep loading
    );

    render(
      <MemoryRouter initialEntries={["/confirm-signup?token=abc123"]}>
        <ConfirmSignup />
      </MemoryRouter>
    );

    expect(screen.getByText("Confirming...")).toBeInTheDocument();
    expect(screen.getByText("Please wait while we confirm your account")).toBeInTheDocument();
  });

  it("shows error when token is missing", async () => {
    render(
      <MemoryRouter initialEntries={["/confirm-signup"]}>
        <ConfirmSignup />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Confirmation Failed")).toBeInTheDocument();
    });
    expect(screen.getByText("Invalid confirmation link")).toBeInTheDocument();
  });

  it("shows error when API call fails", async () => {
    const mockGet = vi.mocked(apiClient.get);
    mockGet.mockRejectedValue({
      isAxiosError: true,
      response: {
        status: 400,
        data: {
          detail: "Invalid or expired token",
        },
      },
    });

    render(
      <MemoryRouter initialEntries={["/confirm-signup?token=invalid"]}>
        <ConfirmSignup />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Confirmation Failed")).toBeInTheDocument();
    });
    expect(screen.getByText("Invalid or expired token")).toBeInTheDocument();
  });

  it("shows success when confirmation succeeds", async () => {
    const mockGet = vi.mocked(apiClient.get);
    mockGet.mockResolvedValue({});

    render(
      <MemoryRouter initialEntries={["/confirm-signup?token=validtoken"]}>
        <ConfirmSignup />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login?confirmed=true");
    });
  });

  it("navigates to signup when clicking sign up again button", async () => {
    const mockGet = vi.mocked(apiClient.get);
    mockGet.mockRejectedValue(new Error("Error"));

    render(
      <MemoryRouter initialEntries={["/confirm-signup?token=invalid"]}>
        <ConfirmSignup />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Sign up again")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText("Sign up again"));
    expect(mockNavigate).toHaveBeenCalledWith("/signup");
  });

  it("navigates to login with confirmed param on success", async () => {
    const mockGet = vi.mocked(apiClient.get);
    mockGet.mockResolvedValue({});

    render(
      <MemoryRouter initialEntries={["/confirm-signup?token=validtoken"]}>
        <ConfirmSignup />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login?confirmed=true");
    });
  });

  it("handles already confirmed user gracefully", async () => {
    const mockGet = vi.mocked(apiClient.get);
    mockGet.mockResolvedValue({ message: "Account already confirmed" });

    render(
      <MemoryRouter initialEntries={["/confirm-signup?token=already-used-token"]}>
        <ConfirmSignup />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login?confirmed=true");
    });
  });
});
