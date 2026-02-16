import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import Signup from "../src/pages/Signup";
import * as authApi from "../src/api/auth";

vi.mock("../src/api/auth");

const mockSignup = authApi.signup as ReturnType<typeof vi.fn>;

describe("Signup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders signup form", () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
  });

  it("shows error when passwords don't match", async () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    await userEvent.type(screen.getByLabelText(/username/i), "testuser");
    await userEvent.type(screen.getByLabelText(/email/i), "test@example.com");
    await userEvent.type(screen.getByLabelText(/^password$/i), "password123");
    await userEvent.type(screen.getByLabelText(/confirm password/i), "differentpassword");
    await userEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
    });
  });

  it("shows error when password is too short", async () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    await userEvent.type(screen.getByLabelText(/username/i), "testuser");
    await userEvent.type(screen.getByLabelText(/email/i), "test@example.com");
    await userEvent.type(screen.getByLabelText(/^password$/i), "short");
    await userEvent.type(screen.getByLabelText(/confirm password/i), "short");
    await userEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText("Password must be at least 6 characters")).toBeInTheDocument();
    });
  });

  it("calls signup API on successful submission", async () => {
    mockSignup.mockResolvedValueOnce({ message: "Check your email" });

    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    await userEvent.type(screen.getByLabelText(/username/i), "newuser");
    await userEvent.type(screen.getByLabelText(/email/i), "newuser@example.com");
    await userEvent.type(screen.getByLabelText(/^password$/i), "password123");
    await userEvent.type(screen.getByLabelText(/confirm password/i), "password123");
    await userEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith({
        username: "newuser",
        email: "newuser@example.com",
        password: "password123",
      });
    });
  });

  it("shows success message after successful signup", async () => {
    mockSignup.mockResolvedValueOnce({ message: "Check your email" });

    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    await userEvent.type(screen.getByLabelText(/username/i), "newuser");
    await userEvent.type(screen.getByLabelText(/email/i), "newuser@example.com");
    await userEvent.type(screen.getByLabelText(/^password$/i), "password123");
    await userEvent.type(screen.getByLabelText(/confirm password/i), "password123");
    await userEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText(/check your email/i)).toBeInTheDocument();
    });
  });

  it("shows error message when signup fails", async () => {
    mockSignup.mockRejectedValueOnce({
      response: { data: { detail: "Username already taken" } },
    });

    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    await userEvent.type(screen.getByLabelText(/username/i), "existinguser");
    await userEvent.type(screen.getByLabelText(/email/i), "existing@example.com");
    await userEvent.type(screen.getByLabelText(/^password$/i), "password123");
    await userEvent.type(screen.getByLabelText(/confirm password/i), "password123");
    await userEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText("Username already taken")).toBeInTheDocument();
    });
  });

  it("shows loading state when submitting", async () => {
    mockSignup.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ message: "Success" }), 100))
    );

    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    await userEvent.type(screen.getByLabelText(/username/i), "newuser");
    await userEvent.type(screen.getByLabelText(/email/i), "newuser@example.com");
    await userEvent.type(screen.getByLabelText(/^password$/i), "password123");
    await userEvent.type(screen.getByLabelText(/confirm password/i), "password123");
    await userEvent.click(screen.getByRole("button", { name: /sign up/i }));

    expect(screen.getByText("Creating account...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /creating account/i })).toBeDisabled();
  });

  it("has link to login page", () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );
    expect(screen.getByRole("link", { name: /sign in/i })).toHaveAttribute("href", "/login");
  });

  it("shows generic error when non-Axios error occurs", async () => {
    mockSignup.mockRejectedValueOnce(new Error("Network error"));

    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    await userEvent.type(screen.getByLabelText(/username/i), "newuser");
    await userEvent.type(screen.getByLabelText(/email/i), "newuser@example.com");
    await userEvent.type(screen.getByLabelText(/^password$/i), "password123");
    await userEvent.type(screen.getByLabelText(/confirm password/i), "password123");
    await userEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText("An error occurred")).toBeInTheDocument();
    });
  });
});
