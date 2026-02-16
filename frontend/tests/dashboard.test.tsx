import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import Dashboard from "../src/pages/Dashboard";
import useAuthStore from "../src/store/useAuthStore";
import * as itemsApi from "../src/api/items";

vi.mock("../src/api/items");
vi.mock("../src/store/useAuthStore", () => ({
  default: vi.fn(),
}));

const mockLogout = vi.fn();
const mockFetchItems = vi.mocked(itemsApi.fetchItems);
const mockCreateItem = vi.mocked(itemsApi.createItem);

type MockAuthStore = ReturnType<typeof useAuthStore>;

describe("Dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchItems.mockResolvedValue([
      { item_id: 1, name: "Test Item", price: 10.0 },
    ]);
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
    await userEvent.click(screen.getByRole("button", { name: /log out/i }));
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

  it("renders items section", async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByText("Items")).toBeInTheDocument();
    });
  });

  it("fetches items on mount", async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(mockFetchItems).toHaveBeenCalled();
    });
  });

  it("displays items when loaded", async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByText("Test Item")).toBeInTheDocument();
    });
  });

  it("can create new item", async () => {
    mockCreateItem.mockResolvedValue({ item_id: 2, name: "New Item", price: 25.0 });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByText("Items")).toBeInTheDocument();
    });

    await userEvent.type(screen.getByLabelText(/name/i), "New Item");
    await userEvent.type(screen.getByLabelText(/price/i), "25");
    await userEvent.click(screen.getByRole("button", { name: /add item/i }));

    await waitFor(() => {
      expect(mockCreateItem).toHaveBeenCalledWith({ name: "New Item", price: 25 });
    });
  });

  it("shows loading spinner initially", () => {
    mockFetchItems.mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("shows empty state when no items", async () => {
    mockFetchItems.mockResolvedValue([]);

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByText("No items yet")).toBeInTheDocument();
    });
  });

  it("displays item price formatted", async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByText("$10.00")).toBeInTheDocument();
    });
  });

  it("handles create item error", async () => {
    mockCreateItem.mockRejectedValue(new Error("Failed to create"));

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByText("Items")).toBeInTheDocument();
    });

    await userEvent.type(screen.getByLabelText(/name/i), "New Item");
    await userEvent.type(screen.getByLabelText(/price/i), "25");
    await userEvent.click(screen.getByRole("button", { name: /add item/i }));

    await waitFor(() => {
      expect(mockCreateItem).toHaveBeenCalled();
    });
  });

  it("handles load items error", async () => {
    mockFetchItems.mockRejectedValue(new Error("Failed to load"));

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(mockFetchItems).toHaveBeenCalled();
    });
  });

  it("renders add item form", async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    });
  });

  it("has add item button", async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /add item/i })).toBeInTheDocument();
    });
  });
});
